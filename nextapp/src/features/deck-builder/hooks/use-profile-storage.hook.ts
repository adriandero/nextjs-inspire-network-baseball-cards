import { useEffect } from "react";
import { ProfileIdentifierTable } from "@/src/features/deck-builder/entities/profile-identifier-table.model";
import { CompareTypes } from "@/src/features/deck-builder/entities/compare-types";

const STORAGE_KEY = "profileSelector_data";

export interface StorageData {
  profileTables?: ProfileIdentifierTable[];
  selectedType?: CompareTypes;
  groupingMode?: "teams" | "profiles";
}

interface UseProfileStorageProps {
  profileTables: ProfileIdentifierTable[];
  selectedType: CompareTypes;
  groupingMode: "teams" | "profiles";
  onRestore: (data: StorageData) => void;
}

export function useProfileStorageHook({
  profileTables,
  selectedType,
  groupingMode,
  onRestore,
}: UseProfileStorageProps) {
  useEffect(() => {
    if (profileTables.some((table) => table.profiles.length > 0)) {
      const dataToSave: StorageData = {
        profileTables,
        selectedType,
        groupingMode,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [profileTables, selectedType, groupingMode]);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        const cleanedData: StorageData = {
          profileTables: parsedData.profileTables,
          selectedType: parsedData.selectedType,
          groupingMode: parsedData.groupingMode,
        };

        onRestore(cleanedData);
      } catch (e) {
        console.error("Error restoring saved profile selection:", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [onRestore]);

  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return { clearStorage };
}
