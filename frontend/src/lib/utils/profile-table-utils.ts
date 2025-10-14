import { ProfileIdentifierTable } from "@/src/features/deck-builder/entities/profile-identifier-table.model";
import { Profile } from "@/src/lib/entities/profile";
import { ProfileTable } from "@/src/features/deck-builder/entities/profile-table.model";
import { getProfilesByUuids } from "@/src/lib/data/profiles";

export function parseProfileTablesFromURL(
  paramString: string,
): ProfileIdentifierTable[] {
  if (!paramString) return [];

  return paramString.split(";").map((groupString) => {
    const [nameEncoded, id, profilesString] = groupString.split(":");
    return {
      id,
      name: decodeURIComponent(nameEncoded),
      profiles: profilesString ? profilesString.split(",") : [],
    };
  });
}

export function addProfileToTable(
  table: ProfileIdentifierTable,
  profileId: string,
): ProfileIdentifierTable {
  if (table.profiles.includes(profileId)) {
    return table;
  }

  return {
    ...table,
    profiles: [...table.profiles, profileId],
  };
}

export function removeProfileFromTable(
  table: ProfileIdentifierTable,
  profileId: string,
): ProfileIdentifierTable {
  return {
    ...table,
    profiles: table.profiles.filter((id) => id !== profileId),
  };
}

export function toggleProfileInTable(
  table: ProfileIdentifierTable,
  profileId: string,
): ProfileIdentifierTable {
  const hasProfile = table.profiles.includes(profileId);
  return hasProfile
    ? removeProfileFromTable(table, profileId)
    : addProfileToTable(table, profileId);
}

/**
 * Transforms profile names to show first name + last initial
 * e.g., "John Smith" becomes "John S."
 */
export function shortNamesOfProfiles(profiles: Profile[]) {
  return profiles.map((profile) => {
    const nameParts = profile.name.split(" ");

    if (nameParts.length === 1) {
      // Handle single names
      return profile;
    }

    const firstName = nameParts.slice(0, -1).join(" ");
    const lastInitial = nameParts[nameParts.length - 1][0] + ".";
    const transformedName = `${firstName} ${lastInitial}`;

    return {
      ...profile,
      name: transformedName,
    };
  });
}


export async function fetchProfileTables(
  groupedProfiles: string | null
): Promise<{
  completeProfileTables: ProfileTable[];
  error: string | null;
}> {
  let completeProfileTables: ProfileTable[] = [];
  let error: string | null = null;

  if (groupedProfiles) {
    try {
      const tables = parseProfileTablesFromURL(groupedProfiles);
      completeProfileTables = await Promise.all(
        tables.map(async (group) => {
          if (group.profiles.length === 0) {
            return { ...group, profiles: [] };
          }
          const profileObjects = await getProfilesByUuids(group.profiles);
          return { ...group, profiles: profileObjects };
        })
      );
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load profile data";
    }
  }

  return { completeProfileTables, error };
}
