// Remove "use client" directive!
import { Suspense } from "react";
import { PDFLayout } from "@/src/components/layout/pdf-layout";
import { fetchProfileTables } from "@/src/lib/utils/profile-table-utils";
import PrinciplesYouArchetypesGraph from "@/src/features/deck-builder/data-tables/principles-you-archetypes-graph";

async function ProfileComparisonContent({
  groupedProfiles,
}: {
  groupedProfiles: string | null;
}) {
  const { completeProfileTables, error } =
    await fetchProfileTables(groupedProfiles);

  return (
    <PDFLayout
      title="PrinciplesYou Archetypes"
      isLoading={false}
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
            baseFontSize="text-sm"
            headingFontSize="text-md"
            titleFonteSize="text-lg"
          />
        </div>
      ))}
    </PDFLayout>
  );
}

export default async function PrinciplesYouArchetypeGraphPDFPage({
  searchParams,
}: {
  searchParams: Promise<{ groupedProfiles?: string }>;
}) {
  const params = await searchParams;
  const groupedProfiles = params.groupedProfiles ?? null;

  return (
    <div className="w-full max-w-screen-lg mx-auto flex justify-center">
      <Suspense fallback={<div>Loading TUG Cards...</div>}>
        <ProfileComparisonContent groupedProfiles={groupedProfiles} />
      </Suspense>
    </div>
  );
}
