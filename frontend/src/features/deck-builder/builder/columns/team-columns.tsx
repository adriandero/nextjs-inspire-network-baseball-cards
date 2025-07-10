import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/src/components/shadcn-ui/button";
import { ArrowUpDown } from "lucide-react";
import { ProfileWithDetailedTeams } from "@/src/lib/entities/profile";

export const teamColumns: ColumnDef<ProfileWithDetailedTeams>[] = [
  {
    accessorKey: "name",
    sortingFn: "alphanumeric",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Team Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-bold text-base">{row.getValue("name")}</div>
    ),
  },
];
