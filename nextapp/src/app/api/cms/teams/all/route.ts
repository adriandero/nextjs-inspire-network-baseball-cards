import { getTeamsPage } from "@/src/lib/data/queries/teams";
import { decodeCursor, parsePaginationParams } from "@/src/lib/data/pagination";
import { getAuthorizedUser } from "@/src/lib/auth/permissions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.permission !== "Admin") {
      return NextResponse.json(
        { error: "Forbidden - admin access required" },
        { status: 403 }
      );
    }

    const { limit, cursor: rawCursor } = parsePaginationParams(new URL(request.url).searchParams);
    const teams = await getTeamsPage(limit, decodeCursor(rawCursor));
    return NextResponse.json(teams);
  } catch (error) {
    if (error instanceof Error && (error.message.startsWith("limit ") || error.message.startsWith("cursor "))) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("API: Failed to fetch all teams:", error);
    return NextResponse.json(
      { error: "Unable to fetch teams" },
      { status: 500 }
    );
  }
}
