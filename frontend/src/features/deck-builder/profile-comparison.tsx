/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProfilesByUuids } from "@/src/lib/utils/sanityApi/profileRequests";
import { SanityDocument } from "next-sanity";
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
import { CompareType } from "@/src/features/deck-builder/types/compare-type";
import SideBySide from "@/src/features/deck-builder/data-tables/side-by-side";

interface ProfileTable {
  //TODO: own file
  id: string;
  name: string;
  profiles: string[]; // Array of UUIDs
}

export interface CompleteProfileTable {
  //TODO: own file
  id: string;
  name: string;
  profiles: SanityDocument[];
}

// Define the props interface
export interface ProfileComparisonProps {
  initialType: CompareType;
  tableProps?: Record<string, any>;
}

//TODO: make this one compare mode where changing the graph is only acomponent change and not a page update

export function ProfileComparison({
  initialType,
  tableProps = {},
}: ProfileComparisonProps) {
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const groupedProfiles = searchParams.get("groupedProfiles");
  const [completeProfileTables, setCompleteProfileTables] = useState<
    CompleteProfileTable[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [open, setOpen] = React.useState(false);

  const store = deckBuilderStoreInstance;

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setIsLoading(true);

        if (groupedProfiles) {
          // First, parse the URL to get the ProfileTable structure
          const tables = decodeURLToProfileTables(groupedProfiles);
          // Now fetch the complete profiles for each group sequentially
          const completeTablesPromises = tables.map(async (group) => {
            // Only fetch if there are profiles in this group
            if (group.profiles.length > 0) {
              const profileObjects = await getProfilesByUuids(group.profiles);

              return {
                id: group.id,
                name: group.name,
                profiles: profileObjects,
              };
            }

            // Return group with empty profiles array if no profiles
            return {
              id: group.id,
              name: group.name,
              profiles: [],
            };
          });

          // Wait for all groups to be processed
          const completeTables = await Promise.all(completeTablesPromises);
          setCompleteProfileTables(completeTables);
        }

        setIsLoading(false);
      } catch (err) {
        setError("Failed to load profile data");
        setIsLoading(false);
        console.error("Error loading profiles:", err);
      }
    }

    fetchProfiles();
  }, [groupedProfiles]);

  function decodeURLToProfileTables(paramString: string): ProfileTable[] {
    //TODO: extract - used in pdf
    if (!paramString) return [];

    return paramString.split(";").map((groupString) => {
      const [nameEncoded, id, profilesString] = groupString.split(":");
      console.log(nameEncoded, id, profilesString);
      const name = decodeURIComponent(nameEncoded);
      const profiles = profilesString ? profilesString.split(",") : [];

      return {
        id,
        name,
        profiles,
      };
    });
  }

  const handleCopyURLToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  const [loading, setLoading] = useState(false);
  const [showJobRole, setShowJobRole] = useState<boolean>(false);

  const handlePDFDownloadCall = async () => {
    try {
      setLoading(true);
      const fetchURL = `/api/deckbuilder/${store.comparisonAttributesMap[selectedType].slug}/pdf?groupedProfiles=${groupedProfiles}&showJobRole=${showJobRole}`;
      console.log(fetchURL);

      await fetch(fetchURL + `&warm=true`).catch(() =>
        console.log("Warm-up request completed"),
      );

      // Short delay to ensure the function is fully initialized
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Now send the actual PDF request
      const pdfBlob = await fetch(fetchURL).then((res) => res.blob());

      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Compare-IN-${store.comparisonAttributesMap[selectedType].title}-Cards.pdf`;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const [selectedType, setSelectedType] = useState(initialType);

  const comparisonTableMap = {
    [CompareType.WORKING_GENIUS]: WorkingGeniusTable,
    [CompareType.KOLBE_STRENGTHS]: KolbeStrengthsTable,
    [CompareType.KOLBE_GRAPH]: KolbeGraph,
    [CompareType.VALUES]: ValuesTable,
    [CompareType.SIDE_BY_SIDE]: SideBySide,
  };

  const TableComponent = comparisonTableMap[selectedType];

  return (
    <div className="px-6">
      {isLoading ? (
        <div>Loading TUG Cards...</div>
      ) : error ? (
        <div>{error}</div>
      ) : completeProfileTables.length === 0 ||
        completeProfileTables.every((table) => table.profiles.length === 0) ? (
        <div>No TUG Cards found. Please select TUG Cards to compare.</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-center h-8 py-4 gap-2">
            <h1 className="text-lg font-bold">
              {" "}
              {store.comparisonAttributesMap[selectedType].title ||
                "Compare Type"}{" "}
              {/* TODO: check compare type label twice -> make a variable*/}
            </h1>
            <Button
              variant="outline"
              className="flex items-center gap-2 ml-auto"
            >
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
                  <Button
                    variant="outline"
                    className=""
                    onClick={() => handleCopyURLToClipboard()}
                  >
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
                    className=""
                    onClick={() => handlePDFDownloadCall()}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" />
                      </>
                    ) : (
                      <>
                        <GoDownload />
                      </>
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
                {...tableProps}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
