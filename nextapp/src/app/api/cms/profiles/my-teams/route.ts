import { getAuthorizedUser } from "@/src/lib/auth/permissions";
import { NextResponse } from "next/server";
import { getUserTeams } from "@/src/lib/data/queries/teams";
import { getProfilesFromUserTeams } from "@/src/lib/data/queries/profiles";

export async function GET() {
  try {
    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userTeams = await getUserTeams(user.email);
    const userTeamSlugs = userTeams?.teams?.map((team) => team.slug) || [];

    if (userTeamSlugs.length === 0) {
      return NextResponse.json({ teamProfiles: [] });
    }

    const profiles = await getProfilesFromUserTeams(user.email, userTeamSlugs);
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("API: Failed to fetch my team profiles:", error);
    return NextResponse.json(
      { error: "Unable to fetch team profiles" },
      { status: 500 }
    );
  }
}
