import { Table, flexRender } from "@tanstack/react-table";
import { GoInfo } from "react-icons/go";
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/shadcn-ui/table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/shadcn-ui/alert-dialog";
import { ProfileTableSkeleton } from "@/src/components/custom-ui/table-skeleton";
import { useCallback, useEffect, useRef, useState } from "react";

interface ContentProps<TData> {
  table: Table<TData>;
  resetKey?: string;
  isSearching?: boolean;
  hasActiveFilters?: boolean;
  allowRowClick: boolean;
  loadingProfiles: boolean;
  onRowClick?: (data: TData) => void;
  hasData: boolean;
  error: string | null;
  onRetry: () => void;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function Content<TData>({
  table,
  resetKey,
  isSearching = false,
  hasActiveFilters = false,
  allowRowClick,
  loadingProfiles,
  onRowClick,
  hasData,
  error,
  onRetry,
  hasMore,
  onLoadMore,
}: ContentProps<TData>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    setScrollTop(0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [resetKey, isSearching]);

  const rows = table.getRowModel().rows;
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
      !loadingProfiles &&
      element.scrollTop + element.clientHeight >=
        element.scrollHeight - rowHeight * 5
    ) {
      onLoadMore();
    }
  }, [hasMore, loadingProfiles, onLoadMore]);

  if (error) {
    return (
      <div className="rounded-md border bg-light1 p-8 text-center">
        <p className="text-red-500">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loadingProfiles && !hasData && !isSearching) {
    return <ProfileTableSkeleton rowCount={8} />;
  }

  const columns = table.getAllColumns();

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="rounded-md border bg-light1 max-h-[646px] overflow-y-auto"
    >
      <TableComponent>
        <TableHeader className="sticky top-0 bg-light1 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length ? (
            <>
              <TableRow aria-hidden="true">
                <TableCell
                  colSpan={columns.length}
                  style={{ height: firstVisibleIndex * rowHeight, padding: 0 }}
                />
              </TableRow>
              {visibleRows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row.original);
                    }
                  }}
                  className={
                    allowRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
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
              <TableCell colSpan={columns.length} className="h-24">
                <div className="h-fit flex justify-center gap-2">
                  {isSearching ? "Searching…" : "No results."}
                  {!hasData && !isSearching && !hasActiveFilters ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <GoInfo className="flex self-center cursor-pointer" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Missing Permissions
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            You don&apos;t have permissions to view any TUG
                            Cards at the moment. Ask an administrator for
                            access.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>OK</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableComponent>
      {hasMore && (
        <button
          type="button"
          disabled={loadingProfiles}
          onClick={onLoadMore}
          className="w-full p-3 text-sm"
        >
          {loadingProfiles ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}
