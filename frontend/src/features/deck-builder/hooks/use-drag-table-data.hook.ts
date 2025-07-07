import { useState, useEffect, useCallback } from "react";
import { SanityDocument } from "next-sanity";
import {
  getAllProfiles,
  getAllProfilesGroupedByTeam,
  getAllTeams,
  getUserTeams,
  ProfilesByTeam,
  TeamsFromUser,
} from "@/src/lib/utils/sanityApi/profileRequests";

interface UseDragTableDataProps {
  userProfileData: SanityDocument;
}

export function useDragTableData({ userProfileData }: UseDragTableDataProps) {
  const [teams, setTeams] = useState<SanityDocument[]>([]);
  const [profilesByTeam, setProfilesByTeam] = useState<ProfilesByTeam>({
    teams: {},
  });
  const [allProfilesData, setAllProfilesData] = useState<SanityDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillAllUserTeams = useCallback(async () => {
    let profilesFromUserTeams: TeamsFromUser = { teams: [] };
    if (userProfileData?.team) {
      profilesFromUserTeams = await getUserTeams(userProfileData.email);
    }
    return profilesFromUserTeams;
  }, [userProfileData.email, userProfileData?.team]);

  const fillDataTableTeamData = useCallback(async (): Promise<
    SanityDocument[]
  > => {
    const emptyData: SanityDocument[] = [];
    if (userProfileData.permission === "Admin") {
      return await getAllTeams();
    }
    const data = userProfileData?.team
      ? (await fillAllUserTeams()).teams
      : emptyData;
    return data;
  }, [userProfileData, fillAllUserTeams]);

  const fetchAllProfiles = useCallback(async (): Promise<SanityDocument[]> => {
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
