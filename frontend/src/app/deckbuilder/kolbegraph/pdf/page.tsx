import { Suspense } from "react";
import KolbeGraphClient from "./kolbe-graph-client";
import { fetchProfileTables } from "@/src/lib/utils/profile-table-utils";

// Server Component - fetches data
async function ProfileComparisonContent({
  groupedProfiles,
}: {
  groupedProfiles: string | null;
}) {
  const { completeProfileTables, error } =
    await fetchProfileTables(groupedProfiles);

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
  searchParams: Promise<{ groupedProfiles?: string }>;
}) {
  const params = await searchParams;
  const groupedProfiles = params.groupedProfiles ?? null;

  return (
    <div className="w-full max-w-screen-lg mx-auto flex justify-center">
      <Suspense fallback={<div>Loading Kolbe Graph...</div>}>
        <ProfileComparisonContent groupedProfiles={groupedProfiles} />
      </Suspense>
    </div>
  );
}
