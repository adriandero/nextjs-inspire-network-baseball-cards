import { getProfilesByTeamId } from "@/src/lib/data/profiles";
import { NextResponse } from "next/server";
import {
  canAccessTeamById,
  getAuthorizedUser,
} from "@/src/lib/auth/permissions";

interface RouteParams {
  params: { teamId: string };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { teamId } = params;

    // 1. Get authenticated user
    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check if user can access this team
    const canAccess = await canAccessTeamById(user, teamId);
    if (!canAccess) {
      return NextResponse.json(
        { error: "Forbidden - you do not have access to this team" },
        { status: 403 },
      );
    }

    // 3. User is authorized - return the data
    const profiles = await getProfilesByTeamId(teamId);
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("API: Failed to fetch profiles by team ID:", error);
    return NextResponse.json(
      { error: "Unable to fetch profiles for team" },
      { status: 500 },
    );
  }
}
