import { type SanityDocument } from "next-sanity";

import { client } from "@/lib/sanity/client";

export async function getAllProfilesDashboardRowData(): Promise<
  SanityDocument[]
> {
  const query = `*[ _type == "profile"] {
    name,
    "slug":slug.current,
    jobRole,
    profileImage {
      asset->{url}
    },
    "team": team->{
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

export async function getProfileBySlug(slug: string): Promise<SanityDocument> {
  const query = `*[ _type == "profile" && slug.current == $slug ][0]{
  ...,
  profileImage {
    asset->{url}
  },
  "team": team->{
      name,
      slug,
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

  const profile = await client.fetch<SanityDocument>(query, { slug }, options);

  return profile;
}

export async function getProfilesByTeamWithoutSpecifiedProfile(
  profileId: string,
  teamSlug: string
): Promise<SanityDocument[]> {
  const query = `*[_type == "profile" && team->slug.current == $teamSlug && _id != $profileId] {
      name,
      slug,
      jobRole,
      profileImage {
        asset->{url}
      },
      "team": team->{
        _id,
        name,
        slug
      },
    }
    `;
  const options = { next: { revalidate: 30 } };

  const profiles = await client.fetch<SanityDocument[]>(
    query,
    { profileId, teamSlug },
    options
  );

  return profiles;
}

export interface ProfilesFromUserTeams {
  teamProfiles: SanityDocument[];
}

export async function getProfilesFromUserTeams(
  userEmail: string | undefined,
  userTeams: unknown
): Promise<ProfilesFromUserTeams> {
  const query = `
  *[_type == "user" && email == $userEmail][0] {
    "teamProfiles": *[_type == "profile" && team->name in $userTeams] {
      name,
      "slug":slug.current,
      jobRole,
      profileImage {
        asset->{url}
      },
      "team": team->{
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
    { userEmail, userTeams },
    options
  );

  return profiles;
}
