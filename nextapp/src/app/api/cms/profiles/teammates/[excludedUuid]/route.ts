import { getAuthorizedTeammateProfiles } from "@/src/lib/data/services/profiles";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ excludedUuid: string }> }
) {
  try {
    const { excludedUuid } = await params;
    const teammates = await getAuthorizedTeammateProfiles(excludedUuid);
    return NextResponse.json(teammates);
  } catch (error) {
    console.error("API: Failed to fetch teammate profiles:", error);
    return NextResponse.json(
      { error: "Unable to fetch teammate profiles" },
      { status: 500 }
    );
  }
}
