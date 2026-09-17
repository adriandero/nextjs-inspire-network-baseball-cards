import { getProfilesPage } from "@/src/lib/data/queries/profiles";
import { NextResponse } from "next/server";
import { getAuthorizedUser } from "@/src/lib/auth/permissions";
import { getUserTeams } from "@/src/lib/data/queries/teams";
import { decodeCursor, parsePaginationParams } from "@/src/lib/data/pagination";

export async function GET(request: Request) {
  try {
    const { limit, cursor: rawCursor } = parsePaginationParams(new URL(request.url).searchParams);
    const cursor = decodeCursor(rawCursor);
    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let page;
    if (user.permission === "Admin") {
      page = await getProfilesPage(limit, cursor);
    } else {
      const userTeams = await getUserTeams(user.email);
      const userTeamSlugs = userTeams?.teams?.map((t) => t.slug) || [];

      if (userTeamSlugs.length === 0) {
        return NextResponse.json({ data: [], nextCursor: null, hasMore: false });
      }

      page = await getProfilesPage(limit, cursor, user.email, userTeamSlugs);
    }

    return NextResponse.json(page);
  } catch (error) {
    if (error instanceof Error && (error.message.startsWith("limit ") || error.message.startsWith("cursor "))) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("API: Failed to fetch all profiles:", error);
    return NextResponse.json(
      { error: "Unable to fetch profiles" },
      { status: 500 }
    );
  }
}
