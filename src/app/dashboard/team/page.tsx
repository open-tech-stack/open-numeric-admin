"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useCrud } from "@/hooks/useCrud";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import DataTable from "@/components/ui/DataTable";
import type { TeamMember } from "@/types";
import type { Column, RowAction } from "@/types/table.types";
import TeamForm from "@/components/dashboard/teams/TeamForm";
import { teamService } from "@/services/team/team.service";

export default function TeamPage() {
  const {
    items: members,
    loading,
    deleting,
    create,
    update,
    remove,
  } = useCrud(teamService, {
    successCreate: "Membre créé",
    successUpdate: "Membre mis à jour",
    successDelete: "Membre supprimé",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [toDelete, setToDelete] = useState<TeamMember | null>(null);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditing(member);
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
  const columns: Column<TeamMember>[] = [
    {
      key: "image",
      label: "Photo",
      width: "70px",
      render: (_v, row) => (
        <div className="relative h-12 w-12 rounded-full overflow-hidden border border-border bg-surface-hover">
          <Image
            src={row.image}
            alt={row.key}
            fill
            className="object-cover"
            sizes="48px"
          />
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
      key: "role",
      label: "Rôle",
      render: (_v, row) => {
        const fr = row.translations.find((t) => t.locale === "fr");
        return (
          <span className="text-sm text-foreground-muted">
            {fr?.role ?? "—"}
          </span>
        );
      },
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
  const actions: RowAction<TeamMember>[] = [
    {
      icon: Edit,
      label: "Modifier",
      onClick: handleEdit,
      className: "text-blue-400 hover:bg-blue-500/10",
    },
    {
      icon: Trash2,
      label: "Supprimer",
      onClick: (member) => setToDelete(member),
      className: "text-red-400 hover:bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Équipe
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            Gérez les membres de votre équipe.
          </p>
        </div>

        <Button leftIcon={Plus} onClick={handleCreate}>
          Nouveau membre
        </Button>
      </div>

      {/* Tableau */}
      <DataTable
        data={members}
        columns={columns}
        loading={loading}
        config={{
          actions,
          rowKey: "id",
          searchable: true,
          searchPlaceholder: "Rechercher un membre…",
          defaultPageSize: 10,
        }}
      />

      {/* Form */}
      <TeamForm
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
        title="Supprimer ce membre ?"
        description={`Cette action supprimera définitivement "${toDelete?.key}". Elle est irréversible.`}
        confirmLabel="Supprimer"
      />
    </div>
  );
}