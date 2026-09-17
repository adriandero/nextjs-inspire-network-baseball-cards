import {
  TeamWithDetails,
  TeamWithPopulatedCompany,
  UserTeamsResponse,
} from "@/src/shared/entities/team.types";
import { CursorPage } from "@/src/shared/entities/pagination.types";

export async function getTeamsForUser(): Promise<TeamWithPopulatedCompany[]> {
  const response = await fetch("/api/cms/teams/for-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({}),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized - please log in");
    }
    throw new Error(
      `Failed to fetch teams for user: ${response.status} ${response.statusText}`
    );
  }

  const teams = await response.json();
  return teams || [];
}

export async function getTeamsForUserPage(
  cursor: string | null = null,
  limit = 50,
): Promise<CursorPage<TeamWithPopulatedCompany>> {
  const response = await fetch("/api/cms/teams/for-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cursor, limit }),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch teams for user: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getAllTeams(): Promise<TeamWithPopulatedCompany[]> {
  const teams: TeamWithPopulatedCompany[] = [];
  let cursor: string | null = null;
  do {
    const searchParams = new URLSearchParams({ limit: "100" });
    if (cursor) searchParams.set("cursor", cursor);
    const response = await fetch(`/api/cms/teams/all?${searchParams}`);
    if (!response.ok) {
      if (response.status === 401) throw new Error("Unauthorized - please log in");
      if (response.status === 403) throw new Error("Forbidden - admin access required");
      throw new Error(`Failed to fetch all teams: ${response.status} ${response.statusText}`);
    }
    const page = await response.json();
    teams.push(...(page.data ?? []));
    cursor = page.nextCursor;
    if (!page.hasMore) break;
  } while (cursor);
  return teams;
}

export async function getTeamBySlug(
  slug: string
): Promise<TeamWithDetails | null> {
  if (!slug) return null;

  const response = await fetch(`/api/cms/teams/${encodeURIComponent(slug)}`);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized - please log in");
    }
    if (response.status === 403) {
      throw new Error("Forbidden - you do not have access to this team");
    }
    if (response.status === 404) {
      return null;
    }
    throw new Error(
      `Failed to fetch team by slug: ${response.status} ${response.statusText}`
    );
  }

  const team = await response.json();
  return team;
}

export async function getUserTeams(
  userEmail: string
): Promise<UserTeamsResponse | null> {
  if (!userEmail) return null;

  const response = await fetch(
    `/api/cms/teams/user/${encodeURIComponent(userEmail)}`
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized - please log in");
    }
    if (response.status === 403) {
      throw new Error("Forbidden - you can only access your own teams");
    }
    throw new Error(
      `Failed to fetch user teams: ${response.status} ${response.statusText}`
    );
  }

  const userTeams = await response.json();
  return userTeams;
}
