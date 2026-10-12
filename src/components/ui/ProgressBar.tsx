"use client";

import { cn } from "@/lib/cn";

interface ProgressBarProps {
  /** Valeur courante (ex: 12) */
  value: number;
  /** Valeur max (pour calculer le %) — si 0, la barre reste vide */
  max: number;
  /** Label à gauche */
  label?: string;
  /** Label à droite (par défaut : la valeur) */
  rightLabel?: string | number;
  /** Couleur custom (classes tailwind du gradient) */
  color?: string;
  /** Affiche le % au lieu de la valeur brute */
  showPercent?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max,
  label,
  rightLabel,
  color = "from-primary to-primary-hover",
  showPercent = false,
  className,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className={cn("space-y-1.5", className)}>
      {(label !== undefined || rightLabel !== undefined) && (
        <div className="flex items-center justify-between gap-2 text-xs">
          {label && (
            <span className="font-medium text-foreground-muted truncate">
              {label}
            </span>
          )}
          <span className="font-semibold text-foreground tabular-nums whitespace-nowrap">
            {showPercent
              ? `${pct}%`
              : rightLabel !== undefined
                ? rightLabel
                : value}
          </span>
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-surface-hover"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-500",
            color,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}