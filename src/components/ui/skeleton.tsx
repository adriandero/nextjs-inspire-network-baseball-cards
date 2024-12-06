import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "tw-animate-pulse tw-rounded-lg tw-bg-light3 animate-pulse",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
