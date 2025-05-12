/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProfilesByUuids } from "@/lib/utils/sanityApi/profileRequests";
import { SanityDocument } from "next-sanity";
import { Button } from "@/components/ui/button";
import {
  GoChevronDown,
  GoMultiSelect,
  GoShare,
  GoDownload,
} from "react-icons/go";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";

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

export function ProfileComparison({
  TableComponent,
  tableTitle,
  tableSlug,
  tableProps = {},
}: ProfileComparisonProps) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const groupedProfiles = searchParams.get("groupedProfiles");
  const [completeProfileTables, setCompleteProfileTables] = useState<
    CompleteProfileTable[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    // Show toast notification
    toast({
      title: "Link copied!",
      description: "URL has been copied to clipboard",
      duration: 3000, // 3 seconds
    });
  };

  const [loading, setLoading] = useState(false);

  const handlePDFDownloadCall = async () => {
    try {
      setLoading(true);
      // First, send a warm-up request to initialize the serverless function
      console.log(
        `/api/lineupbuilder/${tableSlug}/pdf?groupedProfiles=${groupedProfiles}&warm=true`
      );
      await fetch(
        `/api/lineupbuilder/${tableSlug}/pdf?groupedProfiles=${groupedProfiles}&warm=true`
      ).catch(() => console.log("Warm-up request completed"));
      // Short delay to ensure the function is fully initialized
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Now send the actual PDF request
      const pdfBlob = await fetch(
        `/api/lineupbuilder/${tableSlug}/pdf?groupedProfiles=${groupedProfiles}`
      ).then((res) => res.blob());
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
            <Button variant="outline" className="ml-auto" disabled>
              <GoChevronDown />
              <span className="hidden sm:inline">{tableTitle}</span>
            </Button>
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
              <TableComponent profiles={table.profiles} {...tableProps} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
