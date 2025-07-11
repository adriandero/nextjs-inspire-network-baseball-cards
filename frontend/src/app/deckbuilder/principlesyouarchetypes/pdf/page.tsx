"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PrinciplesYouArchetypeTable from "@/src/features/deck-builder/data-tables/principles-you-archetypes-table";
import { PDFLayout } from "@/src/components/layout/pdf-layout";
import { useProfileComparison } from "@/src/features/deck-builder/hooks/use-profile-comparison.hook";

function ProfileComparisonContent() {
  const searchParams = useSearchParams();
  const groupedProfiles = searchParams.get("groupedProfiles");
  const showJobRoleParam = searchParams.get("showJobRole");
  const showJobRole = showJobRoleParam === "true";

  const { isLoading, completeProfileTables, error } =
    useProfileComparison(groupedProfiles);

  return (
    <PDFLayout
      title="PrinciplesYou Archetypes"
      isLoading={isLoading}
      error={error}
      completeProfileTables={completeProfileTables}
    >
      {completeProfileTables.map((table) => (
        <div key={table.id} className="flex flex-col gap-4">
          {completeProfileTables.length > 1 && (
            <h2 className="text-base font-semibold">{table.name}</h2>
          )}
          <PrinciplesYouArchetypeTable
            profiles={table.profiles}
            optimizedImages={true}
            showJobRole={showJobRole}
          />
        </div>
      ))}
    </PDFLayout>
  );
}

function PDFProfileComparison() {
  return (
    <Suspense fallback={<div>Loading TUG Cards...</div>}>
      <ProfileComparisonContent />
    </Suspense>
  );
}

export default function PrinciplesYouArchetypePDFPage() {
  return (
    <div className="w-full max-w-screen-lg mx-auto flex justify-center">
      <PDFProfileComparison />
    </div>
  );
}
