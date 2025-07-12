import { getAuthorizedUser } from "@/src/lib/auth/permissions";
import { NextResponse } from "next/server";
import { getUserTeams } from "@/src/lib/data/teams";
import { getProfilesFromUserTeams } from "@/src/lib/data/profiles";

export async function GET() {
  try {
    // 1. Get authenticated user from Auth0 session
    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user's teams from server-side data (not frontend)
    const userTeams = await getUserTeams(user.email);
    const userTeamSlugs = userTeams?.teams?.map((team) => team.slug) || [];

    if (userTeamSlugs.length === 0) {
      return NextResponse.json({ teamProfiles: [] });
    }

    // 3. Get profiles for user's teams using server-side data
    const profiles = await getProfilesFromUserTeams(user.email, userTeamSlugs);
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("API: Failed to fetch my team profiles:", error);
    return NextResponse.json(
      { error: "Unable to fetch team profiles" },
      { status: 500 },
    );
  }
}
