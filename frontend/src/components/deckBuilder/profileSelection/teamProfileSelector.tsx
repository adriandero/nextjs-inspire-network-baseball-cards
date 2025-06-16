/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import {
  getAllProfilesGroupedByTeam,
  getUserTeams,
  getAllTeams,
  ProfilesByTeam,
  TeamsFromUser,
  getAllProfiles,
} from "@/lib/utils/sanityApi/profileRequests";
import { SanityDocument } from "next-sanity";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  pointerWithin,
  defaultDropAnimationSideEffects,
  DropAnimation,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { nanoid } from "nanoid";
import RenderTable from "@/components/compare/profileSelection/RenderTable";
import ProfileTablesManager, {
  ProfileTable,
} from "@/components/deckBuilder/profileSelection/ProfileTableManager";
import DraggedProfilePreview from "@/components/compare/profileSelection/DraggableProfilePreview";
import { Button } from "@/components/ui/button";
import { GoArrowRight, GoPlus, GoTrash } from "react-icons/go";
import {
  CompareType,
  deckBuilderStoreInstance,
} from "@/components/deckBuilder/deckBuilderStore";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, ChevronsUpDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

interface TeamProfileSelectorProps {
  userProfileData: SanityDocument;
}

const STORAGE_KEY = "profileSelector_data";

