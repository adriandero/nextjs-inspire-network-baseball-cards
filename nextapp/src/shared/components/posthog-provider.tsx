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
}

export function PostHogProvider({
  children,
  user,
  sanityUserId,
}: PostHogProviderProps) {
  useEffect(() => {
    if (user) {
      // Identify the user with Auth0 ID
      posthog.identify(user.sub, {
        email: user.email,
        name: user.name,
        sanityUserId: sanityUserId,
      });
    } else {
      // User logged out
      posthog.reset();
    }
  }, [user, sanityUserId]);

  return <>{children}</>;
}
