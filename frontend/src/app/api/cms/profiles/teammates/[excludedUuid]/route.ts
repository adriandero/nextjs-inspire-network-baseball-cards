import { getProfileByUuid, getTeammateProfiles } from "@/src/lib/data/profiles";
import { NextResponse } from "next/server";
import { canAccessProfile, getAuthorizedUser } from "@/src/lib/auth/permissions";

interface RouteParams {
  params: { excludeUuid: string };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { excludeUuid } = params;

    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const excludeProfile = await getProfileByUuid(excludeUuid);
    if (!excludeProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const canAccess = await canAccessProfile(user, excludeProfile);
    if (!canAccess) {
      return NextResponse.json(
        { error: 'Forbidden - you do not have access to this profile' },
        { status: 403 }
      );
    }

    const profiles = await getTeammateProfiles(excludeUuid);
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('API: Failed to fetch teammate profiles:', error);
    return NextResponse.json(
      { error: 'Unable to fetch teammate profiles' },
      { status: 500 }
    );
  }
}