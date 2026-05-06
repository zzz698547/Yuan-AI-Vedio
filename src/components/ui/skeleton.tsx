import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-xl bg-slate-200/70 motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
