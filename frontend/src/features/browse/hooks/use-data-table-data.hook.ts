import { useState, useCallback } from "react";
import { UserSanity } from "@/src/lib/entities/user";
import { ProfileWithDetailedTeams } from "@/src/lib/entities/profile";
import { TeamWithPopulatedCompany } from "@/src/lib/entities/team";
import {
  getAllProfiles,
  getProfilesFromUserTeams,
} from "@/src/lib/data/profiles";
import { getTeamsForUser } from "@/src/lib/data/teams";

export function useDataTableData(userProfileData: UserSanity) {
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
      const teams = await getTeamsForUser(userProfileData);
      setTeamsData(teams || []);
      return teams || [];
    } catch (error) {
      console.error("Error fetching teams:", error);
      return [];
    } finally {
      setLoadingTeams(false);
    }
  }, [userProfileData, teamsData]);

  const fetchTeamProfiles = useCallback(
    async (team: TeamWithPopulatedCompany) => {
      try {
        setLoadingProfiles(true);
        const profiles = await getProfilesFromUserTeams(userProfileData.email, [
          team.slug,
        ]);
        setProfilesData(profiles?.teamProfiles ?? []);
        return profiles?.teamProfiles ?? [];
      } catch (error) {
        console.error("Error fetching team profiles:", error);
        return [];
      } finally {
        setLoadingProfiles(false);
      }
    },
    [userProfileData.email],
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
