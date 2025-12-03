import { getTeamsForUser } from "@/src/lib/data/queries/teams";
import { NextResponse } from "next/server";
import { getUserSanity } from "@/src/lib/data/queries/users";
import { auth0 } from "@/src/lib/auth0";

export async function POST() {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProfileData = await getUserSanity(session.user);

    if (!userProfileData) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const teams = await getTeamsForUser(userProfileData);
    return NextResponse.json(teams);
  } catch (error) {
    console.error("API: Failed to fetch teams for user:", error);
    return NextResponse.json(
      { error: "Unable to fetch teams for user" },
      { status: 500 }
    );
  }
}
