import { randomUUID } from "node:crypto";
import { z } from "zod";
import { client, writeClient } from "@/src/lib/sanity/client";
import { getAuthorizedUser } from "@/src/lib/auth/permissions";
import { getUserTeams } from "@/src/lib/data/queries/teams";
import { getProfilesByUuids } from "@/src/lib/data/queries/profiles";
import { parseProfileTablesFromURL } from "@/src/lib/utils/profile-table-utils";
import type { UserSanity } from "@/src/shared/entities/user.types";
import type { ProfileIdentifierTable } from "@/src/features/deck-builder/entities/profile-identifier-table.model";
import type { ProfileTable } from "@/src/features/deck-builder/entities/profile-table.model";

const tablesSchema = z
  .array(
    z.object({
      id: z.string().min(1).max(128),
      name: z.string().min(1).max(200),
      profiles: z.array(z.string().min(1).max(128)).min(1).max(10000),
    }),
  )
  .min(1)
  .max(200)
  .refine(
    (tables) =>
      tables.reduce((count, table) => count + table.profiles.length, 0) <=
      10000,
    "A selection can contain at most 10,000 profile entries",
  )
  .refine(
    (tables) => new Set(tables.map((table) => table.id)).size === tables.length,
    "Group IDs must be unique",
  );

export class SelectionError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export function validateSelection(tables: unknown): ProfileIdentifierTable[] {
  const result = tablesSchema.safeParse(tables);
  if (!result.success)
    throw new SelectionError(
      "Invalid selection: " + result.error.issues[0].message,
      400,
    );
  return result.data;
}

export async function requireSelectionUser() {
  const user = await getAuthorizedUser();
  if (!user) throw new SelectionError("Authentication required", 401);
  return user;
}

async function readSelection(id: string): Promise<ProfileIdentifierTable[]> {
  if (!z.string().uuid().safeParse(id).success)
    throw new SelectionError("Invalid selection ID", 400);
  const document = await client.fetch<{
    tables: ProfileIdentifierTable[];
  } | null>(
    '*[_type == "deckSelection" && _id == $id][0]{tables}',
    { id: `deckSelection.${id}` },
    { cache: "no-store" },
  );
  if (!document)
    throw new SelectionError("This selection could not be found", 404);
  return validateSelection(document.tables);
}

// Resolve membership once for the whole selection, including the user's own profile.
// Shared links use the reader's current permissions, never the creator's permissions.
export async function accessibleProfileTables(
  tables: ProfileIdentifierTable[],
  user: UserSanity,
) {
  const uuids = [...new Set(tables.flatMap((table) => table.profiles))];
  const profiles = await getProfilesByUuids(uuids);
  const isAdmin = user.permission === "Admin";
  const teams = isAdmin ? [] : ((await getUserTeams(user.email))?.teams ?? []);
  const slugs = new Set(teams.map((team) => team.slug));
  const accessible = profiles.filter(
    (profile) =>
      isAdmin ||
      (Boolean(user.profile?.slug) && user.profile?.slug === profile.slug) ||
      profile.team?.some((team) => slugs.has(team.slug)),
  );
  const byUuid = new Map(accessible.map((profile) => [profile.uuid, profile]));
  return tables
    .map((table) => ({
      id: table.id,
      name: table.name,
      profiles: table.profiles.flatMap((uuid) => {
        const profile = byUuid.get(uuid);
        return profile ? [profile] : [];
      }),
    }))
    .filter((table) => table.profiles.length > 0);
}

export async function saveSelection(
  input: unknown,
  user: UserSanity,
): Promise<string> {
  const tables = validateSelection(input);
  const accessible = await accessibleProfileTables(tables, user);
  const allowed = new Set(
    accessible.flatMap((table) =>
      table.profiles.map((profile) => profile.uuid),
    ),
  );
  if (
    tables.some((table) => table.profiles.some((uuid) => !allowed.has(uuid)))
  ) {
    throw new SelectionError(
      "Some selected profiles are unavailable or you do not have access to them",
      403,
    );
  }
  const id = randomUUID();
  await writeClient.create({
    _id: `deckSelection.${id}`,
    _type: "deckSelection",
    tables: tables.map((table, index) => ({
      ...table,
      _key: `group-${index}`,
    })),
  });
  return id;
}

export async function getSelectionProfileTables(id: string, user: UserSanity) {
  const tables = await accessibleProfileTables(await readSelection(id), user);
  if (!tables.length)
    throw new SelectionError(
      "You do not have access to any profiles in this selection",
      403,
    );
  return tables;
}

export function selectionErrorResponse(error: unknown) {
  if (error instanceof SelectionError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof SyntaxError)
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  console.error("Deckbuilder request failed:", error);
  return Response.json(
    { error: "Unable to load or save the comparison. Please try again." },
    { status: 500 },
  );
}

export async function fetchProfileTables(
  groupedProfiles: string | null,
  selection?: string,
): Promise<{
  completeProfileTables: ProfileTable[];
  error: string | null;
}> {
  try {
    const user = await requireSelectionUser();
    const completeProfileTables = selection
      ? await getSelectionProfileTables(selection, user)
      : groupedProfiles
        ? await accessibleProfileTables(
            validateSelection(parseProfileTablesFromURL(groupedProfiles)),
            user,
          )
        : [];
    return { completeProfileTables, error: null };
  } catch (error) {
    return {
      completeProfileTables: [],
      error: error instanceof Error ? error.message : "Unable to load profiles",
    };
  }
}
