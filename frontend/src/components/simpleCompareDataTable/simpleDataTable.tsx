"use client";

import * as React from "react";
import { SanityDocument } from "next-sanity";
import { GoInfo, GoSearch } from "react-icons/go";
import { ArrowUpDown } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumbs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { getProfilesFromUserTeams, getUserTeams, getAllTeams } from "@/lib/utils/sanityApi/profileRequests";

// Column definition types
export interface SimpleColumnDef<T> {
  key: string;
  header: (props: {
    onSort?: (key: string) => void;
    sortDirection?: 'asc' | 'desc' | null;
    isAllSelected?: boolean;
    isSomeSelected?: boolean; 
    onSelectAll?: (value: boolean) => void;
  }) => React.ReactNode;
  renderCell: (props: {
    row: T;
    isSelected?: boolean;
    onToggleSelect?: () => void;
  }) => React.ReactNode;
}

// Props for the data table component
interface SimpleDataTableProps {
  teamColumns: SimpleColumnDef<SanityDocument>[];
  profileColumns: SimpleColumnDef<SanityDocument>[];
  userProfileData: SanityDocument;
}

// Sort configuration type
interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc' | null;
}

// Selected rows type
interface SelectedRows {
  [id: string]: boolean;
}

export function SimpleDataTable({
  teamColumns,
  profileColumns,
  userProfileData,
}: SimpleDataTableProps): JSX.Element {
  // State management
  const [currentView, setCurrentView] = React.useState<"teams" | "profiles">("teams");
  const [selectedTeam, setSelectedTeam] = React.useState<SanityDocument | null>(null);
  const [teamsData, setTeamsData] = React.useState<SanityDocument[]>([]);
  const [profilesData, setProfilesData] = React.useState<SanityDocument[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  
  // Filter state
  const [filterValue, setFilterValue] = React.useState<string>("");
  
  // Sorting state
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    key: null,
    direction: null,
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const itemsPerPage: number = 10;
  
  // Row selection state
  const [selectedRows, setSelectedRows] = React.useState<SelectedRows>({});

  // Load teams data on component mount
  React.useEffect(() => {
    const loadTeams = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const teams = await fillDataTableTeamData();
        setTeamsData(teams);
      } catch (error) {
        console.error("Error loading teams:", error);
        setTeamsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeams();
  }, [userProfileData]);

  // Function to get all user teams
  const fillAllUserTeams = async () => {
    let profilesFromUserTeams = { teams: [] as SanityDocument[] };
    
    if (userProfileData?.team) {
      profilesFromUserTeams = await getUserTeams(userProfileData.email);
    }
    
    return profilesFromUserTeams;
  };

  // Function to get teams data based on user permissions
  const fillDataTableTeamData = async (): Promise<SanityDocument[]> => {
    const emptyData: SanityDocument[] = [];
    
    if (userProfileData.permission === "Admin") {
      return await getAllTeams();
    }
    
    const data = userProfileData?.team
      ? (await fillAllUserTeams()).teams
      : emptyData;
    
    return data;
  };

  // Handle team selection
  const handleTeamSelect = async (team: SanityDocument): Promise<void> => {
    try {
      setIsLoading(true);
      const profiles = await getProfilesFromUserTeams(userProfileData.email, [
        team.slug,
      ]);
      setSelectedTeam(team);
      setProfilesData(profiles.teamProfiles);
      setCurrentView("profiles");
      // Reset states
      setSortConfig({ key: null, direction: null });
      setFilterValue("");
      setCurrentPage(0);
      setSelectedRows({});
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setProfilesData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Return to teams view
  const returnToTeamsView = (): void => {
    setIsLoading(true);
    setCurrentView("teams");
    setSelectedTeam(null);
    setProfilesData([]);
    setSortConfig({ key: null, direction: null });
    setFilterValue("");
    setCurrentPage(0);
    setSelectedRows({});
    setIsLoading(false);
  };

  // Get current data based on view
  const columns = currentView === "teams" ? teamColumns : profileColumns;
  let data: SanityDocument[] = currentView === "teams" ? teamsData : profilesData;

  // Check if data is loading
  if (isLoading) {
    return (
      <div className="sm:min-w-96 w-3/5 max-w-screen-lg sm:px-6 px-2">
        <div className="flex items-center justify-center h-64">
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  // Apply filtering
  if (filterValue) {
    data = data.filter(item => {
      const name = item.name?.toLowerCase() || "";
      return name.includes(filterValue.toLowerCase());
    });
  }

  // Apply sorting
  if (sortConfig.key) {
    data = [...data].sort((a, b) => {
      if (a[sortConfig.key as keyof SanityDocument] < b[sortConfig.key as keyof SanityDocument]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key as keyof SanityDocument] > b[sortConfig.key as keyof SanityDocument]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  // Apply pagination
  const pageCount: number = Math.ceil(data.length / itemsPerPage);
  const paginatedData: SanityDocument[] = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Handle row selection
  const toggleRowSelection = (id: string, event: React.MouseEvent): void => {
    // Stop propagation to prevent row click
    event.stopPropagation();
    
    setSelectedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleAllRows = (value: boolean): void => {
    const newSelectedRows: SelectedRows = {};
    paginatedData.forEach(row => {
      newSelectedRows[row._id] = value;
    });
    setSelectedRows(newSelectedRows);
  };

  const isAllSelected: boolean = paginatedData.length > 0 && 
    paginatedData.every(row => selectedRows[row._id]);
    
  const isSomeSelected: boolean = paginatedData.some(row => selectedRows[row._id]) && 
    !isAllSelected;

  // Handle sorting
  const requestSort = (key: string): void => {
    let direction: 'asc' | 'desc' = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Selected rows count
  const selectedRowsCount: number = Object.values(selectedRows).filter(Boolean).length;

  return (
    <div className="sm:min-w-96 w-3/5 max-w-screen-lg sm:px-6 px-2">
      <div className="flex w-full items-center py-4 gap-2">
        <Breadcrumb className="justify-self-start">
          <BreadcrumbList>
            {currentView === "teams" ? (
              <BreadcrumbItem>
                <BreadcrumbLink href="#">All Teams</BreadcrumbLink>
              </BreadcrumbItem>
            ) : (
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
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="relative ml-auto">
          <GoSearch className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search names..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="pl-8 !text-base bg-light1"
          />
        </div>
      </div>
      <div className="rounded-md border bg-light1">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Select all checkbox */}
              <TableHead>
                <Checkbox
                  checked={isAllSelected}
                  data-state={isSomeSelected ? "indeterminate" : undefined}
                  onCheckedChange={(value) => toggleAllRows(!!value)}
                  aria-label="Select all"
                />
              </TableHead>
              
              {/* Name column with sorting */}
              <TableHead>
                <div className="flex items-center gap-2">
                  <h1>Name</h1>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("name")}
                    className="w-fit"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </TableHead>
              
              {/* Role column */}
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <TableRow
                  key={row._id}
                  data-state={selectedRows[row._id] ? "selected" : undefined}
                  onClick={() => {
                    if (currentView === "teams") {
                      handleTeamSelect(row);
                    }
                    // No onClick behavior for profile rows
                  }}
                  className={currentView === "teams" ? "cursor-pointer" : ""}
                >
                  {/* Checkbox cell */}
                  <TableCell>
                    <Checkbox
                      checked={selectedRows[row._id] || false}
                      onCheckedChange={() => {}}
                      aria-label="Select row"
                      onClick={(e) => toggleRowSelection(row._id, e)}
                    />
                  </TableCell>
                  
                  {/* Name cell */}
                  <TableCell>
                    <div className="flex flex-row items-center gap-4 cursor-pointer">
                      <div>
                        <p className="font-bold text-base">{row.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Role cell */}
                  <TableCell>
                    <div className="table-cell">
                      {row.jobRole ? (
                        row.jobRole.map((role: string, index: number) => (
                          <span key={index}>
                            {role}
                            {index < row.jobRole.length - 1 && ", "}
                          </span>
                        ))
                      ) : (
                        <p className="text-dark3 italic">no Role</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24">
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
                              profiles at the moment. Ask an administrator for
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
          {selectedRowsCount} of {data.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(pageCount - 1, prev + 1))}
          disabled={currentPage >= pageCount - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}