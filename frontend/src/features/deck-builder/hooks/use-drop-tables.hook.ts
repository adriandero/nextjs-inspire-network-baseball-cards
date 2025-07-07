import { useState, useCallback } from "react";
import { nanoid } from "nanoid";
import { ProfileIdentifierTable } from "@/src/features/deck-builder/entities/profile-identifier-table.model";
import { addProfileToTable, toggleProfileInTable } from "@/src/lib/utils/profile-table-utils";

interface StorageData {
  profileTables?: ProfileIdentifierTable[];
}

export function useDropTables() {
  const [dropTables, setDropTables] = useState<ProfileIdentifierTable[]>([
    {
      id: nanoid(),
      profiles: [],
      name: "Default Group",
    },
  ]);

  const [selectedTableId, setSelectedTableId] = useState<string>(
    dropTables[0].id,
  );

  const handleOneWayProfileCheck = useCallback(
    (profileId: string) => {
      setDropTables((prev) =>
        prev.map((table) =>
          table.id === selectedTableId
            ? addProfileToTable(table, profileId)
            : table,
        ),
      );
    },
    [selectedTableId],
  );

  const handleProfileCheck = useCallback(
    (profileId: string) => {
      setDropTables((prev) =>
        prev.map((table) =>
          table.id === selectedTableId
            ? toggleProfileInTable(table, profileId)
            : table,
        ),
      );
    },
    [selectedTableId],
  );

  const handleAddTable = useCallback(() => {
    setDropTables((prev) => [
      ...prev,
      {
        id: nanoid(),
        profiles: [],
        name: `Group ${prev.length + 1}`,
      },
    ]);
  }, []);

  const handleRemoveTable = useCallback((tableId: string) => {
    setDropTables((prev) => {
      const newTables = prev.filter((table) => table.id !== tableId);
      return newTables.length > 0 ? newTables : prev; // Prevent removing all tables
    });
  }, []);

  const handleUpdateTableProfiles = useCallback(
    (tableId: string, profiles: string[]) => {
      setDropTables((prev) =>
        prev.map((table) =>
          table.id === tableId ? { ...table, profiles } : table,
        ),
      );
    },
    [],
  );

  const handleUpdateTableName = useCallback(
    (tableId: string, newName: string) => {
      setDropTables((prev) =>
        prev.map((table) =>
          table.id === tableId ? { ...table, name: newName } : table,
        ),
      );
    },
    [],
  );

  const handleCreateTableWithProfile = useCallback(
    (profileId: string) => {
      const newTable: ProfileIdentifierTable = {
        id: nanoid(),
        profiles: [profileId],
        name: `Group ${dropTables.length + 1}`,
      };
      setDropTables((prev) => [...prev, newTable]);
    },
    [dropTables.length],
  );

  const handleClearSelections = useCallback(() => {
    const defaultTable = {
      id: nanoid(),
      profiles: [],
      name: "Default Group",
    };
    setDropTables([defaultTable]);
    setSelectedTableId(defaultTable.id);
  }, []);

  const restoreDropTables = useCallback((data: StorageData) => {
    if (
      data.profileTables &&
      Array.isArray(data.profileTables) &&
      data.profileTables.length > 0
    ) {
      setDropTables(data.profileTables);
      setSelectedTableId(data.profileTables[0].id);
    }
  }, []);

  return {
    dropTables,
    selectedTableId,
    setSelectedTableId,
    handleOneWayProfileCheck,
    handleProfileCheck,
    handleAddTable,
    handleRemoveTable,
    handleUpdateTableProfiles,
    handleUpdateTableName,
    handleCreateTableWithProfile,
    handleClearSelections,
    restoreDropTables,
  };
}
