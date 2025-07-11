import { RefObject } from "react";
import { type Table as ReactTable } from "@tanstack/react-table";

interface UseTableControlsProps {
  table: ReactTable<any>;
  searchInputRef: RefObject<HTMLInputElement>;
}

export const useTableControls = ({ table, searchInputRef }: UseTableControlsProps) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    table.getColumn("name")?.setFilterValue(event.target.value);
    setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const searchValue = (table.getColumn("name")?.getFilterValue() as string) ?? "";

  return {
    searchValue,
    handleSearchChange,
  };
};