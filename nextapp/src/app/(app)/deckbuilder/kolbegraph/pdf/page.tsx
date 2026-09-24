import { Suspense } from "react";
import KolbeGraphClient from "./kolbe-graph-client";
import { fetchProfileTables } from "@/src/lib/deck-builder/selections";

// Server Component - fetches data
async function ProfileComparisonContent({
  groupedProfiles,
  selection,
}: {
  groupedProfiles: string | null;
  selection?: string;
}) {
  const { completeProfileTables, error } =
    await fetchProfileTables(groupedProfiles, selection);

  return (
    <KolbeGraphClient
      completeProfileTables={completeProfileTables}
      error={error}
    />
  );
}

export default async function KolbeStrengthsPDFPage({
  searchParams,
}: {
  searchParams: Promise<{ selection?: string; groupedProfiles?: string }>;
}) {
  const params = await searchParams;
  const groupedProfiles = params.groupedProfiles ?? null;

  return (
    <div className="w-full max-w-screen-lg mx-auto flex justify-center">
      <Suspense fallback={<div>Loading Kolbe Graph...</div>}>
        <ProfileComparisonContent selection={params.selection} groupedProfiles={groupedProfiles} />
      </Suspense>
    </div>
  );
}