const TeamProfileSelector = ({ userProfileData }: TeamProfileSelectorProps) => {
  type ViewType = "teams" | "profiles";

  const [view, setView] = useState<ViewType>("teams");
  const [groupingMode, setGroupingMode] = useState<"teams" | "profiles">(
    "teams"
  );
  const [open, setOpen] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedTeamName, setSelectedTeamName] = useState<string>("");
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const router = useRouter();

  const store = deckBuilderStoreInstance;

  // Profile tables for grouping
  const [profileTables, setProfileTables] = useState<ProfileTable[]>([
    {
      id: nanoid(),
      profiles: [],
      name: "Default Group",
    },
  ]);

  const [selectedTableId, setSelectedTableId] = useState<string>(
    profileTables[0].id
  );

  const [teams, setTeams] = useState<SanityDocument[]>([]);
  const [profilesByTeam, setProfilesByTeam] = useState<ProfilesByTeam>({
    teams: {},
  });
  const [allProfilesData, setAllProfilesData] = useState<SanityDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDragProfile, setActiveDragProfile] =
    useState<SanityDocument | null>(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);
  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  const fillAllUserTeams = useCallback(async () => {
    let profilesFromUserTeams: TeamsFromUser = { teams: [] };
    if (userProfileData?.team) {
      profilesFromUserTeams = await getUserTeams(userProfileData.email);
    }
    return profilesFromUserTeams;
  }, [userProfileData.email, userProfileData?.team]);

  const fillDataTableTeamData = useCallback(async (): Promise<
    SanityDocument[]
  > => {
    const emptyData: SanityDocument[] = [];
    if (userProfileData.permission === "Admin") {
      return await getAllTeams();
    }
    const data = userProfileData?.team
      ? (await fillAllUserTeams()).teams
      : emptyData;
    return data;
  }, [userProfileData, fillAllUserTeams]);

  const resetTableState = () => {
    setSorting([]);
    setColumnFilters([]);
    setColumnVisibility({});
  };

  const fetchAllProfiles = async (): Promise<SanityDocument[]> => {
    try {
      setIsLoadingProfiles(true);

      const availableTeams = await fillDataTableTeamData();
      let allProfiles: SanityDocument[] = [];

      if (allProfilesData.length <= 0) {
        const profilesData = await getAllProfiles();
        allProfiles = profilesData;
      }

      return allProfiles;
    } catch (error) {
      console.error("Error fetching all profiles:", error);
      return [];
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  const handleGroupingChange = async (mode: "teams" | "profiles") => {
    setGroupingMode(mode);
    resetTableState();

    if (mode === "profiles") {
      setView("profiles");
      setSelectedTeam(null);
      setSelectedTeamName("");
    } else {
      setView("teams");
      setSelectedTeam(null);
      setSelectedTeamName("");
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        const teamsData = await fillDataTableTeamData();
        setTeams(teamsData);

        const profilesData = await getAllProfilesGroupedByTeam();
        setProfilesByTeam(profilesData);

        if (allProfilesData.length === 0) {
          const profiles = await fetchAllProfiles();
          setAllProfilesData(profiles);
        }

        setIsLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setIsLoading(false);
        console.error("Error loading data:", err);
      }
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fillDataTableTeamData]);

  const handleTeamClick = (teamSlug: string, teamName: string): void => {
    if (groupingMode === "teams") {
      setSelectedTeam(teamSlug);
      setSelectedTeamName(teamName);
      setView("profiles");
      resetTableState();
    }
  };

  const handleBackToTeams = (): void => {
    if (groupingMode === "teams") {
      setView("teams");
      setSelectedTeam(null);
      setSelectedTeamName("");
      resetTableState();
    }
  };

  const handleProfileCheck = (profileId: string): void => {
    setProfileTables((prev) => {
      const updatedTables = [...prev];
      const selectedTableIndex = updatedTables.findIndex(
        (table) => table.id === selectedTableId
      );

      if (selectedTableIndex !== -1) {
        const selectedTable = updatedTables[selectedTableIndex];
        if (selectedTable.profiles.includes(profileId)) {
          selectedTable.profiles = selectedTable.profiles.filter(
            (id) => id !== profileId
          );
        } else {
          selectedTable.profiles = [...selectedTable.profiles, profileId];
        }
      }

      return updatedTables;
    });
  };

  const handleOneWayProfileCheck = (profileId: string): void => {
    setProfileTables((prev) => {
      const updatedTables = [...prev];
      const selectedTableIndex = updatedTables.findIndex(
        (table) => table.id === selectedTableId
      );

      if (selectedTableIndex !== -1) {
        const selectedTable = updatedTables[selectedTableIndex];
        selectedTable.profiles = [...selectedTable.profiles, profileId];
      }

      return updatedTables;
    });
  };

  const setSelectedTableIdState = (profileId: string): void => {
    setSelectedTableId(profileId);
  };

  const handleAddTable = () => {
    setProfileTables((prev) => [
      ...prev,
      {
        id: nanoid(),
        profiles: [],
        name: `Group ${prev.length + 1}`,
      },
    ]);
  };

  const handleRemoveTable = (tableId: string) => {
    setProfileTables((prev) => prev.filter((table) => table.id !== tableId));
  };

  const handleUpdateTableProfiles = (tableId: string, profiles: string[]) => {
    setProfileTables((prev) => {
      return prev.map((table) => {
        if (table.id === tableId) {
          return { ...table, profiles };
        }
        return table;
      });
    });
  };

  const handleCreateTableWithProfile = (profileId: string) => {
    // Create a new table with the dropped profile
    const newTable: ProfileTable = {
      id: nanoid(),
      profiles: [profileId],
      name: `Group ${profileTables.length + 1}`,
    };

    // Add the new table
    setProfileTables((prev) => [...prev, newTable]);
  };

  // Table column definitions for teams
  const teamColumns: ColumnDef<SanityDocument>[] = [
    {
      accessorKey: "name",
      header: "Team Name",
      cell: ({ row }) => (
        <div className="font-bold text-base">{row.getValue("name")}</div>
      ),
    },
  ];

  // Table column definitions for profiles
  const profileColumns: ColumnDef<SanityDocument>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getFilteredRowModel().rows.length > 0 &&
            table.getFilteredRowModel().rows.every((row) => {
              // Check if this profile is in any table
              const profileId = row.original.uuid;
              return profileTables.some((table) =>
                table.profiles.includes(profileId)
              );
            })
          }
          onCheckedChange={(value) => {
            const allProfileIds = table
              .getFilteredRowModel()
              .rows.map((row) => row.original.uuid);

            if (value) {
              // Add all filtered profiles to the first table
              setProfileTables((prev) => {
                const updatedTables = [...prev];
                if (updatedTables.length > 0) {
                  const firstTable = { ...updatedTables[0] };

                  // Add all filtered profiles that aren't already selected
                  const newProfiles = [...firstTable.profiles];
                  allProfileIds.forEach((id) => {
                    if (!newProfiles.includes(id)) {
                      newProfiles.push(id);
                    }
                  });

                  firstTable.profiles = newProfiles;
                  updatedTables[0] = firstTable;
                }
                return updatedTables;
              });
            } else {
              // Remove all filtered profiles from all tables
              setProfileTables((prev) => {
                return prev.map((table) => ({
                  ...table,
                  profiles: table.profiles.filter(
                    (id: any) => !allProfileIds.includes(id)
                  ),
                }));
              });
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={profileTables.some((table) =>
            table.profiles.includes(row.original.uuid)
          )}
          onCheckedChange={() => handleProfileCheck(row.original.uuid)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const profile = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={
                    profile.profileImage
                      ? profile.profileImage.asset.url
                      : "/defaultAvatar.png"
                  }
                  alt={profile.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="font-medium text-base">{profile.name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "jobRole",
      header: "Role",
      cell: ({ row }) => {
        const jobRoles = row.original.jobRole;
        return jobRoles && jobRoles.length > 0 ? (
          <div className="text-sm text-gray-500">{jobRoles.join(", ")}</div>
        ) : null;
      },
    },
  ];

  // Determine which data to show based on grouping mode and view
  const getTableData = () => {
    if (groupingMode === "profiles") {
      return allProfilesData;
    } else if (view === "teams") {
      return teams;
    } else {
      return selectedTeam && profilesByTeam?.teams
        ? profilesByTeam.teams[selectedTeam] || []
        : [];
    }
  };

  const data = getTableData();
  const columns =
    groupingMode === "profiles" || view === "profiles"
      ? profileColumns
      : teamColumns;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

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
          ? data.reduce((acc, profile, index) => {
              // Check if profile is in any table
              const isSelected = profileTables.some((table) =>
                table.profiles.includes(profile.uuid)
              );
              acc[index] = isSelected;
              return acc;
            }, {} as RowSelectionState)
          : {},
    },
  });

  const RenderLoading = () => (
    <div className="flex justify-center items-center h-48">
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  const RenderError = () => (
    <div className="flex justify-center items-center h-48">
      <p className="text-red-500">{error}</p>
    </div>
  );

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // Set the currently dragged profile
    if (active.data.current) {
      setActiveDragProfile(active.data.current.profile);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Reset the drag state
    setActiveDragProfile(null);

    // If dropped on a droppable target
    if (over && active.data.current) {
      const profileId = active.id as string;
      const targetId = over.id as string;

      // Check if it's the new group creator
      if (targetId === "new-group-creator") {
        handleCreateTableWithProfile(profileId);
      }
      // Check if it's one of our table dropzones
      else if (targetId.startsWith("table-")) {
        const tableId = targetId.replace("table-", "");

        // Update the target table
        setProfileTables((prev) => {
          return prev.map((table) => {
            if (table.id === tableId) {
              // Only add if not already in this table
              if (!table.profiles.includes(profileId)) {
                return {
                  ...table,
                  profiles: [...table.profiles, profileId],
                };
              }
            }
            return table;
          });
        });
      }
    }
  };

  const [currentCompareType, setCompareType] = useState<CompareType | null>(
    CompareType.WORKING_GENIUS
  );

  useEffect(() => {
    // Only save if we have meaningful data to save
    if (
      profileTables.some((table) => table.profiles.length > 0) ||
      selectedTeam
    ) {
      const dataToSave = {
        profileTables,
        selectedTeam,
        selectedTeamName,
        currentCompareType,
        groupingMode,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [
    profileTables,
    selectedTeam,
    selectedTeamName,
    currentCompareType,
    groupingMode,
  ]);

  // Add this useEffect to load saved selections when the component mounts
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        // Only restore if we have valid data
        if (
          parsedData.profileTables &&
          Array.isArray(parsedData.profileTables)
        ) {
          setProfileTables(parsedData.profileTables);
        }

        if (parsedData.selectedTeam) {
          setSelectedTeam(parsedData.selectedTeam);
          setSelectedTeamName(parsedData.selectedTeamName || "");
          // If we're restoring a team selection, switch to profiles view
          setView("profiles");
        }

        if (parsedData.compareType) {
          setCompareType(parsedData.compareType);
        }

        if (parsedData.groupingMode) {
          setGroupingMode(parsedData.groupingMode);
          if (parsedData.groupingMode === "profiles") {
            setView("profiles");
          }
        }
      } catch (e) {
        console.error("Error restoring saved TUG Card selection:", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  function encodeProfileTablesToURL(profileTables: ProfileTable[]) {
    return profileTables
      .map((group) => {
        const profileUuids = group.profiles.join(",");
        return `${encodeURIComponent(group.name)}:${group.id}:${profileUuids}`;
      })
      .join(";");
  }

  const handleContinue = () => {
    const urlParam = encodeProfileTablesToURL(profileTables);
    router.push(
      `/deckbuilder/${currentCompareType}/?groupedProfiles=${urlParam}`
    );
  };

  const handleClearSelections = () => {
    setProfileTables([
      {
        id: nanoid(),
        profiles: [],
        name: "Default Group",
      },
    ]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleDragCancel = () => {
    setActiveDragProfile(null);
  };

  if (isLoading) {
    return (
      <div>
        <RenderLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <RenderError />
      </div>
    );
  }

  const handleCompareTypeSelect = (type: CompareType) => {
    store.setCompareType(type);
    setCompareType(type);
    setOpen(false);
  };

  const handleUpdateTableName = (tableId: string, newName: string) => {
    setProfileTables((prev) =>
      prev.map((table) =>
        table.id === tableId ? { ...table, name: newName } : table
      )
    );

    // If you're storing this in localStorage, update that as well
    const updatedTables = profileTables.map((table) =>
      table.id === tableId ? { ...table, name: newName } : table
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTables));
  };

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
          <RenderTable
            view={view}
            groupingMode={groupingMode}
            selectedTeamName={selectedTeamName}
            table={table}
            searchInputRef={searchInputRef}
            handleBackToTeams={handleBackToTeams}
            handleTeamClick={handleTeamClick}
            handleGroupingChange={handleGroupingChange}
            columns={columns}
            isLoadingProfiles={isLoadingProfiles}
            handleOneWayProfileCheck={handleOneWayProfileCheck}
            handleProfileCheck={handleProfileCheck}
          />
        </div>
        <div className="rounded-lg md:w-2/5 w-full">
          <div className="flex w-full items-center justify-end py-4 gap-2">
            {" "}
            {/* <span className="mr-auto">Groups</span> */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-fit justify-between"
                >
                  {store.getCompareTypeLabel() || "Compare Type"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0">
                <Command>
                  <CommandInput placeholder="Search compare type..." />
                  <CommandEmpty>No compare type found.</CommandEmpty>
                  <CommandGroup>
                    {store.compareTypes.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.label}
                        onSelect={() => handleCompareTypeSelect(item.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            currentCompareType === item.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {item.label}
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
                    onClick={handleClearSelections}
                  >
                    <GoTrash strokeWidth="0.6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear All</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <ProfileTablesManager
            profileTables={profileTables}
            onRemoveTable={handleRemoveTable}
            onUpdateTableProfiles={handleUpdateTableProfiles}
            onUpdateTableName={handleUpdateTableName} // Add this new prop
            onCreateTableWithProfile={handleCreateTableWithProfile}
            setSelectedTableId={setSelectedTableIdState}
            selectedTableId={selectedTableId}
            allProfiles={allProfilesData}
          />

          <div className="flex justify-end pt-4 gap-2">
            <Button
              variant="outline"
              className="self-center mr-auto"
              onClick={() => handleAddTable()}
            >
              <GoPlus size={32} />
              <span className="hidden lg:inline"> Add Group</span>
            </Button>

            <Button
              variant="outline"
              disabled={!currentCompareType || !profileTables[0].profiles[0]}
              className="hover:border-primary"
              onClick={handleContinue}
            >
              Continue <GoArrowRight size={24} />
            </Button>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeDragProfile ? (
            <DraggedProfilePreview profile={activeDragProfile} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TeamProfileSelector;
