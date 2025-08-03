"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/components/shadcn-ui/button";
import { GoMultiSelect, GoDownload, GoLink } from "react-icons/go";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/shadcn-ui/popover";
import { cn } from "@/src/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/src/components/shadcn-ui/command";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/shadcn-ui/tooltip";
import WorkingGeniusTable from "@/src/features/deck-builder/data-tables/working-genius-table";
import KolbeStrengthsTable from "@/src/features/deck-builder/data-tables/kolbe-strengths-table";
import KolbeGraph from "@/src/features/deck-builder/data-tables/kolbe-graph";
import ValuesTable from "@/src/features/deck-builder/data-tables/values-table";
import {
  COMPARE_TYPE_OPTIONS,
  CompareTypes,
  COMPARISON_ATTRIBUTES,
} from "@/src/features/deck-builder/entities/compare-types";
import SideBySide from "@/src/features/deck-builder/data-tables/side-by-side";
import PrinciplesYouArchetypesTable from "@/src/features/deck-builder/data-tables/principles-you-archetypes-table";
import { useProfileComparison } from "@/src/features/deck-builder/hooks/use-profile-comparison.hook";
import { usePDFDownload } from "@/src/features/deck-builder/hooks/use-pdf-download.hook";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/src/components/shadcn-ui/dropdown-menu";
import {
  Skeleton,
  ComparisonTableSkeleton,
} from "@/src/components/custom-ui/table-skeleton"; // Adjust path as needed

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

  const [selectedType, setSelectedType] = useState(initialType);
  const [showJobRole, setShowJobRole] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [recentlyCopied, setRecentlyCopied] = useState<boolean>(false);

  const handleCopyURLToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setRecentlyCopied(true);

      setTimeout(() => {
        setRecentlyCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handlePDFDownloadCall = async () => {
    try {
      const fetchURL = `api/deckbuilder/${COMPARISON_ATTRIBUTES[selectedType].slug}/pdf?groupedProfiles=${groupedProfiles}&showJobRole=${showJobRole}`;
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

  // Show skeleton while loading
  if (isLoading) {
    return <ComparisonLoadingSkeleton />;
  }

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
        <div className="flex w-full items-center h-8 py-4 gap-2">
          <h1 className="text-lg font-bold mr-auto">
            {COMPARISON_ATTRIBUTES[selectedType].title || "Compare Type"}
          </h1>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-fit justify-between"
              >
                {COMPARISON_ATTRIBUTES[selectedType].title || "Compare Type"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
              <Command>
                <CommandInput placeholder="Search compare type..." />
                <CommandEmpty>No compare type found.</CommandEmpty>
                <CommandGroup>
                  {COMPARE_TYPE_OPTIONS.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.data.title}
                      onSelect={() => setSelectedType(item.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedType === item.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {item.data.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <GoMultiSelect />
                <span className="hidden sm:inline">View</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={showJobRole}
                onCheckedChange={(checked) =>
                  setShowJobRole(checked as boolean)
                }
              >
                Show Title
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipProvider>
            <Tooltip open={recentlyCopied ? true : undefined}>
              <TooltipTrigger>
                <Button variant="outline" onClick={handleCopyURLToClipboard}>
                  {recentlyCopied ? (
                    <Check className="text-primary" />
                  ) : (
                    <GoLink />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {recentlyCopied ? "Copied!" : "Copy Link"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  onClick={handlePDFDownloadCall}
                  disabled={pdfLoading}
                >
                  {pdfLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <GoDownload />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Download PDF</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {completeProfileTables.map((table) => (
          <div key={table.id} className="flex flex-col">
            <TableComponent
              profiles={table.profiles}
              tableName={table.name}
              showJobRole={showJobRole}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
