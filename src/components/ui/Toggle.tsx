"use client";

import { cn } from "@/lib/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  "aria-label"?: string;
}

export function Toggle({
  checked,
  onChange,
  disabled,
  size = "md",
  ...rest
}: ToggleProps) {
  const dims =
    size === "sm"
      ? { track: "h-5 w-9", thumb: "h-3.5 w-3.5", shift: "translate-x-4" }
      : { track: "h-6 w-11", thumb: "h-4 w-4", shift: "translate-x-5" };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full border transition-colors",
        dims.track,
        checked
          ? "bg-primary border-primary"
          : "bg-surface-hover border-border",
        disabled && "opacity-50 cursor-not-allowed",
      )}
      {...rest}
    >
      <span
        className={cn(
          "ml-0.5 inline-block rounded-full bg-white shadow-sm transform transition-transform",
          dims.thumb,
          checked ? dims.shift : "translate-x-0",
        )}
      />
    </button>
  );
}