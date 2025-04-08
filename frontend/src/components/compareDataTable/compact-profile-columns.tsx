"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Checkbox } from "@/components/ui/checkbox";
import { SanityDocument } from "next-sanity";
// import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
// import { Skeleton } from "../ui/skeleton";

export const compactProfileColumns: ColumnDef<SanityDocument>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    footer: "Name" as const,
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-2">
          <h1>Name</h1>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-fit"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const profileName = row.original.name;

      return (
        <div className="flex flex-row items-center gap-4 cursor-pointer">
          <div>
            <p className="font-bold text-base">{profileName}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    footer: "Role" as const,
    header: "Role",
    cell: ({ row }) => {
      const profileJobRole = row.original.jobRole;

      return (
        <div className="table-cell ">
          {" "}
          {profileJobRole ? (
            profileJobRole.map((role: string, index: number) => (
              <span key={index}>
                {role}
                {index < profileJobRole.length - 1 && ", "}
              </span>
            ))
          ) : (
            <p className="text-dark3 italic">no Role</p>
          )}
        </div>
      );
    },
  },
];
