import { createClient } from "next-sanity";

import imageUrlBuilder from "@sanity/image-url";
import { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const client = createClient({
  projectId: process.env.CLIENT_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource): ImageUrlBuilder {
  return builder.image(source);
}
