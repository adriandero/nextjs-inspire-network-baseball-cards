import { fetchProfileTables } from "@/src/lib/deck-builder/selections";
import { Suspense } from "react";
import SideBySide from "@/src/features/deck-builder/data-tables/side-by-side";
import {
  shortNamesOfProfiles,
} from "@/src/lib/utils/profile-table-utils";
import { PDFLayout } from "@/src/components/layout/pdf-layout";

async function ProfileComparisonContent({
  groupedProfiles,
  selection,
  showJobRole,
}: {
  groupedProfiles: string | null;
  selection?: string;
  showJobRole: boolean;
}) {
  // 🎉 One line instead of 20!
  const { completeProfileTables, error } =
    await fetchProfileTables(groupedProfiles, selection);

  return (
    <PDFLayout
      title="Side by Side"
      isLoading={false}
      error={error}
      completeProfileTables={completeProfileTables}
    >
      {completeProfileTables.map((table) => (
        <div key={table.id} className="flex flex-col gap-4">
          <SideBySide
            profiles={shortNamesOfProfiles(table.profiles)}
            tableName={table.name}
            showJobRole={showJobRole}
            columnCount={3}
          />
        </div>
      ))}
    </PDFLayout>
  );
}

export default async function SideBySidePDFPage({
  searchParams,
}: {
  searchParams: Promise<{ showJobRole?: string; selection?: string; groupedProfiles?: string }>;
}) {
  const params = await searchParams;
  const groupedProfiles = params.groupedProfiles ?? null;

  return (
    <div className="w-full max-w-screen-lg mx-auto flex justify-center">
      <Suspense fallback={<div>Loading Side by Side...</div>}>
        <ProfileComparisonContent showJobRole={params.showJobRole === "true"} selection={params.selection} groupedProfiles={groupedProfiles} />
      </Suspense>
    </div>
  );
}
