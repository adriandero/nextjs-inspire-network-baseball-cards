import { NextRequest, NextResponse } from "next/server";
import { client } from "@/src/lib/sanity/client";
import { getPostHogClient } from "@/src/lib/posthog/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teamCount = await client.fetch<number>(
      `count(*[_type == "team" && groups == "client"])`,
    );

    const userCount = await client.fetch<number>(`count(*[_type == "user"])`);

    const posthog = getPostHogClient();

    posthog.capture({
      distinctId: "system",
      event: "daily_metrics_snapshot",
      properties: {
        teamCount,
        userCount,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "production",
        timestamp: new Date().toISOString(),
      },
    });

    await posthog.shutdown();

    return NextResponse.json({
      success: true,
      metrics: { teamCount, userCount },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to track metrics:", error);
    return NextResponse.json(
      { error: "Failed to track metrics" },
      { status: 500 },
    );
  }
}
