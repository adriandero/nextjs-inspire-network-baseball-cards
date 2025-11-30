import { canAccessTeam, getAuthorizedUser } from "@/src/lib/auth/permissions";
import { NextResponse } from "next/server";
import { getProfilesFromUserTeams } from "@/src/lib/data/queries/profiles";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const canAccess = await canAccessTeam(user, slug);
    if (!canAccess) {
      return NextResponse.json(
        { error: "Forbidden - you do not have access to this team" },
        { status: 403 }
      );
    }

    const profiles = await getProfilesFromUserTeams(user.email, [slug]);
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("API: Failed to fetch team profiles:", error);
    return NextResponse.json(
      { error: "Unable to fetch team profiles" },
      { status: 500 }
    );
  }
}
