import NextAuth, { NextAuthOptions } from "next-auth";
import { SanityAdapter, SanityCredentials } from "next-auth-sanity";
import { client } from "@/lib/sanity/client";

const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [SanityCredentials(client)],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: SanityAdapter(client),
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
