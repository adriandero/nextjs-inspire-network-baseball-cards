import { Suspense } from "react";
import WorkingGeniusTable from "@/src/features/deck-builder/data-tables/working-genius-table";
import { PDFLayout } from "@/src/components/layout/pdf-layout";
import { fetchProfileTables } from "@/src/lib/deck-builder/selections";

async function ProfileComparisonContent({
  groupedProfiles,
  selection,
  showJobRole,
}: {
  groupedProfiles: string | null;
  selection?: string;
  showJobRole: boolean;
}) {
  const { completeProfileTables, error } =
    await fetchProfileTables(groupedProfiles, selection);

  return (
    <PDFLayout
      title="Working Genius"
      isLoading={false}
      error={error}
      completeProfileTables={completeProfileTables}
    >
      {completeProfileTables.map((table) => (
        <div key={table.id} className="flex flex-col gap-4">
          {completeProfileTables.length > 1 && (
            <h2 className="text-base font-semibold">{table.name}</h2>
          )}
          <WorkingGeniusTable
            profiles={table.profiles}
            optimizedImages={true}
            showJobRole={showJobRole}
          />
        </div>
      ))}
    </PDFLayout>
  );
}

export default async function WorkingGeniusPDFPage({
  searchParams,
}: {
  searchParams: Promise<{ selection?: string; groupedProfiles?: string; showJobRole?: string }>;
}) {
  const params = await searchParams;
  const groupedProfiles = params.groupedProfiles ?? null;
  const showJobRole = params.showJobRole === "true";

  return (
    <div className="w-full max-w-screen-lg mx-auto flex justify-center">
      <Suspense fallback={<div>Loading TUG Cards...</div>}>
        <ProfileComparisonContent
          selection={params.selection}
          groupedProfiles={groupedProfiles}
          showJobRole={showJobRole}
        />
      </Suspense>
    </div>
  );
}
