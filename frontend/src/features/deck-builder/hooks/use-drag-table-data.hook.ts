import { useState, useEffect, useCallback } from "react";

import {
  getAllProfiles,
  getAllProfilesGroupedByTeam,
} from "@/src/lib/data/api/profiles";
import { UserSanity } from "@/src/lib/entities/user";
import {
  ProfilesByTeam,
  ProfileWithDetailedTeams,
} from "@/src/lib/entities/profile";
import { getAllTeams, getUserTeams } from "@/src/lib/data/api/teams";
import {
  TeamWithPopulatedCompany,
  UserTeamsResponse,
} from "@/src/lib/entities/team";

interface UseDragTableDataProps {
  userProfileData: UserSanity;
}

export function useDragTableData({ userProfileData }: UseDragTableDataProps) {
  const [teams, setTeams] = useState<TeamWithPopulatedCompany[]>([]);
  const [profilesByTeam, setProfilesByTeam] = useState<ProfilesByTeam>({
    teams: {},
  });
  const [allProfilesData, setAllProfilesData] = useState<
    ProfileWithDetailedTeams[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillAllUserTeams = useCallback(async () => {
    let profilesFromUserTeams: UserTeamsResponse = { teams: [] };
    if (userProfileData?.team) {
      profilesFromUserTeams = (await getUserTeams(userProfileData.email)) ?? {
        teams: [],
      };
    }
    return profilesFromUserTeams;
  }, [userProfileData.email, userProfileData?.team]);

  const fillDataTableTeamData = useCallback(async (): Promise<
    TeamWithPopulatedCompany[]
  > => {
    const emptyData: TeamWithPopulatedCompany[] = [];
    if (userProfileData.permission === "Admin") {
      return await getAllTeams();
    }
    const data = userProfileData?.team
      ? (await fillAllUserTeams()).teams
      : emptyData;
    return data;
  }, [userProfileData, fillAllUserTeams]);

  const fetchAllProfiles = useCallback(async (): Promise<
    ProfileWithDetailedTeams[]
  > => {
    try {
      setIsLoadingProfiles(true);

      if (allProfilesData.length <= 0) {
        const profilesData = await getAllProfiles();
        setAllProfilesData(profilesData);
        return profilesData;
      }
      return allProfilesData;
    } catch (error) {
      console.error("Error fetching all profiles:", error);
      return [];
    } finally {
      setIsLoadingProfiles(false);
    }
  }, [allProfilesData.length]);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        const [teamsData, profilesData, allProfiles] = await Promise.all([
          fillDataTableTeamData(),
          getAllProfilesGroupedByTeam(),
          fetchAllProfiles(),
        ]);

        setTeams(teamsData);
        setProfilesByTeam(profilesData);

        if (allProfilesData.length === 0) {
          setAllProfilesData(allProfiles);
        }
      } catch (err) {
        setError("Failed to load data");
        console.error("Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [fillDataTableTeamData, fetchAllProfiles, allProfilesData.length]);

  return {
    teams,
    profilesByTeam,
    allProfilesData,
    isLoading,
    isLoadingProfiles,
    error,
    refetchProfiles: fetchAllProfiles,
  };
}
