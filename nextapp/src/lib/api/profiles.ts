import {
  ProfileWithBasicTeams,
  ProfileWithDetailedTeams,
  ProfileWithFullTeams,
  ProfilesFromUserTeams,
  ProfilesByTeam,
} from "@/src/shared/entities/profile.types";

export async function getProfileByUuid(
  uuid: string
): Promise<ProfileWithFullTeams | null> {
  if (!uuid) return null;

  const response = await fetch(`/api/cms/profiles/${uuid}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch profile: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function getProfilesByUuids(
  uuids: string[]
): Promise<ProfileWithFullTeams[]> {
  if (!uuids.length) return [];

  const response = await fetch("/api/cms/profiles/batch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uuids }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch profiles: ${response.status} ${response.statusText}`
    );
  }

  const profiles = await response.json();
  return profiles || [];
}

export async function getProfilesByTeamId(
  teamId: string
): Promise<ProfileWithBasicTeams[]> {
  if (!teamId) return [];

  try {
    const response = await fetch(`/api/cms/profiles/team/${teamId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const profiles = await response.json();
    return profiles || [];
  } catch (error) {
    console.error("Failed to fetch profiles by team ID:", error);
    throw new Error(`Unable to fetch profiles for team: ${teamId}`);
  }
}

export async function getAllProfilesGroupedByTeam(): Promise<ProfilesByTeam> {
  try {
    const response = await fetch("/api/cms/profiles/grouped");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result || { teams: {} };
  } catch (error) {
    console.error("Failed to fetch grouped profiles:", error);
    throw new Error("Unable to fetch grouped profiles");
  }
}

export async function getTeammateProfiles(
  excludeUuid: string
): Promise<ProfileWithBasicTeams[]> {
  if (!excludeUuid) return [];

  try {
    const response = await fetch(`/api/cms/profiles/teammates/${excludeUuid}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const profiles = await response.json();
    return profiles || [];
  } catch (error) {
    console.error("Failed to fetch teammate profiles:", error);
    throw new Error(`Unable to fetch teammates for profile: ${excludeUuid}`);
  }
}

export async function getProfilesFromUserTeams(
  userEmail: string,
  userTeamSlugs: string[]
): Promise<ProfilesFromUserTeams | null> {
  if (!userEmail || !userTeamSlugs.length) return null;

  try {
    const response = await fetch("/api/cms/profiles/user-teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userEmail, userTeamSlugs }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const profiles = await response.json();
    return profiles || null;
  } catch (error) {
    console.error("Failed to fetch profiles from user teams:", error);
    throw new Error(`Unable to fetch profiles for user: ${userEmail}`);
  }
}

export async function getAllProfiles(): Promise<ProfileWithDetailedTeams[]> {
  const profiles: ProfileWithDetailedTeams[] = [];
  let cursor: string | null = null;
  do {
    const searchParams = new URLSearchParams({ limit: "100" });
    if (cursor) searchParams.set("cursor", cursor);
    const response = await fetch(`/api/cms/profiles?${searchParams}`);
    if (!response.ok) throw new Error(`Failed to fetch profiles: ${response.status} ${response.statusText}`);
    const page = await response.json();
    profiles.push(...(page.data ?? []));
    cursor = page.nextCursor;
    if (!page.hasMore) break;
  } while (cursor);
  return profiles;
}

export async function getTeamProfiles(
  teamSlug: string
): Promise<ProfilesFromUserTeams | null> {
  if (!teamSlug) return null;

  const response = await fetch(
    `/api/cms/profiles/team-profiles/${encodeURIComponent(teamSlug)}`
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized - please log in");
    }
    if (response.status === 403) {
      throw new Error("Forbidden - you do not have access to this team");
    }
    throw new Error(
      `Failed to fetch team profiles: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
