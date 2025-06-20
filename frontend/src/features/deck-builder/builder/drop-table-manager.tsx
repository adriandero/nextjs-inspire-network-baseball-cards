import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { SanityDocument } from "next-sanity";
import DropTable from "./drop-table";
import { GoX } from "react-icons/go";
import { Input } from "@/src/components/ui/input";

export interface ProfileTable {
  id: string;
  profiles: string[];
  name: string;
}

interface ProfileTablesManagerProps {
  profileTables: ProfileTable[];
  onRemoveTable: (tableId: string) => void;
  onUpdateTableProfiles: (tableId: string, profiles: string[]) => void;
  onUpdateTableName: (tableId: string, name: string) => void; // New prop for updating the table name
  onCreateTableWithProfile: (profileId: string) => void;
  setSelectedTableId: (tableId: string) => void;
  selectedTableId: string;
  allProfiles: SanityDocument[];
}

const ProfileTablesManager: React.FC<ProfileTablesManagerProps> = ({
  profileTables,
  onRemoveTable,
  onUpdateTableProfiles,
  onUpdateTableName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCreateTableWithProfile,
  setSelectedTableId,
  selectedTableId,
  allProfiles,
}) => {
  const getProfilesForTable = (tableId: string) => {
    const table = profileTables.find((t) => t.id === tableId);
    if (!table) return [];

    return allProfiles.filter((profile) =>
      table.profiles.includes(profile.uuid)
    );
  };

  // State to track which table is being edited
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Set focus on the input when editing starts
  useEffect(() => {
    if (editingTableId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTableId]);

  // Handle starting to edit a table name
  const handleStartEdit = (tableId: string, currentName: string) => {
    setEditingTableId(tableId);
    setEditingName(currentName);
  };

  // Handle saving the edited table name
  const handleSaveEdit = () => {
    if (editingTableId && editingName.trim()) {
      onUpdateTableName(editingTableId, editingName.trim());
      setEditingTableId(null);
    }
  };

  // Handle key press events in the input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      setEditingTableId(null);
    }
  };

  // Handle clicking outside the input
  const handleBlur = () => {
    handleSaveEdit();
  };

  return (
    <div className="flex flex-col w-full ">
      {profileTables.map((table) => (
        <React.Fragment key={table.id}>
          <div className="flex h-12 justify-end items-center">
            <div className="font-medium text-base flex">
              {editingTableId === table.id ? (
                <Input
                  ref={inputRef}
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onBlur={handleBlur}
                  className="h-8 text-right focus-visible:ring-0 focus-visible:ring-offset-0 border border-light3"
                />
              ) : (
                <span
                  onClick={() => handleStartEdit(table.id, table.name)}
                  className="cursor-text hover:bg-gray-100 px-2 py-1 rounded"
                >
                  {table.name}
                </span>
              )}
            </div>
            {profileTables.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="hover:text-inspireRed w-6 h-6 flex items-center justify-center p-0"
                onClick={() => onRemoveTable(table.id)}
              >
                <GoX size={32} strokeWidth="1" />
              </Button>
            )}
          </div>

          <DropTable
            selectedProfilesData={getProfilesForTable(table.id)}
            droppableId={`table-${table.id}`}
            onProfilesChange={(profiles: SanityDocument[]) => {
              const profileIds = profiles.map((p: SanityDocument) => p.uuid);
              onUpdateTableProfiles(table.id, profileIds);
            }}
            setSelectedTableId={setSelectedTableId}
            table={table}
            isSelectedTable={selectedTableId === table.id}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProfileTablesManager;
