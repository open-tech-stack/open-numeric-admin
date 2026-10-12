"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { useCrud } from "@/hooks/useCrud";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import DataTable from "@/components/ui/DataTable";
import BrandIcon from "@/components/ui/BrandIcon";
import type { Social } from "@/types";
import type { Column, RowAction } from "@/types/table.types";
import SocialForm from "@/components/dashboard/socials/SocialForm";
import { socialService } from "@/services/social/social.service";

export default function SocialsPage() {
  const {
    items: socials,
    loading,
    deleting,
    create,
    update,
    remove,
  } = useCrud(socialService, {
    successCreate: "Réseau social créé",
    successUpdate: "Réseau social mis à jour",
    successDelete: "Réseau social supprimé",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Social | null>(null);
  const [toDelete, setToDelete] = useState<Social | null>(null);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (social: Social) => {
    setEditing(social);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editing) {
      const res = await update(editing.id, data);
      if (res) setFormOpen(false);
    } else {
      const res = await create(data);
      if (res) setFormOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    const ok = await remove(toDelete.id);
    if (ok) setToDelete(null);
  };

  /* Colonnes */
  const columns: Column<Social>[] = [
    {
      key: "icon",
      label: "Icône",
      width: "70px",
      align: "center",
      render: (_v, row) => (
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-hover border border-border">
          <BrandIcon name={row.icon} className="h-5 w-5 text-primary" />
        </div>
      ),
    },
    {
      key: "key",
      label: "Clé",
      sortable: true,
      render: (v) => (
        <code className="text-xs font-mono px-2 py-1 rounded bg-surface-hover border border-border">
          {v}
        </code>
      ),
    },
    {
      key: "url",
      label: "URL",
      render: (v) => (
        <a
          href={v}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-primary hover:underline text-sm truncate max-w-[240px]"
        >
          {v.replace(/^https?:\/\//, "").slice(0, 30)}
          <ExternalLink className="h-3 w-3 flex-shrink-0" />
        </a>
      ),
    },
    {
      key: "order",
      label: "Ordre",
      sortable: true,
      align: "center",
      width: "80px",
    },
    {
      key: "isActive",
      label: "Statut",
      align: "center",
      width: "100px",
      render: (v) =>
        v ? (
          <Badge variant="success">Actif</Badge>
        ) : (
          <Badge variant="default">Inactif</Badge>
        ),
    },
  ];

  /* Actions */
  const actions: RowAction<Social>[] = [
    {
      icon: Edit,
      label: "Modifier",
      onClick: handleEdit,
      className: "text-blue-400 hover:bg-blue-500/10",
    },
    {
      icon: Trash2,
      label: "Supprimer",
      onClick: (social) => setToDelete(social),
      className: "text-red-400 hover:bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Réseaux sociaux
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            Gérez vos profils sur les réseaux sociaux.
          </p>
        </div>

        <Button leftIcon={Plus} onClick={handleCreate}>
          Nouveau réseau
        </Button>
      </div>

      {/* Tableau */}
      <DataTable
        data={socials}
        columns={columns}
        loading={loading}
        config={{
          actions,
          rowKey: "id",
          searchable: true,
          searchPlaceholder: "Rechercher un réseau…",
          defaultPageSize: 10,
        }}
      />

      {/* Form */}
      <SocialForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editing}
        submitting={false}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Supprimer ce réseau ?"
        description={`Cette action supprimera définitivement "${toDelete?.key}". Elle est irréversible.`}
        confirmLabel="Supprimer"
      />
    </div>
  );
}