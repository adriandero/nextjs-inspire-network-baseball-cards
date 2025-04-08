"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SanityDocument } from "next-sanity";
import { getProfilesByUuids } from "@/lib/utils/sanityApi/profileRequests";
import WorkingGeniusTable from "@/components/simpleCompareDataTable/workingGeniusTable";
import NavBar from "@/components/NavBar";

export default function WorkingGeniusPage() {
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
          // Split the profiles string to get individual UUIDs
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
    <div className="w-full h-screen max-w-screen-lg">
      <NavBar
        userProfileData={{}}
        _id={""}
        _rev={""}
        _type={""}
        _createdAt={""}
        _updatedAt={""}
      />

      <div className=" w-full flex justify-center px-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading profiles...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-red-500">
            {error}
          </div>
        ) : profileData.length === 0 ? (
          <div className="border rounded-lg p-8 text-center">
            <p className="text-gray-500">
              No profiles found. Please select profiles to compare.
            </p>
          </div>
        ) : (
          <WorkingGeniusTable profiles={profileData} />
        )}
      </div>
    </div>
  );
}
