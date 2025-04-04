"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
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

export const teamColumns: ColumnDef<SanityDocument>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    header: "Name",
    cell: ({ row }) => {
      const teamName = row.original.name;
      const teamSlug = row.original.slug;

      // const profileImageSrc =
      // row.row.original.profileImage?.asset.url ?? "/defaultAvatar.png";
      //const isAvatarLoaded = useImageLoadState(profileImageSrc);

      return (
        <div
          className="flex flex-row items-center cursor-pointer "
          // onClick={() => {
          //   return redirect(`/teams/${teamSlug}`);
          // }}
        >
          <p className="font-bold text-base">{teamName}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    footer: "Action" as const,
    cell: ({ row }) => {
      const teamSlug = row.original.slug;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="ml-auto">
            <Button variant="ghost" className="h-8 w-8 p-0 flex">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
            // onClick={() => {
            //   return redirect(`/teams/${teamSlug}`);
            // }}
            >
              View Team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
