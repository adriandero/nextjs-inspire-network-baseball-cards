import { getProfilesByUuids } from "@/src/lib/data/profiles";
import { NextResponse } from "next/server";
import { canAccessProfile, getAuthorizedUser } from "@/src/lib/auth/permissions";

export async function POST(request: Request) {
  try {
    const { uuids } = await request.json();

    if (!Array.isArray(uuids)) {
      return NextResponse.json(
        { error: "uuids must be an array" },
        { status: 400 },
      );
    }

    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allProfiles = await getProfilesByUuids(uuids);

    const accessibleProfiles = [];
    for (const profile of allProfiles) {
      const canAccess = await canAccessProfile(user, profile);
      if (canAccess) {
        accessibleProfiles.push(profile);
      }
    }

    return NextResponse.json(accessibleProfiles);
  } catch (error) {
    console.error("API: Failed to fetch profiles by UUIDs:", error);
    return NextResponse.json(
      { error: "Unable to fetch profiles" },
      { status: 500 },
    );
  }
}
