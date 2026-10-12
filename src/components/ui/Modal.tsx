"use client";

import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
  footer?: ReactNode;
}

const SIZES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
}: ModalProps) {
  /* Bloque le scroll + ferme avec Échap */
  useEffect(() => {
    if (!open) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm"
            aria-hidden
          />

          {/* Container */}
          <div className="fixed inset-0 z-[251] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className={cn(
                "relative w-full rounded-2xl bg-surface border border-border shadow-2xl pointer-events-auto overflow-hidden",
                SIZES[size],
              )}
              role="dialog"
              aria-modal="true"
            >
              {/* Header */}
              {(title || description) && (
                <div className="flex items-start justify-between gap-4 p-6 border-b border-border">
                  <div className="flex-1 min-w-0">
                    {title && (
                      <h2 className="text-lg font-bold text-foreground">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="mt-1 text-sm text-foreground-muted">
                        {description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    aria-label="Fermer"
                    className="flex-shrink-0 p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>

              {/* Footer */}
              {footer && (
                <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-background-alt/50">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}