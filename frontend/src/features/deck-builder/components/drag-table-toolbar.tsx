import React, { RefObject } from "react";
import { Button } from "@/src/components/shadcn-ui/button";
import { Input } from "@/src/components/shadcn-ui/input";
import { GoSearch, GoVersions, GoMultiSelect } from "react-icons/go";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/src/components/shadcn-ui/dropdown-menu";
import { type Table as ReactTable } from "@tanstack/react-table";
import { useTableControls } from "@/src/features/deck-builder/hooks/use-drag-table-controls.hook";
import { DragTableBreadcrumbs } from "@/src/features/deck-builder/components/drag-table-breadcrumbs";

interface DragTableToolbarProps<T> {
  table: ReactTable<T>;
  searchInputRef: RefObject<HTMLInputElement>;
  groupingMode: "teams" | "profiles";
  view: "teams" | "profiles";
  selectedTeamName: string;
  onBackToTeams: () => void;
  onGroupingChange: (mode: "teams" | "profiles") => void;
}

export const DragTableToolbar = <T,>({
  table,
  searchInputRef,
  groupingMode,
  view,
  selectedTeamName,
  onBackToTeams,
  onGroupingChange,
}: DragTableToolbarProps<T>) => {
  const { searchValue, handleSearchChange } = useTableControls({
    table,
    searchInputRef,
  });

  return (
    <div className="flex w-full items-center py-4 gap-2">
      <DragTableBreadcrumbs
        groupingMode={groupingMode}
        view={view}
        selectedTeamName={selectedTeamName}
        onBackToTeams={onBackToTeams}
      />

      <div className="relative ml-auto">
        <GoSearch className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          placeholder="Search names..."
          value={searchValue}
          onChange={handleSearchChange}
          className="pl-8 !text-base bg-light1"
        />
      </div>

      {/* View Controls Dropdown with Submenu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <GoMultiSelect />
            <span className="hidden sm:inline">Display</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Group By Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <GoVersions className="mr-2 h-4 w-4" />
              <span>Group By</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {groupingMode === "profiles" ? "TUG Cards" : "Teams"}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => onGroupingChange("profiles")}
                className={groupingMode === "profiles" ? "bg-accent" : ""}
              >
                TUG Cards
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onGroupingChange("teams")}
                className={groupingMode === "teams" ? "bg-accent" : ""}
              >
                Teams
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
