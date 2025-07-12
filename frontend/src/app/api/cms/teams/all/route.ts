import { getAllTeams } from "@/src/lib/data/teams";
import { getAuthorizedUser } from "@/src/lib/auth/permissions";
import { NextResponse } from "next/server";

export async function GET() {
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

    const teams = await getAllTeams();
    return NextResponse.json(teams);
  } catch (error) {
    console.error("API: Failed to fetch all teams:", error);
    return NextResponse.json(
      { error: "Unable to fetch teams" },
      { status: 500 }
    );
  }
}
