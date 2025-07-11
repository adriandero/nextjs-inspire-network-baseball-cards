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

interface ContentProps<TData> {
  table: Table<TData>;
  allowRowClick: boolean;
  loadingProfiles: boolean;
  onRowClick?: (data: TData) => void;
  hasData: boolean;
}

export function Content<TData>({
  table,
  allowRowClick,
  loadingProfiles,
  onRowClick,
  hasData,
}: ContentProps<TData>) {
  const columns = table.getAllColumns();

  return (
    <div className="rounded-md border bg-light1 max-h-[646px] overflow-y-auto">
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
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loadingProfiles ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Loading Tug Cards...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => {
                  if (allowRowClick && onRowClick) {
                    onRowClick(row.original);
                  }
                }}
                className={allowRowClick ? "" : ""}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24">
                <div className="h-fit flex justify-center gap-2">
                  No results.
                  {!hasData ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <GoInfo className="flex self-center " />
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
    </div>
  );
}
