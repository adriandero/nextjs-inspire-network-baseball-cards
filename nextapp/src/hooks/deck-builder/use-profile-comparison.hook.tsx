import { useEffect, useState } from "react";
import { ProfileIdentifierTable } from "@/src/features/deck-builder/entities/profile-identifier-table.model";
import { ProfileTable } from "@/src/features/deck-builder/entities/profile-table.model";
import { getProfilesByUuids } from "@/src/lib/api/profiles";

interface UseProfileComparisonResult {
  isLoading: boolean;
  completeProfileTables: ProfileTable[];
  error: string | null;
}

function decodeURLToProfileTables(
  paramString: string
): ProfileIdentifierTable[] {
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

export function useProfileComparisonHook(
  groupedProfiles: string | null
): UseProfileComparisonResult {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [completeProfileTables, setCompleteProfileTables] = useState<
    ProfileTable[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfiles() {
      if (!groupedProfiles) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const tables = decodeURLToProfileTables(groupedProfiles);

        const completeTablesPromises = tables.map(async (group) => {
          if (group.profiles.length === 0) {
            return {
              id: group.id,
              name: group.name,
              profiles: [],
            };
          }

          const profileObjects = await getProfilesByUuids(group.profiles);
          return {
            id: group.id,
            name: group.name,
            profiles: profileObjects,
          };
        });

        const completeTables = await Promise.all(completeTablesPromises);
        setCompleteProfileTables(completeTables);
      } catch (err) {
        console.error("Error loading TUG Cards:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load profiles"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfiles();
  }, [groupedProfiles]);

  useEffect(() => {
    if (!isLoading) {
      document.body.setAttribute("data-render-ready", "true");
    }
  }, [isLoading]);

  return {
    isLoading,
    completeProfileTables,
    error,
  };
}
