"use client";
import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { GoArrowRight, GoSearch } from "react-icons/go";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumbs";
import { useRouter } from "next/navigation";

interface TeamProfileSelectorProps {
  userProfileData: SanityDocument;
}

const TeamProfileSelector = ({ userProfileData }: TeamProfileSelectorProps) => {
  type ViewType = "teams" | "profiles";

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
  const [nameFilter, setNameFilter] = useState<string>("");
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
  }, []);

  async function fillAllUserTeams() {
    let profilesFromUserTeams: TeamsFromUser = { teams: [] };
    if (userProfileData?.team) {
      profilesFromUserTeams = await getUserTeams(userProfileData.email);
    }
    return profilesFromUserTeams;
  }

  async function fillDataTableTeamData(): Promise<SanityDocument[]> {
    const emptyData: SanityDocument[] = [];
    if (userProfileData.permission === "Admin") {
      return await getAllTeams();
    }
    const data = userProfileData?.team
      ? (await fillAllUserTeams()).teams
      : emptyData;
    return data;
  }

  const handleTeamClick = (teamSlug: string, teamName: string): void => {
    setSelectedTeam(teamSlug);
    setSelectedTeamName(teamName);
    setView("profiles");
    setNameFilter("");
  };

  const handleBackToTeams = (): void => {
    setView("teams");
    setSelectedTeam(null);
    setNameFilter("");
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
            {profile.profileImage?.asset?.url && (
              <div className="flex-shrink-0">
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={profile.profileImage.asset.url}
                    alt={profile.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            )}
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

  // Filter data based on name filter
  const getFilteredData = () => {
    if (view === "teams") {
      return nameFilter
        ? teams.filter((team) =>
            team.name.toLowerCase().includes(nameFilter.toLowerCase())
          )
        : teams;
    } else {
      if (!selectedTeam || !profilesByTeam?.teams) return [];
      const profiles = profilesByTeam.teams[selectedTeam] || [];
      return nameFilter
        ? profiles.filter((profile) =>
            profile.name.toLowerCase().includes(nameFilter.toLowerCase())
          )
        : profiles;
    }
  };

  // Create table instance
  const data = getFilteredData();
  const columns = view === "teams" ? teamColumns : profileColumns;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    state: {
      rowSelection:
        view === "profiles"
          ? data.reduce((acc, profile, index) => {
              acc[index] = selectedProfiles.includes(profile.uuid);
              return acc;
            }, {} as RowSelectionState)
          : {},
    },
  });

  const renderLoading = (): JSX.Element => (
    <div className="flex justify-center items-center h-48">
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  const renderError = (): JSX.Element => (
    <div className="flex justify-center items-center h-48">
      <p className="text-red-500">{error}</p>
    </div>
  );

  const renderTable = (): JSX.Element => (
    <div className="w-full">
      <div className="flex w-full items-center py-4 gap-2">
        <Breadcrumb className="justify-self-start">
          <BreadcrumbList>
            {view === "teams" ? (
              <BreadcrumbItem>
                <BreadcrumbLink href="#">All Teams</BreadcrumbLink>
              </BreadcrumbItem>
            ) : (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={handleBackToTeams}
                    className="cursor-pointer"
                  >
                    All Teams
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>{selectedTeamName}</BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="relative ml-auto">
          <GoSearch className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Search ${view === "teams" ? "teams" : "profiles"}...`}
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="pl-8 !text-base bg-light1"
          />
        </div>
      </div>

      <div className="rounded-md border bg-light1">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    if (view === "teams") {
                      const team = row.original as SanityDocument;
                      handleTeamClick(team.slug || team._id, team.name);
                    }
                  }}
                  className={view === "teams" ? "cursor-pointer" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
  const router = useRouter();

  const renderSelectedProfiles = (): JSX.Element => {
    const selectedProfilesData = getSelectedProfilesData();

    const handleContinue = () => {
      if (selectedProfilesData.length > 0) {
        // Create a URL-safe string of profile IDs
        const profileIds = selectedProfilesData
          .map((profile) => profile.uuid)
          .join(",");

        // Navigate to the workingGenius comparison page with selected profiles
        router.push(`/compare/workingGenius/?profiles=${profileIds}`);
      }
    };

    return (
      <div>
        <div className="flex w-full items-center py-5 gap-2">
          <User className="mr-2" size={20} />
          <h2 className="text-lg ml-auto">
            Selected Profiles - {selectedProfilesData.length}
          </h2>
        </div>
        {selectedProfilesData.length === 0 ? (
          <div className="rounded-md flex justify-center border bg-light1 border rounded-md p-4">
            <p className="text-gray-500 italic">No profiles selected</p>
          </div>
        ) : (
          <div className="rounded-md border bg-light1 border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedProfilesData.map((profile) => (
                  <TableRow key={profile.uuid}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {profile.profileImage?.asset?.url && (
                          <div className="flex-shrink-0">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                              <Image
                                src={profile.profileImage.asset.url}
                                alt={profile.name}
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                          </div>
                        )}
                        <div className="font-medium">{profile.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {profile.jobRole && profile.jobRole.length > 0 && (
                        <div className="text-sm text-gray-500">
                          {profile.jobRole.join(", ")}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="mt-2 hover:border-primary"
            onClick={() => handleContinue()}
          >
            Continue <GoArrowRight size={24} />
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return renderLoading();
  }

  if (error) {
    return renderError();
  }

  return (
    <div className="w-full flex gap-4 px-6">
      <div className=" rounded-lg w-3/5">{renderTable()}</div>
      <div className="rounded-lg w-2/5">{renderSelectedProfiles()}</div>
    </div>
  );
};

export default TeamProfileSelector;
