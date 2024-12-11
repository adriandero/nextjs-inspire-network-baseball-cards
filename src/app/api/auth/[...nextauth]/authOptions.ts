import { client } from "@/lib/sanity/client";
import { NextAuthOptions } from "next-auth";
import { SanityCredentials, SanityAdapter } from "next-auth-sanity";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [SanityCredentials(client)],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: SanityAdapter(client),
};
