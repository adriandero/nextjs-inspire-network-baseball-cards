"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

interface PostHogProviderProps {
  children: React.ReactNode;
  user?: {
    sub: string;
    email?: string;
    name?: string;
  } | null;
  sanityUserId?: string;
  teams?: Array<{ _id: string; name: string }>;
}

export function PostHogProvider({
  children,
  user,
  sanityUserId,
  teams = [],
}: PostHogProviderProps) {
  useEffect(() => {
    if (user) {
      // 1. Identify the user
      posthog.identify(user.sub, {
        email: user.email,
        name: user.name,
        sanityUserId: sanityUserId,
        teamCount: teams.length,
        teamIds: teams.map((t) => t._id),
        teamNames: teams.map((t) => t.name),
      });

      // 2. Associate user with their teams using Groups
      teams.forEach((team) => {
        posthog.group("team", team._id, {
          name: team.name,
        });
      });

      console.log(
        `✅ PostHog: User ${user.email} associated with ${teams.length} teams:`,
        teams.map((t) => t.name),
      );
    } else {
      // User logged out
      posthog.reset();
    }
  }, [user, sanityUserId, teams]);

  return <>{children}</>;
}
