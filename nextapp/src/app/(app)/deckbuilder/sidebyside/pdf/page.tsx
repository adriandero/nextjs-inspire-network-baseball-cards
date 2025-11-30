import { Suspense } from "react";
import SideBySide from "@/src/features/deck-builder/data-tables/side-by-side";
import {
  fetchProfileTables,
  shortNamesOfProfiles,
} from "@/src/lib/utils/profile-table-utils";
import { PDFLayout } from "@/src/components/layout/pdf-layout";

async function ProfileComparisonContent({
  groupedProfiles,
}: {
  groupedProfiles: string | null;
}) {
  // 🎉 One line instead of 20!
  const { completeProfileTables, error } =
    await fetchProfileTables(groupedProfiles);

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
            showJobRole={false}
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
  searchParams: Promise<{ groupedProfiles?: string }>;
}) {
  const params = await searchParams;
  const groupedProfiles = params.groupedProfiles ?? null;

  return (
    <div className="w-full max-w-screen-lg mx-auto flex justify-center">
      <Suspense fallback={<div>Loading Side by Side...</div>}>
        <ProfileComparisonContent groupedProfiles={groupedProfiles} />
      </Suspense>
    </div>
  );
}
