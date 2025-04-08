"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getProfilesByUuids } from "@/lib/utils/sanityApi/profileRequests";
import WorkingGeniusTable from "@/components/simpleCompareDataTable/workingGeniusTable";
import NavBar from "@/components/NavBar";
import { SanityDocument } from "next-sanity";

function ProfileComparison() {
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

  return (
    <div>
      {isLoading ? (
        <div>Loading profiles...</div>
      ) : error ? (
        <div>{error}</div>
      ) : profileData.length === 0 ? (
        <div>No profiles found. Please select profiles to compare.</div>
      ) : (
        <WorkingGeniusTable profiles={profileData} />
      )}
    </div>
  );
}

// Main page component with Suspense boundary
export default function WorkingGeniusPage() {
  return (
    <>
      <NavBar _id={""} _rev={""} _type={""} _createdAt={""} _updatedAt={""} />
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileComparison />
      </Suspense>
    </>
  );
}
