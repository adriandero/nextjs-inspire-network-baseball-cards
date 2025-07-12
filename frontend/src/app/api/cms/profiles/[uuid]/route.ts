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
