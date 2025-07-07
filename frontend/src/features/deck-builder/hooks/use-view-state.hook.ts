import { useState, useCallback } from "react";
import { CompareTypes } from "@/src/features/deck-builder/entities/compare-types";

type ViewType = "teams" | "profiles";

interface StorageData {
  selectedTeam?: string | null;
  selectedTeamName?: string;
  selectedType?: CompareTypes;
  groupingMode?: "teams" | "profiles";
}

export function useViewState() {
  const [view, setView] = useState<ViewType>("teams");
  const [groupingMode, setGroupingMode] = useState<"teams" | "profiles">(
    "teams",
  );
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedTeamName, setSelectedTeamName] = useState<string>("");
  const [selectedType, setSelectedType] = useState(CompareTypes.WORKING_GENIUS);

  const handleGroupingChange = useCallback((mode: "teams" | "profiles") => {
    setGroupingMode(mode);

    if (mode === "profiles") {
      setView("profiles");
      setSelectedTeam(null);
      setSelectedTeamName("");
    } else {
      setView("teams");
      setSelectedTeam(null);
      setSelectedTeamName("");
    }
  }, []);

  const handleTeamClick = useCallback(
    (teamSlug: string, teamName: string) => {
      if (groupingMode === "teams") {
        setSelectedTeam(teamSlug);
        setSelectedTeamName(teamName);
        setView("profiles");
      }
    },
    [groupingMode],
  );

  const handleBackToTeams = useCallback(() => {
    if (groupingMode === "teams") {
      setView("teams");
      setSelectedTeam(null);
      setSelectedTeamName("");
    }
  }, [groupingMode]);

  const restoreViewState = useCallback((data: StorageData) => {
    if (data.selectedTeam) {
      setSelectedTeam(data.selectedTeam);
      setSelectedTeamName(data.selectedTeamName || "");
      setView("profiles");
    }

    if (data.selectedType) {
      setSelectedType(data.selectedType);
    }

    if (data.groupingMode) {
      setGroupingMode(data.groupingMode);
      if (data.groupingMode === "profiles") {
        setView("profiles");
      }
    }
  }, []);

  return {
    view,
    groupingMode,
    selectedTeam,
    selectedTeamName,
    selectedType,
    setSelectedType,
    handleGroupingChange,
    handleTeamClick,
    handleBackToTeams,
    restoreViewState, // ✅ Expose restoration method
  };
}
