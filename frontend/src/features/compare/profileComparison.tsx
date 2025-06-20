// TODO: Depricated
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProfilesByUuids } from "@/src/lib/utils/sanityApi/profileRequests";
import { SanityDocument } from "next-sanity";
import { Button } from "@/src/components/ui/button";
import {
  GoChevronDown,
  GoMultiSelect,
  GoShare,
  GoDownload,
} from "react-icons/go";
import { Loader2 } from "lucide-react";

// Define the props interface
interface ProfileComparisonProps {
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
  const searchParams = useSearchParams();
  const profiles = searchParams.get("profiles");
  const [profileData, setProfileData] = useState<SanityDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setIsLoading(true);

        if (profiles) {
          const profileUuids = profiles.split(",");
          const data = await getProfilesByUuids(profileUuids);
          setProfileData(data);
        }

        setIsLoading(false);
      } catch (err) {
        setError("Failed to load TUG Card data");
        setIsLoading(false);
        console.error("Error loading TUG Cards:", err);
      }
    }

    fetchProfiles();
  }, [profiles]);

  const handleCopyURLToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  const [loading, setLoading] = useState(false);

  const handlePDFDownloadCall = async () => {
    try {
      setLoading(true);

      // First, send a warm-up request to initialize the serverless function
      await fetch(
        `/api/compare/${tableSlug}/pdf?profiles=${profiles?.split(",")[0]}&warm=true`
      ).catch(() => console.log("Warm-up request completed"));

      // Short delay to ensure the function is fully initialized
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Now send the actual PDF request
      const pdfBlob = await fetch(
        `/api/compare/${tableSlug}/pdf?profiles=${profiles}`
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

  console.log(profileData);

  return (
    <div className="px-6">
      {isLoading ? (
        <div>Loading TUG Cards...</div>
      ) : error ? (
        <div>{error}</div>
      ) : profileData.length === 0 ? (
        <div>No TUG Cards found. Please select TUG Cards to compare.</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-center h-8 py-4 gap-2">
            <h1>{tableTitle}</h1>
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
          <TableComponent profiles={profileData} {...tableProps} />
        </div>
      )}
    </div>
  );
}
