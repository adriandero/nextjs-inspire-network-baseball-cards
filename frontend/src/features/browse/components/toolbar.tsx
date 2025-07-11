import { Table } from "@tanstack/react-table";
import { Button } from "@/src/components/shadcn-ui/button";
import { Input } from "@/src/components/shadcn-ui/input";
import { GoSearch, GoFilter, GoMultiSelect, GoVersions } from "react-icons/go";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
} from "@/src/components/shadcn-ui/dropdown-menu";
import { GROUPS_OPTIONS } from "../constants/dataTable";

interface ToolbarProps<TData> {
  table: Table<TData>;
  showSearch: boolean;
  showGroupsFilter: boolean;
  groupingMode: "teams" | "profiles";
  onGroupingChange: (mode: "teams" | "profiles") => void;
}

export function Toolbar<TData>({
  table,
  showSearch,
  showGroupsFilter,
  groupingMode,
  onGroupingChange,
}: ToolbarProps<TData>) {
  const currentGroupsFilter =
    (table.getColumn("groups")?.getFilterValue() as string) ?? "";

  const handleGroupsFilterChange = (value: string) => {
    table.getColumn("groups")?.setFilterValue(value === "all" ? "" : value);
  };

  const getGroupsFilterLabel = () => {
    if (!currentGroupsFilter) return "All Groups";
    const option = GROUPS_OPTIONS.find(
      (opt) => opt.value === currentGroupsFilter,
    );
    return option?.label || "All Groups";
  };

  return (
    <div className="flex items-center py-4 gap-2">
      {showSearch && (
        <div className="relative ml-auto">
          <GoSearch className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search names..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-8 !text-base bg-light1"
          />
        </div>
      )}

      {/* Combined Groups & View Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <GoMultiSelect />
            <span className="hidden sm:inline">Display</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Groups Submenu */}
          {showGroupsFilter && (
            <>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <GoFilter className="mr-2 h-4 w-4" />
                  <span>Filter</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {getGroupsFilterLabel()}
                  </span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => handleGroupsFilterChange("all")}
                    className={!currentGroupsFilter ? "bg-accent" : ""}
                  >
                    All Groups
                  </DropdownMenuItem>
                  {GROUPS_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleGroupsFilterChange(option.value)}
                      className={
                        currentGroupsFilter === option.value ? "bg-accent" : ""
                      }
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </>
          )}
          <DropdownMenuSeparator />

          {/* View/Group By Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <GoVersions className="mr-2 h-4 w-4" />
              <span>View</span>
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
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <GoMultiSelect />
              <span className="hidden sm:inline">Columns</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
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
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
