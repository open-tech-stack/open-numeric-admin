"use client";

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Navigation } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { flattenTree } from "@/hooks/useNav";
import type { NavItem, NavReorderItem } from "@/types";
import { NavTreeItem } from "./NavTreeItem";

interface NavTreeProps {
  tree: NavItem[];
  disabled?: boolean;
  onReorder: (items: NavReorderItem[]) => void;
  onToggleActive: (item: NavItem, isActive: boolean) => void;
  onEdit: (item: NavItem) => void;
  onAddChild: (parent: NavItem) => void;
  onDelete: (item: NavItem) => void;
}

export function NavTree({
  tree,
  disabled,
  onReorder,
  onToggleActive,
  onEdit,
  onAddChild,
  onDelete,
}: NavTreeProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const flat = useMemo(() => flattenTree(tree), [tree]);
  const ids = useMemo(() => flat.map((i) => i.id), [flat]);
  const byId = useMemo(() => new Map(flat.map((i) => [i.id, i])), [flat]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    const newIds = arrayMove(ids, oldIndex, newIndex);

    // On conserve le parentId d'origine, on ne recalcule que l'order.
    const newItems: NavReorderItem[] = newIds.map((id, idx) => {
      const it = byId.get(id)!;
      return { id, order: idx, parentId: it.parentId };
    });

    onReorder(newItems);
  };

  if (tree.length === 0) {
    return (
      <EmptyState
        icon={Navigation}
        title="Aucun élément de navigation"
        description="Créez votre premier item pour commencer."
      />
    );
  }

  const activeItem = activeId ? byId.get(activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(e) => setActiveId(String(e.active.id))}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {tree.map((item) => (
            <NavTreeItem
              key={item.id}
              item={item}
              depth={0}
              disabled={disabled}
              onToggleActive={onToggleActive}
              onEdit={onEdit}
              onAddChild={onAddChild}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeItem && (
          <div className="rounded-xl border border-primary bg-surface px-3 py-2.5 shadow-lg opacity-90 text-sm font-semibold">
            {activeItem.translations[0]?.label ?? activeItem.key}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}