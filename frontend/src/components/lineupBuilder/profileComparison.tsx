/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { getProfilesByUuids } from "@/lib/utils/sanityApi/profileRequests";
import { SanityDocument } from "next-sanity";
import { Button } from "@/components/ui/button";
import { GoMultiSelect, GoShare, GoDownload } from "react-icons/go";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import React from "react";
import { CompareType, lineupBuilderStoreInstance } from "./lineupBuilderStore";

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
  TableComponent: React.ComponentType<any>;
  tableTitle: string;
  tableSlug: string;
  tableProps?: Record<string, any>;
}

//TODO: make this one compare mode where changing the graph is only acomponent change and not a page update

export function ProfileComparison({
  TableComponent,
  tableTitle,
  tableSlug,
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

  const [currentCompareType, setCompareType] = useState<CompareType | null>(
    null
  );

  const store = lineupBuilderStoreInstance;

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
      const fetchURL = `/api/lineupbuilder/${tableSlug}/pdf?groupedProfiles=${groupedProfiles}&showJobRole=${showJobRole}`;
      console.log(fetchURL);

      await fetch(fetchURL + `&warm=true`).catch(() =>
        console.log("Warm-up request completed")
      );

      // Short delay to ensure the function is fully initialized
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Now send the actual PDF request
      const pdfBlob = await fetch(fetchURL).then((res) => res.blob());

      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Compare-IN-${tableTitle}-Cards.pdf`;
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

  const handleCompareTypeSelect = (type: CompareType) => {
    store.setCompareType(type);
    setCompareType(type);
    setOpen(false);
    const currentUrl = new URL(window.location.href);
    const pathParts = currentUrl.pathname.split("/");
    pathParts[pathParts.length - 1] = type;
    const newUrl = `${currentUrl.origin}${pathParts.join("/")}${currentUrl.search}`;

    redirect(newUrl);
  };

  return (
    <div className="px-6">
      {isLoading ? (
        <div>Loading profiles...</div>
      ) : error ? (
        <div>{error}</div>
      ) : completeProfileTables.length === 0 ||
        completeProfileTables.every((table) => table.profiles.length === 0) ? (
        <div>No profiles found. Please select profiles to compare.</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-center h-8 py-4 gap-2">
            <h1 className="text-lg font-bold">{tableTitle}</h1>
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
                  {store.getCompareTypeLabel() || "Compare Type"}
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
                        value={item.label}
                        onSelect={() => handleCompareTypeSelect(item.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            currentCompareType === item.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {item.label}
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
            <Button
              variant="outline"
              className=""
              onClick={() => handleCopyURLToClipboard()}
            >
              <GoShare />
            </Button>
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
          </div>

          {completeProfileTables.map((table) => (
            <div key={table.id} className="flex flex-col gap-4">
              <h2 className="text-base font-semibold">{table.name}</h2>
              <TableComponent
                profiles={table.profiles}
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
