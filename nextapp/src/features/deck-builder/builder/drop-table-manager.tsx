"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/src/components/shadcn-ui/button";
import { SanityDocument } from "next-sanity";
import DropTable from "./drop-table";
import { GoX } from "react-icons/go";
import { Input } from "@/src/components/shadcn-ui/input";
import { ProfileIdentifierTable } from "@/src/features/deck-builder/entities/profile-identifier-table.model";
import { useProfileTableData } from "@/src/features/deck-builder/hooks/use-profile-table-data.hook";
import { useTableNameEditor } from "@/src/features/deck-builder/hooks/use-table-name-editor.hook";
import { ProfileWithDetailedTeams } from "@/src/shared/entities/profile.types";
import { cn } from "@/src/lib/utils";
import {
  CompareProfileTableSkeleton,
  Skeleton,
} from "@/src/components/custom-ui/table-skeleton";
import { useTableLoadingState } from "@/src/features/deck-builder/hooks/use-async-table-state.hook";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/shadcn-ui/accordion";

interface ProfileTablesManagerProps {
  profileIdentifierTables: ProfileIdentifierTable[];
  onRemoveTable: (tableId: string) => void;
  onUpdateTableProfiles: (tableId: string, profiles: string[]) => void;
  onUpdateTableName: (tableId: string, name: string) => void;
  onCreateTableWithProfile: (profileId: string) => void;
  setSelectedTableId: (tableId: string) => void;
  selectedTableId: string;
  isLoadingProfiles: boolean;
  allProfiles: ProfileWithDetailedTeams[];
}

const DropTableMemo = React.memo(DropTable);

const TableHeaderSkeleton = () => (
  <div className="flex h-12 items-center end">
    <div className="font-medium text-base min-w-0  flex">
      <div className="hover:bg-gray-100 px-2 rounded overflow-x-auto overflow-y-hidden w-fit">
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  </div>
);

const TableSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={className}>
    <TableHeaderSkeleton />
    <CompareProfileTableSkeleton rowCount={3} />
  </div>
);

const ProfileTablesManager: React.FC<ProfileTablesManagerProps> = ({
  profileIdentifierTables,
  onRemoveTable,
  onUpdateTableProfiles,
  onUpdateTableName,
  // TODO: may get used later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCreateTableWithProfile,
  setSelectedTableId,
  isLoadingProfiles,
  selectedTableId,
  allProfiles,
}) => {
  const { hasLoadedOnce } = useTableLoadingState(
    allProfiles,
    isLoadingProfiles
  );

  const [openTables, setOpenTables] = useState<string[]>([]);
  const seenTablesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentTableIds = profileIdentifierTables.map((t) => t.id);
    const newTableIds = currentTableIds.filter(
      (id) => !seenTablesRef.current.has(id)
    );

    if (newTableIds.length > 0) {
      newTableIds.forEach((id) => seenTablesRef.current.add(id));
      setOpenTables((prev) => [...prev, ...newTableIds]);
    }

    const deletedTables = Array.from(seenTablesRef.current).filter(
      (id) => !currentTableIds.includes(id)
    );

    if (deletedTables.length > 0) {
      deletedTables.forEach((id) => seenTablesRef.current.delete(id));
      setOpenTables((prev) =>
        prev.filter((id) => currentTableIds.includes(id))
      );
    }
  }, [profileIdentifierTables]);

  const { getProfilesForTable } = useProfileTableData(
    profileIdentifierTables,
    allProfiles
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

  const profileChangeHandlers = useMemo(
    () =>
      new Map(
        profileIdentifierTables.map((table) => [
          table.id,
          (profiles: SanityDocument[]) =>
            onUpdateTableProfiles(
              table.id,
              profiles.map((profile) => profile.uuid),
            ),
        ]),
      ),
    [profileIdentifierTables, onUpdateTableProfiles],
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
    [handleSaveEdit, cancelEditing]
  );

  if ((isLoadingProfiles && allProfiles.length === 0) || (!hasLoadedOnce && allProfiles.length === 0)) {
    return (
      <div className="flex flex-col w-full">
        <TableSkeleton />
      </div>
    );
  }

  if (profileIdentifierTables.length === 0 && hasLoadedOnce) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-500">
        No tables created yet
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <Accordion
        type="multiple"
        value={openTables}
        onValueChange={setOpenTables}
        className="w-full"
      >
        {profileIdentifierTables.map((table) => (
          <AccordionItem
            key={table.id}
            value={table.id}
            className={cn(
              "w-full border-b",
              selectedTableId === table.id ? "border-primary" : null,
              openTables.includes(table.id) && "border-transparent"
            )}
          >
            <div className="flex h-16 items-center gap-2">
              {profileIdentifierTables.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:text-inspireRed w-6 h-6 p-0 flex-shrink-0"
                  onClick={() => onRemoveTable(table.id)}
                  aria-label={`Remove table: ${table.name}`}
                >
                  <GoX size={32} strokeWidth="1" />
                </Button>
              )}
              <div className="min-w-0 flex-1">
                {isEditing(table.id) ? (
                  <Input
                    ref={inputRef}
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onBlur={handleSaveEdit}
                    className="h-8 w-full text-left p-2"
                    aria-label="Edit table name"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => startEditing(table.id, table.name)}
                    className="hover:bg-gray-100 px-2 rounded max-w-full truncate text-left font-medium text-base cursor-text"
                    aria-label={`Edit table name: ${table.name}`}
                  >
                    {table.name}
                  </button>
                )}
              </div>
              <AccordionTrigger aria-label={`Toggle table: ${table.name}`} />
            </div>

            <AccordionContent className="w-full ">
              <DropTableMemo
                selectedProfilesData={getProfilesForTable(table.id)}
                droppableId={`table-${table.id}`}
                onProfilesChange={profileChangeHandlers.get(table.id)}
                setSelectedTableId={setSelectedTableId}
                table={table}
                isSelectedTable={selectedTableId === table.id}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ProfileTablesManager;
