
import { type SanityDocument } from "next-sanity";

import { client } from "@/sanity/client";


export async function getAllProfilesDashboardRowData():Promise<SanityDocument[]> {
  const query = `*[ _type == "profile"] {
    name,
    "slug":slug.current,
    jobRole,
    profileImage {
      asset->{url}
    },
    "team": Team->{
      name,
      slug,
      "company": Company->{
          name,
          slug
      }
    }
  }`;
  
  
  const options = { next: { revalidate: 30 } };
  const posts = await client.fetch<SanityDocument[]>(query, {}, options);

  return posts;
}

export async function getProfileBySlug(slug: string):Promise<SanityDocument> {
  const query = `*[ _type == "profile" && slug.current == $slug ][0]{
  ...,
  "team": Team->{
      name,
      slug,
      "company": Company->{
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

export async function getProfilesByTeamWithoutSpecifiedProfile(profileId: string, teamSlug:string):Promise<SanityDocument[]> {
  const query = `*[_type == "profile" && Team->slug.current == $teamSlug && _id != $profileId] {
      name,
      slug,
      jobRole,
      profileImage {
        asset->{url}
      },
      "team": Team->{
        _id,
        name,
        slug
      },
    }
    `;
    const options = { next: { revalidate: 30 } };
    
    const profiles = await client.fetch<SanityDocument[]>(query, { profileId, teamSlug }, options);
  
    return profiles;
}
