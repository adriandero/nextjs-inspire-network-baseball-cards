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
  optimizedImages?: boolean;
}

const KolbeStrengthsTable: React.FC<KolbeStrengthsTableProps> = ({
  profiles,
  optimizedImages = false,
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
      cell: ({ row }) => {
        const profileKolbeStrengths = row.original.kolbeStrengths;
        return (
          <div className="flex gap-2">
            <div className="w-7 h-7 text-base rounded-lg flex items-center justify-center border border-2 border-inspireRed font-bold">
              {profileKolbeStrengths.factFinder ?? "*"}
            </div>
            <div className="w-7 h-7 text-base rounded-lg flex items-center justify-center border border-2 border-inspireBlue font-bold">
              {profileKolbeStrengths.followThru ?? "*"}
            </div>
            <div className="w-7 h-7 text-base rounded-lg flex items-center justify-center border border-2 border-inspireGreen font-bold">
              {profileKolbeStrengths.quickStart ?? "*"}
            </div>
            <div className="w-7 h-7 text-base rounded-lg flex items-center justify-center border border-2 border-inspireYellow font-bold">
              {profileKolbeStrengths.implementer ?? "*"}
            </div>
          </div>
        );
      },
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
                <TableHead key={header.id}>
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
                <TableCell key={cell.id} className={`py-2`}>
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
