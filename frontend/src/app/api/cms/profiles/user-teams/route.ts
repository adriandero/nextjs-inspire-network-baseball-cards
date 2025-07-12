import { getProfilesFromUserTeams } from "@/src/lib/data/profiles";
import { NextResponse } from "next/server";
import { canAccessUserData, getAuthorizedUser } from "@/src/lib/auth/permissions";


export async function POST(request: Request) {
  try {
    const { userEmail, userTeamSlugs } = await request.json();

    if (!userEmail || !Array.isArray(userTeamSlugs)) {
      return NextResponse.json(
        { error: 'userEmail (string) and userTeamSlugs (array) are required' },
        { status: 400 }
      );
    }

    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const canAccess = await canAccessUserData(user, userEmail);
    if (!canAccess) {
      return NextResponse.json(
        { error: 'Forbidden - you can only access your own data' },
        { status: 403 }
      );
    }

    const profiles = await getProfilesFromUserTeams(userEmail, userTeamSlugs);
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('API: Failed to fetch profiles from user teams:', error);
    return NextResponse.json(
      { error: 'Unable to fetch profiles for user teams' },
      { status: 500 }
    );
  }
}