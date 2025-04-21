"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getProfilesByUuids } from "@/lib/utils/sanityApi/profileRequests";
import WorkingGeniusTable from "@/components/compare/dataTables/workingGeniusTable";
import { SanityDocument } from "next-sanity";
import Image from "next/image";
import INTMLogo from "@/../public/IN-TM-Logo.png";

// Content component that uses useSearchParams
function ProfileComparisonContent() {
  const searchParams = useSearchParams();
  const profiles = searchParams.get("profiles");
  const [profileData, setProfileData] = useState<SanityDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        setIsLoading(false);
        console.error("Error loading profiles:", err);
      }
    }

    fetchProfiles();

    // This tells Puppeteer when the content is ready to be captured
    const checkIfReady = setInterval(() => {
      if (!isLoading) {
        document.body.setAttribute("data-render-ready", "true");
        clearInterval(checkIfReady);
      }
    }, 100);

    return () => clearInterval(checkIfReady);
  }, [profiles, isLoading]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "numeric",
    year: "numeric",
  });

  return (
    <div className="px-6 py-10 print:p-0 gap-4 flex flex-col max-w-[762px] w-[762px] max-h-[1123px] h-[1123px]">
      <div className="flex items-center text-center gap-4">
        <h1 className="text-2xl font-bold">Compare - Working Genius</h1>
        <span className="text-base ml-auto text-accent-foreground font-bold">
          {currentDate}
        </span>
        <Image src={INTMLogo} width={70} height={150} alt="Company Logo" />
      </div>

      {profileData.length === 0 ? (
        <div>No profiles found. Please select profiles to compare.</div>
      ) : (
        <WorkingGeniusTable profiles={profileData} />
      )}
    </div>
  );
}

// Wrapper with Suspense
function PDFProfileComparison() {
  return (
    <Suspense fallback={<div>Loading profiles...</div>}>
      <ProfileComparisonContent />
    </Suspense>
  );
}

// PDF page component
export default function WorkingGeniusPDFPage() {
  return (
    <div className="w-full max-w-screen-lg mx-auto flex justify-center">
      <PDFProfileComparison />
    </div>
  );
}
