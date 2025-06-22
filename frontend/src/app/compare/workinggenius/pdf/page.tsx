"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getProfilesByUuids } from "@/src/lib/utils/sanityApi/profileRequests";
import WorkingGeniusTable from "@/src/features/deck-builder/data-tables/working-genius-table";
import { SanityDocument } from "next-sanity";
import Image from "next/image";
import INTMLogo from "@/public/images/in-tug-card-logo.png";

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
        console.error("Error loading TUG Cards:", err);
      }
    }

    fetchProfiles();

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
        <WorkingGeniusTable
          profiles={profileData}
          optimizedImages={true}
          showJobRole={true}
        />
      )}
    </div>
  );
}

function PDFProfileComparison() {
  return (
    <Suspense fallback={<div>Loading TUG Cards...</div>}>
      <ProfileComparisonContent />
    </Suspense>
  );
}

export default function WorkingGeniusPDFPage() {
  return (
    <div className="w-full max-w-screen-lg mx-auto flex justify-center">
      <PDFProfileComparison />
    </div>
  );
}
