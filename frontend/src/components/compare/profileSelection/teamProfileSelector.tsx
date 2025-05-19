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
import { useRouter } from "next/navigation";
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
import RenderTable from "@/components/compare/profileSelection/RenderTable"; // Import the TeamTable component
import SelectedRenderTable from "@/components/compare/profileSelection/SelectedRenderTable"; // Import the new component
import DraggedProfilePreview from "@/components/compare/profileSelection/DraggableProfilePreview"; // Import the drag overlay component
import { CompareType } from "@/components/lineupBuilder/lineupBuilderStore";

interface TeamProfileSelectorProps {
  userProfileData: SanityDocument;
}

const TeamProfileSelector = ({ userProfileData }: TeamProfileSelectorProps) => {
  type ViewType = "teams" | "profiles";

  const [compareType, setCompareType] = useState<CompareType | null>(null);

  const [view, setView] = useState<ViewType>("teams");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedTeamName, setSelectedTeamName] = useState<string>("");
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [teams, setTeams] = useState<SanityDocument[]>([]);
  const [profilesByTeam, setProfilesByTeam] = useState<ProfilesByTeam>({
    teams: {},
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDragProfile, setActiveDragProfile] =
    useState<SanityDocument | null>(null);
  const router = useRouter();

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
    setSelectedProfiles((prev) => {
      if (prev.includes(profileId)) {
        return prev.filter((id) => id !== profileId);
      } else {
        return [...prev, profileId];
      }
    });
  };

  const getSelectedProfilesData = () => {
    if (!profilesByTeam?.teams) return [];

    const allProfiles: SanityDocument[] = [];
    Object.values(profilesByTeam.teams).forEach((profiles) => {
      allProfiles.push(...profiles);
    });

    return allProfiles.filter((profile) =>
      selectedProfiles.includes(profile.uuid)
    );
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
            table
              .getFilteredRowModel()
              .rows.every((row) => selectedProfiles.includes(row.original.uuid))
          }
          onCheckedChange={(value) => {
            const allProfileIds = table
              .getFilteredRowModel()
              .rows.map((row) => row.original.uuid);

            if (value) {
              // Add all filtered profiles that aren't already selected
              setSelectedProfiles((prev) => {
                const newSelection = [...prev];
                allProfileIds.forEach((id) => {
                  if (!newSelection.includes(id)) {
                    newSelection.push(id);
                  }
                });
                return newSelection;
              });
            } else {
              // Remove all filtered profiles
              setSelectedProfiles((prev) =>
                prev.filter((id) => !allProfileIds.includes(id))
              );
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedProfiles.includes(row.original.uuid)}
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
    pageSize: 9, // Set to 9 rows per page instead of default 10
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
              acc[index] = selectedProfiles.includes(profile.uuid);
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

  // Handler functions for the SelectedProfilesTable component
  const handleCompareTypeSelect = (type: CompareType) => {
    setCompareType(type);
  };

  const handleContinue = () => {
    const selectedProfilesData = getSelectedProfilesData();
    if (selectedProfilesData.length > 0 && compareType) {
      const profileIds = selectedProfilesData
        .map((profile) => profile.uuid)
        .join(",");
      router.push(`/compare/${compareType}/?profiles=${profileIds}`);
    }
  };

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

    // If dropped on the droppable target
    if (
      over &&
      over.id === "selected-profiles-droppable" &&
      active.data.current
    ) {
      const profileId = active.id as string;

      // Only add if not already selected
      if (!selectedProfiles.includes(profileId)) {
        setSelectedProfiles((prev) => [...prev, profileId]);
      }
    }
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
          <SelectedRenderTable
            selectedProfilesData={getSelectedProfilesData()}
            compareType={compareType}
            onCompareTypeSelect={handleCompareTypeSelect}
            onContinue={handleContinue}
          />
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
