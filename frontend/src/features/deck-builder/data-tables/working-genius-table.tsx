"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Profile } from "@/src/lib/entities/profile";

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
import WidgetCogsSVG from "@/public/illustrations/widget-cogs-simple-svg";
import { urlFor } from "@/src/lib/sanity/client";
import defaultAvatar from "@/public/images/default-avatar.png";
import {
  countGreenCogsFromWidget,
  createSummaryProfile,
} from "@/src/features/deck-builder/utils/widget-aggregation";
import WidgetCogIconSVG from "@/public/illustrations/widget-cog-icon-svg";

interface WorkingGeniusTableProps {
  profiles: Profile[];
  optimizedImages?: boolean;
  tableName?: string;
  showJobRole?: boolean;
}

const WorkingGeniusTable: React.FC<WorkingGeniusTableProps> = ({
  profiles,
  optimizedImages = false,
  tableName,
  showJobRole,
}) => {
  const summaryWidget = useMemo(() => {
    if (profiles.length === 0) return null;
    return createSummaryProfile(profiles);
  }, [profiles]);

  const greenCogCount = useMemo(() => {
    return summaryWidget ? countGreenCogsFromWidget(summaryWidget) : 0;
  }, [summaryWidget]);

  const summaryRow: Profile | null = useMemo(() => {
    if (!summaryWidget) return null;

    return {
      _id: "summary-row",
      name: `Total - ${greenCogCount}/6`,
      workingGenius: { widget: summaryWidget },
      _type: "profile",
      _rev: "",
      _createdAt: "",
      _updatedAt: "",
      uuid: "",
      slug: "",
      jobRole: [],
    };
  }, [summaryWidget, greenCogCount]);

  const columns = useMemo<ColumnDef<SanityDocument>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 300,
        cell: ({ row }) => {
          const profile = row.original;
          const isSummaryRow = profile._id === "summary-row";

          if (isSummaryRow) {
            return (
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center">
                    <WidgetCogIconSVG />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-base">{profile.name}</div>
                </div>
              </div>
            );
          }

          // Regular profile row
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
                              .quality(80)
                              .url()
                          : profile.profileImage.asset.url
                        : defaultAvatar.src
                    }
                    alt={profile.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
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
        size: 600,
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
    ],
    [optimizedImages, showJobRole]
  );

  const summaryData = useMemo(() => {
    return summaryRow ? [summaryRow] : [];
  }, [summaryRow]);

  const coreRowModel = useMemo(() => getCoreRowModel(), []);

  const mainTable = useReactTable({
    data: profiles,
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: coreRowModel,
  });

  const summaryTable = useReactTable({
    data: summaryData, // ← Use memoized array
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: coreRowModel,
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
    <div className="mb-4">
      <h2 className="text-base font-semibold mb-4">{tableName}</h2>

      <div className="rounded-md border bg-light1 w-full overflow-hidden">
        <Table>
          <TableHeader>
            {mainTable.getHeaderGroups().map((headerGroup) => (
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
            {mainTable.getRowModel().rows.map((row) => (
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

      {summaryRow && (
        <div className="bg-gray-50/50 rounded-md w-full overflow-hidden">
          <Table>
            <TableBody>
              {summaryTable.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="px-4 border-0 hover:bg-transparent" // Added hover:bg-transparent
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`py-3 border-0 ${
                        cell.column.id === "name" ? "w-1/3" : "w-2/3"
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default WorkingGeniusTable;
