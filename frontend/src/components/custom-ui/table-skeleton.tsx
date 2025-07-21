import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/shadcn-ui/table";

export const Skeleton = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      {...props}
    />
  );
};

// Skeleton variants for different cell types
export const AvatarNameSkeleton = () => (
  <div className="flex flex-row items-center gap-4">
    {/* Avatar skeleton */}
    <Skeleton className="min-w-10 min-h-10 !rounded-full" />
    <div className="space-y-2">
      {/* Name skeleton */}
      <Skeleton className="h-4 w-32" />
      {/* Job role skeleton */}
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
);

export const TextSkeleton = ({ width = "w-20" }: { width?: string }) => (
  <Skeleton className={`h-4 ${width}`} />
);

export const ActionsSkeleton = () => (
  <div className="flex justify-end">
    <Skeleton className="h-6 w-6 rounded" />
  </div>
);

export type SkeletonColumnType =
  | "avatar-name"
  | "text"
  | "text-wide"
  | "text-narrow"
  | "actions";

export interface SkeletonColumnDef {
  type: SkeletonColumnType;
  header: string;
  width?: string;
}

const getSkeletonForType = (type: SkeletonColumnType) => {
  switch (type) {
    case "avatar-name":
      return <AvatarNameSkeleton />;
    case "text":
      return <TextSkeleton />;
    case "text-wide":
      return <TextSkeleton width="w-32" />;
    case "text-narrow":
      return <TextSkeleton width="w-16" />;
    case "actions":
      return <ActionsSkeleton />;
    default:
      return <TextSkeleton />;
  }
};

interface TableSkeletonProps {
  columns: SkeletonColumnDef[];
  rowCount?: number;
  className?: string;
}

export const TableSkeleton = ({
  columns,
  rowCount = 5,
  className = "",
}: TableSkeletonProps) => {
  return (
    <div
      className={`rounded-md border bg-light1 max-h-[646px] overflow-y-auto ${className}`}
    >
      <TableComponent>
        <TableHeader className="sticky top-0 bg-light1 z-10">
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className={column.width}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} className={column.width}>
                  {getSkeletonForType(column.type)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableComponent>
    </div>
  );
};

export const PROFILE_TABLE_SKELETON_COLUMNS: SkeletonColumnDef[] = [
  { type: "avatar-name", header: "Name" },
  { type: "text", header: "Team" },
  { type: "actions", header: "" },
];

export const COMPARE_PROFILE_TABLE_SKELETON_COLUMNS: SkeletonColumnDef[] = [
  { type: "avatar-name", header: "Name" },
  { type: "text", header: "Role" },
];

export const CompareProfileTableSkeleton = ({
  rowCount = 5,
  className = "",
}: {
  rowCount?: number;
  className?: string;
}) => (
  <TableSkeleton
    columns={COMPARE_PROFILE_TABLE_SKELETON_COLUMNS}
    rowCount={rowCount}
    className={className}
  />
);

export const ProfileTableSkeleton = ({
  rowCount = 5,
  className = "",
}: {
  rowCount?: number;
  className?: string;
}) => (
  <TableSkeleton
    columns={PROFILE_TABLE_SKELETON_COLUMNS}
    rowCount={rowCount}
    className={className}
  />
);
