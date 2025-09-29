"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PDFLayout } from "@/src/components/layout/pdf-layout";
import { useProfileComparisonServerSide } from "@/src/features/deck-builder/hooks/use-profile-comparison-server-side.hook";
import PrinciplesYouArchetypesGraph from "@/src/features/deck-builder/data-tables/principles-you-archetypes-graph";

function ProfileComparisonContent() {
  const searchParams = useSearchParams();
  const groupedProfiles = searchParams.get("groupedProfiles");

  const { isLoading, completeProfileTables, error } =
    useProfileComparisonServerSide(groupedProfiles);

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
          <PrinciplesYouArchetypesGraph
            profiles={table.profiles}
            optimizedImages={true}
            showPrimaryOnly={false}
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

export default function PrinciplesYouArchetypeGraphPDFPage() {
  return (
    <div className="w-full max-w-screen-lg mx-auto flex justify-center">
      <PDFProfileComparison />
    </div>
  );
}
