"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="radio"
          ref={ref}
          className={cn(
            "peer h-4 w-4 shrink-0 appearance-none rounded-full border border-border bg-surface transition-colors",
            "checked:border-accent checked:bg-accent",
            "hover:border-border-hover",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        <div className="pointer-events-none absolute left-1 top-1 h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
      </div>
    );
  }
);
Radio.displayName = "Radio";

export { Radio };

