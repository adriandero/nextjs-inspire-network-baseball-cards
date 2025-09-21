// flags.ts
import { statsigAdapter, type StatsigUser } from "@flags-sdk/statsig";
import { flag, dedupe } from "flags/next";
import type { Identify } from "flags";
import { getUserSanity } from "../data/users";
import { auth0 } from "@/src/lib/auth0";

export const identify = dedupe((async () => {
  const session = await auth0.getSession();

  if (!session) {
    console.log("No session - returning anonymous user");
    return {
      userID: "anonymous",
      permission: "user", // Make this lowercase to match your data
    };
  }

  const userProfileData = await getUserSanity(session.user);

  const userData = {
    userID: session.user.sub,
    email: session.user.email,
    permission: userProfileData?.permission ?? "user",
  };

  console.log("Sending to Statsig:", userData); // Add this log
  return userData;
}) satisfies Identify<StatsigUser>);

export const createFeatureFlag = (key: string) =>
  flag<boolean, StatsigUser>({
    key,
    adapter: statsigAdapter.featureGate((gate) => gate.value, {
      exposureLogging: true,
    }),
    identify,
  });
