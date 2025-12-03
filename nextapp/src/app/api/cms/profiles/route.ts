import {
  getAllProfiles,
  getProfilesFromUserTeams,
} from "@/src/lib/data/queries/profiles";
import { NextResponse } from "next/server";
import { getAuthorizedUser } from "@/src/lib/auth/permissions";
import { getUserTeams } from "@/src/lib/data/queries/teams";

export async function GET() {
  try {
    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let profiles;
    if (user.permission === "Admin") {
      profiles = await getAllProfiles();
    } else {
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
      { status: 500 }
    );
  }
}
