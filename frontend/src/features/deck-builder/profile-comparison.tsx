"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/components/shadcn-ui/button";
import WorkingGeniusTable from "@/src/features/deck-builder/data-tables/working-genius-table";
import KolbeStrengthsTable from "@/src/features/deck-builder/data-tables/kolbe-strengths-table";
import KolbeGraph from "@/src/features/deck-builder/data-tables/kolbe-graph";
import ValuesTable from "@/src/features/deck-builder/data-tables/values-table";
import {
  CompareTypes,
  COMPARISON_ATTRIBUTES,
} from "@/src/features/deck-builder/entities/compare-types";
import SideBySide from "@/src/features/deck-builder/data-tables/side-by-side";
import PrinciplesYouArchetypesTable from "@/src/features/deck-builder/data-tables/principles-you-archetypes-table";
import { useProfileComparison } from "@/src/features/deck-builder/hooks/use-profile-comparison.hook";
import { usePDFDownload } from "@/src/features/deck-builder/hooks/use-pdf-download.hook";
import {
  Skeleton,
  ComparisonTableSkeleton,
} from "@/src/components/custom-ui/table-skeleton";
import { filterProfilesByArchetype } from "@/src/features/deck-builder/utils/profile-filters";
import { Toolbar } from "@/src/features/deck-builder/components/toolbar";

export interface ProfileComparisonProps {
  readonly initialType: CompareTypes;
}

const ComparisonLoadingSkeleton = () => (
  <div className="px-6">
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center h-8 py-4 gap-2">
        <Skeleton className="h-6 w-32 mr-auto" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
      </div>

      <ComparisonTableSkeleton />
      <ComparisonTableSkeleton />
    </div>
  </div>
);

export function ProfileComparison({ initialType }: ProfileComparisonProps) {
  const searchParams = useSearchParams();
  const groupedProfiles = searchParams.get("groupedProfiles");

  const { completeProfileTables, isLoading, error } =
    useProfileComparison(groupedProfiles);
  const { downloadPDF, loading: pdfLoading } = usePDFDownload();

  // Component state
  const [selectedType, setSelectedType] = useState(initialType);
  const [showJobRole, setShowJobRole] = useState<boolean>(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Reset filters when switching away from PrinciplesYou Archetypes
  useEffect(() => {
    if (selectedType !== CompareTypes.PRINCIPLES_YOU_ARCHETYPES) {
      setSelectedFilters([]);
    }
  }, [selectedType]);

  const handlePDFDownloadCall = async () => {
    try {
      const fetchURL = `/api/deckbuilder/${COMPARISON_ATTRIBUTES[selectedType].slug}/pdf?groupedProfiles=${groupedProfiles}&showJobRole=${showJobRole}`;
      const filename = `Compare - ${COMPARISON_ATTRIBUTES[selectedType].title} - TUG Cards.pdf`;

      await downloadPDF(fetchURL, filename);
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };

  const comparisonTableMap = {
    [CompareTypes.WORKING_GENIUS]: WorkingGeniusTable,
    [CompareTypes.KOLBE_STRENGTHS]: KolbeStrengthsTable,
    [CompareTypes.KOLBE_GRAPH]: KolbeGraph,
    [CompareTypes.VALUES]: ValuesTable,
    [CompareTypes.SIDE_BY_SIDE]: SideBySide,
    [CompareTypes.PRINCIPLES_YOU_ARCHETYPES]: PrinciplesYouArchetypesTable,
  } as const;

  const TableComponent = comparisonTableMap[selectedType];

  // Loading state
  if (isLoading) {
    return <ComparisonLoadingSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="px-6">
        <div className="text-red-500 p-4">
          Error: {error}
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="ml-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (
    completeProfileTables.length === 0 ||
    completeProfileTables.every((table) => table.profiles.length === 0)
  ) {
    return (
      <div className="px-6">
        <div className="text-center p-8">
          No TUG Cards found. Please select TUG Cards to compare.
        </div>
      </div>
    );
  }

  return (
    <div className="px-6">
      <div className="flex flex-col gap-4">
        <Toolbar
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          showJobRole={showJobRole}
          onShowJobRoleChange={setShowJobRole}
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
          groupedProfiles={groupedProfiles}
          pdfLoading={pdfLoading}
          onPDFDownload={handlePDFDownloadCall}
        />

        {completeProfileTables.map((table) => {
          // Apply filtering for PrinciplesYou Archetypes
          const filteredProfiles =
            selectedType === CompareTypes.PRINCIPLES_YOU_ARCHETYPES
              ? filterProfilesByArchetype(table.profiles, {
                  selectedArchetypes: selectedFilters,
                })
              : table.profiles;

          return (
            <div key={table.id} className="flex flex-col">
              <TableComponent
                profiles={filteredProfiles}
                tableName={table.name}
                showJobRole={showJobRole}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
