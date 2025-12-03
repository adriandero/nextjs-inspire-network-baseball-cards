import { getAllTeams } from "@/src/lib/data/queries/teams";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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
