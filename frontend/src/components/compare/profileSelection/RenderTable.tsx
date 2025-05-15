/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { RefObject } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoSearch } from "react-icons/go";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumbs";
import {
  ColumnDef,
  flexRender,
  type Table as ReactTable,
} from "@tanstack/react-table";
import { SanityDocument } from "next-sanity";
import { useDraggable } from "@dnd-kit/core";

interface RenderTableProps {
  view: "teams" | "profiles";
  selectedTeamName: string;
  table: ReactTable<SanityDocument>;
  searchInputRef: RefObject<HTMLInputElement>;
  handleBackToTeams: () => void;
  handleTeamClick: (teamSlug: string, teamName: string) => void;
  columns: ColumnDef<SanityDocument>[];
}

const RenderRow: React.FC<any> = ({ row }) => {
  const profile = row.original;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: profile.uuid,
    data: { profile },
  });

  return (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && "selected"}
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "grab" }}
      {...attributes}
      {...listeners}
      data-draggable="true"
      className="hover:bg-primary/5 relative group"
    >
      {row.getVisibleCells().map((cell: any) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};

const RenderTable: React.FC<RenderTableProps> = ({
  view,
  selectedTeamName,
  table,
  searchInputRef,
  handleBackToTeams,
  handleTeamClick,
  columns,
}) => {
  return (
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
            ref={searchInputRef}
            placeholder="Search names..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              table.getColumn("name")?.setFilterValue(event.target.value);
              setTimeout(() => searchInputRef.current?.focus(), 0);
            }}
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
              table.getRowModel().rows.map((row) => {
                // For profiles view, wrap with draggable functionality
                if (view === "profiles") {
                  return <RenderRow key={row.id} row={row} />;
                }

                // For teams view, keep original behavior
                return (
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
                );
              })
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
      <div className="flex items-center justify-end space-x-2 py-4 w-full h-full">
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
};

export default RenderTable;
