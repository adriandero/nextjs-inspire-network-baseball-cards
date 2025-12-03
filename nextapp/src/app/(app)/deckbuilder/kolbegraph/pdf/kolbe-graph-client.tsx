"use client";

import { useHeightResponsiveFont } from "@/src/hooks/deck-builder/use-height-responsive-font.hook";
import { ResponsivePDFLayout } from "@/src/components/layout/pdf-layout-responsive";
import KolbeGraph from "@/src/features/deck-builder/data-tables/kolbe-graph";
import { shortNamesOfProfiles } from "@/src/lib/utils/profile-table-utils";
import { ProfileTable } from "@/src/features/deck-builder/entities/profile-table.model";

interface KolbeGraphClientProps {
  completeProfileTables: ProfileTable[];
  error: string | null;
}

export default function KolbeGraphClient({
  completeProfileTables,
  error,
}: KolbeGraphClientProps) {
  const { containerRef, baseFontSize, headingFontSize } =
    useHeightResponsiveFont(completeProfileTables.length > 0);

  return (
    <ResponsivePDFLayout
      ref={containerRef}
      title="Kolbe Strengths"
      isLoading={false}
      error={error}
      completeProfileTables={completeProfileTables}
      baseFontSize={baseFontSize}
      headingFontSize={headingFontSize}
    >
      {completeProfileTables.map((table, index) => (
        <div key={index} className="flex flex-col gap-4">
          <KolbeGraph
            profiles={shortNamesOfProfiles(table.profiles)}
            tableName={table.name}
            baseFontSize={baseFontSize}
            headingFontSize={headingFontSize}
            className={`${index !== 0 ? "break-inside-avoid" : ""}`}
          />
        </div>
      ))}
    </ResponsivePDFLayout>
  );
}
