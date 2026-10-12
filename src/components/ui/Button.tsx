"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/* =========================================================
   TYPES
   ========================================================= */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  fullWidth?: boolean;
  children?: ReactNode;
}

/* =========================================================
   STYLES
   ========================================================= */

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg hover:shadow-xl",
  secondary:
    "bg-surface text-foreground border border-border hover:bg-surface-hover hover:border-primary/40",
  outline:
    "bg-transparent text-foreground border border-border-strong hover:bg-surface-hover hover:border-primary",
  ghost:
    "bg-transparent text-foreground-muted hover:text-foreground hover:bg-surface-hover",
  danger:
    "bg-danger text-white hover:bg-red-600 shadow-lg hover:shadow-xl",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
};

/* =========================================================
   COMPOSANT
   ========================================================= */

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          "active:scale-[0.98]",
          VARIANTS[variant],
          SIZES[size],
          fullWidth && "w-full",
          className,
        )}
        {...rest}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : LeftIcon ? (
          <LeftIcon
            className={cn(
              size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4",
            )}
          />
        ) : null}

        {children}

        {!loading && RightIcon && (
          <RightIcon
            className={cn(
              size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4",
            )}
          />
        )}
      </button>
    );
  },
);

Button.displayName = "Button";