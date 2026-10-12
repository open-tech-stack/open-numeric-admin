"use client";

import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: "danger" | "primary";
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirmer l'action",
  description = "Cette action est irréversible.",
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  loading = false,
  variant = "danger",
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-full ${
            variant === "danger"
              ? "bg-red-500/15 text-red-400"
              : "bg-primary-soft text-primary"
          }`}
        >
          <AlertTriangle className="h-6 w-6" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-foreground mb-1">
            {title}
          </h3>
          <p className="text-sm text-foreground-muted leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Modal>
  );
}