import { useState, useEffect, useCallback } from "react";
import { TeamWithPopulatedCompany } from "@/src/lib/entities/team";
import {
  ProfileWithDetailedTeams,
  ProfilesByTeam,
} from "@/src/lib/entities/profile";

import {
  getAllProfiles,
  getAllProfilesGroupedByTeam,
} from "@/src/lib/data/api/profiles";

import { getTeamsForUser } from "@/src/lib/data/api/teams";

export function useDragTableData() {
  const [teams, setTeams] = useState<TeamWithPopulatedCompany[]>([]);
  const [profilesByTeam, setProfilesByTeam] = useState<ProfilesByTeam | null>(
    null
  );
  const [allProfilesData, setAllProfilesData] = useState<
    ProfileWithDetailedTeams[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const teamsData = await getTeamsForUser();
      setTeams(teamsData);
    } catch (err) {
      console.error("Error fetching teams:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch teams");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllProfiles = useCallback(async () => {
    try {
      setIsLoadingProfiles(true);
      setError(null);

      const profilesData = await getAllProfiles();
      setAllProfilesData(profilesData);
    } catch (err) {
      console.error("Error fetching all profiles:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch profiles");
    } finally {
      setIsLoadingProfiles(false);
    }
  }, []);

  const fetchGroupedProfiles = useCallback(async () => {
    try {
      setIsLoadingProfiles(true);
      setError(null);

      const groupedData = await getAllProfilesGroupedByTeam();
      setProfilesByTeam(groupedData);
    } catch (err) {
      console.error("Error fetching grouped profiles:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch grouped profiles"
      );
    } finally {
      setIsLoadingProfiles(false);
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchTeams(),
        fetchAllProfiles(),
        fetchGroupedProfiles(),
      ]);
    };

    initializeData();
  }, []);

  return {
    teams,
    profilesByTeam,
    allProfilesData,
    isLoading,
    isLoadingProfiles,
    error,

    refetchTeams: fetchTeams,
    refetchProfiles: fetchAllProfiles,
    refetchGroupedProfiles: fetchGroupedProfiles,
  };
}
