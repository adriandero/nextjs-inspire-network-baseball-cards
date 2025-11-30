import { RefObject } from "react";
import { type Table as ReactTable } from "@tanstack/react-table";

interface TableRowWithName {
  name: string;
}

interface UseTableControlsProps<T extends TableRowWithName> {
  table: ReactTable<T>;
  searchInputRef: RefObject<HTMLInputElement>;
}

export const useTableControls = <T extends TableRowWithName>({
  table,
  searchInputRef,
}: UseTableControlsProps<T>) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    table.getColumn("name")?.setFilterValue(event.target.value);
    setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const searchValue =
    (table.getColumn("name")?.getFilterValue() as string) ?? "";

  return {
    searchValue,
    handleSearchChange,
  };
};
