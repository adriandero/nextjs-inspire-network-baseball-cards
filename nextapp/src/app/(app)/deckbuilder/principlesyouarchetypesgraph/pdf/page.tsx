// Remove "use client" directive!
import { Suspense } from "react";
import { PDFLayout } from "@/src/components/layout/pdf-layout";
import { fetchProfileTables } from "@/src/lib/deck-builder/selections";
import PrinciplesYouArchetypesGraph from "@/src/features/deck-builder/data-tables/principles-you-archetypes-graph";

async function ProfileComparisonContent({
  groupedProfiles,
  selection,
  showPrimaryOnly,
}: {
  groupedProfiles: string | null;
  selection?: string;
  showPrimaryOnly: boolean;
}) {
  const { completeProfileTables, error } =
    await fetchProfileTables(groupedProfiles, selection);

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
            showPrimaryOnly={showPrimaryOnly}
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
  searchParams: Promise<{ showPrimaryOnly?: string; selection?: string; groupedProfiles?: string }>;
}) {
  const params = await searchParams;
  const groupedProfiles = params.groupedProfiles ?? null;

  return (
    <div className="w-full max-w-screen-lg mx-auto flex justify-center">
      <Suspense fallback={<div>Loading TUG Cards...</div>}>
        <ProfileComparisonContent showPrimaryOnly={params.showPrimaryOnly === "true"} selection={params.selection} groupedProfiles={groupedProfiles} />
      </Suspense>
    </div>
  );
}
