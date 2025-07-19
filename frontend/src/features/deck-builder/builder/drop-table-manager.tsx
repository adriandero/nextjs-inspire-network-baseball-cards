import React, { useCallback } from "react";
import { Button } from "@/src/components/shadcn-ui/button";
import { SanityDocument } from "next-sanity";
import DropTable from "./drop-table";
import { GoX } from "react-icons/go";
import { Input } from "@/src/components/shadcn-ui/input";
import { ProfileIdentifierTable } from "@/src/features/deck-builder/entities/profile-identifier-table.model";
import { useProfileTableData } from "@/src/features/deck-builder/hooks/use-profile-table-data.hook";
import { useTableNameEditor } from "@/src/features/deck-builder/hooks/use-table-name-editor.hook";
import { ProfileWithDetailedTeams } from "@/src/lib/entities/profile";
import { cn } from "@/src/lib/utils";

interface ProfileTablesManagerProps {
  profileIdentifierTables: ProfileIdentifierTable[];
  onRemoveTable: (tableId: string) => void;
  onUpdateTableProfiles: (tableId: string, profiles: string[]) => void;
  onUpdateTableName: (tableId: string, name: string) => void;
  onCreateTableWithProfile: (profileId: string) => void;
  setSelectedTableId: (tableId: string) => void;
  selectedTableId: string;
  allProfiles: ProfileWithDetailedTeams[];
}

const ProfileTablesManager: React.FC<ProfileTablesManagerProps> = ({
  profileIdentifierTables,
  onRemoveTable,
  onUpdateTableProfiles,
  onUpdateTableName,
  // TODO: may get used later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCreateTableWithProfile,
  setSelectedTableId,
  selectedTableId,
  allProfiles,
}) => {
  const { getProfilesForTable } = useProfileTableData(
    profileIdentifierTables,
    allProfiles,
  );

  const {
    editingName,
    setEditingName,
    inputRef,
    startEditing,
    cancelEditing,
    saveEditing,
    isEditing,
  } = useTableNameEditor();

  const handleProfilesChange = useCallback(
    (tableId: string) => {
      return (profiles: SanityDocument[]) => {
        const profileIds = profiles.map((p) => p.uuid);
        onUpdateTableProfiles(tableId, profileIds);
      };
    },
    [onUpdateTableProfiles],
  );

  const handleSaveEdit = useCallback(() => {
    saveEditing(onUpdateTableName);
  }, [saveEditing, onUpdateTableName]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSaveEdit();
      } else if (e.key === "Escape") {
        cancelEditing();
      }
    },
    [handleSaveEdit, cancelEditing],
  );

  if (profileIdentifierTables.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-500">
        No tables created yet
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {profileIdentifierTables.map((table) => (
        <React.Fragment key={table.id}>
          <div
            className={cn(
              "flex h-12 items-center",
              isEditing(table.id) ? "justify-between" : "justify-end",
            )}
          >
            <div
              className={cn(
                "font-medium text-base min-w-0 justify-end flex",
                isEditing(table.id) && "flex-1",
              )}
            >
              {isEditing(table.id) ? (
                <Input
                  ref={inputRef}
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onBlur={handleSaveEdit}
                  className="h-8 w-full text-right focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none p-2 border-light3"
                  aria-label="Edit table name"
                />
              ) : (
                <div className="hover:bg-gray-100 px-2 rounded overflow-x-auto overflow-y-hidden w-fit no-scrollbar">
                  <p
                    onClick={() => startEditing(table.id, table.name)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        startEditing(table.id, table.name);
                      }
                    }}
                    className="cursor-text whitespace-nowrap text-right"
                    role="button"
                    tabIndex={0}
                    aria-label={`Edit table name: ${table.name}`}
                  >
                    {table.name}
                  </p>
                </div>
              )}
            </div>
            {profileIdentifierTables.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="hover:text-inspireRed w-6 h-6 flex items-center justify-center p-0 flex-shrink-0"
                onClick={() => onRemoveTable(table.id)}
                aria-label={`Remove table: ${table.name}`}
              >
                <GoX size={32} strokeWidth="1" />
              </Button>
            )}
          </div>

          <DropTable
            selectedProfilesData={getProfilesForTable(table.id)}
            droppableId={`table-${table.id}`}
            onProfilesChange={handleProfilesChange(table.id)}
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
