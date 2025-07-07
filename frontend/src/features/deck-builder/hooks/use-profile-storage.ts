import { useEffect } from "react";
import { ProfileIdentifierTable } from "@/src/features/deck-builder/entities/profile-identifier-table.model";
import { CompareTypes } from "@/src/features/deck-builder/entities/compare-types";

const STORAGE_KEY = "profileSelector_data";

export interface StorageData {
  profileTables?: ProfileIdentifierTable[];
  selectedTeam?: string | null;
  selectedTeamName?: string;
  selectedType?: CompareTypes;
  groupingMode?: "teams" | "profiles";
}

interface UseProfileStorageProps {
  profileTables: ProfileIdentifierTable[];
  selectedTeam: string | null;
  selectedTeamName: string;
  selectedType: CompareTypes;
  groupingMode: "teams" | "profiles";
  onRestore: (data: StorageData) => void;
}

export function useProfileStorage({
  profileTables,
  selectedTeam,
  selectedTeamName,
  selectedType,
  groupingMode,
  onRestore,
}: UseProfileStorageProps) {
  useEffect(() => {
    if (
      profileTables.some((table) => table.profiles.length > 0) ||
      selectedTeam
    ) {
      const dataToSave: StorageData = {
        profileTables,
        selectedTeam,
        selectedTeamName,
        selectedType,
        groupingMode,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [
    profileTables,
    selectedTeam,
    selectedTeamName,
    selectedType,
    groupingMode,
  ]);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
      try {
        const parsedData: StorageData = JSON.parse(savedData);
        onRestore(parsedData);
      } catch (e) {
        console.error("Error restoring saved TUG Card selection:", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [onRestore]);

  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return { clearStorage };
}
