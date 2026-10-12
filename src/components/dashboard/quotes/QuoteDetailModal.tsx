"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Building2, Clock, FileText, Trash2, Reply } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { QuoteRequest, SubmissionStatus } from "@/types";
import { cn } from "@/lib/cn";
import { SUBMISSION_STATUSES, STATUS_CONFIG } from "@/components/ui/StatusBadge";

interface QuoteDetailModalProps {
  open: boolean;
  quote: QuoteRequest | null;
  onClose: () => void;
  onStatusChange: (id: string, status: SubmissionStatus) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  updating?: boolean;
}

export default function QuoteDetailModal({
  open,
  quote,
  onClose,
  onStatusChange,
  onDelete,
  updating = false,
}: QuoteDetailModalProps) {
  const [status, setStatus] = useState<SubmissionStatus>("NEW");

  useEffect(() => {
    if (quote) setStatus(quote.status);
  }, [quote]);

  if (!quote) return null;

  const handleStatusChange = async (s: SubmissionStatus) => {
    setStatus(s);
    await onStatusChange(quote.id, s);
  };

  const rows = [
    { icon: Mail, label: "Email", value: quote.email, href: `mailto:${quote.email}` },
    quote.phone ? { icon: Phone, label: "Téléphone", value: quote.phone, href: `tel:${quote.phone}` } : null,
    quote.company ? { icon: Building2, label: "Entreprise", value: quote.company } : null,
    { icon: FileText, label: "Type de projet", value: quote.projectType },
    { icon: FileText, label: "Budget", value: quote.budget },
    { icon: FileText, label: "Délai", value: quote.timeline },
  ].filter(Boolean) as { icon: any; label: string; value: string; href?: string }[];

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={`Devis — ${quote.name}`}
      description={`Reçu le ${new Date(quote.createdAt).toLocaleString("fr-FR")}`}
      footer={
        <>
          <Button
            variant="ghost"
            leftIcon={Trash2}
            onClick={() => onDelete(quote.id)}
            disabled={updating}
            className="text-red-400 hover:bg-red-500/10 mr-auto"
          >
            Supprimer
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={updating}>
            Fermer
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Statut */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider mr-1">
            Statut :
          </span>
          {SUBMISSION_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              disabled={updating}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                status === s
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-surface border border-border text-foreground-muted hover:border-primary/40 hover:text-foreground",
              )}
            >
              {STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>

        {/* Infos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface-hover border border-border">
          {rows.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-foreground-subtle font-bold">
                    {r.label}
                  </p>
                  {r.href ? (
                    <a
                      href={r.href}
                      className="text-sm font-semibold text-primary hover:underline truncate block"
                    >
                      {r.value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-foreground truncate">
                      {r.value}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Description */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle mb-2">
            Description du projet
          </p>
          <div className="p-5 rounded-xl bg-background-alt border border-border">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {quote.description}
            </p>
          </div>
        </div>

        {/* Répondre */}
        <a
          href={`mailto:${quote.email}?subject=Re: votre demande de devis`}
          className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-semibold text-primary-foreground bg-gradient-to-r from-primary to-primary-hover shadow-lg hover:shadow-xl transition-all"
        >
          <Reply className="h-4 w-4" />
          Répondre par email
        </a>
      </div>
    </Modal>
  );
}