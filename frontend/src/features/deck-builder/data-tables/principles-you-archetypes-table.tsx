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
import defaultAvatar from "@/public/images/default-avatar.png";
import { getArchetypeImage } from "@/src/lib/asset-mapping/principle-you-archetype-images-mapping";
import { Profile } from "@/src/lib/entities/profile";

export interface PrinciplesYouArchetypesTableProps {
  profiles: Profile[];
  optimizedImages?: boolean;
  tableName?: string;
  showJobRole?: boolean;
}

const PrinciplesYouArchetypesTable: React.FC<
  PrinciplesYouArchetypesTableProps
> = ({ profiles, optimizedImages = false, tableName, showJobRole }) => {
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
      accessorKey: "principleYouArchetypes",
      header: "Most Like",
      cell: ({ row }) => {
        const profile = row.original;
        return (
          <div className="flex gap-2">
            {profile?.principleYouArchetype?.map(
              (principle: string, index: number) => (
                <div key={index}>
                  <Image
                    src={getArchetypeImage(principle)}
                    alt={`Illustration for ${principle}`}
                    width={64}
                    height={64}
                    className="h-auto w-auto max-h-16 object-contain"
                  />
                </div>
              ),
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "principleYouArchetypesLeast",
      header: "Least Like",
      cell: ({ row }) => {
        const profile = row.original;
        return (
          <div className="flex gap-2">
            {profile?.principleYouArchetypeLeast?.map(
              (principle: string, index: number) => (
                <div key={index}>
                  <Image
                    src={getArchetypeImage(principle)}
                    alt={`Illustration for ${principle}`}
                    width={64}
                    height={64}
                    className="h-auto w-auto max-h-16 object-contain"
                  />
                </div>
              ),
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: profiles,
    columns,
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
                  <TableHead key={header.id} className={`py-2 `}>
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
                  <TableCell key={cell.id} className={`py-2 `}>
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

export default PrinciplesYouArchetypesTable;
