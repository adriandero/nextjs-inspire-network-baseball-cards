import { getProfileByUuid } from "@/src/lib/data/profiles";
import { NextRequest, NextResponse } from "next/server";
import {
  canAccessProfile,
  getAuthorizedUser,
} from "@/src/lib/auth/permissions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) {
  try {
    const { uuid } = await params;

    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await getProfileByUuid(uuid);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const canAccess = await canAccessProfile(user, profile);
    if (!canAccess) {
      return NextResponse.json(
        { error: "Forbidden - you do not have access to this profile" },
        { status: 403 },
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("API: Failed to fetch profile by UUID:", error);
    return NextResponse.json(
      { error: "Unable to fetch profile" },
      { status: 500 },
    );
  }
}
