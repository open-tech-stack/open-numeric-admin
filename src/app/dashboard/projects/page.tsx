"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { useCrud } from "@/hooks/useCrud";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import DataTable from "@/components/ui/DataTable";
import type { Project, ProjectCreateInput } from "@/types";
import type { Column, RowAction } from "@/types/table.types";
import ProjectForm from "@/components/dashboard/projects/ProjectForm";
import { projectService } from "@/services/projects/project.service";

const STATUS_BADGE: Record<
  string,
  "success" | "primary" | "warning" | "default"
> = {
  COMPLETED: "success",
  IN_PROGRESS: "primary",
  PLANNED: "warning",
  ARCHIVED: "default",
};

export default function ProjectsPage() {
  const {
    items: projects,
    loading,
    deleting,
    create,
    update,
    remove,
  } = useCrud(projectService, {
    successCreate: "Projet créé",
    successUpdate: "Projet mis à jour",
    successDelete: "Projet supprimé",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [toDelete, setToDelete] = useState<Project | null>(null);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (p: Project) => {
    setEditing(p);
    setFormOpen(true);
  };

  const handleSubmit = async (data: ProjectCreateInput) => {
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
  const columns: Column<Project>[] = [
    {
      key: "cover",
      label: "Cover",
      width: "80px",
      render: (_v, row) => (
        <div className="relative h-12 w-20 rounded-lg overflow-hidden border border-border bg-surface-hover">
          <Image
            src={row.cover}
            alt={row.slug}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      ),
    },
    {
      key: "title",
      label: "Titre",
      render: (_v, row) => {
        const fr = row.translations.find((t) => t.locale === "fr");
        return (
          <div className="min-w-0">
            <p className="font-semibold truncate">{fr?.title ?? "—"}</p>
            <p className="text-[11px] text-foreground-subtle font-mono truncate">
              /{row.slug}
            </p>
          </div>
        );
      },
    },
    {
      key: "category",
      label: "Catégorie",
      sortable: true,
      width: "120px",
      render: (v) => (
        <Badge variant="primary">{String(v).toLowerCase()}</Badge>
      ),
    },
    {
      key: "status",
      label: "Statut",
      align: "center",
      width: "120px",
      render: (v) => (
        <Badge variant={STATUS_BADGE[v as string] ?? "default"}>
          {String(v).toLowerCase()}
        </Badge>
      ),
    },
    {
      key: "year",
      label: "Année",
      sortable: true,
      align: "center",
      width: "80px",
    },
    {
      key: "featured",
      label: "★",
      align: "center",
      width: "50px",
      render: (v) =>
        v ? (
          <Star className="h-4 w-4 fill-amber-400 text-amber-400 mx-auto" />
        ) : (
          <span className="text-foreground-subtle">—</span>
        ),
    },
    {
      key: "isActive",
      label: "Actif",
      align: "center",
      width: "80px",
      render: (v) =>
        v ? (
          <Badge variant="success">Actif</Badge>
        ) : (
          <Badge variant="default">Inactif</Badge>
        ),
    },
  ];

  /* Actions */
  const actions: RowAction<Project>[] = [
    {
      icon: Edit,
      label: "Modifier",
      onClick: handleEdit,
      className: "text-blue-400 hover:bg-blue-500/10",
    },
    {
      icon: Trash2,
      label: "Supprimer",
      onClick: (p) => setToDelete(p),
      className: "text-red-400 hover:bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projets</h1>
          <p className="text-sm text-foreground-muted mt-1">
            Gérez votre portfolio de réalisations.
          </p>
        </div>

        <Button leftIcon={Plus} onClick={handleCreate}>
          Nouveau projet
        </Button>
      </div>

      {/* Tableau */}
      <DataTable
        data={projects}
        columns={columns}
        loading={loading}
        config={{
          actions,
          rowKey: "id",
          searchable: true,
          searchPlaceholder: "Rechercher un projet…",
          defaultPageSize: 10,
        }}
      />

      {/* Form */}
      <ProjectForm
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
        title="Supprimer ce projet ?"
        description={`Cette action supprimera définitivement "${toDelete?.slug}". Elle est irréversible.`}
        confirmLabel="Supprimer"
      />
    </div>
  );
}