import { client } from "../sanity/client";
import { User } from "@auth0/nextjs-auth0/types";

export async function getUserData(userOfSession: User | undefined) {
  if (userOfSession) {
    // Assuming you are using Sanity's GROQ query to fetch data
    const userQuery = `
    *[_type == "user" && email == $userEmail && !(_id in path('drafts.**'))][0] {
      email,
      image,
      permission,
      profile->{
        name,
        "slug":slug.current,
        jobRole,
        profileImage {
          asset->{url}
        }
      },
      team[]->{
        name,
        slug
      }
    }
  `;

    const params = { userEmail: userOfSession.email };

    // Fetch data using the query (this is just an example; adapt according to your environment)
    const fetchedUserData = await client.fetch(userQuery, params);

    return fetchedUserData;
  }
}
