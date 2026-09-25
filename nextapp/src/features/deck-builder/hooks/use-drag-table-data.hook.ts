import { useState, useEffect, useCallback, useMemo } from "react";
import { TeamWithPopulatedCompany } from "@/src/shared/entities/team.types";
import { ProfilesByTeam } from "@/src/shared/entities/profile.types";

import { getAllProfilesGroupedByTeam } from "@/src/lib/api/profiles";

import { getTeamsForUserPage } from "@/src/lib/api/teams";

import { useProfileList } from "@/src/hooks/use-profile-list";
import { ProfileListOptions } from "@/src/shared/entities/profile-list.types";

export function useDragTableData(
  view: "teams" | "profiles",
  groupingMode: "teams" | "profiles",
  selectedTeam: string | null,
  options: ProfileListOptions,
) {
  const list = useProfileList(options, groupingMode === "profiles");
  const [teams, setTeams] = useState<TeamWithPopulatedCompany[]>([]);
  const [profilesByTeam, setProfilesByTeam] = useState<ProfilesByTeam | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [teamsCursor, setTeamsCursor] = useState<string | null>(null);
  const [hasMoreTeams, setHasMoreTeams] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    if (teams.length > 0) return;
    try {
      setIsLoading(true);
      setError(null);

      const page = await getTeamsForUserPage();
      setTeams(page.data);
      setTeamsCursor(page.nextCursor);
      setHasMoreTeams(page.hasMore);
    } catch (err) {
      console.error("Error fetching teams:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch teams");
    } finally {
      setIsLoading(false);
    }
  }, [teams.length]);

  const loadMoreTeams = useCallback(async () => {
    if (!hasMoreTeams || !teamsCursor || isLoading) return;
    try {
      setIsLoading(true);
      const page = await getTeamsForUserPage(teamsCursor);
      setTeams((current) => [...current, ...page.data]);
      setTeamsCursor(page.nextCursor);
      setHasMoreTeams(page.hasMore);
    } finally {
      setIsLoading(false);
    }
  }, [hasMoreTeams, teamsCursor, isLoading]);

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
        err instanceof Error ? err.message : "Failed to fetch grouped profiles",
      );
    } finally {
      setIsLoadingProfiles(false);
    }
  }, [profilesByTeam]);

  useEffect(() => {
    if (groupingMode === "profiles") return;
    if (view === "teams") {
      fetchTeams();
    } else if (selectedTeam) {
      fetchGroupedProfiles();
    }
  }, [groupingMode, view, selectedTeam, fetchGroupedProfiles, fetchTeams]);

  const knownProfiles = useMemo(() => {
    const profiles = new Map(
      list.knownProfiles.map((profile) => [profile.uuid, profile]),
    );
    Object.values(profilesByTeam?.teams ?? {})
      .flat()
      .forEach((profile) => profiles.set(profile.uuid, profile));
    return [...profiles.values()];
  }, [list.knownProfiles, profilesByTeam]);

  return {
    teams,
    profilesByTeam,
    allProfilesData: list.profiles,
    knownProfiles,
    isSearching: list.isSearching,
    profileQueryKey: list.queryKey,
    profileError: list.error,
    isLoading,
    isLoadingProfiles:
      isLoadingProfiles || list.isSearching || list.isLoadingMore,
    error,

    refetchTeams: fetchTeams,
    refetchProfiles: list.retry,
    refetchGroupedProfiles: fetchGroupedProfiles,
    loadMoreTeams,
    hasMoreTeams,
    loadMoreProfiles: list.loadMore,
    hasMoreProfiles: list.hasMore,
  };
}
