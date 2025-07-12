import { getTeamsForUser } from "@/src/lib/data/teams";
import { NextResponse } from "next/server";
import { getUserSanity } from "@/src/lib/data/users";
import { auth0 } from "@/src/lib/auth0";

export async function POST() {
  try {
    // 1. Get authenticated user from Auth0 session
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Look up REAL user data from Sanity based on Auth0 session
    // Don't trust any frontend-provided data
    const userProfileData = await getUserSanity(session.user);

    if (!userProfileData) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 },
      );
    }

    // 3. Server makes permission decision with real data
    const teams = await getTeamsForUser(userProfileData);
    return NextResponse.json(teams);
  } catch (error) {
    console.error("API: Failed to fetch teams for user:", error);
    return NextResponse.json(
      { error: "Unable to fetch teams for user" },
      { status: 500 },
    );
  }
}
