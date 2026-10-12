"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, className, id, children, ...rest }, ref) => {
    const selectId = id ?? rest.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-foreground-muted"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full h-10 rounded-lg border bg-surface px-3 text-sm text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
            "transition-colors",
            error ? "border-red-500/50" : "border-border",
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        {error ? (
          <p className="text-xs text-red-400">{error}</p>
        ) : hint ? (
          <p className="text-xs text-foreground-subtle">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Select.displayName = "Select";