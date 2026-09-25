import { getProfilesPage } from "@/src/lib/data/queries/profiles";
import { NextResponse } from "next/server";
import { getAuthorizedUser } from "@/src/lib/auth/permissions";
import { getUserTeams } from "@/src/lib/data/queries/teams";
import { parsePaginationParams } from "@/src/lib/data/pagination";
import {
  decodeProfileCursor,
  parseProfileListOptions,
} from "@/src/lib/data/profile-list";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const { limit, cursor: rawCursor } = parsePaginationParams(params);
    const options = parseProfileListOptions(params);
    const cursor = decodeProfileCursor(rawCursor, options);
    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let page;
    if (user.permission === "Admin") {
      page = await getProfilesPage(
        limit,
        cursor,
        undefined,
        undefined,
        options,
      );
    } else {
      const userTeams = await getUserTeams(user.email);
      const userTeamSlugs = userTeams?.teams?.map((t) => t.slug) || [];

      if (userTeamSlugs.length === 0) {
        return NextResponse.json({
          data: [],
          nextCursor: null,
          hasMore: false,
        });
      }

      page = await getProfilesPage(
        limit,
        cursor,
        user.email,
        userTeamSlugs,
        options,
      );
    }

    return NextResponse.json(page);
  } catch (error) {
    if (
      error instanceof Error &&
      /^(limit|cursor|search|group|sort) /.test(error.message)
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("API: Failed to fetch all profiles:", error);
    return NextResponse.json(
      { error: "Unable to fetch profiles" },
      { status: 500 },
    );
  }
}
