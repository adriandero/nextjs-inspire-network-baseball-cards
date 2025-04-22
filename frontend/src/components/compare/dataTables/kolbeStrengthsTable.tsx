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

interface KolbeStrengthsTableProps {
  profiles: SanityDocument[];
  lowQuality?: boolean;
}

const KolbeStrengthsTable: React.FC<KolbeStrengthsTableProps> = ({
  profiles,
  lowQuality = false,
}) => {
  // Define columns for the table
  const columns: ColumnDef<SanityDocument>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const profile = row.original;
        return (
          <div className="flex items-center gap-3">
            {
              <div className="flex-shrink-0">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={
                      profile.profileImage
                        ? lowQuality
                          ? urlFor(profile.profileImage.asset.url)
                              .auto("format")
                              .quality(90)
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
            }
            <div>
              <div className="font-bold text-base">{profile.name}</div>
              <div className="text-base">
                {profile.jobRole?.map((role: string, index: number) => (
                  <span key={index}>
                    {role}
                    {index < profile.jobRole.length - 1 && ", "}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "kolbe",
      header: "Kolbe Strengths",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <div className="w-7 h-7 text-base rounded-lg flex items-center justify-center border border-2 border-inspireRed font-bold">
            {row.original.kolbeStrengths.factFinder ?? "*"}
          </div>
          <div className="w-7 h-7 text-base rounded-lg flex items-center justify-center border border-2 border-inspireBlue font-bold">
            {row.original.kolbeStrengths.followThru ?? "*"}
          </div>
          <div className="w-7 h-7 text-base rounded-lg flex items-center justify-center border border-2 border-inspireGreen font-bold">
            {row.original.kolbeStrengths.quickStart ?? "*"}
          </div>
          <div className="w-7 h-7 text-base rounded-lg flex items-center justify-center border border-2 border-inspireYellow font-bold">
            {row.original.kolbeStrengths.implementer ?? "*"}
          </div>
        </div>
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
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={
                    header.id.includes("kolbe")
                      ? "w-1/3 text-right"
                      : "w-2/3 text-left"
                  }
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="px-4">
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={`py-2 ${cell.id.includes("kolbe") ? "text-right" : "text-left"}`}
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

export default KolbeStrengthsTable;
