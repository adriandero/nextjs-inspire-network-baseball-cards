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
} from "@/src/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import WidgetCogsSVG from "@/public/WidgetCogsSimple";
import { urlFor } from "@/src/lib/sanity/client";

export interface WorkingGeniusTableProps {
  profiles: SanityDocument[];
  showJobRole: boolean;
  optimizedImages?: boolean;
  tableName?: string;
}

const WorkingGeniusTable: React.FC<WorkingGeniusTableProps> = ({
  profiles,
  showJobRole,
  optimizedImages = false,
  tableName,
}) => {
  // Define columns for the table
  const columns: ColumnDef<SanityDocument>[] = [
    {
      accessorKey: "name",
      header: "Name",
      size: 300, // Set this to 1/3 of your expected table width
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
      accessorKey: "widget",
      header: "WIDGET",
      size: 600, // Set this to 1/3 of your expected table width
      cell: ({ row }) => (
        <WidgetCogsSVG
          widget={row.original.workingGenius?.widget}
          _id={""}
          _rev={""}
          _type={""}
          _createdAt={""}
          _updatedAt={""}
        />
      ),
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
      <div className="p-4 text-center">
        <p className="text-gray-500">No profiles to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-4 ">
      <h2 className="text-base font-semibold">{tableName}</h2>
      <div className="rounded-md border bg-light1 w-full">
        <Table>
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
      </div>{" "}
    </div>
  );
};

export default WorkingGeniusTable;
