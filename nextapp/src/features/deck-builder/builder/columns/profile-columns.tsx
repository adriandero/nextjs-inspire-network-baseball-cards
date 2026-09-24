import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/src/components/shadcn-ui/button";
import { Checkbox } from "@/src/components/shadcn-ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import defaultAvatar from "@/public/images/default-avatar.png";
import { ProfileIdentifierTable } from "@/src/features/deck-builder/entities/profile-identifier-table.model";
import { ProfileWithDetailedTeams } from "@/src/shared/entities/profile.types";

export const createProfileColumns = (
  profileTables: ProfileIdentifierTable[],
  selectedTableId: string,
  handleProfileCheck: (profileId: string, tableId: string) => void,
  onBulkSelect: (allProfileIds: string[], isSelected: boolean) => void,
): ColumnDef<ProfileWithDetailedTeams>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getFilteredRowModel().rows.length > 0 &&
          table.getFilteredRowModel().rows.every((row) => {
            const profileId = row.original.uuid;
            return profileTables.some((table) =>
              table.profiles.includes(profileId),
            );
          })
        }
        onCheckedChange={(value) => {
          const allProfileIds = table
            .getFilteredRowModel()
            .rows.map((row) => row.original.uuid);

          onBulkSelect(allProfileIds, !!value);
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={profileTables.some((table) =>
          table.profiles.includes(row.original.uuid),
        )}
        onCheckedChange={() =>
          handleProfileCheck(row.original.uuid, selectedTableId)
        }
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
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
      const profile = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={profile.avatar?.asset?.url ?? defaultAvatar.src}
                alt={profile.name}
                fill
                sizes="32px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="font-medium text-base">{profile.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "jobRole",
    header: "Role",
    cell: ({ row }) => {
      const jobRoles = row.original.jobRole;
      return jobRoles && jobRoles.length > 0 ? (
        <div className="text-sm text-gray-500">{jobRoles.join(", ")}</div>
      ) : null;
    },
  },
];
