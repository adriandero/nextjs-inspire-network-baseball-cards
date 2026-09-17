import { useState, useCallback } from "react";
import { ProfileWithDetailedTeams } from "@/src/shared/entities/profile.types";
import { TeamWithPopulatedCompany } from "@/src/shared/entities/team.types";

import { getTeamsForUser } from "@/src/lib/api/teams";
import { getAllProfiles, getTeamProfiles } from "@/src/lib/api/profiles";

export function useDataTableData() {
  const [teamsData, setTeamsData] = useState<TeamWithPopulatedCompany[]>([]);
  const [profilesData, setProfilesData] = useState<ProfileWithDetailedTeams[]>(
    []
  );
  const [allProfilesData, setAllProfilesData] = useState<
    ProfileWithDetailedTeams[]
  >([]);
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
    []
  );

  const fetchAllProfiles = useCallback(async () => {
    if (allProfilesData.length > 0) return allProfilesData;

    try {
      setLoadingProfiles(true);
      setError(null);
      const profiles = await getAllProfiles();
      setAllProfilesData(profiles);
      return profiles;
    } catch (error) {
      console.error("Error fetching all profiles:", error);
      setError("Unable to load profiles. Please try again.");
      return [];
    } finally {
      setLoadingProfiles(false);
    }
  }, [allProfilesData]);

  return {
    teamsData,
    profilesData,
    allProfilesData,
    loadingTeams,
    loadingProfiles,
    error,
    fetchTeamsData,
    fetchTeamProfiles,
    fetchAllProfiles,
  };
}
