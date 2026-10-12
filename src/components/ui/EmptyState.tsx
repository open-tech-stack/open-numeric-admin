"use client";

interface EmptyStateProps {
  /** Icône Lucide (ou tout composant React valide) */
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
      {Icon && (
        <div className="mb-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-hover text-foreground-subtle">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && (
        <p className="max-w-sm text-xs text-foreground-muted">{description}</p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}