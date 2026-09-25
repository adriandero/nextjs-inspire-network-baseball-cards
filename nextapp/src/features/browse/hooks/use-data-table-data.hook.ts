import { useState, useCallback } from "react";
import { ProfileWithDetailedTeams } from "@/src/shared/entities/profile.types";
import { TeamWithPopulatedCompany } from "@/src/shared/entities/team.types";

import { getTeamsForUser } from "@/src/lib/api/teams";
import { getTeamProfiles } from "@/src/lib/api/profiles";

import { useProfileList } from "@/src/hooks/use-profile-list";
import { ProfileListOptions } from "@/src/shared/entities/profile-list.types";

export function useDataTableData(
  options: ProfileListOptions,
  enabled: boolean,
) {
  const list = useProfileList(options, enabled);
  const [teamsData, setTeamsData] = useState<TeamWithPopulatedCompany[]>([]);
  const [profilesData, setProfilesData] = useState<ProfileWithDetailedTeams[]>(
    [],
  );
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamsData = useCallback(async () => {
    if (teamsData.length > 0) return teamsData;

    try {
      setLoadingTeams(true);
      setError(null);
      const teams = await getTeamsForUser();
      setTeamsData(teams || []);
      return teams || [];
    } catch (error) {
      console.error("Error fetching teams:", error);
      setError("Unable to load teams. Please try again.");
      return [];
    } finally {
      setLoadingTeams(false);
    }
  }, [teamsData]);

  const fetchTeamProfiles = useCallback(
    async (team: TeamWithPopulatedCompany) => {
      try {
        setLoadingProfiles(true);
        setError(null);
        const profiles = await getTeamProfiles(team.slug);
        setProfilesData(profiles?.teamProfiles ?? []);
        return profiles?.teamProfiles ?? [];
      } catch (error) {
        console.error("Error fetching team profiles:", error);
        setError("Unable to load team profiles. Please try again.");
        return [];
      } finally {
        setLoadingProfiles(false);
      }
    },
    [],
  );

  return {
    teamsData,
    profilesData,
    allProfilesData: list.profiles,
    loadingTeams,
    loadingProfiles:
      loadingProfiles || (enabled && (list.isSearching || list.isLoadingMore)),
    error: enabled ? list.error : error,
    fetchTeamsData,
    fetchTeamProfiles,
    fetchAllProfiles: list.retry,
    loadMoreProfiles: list.loadMore,
    hasMoreProfiles: list.hasMore,
    isSearching: list.isSearching,
    profileQueryKey: list.queryKey,
  };
}
