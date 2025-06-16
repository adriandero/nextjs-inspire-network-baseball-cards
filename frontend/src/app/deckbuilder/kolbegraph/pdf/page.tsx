"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProfilesByUuids } from "@/lib/utils/sanityApi/profileRequests";
import Image from "next/image";
import INTMLogo from "@/../public/IN-TM-Logo.png";
import { ProfileTable } from "@/components/deckBuilder/profileSelection/ProfileTableManager";
import { CompleteProfileTable } from "@/components/deckBuilder/profileComparison";
import KolbeGraph from "@/components/deckBuilder/dataTables/kolbeGraph";
import { SanityDocument } from "next-sanity";

function ProfileComparisonContent() {
  const searchParams = useSearchParams();
  const groupedProfiles = searchParams.get("groupedProfiles");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [completeProfileTables, setCompleteProfileTables] = useState<
    CompleteProfileTable[]
  >([]);
  // const { containerRef, fontSize } = useAutoFitOnLoad(1123);
  const [fontSize, setFontSize] = useState("text-base");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && completeProfileTables.length > 0) {
      console.log("effect");
      const checkHeight = () => {
        if (containerRef.current) {
          const height = containerRef.current.scrollHeight;
          console.log(height);
          if (height > 1123) {
            const overflow = height - 1123;
            console.log(overflow > 300);
            if (overflow > 300) {
              setFontSize("text-xs"); // 12px
            } else if (overflow > 150) {
              setFontSize("text-sm"); // 14px
            } else {
              setFontSize("text-sm"); // 14px for small overflows
            }
          }
        }
      };
      setTimeout(checkHeight, 2000);
    }
  }, [isLoading, completeProfileTables]);

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

  function shortNamesOfProfiles(profiles: SanityDocument[]) {
    return profiles.map((profile) => {
      const nameParts = profile.name.split(" ");
      const firstName = nameParts.slice(0, -1).join(" ");
      const lastInitial = nameParts[nameParts.length - 1][0] + ".";
      const transformedName = `${firstName} ${lastInitial}`;

      return {
        ...profile,
        name: transformedName,
      };
    });
  }

  return (
    <div
      ref={containerRef}
      className="px-6 py-10 print:p-0 gap-4 flex flex-col max-w-[762px] w-[762px] max-h-[1123px] h-[1123px]"
    >
      <div className="flex items-center text-center gap-4">
        <h1 className="text-2xl font-bold">Kolbe Strengths</h1>
        <span className="text-base ml-auto text-accent-foreground font-bold">
          {currentDate}
        </span>
        <Image src={INTMLogo} width={70} height={150} alt="Company Logo" />
      </div>

      {isLoading ? (
        <div>Loading profiles...</div>
      ) : completeProfileTables.length === 0 ||
        completeProfileTables.every((table) => table.profiles.length === 0) ? (
        <div>No TUG Cards found. Please select TUG Cards to compare.</div>
      ) : (
        // Map through all tables instead of just accessing index 0
        completeProfileTables.map((table) => (
          <div key={table.id} className="flex flex-col gap-4">
            <KolbeGraph
              profiles={shortNamesOfProfiles(table.profiles)}
              tableName={table.name}
              baseFontSize={fontSize}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default function KolbeStrengthsPDFPage() {
  return (
    <div className="w-full max-w-screen-lg mx-auto flex justify-center">
      <ProfileComparisonContent />
    </div>
  );
}
