"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/* =========================================================
   CARD
   ========================================================= */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Effet au hover (élévation) */
  hover?: boolean;
  /** Padding interne (défaut : true) */
  padded?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, padded = true, className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-border bg-surface shadow-sm",
          "transition-all duration-300",
          hover && "hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5",
          padded && "p-6",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = "Card";

/* =========================================================
   HEADER
   ========================================================= */

export interface CardHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export function CardHeader({
  title,
  description,
  action,
  className,
  children,
  ...rest
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 pb-5 border-b border-border",
        className,
      )}
      {...rest}
    >
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-base font-bold text-foreground">{title}</h3>
        )}
        {description && (
          <p className="mt-1 text-sm text-foreground-muted">{description}</p>
        )}
        {children}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

/* =========================================================
   BODY
   ========================================================= */

export function CardBody({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("py-5", className)} {...rest}>
      {children}
    </div>
  );
}

/* =========================================================
   FOOTER
   ========================================================= */

export function CardFooter({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 pt-5 border-t border-border",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}