"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getProfilesByUuids } from "@/src/lib/utils/sanityApi/profileRequests";
import Image from "next/image";
import INTMLogo from "@/public/images/in-tug-card-logo.png";
import { ProfileTable } from "@/src/features/deck-builder/builder/drop-table-manager";
import { CompleteProfileTable } from "@/src/features/deck-builder/profile-comparison";
import KolbeStrengthsTable from "@/src/features/deck-builder/data-tables/kolbe-strengths-table";

function ProfileComparisonContent() {
  const searchParams = useSearchParams();
  const groupedProfiles = searchParams.get("groupedProfiles");
  const showJobRoleParam = searchParams.get("showJobRole");
  const showJobRole = showJobRoleParam === "true"; // Convert string to boolean
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [completeProfileTables, setCompleteProfileTables] = useState<
    CompleteProfileTable[]
  >([]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupedProfiles]);

  function decodeURLToProfileTables(paramString: string): ProfileTable[] {
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

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "numeric",
    year: "numeric",
  });

  return (
    <div className="px-6 py-10 print:p-0 gap-4 flex flex-col max-w-[762px] w-[762px] max-h-[1123px] h-[1123px]">
      <div className="flex items-center text-center gap-4">
        <h1 className="text-2xl font-bold">Kolbe Strengths</h1>
        <span className="text-base ml-auto text-accent-foreground font-bold">
          {currentDate}
        </span>
        <Image src={INTMLogo} width={70} height={150} alt="Company Logo" />
      </div>

      {isLoading ? (
        <div>Loading TUG Cards...</div>
      ) : completeProfileTables.length === 0 ||
        completeProfileTables.every((table) => table.profiles.length === 0) ? (
        <div>No TUG Cards found. Please select TUG Cards to compare.</div>
      ) : (
        // Map through all tables instead of just accessing index 0
        completeProfileTables.map((table) => (
          <div key={table.id} className="flex flex-col gap-4 ">
            {/* Display the group name if there are multiple groups */}
            {completeProfileTables.length > 1 && (
              <h2 className="text-base font-semibold">{table.name}</h2>
            )}
            <KolbeStrengthsTable
              profiles={table.profiles}
              optimizedImages={true}
              showJobRole={showJobRole}
            />
          </div>
        ))
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

export default function KolbeStrengthsPDFPage() {
  return (
    <div className="w-full max-w-screen-lg mx-auto flex justify-center">
      <PDFProfileComparison />
    </div>
  );
}
