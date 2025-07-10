"use client";

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
import { useViewState } from "../hooks/use-view-state.hook";
import { useDropTables } from "@/src/features/deck-builder/hooks/use-drop-tables.hook";
import { useDragAndDrop } from "@/src/features/deck-builder/hooks/use-drag-and-drop";
import { useProfileStorage } from "@/src/features/deck-builder/hooks/use-profile-storage";
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
import { UserSanity } from "@/src/lib/entities/user";
import { TeamWithPopulatedCompany } from "@/src/lib/entities/team";
import { ProfileWithDetailedTeams } from "@/src/lib/entities/profile";

interface TeamProfileSelectorProps {
  userProfileData: UserSanity;
}

const BuilderContext = ({ userProfileData }: TeamProfileSelectorProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const {
    teams,
    profilesByTeam,
    allProfilesData,
    isLoading,
    isLoadingProfiles,
    error,
  } = useDragTableData({ userProfileData });

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
  } = useViewState();

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
  } = useDragAndDrop({
    onCreateTableWithProfile: handleCreateTableWithProfile,
    onUpdateTableProfiles: handleUpdateTableProfiles,
    profileTables: dropTables,
  });

  const { clearStorage } = useProfileStorage({
    profileTables: dropTables,
    selectedTeam,
    selectedTeamName,
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

  const resetTableState = useCallback(() => {
    setSorting([]);
    setColumnFilters([]);
    setColumnVisibility({});
  }, []);

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

  type TableData = ProfileWithDetailedTeams | TeamWithPopulatedCompany;

  const getTableData = useCallback((): TableData[] => {
    if (groupingMode === "profiles") {
      return allProfilesData;
    } else if (view === "teams") {
      return teams;
    } else {
      return selectedTeam && profilesByTeam?.teams
        ? profilesByTeam.teams[selectedTeam] || []
        : [];
    }
  }, [
    groupingMode,
    view,
    allProfilesData,
    teams,
    selectedTeam,
    profilesByTeam,
  ]);

  const { data, columns } = React.useMemo(() => {
    if (groupingMode === "profiles" || view === "profiles") {
      const profileData = getTableData() as ProfileWithDetailedTeams[];
      const profileColumns = createProfileColumns(
        dropTables,
        handleProfileCheck,
        handleBulkProfileSelect,
      );
      return { data: profileData, columns: profileColumns };
    } else {
      const teamData = getTableData() as TeamWithPopulatedCompany[];
      return { data: teamData, columns: teamColumns };
    }
  }, [
    groupingMode,
    view,
    getTableData,
    dropTables,
    handleProfileCheck,
    handleBulkProfileSelect,
  ]);

  const table = useReactTable({
    data,
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
      rowSelection:
        view === "profiles" || groupingMode === "profiles"
          ? (data as ProfileWithDetailedTeams[]).reduce(
              (acc, profile, index) => {
                acc[index] = dropTables.some((table) =>
                  table.profiles.includes(profile.uuid),
                );
                return acc;
              },
              {} as RowSelectionState,
            )
          : {},
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

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
            table={table}
            searchInputRef={searchInputRef}
            handleBackToTeams={handleBackToTeams}
            handleTeamClick={(teamSlug: string, teamName: string) => {
              handleTeamClick(teamSlug, teamName);
              resetTableState();
            }}
            handleGroupingChange={(mode: "teams" | "profiles") => {
              handleGroupingChange(mode);
              resetTableState();
            }}
            columns={columns}
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
                  {COMPARISON_ATTRIBUTES[selectedType].title || "Compare Type"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0">
                <Command>
                  <CommandInput placeholder="Search compare type..." />
                  <CommandEmpty>No compare type found.</CommandEmpty>
                  <CommandGroup>
                    {COMPARE_TYPE_OPTIONS.map((item) => (
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
                <TooltipTrigger>
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
            allProfiles={allProfilesData}
            onCreateTableWithProfile={function (profileId: string): void {
              throw new Error("Function not implemented.");
            }}
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
              disabled={!selectedType || !dropTables[0]?.profiles[0]}
              className="hover:border-primary"
              onClick={handleContinue}
            >
              Continue <GoArrowRight size={24} />
            </Button>
          </div>
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
