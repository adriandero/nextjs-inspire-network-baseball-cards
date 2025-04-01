import { type SanityDocument } from "next-sanity";

import { client } from "@/lib/sanity/client";

export async function getProfileByUuid(uuid: string): Promise<SanityDocument> {
  const query = `*[ _type == "profile" && uuid == $uuid && !(_id in path('drafts.**'))][0]{
  ...,
  profileImage {
    asset->{url}
  },
  "team": team[]->{
      name,
      slug,
      isameriprise,
      "company": company->{
        ...,
        companyLogo {
          asset->{
            url, 
            metadata {
              dimensions {
                width,
                height
              }
            }
          }
        }
      }
    }
  }
  `;
  const options = { next: { revalidate: 30 } };

  const profile = await client.fetch<SanityDocument>(query, { uuid }, options);

  return profile;
}

export async function getProfilesByTeamsWithoutSpecifiedProfile(
  uuid: string
): Promise<SanityDocument[]> {
  const query = `

  *[_type == "profile" && uuid == $uuid && !(_id in path('drafts.**'))][0] {
    "teamSlug": team[]->slug.current
  } {
  "profile": *[_type == "profile" && !(_id in path("drafts.**")) && count((team[]->slug.current)[@ in ^.^.teamSlug]) > 0 ] {
      name,
      uuid,
      "slug": slug.current,
      jobRole,
      profileImage {
        asset->{url}
      },
      "teams": team[]-> | order(name asc) {
        _id,
        name,
        "slug": slug.current
      }
    }
  }.profile
  `;

  const options = { next: { revalidate: 30 } };

  const profiles = await client.fetch<SanityDocument[]>(
    query,
    { uuid },
    options
  );

  return profiles;
}

export async function getProfilesByTeamId(
  teamId: string
): Promise<SanityDocument[]> {
  const query = `
  *[_type == "profile" && !(_id in path("drafts.**")) && $teamId in team[]->_id] {
    name,
    "slug": slug.current,
    jobRole,
    profileImage {
      asset->{url}
    },
    "teams": team[]-> | order(name asc) {
      _id,
      name,
      "slug": slug.current
    }
  }
  `;

  const options = { next: { revalidate: 30 } };

  const profiles = await client.fetch<SanityDocument[]>(
    query,
    { teamId },
    options
  );

  return profiles;
}

export interface ProfilesFromUserTeams {
  teamProfiles: SanityDocument[];
}

export async function getProfilesFromUserTeams(
  userEmail: string | undefined,
  userTeamSlugs: unknown
): Promise<ProfilesFromUserTeams> {
  const query = `
  *[_type == "user" && email == $userEmail && !(_id in path('drafts.**'))][0] {
    "teamProfiles": *[_type == "profile" && count((team[]->slug.current)[@ in $userTeamSlugs]) > 0] {
      name,
      uuid,
      "slug": slug.current,
      jobRole,
      profileImage {
        asset->{url}
      },
      "teams": team[]-> | order(name asc) {
        name,
        slug,
        "company": company->{
          name,
          slug
        }
      }
    }
  }
`;
  const options = { next: { revalidate: 30 } };
  const profiles = await client.fetch<ProfilesFromUserTeams>(
    query,
    { userEmail, userTeamSlugs },
    options
  );
  return profiles;
}
export interface TeamsFromUser {
  teams: SanityDocument[];
}

export async function getUserTeams(
  userEmail: string | undefined
): Promise<TeamsFromUser> {
  const query = `
  *[_type == "user" && email == $userEmail && !(_id in path('drafts.**'))][0] {
    "teams": team[]-> | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      "company": company->{
        name,
        "slug": slug.current
      }
    }
  }
`;
  const options = { next: { revalidate: 30 } };
  const userTeams = await client.fetch<TeamsFromUser>(
    query,
    { userEmail },
    options
  );
  return userTeams;
}

export async function getAllProfiles(): Promise<SanityDocument[]> {
  const query = `*[ _type == "profile" && !(_id in path('drafts.**'))] {
    name,
    "slug":slug.current,
    jobRole,
    profileImage {
      asset->{url}
    },
    "teams": team[]-> | order(name asc) {
      name,
      slug,
      "company": company->{
          name,
          slug
      }
    }
  }`;

  const options = { next: { revalidate: 30 } };
  const posts = await client.fetch<SanityDocument[]>(query, {}, options);

  return posts;
}

export async function getAllTeams(): Promise<SanityDocument[]> {
  const query = `*[ _type == "team" && !(_id in path('drafts.**'))] {
    ...,
    "slug":slug.current,
  }`;

  const options = { next: { revalidate: 30 } };
  const posts = await client.fetch<SanityDocument[]>(query, {}, options);

  return posts;
}

export async function getTeamBySlug(
  slug: string
): Promise<SanityDocument | null> {
  const query = `*[ _type == "team" && slug.current == $slug && !(_id in path('drafts.**'))][0] {
    ...,
    "slug": slug.current,
  }`;

  const options = { next: { revalidate: 30 } };
  const team = await client.fetch<SanityDocument | null>(
    query,
    { slug },
    options
  );

  return team;
}
