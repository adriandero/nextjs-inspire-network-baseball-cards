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
} from "@/lib/utils/sanityApi/profileRequests";
import { SanityDocument } from "next-sanity";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
  getPaginationRowModel,
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
} from "@/components/lineupBuilder/profileSelection/ProfileTableManager";
import DraggedProfilePreview from "@/components/compare/profileSelection/DraggableProfilePreview";
import { Button } from "@/components/ui/button";
import { GoArrowRight, GoPlus } from "react-icons/go";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CompareType } from "@/components/compare/profileSelection/SelectedRenderTable";
import { useRouter } from "next/navigation";

interface TeamProfileSelectorProps {
  userProfileData: SanityDocument;
}

const TeamProfileSelector = ({ userProfileData }: TeamProfileSelectorProps) => {
  type ViewType = "teams" | "profiles";

  const [view, setView] = useState<ViewType>("teams");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedTeamName, setSelectedTeamName] = useState<string>("");
  const router = useRouter();

  // Profile tables for grouping
  const [profileTables, setProfileTables] = useState<ProfileTable[]>([
    {
      id: nanoid(),
      profiles: [],
      name: "Default Group",
    },
  ]);

  const [teams, setTeams] = useState<SanityDocument[]>([]);
  const [profilesByTeam, setProfilesByTeam] = useState<ProfilesByTeam>({
    teams: {},
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDragProfile, setActiveDragProfile] =
    useState<SanityDocument | null>(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
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

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        // Load teams
        const teamsData = await fillDataTableTeamData();
        setTeams(teamsData);

        // Load profiles grouped by team
        const profilesData = await getAllProfilesGroupedByTeam();
        setProfilesByTeam(profilesData);

        setIsLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setIsLoading(false);
        console.error("Error loading data:", err);
      }
    }

    loadData();
  }, [fillDataTableTeamData]);

  const handleTeamClick = (teamSlug: string, teamName: string): void => {
    setSelectedTeam(teamSlug);
    setSelectedTeamName(teamName);
    setView("profiles");
  };

  const handleBackToTeams = (): void => {
    setView("teams");
    setSelectedTeam(null);
  };

  const handleProfileCheck = (profileId: string): void => {
    // Add/remove profile from the first table (for backward compatibility)
    setProfileTables((prev) => {
      const updatedTables = [...prev];
      if (updatedTables.length > 0) {
        const firstTable = updatedTables[0];
        if (firstTable.profiles.includes(profileId)) {
          firstTable.profiles = firstTable.profiles.filter(
            (id: any) => id !== profileId
          );
        } else {
          firstTable.profiles = [...firstTable.profiles, profileId];
        }
      }
      return updatedTables;
    });
  };

  const getAllProfiles = (): SanityDocument[] => {
    if (!profilesByTeam?.teams) return [];

    const allProfiles: SanityDocument[] = [];
    Object.values(profilesByTeam.teams).forEach((profiles) => {
      allProfiles.push(...profiles);
    });

    return allProfiles;
  };

  // Table management functions
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

  const data =
    view === "teams"
      ? teams
      : selectedTeam && profilesByTeam?.teams
        ? profilesByTeam.teams[selectedTeam] || []
        : [];

  const columns = view === "teams" ? teamColumns : profileColumns;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 9,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: true,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection:
        view === "profiles"
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
  const [compareType, setCompareType] = useState<CompareType | null>(null);

  const handleCompareTypeSelect = (type: CompareType) => {
    setCompareType(type);
  };

  const getCompareTypeDisplayName = (): string | null => {
    if (compareType === CompareType.WORKING_GENIUS) return "Working Genius";
    if (compareType === CompareType.KOLBE_STRENGTHS) return "Kolbe Strengths";
    return null;
  };

  function encodeProfileTablesToURL(profileTables: ProfileTable[]) {
    return profileTables
      .map((group) => {
        const profileUuids = group.profiles.join(",");
        return `${encodeURIComponent(group.name)}:${group.id}:${profileUuids}`;
      })
      .join(";");
  }

  const handleContinue = () => {
    // const urlParam = encodeProfileTablesToURL(profileTables);
    // router.push(`/lineupbuilder/${compareType}/?profiles=${urlParam}`);
    console.log("Soon to be implemented");
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
            selectedTeamName={selectedTeamName}
            table={table}
            searchInputRef={searchInputRef}
            handleBackToTeams={handleBackToTeams}
            handleTeamClick={handleTeamClick}
            columns={columns}
          />
        </div>
        <div className="rounded-lg md:w-2/5 w-full">
          <div className="flex w-full items-center h-[68px]"> Groups</div>

          <ProfileTablesManager
            profileTables={profileTables}
            onRemoveTable={handleRemoveTable}
            onUpdateTableProfiles={handleUpdateTableProfiles}
            onCreateTableWithProfile={handleCreateTableWithProfile}
            allProfiles={getAllProfiles()}
          />

          <div className="flex justify-end pt-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="self-center mr-auto"
              onClick={() => handleAddTable()}
            >
              <GoPlus size={32} />
              Add Group
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <span>{getCompareTypeDisplayName() ?? "Compare Type"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-fit">
                <DropdownMenuItem
                  className="text-sm"
                  onClick={() =>
                    handleCompareTypeSelect(CompareType.WORKING_GENIUS)
                  }
                >
                  Working Genius
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-sm"
                  onClick={() =>
                    handleCompareTypeSelect(CompareType.KOLBE_STRENGTHS)
                  }
                >
                  Kolbe Strengths
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              // disabled={getSelectedProfilesData().length === 0 || !compareType}
              className="hover:border-primary"
              size="sm"
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
