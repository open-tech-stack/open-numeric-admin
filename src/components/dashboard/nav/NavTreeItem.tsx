"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronRight,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/cn";
import type { NavItem } from "@/types";

interface NavTreeItemProps {
  item: NavItem;
  depth: number;
  disabled?: boolean;
  onToggleActive: (item: NavItem, isActive: boolean) => void;
  onEdit: (item: NavItem) => void;
  onAddChild: (parent: NavItem) => void;
  onDelete: (item: NavItem) => void;
}

export function NavTreeItem({
  item,
  depth,
  disabled,
  onToggleActive,
  onEdit,
  onAddChild,
  onDelete,
}: NavTreeItemProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = item.children.length > 0;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const primaryLabel = item.translations[0]?.label ?? item.key;

  return (
    <div ref={setNodeRef} style={style} className="select-none">
      <div
        className={cn(
          "group flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 transition-all",
          isDragging && "opacity-50 ring-2 ring-primary/40",
          !item.isActive && "opacity-60",
        )}
      >
        {/* Drag handle */}
        <button
          type="button"
          className={cn(
            "shrink-0 cursor-grab active:cursor-grabbing text-foreground-subtle hover:text-foreground",
            disabled && "cursor-not-allowed opacity-40",
          )}
          {...attributes}
          {...listeners}
          aria-label="Déplacer"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Expand / collapse */}
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="shrink-0 text-foreground-subtle hover:text-foreground"
            aria-label={expanded ? "Replier" : "Déplier"}
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                expanded && "rotate-90",
              )}
            />
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}

        {/* Infos */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-foreground truncate">
              {primaryLabel}
            </p>
            <Badge variant="default" className="font-mono lowercase">
              {item.key}
            </Badge>
            {!item.isActive && <Badge variant="warning">Inactif</Badge>}
          </div>
          <p className="text-xs text-foreground-muted truncate mt-0.5 flex items-center gap-1">
            <ExternalLink className="h-3 w-3 shrink-0" />
            <span className="font-mono">{item.href}</span>
          </p>
        </div>

        {/* Traductions */}
        <div className="hidden sm:flex items-center gap-1">
          {item.translations.map((t) => (
            <span
              key={t.locale}
              title={`${t.locale.toUpperCase()} : ${t.label}`}
              className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-hover text-foreground-muted"
            >
              {t.locale}
            </span>
          ))}
        </div>

        {/* Toggle actif */}
        <Toggle
          size="sm"
          checked={item.isActive}
          onChange={(v) => onToggleActive(item, v)}
          disabled={disabled}
          aria-label="Activer / désactiver"
        />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onAddChild(item)}
            disabled={disabled}
            className="p-1.5 rounded-lg text-foreground-muted hover:text-primary hover:bg-primary-soft transition-colors"
            title="Ajouter un enfant"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(item)}
            disabled={disabled}
            className="p-1.5 rounded-lg text-foreground-muted hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
            title="Modifier"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            disabled={disabled}
            className="p-1.5 rounded-lg text-foreground-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Enfants */}
      {expanded && hasChildren && (
        <div
          className="mt-2 space-y-2 border-l-2 border-border/60"
          style={{ marginLeft: 16 + depth * 4, paddingLeft: 12 }}
        >
          {item.children.map((child) => (
            <NavTreeItem
              key={child.id}
              item={child}
              depth={depth + 1}
              disabled={disabled}
              onToggleActive={onToggleActive}
              onEdit={onEdit}
              onAddChild={onAddChild}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}