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
} from "@/src/components/shadcn-ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { urlFor } from "@/src/lib/sanity/client";
import { Progress } from "@/src/components/shadcn-ui/progress";
import defaultAvatar from "@/public/images/default-avatar.png";
import { Profile } from "@/src/shared/entities/profile.types";
import { getKolbeNumericValue, getKolbeDisplayValue } from "@/src/lib/utils";

export interface KolbeStrengthsTableProps {
  profiles: Profile[];
  optimizedImages?: boolean;
  tableName?: string;
  showJobRole?: boolean;
}

const KolbeStrengthsTable: React.FC<KolbeStrengthsTableProps> = ({
  profiles,
  optimizedImages = false,
  tableName,
  showJobRole,
}) => {
  console.log(
    "Rendering KolbeStrengthsTable with profiles:",
    JSON.stringify(profiles),
  );
  const columns: ColumnDef<SanityDocument>[] = [
    {
      accessorKey: "name",
      header: "Name",
      size: 300,
      cell: ({ row }) => {
        const profile = row.original;
        return (
          <div className="flex items-center gap-3">
            {
              <div className="flex-shrink-0">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={
                      profile.avatar
                        ? optimizedImages
                          ? urlFor(profile.avatar.asset.url)
                              .width(80)
                              .height(80)
                              .auto("format")
                              .quality(80)
                              .url()
                          : profile.avatar.asset.url
                        : defaultAvatar.src
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
                {showJobRole
                  ? profile.jobRole?.map((role: string, index: number) => (
                      <span key={index}>
                        {role}
                        {index < profile.jobRole.length - 1 && ", "}
                      </span>
                    ))
                  : null}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "kolbe",
      header: "Kolbe Strengths",
      size: 600,
      cell: ({ row }) => {
        const profileKolbeStrengths = row.original.kolbeStrengths2;

        // Extract values using utility functions
        const factFinderValue = getKolbeNumericValue(
          profileKolbeStrengths?.factFinder,
        );
        const followThruValue = getKolbeNumericValue(
          profileKolbeStrengths?.followThru,
        );
        const quickStartValue = getKolbeNumericValue(
          profileKolbeStrengths?.quickStart,
        );
        const implementerValue = getKolbeNumericValue(
          profileKolbeStrengths?.implementer,
        );

        const factFinderDisplay = getKolbeDisplayValue(
          profileKolbeStrengths?.factFinder,
        );
        const followThruDisplay = getKolbeDisplayValue(
          profileKolbeStrengths?.followThru,
        );
        const quickStartDisplay = getKolbeDisplayValue(
          profileKolbeStrengths?.quickStart,
        );
        const implementerDisplay = getKolbeDisplayValue(
          profileKolbeStrengths?.implementer,
        );

        return (
          <div className="flex">
            <div className="w-6 h-6 text-base flex items-center justify-center font-bold">
              {factFinderDisplay}
            </div>
            <div className="w-6 h-6 text-base flex items-center justify-center font-bold">
              {followThruDisplay}
            </div>
            <div className="w-6 h-6 text-base flex items-center justify-center font-bold">
              {quickStartDisplay}
            </div>
            <div className="w-6 h-6 text-base flex items-center justify-center font-bold">
              {implementerDisplay}
            </div>

            <div className="w-6 h-6 items-center justify-between flex flex-col transform -rotate-90 ml-2">
              <Progress
                value={factFinderValue ? factFinderValue * 10 : 0}
                color="bg-inspireRed"
                className="h-1 rounded-[1px]"
              />
              <Progress
                value={followThruValue ? followThruValue * 10 : 0}
                color="bg-inspireBlue"
                className="h-1 rounded-[1px]"
              />
              <Progress
                value={quickStartValue ? quickStartValue * 10 : 0}
                color="bg-inspireGreen"
                className="h-1 rounded-[1px]"
              />
              <Progress
                value={implementerValue ? implementerValue * 10 : 0}
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
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
  });

  if (profiles.length === 0) {
    return (
      <div>
        <h2 className="text-base font-semibold">{tableName}</h2>
        <div className="py-4">
          <p className="text-gray-500">No TUG Cards to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-4 ">
      <h2 className="text-base font-semibold">{tableName}</h2>
      <div className="rounded-md border bg-light1 w-full">
        <Table className="table-fixed  w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`py-2 ${
                      header.column.id === "name" ? "w-1/3" : "w-2/3"
                    }`}
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
              <TableRow key={row.id} className="px-4">
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`py-2 ${
                      cell.column.id === "name" ? "w-1/3" : "w-2/3"
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default KolbeStrengthsTable;
