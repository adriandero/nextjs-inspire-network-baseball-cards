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

export const profileColumns: ColumnDef<SanityDocument>[] = [
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
      const profileName = row.original.name;
      const profileUuid = row.original.uuid;
      const profileJobRole = row.original.jobRole;
      // const profileImageSrc =
      // row.row.original.profileImage?.asset.url ?? "/defaultAvatar.png";
      //const isAvatarLoaded = useImageLoadState(profileImageSrc);

      return (
        <div
          className="flex flex-row items-center gap-4 cursor-pointer"
          onClick={() => {
            return redirect(`/profiles/${profileUuid}`);
          }}
        >
          {/* {<Avatar className="block min-w-[40px]">
            <AvatarImage
              src={profileImageSrc}
              width={40}
              className="rounded-full min-w-[40px]!"
            />
            {!isAvatarLoaded ? (
              <Skeleton
                className={`min-h-[40px] min-w-[40px] rounded-full bg-light3`}
              />
            ) : null}
            <AvatarFallback></AvatarFallback>
          </Avatar>} */}
          <div>
            <p className="font-bold text-base">{profileName}</p>
            <div className="table-cell ">{profileJobRole}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "jobRole",
    footer: "Team" as const,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Team
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const profileTeams = row.original.teams;

      return (
        <div className="table-cell ">
          {profileTeams !== null ? (
            profileTeams.map((team: SanityDocument, index: number) => (
              <div key={index}>
                {team.name}
                {index < profileTeams.length - 1 && ", "}
              </div>
            ))
          ) : (
            <p className="text-dark3 italic">no team</p>
          )}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "team.company.name",
  //   footer: "Company" as const,
  //   header: () => <div className="text-right">Company</div>,
  //   cell: ({ row }) => {
  //     // console.log(row.original);
  //     const companyName = row.original.team?.company?.name || "Unknown Company";

  //     return <div className="text-right">{companyName}</div>;
  //   },
  // },
  {
    id: "actions",
    footer: "Action" as const,
    cell: ({ row }) => {
      const profileUuid = row.original.uuid;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 flex justify-self-end"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                return redirect(`/profiles/${profileUuid}`);
              }}
            >
              View Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
