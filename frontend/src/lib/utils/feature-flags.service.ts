// flags.ts
import { statsigAdapter, type StatsigUser } from "@flags-sdk/statsig";
import { dedupe, flag } from "flags/next";
import type { Identify } from "flags";
import { getUserSanity } from "../data/users";
import { auth0 } from "@/src/lib/auth0";

export const identify = dedupe((async () => {
  const session = await auth0.getSession();

  if (!session) {
    return {
      userID: "anonymous",
      permission: "user",
    };
  }

  const userProfileData = await getUserSanity(session.user);

  return {
    userID: session.user.sub,
    email: session.user.email,
    permission: userProfileData?.permission ?? "user",
  };
}) satisfies Identify<StatsigUser>);

export const createFeatureFlag = (key: string) =>
  flag<boolean, StatsigUser>({
    key,
    adapter: statsigAdapter.featureGate((gate) => gate.value, {
      exposureLogging: true,
    }),
    identify,
  });
