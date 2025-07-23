import { useEffect, useState } from "react";
import { ProfileTable } from "@/src/features/deck-builder/entities/profile-table.model";
import { parseProfileTablesFromURL } from "@/src/lib/utils/profile-table-utils";
import { getProfilesByUuids } from "@/src/lib/data/api/profiles";

export function useProfileComparison(groupedProfiles: string | null) {
  const [completeProfileTables, setCompleteProfileTables] = useState<
    ProfileTable[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(groupedProfiles));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfiles() {
      if (!groupedProfiles) {
        setCompleteProfileTables([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const tables = parseProfileTablesFromURL(groupedProfiles);
        const completeTables = await Promise.all(
          tables.map(async (group) => {
            if (group.profiles.length === 0) {
              return { ...group, profiles: [] };
            }
            const profileObjects = await getProfilesByUuids(group.profiles);
            return { ...group, profiles: profileObjects };
          }),
        );
        console.log(completeTables);
        setCompleteProfileTables(completeTables);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load profile data",
        );
        setCompleteProfileTables([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfiles();
  }, [groupedProfiles]);

  return { completeProfileTables, isLoading, error };
}
