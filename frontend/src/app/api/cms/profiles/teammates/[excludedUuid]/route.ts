import { getProfileByUuid, getTeammateProfiles } from "@/src/lib/data/profiles";
import { NextResponse } from "next/server";
import {
  canAccessProfile,
  getAuthorizedUser,
} from "@/src/lib/auth/permissions";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ excludedUuid: string }> },
) {
  try {
    const { excludedUuid } = await params;

    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const excludeProfile = await getProfileByUuid(excludedUuid);
    if (!excludeProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const canAccess = await canAccessProfile(user, excludeProfile);
    if (!canAccess) {
      return NextResponse.json(
        { error: "Forbidden - you do not have access to this profile" },
        { status: 403 },
      );
    }

    const profiles = await getTeammateProfiles(excludedUuid);
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("API: Failed to fetch teammate profiles:", error);
    return NextResponse.json(
      { error: "Unable to fetch teammate profiles" },
      { status: 500 },
    );
  }
}
