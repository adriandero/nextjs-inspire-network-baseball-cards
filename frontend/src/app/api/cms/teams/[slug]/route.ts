import { getTeamBySlug, getUserTeams } from "@/src/lib/data/teams";
import { NextResponse } from "next/server";
import { getUserSanity } from "@/src/lib/data/users";
import { auth0 } from "@/src/lib/auth0";

interface RouteParams {
  params: { slug: string };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = params;

    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProfileData = await getUserSanity(session.user);
    if (!userProfileData) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 },
      );
    }

    if (userProfileData.permission !== "Admin") {
      const userTeams = await getUserTeams(userProfileData.email);
      const allowedSlugs = userTeams?.teams?.map((team) => team.slug) || [];

      if (!allowedSlugs.includes(slug)) {
        return NextResponse.json(
          { error: "Forbidden - you do not have access to this team" },
          { status: 403 },
        );
      }
    }

    const team = await getTeamBySlug(slug);
    return NextResponse.json(team);
  } catch (error) {
    console.error("API: Failed to fetch team by slug:", error);
    return NextResponse.json(
      { error: "Unable to fetch team" },
      { status: 500 },
    );
  }
}
