"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/src/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    color?: string;
  }
>(({ className, value, color, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-md bg-light2",
      className,
    )}
    {...props}
  >
    {!!value && value > 0 && (
      <ProgressPrimitive.Indicator
        className={cn("h-full w-full flex-1 transition-all", color)}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    )}
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
