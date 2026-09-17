import { getTeamsForUser } from "@/src/lib/data/queries/teams";
import { NextResponse } from "next/server";
import { getUserSanity } from "@/src/lib/data/queries/users";
import { auth0 } from "@/src/lib/auth0";
import { decodeCursor, parsePaginationParams, toCursorPage } from "@/src/lib/data/pagination";
import { getTeamsPage } from "@/src/lib/data/queries/teams";

export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProfileData = await getUserSanity(session.user);

    if (!userProfileData) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => ({}));
    if (body.limit === undefined && body.cursor === undefined) {
      const teams = await getTeamsForUser(userProfileData);
      return NextResponse.json(teams);
    }
    const params = new URLSearchParams();
    if (body.limit !== undefined) params.set("limit", String(body.limit));
    if (body.cursor !== undefined && body.cursor !== null) params.set("cursor", String(body.cursor));
    const { limit } = parsePaginationParams(params);
    const cursor = decodeCursor(body.cursor ?? null);
    if (userProfileData.permission === "Admin") {
      return NextResponse.json(await getTeamsPage(limit, cursor));
    }
    const teams = await getTeamsForUser(userProfileData);
    const sortedTeams = teams.slice().sort((a, b) => a._id.localeCompare(b._id));
    const start = cursor ? sortedTeams.findIndex((team) => team._id === cursor) + 1 : 0;
    return NextResponse.json(toCursorPage(sortedTeams.slice(start), limit));
  } catch (error) {
    if (error instanceof Error && (error.message.startsWith("limit ") || error.message.startsWith("cursor "))) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("API: Failed to fetch teams for user:", error);
    return NextResponse.json(
      { error: "Unable to fetch teams for user" },
      { status: 500 }
    );
  }
}
