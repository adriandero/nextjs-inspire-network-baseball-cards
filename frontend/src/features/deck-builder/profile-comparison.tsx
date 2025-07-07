"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/components/shadcn-ui/button";
import { GoMultiSelect, GoDownload, GoLink } from "react-icons/go";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Checkbox } from "@/src/components/shadcn-ui/checkbox";
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
import { deckBuilderStoreInstance } from "./deckBuilderStore";
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
import { CompareType } from "@/src/features/deck-builder/entities/compare-type";
import SideBySide from "@/src/features/deck-builder/data-tables/side-by-side";
import PrinciplesYouArchetypesTable from "@/src/features/deck-builder/data-tables/principles-you-archetypes-table";
import { useProfileComparison } from "@/src/features/deck-builder/hooks/use-profile-comparison.hook";
import { usePDFDownload } from "@/src/features/deck-builder/hooks/use-pdf-download.hook";

export interface ProfileComparisonProps {
  readonly initialType: CompareType;
}

export function ProfileComparison({ initialType }: ProfileComparisonProps) {
  const searchParams = useSearchParams();
  const groupedProfiles = searchParams.get("groupedProfiles");

  const { completeProfileTables, isLoading, error } =
    useProfileComparison(groupedProfiles);
  const { downloadPDF, loading: pdfLoading } = usePDFDownload();

  const [selectedType, setSelectedType] = useState(initialType);
  const [showJobRole, setShowJobRole] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);

  const store = deckBuilderStoreInstance;

  const handleCopyURLToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handlePDFDownloadCall = async () => {
    try {
      const fetchURL = `/api/deckbuilder/${store.comparisonAttributesMap[selectedType].slug}/pdf?groupedProfiles=${groupedProfiles}&showJobRole=${showJobRole}`;
      const filename = `Compare-IN-${store.comparisonAttributesMap[selectedType].title}-Cards.pdf`;

      await downloadPDF(fetchURL, filename);
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };

  const comparisonTableMap = {
    [CompareType.WORKING_GENIUS]: WorkingGeniusTable,
    [CompareType.KOLBE_STRENGTHS]: KolbeStrengthsTable,
    [CompareType.KOLBE_GRAPH]: KolbeGraph,
    [CompareType.VALUES]: ValuesTable,
    [CompareType.SIDE_BY_SIDE]: SideBySide,
    [CompareType.PRINCIPLES_YOU_ARCHETYPES]: PrinciplesYouArchetypesTable,
  } as const;

  const TableComponent = comparisonTableMap[selectedType];

  if (isLoading) {
    return (
      <div className="px-6">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="animate-spin mr-2" />
          Loading TUG Cards...
        </div>
      </div>
    );
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
          <h1 className="text-lg font-bold">
            {store.comparisonAttributesMap[selectedType].title ||
              "Compare Type"}
          </h1>

          <Button variant="outline" className="flex items-center gap-2 ml-auto">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-job-role"
                checked={showJobRole}
                onCheckedChange={(checked) =>
                  setShowJobRole(checked as boolean)
                }
              />
              <label
                htmlFor="show-job-role"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show Title
              </label>
            </div>
          </Button>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-fit justify-between"
              >
                {store.comparisonAttributesMap[selectedType].title ||
                  "Compare Type"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
              <Command>
                <CommandInput placeholder="Search compare type..." />
                <CommandEmpty>No compare type found.</CommandEmpty>
                <CommandGroup>
                  {store.compareTypes.map((item) => (
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
                            : "opacity-0",
                        )}
                      />
                      {item.data.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Button variant="outline" disabled>
            <GoMultiSelect />
            <span className="hidden sm:inline">View</span>
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" onClick={handleCopyURLToClipboard}>
                  <GoLink />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Copy Link</TooltipContent>
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
