import {
  getAllProfiles,
  getProfilesFromUserTeams,
} from "@/src/lib/data/profiles";
import { NextResponse } from "next/server";
import { getAuthorizedUser } from "@/src/lib/auth/permissions";
import { getUserTeams } from "@/src/lib/data/teams";

export async function GET() {
  try {
    // 1. Get authenticated user
    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Apply permission-based filtering
    let profiles;
    if (user.permission === "Admin") {
      // Admins can see all profiles
      profiles = await getAllProfiles();
    } else {
      // Regular users only see profiles from their teams
      const userTeams = await getUserTeams(user.email);
      const userTeamSlugs = userTeams?.teams?.map((t) => t.slug) || [];

      if (userTeamSlugs.length === 0) {
        return NextResponse.json([]);
      }

      const result = await getProfilesFromUserTeams(user.email, userTeamSlugs);
      profiles = result?.teamProfiles || [];
    }

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("API: Failed to fetch all profiles:", error);
    return NextResponse.json(
      { error: "Unable to fetch profiles" },
      { status: 500 },
    );
  }
}
