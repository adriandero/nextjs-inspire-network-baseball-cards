import { writeClient } from "@/src/lib/sanity/client";
import { NextRequest, NextResponse } from "next/server";
import { getProfileIdByEmail } from "@/src/lib/data/queries/profiles";
import { getPostHogClient } from "@/src/lib/posthog/server";

export async function POST(request: NextRequest) {
  const posthog = getPostHogClient();

  try {
    // 1. Validate request is from Auth0
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.AUTH0_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request body
    const { auth0User } = await request.json();

    if (!auth0User?.email) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    // 3. Check if user already exists (prevent duplicates)
    const existingUser = await writeClient.fetch(
      `*[_type == "user" && lower(email) == lower($email)][0]`,
      { email: auth0User.email },
    );

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "User already exists",
        userId: existingUser._id,
      });
    }

    // 4. Check if profile exists with this email
    const profileId = await getProfileIdByEmail(auth0User.email);

    // 5. Create Sanity user with profile reference if found
    const sanityUser = await writeClient.create({
      _type: "user",
      email: auth0User.email,
      permission: "User",
      ...(profileId && { profile: { _type: "reference", _ref: profileId } }),
    });

    // 6. Track signup event in PostHog
    posthog.capture({
      distinctId: auth0User.sub || auth0User.user_id, // Auth0 user ID
      event: "user_signed_up",
      properties: {
        email: auth0User.email,
        sanityUserId: sanityUser._id,
        profileLinked: !!profileId,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "production",
        signupDate: new Date().toISOString(),
      },
    });

    // Important: Flush events before response
    await posthog.shutdown();

    return NextResponse.json({
      success: true,
      userId: sanityUser._id,
      profileLinked: !!profileId,
    });
  } catch (error) {
    console.error("Sanity user sync failed:", error);

    // Still flush PostHog events on error
    await posthog.shutdown();

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
