import { getProfilesByTeamId } from "@/src/lib/data/queries/profiles";
import { NextResponse } from "next/server";
import {
  canAccessTeamById,
  getAuthorizedUser,
} from "@/src/lib/auth/permissions";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;

    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const canAccess = await canAccessTeamById(user, teamId);
    if (!canAccess) {
      return NextResponse.json(
        { error: "Forbidden - you do not have access to this team" },
        { status: 403 }
      );
    }
    const profiles = await getProfilesByTeamId(teamId);
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("API: Failed to fetch profiles by team ID:", error);
    return NextResponse.json(
      { error: "Unable to fetch profiles for team" },
      { status: 500 }
    );
  }
}
