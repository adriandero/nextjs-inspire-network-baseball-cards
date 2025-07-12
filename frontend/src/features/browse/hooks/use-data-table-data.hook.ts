import { useState, useCallback } from "react";
import { ProfileWithDetailedTeams } from "@/src/lib/entities/profile";
import { TeamWithPopulatedCompany } from "@/src/lib/entities/team";

import { getTeamsForUser } from "@/src/lib/data/api/teams";
import { getAllProfiles, getTeamProfiles } from "@/src/lib/data/api/profiles";

export function useDataTableData() {
  const [teamsData, setTeamsData] = useState<TeamWithPopulatedCompany[]>([]);
  const [profilesData, setProfilesData] = useState<ProfileWithDetailedTeams[]>(
    [],
  );
  const [allProfilesData, setAllProfilesData] = useState<
    ProfileWithDetailedTeams[]
  >([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  const fetchTeamsData = useCallback(async () => {
    if (teamsData.length > 0) return teamsData;

    try {
      setLoadingTeams(true);
      const teams = await getTeamsForUser();
      console.log(teams)
      setTeamsData(teams || []);
      return teams || [];
    } catch (error) {
      console.error("Error fetching teams:", error);
      return [];
    } finally {
      setLoadingTeams(false);
    }
  }, [teamsData]);

  const fetchTeamProfiles = useCallback(
    async (team: TeamWithPopulatedCompany) => {
      try {
        setLoadingProfiles(true);
        const profiles = await getTeamProfiles(team.slug);
        console.log(profiles)
        setProfilesData(profiles?.teamProfiles ?? []);
        return profiles?.teamProfiles ?? [];
      } catch (error) {
        console.error("Error fetching team profiles:", error);
        return [];
      } finally {
        setLoadingProfiles(false);
      }
    },
    [],
  );

  const fetchAllProfiles = useCallback(async () => {
    if (allProfilesData.length > 0) return allProfilesData;

    try {
      setLoadingProfiles(true);
      const profiles = await getAllProfiles();
      setAllProfilesData(profiles);
      return profiles;
    } catch (error) {
      console.error("Error fetching all profiles:", error);
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
    fetchTeamsData,
    fetchTeamProfiles,
    fetchAllProfiles,
  };
}
