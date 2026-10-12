"use client";

import { useState, useEffect } from "react";
import { Mail, User, Clock, Globe, Trash2, Reply } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ContactSubmission, SubmissionStatus } from "@/types";
import { SUBMISSION_STATUSES, STATUS_CONFIG } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";

interface ContactDetailModalProps {
  open: boolean;
  contact: ContactSubmission | null;
  onClose: () => void;
  onStatusChange: (id: string, status: SubmissionStatus) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  updating?: boolean;
}

export default function ContactDetailModal({
  open,
  contact,
  onClose,
  onStatusChange,
  onDelete,
  updating = false,
}: ContactDetailModalProps) {
  const [status, setStatus] = useState<SubmissionStatus>("NEW");

  useEffect(() => {
    if (contact) setStatus(contact.status);
  }, [contact]);

  if (!contact) return null;

  const handleStatusChange = async (newStatus: SubmissionStatus) => {
    setStatus(newStatus);
    await onStatusChange(contact.id, newStatus);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={contact.subject}
      description={`De ${contact.name}`}
      footer={
        <>
          <Button
            variant="ghost"
            leftIcon={Trash2}
            onClick={() => onDelete(contact.id)}
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
        {/* Statut actuel + actions rapides */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider mr-1">
            Statut :
          </span>
          {SUBMISSION_STATUSES.map((s) => {
            const config = STATUS_CONFIG[s];
            const isActive = status === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => handleStatusChange(s)}
                disabled={updating}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-surface border border-border text-foreground-muted hover:border-primary/40 hover:text-foreground",
                )}
              >
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Infos expéditeur */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface-hover border border-border">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-foreground-subtle font-bold">
                Nom
              </p>
              <p className="text-sm font-semibold text-foreground truncate">
                {contact.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Mail className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-foreground-subtle font-bold">
                Email
              </p>
              <a
                href={`mailto:${contact.email}`}
                className="text-sm font-semibold text-primary hover:underline truncate block"
              >
                {contact.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-foreground-subtle font-bold">
                Reçu le
              </p>
              <p className="text-sm text-foreground">
                {new Date(contact.createdAt).toLocaleString("fr-FR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>

          {contact.ip && (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-foreground-subtle font-bold">
                  IP
                </p>
                <p className="text-sm font-mono text-foreground-subtle">
                  {contact.ip}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Message */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle mb-2">
            Message
          </p>
          <div className="p-5 rounded-xl bg-background-alt border border-border">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {contact.message}
            </p>
          </div>
        </div>

        {/* CTA répondre */}
        <a
          href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject)}`}
          className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-semibold text-primary-foreground bg-gradient-to-r from-primary to-primary-hover shadow-lg hover:shadow-xl transition-all"
        >
          <Reply className="h-4 w-4" />
          Répondre par email
        </a>
      </div>
    </Modal>
  );
}