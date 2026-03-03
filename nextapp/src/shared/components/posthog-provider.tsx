"use client";

import { createContext, useContext, useEffect } from "react";
import posthog from "posthog-js";

type Team = { _id: string; name: string };

const TeamsContext = createContext<Team[]>([]);

interface PostHogProviderProps {
  children: React.ReactNode;
  user?: {
    sub: string;
    email?: string;
    name?: string;
  } | null;
  sanityUserId?: string;
  teams?: Team[];
}

export function PostHogProvider({
  children,
  user,
  sanityUserId,
  teams = [],
}: PostHogProviderProps) {
  useEffect(() => {
    if (user) {
      posthog.identify(user.sub, {
        email: user.email,
        name: user.name,
        sanityUserId: sanityUserId,
        teamCount: teams.length,
        teamIds: teams.map((t) => t._id),
        teamNames: teams.map((t) => t.name),
      });

      // Register each team as a group so PostHog knows the group metadata.
      // Use team.name as the group key so PostHog displays names in breakdowns.
      teams.forEach((team) => {
        posthog.group("team", team.name, { name: team.name, id: team._id });
      });

      console.log(
        `✅ PostHog: User ${user.email} associated with ${teams.length} teams:`,
        teams.map((t) => t.name),
      );
    } else {
      posthog.reset();
    }
  }, [user, sanityUserId, teams]);

  return (
    <TeamsContext.Provider value={teams}>{children}</TeamsContext.Provider>
  );
}

/**
 * Returns a capture function that broadcasts an event to all of the current
 * user's teams by firing one posthog.capture() per team with $groups set.
 * This lets PostHog attribute the event to each team independently.
 *
 * Usage:
 *   const capture = useCaptureForTeams();
 *   capture("page_viewed", { page: "dashboard" });
 */
export function useCaptureForTeams() {
  const teams = useContext(TeamsContext);

  return (eventName: string, properties?: Record<string, unknown>) => {
    teams.forEach((team) => {
      posthog.capture(eventName, {
        ...properties,
        $groups: { team: team.name },
      });
    });
  };
}
