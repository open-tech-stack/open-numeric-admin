"use client";

import { Plus, RefreshCw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { NavItemModal } from "@/components/dashboard/nav/NavItemModal";
import { NavTree } from "@/components/dashboard/nav/NavTree";
import { useNav } from "@/hooks/useNav";
import type {
  CreateNavItemInput,
  NavItem,
  NavReorderItem,
  UpdateNavItemInput,
} from "@/types";

export default function NavigationPage() {
  const {
    tree,
    flat,
    loading,
    mutating,
    refresh,
    create,
    update,
    remove,
    reorder,
  } = useNav();

  /* Modal state */
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<NavItem | null>(null);
  const [defaultParent, setDefaultParent] = useState<NavItem | null>(null);

  /* Delete state */
  const [toDelete, setToDelete] = useState<NavItem | null>(null);

  /* -------------------- Handlers -------------------- */

  const openCreate = (parent: NavItem | null = null) => {
    setEditing(null);
    setDefaultParent(parent);
    setModalOpen(true);
  };

  const openEdit = (item: NavItem) => {
    setEditing(item);
    setDefaultParent(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setDefaultParent(null);
  };

  const handleSubmit = async (
    data: CreateNavItemInput | UpdateNavItemInput,
    isEdit: boolean,
    id?: string,
  ) => {
    if (isEdit && id) {
      await update(id, data as UpdateNavItemInput);
    } else {
      await create(data as CreateNavItemInput);
    }
    closeModal();
  };

  const handleToggleActive = async (item: NavItem, isActive: boolean) => {
    await update(item.id, { isActive });
  };

  const handleReorder = async (items: NavReorderItem[]) => {
    await reorder({ items });
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    try {
      await remove(toDelete.id);
      setToDelete(null);
    } catch {
      /* toast déjà géré dans le hook */
    }
  };

  /* -------------------- Render -------------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Navigation</h1>
          <p className="text-sm text-foreground-muted mt-1">
            Gérez les menus du site. Glissez-déposez pour réordonner.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            leftIcon={RefreshCw}
            onClick={refresh}
            disabled={loading || mutating}
          >
            Rafraîchir
          </Button>
          <Button
            variant="primary"
            leftIcon={Plus}
            onClick={() => openCreate(null)}
            disabled={loading || mutating}
          >
            Nouvel élément
          </Button>
        </div>
      </div>

      {/* Tree */}
      <Card padded>
        <CardHeader
          title="Structure du menu"
          description="Les éléments inactifs n'apparaissent pas sur le site public."
          action={
            <span className="text-xs text-foreground-subtle tabular-nums">
              {flat.length} élément{flat.length > 1 ? "s" : ""}
            </span>
          }
        />
        <CardBody className="pb-0">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-xl bg-surface-hover"
                />
              ))}
            </div>
          ) : (
            <NavTree
              tree={tree}
              disabled={mutating}
              onReorder={handleReorder}
              onToggleActive={handleToggleActive}
              onEdit={openEdit}
              onAddChild={(parent) => openCreate(parent)}
              onDelete={setToDelete}
            />
          )}
        </CardBody>
      </Card>

      {/* Modal create/edit */}
      <NavItemModal
        open={modalOpen}
        item={editing}
        defaultParent={defaultParent}
        flat={flat}
        submitting={mutating}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={mutating}
        title="Supprimer cet élément ?"
        description={
          toDelete
            ? `"${toDelete.translations[0]?.label ?? toDelete.key}" sera supprimé${
                toDelete.children.length > 0
                  ? ` avec ses ${toDelete.children.length} sous-élément(s)`
                  : ""
              }. Cette action est irréversible.`
            : ""
        }
        confirmLabel="Supprimer"
      />
    </div>
  );
}