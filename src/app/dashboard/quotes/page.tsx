"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, Trash2, Clock } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import DataTable from "@/components/ui/DataTable";
import type { Column, RowAction } from "@/types/table.types";
import QuoteDetailModal from "@/components/dashboard/quotes/QuoteDetailModal";
import StatusBadge, { SUBMISSION_STATUSES, STATUS_CONFIG } from "@/components/ui/StatusBadge";
import { quoteService } from "@/services/quote/quote.service";
import { PaginatedResponse, QuoteRequest, SubmissionStatus } from "@/types";
import { ApiError } from "next/dist/server/api-utils";

export default function QuotesPage() {
  const toast = useToast();

  const [data, setData] = useState<PaginatedResponse<QuoteRequest> | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "">("");
  const [selected, setSelected] = useState<QuoteRequest | null>(null);
  const [toDelete, setToDelete] = useState<QuoteRequest | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await quoteService.list({
        page: 1,
        limit: 100,
        status: statusFilter || undefined,
      });
      setData(res);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erreur";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (id: string, status: SubmissionStatus) => {
    setUpdating(true);
    try {
      const updated = await quoteService.updateStatus(id, { status });
      setData((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((q) => (q.id === id ? updated : q)),
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

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    setUpdating(true);
    try {
      await quoteService.delete(toDelete.id);
      setData((prev) =>
        prev
          ? { ...prev, items: prev.items.filter((q) => q.id !== toDelete.id) }
          : prev,
      );
      toast.success("Devis supprimé");
      setToDelete(null);
      if (selected?.id === toDelete.id) setSelected(null);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erreur";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  const columns: Column<QuoteRequest>[] = [
    {
      key: "name",
      label: "Client",
      sortable: true,
      render: (_v, row) => (
        <div className="min-w-0">
          <p className="font-semibold text-foreground truncate">{row.name}</p>
          <p className="text-xs text-foreground-muted truncate">
            {row.company ?? row.email}
          </p>
        </div>
      ),
    },
    {
      key: "projectType",
      label: "Projet",
      render: (v) => (
        <span className="text-sm text-foreground">{v}</span>
      ),
    },
    {
      key: "budget",
      label: "Budget",
      width: "160px",
      render: (v) => (
        <span className="text-xs font-mono text-foreground-muted">{v}</span>
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

  const actions: RowAction<QuoteRequest>[] = [
    {
      icon: Eye,
      label: "Voir",
      onClick: (q) => setSelected(q),
      className: "text-blue-400 hover:bg-blue-500/10",
    },
    {
      icon: Trash2,
      label: "Supprimer",
      onClick: (q) => setToDelete(q),
      className: "text-red-400 hover:bg-red-500/10",
    },
  ];

  const counts = SUBMISSION_STATUSES.reduce((acc, s) => {
    acc[s] = data?.items.filter((q) => q.status === s).length ?? 0;
    return acc;
  }, {} as Record<SubmissionStatus, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Devis</h1>
        <p className="text-sm text-foreground-muted mt-1">
          Gérez les demandes de devis reçues via le formulaire public.
        </p>
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

      <DataTable
        data={data?.items ?? []}
        columns={columns}
        loading={loading}
        config={{
          actions,
          rowKey: "id",
          searchable: true,
          searchPlaceholder: "Rechercher un devis…",
          defaultPageSize: 10,
        }}
      />

      <QuoteDetailModal
        open={!!selected}
        quote={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
        onDelete={(id) => {
          setSelected(null);
          const q = data?.items.find((x) => x.id === id) ?? null;
          setToDelete(q);
        }}
        updating={updating}
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={updating}
        title="Supprimer ce devis ?"
        description={`Cette action supprimera définitivement le devis de "${toDelete?.name}". Elle est irréversible.`}
        confirmLabel="Supprimer"
      />
    </div>
  );
}