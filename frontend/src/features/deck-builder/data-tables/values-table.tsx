"use client";

import React, { useEffect, useState } from "react";
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
import { urlFor } from "@/src/lib/sanity/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { GoReply, GoTrash } from "react-icons/go";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import defaultAvatar from "@/public/images/default-avatar.png";

export interface ValuesTableProps {
  profiles: SanityDocument[];
  showJobRole: boolean;
  optimizedImages?: boolean;
  tableName?: string;
}

interface ProfileColors {
  [profileId: string]: {
    [cellId: string]: string;
  };
}

interface ValueColorMap {
  [value: string]: string;
}

const ValuesTable: React.FC<ValuesTableProps> = ({
  profiles,
  showJobRole,
  optimizedImages = false,
  tableName,
}) => {
  const colors: Record<string, string> = {
    none: "",
    purple: "#69336F",
    teal: "#007E8C",
    cyan: "#3FAFBA",
    rose: "#AF4B63",
    orange: "#F25F3E",
  };

  const [profileColors, setProfileColors] = useState<ProfileColors>({});
  const [valueColorMap, setValueColorMap] = useState<ValueColorMap>({});

  const handleColorChange = (
    profileId: string,
    cellId: string,
    color: string
  ) => {
    setProfileColors((prev) => ({
      ...prev,
      [profileId]: {
        ...(prev[profileId] || {}),
        [cellId]: color,
      },
    }));
  };

  const revertToAutoColors = () => {
    setProfileColors({});
    if (Object.keys(valueColorMap).length === 0) {
      setValueColorMap(generateAutoColorMap());
    }
  };

  const clearAllColorSystems = () => {
    setProfileColors({});
    setValueColorMap({});
  };

  const generateAutoColorMap = () => {
    if (!profiles || profiles.length === 0) return {};

    // Count occurrences of each value
    const valueCounts: Record<string, number> = {};

    profiles.forEach((profile) => {
      if (profile.values && Array.isArray(profile.values)) {
        profile.values.forEach((value) => {
          if (value) {
            valueCounts[value] = (valueCounts[value] || 0) + 1;
          }
        });
      }
    });

    const sortedValues = Object.entries(valueCounts)
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0])
      .slice(0, 5);

    const colorKeys = Object.keys(colors).filter((c) => c !== "none");
    const newValueColorMap: ValueColorMap = {};

    sortedValues.forEach((value, index) => {
      if (index < colorKeys.length) {
        newValueColorMap[value] = colorKeys[index];
      }
    });

    return newValueColorMap;
  };

  useEffect(() => {
    setValueColorMap(generateAutoColorMap());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profiles]);

  const ColorDropdown = ({
    profileId,
    cellId,
    value,
  }: {
    profileId: string;
    cellId: string;
    value: string;
  }) => {
    const manualColor = profileColors[profileId]?.[cellId];
    const autoColor = !manualColor && value ? valueColorMap[value] : null;
    const selectedColor = manualColor || autoColor || "";

    return (
      <Select
        onValueChange={(value) => handleColorChange(profileId, cellId, value)}
      >
        <SelectTrigger className="h-fit w-fit p-0 rounded-full bg-light1">
          <SelectValue
            placeholder={
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor:
                    !selectedColor || selectedColor === "none"
                      ? "transparent"
                      : colors[selectedColor],
                }}
              />
            }
          />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(colors).map(([name, hex]) => (
            <SelectItem key={name} value={name}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full ${name === "none" ? "border border-gray-300" : ""}`}
                  style={{ backgroundColor: hex }}
                />
                <span className="capitalize">{name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

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
        <div className="text-center">{row.original.values?.[0] || "-"}</div>
      ),
    },
    {
      accessorKey: "value2",
      header: "Value 2",
      cell: ({ row }) => (
        <div className="text-center">{row.original.values?.[1] || "-"}</div>
      ),
    },
    {
      accessorKey: "value3",
      header: "Value 3",
      cell: ({ row }) => (
        <div className="text-center">{row.original.values?.[2] || "-"}</div>
      ),
    },
    {
      accessorKey: "value4",
      header: "Value 4",
      cell: ({ row }) => (
        <div className="text-center">{row.original.values?.[3] || "-"}</div>
      ),
    },
    {
      accessorKey: "value5",
      header: "Value 5",
      cell: ({ row }) => (
        <div className="text-center">{row.original.values?.[4] || "-"}</div>
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
        <p className="text-gray-500">No TUG Cards to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-4 ">
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-base font-semibold">{tableName}</h2>

        <div className="flex gap-2 ">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  className="self-center hover:text-tertiary"
                  size="sm"
                  onClick={revertToAutoColors}
                >
                  <GoReply strokeWidth="0.6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Automatically Assign Colors</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  className="self-center hover:text-inspireRed"
                  size="sm"
                  onClick={clearAllColorSystems}
                >
                  <GoTrash strokeWidth="0.6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear All Colors</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
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
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell, index) => {
                  const profileId = row.original._id || row.id;
                  const cellId = cell.column.id;
                  const values = row.original.values || [];
                  const cellValue = cellId.startsWith("value")
                    ? values[parseInt(cellId.replace("value", "")) - 1] || ""
                    : "";
                  const manualColor = profileColors[profileId]?.[cellId];
                  const autoColor =
                    !manualColor && cellValue ? valueColorMap[cellValue] : null;
                  const selectedColor = manualColor || autoColor || "";
                  const backgroundColor =
                    selectedColor && selectedColor !== "none"
                      ? colors[selectedColor] + ""
                      : "";

                  return (
                    <TableCell
                      key={cell.id}
                      className={`py-2 relative group ${selectedColor && selectedColor !== "none" ? "text-white" : "text-dark1"} ${cell.column.id !== "name" ? "w-1/6" : "w-1/3"} ${
                        index > 0 ? "border-l border-light2" : ""
                      }`}
                      style={selectedColor ? { backgroundColor } : {}}
                    >
                      {cell.column.id === "name" ? null : (
                        <div className="absolute right-2 bottom-2 group-hover:opacity-100 transition-opacity duration-200 opacity-0">
                          <ColorDropdown
                            profileId={profileId}
                            cellId={cellId}
                            value={cellValue}
                          />
                        </div>
                      )}

                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>{" "}
    </div>
  );
};

export default ValuesTable;
