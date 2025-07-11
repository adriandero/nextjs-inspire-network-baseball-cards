import { useState, useCallback } from "react";
import { SanityDocument } from "next-sanity";
import { TeamWithPopulatedCompany } from "@/src/lib/entities/team";

type ViewMode = "teams" | "profiles";

export function useDataTableView() {
  const [groupingMode, setGroupingMode] = useState<ViewMode>("profiles");
  const [currentView, setCurrentView] = useState<ViewMode>("profiles");
  const [selectedTeam, setSelectedTeam] = useState<SanityDocument | null>(null);

  const switchToTeamsView = useCallback(() => {
    setCurrentView("teams");
    setSelectedTeam(null);
  }, []);

  const switchToProfilesView = useCallback(
    (team?: TeamWithPopulatedCompany) => {
      setCurrentView("profiles");
      if (team) {
        setSelectedTeam(team);
      }
    },
    [],
  );

  const changeGroupingMode = useCallback((mode: ViewMode) => {
    setGroupingMode(mode);
    if (mode === "profiles") {
      setCurrentView("profiles");
      setSelectedTeam(null);
    } else {
      setCurrentView("teams");
      setSelectedTeam(null);
    }
  }, []);

  return {
    groupingMode,
    currentView,
    selectedTeam,
    switchToTeamsView,
    switchToProfilesView,
    changeGroupingMode,
  };
}
