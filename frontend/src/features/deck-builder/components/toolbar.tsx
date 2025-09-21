"use client";

import React, { useState, useEffect } from "react"; // Add useEffect
import { useGateValue } from "@statsig/react-bindings"; // Add this import
import { Button } from "@/src/components/shadcn-ui/button";
import { GoMultiSelect, GoDownload, GoLink, GoFilter } from "react-icons/go";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/shadcn-ui/popover";
import { cn } from "@/src/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/src/components/shadcn-ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/shadcn-ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/src/components/shadcn-ui/dropdown-menu";
import {
  COMPARE_TYPE_OPTIONS,
  CompareTypes,
  COMPARISON_ATTRIBUTES,
} from "@/src/features/deck-builder/entities/compare-types";
import { PRINCIPLES_YOU_ARCHETYPES } from "@/src/features/deck-builder/constants/principles-you-archetypes";

export interface ToolbarProps {
  selectedType: CompareTypes;
  onTypeChange: (type: CompareTypes) => void;
  showJobRole: boolean;
  onShowJobRoleChange: (show: boolean) => void;
  selectedFilters: string[];
  onFiltersChange: (filters: string[]) => void;
  groupedProfiles: string | null;
  pdfLoading: boolean;
  onPDFDownload: () => void;
}

export function Toolbar({
  selectedType,
  onTypeChange,
  showJobRole,
  onShowJobRoleChange,
  selectedFilters,
  onFiltersChange,
  pdfLoading,
  onPDFDownload,
}: ToolbarProps) {
  const [open, setOpen] = useState(false);
  const [recentlyCopied, setRecentlyCopied] = useState(false);

  const principlesYouGraphEnabled = useGateValue("archetypes_grid");

  useEffect(() => {
    if (
      selectedType === CompareTypes.PRINCIPLES_YOU_ARCHETYPES_GRAPH &&
      !principlesYouGraphEnabled
    ) {
      onTypeChange(CompareTypes.WORKING_GENIUS); // fallback to safe default
    }
  }, [selectedType, principlesYouGraphEnabled, onTypeChange]);

  // Filter comparison options based on feature flag
  const availableCompareOptions = COMPARE_TYPE_OPTIONS.filter((item) => {
    // Filter out PRINCIPLES_YOU_ARCHETYPES_GRAPH if flag is disabled
    if (item.value === CompareTypes.PRINCIPLES_YOU_ARCHETYPES_GRAPH) {
      return principlesYouGraphEnabled;
    }
    return true;
  });

  const handleCopyURLToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setRecentlyCopied(true);

      setTimeout(() => {
        setRecentlyCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const getAllArchetypes = (): Array<{ id: string; label: string }> => {
    return PRINCIPLES_YOU_ARCHETYPES.flatMap((group) => group.archetypes);
  };

  const getFiltersLabel = () => {
    if (selectedFilters.length === 0) return "None";
    if (selectedFilters.length === 1) {
      const filter = getAllArchetypes().find(
        (f) => f.id === selectedFilters[0],
      );
      return filter?.label ?? "1 selected";
    }
    return `${selectedFilters.length} selected`;
  };

  const handleFilterChange = (filterId: string, checked: boolean) => {
    const newFilters = checked
      ? [...selectedFilters, filterId]
      : selectedFilters.filter((id) => id !== filterId);
    onFiltersChange(newFilters);
  };

  return (
    <div className="flex w-full items-center h-8 py-4 gap-2">
      <h1 className="text-lg font-bold mr-auto">
        {COMPARISON_ATTRIBUTES[selectedType].title || "Compare Type"}
      </h1>

      {/* Comparison Type Selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-fit justify-between"
          >
            {COMPARISON_ATTRIBUTES[selectedType].title || "Compare Type"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <Command>
            <CommandInput placeholder="Search compare type..." />
            <CommandEmpty>No compare type found.</CommandEmpty>
            <CommandGroup>
              {/* Use filtered options instead of COMPARE_TYPE_OPTIONS */}
              {availableCompareOptions.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.data.title}
                  onSelect={() => onTypeChange(item.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedType === item.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {item.data.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Display Options Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <GoMultiSelect />
            <span className="hidden sm:inline">Display</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Filter Submenu - only for PrinciplesYou */}
          {selectedType === CompareTypes.PRINCIPLES_YOU_ARCHETYPES && (
            <>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <GoFilter className="mr-2 h-4 w-4" />
                  <span>Filter</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {getFiltersLabel()}
                  </span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-80 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search archetypes..."
                      className="h-9"
                    />
                    <CommandEmpty>No archetype found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto p-1">
                      {PRINCIPLES_YOU_ARCHETYPES.flatMap((group) =>
                        group.archetypes.map((filter) => (
                          <CommandItem
                            key={filter.id}
                            value={filter.label}
                            onSelect={() => {
                              const isSelected = selectedFilters.includes(
                                filter.id,
                              );
                              handleFilterChange(filter.id, !isSelected);
                            }}
                            className="flex items-center px-2 py-1.5 cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedFilters.includes(filter.id)
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {filter.label}
                          </CommandItem>
                        )),
                      )}
                    </CommandGroup>
                  </Command>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuCheckboxItem
            checked={showJobRole}
            onCheckedChange={(checked) =>
              onShowJobRoleChange(checked as boolean)
            }
            onSelect={(e) => e.preventDefault()}
          >
            Show Title
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Copy URL Button */}
      <TooltipProvider>
        <Tooltip open={recentlyCopied ? true : undefined}>
          <TooltipTrigger>
            <Button variant="outline" onClick={handleCopyURLToClipboard}>
              {recentlyCopied ? <Check className="text-primary" /> : <GoLink />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {recentlyCopied ? "Copied!" : "Copy Link"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* PDF Download Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="outline"
              onClick={onPDFDownload}
              disabled={pdfLoading}
            >
              {pdfLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <GoDownload />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Download PDF</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
