"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, Trash2, Mail, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import DataTable from "@/components/ui/DataTable";

import { ApiError } from "@/services/core/http.service";
import type { ContactSubmission, PaginatedResponse, SubmissionStatus } from "@/types";
import type { Column, RowAction } from "@/types/table.types";
import ContactDetailModal from "@/components/dashboard/contacts/ContactDetailModal";
import StatusBadge, { SUBMISSION_STATUSES, STATUS_CONFIG } from "@/components/ui/StatusBadge";
import { contactService } from "@/services/contact/contact.service";

export default function ContactsPage() {
  const toast = useToast();

  const [data, setData] = useState<PaginatedResponse<ContactSubmission> | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "">("");
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [toDelete, setToDelete] = useState<ContactSubmission | null>(null);

  /* Load */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await contactService.list({
        page: 1,
        limit: 100,
        status: statusFilter || undefined,
        search: search || undefined,
      });
      setData(res);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erreur de chargement";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, toast]);

  useEffect(() => {
    load();
  }, [load]);

  /* Change status */
  const handleStatusChange = async (id: string, status: SubmissionStatus) => {
    setUpdating(true);
    try {
      const updated = await contactService.updateStatus(id, { status });
      setData((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((c) => (c.id === id ? updated : c)),
            }
          : prev,
      );
      if (selected?.id === id) setSelected(updated);
      toast.success("Statut mis à jour");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erreur";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  /* Delete */
  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    setUpdating(true);
    try {
      await contactService.delete(toDelete.id);
      setData((prev) =>
        prev
          ? { ...prev, items: prev.items.filter((c) => c.id !== toDelete.id) }
          : prev,
      );
      toast.success("Message supprimé");
      setToDelete(null);
      if (selected?.id === toDelete.id) setSelected(null);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erreur";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  /* Colonnes — clés uniques */
  const columns: Column<ContactSubmission>[] = [
    {
      key: "name",
      label: "Expéditeur",
      sortable: true,
      render: (_v, row) => (
        <div className="min-w-0">
          <p className="font-semibold text-foreground truncate">{row.name}</p>
          <p className="text-xs text-foreground-muted truncate">{row.email}</p>
        </div>
      ),
    },
    {
      key: "subject",
      label: "Sujet",
      render: (v) => (
        <span className="text-sm text-foreground line-clamp-1">{v}</span>
      ),
    },
    {
      key: "status",
      label: "Statut",
      align: "center",
      width: "120px",
      render: (v) => <StatusBadge status={v} />,
    },
    {
      key: "createdAt",
      label: "Reçu le",
      sortable: true,
      width: "160px",
      render: (v) => (
        <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
          <Clock className="h-3 w-3" />
          {new Date(v).toLocaleString("fr-FR", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </div>
      ),
    },
  ];

  /* Actions */
  const actions: RowAction<ContactSubmission>[] = [
    {
      icon: Eye,
      label: "Voir",
      onClick: (c) => setSelected(c),
      className: "text-blue-400 hover:bg-blue-500/10",
    },
    {
      icon: Trash2,
      label: "Supprimer",
      onClick: (c) => setToDelete(c),
      className: "text-red-400 hover:bg-red-500/10",
    },
  ];

  const counts = SUBMISSION_STATUSES.reduce((acc, s) => {
    acc[s] = data?.items.filter((c) => c.status === s).length ?? 0;
    return acc;
  }, {} as Record<SubmissionStatus, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-sm text-foreground-muted mt-1">
            Gérez les messages reçus via le formulaire de contact.
          </p>
        </div>
      </div>

      {/* Compteurs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {SUBMISSION_STATUSES.map((s) => {
          const config = STATUS_CONFIG[s];
          const isActive = statusFilter === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(isActive ? "" : s)}
              className={`rounded-xl border p-3 text-left transition-all ${
                isActive
                  ? "border-primary bg-primary-soft shadow-md"
                  : "border-border bg-surface hover:border-primary/40 hover:bg-surface-hover"
              }`}
            >
              <p className="text-xs text-foreground-muted font-semibold">
                {config.label}
              </p>
              <p className="text-2xl font-black text-foreground mt-1">
                {counts[s]}
              </p>
            </button>
          );
        })}
      </div>

      {/* Tableau */}
      <DataTable
        data={data?.items ?? []}
        columns={columns}
        loading={loading}
        config={{
          actions,
          rowKey: "id",
          searchable: true,
          searchPlaceholder: "Rechercher un message…",
          defaultPageSize: 10,
        }}
      />

      {/* Detail modal */}
      <ContactDetailModal
        open={!!selected}
        contact={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
        onDelete={(id) => {
          setSelected(null);
          const c = data?.items.find((x) => x.id === id) ?? null;
          setToDelete(c);
        }}
        updating={updating}
      />

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={updating}
        title="Supprimer ce message ?"
        description={`Cette action supprimera définitivement le message de "${toDelete?.name}". Elle est irréversible.`}
        confirmLabel="Supprimer"
      />
    </div>
  );
}