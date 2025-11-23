import { Suspense } from "react";

import ValuesTable from "@/src/features/deck-builder/data-tables/values-table";
import { PDFLayout } from "@/src/components/layout/pdf-layout";
import { fetchProfileTables } from "@/src/lib/utils/profile-table-utils";

async function ProfileComparisonContent({
  groupedProfiles,
  showJobRole,
}: {
  groupedProfiles: string | null;
  showJobRole: boolean;
}) {
  const { completeProfileTables, error } =
    await fetchProfileTables(groupedProfiles);

  return (
    <PDFLayout
      title="Values"
      isLoading={false}
      error={error}
      completeProfileTables={completeProfileTables}
    >
      {completeProfileTables.map((table) => (
        <div key={table.id} className="flex flex-col gap-4">
          {completeProfileTables.length > 1 && (
            <h2 className="text-base font-semibold">{table.name}</h2>
          )}
          <ValuesTable
            profiles={table.profiles}
            optimizedImages={true}
            showJobRole={showJobRole}
            tableName={"Values"}
          />
        </div>
      ))}
    </PDFLayout>
  );
}

export default async function ValuesPDFPage({
  searchParams,
}: {
  searchParams: Promise<{ groupedProfiles?: string; showJobRole?: string }>;
}) {
  const params = await searchParams;
  const groupedProfiles = params.groupedProfiles ?? null;
  const showJobRole = params.showJobRole === "true";

  return (
    <div className="w-full max-w-screen-lg mx-auto flex justify-center">
      <Suspense fallback={<div>Loading TUG Cards...</div>}>
        <ProfileComparisonContent
          groupedProfiles={groupedProfiles}
          showJobRole={showJobRole}
        />
      </Suspense>
    </div>
  );
}
