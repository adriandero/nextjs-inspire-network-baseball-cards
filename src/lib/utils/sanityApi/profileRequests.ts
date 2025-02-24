import { type SanityDocument } from "next-sanity";

import { client } from "@/lib/sanity/client";

export async function getProfileBySlug(slug: string): Promise<SanityDocument> {
  const query = `*[ _type == "profile" && slug.current == $slug && !(_id in path('drafts.**'))][0]{
  ...,
  profileImage {
    asset->{url}
  },
  "team": team[]->{
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

export async function getProfilesByTeamsWithoutSpecifiedProfile(
  profileId: string
): Promise<SanityDocument[]> {
  const query = `

  *[_type == "profile" && _id == $profileId && !(_id in path('drafts.**'))][0] {
    "teamSlug": team[]->slug.current
  } {
  "profile": *[_type == "profile" && !(_id in path("drafts.**")) && count((team[]->slug.current)[@ in ^.^.teamSlug]) > 0 ] {
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
  }.profile
  `;

  const options = { next: { revalidate: 30 } };

  const profiles = await client.fetch<SanityDocument[]>(
    query,
    { profileId },
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
  *[_type == "user" && email == $userEmail && !(_id in path('drafts.**'))][0] {
    "teamProfiles": *[_type == "profile" && count((team[]->name)[@ in $userTeams]) > 0] {
      name,
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
    { userEmail, userTeams },
    options
  );
  return profiles;
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
