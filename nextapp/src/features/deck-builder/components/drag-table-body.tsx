import React, { useCallback, useEffect, useRef, useState } from "react";
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
  type Table as ReactTable,
  Row,
} from "@tanstack/react-table";
import {
  COMPARE_PROFILE_TABLE_SKELETON_COLUMNS,
  SkeletonColumnDef,
  TableSkeleton,
} from "@/src/components/custom-ui/table-skeleton";

interface TableBodyProps<T> {
  table: ReactTable<T>;
  resetKey?: string;
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  renderRow: (row: Row<T>) => JSX.Element;
  skeletonColumns?: SkeletonColumnDef[];
  skeletonRowCount?: number;
  useSkeletonLoading?: boolean;
  hasLoadedOnce?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export function GenericTableBody<T>({
  table,
  resetKey,
  columns,
  isLoading = false,
  emptyMessage = "No results found.",
  renderRow,
  skeletonColumns = COMPARE_PROFILE_TABLE_SKELETON_COLUMNS,
  skeletonRowCount = 5,
  useSkeletonLoading = true,
  hasLoadedOnce = false, // Default to false for initial loading
  hasMore = false,
  onLoadMore = () => {},
  isLoadingMore = false,
}: TableBodyProps<T>) {
  const rows = table.getRowModel().rows;
  const hasData = rows && rows.length > 0;
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setScrollTop(0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [resetKey]);
  const rowHeight = 56;
  const overscan = 8;
  const viewportHeight = 646;
  const firstVisibleIndex = Math.max(
    0,
    Math.floor(scrollTop / rowHeight) - overscan,
  );
  const lastVisibleIndex = Math.min(
    rows.length,
    Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan,
  );
  const visibleRows = rows.slice(firstVisibleIndex, lastVisibleIndex);
  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    setScrollTop(element.scrollTop);
    if (
      hasMore &&
      !isLoadingMore &&
      element.scrollTop + element.clientHeight >=
        element.scrollHeight - rowHeight * 5
    ) {
      onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore]);

  const shouldShowSkeleton =
    useSkeletonLoading &&
    ((isLoading && !hasData) || (!hasData && !hasLoadedOnce));

  if (shouldShowSkeleton) {
    return (
      <>
        <TableSkeleton
          columns={skeletonColumns}
          rowCount={skeletonRowCount}
          className=""
        />
      </>
    );
  }

  return (
    <>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="rounded-md border bg-light1 max-h-[646px] overflow-y-auto"
      >
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
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {hasData ? (
              <>
                <TableRow aria-hidden="true">
                  <TableCell
                    colSpan={columns.length}
                    style={{
                      height: firstVisibleIndex * rowHeight,
                      padding: 0,
                    }}
                  />
                </TableRow>
                {visibleRows.map((row) => renderRow(row))}
                <TableRow aria-hidden="true">
                  <TableCell
                    colSpan={columns.length}
                    style={{
                      height: (rows.length - lastVisibleIndex) * rowHeight,
                      padding: 0,
                    }}
                  />
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {hasMore && (
          <button
            type="button"
            disabled={isLoadingMore}
            onClick={onLoadMore}
            className="w-full p-3 text-sm"
          >
            {isLoadingMore ? "Loading…" : "Load more"}
          </button>
        )}
      </div>
      <div className="flex items-center justify-end space-x-2 p-4 w-full h-full">
        <div className="flex-1 text-sm text-muted-foreground">
          {isLoading ? null : (
            <>
              {table.getFilteredSelectedRowModel().rows.length} TUG Cards
              selected.
            </>
          )}
        </div>
      </div>
    </>
  );
}
