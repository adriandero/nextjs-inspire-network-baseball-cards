"use client";

import type { Statsig } from "@flags-sdk/statsig";
import {
  StatsigProvider,
  useClientBootstrapInit,
} from "@statsig/react-bindings";

export function DynamicStatsigProvider({
  children,
  datafile,
}: {
  children: React.ReactNode;
  datafile: Awaited<ReturnType<typeof Statsig.getClientInitializeResponse>>;
}) {
  if (!datafile) throw new Error("Missing datafile");

  const client = useClientBootstrapInit(
    process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY as string,
    datafile.user,
    JSON.stringify(datafile),
  );

  return (
    <StatsigProvider client={client}>
      {" "}
      {children}
    </StatsigProvider>
  );
}
