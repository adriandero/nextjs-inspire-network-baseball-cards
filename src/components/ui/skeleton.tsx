import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-light3 animate-pulse",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
