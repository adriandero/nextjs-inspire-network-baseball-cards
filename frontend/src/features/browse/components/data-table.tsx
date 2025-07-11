"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { UserSanity } from "@/src/lib/entities/user";
import { useDataTableConfig } from "@/src/features/browse/hooks/use-data-table-config.hook";
import { useDataTableData } from "@/src/features/browse/hooks/use-data-table-data.hook";
import { useDataTableView } from "@/src/features/browse/hooks/use-data-table-view.hook";
import { Toolbar } from "@/src/features/browse/components/toolbar";
import { Breadcrumbs } from "@/src/features/browse/components/breadcrumbs";
import { Content } from "@/src/features/browse/components/content";
import {
  TeamWithPopulatedCompany,
} from "@/src/lib/entities/team";
import { ProfileWithDetailedTeams } from "@/src/lib/entities/profile";

// Union type for all possible table data
type TableData = TeamWithPopulatedCompany | ProfileWithDetailedTeams;

interface DataTableProps {
  teamColumns: ColumnDef<TeamWithPopulatedCompany, unknown>[];
  profileColumns: ColumnDef<ProfileWithDetailedTeams, unknown>[];
  userProfileData: UserSanity;
}

export function DataTable({
  teamColumns,
  profileColumns,
  userProfileData,
}: DataTableProps) {
  const {
    teamsData,
    profilesData,
    allProfilesData,
    loadingTeams,
    loadingProfiles,
    fetchTeamsData,
    fetchTeamProfiles,
    fetchAllProfiles,
  } = useDataTableData(userProfileData);

  React.useEffect(() => {
    fetchAllProfiles();
  }, [fetchAllProfiles]);

  const {
    groupingMode,
    currentView,
    selectedTeam,
    switchToTeamsView,
    switchToProfilesView,
    changeGroupingMode,
  } = useDataTableView();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      groups: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});

  const { columns, data, showSearch, allowRowClick, showGroupsFilter } =
    useDataTableConfig({
      teamColumns,
      profileColumns,
      teamsData,
      profilesData: profilesData as ProfileWithDetailedTeams[],
      allProfilesData: allProfilesData as ProfileWithDetailedTeams[],
      groupingMode,
      currentView,
    });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const resetTableState = React.useCallback(() => {
    setSorting([]);
    setColumnFilters([]);
    setColumnVisibility({ groups: false });
    setRowSelection({});
  }, []);

  const handleTeamSelect = React.useCallback(
    async (team: TeamWithPopulatedCompany) => {
      await fetchTeamProfiles(team);
      switchToProfilesView(team);
      resetTableState();
    },
    [fetchTeamProfiles, switchToProfilesView, resetTableState],
  );

  const handleGroupingChange = React.useCallback(
    async (mode: "teams" | "profiles") => {
      changeGroupingMode(mode);
      resetTableState();

      if (mode === "profiles" && allProfilesData.length === 0) {
        await fetchAllProfiles();
      } else if (mode === "teams" && teamsData.length === 0) {
        await fetchTeamsData();
      }
    },
    [
      changeGroupingMode,
      resetTableState,
      allProfilesData.length,
      teamsData.length,
      fetchAllProfiles,
      fetchTeamsData,
    ],
  );

  const handleReturnToTeams = React.useCallback(async () => {
    if (groupingMode === "teams") {
      switchToTeamsView();
      resetTableState();

      if (teamsData.length === 0) {
        await fetchTeamsData();
      }
    }
  }, [
    groupingMode,
    switchToTeamsView,
    resetTableState,
    teamsData.length,
    fetchTeamsData,
  ]);

  const handleRowClick = React.useCallback(
    (row: TableData) => {
      if (allowRowClick) {
        if (
          "_type" in row &&
          row._type === "team" &&
          "slug" in row &&
          !("uuid" in row)
        ) {
          handleTeamSelect(row as TeamWithPopulatedCompany);
        }
      }
    },
    [allowRowClick, handleTeamSelect],
  );

  return (
    <div className="sm:min-w-96 w-full max-w-screen-lg sm:px-6 px-2">
      <div className="flex items-center py-4 gap-2 justify-between">
        <Breadcrumbs
          groupingMode={groupingMode}
          currentView={currentView}
          selectedTeam={selectedTeam}
          onReturnToTeams={handleReturnToTeams}
        />

        <Toolbar
          table={table}
          showSearch={showSearch}
          showGroupsFilter={showGroupsFilter}
          groupingMode={groupingMode}
          onGroupingChange={handleGroupingChange}
        />
      </div>

      <Content
        table={table}
        allowRowClick={allowRowClick}
        loadingProfiles={loadingTeams || loadingProfiles}
        onRowClick={allowRowClick ? handleRowClick : undefined}
        hasData={data.length > 0}
      />
    </div>
  );
}
