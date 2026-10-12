"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useCrud } from "@/hooks/useCrud";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import DataTable from "@/components/ui/DataTable";
import type { Client } from "@/types";
import type { Column, RowAction } from "@/types/table.types";
import { clientService } from "@/services/client/client.service";
import ClientForm from "@/components/dashboard/clients/ClientForm";

export default function ClientsPage() {
  const {
    items: clients,
    loading,
    deleting,
    load,
    create,
    update,
    remove,
  } = useCrud(clientService, {
    successCreate: "Client créé avec succès",
    successUpdate: "Client mis à jour",
    successDelete: "Client supprimé",
  });

  /* État UI */
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [toDelete, setToDelete] = useState<Client | null>(null);

  /* Ouvrir le form (création) */
  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  /* Ouvrir le form (édition) */
  const handleEdit = (client: Client) => {
    setEditing(client);
    setFormOpen(true);
  };

  /* Soumettre le form */
  const handleSubmit = async (data: {
    name: string;
    logo: string;
    url?: string;
    order?: number;
    isActive?: boolean;
  }) => {
    if (editing) {
      const res = await update(editing.id, data);
      if (res) setFormOpen(false);
    } else {
      const res = await create(data);
      if (res) setFormOpen(false);
    }
  };

  /* Confirmer la suppression */
  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    const ok = await remove(toDelete.id);
    if (ok) setToDelete(null);
  };

  /* Colonnes du tableau */
  const columns: Column<Client>[] = [
    {
      key: "logo",
      label: "Logo",
      width: "80px",
      render: (_v, row) => (
        <div className="relative h-10 w-10 rounded-lg bg-surface-hover border border-border overflow-hidden">
          <Image
            src={row.logo}
            alt={row.name}
            fill
            className="object-contain p-1"
            sizes="40px"
          />
        </div>
      ),
    },
    {
      key: "name",
      label: "Nom",
      sortable: true,
      render: (v) => <span className="font-semibold">{v}</span>,
    },
    {
      key: "url",
      label: "Site web",
      render: (v) =>
        v ? (
          <a
            href={v}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-primary hover:underline text-sm"
          >
            {v.replace(/^https?:\/\//, "").slice(0, 30)}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-foreground-subtle">—</span>
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

  /* Actions par ligne */
  const actions: RowAction<Client>[] = [
    {
      icon: Edit,
      label: "Modifier",
      onClick: handleEdit,
      className: "text-blue-400 hover:bg-blue-500/10",
    },
    {
      icon: Trash2,
      label: "Supprimer",
      onClick: (client) => setToDelete(client),
      className: "text-red-400 hover:bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header de page */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Clients
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            Gérez les logos des entreprises partenaires.
          </p>
        </div>

        <Button leftIcon={Plus} onClick={handleCreate}>
          Nouveau client
        </Button>
      </div>

      {/* Tableau */}
      <DataTable
        data={clients}
        columns={columns}
        loading={loading}
        config={{
          actions,
          rowKey: "id",
          searchable: true,
          searchPlaceholder: "Rechercher un client…",
          defaultPageSize: 10,
        }}
      />

      {/* Form Modal */}
      <ClientForm
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
        title="Supprimer ce client ?"
        description={`Cette action supprimera définitivement "${toDelete?.name}". Elle est irréversible.`}
        confirmLabel="Supprimer"
      />
    </div>
  );
}