"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProfilesByUuids } from "@/lib/utils/sanityApi/profileRequests";
import WorkingGeniusTable from "@/components/simpleCompareDataTable/workingGeniusTable";
import { SanityDocument } from "next-sanity";
import { Button } from "@/components/ui/button";
import {
  GoChevronDown,
  GoMultiSelect,
  GoShare,
  GoDownload,
} from "react-icons/go";
import { Loader2 } from "lucide-react";

export function ProfileComparison() {
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
        setError("Failed to load profile data");
        setIsLoading(false);
        console.error("Error loading profiles:", err);
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

      const pdfBlob = await fetch(
        `/api/generate-pdf?profiles=${profiles}`
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

  return (
    <div className="px-6">
      {isLoading ? (
        <div>Loading profiles...</div>
      ) : error ? (
        <div>{error}</div>
      ) : profileData.length === 0 ? (
        <div>No profiles found. Please select profiles to compare.</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-center h-8 py-4 gap-2">
            <h1>Working Genius</h1>
            <Button variant="outline" className="ml-auto" disabled>
              <GoChevronDown />

              <span className=" hidden sm:inline">Working Genius</span>
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
              {/* <span className=" hidden sm:inline"></span> */}
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
              {/* <span className=" hidden sm:inline"></span> */}
            </Button>
          </div>
          <WorkingGeniusTable profiles={profileData} />
        </div>
      )}
    </div>
  );
}
