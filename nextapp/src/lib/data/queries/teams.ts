import {
  TeamWithDetails,
  TeamWithPopulatedCompany,
  UserTeamsResponse,
} from "@/src/shared/entities/team.types";
import { UserSanity } from "@/src/shared/entities/user.types";
import { client } from "@/src/lib/sanity/client";
import { CursorPage } from "@/src/shared/entities/pagination.types";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, toCursorPage } from "@/src/lib/data/pagination";

export async function getTeamsForUser(
  userProfileData: UserSanity,
): Promise<TeamWithPopulatedCompany[]> {
  if (userProfileData.permission === "Admin") {
    return getAllTeams();
  }

  const userTeams = await getUserTeams(userProfileData.email);
  return userTeams?.teams || [];
}

export async function getAllTeams(): Promise<TeamWithPopulatedCompany[]> {
  const teams: TeamWithPopulatedCompany[] = [];
  let cursor: string | null = null;
  do {
    const page = await getTeamsPage(100, cursor);
    teams.push(...page.data);
    cursor = page.nextCursor;
    if (!page.hasMore) break;
  } while (cursor);
  return teams;
}

export async function getTeamsPage(
  limit: number,
  cursor: string | null,
): Promise<CursorPage<TeamWithPopulatedCompany>> {
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE) {
    throw new Error(`limit must be an integer between 1 and ${MAX_PAGE_SIZE}`);
  }
  const query = `*[ _type == "team" && !(_id in path('drafts.**'))] {
    _id,
    name,    
    _type,
    _rev,              
    _createdAt,        
    _updatedAt,     
    "slug": slug.current,
    teamLogo {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      }
    },
    "company": company->{
      name,
      "slug": slug.current
    },
    isameriprise,
    groups
  }`;

  const paginatedQuery = query.replace(
    `*[ _type == "team" && !(_id in path('drafts.**'))]`,
    `*[ _type == "team" && !(_id in path('drafts.**')) ${cursor ? "&& _id > $cursor" : ""}] | order(_id asc) [0...$pageSize]`,
  );
  const options = { next: { revalidate: 30 } };

  try {
    const teams = await client.fetch<TeamWithPopulatedCompany[]>(
      paginatedQuery,
      { pageSize: limit + 1, ...(cursor ? { cursor } : {}) },
      options,
    );
    const page = teams || [];
    return toCursorPage(page, limit);
  } catch (error) {
    console.error("Failed to fetch all teams:", error);
    throw new Error("Unable to fetch teams");
  }
}

export async function getTeamBySlug(
  slug: string,
): Promise<TeamWithDetails | null> {
  if (!slug) return null;

  const query = `*[ _type == "team" && slug.current == $slug && !(_id in path('drafts.**'))][0] {
    _id,
    _type,
    name,
    "slug": slug.current,
    teamLogo {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      }
    },
    company->{
      _id,
      _type,
      name,
      "slug": slug.current,
      companyLogo {
        asset->{
          _id,
          url
        }
      }
    },
    isameriprise,
    groups,
    _createdAt,
    _updatedAt,
    _rev
  }`;

  const options = { next: { revalidate: 30 } };

  try {
    const team = await client.fetch<TeamWithDetails>(query, { slug }, options);
    return team || null;
  } catch (error) {
    console.error("Failed to fetch team by slug:", error);
    throw new Error(`Unable to fetch team with slug: ${slug}`);
  }
}

// TODO: move this to data/users.ts
export async function getUserTeams(
  userEmail: string,
): Promise<UserTeamsResponse | null> {
  if (!userEmail) return null;

  const query = `
    *[_type == "user" && email == $userEmail && !(_id in path('drafts.**'))][0] {
      "directTeams": coalesce(team[]-> {
        _id,    
        _type,
        name,
        "slug": slug.current,
        "company": company->{
          name,
          "slug": slug.current
        },
        isameriprise,
        groups
      }, []),
      "profileTeams": coalesce(profile->team[]-> {
        _id,    
        _type,
        name,
        "slug": slug.current,
        "company": company->{
          name,
          "slug": slug.current
        },
        isameriprise,
        groups
      }, []),
      "defaultTeam": *[_type == "team" && slug.current == "inspire-network" && !(_id in path('drafts.**'))][0] {
        _id,    
        _type,
        name,
        "slug": slug.current,
        "company": company->{
          name,
          "slug": slug.current
        },
        isameriprise,
        groups
      }
    }
  `;

  const options = { next: { revalidate: 30 } };

  try {
    const data = await client.fetch<{
      directTeams: TeamWithPopulatedCompany[];
      profileTeams: TeamWithPopulatedCompany[];
      defaultTeam: TeamWithPopulatedCompany | null;
    }>(query, { userEmail }, options);

    if (!data) return null;

    // Add some debugging to see what's happening
    // console.log("Query result:", {
    //   directTeams: data.directTeams?.length || 0,
    //   profileTeams: data.profileTeams?.length || 0,
    //   defaultTeam: data.defaultTeam ? "found" : "not found",
    // });

    // Fast deduplication using Map for O(n) performance
    const teamMap = new Map<string, TeamWithPopulatedCompany>();

    // Add default team first (if it exists)
    if (data.defaultTeam) {
      teamMap.set(data.defaultTeam._id, data.defaultTeam);
    }

    // Add direct teams
    data.directTeams?.forEach((team) => teamMap.set(team._id, team));

    // Add profile teams
    data.profileTeams?.forEach((team) => teamMap.set(team._id, team));

    // Convert back to sorted array
    const teams = Array.from(teamMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    return { teams };
  } catch (error) {
    console.error("Failed to fetch user teams:", error);
    throw new Error(`Unable to fetch teams for user: ${userEmail}`);
  }
}
