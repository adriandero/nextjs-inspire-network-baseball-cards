"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { SanityDocument } from "next-sanity";

export const teamColumns: ColumnDef<SanityDocument>[] = [
  {
    accessorKey: "name",
    footer: "Name" as const,
    header: "Name",
    cell: ({ row }) => {
      const teamName = row.original.name;
      return (
        <div className="flex flex-row items-center cursor-pointer ">
          <p className="font-bold text-base">{teamName}</p>
        </div>
      );
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
