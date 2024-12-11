import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { client } from "../sanity/client";

export async function checkIfSession() {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/auth/signin");
  }
}

export async function getUserData() {
  const session = await getServerSession(authOptions);
  const userData = session?.user;
  if (!userData) {
    return null;
  }

  // Assuming you are using Sanity's GROQ query to fetch data
  const userQuery = `
    *[_type == "user" && email == $userEmail][0] {
      name,
      email,
      image,
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

  const params = { userEmail: userData.email };

  // Fetch data using the query (this is just an example; adapt according to your environment)
  const fetchedUserData = await client.fetch(userQuery, params);

  return fetchedUserData;
}
