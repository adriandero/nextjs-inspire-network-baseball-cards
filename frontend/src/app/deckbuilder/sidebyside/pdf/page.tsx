"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { shortNamesOfProfiles } from "@/src/lib/utils/profile-table-utils";
import SideBySide from "@/src/features/deck-builder/data-tables/side-by-side";
import { PDFLayout } from "@/src/components/layout/pdf-layout";
import { useProfileComparisonServerSide } from "@/src/features/deck-builder/hooks/use-profile-comparison-server-side.hook";

function ProfileComparisonContent() {
  const searchParams = useSearchParams();
  const groupedProfiles = searchParams.get("groupedProfiles");

  const { isLoading, completeProfileTables, error } =
  useProfileComparisonServerSide(groupedProfiles);

  return (
    <PDFLayout
      title="Kolbe Strengths"
      isLoading={isLoading}
      error={error}
      completeProfileTables={completeProfileTables}
    >
      {completeProfileTables.map((table) => (
        <div key={table.id} className="flex flex-col gap-4">
          <SideBySide
            profiles={shortNamesOfProfiles(table.profiles)}
            tableName={table.name}
            showJobRole={false}
          />
        </div>
      ))}
    </PDFLayout>
  );
}

function PDFProfileComparison() {
  return (
    <Suspense fallback={<div>Loading Side by Side...</div>}>
      <ProfileComparisonContent />
    </Suspense>
  );
}

export default function SideBySidePDFPage() {
  return (
    <div className="w-full max-w-screen-lg mx-auto flex justify-center">
      <PDFProfileComparison />
    </div>
  );
}
