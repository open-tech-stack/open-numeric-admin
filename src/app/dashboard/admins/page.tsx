"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Shield, ShieldAlert } from "lucide-react";
import { useCrud } from "@/hooks/useCrud";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import DataTable from "@/components/ui/DataTable";
import type {
  Admin,
  AdminCreateInput,
  AdminUpdateInput,
} from "@/types";
import type { Column, RowAction } from "@/types/table.types";
import { cn } from "@/lib/cn";
import AdminForm from "@/components/dashboard/admins/AdminForm";
import { adminService } from "@/services/admin/admin.service";

export default function AdminsPage() {
  const { user: currentUser } = useAuth();

  const {
    items: admins,
    loading,
    deleting,
    create,
    update,
    remove,
  } = useCrud(adminService, {
    successCreate: "Administrateur créé",
    successUpdate: "Administrateur mis à jour",
    successDelete: "Administrateur supprimé",
    errorMessage: "Action impossible",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Admin | null>(null);
  const [toDelete, setToDelete] = useState<Admin | null>(null);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (admin: Admin) => {
    setEditing(admin);
    setFormOpen(true);
  };

  const handleSubmit = async (data: AdminCreateInput | AdminUpdateInput) => {
    if (editing) {
      const res = await update(editing.id, data as AdminUpdateInput);
      if (res) setFormOpen(false);
    } else {
      const res = await create(data as AdminCreateInput);
      if (res) setFormOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    const ok = await remove(toDelete.id);
    if (ok) setToDelete(null);
  };

  /* Colonnes */
  const columns: Column<Admin>[] = [
    {
      key: "avatar",
      label: "",
      width: "60px",
      render: (_v, row) => (
        <div
          className={cn(
            "inline-flex h-10 w-10 rounded-full items-center justify-center font-bold text-sm",
            row.role === "ADMIN"
              ? "bg-primary/20 text-primary"
              : "bg-surface-hover text-foreground-muted",
          )}
          aria-hidden="true"
        >
          {row.displayName.charAt(0).toUpperCase()}
        </div>
      ),
    },
    {
      key: "displayName",
      label: "Nom",
      sortable: true,
      render: (v, row) => (
        <div>
          <p className="font-semibold text-foreground">{v}</p>
          <p className="text-xs text-foreground-muted">@{row.username}</p>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (v) =>
        v ? (
          <a
            href={`mailto:${v}`}
            className="text-sm text-primary hover:underline"
          >
            {v}
          </a>
        ) : (
          <span className="text-foreground-subtle">—</span>
        ),
    },
    {
      key: "role",
      label: "Rôle",
      align: "center",
      width: "130px",
      render: (v) =>
        v === "ADMIN" ? (
          <Badge variant="primary">
            <ShieldAlert className="h-3 w-3" aria-hidden="true" />
            Admin
          </Badge>
        ) : (
          <Badge variant="info">
            <Shield className="h-3 w-3" aria-hidden="true" />
            Éditeur
          </Badge>
        ),
    },
    {
      key: "lastLoginAt",
      label: "Dernière connexion",
      width: "180px",
      render: (v) =>
        v ? (
          <span className="text-xs text-foreground-muted">
            {new Date(v).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        ) : (
          <span className="text-xs text-foreground-subtle">Jamais</span>
        ),
    },
  ];

  /* Actions — masque le delete sur son propre compte */
  const actions: RowAction<Admin>[] = [
    {
      icon: Edit,
      label: "Modifier",
      onClick: handleEdit,
      className: "text-blue-400 hover:bg-blue-500/10",
    },
    {
      icon: Trash2,
      label: "Supprimer",
      onClick: (admin) => setToDelete(admin),
      className: "text-red-400 hover:bg-red-500/10",
      hidden: (admin) => admin.id === currentUser?.id,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Administrateurs
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            Gérez les comptes ayant accès au dashboard.
          </p>
        </div>

        <Button leftIcon={Plus} onClick={handleCreate}>
          Nouvel admin
        </Button>
      </header>

      <DataTable
        data={admins}
        columns={columns}
        loading={loading}
        config={{
          actions,
          rowKey: "id",
          searchable: true,
          searchPlaceholder: "Rechercher un administrateur…",
          defaultPageSize: 10,
        }}
      />

      <AdminForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editing}
        submitting={false}
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Supprimer cet administrateur ?"
        description={`Cette action supprimera définitivement le compte "${toDelete?.username}". Elle est irréversible.`}
        confirmLabel="Supprimer"
      />
    </div>
  );
}