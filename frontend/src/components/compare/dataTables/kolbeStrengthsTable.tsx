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
import { Progress } from "@/components/ui/Progress";

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
          <div className="flex ">
            <div className="w-6 h-6 text-base flex items-center justify-center font-bold">
              {profileKolbeStrengths.factFinder ?? "*"}
            </div>
            <div className="w-6 h-6 text-base flex items-center justify-center font-bold">
              {profileKolbeStrengths.followThru ?? "*"}
            </div>
            <div className="w-6 h-6 text-base flex items-center justify-center font-bold">
              {profileKolbeStrengths.quickStart ?? "*"}
            </div>
            <div className="w-6 h-6 text-base flex items-center justify-center font-bold">
              {profileKolbeStrengths.implementer ?? "*"}
            </div>

            <div className="w-6 h-6 items-center justify-between flex flex-col transform -rotate-90 ml-2">
              <Progress
                value={
                  profileKolbeStrengths.factFinder
                    ? profileKolbeStrengths.factFinder * 10
                    : 0
                }
                color="bg-inspireRed"
                className="h-1 rounded-[1px]"
              />
              <Progress
                value={
                  profileKolbeStrengths.followThru
                    ? profileKolbeStrengths.followThru * 10
                    : 0
                }
                color="bg-inspireBlue"
                className="h-1 rounded-[1px]"
              />{" "}
              <Progress
                value={
                  profileKolbeStrengths.quickStart
                    ? profileKolbeStrengths.quickStart * 10
                    : 0
                }
                color="bg-inspireGreen"
                className="h-1 rounded-[1px]"
              />{" "}
              <Progress
                value={
                  profileKolbeStrengths.implementer
                    ? profileKolbeStrengths.implementer * 10
                    : 0
                }
                color="bg-inspireYellow"
                className="h-1 rounded-[1px]"
              />
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
