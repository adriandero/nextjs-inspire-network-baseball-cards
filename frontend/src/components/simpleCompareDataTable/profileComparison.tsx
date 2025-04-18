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
import React from "react";

// Define the props type that will be shared between all table components
export interface TableComponentProps {
  profiles: SanityDocument[];
  // Add any other props that might be needed by different table components
}

// Simplified version with direct profile support
export function ProfileComparison({
  TableComponent,
  ComponentTitle,
  initialProfiles,
  tableProps = {},
  ...rest
}: {
  TableComponent: React.ComponentType<any>;
  ComponentTitle: string;
  initialProfiles?: SanityDocument[];
  tableProps?: Record<string, any>;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) {
  const searchParams = useSearchParams();
  const profilesParam = searchParams.get("profiles");
  const [profileData, setProfileData] = useState<SanityDocument[]>(
    initialProfiles || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(!initialProfiles);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If profiles were provided directly, don't fetch from URL
    if (initialProfiles && initialProfiles.length > 0) {
      setProfileData(initialProfiles);
      setIsLoading(false);
      return;
    }

    async function fetchProfiles() {
      try {
        setIsLoading(true);

        if (profilesParam) {
          const profileUuids = profilesParam.split(",");
          const data = await getProfilesByUuids(profileUuids);
          setProfileData(data);
        }

        setIsLoading(false);
      } catch (err) {
        setError("Failed to load profile data");
        setIsLoading(false);
        console.error("Error loading profiles:", err);
      }
    }

    fetchProfiles();
  }, [profilesParam, initialProfiles]);

  const handleCopyURLToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  const [loading, setLoading] = useState(false);

  const handlePDFDownloadCall = async () => {
    try {
      setLoading(true);

      const pdfBlob = await fetch(
        `/api/generate-pdf?profiles=${profilesParam}`
      ).then((res) => res.blob());

      const blobUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Compare-IN-Baseball-Cards.pdf`;

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

  if (!TableComponent) {
    console.error("No TableComponent provided");
    return <div>Error: No table component available</div>;
  }

  return (
    <div className="px-6" {...rest}>
      {isLoading ? (
        <div>Loading profiles...</div>
      ) : error ? (
        <div>{error}</div>
      ) : profileData.length === 0 ? (
        <div>No profiles found. Please select profiles to compare.</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-center h-8 py-4 gap-2">
            <h1>{ComponentTitle}</h1>
            <Button variant="outline" className="ml-auto" disabled>
              <GoChevronDown />
              <span className=" hidden sm:inline">{ComponentTitle}</span>
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
          {React.createElement(TableComponent, {
            profiles: profileData,
            ...tableProps,
          })}
        </div>
      )}
    </div>
  );
}
