import { canAccessTeam, getAuthorizedUser } from "@/src/lib/auth/permissions";
import { NextResponse } from "next/server";
import { getProfilesFromUserTeams } from "@/src/lib/data/profiles";

interface RouteParams {
  params: { slug: string };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = params;

    // 1. Get authenticated user from Auth0 session
    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check if user can access this specific team
    const canAccess = await canAccessTeam(user, slug);
    if (!canAccess) {
      return NextResponse.json(
        { error: "Forbidden - you do not have access to this team" },
        { status: 403 },
      );
    }

    // 3. Get profiles for this specific team using server-side user data
    const profiles = await getProfilesFromUserTeams(user.email, [slug]);
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("API: Failed to fetch team profiles:", error);
    return NextResponse.json(
      { error: "Unable to fetch team profiles" },
      { status: 500 },
    );
  }
}
