"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getProfilesByUuids } from "@/lib/utils/sanityApi/profileRequests";
import WorkingGeniusTable from "@/components/compare/dataTables/workingGeniusTable";
import { SanityDocument } from "next-sanity";
import Image from "next/image";
import INTMLogo from "@/../public/IN-TM-Logo.png";
import { ProfileTable } from "@/components/lineupBuilder/profileSelection/ProfileTableManager";

interface CompleteProfileTable {
  id: string;
  name: string;
  profiles: SanityDocument[];
}

function ProfileComparisonContent() {
  const searchParams = useSearchParams();
  const profiles = searchParams.get("profiles");
  const [profileTables, setProfileTables] = useState<ProfileTable[]>([]);
  const [profileData, setProfileData] = useState<CompleteProfileTable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setIsLoading(true);

        if (profiles) {
          const tables = decodeURLToProfileTables(profiles);
          setProfileTables(tables);

          console.log(searchParams);

          const completeTablesPromises = tables.map(async (group) => {
            if (group.profiles.length > 0) {
              const profileObjects = await getProfilesByUuids(group.profiles);

              return {
                id: group.id,
                name: group.name,
                profiles: profileObjects,
              };
            }

            return {
              id: group.id,
              name: group.name,
              profiles: [],
            };
          });

          const completeTables = await Promise.all(completeTablesPromises);
          setProfileData(completeTables);
        }

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error("Error loading profiles:", err);
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

  function decodeURLToProfileTables(paramString: string): ProfileTable[] {
    if (!paramString) return [];

    return paramString.split(";").map((groupString) => {
      const [nameEncoded, id, profilesString] = groupString.split(":");
      const name = decodeURIComponent(nameEncoded);
      const profiles = profilesString ? profilesString.split(",") : [];

      return {
        id,
        name,
        profiles,
      };
    });
  }

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
        <div>No profiles found hahha. Please select profiles to compare.</div>
      ) : (
        profileData.map((profilesTable, index) => {
          return (
            <WorkingGeniusTable
              key={index}
              profiles={profilesTable.profiles}
              optimizedImages={true}
            />
          );
        })
      )}
    </div>
  );
}

function PDFProfileComparison() {
  return (
    <Suspense fallback={<div>Loading profiles...</div>}>
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
