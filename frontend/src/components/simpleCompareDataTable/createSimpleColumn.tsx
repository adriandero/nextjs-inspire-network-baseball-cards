"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SanityDocument } from "next-sanity";
import type { SimpleColumnDef } from "./simple-data-table"; // Import the type from the main component
import type { CheckedState } from "@radix-ui/react-checkbox"; // Import CheckedState type

// Header props type
interface HeaderProps {
  onSort?: (key: string) => void;
  sortDirection?: "asc" | "desc" | null;
  isAllSelected?: boolean;
  isSomeSelected?: boolean;
  onSelectAll?: (value: boolean) => void;
}

// Cell props type
interface CellProps<T> {
  row: T;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

// Simple column definition function
export function createSimpleColumn<T>(
  key: string,
  header: (props: HeaderProps) => React.ReactNode,
  renderCell: (props: CellProps<T>) => React.ReactNode
): SimpleColumnDef<T> {
  return {
    key,
    header,
    renderCell,
  };
}

// Profile columns definition
export function createProfileColumns(): SimpleColumnDef<SanityDocument>[] {
  return [
    // Selection column
    createSimpleColumn<SanityDocument>(
      "select",
      ({ isAllSelected, isSomeSelected, onSelectAll }) => (
        <Checkbox
          checked={isAllSelected}
          data-state={isSomeSelected ? "indeterminate" : undefined}
          onCheckedChange={(value: CheckedState) => onSelectAll?.(!!value)}
          aria-label="Select all"
        />
      ),
      ({ row, isSelected, onToggleSelect }) => (
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => {}}
          aria-label="Select row"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onToggleSelect?.();
          }}
        />
      )
    ),

    // Name column
    createSimpleColumn<SanityDocument>(
      "name",
      ({ onSort, sortDirection }) => (
        <div className="flex items-center gap-2">
          <h1>Name</h1>
          <Button
            variant="ghost"
            onClick={() => onSort?.("name")}
            className="w-fit"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      ({ row }) => (
        <div className="flex flex-row items-center gap-4 cursor-pointer">
          <div>
            <p className="font-bold text-base">{row.name}</p>
          </div>
        </div>
      )
    ),

    // Role column
    createSimpleColumn<SanityDocument>(
      "role",
      () => "Role",
      ({ row }) => (
        <div className="table-cell">
          {row.jobRole ? (
            row.jobRole.map((role: string, index: number) => (
              <span key={index}>
                {role}
                {index < row.jobRole.length - 1 && ", "}
              </span>
            ))
          ) : (
            <p className="text-dark3 italic">no Role</p>
          )}
        </div>
      )
    ),
  ];
}

// Team columns definition
export function createTeamColumns(): SimpleColumnDef<SanityDocument>[] {
  return [
    // Selection column
    createSimpleColumn<SanityDocument>(
      "select",
      ({ isAllSelected, isSomeSelected, onSelectAll }) => (
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={(value) => onSelectAll?.(!!value)}
          aria-label="Select all"
        />
      ),
      ({ row, isSelected, onToggleSelect }) => (
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect?.()}
          aria-label="Select row"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        />
      )
    ),

    // Name column
    createSimpleColumn<SanityDocument>(
      "name",
      ({ onSort, sortDirection }) => (
        <div className="flex items-center gap-2">
          <h1>Name</h1>
          <Button
            variant="ghost"
            onClick={() => onSort?.("name")}
            className="w-fit"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      ({ row }) => (
        <div className="flex flex-row items-center gap-4 cursor-pointer">
          <div>
            <p className="font-bold text-base">{row.name}</p>
          </div>
        </div>
      )
    ),

    // Members column
    createSimpleColumn<SanityDocument>(
      "members",
      () => "Members",
      ({ row }) => (
        <div className="text-base">
          {row.members ? row.members.length : 0} member(s)
        </div>
      )
    ),
  ];
}
