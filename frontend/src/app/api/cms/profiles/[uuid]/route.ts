import { getProfileByUuid } from "@/src/lib/data/profiles";
import { NextResponse } from "next/server";
import {
  canAccessProfile,
  getAuthorizedUser,
} from "@/src/lib/auth/permissions";

interface RouteParams {
  params: { uuid: string };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { uuid } = params;

    // 1. Get authenticated user
    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get the profile first to check permissions
    const profile = await getProfileByUuid(uuid);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 3. Check if user can access this profile
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
