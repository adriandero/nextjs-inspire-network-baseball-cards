import { ColumnDef } from "@tanstack/react-table";
import { SanityDocument } from "next-sanity";
import { Button } from "@/src/components/shadcn-ui/button";
import { ArrowUpDown } from "lucide-react";

export const teamColumns: ColumnDef<SanityDocument>[] = [
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
