"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Settings, ExternalLink } from "lucide-react";
import { useCrud } from "@/hooks/useCrud";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import DataTable from "@/components/ui/DataTable";
import Icon from "@/components/ui/Icon";
import type { Service } from "@/types";
import type { Column, RowAction } from "@/types/table.types";
import { cn } from "@/lib/cn";
import ServiceForm from "@/components/dashboard/services/ServiceForm";
import { Button } from "@/components/ui";
import { serviceService } from "@/services/services/service.service";

export default function ServicesPage() {
  const {
    items: services,
    loading,
    deleting,
    create,
    update,
    remove,
  } = useCrud(serviceService, {
    successCreate: "Service créé",
    successUpdate: "Service mis à jour",
    successDelete: "Service supprimé",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [toDelete, setToDelete] = useState<Service | null>(null);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (s: Service) => {
    setEditing(s);
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
  const columns: Column<Service>[] = [
    {
      key: "icon",
      label: "Icône",
      width: "70px",
      align: "center",
      render: (_v, row) => (
        <div
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white",
            row.accent,
          )}
        >
          <Icon name={row.icon} className="h-5 w-5" />
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
      key: "name",
      label: "Nom",
      render: (_v, row) => {
        const fr = row.translations.find((t) => t.locale === "fr");
        return <span className="font-semibold">{fr?.name ?? "—"}</span>;
      },
    },
    {
      key: "slug",
      label: "Slug",
      render: (v) => (
        <span className="text-sm text-foreground-muted font-mono">/{v}</span>
      ),
    },
    {
      key: "categories",
      label: "Catégories",
      align: "center",
      width: "100px",
      render: (_v, row) => (
        <Badge variant="primary">{row.categories.length}</Badge>
      ),
    },
    {
      key: "languages",
      label: "Langues",
      align: "center",
      width: "100px",
      render: (_v, row) => (
        <span className="text-xs text-foreground-muted">
          {row.translations.length} / 5
        </span>
      ),
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
  const actions: RowAction<Service>[] = [
    {
      icon: Settings,
      label: "Gérer les catégories",
      onClick: (service) => {
        window.location.href = `/dashboard/services/${service.id}`;
      },
      className: "text-purple-400 hover:bg-purple-500/10",
    },
    {
      icon: Edit,
      label: "Modifier",
      onClick: handleEdit,
      className: "text-blue-400 hover:bg-blue-500/10",
    },
    {
      icon: Trash2,
      label: "Supprimer",
      onClick: (service) => setToDelete(service),
      className: "text-red-400 hover:bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services</h1>
          <p className="text-sm text-foreground-muted mt-1">
            Gérez vos services et leurs catégories.
          </p>
        </div>

        <Button leftIcon={Plus} onClick={handleCreate}>
          Nouveau service
        </Button>
      </div>

      {/* Tableau */}
      <DataTable
        data={services}
        columns={columns}
        loading={loading}
        config={{
          actions,
          rowKey: "id",
          searchable: true,
          searchPlaceholder: "Rechercher un service…",
          defaultPageSize: 10,
        }}
      />

      {/* Form */}
      <ServiceForm
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
        title="Supprimer ce service ?"
        description={`Cette action supprimera définitivement "${toDelete?.key}" et toutes ses catégories. Elle est irréversible.`}
        confirmLabel="Supprimer"
      />
    </div>
  );
}