"use client";

import { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { createSelection } from "./api/selections";
import { parseProfileTablesFromURL } from "@/src/lib/utils/profile-table-utils";
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
import { Toolbar } from "@/src/features/deck-builder/components/toolbar";
import PrinciplesYouArchetypesGraph from "@/src/features/deck-builder/data-tables/principles-you-archetypes-graph";
import {
  useComparisonFilters,
  UsedFilters,
} from "@/src/features/deck-builder/hooks/use-comparison-filters";

export interface ProfileComparisonProps {
  readonly initialType: CompareTypes;
}
type ComponentProps = Partial<{
  showJobRole: boolean;
  showPrimaryOnly: boolean;
}>;

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const groupedProfiles = searchParams.get("groupedProfiles");
  const selection = searchParams.get("selection");
  const [pdfError, setPDFError] = useState<string | null>(null);

  const { completeProfileTables, isLoading, error } =
    useProfileComparison(groupedProfiles, selection);
  const {
    downloadPDF,
    downloadAllPDFs,
    loading: pdfLoading,
  } = usePDFDownload();

  const selectedType = Object.values(CompareTypes).find(
    (type) => COMPARISON_ATTRIBUTES[type].slug === pathname.split("/")[2],
  ) ?? initialType;

  const { filters, setters, applyFilters, availableFilters } =
    useComparisonFilters(selectedType);

  // Upgrade legacy links before exporting so neither API nor Chromium URLs carry UUID lists.
  const selectionForExport = async () => {
    if (selection) return selection;
    if (!groupedProfiles) throw new Error("Please select TUG Cards to compare");
    const id = await createSelection(parseProfileTablesFromURL(groupedProfiles));
    const url = new URL(window.location.href);
    url.searchParams.delete("groupedProfiles");
    url.searchParams.set("selection", id);
    window.history.replaceState(null, "", url);
    return id;
  };

  const handlePDFDownloadCall = async () => {
    setPDFError(null);
    try {
      const id = await selectionForExport();
      const fetchURL = `/api/deckbuilder/${COMPARISON_ATTRIBUTES[selectedType].slug}/pdf?${new URLSearchParams({
        selection: id,
        showJobRole: String(filters.showJobRole),
        showPrimaryOnly: String(filters.showPrimaryOnly),
      })}`;
      await downloadPDF(fetchURL, `Compare - ${COMPARISON_ATTRIBUTES[selectedType].title} - TUG Cards.pdf`);
    } catch (error) {
      setPDFError(error instanceof Error ? error.message : "Failed to download PDF");
    }
  };

  const handlePDFDownloadAllCall = async () => {
    setPDFError(null);
    try {
      await downloadAllPDFs(await selectionForExport(), filters.showJobRole, filters.showPrimaryOnly);
    } catch (error) {
      setPDFError(error instanceof Error ? error.message : "Failed to download PDFs");
    }
  };

  const comparisonTableMap = {
    [CompareTypes.WORKING_GENIUS]: WorkingGeniusTable,
    [CompareTypes.KOLBE_STRENGTHS]: KolbeStrengthsTable,
    [CompareTypes.KOLBE_GRAPH]: KolbeGraph,
    [CompareTypes.VALUES]: ValuesTable,
    [CompareTypes.SIDE_BY_SIDE]: SideBySide,
    [CompareTypes.PRINCIPLES_YOU_ARCHETYPES]: PrinciplesYouArchetypesTable,
    [CompareTypes.PRINCIPLES_YOU_ARCHETYPES_GRAPH]:
      PrinciplesYouArchetypesGraph,
  } as const;

  const TableComponent = comparisonTableMap[selectedType];

  const filteredTables = useMemo(() => {
    return completeProfileTables.map((table) => ({
      ...table,
      profiles: applyFilters(table.profiles),
    }));
  }, [completeProfileTables, applyFilters]);

  const getComponentProps = (type: CompareTypes, filters: UsedFilters) => {
    const config = COMPARISON_ATTRIBUTES[type];
    const props: ComponentProps = {};

    config.componentProps?.forEach((prop) => {
      switch (prop) {
        case "showJobRole":
          props.showJobRole = filters.showJobRole ?? false;
          break;
        case "showPrimaryOnly":
          props.showPrimaryOnly = filters.showPrimaryOnly ?? false;
          break;
      }
    });

    return props; // ← NEW OBJECT!
  };

  const onTypeChange = (type: CompareTypes) => {
    const newUrl = `/deckbuilder/${COMPARISON_ATTRIBUTES[type].slug}?${searchParams.toString()}`;

    window.history.pushState({}, "", newUrl);
  };

  const componentProps = useMemo(() => {
    return getComponentProps(selectedType, filters);
  }, [selectedType, filters]);

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
          onTypeChange={onTypeChange}
          groupedProfiles={groupedProfiles}
          pdfLoading={pdfLoading}
          onPDFDownload={handlePDFDownloadCall}
          onPDFDownloadAll={handlePDFDownloadAllCall} // ← NEW
          availableFilters={availableFilters}
          filters={filters}
          setters={setters}
        />

        {pdfError && <p role="alert" className="text-red-500">{pdfError}</p>}

        {filteredTables.map((table) => (
          <div key={table.id} className="flex flex-col">
            <TableComponent
              profiles={table.profiles}
              tableName={table.name}
              {...componentProps}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
