"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getProfilesByUuids } from "@/lib/utils/sanityApi/profileRequests";
import WorkingGeniusTable from "@/components/simpleCompareDataTable/workingGeniusTable";
import NavBar from "@/components/NavBar";
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

  const handleDownloadPDF = () => {
    // Instead of navigating to the PDF page, call our API route
    const apiUrl = `/api/generate-pdf?profiles=${profiles}`;

    // This will trigger a file download
    window.location.href = apiUrl;

    // Alternative approach: show loading state
    // const downloadButton = document.getElementById('download-button');
    // if (downloadButton) {
    //   downloadButton.textContent = 'Generating PDF...';
    //   downloadButton.disabled = true;
    //
    //   fetch(apiUrl)
    //     .then(response => response.blob())
    //     .then(blob => {
    //       // Create a link to download the PDF
    //       const url = window.URL.createObjectURL(blob);
    //       const a = document.createElement('a');
    //       a.style.display = 'none';
    //       a.href = url;
    //       a.download = `working-genius-comparison-${new Date().toISOString().split('T')[0]}.pdf`;
    //       document.body.appendChild(a);
    //       a.click();
    //       window.URL.revokeObjectURL(url);
    //     })
    //     .finally(() => {
    //       // Reset button state
    //       if (downloadButton) {
    //         downloadButton.textContent = 'Download as PDF';
    //         downloadButton.disabled = false;
    //       }
    //     });
    // }
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

// Main page component with Suspense boundary
export default function WorkingGeniusPage() {
  return (
    <div className="w-full max-w-screen-lg">
      <NavBar _id={""} _rev={""} _type={""} _createdAt={""} _updatedAt={""} />
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileComparison />
      </Suspense>
    </div>
  );
}
