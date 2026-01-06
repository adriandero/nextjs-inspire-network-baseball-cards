"use client";
import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/src/components/shadcn-ui/button";
import { TeamWithPopulatedCompany } from "@/src/shared/entities/team.types";

export const teamColumns: ColumnDef<TeamWithPopulatedCompany>[] = [
  {
    accessorKey: "name",
    footer: "Name" as const,
    sortingFn: "alphanumeric",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const teamName = row.original.name;
      return (
        <div className="flex flex-row items-center  ">
          <p className="font-bold text-base">{teamName}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "groups",
    header: "Groups",
    enableHiding: false,
    meta: {
      hidden: true,
    },
    cell: ({ row }) => {
      return row.original.groups;
    },
  },
];
