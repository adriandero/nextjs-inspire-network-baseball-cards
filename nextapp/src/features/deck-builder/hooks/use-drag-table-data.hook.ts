import { useState, useEffect, useCallback } from "react";
import { TeamWithPopulatedCompany } from "@/src/shared/entities/team.types";
import {
  ProfileWithDetailedTeams,
  ProfilesByTeam,
} from "@/src/shared/entities/profile.types";

import {
  getAllProfiles,
  getAllProfilesGroupedByTeam,
} from "@/src/lib/api/profiles";

import { getTeamsForUser } from "@/src/lib/api/teams";

export function useDragTableData(
  view: "teams" | "profiles",
  groupingMode: "teams" | "profiles",
  selectedTeam: string | null,
) {
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
    if (teams.length > 0) return;
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
  }, [teams.length]);

  const fetchAllProfiles = useCallback(async () => {
    if (allProfilesData.length > 0) return;
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
  }, [allProfilesData.length]);

  const fetchGroupedProfiles = useCallback(async () => {
    if (profilesByTeam) return;
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
  }, [profilesByTeam]);

  useEffect(() => {
    if (groupingMode === "profiles") {
      fetchAllProfiles();
    } else if (view === "teams") {
      fetchTeams();
    } else if (selectedTeam) {
      fetchGroupedProfiles();
    }
  }, [groupingMode, view, selectedTeam, fetchAllProfiles, fetchGroupedProfiles, fetchTeams]);

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
