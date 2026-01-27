import { getAllProfilesGroupedByTeam } from "@/src/lib/data/queries/profiles";
import { NextResponse } from "next/server";
import { getAuthorizedUser } from "@/src/lib/auth/permissions";
import { Profile } from "@/src/shared/entities/profile.types";
import { getUserTeams } from "@/src/lib/data/queries/teams";

export async function GET() {
  try {
    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allGroupedProfiles = await getAllProfilesGroupedByTeam();

    if (user.permission === "Admin") {
      return NextResponse.json(allGroupedProfiles);
    } else {
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
      { status: 500 }
    );
  }
}
