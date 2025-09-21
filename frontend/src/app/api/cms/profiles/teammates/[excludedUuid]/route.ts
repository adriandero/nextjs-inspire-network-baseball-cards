import { getAuthorizedTeammateProfiles } from "@/src/lib/services/profiles.service";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { excludedUuid: string } },
) {
  try {
    const { excludedUuid } = params;
    const teammates = await getAuthorizedTeammateProfiles(excludedUuid);
    return NextResponse.json(teammates);
  } catch (error) {
    console.error("API: Failed to fetch teammate profiles:", error);
    return NextResponse.json(
      { error: "Unable to fetch teammate profiles" },
      { status: 500 },
    );
  }
}
