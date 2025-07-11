"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import KolbeGraph from "@/src/features/deck-builder/data-tables/kolbe-graph";
import { ResponsivePDFLayout } from "@/src/components/layout/pdf-layout-responsive";
import { useHeightResponsiveFont } from "@/src/hooks/deck-builder/use-height-responsive-font.hook";
import { useProfileComparison } from "@/src/features/deck-builder/hooks/use-profile-comparison.hook";
import { shortNamesOfProfiles } from "@/src/lib/utils/profile-table-utils";

function ProfileComparisonContent() {
  const searchParams = useSearchParams();
  const groupedProfiles = searchParams.get("groupedProfiles");

  const { isLoading, completeProfileTables, error } =
    useProfileComparison(groupedProfiles);

  const { containerRef, baseFontSize, headingFontSize, breakUpGraph } =
    useHeightResponsiveFont(!isLoading && completeProfileTables.length > 0);

  return (
    <ResponsivePDFLayout
      ref={containerRef}
      title="Kolbe Strengths"
      isLoading={isLoading}
      error={error}
      completeProfileTables={completeProfileTables}
      baseFontSize={baseFontSize}
      headingFontSize={headingFontSize}
    >
      {completeProfileTables.map((table) => (
        <div key={table.id} className="flex flex-col gap-4">
          <KolbeGraph
            profiles={shortNamesOfProfiles(table.profiles)}
            tableName={table.name}
            baseFontSize={baseFontSize}
            headingFontSize={headingFontSize}
            breakUpGraph={breakUpGraph}
          />
        </div>
      ))}
    </ResponsivePDFLayout>
  );
}

function PDFProfileComparison() {
  return (
    <Suspense fallback={<div>Loading Kolbe Graph...</div>}>
      <ProfileComparisonContent />
    </Suspense>
  );
}

export default function KolbeStrengthsPDFPage() {
  return (
    <div className="w-full max-w-screen-lg mx-auto flex justify-center">
      <PDFProfileComparison />
    </div>
  );
}
