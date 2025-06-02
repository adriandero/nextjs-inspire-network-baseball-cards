"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumbs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoInfo, GoVersions } from "react-icons/go";
import { GoMultiSelect } from "react-icons/go";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { GoSearch } from "react-icons/go";
import { SanityDocument } from "next-sanity";
import {
  getAllProfiles,
  getProfilesFromUserTeams,
} from "@/lib/utils/sanityApi/profileRequests";

interface DataTableProps<TData, TValue> {
  teamColumns: ColumnDef<TData, TValue>[];
  profileColumns: ColumnDef<TData, TValue>[];
  teamsData: TData[];
  userProfileData: SanityDocument;
}

export function DataTable<TData, TValue>({
  teamColumns,
  profileColumns,
  teamsData,
  userProfileData,
}: DataTableProps<TData, TValue>) {
  const [groupingMode, setGroupingMode] = React.useState<"teams" | "profiles">( // TODO - Enum
    "teams"
  );
  const [currentView, setCurrentView] = React.useState<"teams" | "profiles">(
    "teams"
  );
  const [selectedTeam, setSelectedTeam] = React.useState<SanityDocument | null>(
    null
  );
  const [profilesData, setProfilesData] = React.useState<SanityDocument[]>([]);
  const [allProfilesData, setAllProfilesData] = React.useState<
    SanityDocument[]
  >([]);
  const [loadingProfiles, setLoadingProfiles] = React.useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = React.useState({});

  const resetTableState = () => {
    setSorting([]);
    setColumnFilters([]);
    setColumnVisibility({});
    setRowSelection({});
  };

  const handleTeamSelect = async (team: SanityDocument) => {
    try {
      const profiles = await getProfilesFromUserTeams(userProfileData.email, [
        team.slug,
      ]);
      setSelectedTeam(team);
      setProfilesData(profiles.teamProfiles);
      setCurrentView("profiles");
      resetTableState();
    } catch (error) {
      console.error("Error fetching TUG Cards:", error);
    }
  };

  const fetchAllProfiles = async () => {
    try {
      setLoadingProfiles(true);
      const allProfiles = await getAllProfiles();
      setAllProfilesData(allProfiles);
    } catch (error) {
      console.error("Error fetching all TUG Cards:", error);
    } finally {
      setLoadingProfiles(false);
    }
  };

  const handleGroupingChange = async (mode: "teams" | "profiles") => {
    setGroupingMode(mode);
    resetTableState();

    if (mode === "profiles") {
      setCurrentView("profiles");
      setSelectedTeam(null);
      if (allProfilesData.length === 0) {
        await fetchAllProfiles();
      }
    } else {
      setCurrentView("teams");
      setSelectedTeam(null);
    }
  };

  const returnToTeamsView = () => {
    if (groupingMode === "teams") {
      setCurrentView("teams");
      setSelectedTeam(null);
      resetTableState();
    }
  };

  // Determine which data and columns to use
  const getTableConfig = () => {
    if (groupingMode === "profiles") {
      return {
        columns: profileColumns,
        data: allProfilesData,
        showSearch: true,
        allowRowClick: false,
      };
    } else if (currentView === "teams") {
      return {
        columns: teamColumns,
        data: teamsData,
        showSearch: true,
        allowRowClick: true,
      };
    } else {
      return {
        columns: profileColumns,
        data: profilesData,
        showSearch: true,
        allowRowClick: false,
      };
    }
  };

  const { columns, data, showSearch, allowRowClick } = getTableConfig();

  const table = useReactTable({
    data: data as TData[],
    columns: columns as ColumnDef<TData, TValue>[],
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

  const getBreadcrumbContent = () => {
    if (groupingMode === "profiles") {
      return (
        <BreadcrumbItem>
          <BreadcrumbLink href="#">All TUG Cards</BreadcrumbLink>
        </BreadcrumbItem>
      );
    } else if (currentView === "teams") {
      return (
        <BreadcrumbItem>
          <BreadcrumbLink href="#">All Teams</BreadcrumbLink>
        </BreadcrumbItem>
      );
    } else {
      return (
        <>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={returnToTeamsView}
              className="cursor-pointer"
            >
              All Teams
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{selectedTeam?.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </>
      );
    }
  };

  return (
    <div className="sm:min-w-96 w-full max-w-screen-lg sm:px-6 px-2 ">
      <div className="flex items-center py-4 gap-2">
        <Breadcrumb className="justify-self-start">
          <BreadcrumbList>{getBreadcrumbContent()}</BreadcrumbList>
        </Breadcrumb>

        {showSearch && (
          <div className="relative ml-auto">
            <GoSearch className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search names..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="pl-8 !text-base bg-light1"
            />
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <GoMultiSelect />
              <span className=" hidden sm:inline">View</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const columnDef = column.columnDef;
                const displayText =
                  (columnDef.footer as string) ||
                  (columnDef.header as string) ||
                  column.id;

                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {displayText}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <GoVersions />
              <span className="hidden sm:inline">Group By</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleGroupingChange("profiles")}
              className={groupingMode === "profiles" ? "bg-accent" : ""}
            >
              TUG Cards
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleGroupingChange("teams")}
              className={groupingMode === "teams" ? "bg-accent" : ""}
            >
              Teams
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-light1">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loadingProfiles ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading profiles...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={async () => {
                    if (allowRowClick) {
                      await handleTeamSelect(row.original as SanityDocument);
                    }
                  }}
                  className={allowRowClick ? "cursor-pointer" : ""}
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
                <TableCell colSpan={columns.length} className="h-24">
                  <div className="h-fit flex justify-center gap-2">
                    No results.
                    {!data.length ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <GoInfo className="flex self-center cursor-pointer" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Missing Permissions
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              You don&apos;t have permissions to view any
                              TUG Cards at the moment. Ask an administrator for
                              access.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>OK</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
