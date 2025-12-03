import React, { RefObject, useCallback } from "react";
import {
  ColumnDef,
  type Table as ReactTable,
  Row,
} from "@tanstack/react-table";
import { ProfileWithDetailedTeams } from "@/src/shared/entities/profile";
import { TeamWithPopulatedCompany } from "@/src/shared/entities/team";
import { DragTableToolbar } from "@/src/features/deck-builder/components/drag-table-toolbar";
import { GenericTableBody } from "@/src/features/deck-builder/components/drag-table-body";
import { TeamRow } from "@/src/features/deck-builder/builder/rows/team-row";
import { DraggableProfileRow } from "@/src/features/deck-builder/builder/rows/draggable-profile-row";

interface DragTableProps {
  view: "teams" | "profiles";
  groupingMode: "teams" | "profiles";
  selectedTeamName: string;
  table:
    | ReactTable<ProfileWithDetailedTeams>
    | ReactTable<TeamWithPopulatedCompany>;
  searchInputRef: RefObject<HTMLInputElement>;
  handleBackToTeams: () => void;
  handleTeamClick: (teamSlug: string, teamName: string) => void;
  handleGroupingChange: (mode: "teams" | "profiles") => void;
  handleOneWayProfileCheck: (uuid: string) => void;
  handleProfileCheck: (uuid: string) => void;
  columns:
    | ColumnDef<ProfileWithDetailedTeams>[]
    | ColumnDef<TeamWithPopulatedCompany>[];
  isLoadingProfiles?: boolean;
}

const DragTable: React.FC<DragTableProps> = ({
  view,
  groupingMode,
  selectedTeamName,
  table,
  searchInputRef,
  handleBackToTeams,
  handleTeamClick,
  handleGroupingChange,
  handleOneWayProfileCheck,
  columns,
  isLoadingProfiles = true,
}) => {
  const isShowingProfiles = groupingMode === "profiles" || view === "profiles";

  const renderProfileRow = useCallback(
    (row: Row<ProfileWithDetailedTeams>) => (
      <DraggableProfileRow
        key={row.id}
        row={row}
        onProfileCheck={handleOneWayProfileCheck}
      />
    ),
    [handleOneWayProfileCheck]
  );

  const renderTeamRow = useCallback(
    (row: Row<TeamWithPopulatedCompany>) => {
      const shouldAllowRowClick = groupingMode === "teams" && view === "teams";
      return (
        <TeamRow
          key={row.id}
          row={row}
          onTeamClick={handleTeamClick}
          isClickable={shouldAllowRowClick}
        />
      );
    },
    [groupingMode, view, handleTeamClick]
  );

  return (
    <div className="w-full">
      {isShowingProfiles ? (
        <DragTableToolbar
          table={table as ReactTable<ProfileWithDetailedTeams>}
          searchInputRef={searchInputRef}
          groupingMode={groupingMode}
          view={view}
          selectedTeamName={selectedTeamName}
          onBackToTeams={handleBackToTeams}
          onGroupingChange={handleGroupingChange}
        />
      ) : (
        <DragTableToolbar<TeamWithPopulatedCompany>
          table={table as ReactTable<TeamWithPopulatedCompany>}
          searchInputRef={searchInputRef}
          groupingMode={groupingMode}
          view={view}
          selectedTeamName={selectedTeamName}
          onBackToTeams={handleBackToTeams}
          onGroupingChange={handleGroupingChange}
        />
      )}

      {isShowingProfiles ? (
        <GenericTableBody<ProfileWithDetailedTeams>
          table={table as ReactTable<ProfileWithDetailedTeams>}
          columns={columns as ColumnDef<ProfileWithDetailedTeams>[]}
          isLoading={isLoadingProfiles}
          emptyMessage="No TUG Cards found."
          renderRow={renderProfileRow}
        />
      ) : (
        <GenericTableBody<TeamWithPopulatedCompany>
          table={table as ReactTable<TeamWithPopulatedCompany>}
          columns={columns as ColumnDef<TeamWithPopulatedCompany>[]}
          isLoading={isLoadingProfiles}
          emptyMessage="No teams found."
          renderRow={renderTeamRow}
        />
      )}
    </div>
  );
};

export default DragTable;
