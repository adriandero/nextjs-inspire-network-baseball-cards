"use client";

import posthog from "posthog-js";
import React, { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { Button } from "@/src/components/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/shadcn-ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/src/components/shadcn-ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/shadcn-ui/tooltip";
import { Check, ChevronsUpDown } from "lucide-react";
import { GoArrowRight, GoPlus, GoTrash } from "react-icons/go";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { cn } from "@/src/lib/utils";
import { useDragTableData } from "@/src/features/deck-builder/hooks/use-drag-table-data.hook";
import { useDropTables } from "@/src/features/deck-builder/hooks/use-drop-tables.hook";
import { useDragAndDropHook } from "@/src/features/deck-builder/hooks/use-drag-and-drop.hook";
import { useProfileStorageHook } from "@/src/features/deck-builder/hooks/use-profile-storage.hook";
import {
  COMPARE_TYPE_OPTIONS,
  CompareTypes,
  COMPARISON_ATTRIBUTES,
} from "@/src/features/deck-builder/entities/compare-types";
import { createProfileColumns } from "@/src/features/deck-builder/builder/columns/profile-columns";
import { teamColumns } from "@/src/features/deck-builder/builder/columns/team-columns";
import DragTable from "@/src/features/deck-builder/builder/drag-table";
import DraggedProfilePreview from "@/src/features/deck-builder/builder/draggable-profile-preview";
import ProfileTablesManager from "@/src/features/deck-builder/builder/drop-table-manager";
import { TeamWithPopulatedCompany } from "@/src/shared/entities/team.types";
import { ProfileWithDetailedTeams } from "@/src/shared/entities/profile.types";
import { ProfileIdentifierTable } from "@/src/features/deck-builder/entities/profile-identifier-table.model";
import { useDragTableView } from "@/src/features/deck-builder/hooks/use-drag-table-view.hook";
import { useGateValue } from "@statsig/react-bindings";

const useProfileTable = (
  profiles: ProfileWithDetailedTeams[],
  dropTables: ProfileIdentifierTable[],
  selectedTableId: string,
  handleProfileCheck: (profileId: string, tableId: string) => void,
  handleBulkProfileSelect: (
    allProfileIds: string[],
    isSelected: boolean,
  ) => void,
) => {
  const [sorting, setSorting] = useState<SortingState>([
    { desc: false, id: "name" },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns = React.useMemo(
    () =>
      createProfileColumns(
        dropTables,
        selectedTableId,
        handleProfileCheck,
        handleBulkProfileSelect,
      ),
    [dropTables, selectedTableId, handleProfileCheck, handleBulkProfileSelect],
  );

  const table = useReactTable({
    data: profiles,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: profiles.reduce((acc, profile, index) => {
        acc[index] = dropTables.some((table) =>
          table.profiles.includes(profile.uuid),
        );
        return acc;
      }, {} as RowSelectionState),
    },
  });

  const resetState = useCallback(() => {
    setSorting([{ desc: false, id: "name" }]);
    setColumnFilters([]);
    setColumnVisibility({});
  }, []);

  return { table, columns, resetState };
};

const useTeamTable = (teams: TeamWithPopulatedCompany[]) => {
  const [sorting, setSorting] = useState<SortingState>([
    { desc: false, id: "name" },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: teams,
    columns: teamColumns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const resetState = useCallback(() => {
    setSorting([{ desc: false, id: "name" }]);
    setColumnFilters([]);
    setColumnVisibility({});
  }, []);

  return { table, columns: teamColumns, resetState };
};

const BuilderContext = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const principlesYouGraphEnabled = useGateValue("archetypes_grid");

  const {
    view,
    groupingMode,
    selectedTeam,
    selectedTeamName,
    selectedType,
    setSelectedType,
    handleGroupingChange,
    handleTeamClick,
    handleBackToTeams,
    restoreViewState,
  } = useDragTableView();

  const { teams, profilesByTeam, allProfilesData, isLoadingProfiles, error } =
    useDragTableData(view, groupingMode, selectedTeam);

  const {
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
  } = useDropTables();

  const {
    activeDragProfile,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useDragAndDropHook({
    onCreateTableWithProfile: handleCreateTableWithProfile,
    onUpdateTableProfiles: handleUpdateTableProfiles,
    profileTables: dropTables,
  });

  const { clearStorage } = useProfileStorageHook({
    profileTables: dropTables,
    selectedType,
    groupingMode,
    onRestore: useCallback(
      (data) => {
        restoreViewState(data);
        restoreDropTables(data);
      },
      [restoreViewState, restoreDropTables],
    ),
  });

  const handleBulkProfileSelect = useCallback(
    (allProfileIds: string[], isSelected: boolean) => {
      if (isSelected) {
        const selectedTable = dropTables.find(
          (table) => table.id === selectedTableId,
        );
        if (selectedTable) {
          const profilesToAdd = allProfileIds.filter(
            (id) => !selectedTable.profiles.includes(id),
          );
          handleUpdateTableProfiles(selectedTableId, [
            ...selectedTable.profiles,
            ...profilesToAdd,
          ]);
        }
      } else {
        dropTables.forEach((table) => {
          const updatedProfiles = table.profiles.filter(
            (id) => !allProfileIds.includes(id),
          );
          handleUpdateTableProfiles(table.id, updatedProfiles);
        });
      }
    },
    [dropTables, selectedTableId, handleUpdateTableProfiles],
  );

  const getCurrentProfiles = useCallback((): ProfileWithDetailedTeams[] => {
    if (groupingMode === "profiles") {
      return allProfilesData;
    } else if (view === "profiles" && selectedTeam && profilesByTeam?.teams) {
      return profilesByTeam.teams[selectedTeam] || [];
    }
    return [];
  }, [groupingMode, view, allProfilesData, selectedTeam, profilesByTeam]);

  const getCurrentTeams = useCallback((): TeamWithPopulatedCompany[] => {
    return view === "teams" ? teams : [];
  }, [view, teams]);

  const profileTable = useProfileTable(
    getCurrentProfiles(),
    dropTables,
    selectedTableId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (profileId: string, _tableId: string) => {
      handleProfileCheck(profileId);
    },
    handleBulkProfileSelect,
  );

  const teamTable = useTeamTable(getCurrentTeams());

  const isShowingProfiles = groupingMode === "profiles" || view === "profiles";
  const currentTable = isShowingProfiles ? profileTable : teamTable;

  const hasEmptyProfiles = dropTables.some(
    (table) => table.profiles.length === 0,
  );
  const isDisabled = !selectedType || hasEmptyProfiles;

  const encodeProfileTablesToURL = useCallback((tables: typeof dropTables) => {
    return tables
      .map((group) => {
        const profileUuids = group.profiles.join(",");
        return `${encodeURIComponent(group.name)}:${group.id}:${profileUuids}`;
      })
      .join(";");
  }, []);

  const handleContinue = useCallback(() => {
    const urlParam = encodeProfileTablesToURL(dropTables);
    const comparisonSlug = COMPARISON_ATTRIBUTES[selectedType].slug;
    posthog.capture("test", { amount: 99 });
    router.push(`/deckbuilder/${comparisonSlug}/?groupedProfiles=${urlParam}`);
  }, [dropTables, selectedType, router, encodeProfileTablesToURL]);

  const handleCompareTypeSelect = useCallback(
    (type: CompareTypes) => {
      setSelectedType(type);
      setOpen(false);
    },
    [setSelectedType],
  );

  const handleClearAllSelections = useCallback(() => {
    handleClearSelections();
    clearStorage();
  }, [handleClearSelections, clearStorage]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex gap-4 px-6 md:flex-nowrap flex-wrap">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        collisionDetection={pointerWithin}
      >
        <div className="rounded-lg md:w-3/5 w-full">
          <DragTable
            view={view}
            groupingMode={groupingMode}
            selectedTeamName={selectedTeamName}
            table={currentTable.table}
            searchInputRef={searchInputRef}
            handleBackToTeams={handleBackToTeams}
            handleTeamClick={(teamSlug: string, teamName: string) => {
              handleTeamClick(teamSlug, teamName);
              currentTable.resetState();
            }}
            handleGroupingChange={(mode: "teams" | "profiles") => {
              handleGroupingChange(mode);
              currentTable.resetState();
            }}
            columns={currentTable.columns}
            isLoadingProfiles={isLoadingProfiles}
            handleOneWayProfileCheck={handleOneWayProfileCheck}
            handleProfileCheck={handleProfileCheck}
          />
        </div>

        <div className="rounded-lg md:w-2/5 w-full">
          <div className="flex w-full items-center justify-end py-4 gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-fit justify-between"
                >
                  {COMPARISON_ATTRIBUTES[selectedType]?.title || "Compare Type"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0">
                <Command>
                  <CommandInput placeholder="Search compare type..." />
                  <CommandEmpty>No compare type found.</CommandEmpty>
                  <CommandGroup>
                    {COMPARE_TYPE_OPTIONS.filter((item) => {
                      if (
                        item.value ===
                        CompareTypes.PRINCIPLES_YOU_ARCHETYPES_GRAPH
                      ) {
                        return principlesYouGraphEnabled;
                      }
                      return true;
                    }).map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.data.title}
                        onSelect={() => handleCompareTypeSelect(item.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedType === item.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {item.data.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="self-center hover:text-inspireRed"
                    onClick={handleClearAllSelections}
                  >
                    <GoTrash strokeWidth="0.6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear All</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <ProfileTablesManager
            profileIdentifierTables={dropTables}
            onRemoveTable={handleRemoveTable}
            onUpdateTableProfiles={handleUpdateTableProfiles}
            onUpdateTableName={handleUpdateTableName}
            setSelectedTableId={setSelectedTableId}
            selectedTableId={selectedTableId}
            isLoadingProfiles={isLoadingProfiles}
            allProfiles={allProfilesData}
            onCreateTableWithProfile={handleCreateTableWithProfile}
          />

          <div className="flex justify-end pt-4 gap-2">
            <Button
              variant="outline"
              className="self-center mr-auto"
              onClick={handleAddTable}
            >
              <GoPlus size={32} />
              <span className="hidden lg:inline"> Add Group</span>
            </Button>

            <Button
              variant="outline"
              disabled={isDisabled}
              className="hover:border-primary"
              onClick={handleContinue}
            >
              Continue <GoArrowRight size={24} />
            </Button>
          </div>
          {isDisabled ? (
            <p className="text-sm text-inspireRed text-center py-4">
              Add profiles to empty group or remove it to continue
            </p>
          ) : null}
        </div>

        <DragOverlay>
          {activeDragProfile ? (
            <DraggedProfilePreview profile={activeDragProfile} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default BuilderContext;
