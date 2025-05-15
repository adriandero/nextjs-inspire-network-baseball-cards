"use client";

import React from "react";
import Image from "next/image";
import { SanityDocument } from "next-sanity";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { urlFor } from "@/lib/sanity/client";

interface ValuesTableProps {
  profiles: SanityDocument[];
  showJobRole: boolean;
  optimizedImages?: boolean;
}

const ValuesTable: React.FC<ValuesTableProps> = ({
  profiles,
  showJobRole,
  optimizedImages = false,
}) => {
  console.log(profiles);
  // Define columns for the table
  const columns: ColumnDef<SanityDocument>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const profile = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={
                    profile.profileImage
                      ? optimizedImages
                        ? urlFor(profile.profileImage.asset.url)
                            .width(80)
                            .height(80)
                            .auto("format")
                            .quality(40)
                            .url()
                        : profile.profileImage.asset.url
                      : "/defaultAvatar.png"
                  }
                  alt={profile.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            <div>
              <div className="font-bold text-base">{profile.name}</div>
              {profile.jobRole && (
                <div className="text-base">
                  {showJobRole
                    ? profile.jobRole?.map((role: string, index: number) => (
                        <span key={index}>
                          {role}
                          {index < profile.jobRole.length - 1 && ", "}
                        </span>
                      ))
                    : null}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "value1",
      header: "Value 1",
      cell: ({ row }) => (
        <div className="text-center">{row.original.values[0]}</div>
      ),
    },
    {
      accessorKey: "value2",
      header: "Value 2",
      cell: ({ row }) => (
        <div className="text-center">{row.original.values[1]}</div>
      ),
    },
    {
      accessorKey: "value3",
      header: "Value 3",
      cell: ({ row }) => (
        <div className="text-center">{row.original.values[2]}</div>
      ),
    },
    {
      accessorKey: "value4",
      header: "Value 4",
      cell: ({ row }) => (
        <div className="text-center">{row.original.values[3]}</div>
      ),
    },
    {
      accessorKey: "value5",
      header: "Value 5",
      cell: ({ row }) => (
        <div className="text-center">{row.original.values[4]}</div>
      ),
    },
  ];

  // Create table instance
  const table = useReactTable({
    data: profiles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (profiles.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No profiles to display</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-light1 w-full">
      <Table className="table-fixed w-full border-collapse">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={`${header.id !== "name" ? "w-1/6 text-center" : "w-1/3"}`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell, index) => (
                <TableCell
                  key={cell.id}
                  className={`py-2 ${cell.column.id !== "name" ? "w-1/6 " : "w-1/3"}  ${index > 0 ? "border-l border-light2" : ""}
`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ValuesTable;
