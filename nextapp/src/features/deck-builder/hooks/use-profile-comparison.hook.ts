import { useEffect, useState } from "react";
import { ProfileTable } from "@/src/features/deck-builder/entities/profile-table.model";
import { parseProfileTablesFromURL } from "@/src/lib/utils/profile-table-utils";
import { getProfilesByUuids } from "@/src/lib/api/profiles";

export function useProfileComparison(groupedProfiles: string | null, selection: string | null = null) {
  const [completeProfileTables, setCompleteProfileTables] = useState<
    ProfileTable[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(groupedProfiles || selection));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchProfiles() {
      if (!groupedProfiles && !selection) {
        setCompleteProfileTables([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        if (selection) {
          const response = await fetch(`/api/deckbuilder/selections/${encodeURIComponent(selection)}`);
          const body = await response.json();
          if (!response.ok) throw new Error(body.error ?? "Unable to load the selection");
          if (!cancelled) setCompleteProfileTables(body.tables);
          return;
        }
        const tables = parseProfileTablesFromURL(groupedProfiles!);
        const completeTables = await Promise.all(
          tables.map(async (group) => {
            if (group.profiles.length === 0) {
              return { ...group, profiles: [] };
            }
            const profileObjects = await getProfilesByUuids(group.profiles);
            return { ...group, profiles: profileObjects };
          })
        );
        if (!cancelled) setCompleteProfileTables(completeTables);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load profile data"
        );
        setCompleteProfileTables([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchProfiles();
    return () => { cancelled = true; };
  }, [groupedProfiles, selection]);

  return { completeProfileTables, isLoading, error };
}
