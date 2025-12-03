import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TeamWithPopulatedCompany } from "@/src/shared/entities/team";
import { ProfileWithDetailedTeams } from "@/src/shared/entities/profile";

type TableData = TeamWithPopulatedCompany | ProfileWithDetailedTeams;

interface UseDataTableConfigProps {
  teamColumns: ColumnDef<TeamWithPopulatedCompany, unknown>[];
  profileColumns: ColumnDef<ProfileWithDetailedTeams, unknown>[];
  teamsData: TeamWithPopulatedCompany[];
  profilesData: ProfileWithDetailedTeams[];
  allProfilesData: ProfileWithDetailedTeams[];
  groupingMode: "teams" | "profiles";
  currentView: "teams" | "profiles";
}

type DataTableConfig = {
  columns: ColumnDef<TableData, unknown>[];
  data: TableData[];
  showSearch: boolean;
  allowRowClick: boolean;
  showGroupsFilter: boolean;
};

export function useDataTableConfig({
  teamColumns,
  profileColumns,
  teamsData,
  profilesData,
  allProfilesData,
  groupingMode,
  currentView,
}: UseDataTableConfigProps): DataTableConfig {
  return useMemo(() => {
    if (groupingMode === "profiles") {
      return {
        columns: profileColumns as ColumnDef<TableData, unknown>[],
        data: allProfilesData as TableData[],
        showSearch: true,
        allowRowClick: false,
        showGroupsFilter: true,
      };
    } else if (currentView === "teams") {
      return {
        columns: teamColumns as ColumnDef<TableData, unknown>[],
        data: teamsData as TableData[],
        showSearch: true,
        allowRowClick: true,
        showGroupsFilter: true,
      };
    } else {
      return {
        columns: profileColumns as ColumnDef<TableData, unknown>[],
        data: profilesData as TableData[],
        showSearch: true,
        allowRowClick: false,
        showGroupsFilter: true,
      };
    }
  }, [
    groupingMode,
    currentView,
    teamColumns,
    profileColumns,
    teamsData,
    profilesData,
    allProfilesData,
  ]);
}
