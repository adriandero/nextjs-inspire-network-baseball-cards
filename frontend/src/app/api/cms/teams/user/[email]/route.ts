import { getUserSanity } from "@/src/lib/data/users";
import { NextResponse } from "next/server";
import { getUserTeams } from "@/src/lib/data/teams";
import { auth0 } from "@/src/lib/auth0";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ email: string }> },
) {
  try {
    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);

    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProfileData = await getUserSanity(session.user);
    if (!userProfileData) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 },
      );
    }

    if (
      userProfileData.permission !== "Admin" &&
      userProfileData.email !== decodedEmail
    ) {
      return NextResponse.json(
        { error: "Forbidden - you can only access your own teams" },
        { status: 403 },
      );
    }

    const userTeams = await getUserTeams(decodedEmail);
    return NextResponse.json(userTeams);
  } catch (error) {
    console.error("API: Failed to fetch user teams:", error);
    return NextResponse.json(
      { error: "Unable to fetch user teams" },
      { status: 500 },
    );
  }
}
