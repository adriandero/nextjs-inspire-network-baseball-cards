"use client";

import React, { useEffect, useState } from "react";
import { useGateValue } from "@statsig/react-bindings";
import { Button } from "@/src/components/shadcn-ui/button";
import { GoDownload, GoFilter, GoLink, GoMultiSelect } from "react-icons/go";
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/src/components/shadcn-ui/dropdown-menu";
import {
  AvailableFilter,
  COMPARE_TYPE_OPTIONS,
  CompareTypes,
  COMPARISON_ATTRIBUTES,
} from "@/src/features/deck-builder/entities/compare-types";
import { PRINCIPLES_YOU_ARCHETYPES } from "@/src/features/deck-builder/constants/principles-you-archetypes";

export interface ToolbarProps {
  selectedType: CompareTypes;
  onTypeChange: (type: CompareTypes) => void;

  filters: {
    showJobRole: boolean;
    selectedArchetypes: string[];
    showPrimaryOnly: boolean;
  };
  setters: {
    setShowJobRole: (show: boolean) => void;
    setSelectedArchetypes: (filters: string[]) => void;
    setShowPrimaryOnly: (show: boolean) => void;
  };
  availableFilters: AvailableFilter[] | undefined;
  groupedProfiles: string | null;
  pdfLoading: boolean;
  onPDFDownload: () => void;
  onPDFDownloadAll: () => void;
}

export function Toolbar({
  selectedType,
  onTypeChange,
  filters,
  setters,
  availableFilters,
  pdfLoading,
  onPDFDownload,
  onPDFDownloadAll,
}: ToolbarProps) {
  const [open, setOpen] = useState(false);
  const [recentlyCopied, setRecentlyCopied] = useState(false);

  const principlesYouGraphEnabled = useGateValue("archetypes_grid");

  useEffect(() => {
    if (
      selectedType === CompareTypes.PRINCIPLES_YOU_ARCHETYPES_GRAPH &&
      !principlesYouGraphEnabled
    ) {
      onTypeChange(CompareTypes.WORKING_GENIUS);
    }
  }, [selectedType, principlesYouGraphEnabled, onTypeChange]);

  const availableCompareOptions = COMPARE_TYPE_OPTIONS.filter((item) => {
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
    if (filters.selectedArchetypes.length === 0) return "None";
    if (filters.selectedArchetypes.length === 1) {
      const filter = getAllArchetypes().find(
        (f) => f.id === filters.selectedArchetypes[0],
      );
      return filter?.label ?? "1 selected";
    }
    return `${filters.selectedArchetypes.length} selected`;
  };

  const handleFilterChange = (filterId: string, checked: boolean) => {
    const newFilters = checked
      ? [...filters.selectedArchetypes, filterId]
      : filters.selectedArchetypes.filter((id) => id !== filterId);
    setters.setSelectedArchetypes(newFilters);
  };

  return (
    <div className="flex w-full items-center h-8 py-4 gap-2">
      <h1 className="text-lg font-bold mr-auto">
        {COMPARISON_ATTRIBUTES[selectedType]?.title || "Compare Type"}
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
            {COMPARISON_ATTRIBUTES[selectedType]?.title || "Compare Type"}
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
          {availableFilters?.includes(AvailableFilter.Archetypes) && (
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
                              const isSelected =
                                filters.selectedArchetypes.includes(filter.id);
                              handleFilterChange(filter.id, !isSelected);
                            }}
                            className="flex items-center px-2 py-1.5 cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                filters.selectedArchetypes.includes(filter.id)
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

          {availableFilters?.includes(AvailableFilter.ShowPrimaryOnly) && (
            <DropdownMenuCheckboxItem
              checked={filters.showPrimaryOnly}
              onCheckedChange={setters.setShowPrimaryOnly}
              onSelect={(e) => e.preventDefault()}
            >
              Show Primary Only
            </DropdownMenuCheckboxItem>
          )}

          {availableFilters?.includes(AvailableFilter.ShowJobRole) && (
            <DropdownMenuCheckboxItem
              checked={filters.showJobRole}
              onCheckedChange={setters.setShowJobRole}
              onSelect={(e) => e.preventDefault()}
            >
              Show Title
            </DropdownMenuCheckboxItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
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

      {/* PDF Download Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={pdfLoading}>
            {pdfLoading ? <Loader2 className="animate-spin" /> : <GoDownload />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={onPDFDownload} disabled={pdfLoading}>
            <div className="flex flex-col gap-0.5 flex-1">
              <div className="flex items-center">
                <GoDownload className="mr-2 h-4 w-4" />
                <span className="font-medium">Current View</span>
              </div>
              <span className="text-xs text-muted-foreground ml-6">
                {COMPARISON_ATTRIBUTES[selectedType]?.title}
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onPDFDownloadAll} disabled={pdfLoading}>
            <div className="flex flex-col gap-0.5 flex-1">
              <div className="flex items-center">
                <GoDownload className="mr-2 h-4 w-4" />
                <span className="font-medium">All Comparisons</span>
              </div>
              <span className="text-xs text-muted-foreground ml-6">
                7 comparison types
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
