"use client";
import { ColumnDef } from "@tanstack/react-table";

import { SanityDocument } from "next-sanity";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/src/components/shadcn-ui/button";

export const teamColumns: ColumnDef<SanityDocument>[] = [
  {
    accessorKey: "name",
    footer: "Name" as const,
    sortingFn: "alphanumeric", // optional but improves string sorting
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
  // Hidden column for groups filtering
  {
    accessorKey: "groups",
    header: "Groups",
    enableHiding: false, // Prevents this column from appearing in the column visibility dropdown
    meta: {
      hidden: true, // Custom meta property to identify hidden columns
    },
    cell: ({ row }) => {
      // This cell won't be rendered since the column is hidden
      return row.original.groups;
    },
  },
  // {
  //   id: "actions",
  //   footer: "Action" as const,
  //   cell: ({}) => {
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild className="ml-auto">
  //           <Button variant="ghost" className="h-8 w-8 p-0 flex">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View Team</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
