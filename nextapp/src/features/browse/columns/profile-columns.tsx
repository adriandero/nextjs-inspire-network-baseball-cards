"use client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import defaultAvatar from "@/public/images/default-avatar.png";

import { Button } from "@/src/components/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/shadcn-ui/dropdown-menu";

import { ProfileWithDetailedTeams } from "@/src/shared/entities/profile.types";
import { TeamWithPopulatedCompany } from "@/src/shared/entities/team.types";

const ProfileNameCell = ({ row }: { row: Row<ProfileWithDetailedTeams> }) => {
  const router = useRouter();
  const profileName = row.original.name;
  const profileUuid = row.original.uuid;
  const profileJobRole = row.original.jobRole;
  const profileImageSrc =
    row.original.avatar?.asset.url ??
    row.original.profileImage?.asset.url ??
    defaultAvatar.src;

  const handleClick = () => {
    router.push(`/tugcards/${profileUuid}`);
  };

  return (
    <div
      className="flex flex-row items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={handleClick}
    >
      <div className="relative min-w-10 min-h-10 rounded-full overflow-hidden">
        <Image
          src={profileImageSrc}
          alt={profileName}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div>
        <p className="font-bold text-base">{profileName}</p>
        <div className="text-sm text-gray-600">
          {profileJobRole?.map((role: string, index: number) => (
            <span key={index}>
              {role}
              {index < profileJobRole.length - 1 && ", "}
            </span>
          )) || null}
        </div>
      </div>
    </div>
  );
};

const ProfileActionsCell = ({
  row,
}: {
  row: Row<ProfileWithDetailedTeams>;
}) => {
  const router = useRouter();
  const profileUuid = row.original.uuid;

  const handleViewProfile = () => {
    router.push(`/tugcards/${profileUuid}`);
  };

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
        <DropdownMenuItem onClick={handleViewProfile}>
          View Profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const profileColumns: ColumnDef<ProfileWithDetailedTeams>[] = [
  {
    accessorKey: "name",
    footer: "Name" as const,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: "alphanumeric",
    cell: ProfileNameCell,
  },
  {
    accessorKey: "team",
    header: "Team",
    cell: ({ row }) => {
      const profileTeams = row.original.teams;

      return (
        <div>
          {profileTeams?.length ? (
            profileTeams.map(
              (team: TeamWithPopulatedCompany, index: number) => (
                <span key={team._id || index}>
                  {team.name}
                  {index < profileTeams.length - 1 && ", "}
                </span>
              )
            )
          ) : (
            <p className="text-gray-500 italic">no team</p>
          )}
        </div>
      );
    },
  },
  {
    id: "groups",
    header: "Groups",
    enableHiding: false,
    meta: {
      hidden: true,
    },
    accessorFn: (row) => {
      const teams = row.teams || [];
      const groups = teams
        .map((team: TeamWithPopulatedCompany) => team.groups)
        .filter((group): group is NonNullable<typeof group> => Boolean(group))
        .filter((group, index, arr) => arr.indexOf(group) === index);

      return groups.join(",");
    },
    cell: ({ row }) => {
      const teams = row.original.teams || [];
      const groups = teams
        .map((team: TeamWithPopulatedCompany) => team.groups)
        .filter((group): group is NonNullable<typeof group> => Boolean(group));
      return groups.join(", ");
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;

      const teams = row.original.teams || [];
      const profileGroups = teams
        .map((team: TeamWithPopulatedCompany) => team.groups)
        .filter((group): group is NonNullable<typeof group> => Boolean(group));

      return profileGroups.includes(filterValue);
    },
  },
  {
    id: "actions",
    footer: "Action" as const,
    cell: ProfileActionsCell,
  },
];
