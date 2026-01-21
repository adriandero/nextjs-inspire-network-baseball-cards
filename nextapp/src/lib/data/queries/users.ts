import { client } from "@/src/lib/sanity/client";
import { User } from "@auth0/nextjs-auth0/types";
import { UserSanity } from "@/src/shared/entities/user";

export async function getUserSanity(
  authUser: User,
): Promise<UserSanity | undefined> {
  if (!authUser?.email) {
    console.warn("getUserProfile called without valid email");
    return undefined;
  }

  const query = `
    *[_type == "user" && email == $userEmail && !(_id in path('drafts.**'))][0] {
      email,
      image,
      permission,
      profile->{
        name,
        uuid,
        "slug": slug.current,
        jobRole,
      },
      team[]->{
        name,
        slug,
        groups
      }
    }
  `;

  try {
    const userData = await client.fetch<UserSanity>(query, {
      userEmail: authUser.email,
    });

    return userData || null;
  } catch (error) {
    console.error("Failed to fetch user profile:", {
      email: authUser.email,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    throw new Error(`Unable to fetch user profile for ${authUser.email}`);
  }
}
