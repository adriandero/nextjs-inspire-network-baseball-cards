import { mock } from "node:test";
import { evaluate, parse } from "groq-js";

export type TestSession = {
  user: { email: string; name?: string };
};

export type TestTeam = {
  _id: string;
  name: string;
  slug: string;
  groups?: "client" | "egf" | "prospect";
};

export type TestProfile = {
  _id: string;
  _type: "profile";
  name: string;
  uuid: string;
  slug: string;
  jobRole?: string;
  team: TestTeam[];
};

export type TestUser = {
  _id: string;
  email: string;
  permission: "Admin" | "User";
  profile?: { name: string; uuid: string; slug: string; jobRole?: string };
  team: TestTeam[];
};

export type TestData = {
  users: TestUser[];
  teams: TestTeam[];
  profiles: TestProfile[];
  documents?: Array<Record<string, unknown> & { _id: string; _type: string }>;
};

const sessionState: { value: TestSession | null } = { value: null };
let data: TestData = { users: [], teams: [], profiles: [] };

function projectTeam(team: TestTeam) {
  return {
    _id: team._id,
    _type: "team",
    name: team.name,
    slug: team.slug,
    groups: team.groups ?? [],
  };
}

function projectProfile(profile: TestProfile) {
  return {
    _id: profile._id,
    _type: "profile",
    name: profile.name,
    uuid: profile.uuid,
    slug: profile.slug,
    jobRole: profile.jobRole,
    teams: profile.team.map(projectTeam),
  };
}

let datastoreError: Error | null = null;
export function setTestDatastoreError(error: Error | null) {
  datastoreError = error;
}

const fakeClient = {
  async create(
    document: Record<string, unknown> & { _id: string; _type: string },
  ) {
    if (datastoreError) throw datastoreError;
    data.documents ??= [];
    data.documents.push(structuredClone(document));
    return structuredClone(document);
  },
  async fetch<T>(
    query: string,
    params: Record<string, unknown> = {},
  ): Promise<T> {
    if (datastoreError) throw datastoreError;
    if (query.includes('_type == "deckSelection"')) {
      return (data.documents?.find((document) => document._id === params.id) ??
        null) as T;
    }
    if (query.includes("uuid in $uuids")) {
      const ids = new Set(params.uuids as string[]);
      return data.profiles
        .filter((profile) => ids.has(profile.uuid))
        .map((profile) => ({
          ...profile,
          team: profile.team.map(projectTeam),
        })) as T;
    }
    if (
      query.includes('"teams": *[_type == "team"') &&
      query.includes("references(^._id)")
    ) {
      return {
        teams: data.teams.map((team) => ({
          slug: team.slug,
          name: team.name,
          profiles: data.profiles
            .filter((profile) =>
              profile.team.some(
                (profileTeam) => profileTeam.slug === team.slug,
              ),
            )
            .map((profile) => ({
              _id: profile._id,
              _type: profile._type,
              name: profile.name,
              uuid: profile.uuid,
              slug: profile.slug,
              jobRole: profile.jobRole,
            })),
        })),
      } as T;
    }

    if (query.includes('"pageSize"') || params.pageSize) {
      const pageSize = Number(params.pageSize);
      const cursor = params.cursor as string | undefined;
      if (query.includes('_type == "profile"')) {
        // Execute the production query against Sanity-shaped local documents.
        // This catches filtering/order/slicing mistakes instead of reproducing them in a fake.
        const dataset = [
          ...data.teams.map((team) => ({
            ...team,
            _type: "team",
            slug: { current: team.slug },
          })),
          ...data.profiles.map((profile) => ({
            ...profile,
            slug: { current: profile.slug },
            team: profile.team.map((team) => ({
              _type: "reference",
              _ref: team._id,
            })),
          })),
        ];
        return (await (
          await evaluate(parse(query, { params }), { dataset, params })
        ).get()) as T;
      }
      const sortedTeams = data.teams
        .slice()
        .sort((a, b) => a._id.localeCompare(b._id));
      const teamAfter = cursor
        ? sortedTeams.findIndex((team) => team._id === cursor) + 1
        : 0;
      return sortedTeams.slice(teamAfter, teamAfter + pageSize) as T;
    }

    if (query.includes("slug.current == $slug")) {
      return (data.teams.find((team) => team.slug === params.slug) ??
        null) as T;
    }

    if (query.includes("$userEmail") && query.includes("defaultTeam")) {
      const user = data.users.find(
        (candidate) => candidate.email === params.userEmail,
      );
      const profileTeams = user?.profile
        ? (data.profiles.find((profile) => profile.uuid === user.profile?.uuid)
            ?.team ?? [])
        : [];
      const defaultTeam =
        data.teams.find((team) => team.slug === "inspire-network") ?? null;
      return {
        directTeams: user?.team ?? [],
        profileTeams,
        defaultTeam,
      } as T;
    }

    if (query.includes("$userEmail") && query.includes('"teams"')) {
      const requestedSlugs =
        (params.userTeamSlugs as string[] | undefined) ?? [];
      const allowedSlugs = new Set(requestedSlugs);
      return {
        profiles: data.profiles
          .filter((profile) =>
            profile.team.some((team) => allowedSlugs.has(team.slug)),
          )
          .map(projectProfile),
      } as T;
    }

    if (query.includes('_type == "user"') && query.includes("$userEmail")) {
      const user = data.users.find(
        (candidate) => candidate.email === params.userEmail,
      );
      return (user ? { ...user } : null) as T;
    }

    throw new Error(`Unhandled test datastore query: ${query.slice(0, 120)}`);
  },
};

export function arrangeTestData(nextData: TestData): void {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Integration tests cannot run with NODE_ENV=production");
  }
  data = structuredClone(nextData);
}

export function setTestSession(session: TestSession | null): void {
  sessionState.value = session;
}

export function readTestData(): TestData {
  return structuredClone(data);
}

export function resetTestBoundaries(): void {
  data = { users: [], teams: [], profiles: [] };
  sessionState.value = null;
  datastoreError = null;
}

export function installExternalBoundaryFakes(): void {
  mock.module("@auth0/nextjs-auth0/server", {
    namedExports: {
      Auth0Client: class {
        async getSession() {
          return sessionState.value;
        }
      },
    },
  });

  mock.module("@sanity/client", {
    namedExports: { createClient: () => fakeClient },
  });

  mock.module("@sanity/image-url", {
    defaultExport: () => ({ image: () => ({}) }),
  });
}
