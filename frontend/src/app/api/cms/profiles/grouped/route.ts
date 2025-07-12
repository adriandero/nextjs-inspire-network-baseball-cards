import { getAllProfilesGroupedByTeam } from "@/src/lib/data/profiles";
import { NextResponse } from "next/server";
import { getAuthorizedUser, getUserTeams } from "@/src/lib/auth/permissions";
import { Team } from "@/src/lib/entities/team";
import { Profile } from "@/src/lib/entities/profile";

export async function GET() {
  try {
    // 1. Get authenticated user
    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get all grouped profiles
    const allGroupedProfiles = await getAllProfilesGroupedByTeam();

    // 3. Filter based on user permissions
    if (user.permission === "Admin") {
      // Admins can see all grouped profiles
      return NextResponse.json(allGroupedProfiles);
    } else {
      // Regular users only see profiles from their teams
      const userTeams = await getUserTeams(user.email);
      const allowedSlugs = userTeams?.teams?.map((team) => team.slug) || [];

      const filteredTeams: { [key: string]: Profile[] } = {};
      for (const slug of allowedSlugs) {
        if (allGroupedProfiles.teams[slug]) {
          filteredTeams[slug] = allGroupedProfiles.teams[slug];
        }
      }

      return NextResponse.json({ teams: filteredTeams });
    }
  } catch (error) {
    console.error("API: Failed to fetch grouped profiles:", error);
    return NextResponse.json(
      { error: "Unable to fetch grouped profiles" },
      { status: 500 },
    );
  }
}
