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
import WidgetCogsSVG from "./WidgetCogsSimple";
import {
  GoChevronDown,
  GoDownload,
  GoMultiSelect,
  GoShare,
} from "react-icons/go";
import { Button } from "../ui/button";

interface WorkingGeniusTableProps {
  profiles: SanityDocument[];
}

const WorkingGeniusTable: React.FC<WorkingGeniusTableProps> = ({
  profiles,
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
            {profile.profileImage?.asset?.url && (
              <div className="flex-shrink-0">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={profile.profileImage.asset.url}
                    alt={profile.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            )}
            <div>
              <div className="font-bold text-base">{profile.name}</div>
              <div className="text-base">{profile.team[0].name}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "widget",
      header: "WIDGET",
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

  const handleCopyURLToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

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
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex w-full items-center h-8 py-4 gap-2">
        <h1>Working Genius</h1>
        <Button variant="outline" className="ml-auto" disabled>
          <GoChevronDown />

          <span className=" hidden sm:inline">Working Genius</span>
        </Button>
        <Button variant="outline" disabled>
          <GoMultiSelect />
          <span className="hidden sm:inline">View</span>
        </Button>
        <Button
          variant="outline"
          className=""
          onClick={() => handleCopyURLToClipboard()}
        >
          <GoShare />
          {/* <span className=" hidden sm:inline"></span> */}
        </Button>
        <Button variant="outline" disabled className="">
          <GoDownload />
          {/* <span className=" hidden sm:inline"></span> */}
        </Button>
      </div>
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
                  <TableCell key={cell.id} className=" py-2">
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

export default WorkingGeniusTable;
