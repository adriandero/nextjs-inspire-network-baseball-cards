import { writeClient } from "@/src/lib/sanity/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 1. Validate request is from Auth0
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.AUTH0_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request body
    const { auth0User } = await request.json();

    if (!auth0User?.user_id || !auth0User?.email) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    // 3. Check if user already exists (prevent duplicates)
    const existingUser = await writeClient.fetch(
      `*[_type == "user" && auth0UserID == $auth0UserID][0]`,
      { auth0UserID: auth0User.user_id }
    );

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "User already exists",
        userId: existingUser._id,
      });
    }

    // 4. Create Sanity user
    const sanityUser = await writeClient.create({
      _type: "user",
      email: auth0User.email,
      auth0UserID: auth0User.user_id,
      permission: "User", // Default from your schema
      // profile and team will be null initially
    });

    return NextResponse.json({
      success: true,
      userId: sanityUser._id,
    });
  } catch (error) {
    console.error("Sanity user sync failed:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
