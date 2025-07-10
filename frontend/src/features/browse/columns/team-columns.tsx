"use client";
import { ColumnDef } from "@tanstack/react-table";

import { SanityDocument } from "next-sanity";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/src/components/shadcn-ui/button";

export const teamColumns: ColumnDef<SanityDocument>[] = [
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
        <div className="flex flex-row items-center cursor-pointer ">
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
