import Link from "next/link";
import { type SanityDocument } from "next-sanity";

import { client } from "@/sanity/client";


export async function getAllProfiles() {
  const query = `*[ _type == "profile" ]`;
  
  
  const options = { next: { revalidate: 30 } };
  const posts = await client.fetch<SanityDocument[]>(query, {}, options);

  return posts;
}

export async function getProfileBySlug(slug: string):Promise<SanityDocument> {
  const query = `*[ _type == "profile" && slug.current == $slug ][0]`;
  const options = { next: { revalidate: 30 } };
  
  const profile = await client.fetch<SanityDocument>(query, { slug }, options);

  return profile;
}


