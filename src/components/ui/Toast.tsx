"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";

/* =========================================================
   TYPES
   ========================================================= */

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration: number;
  createdAt: number;
}

interface ToastOptions {
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string, options?: ToastOptions) => string;
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  setPosition: (position: ToastPosition) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const MAX_TOASTS = 5;
const DEFAULT_DURATION = 4500;

/* =========================================================
   CONFIG PAR TYPE
   ========================================================= */

const TYPE_CONFIG: Record<
  ToastType,
  {
    icon: typeof CheckCircle2;
    /** Couleur d'accent (bordure, icône, barre de progression) */
    accent: string;
    /** Couleur de fond */
    bg: string;
    /** Couleur du titre */
    text: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    text: "text-emerald-300",
  },
  error: {
    icon: AlertCircle,
    accent: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    text: "text-red-300",
  },
  warning: {
    icon: AlertTriangle,
    accent: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    text: "text-amber-300",
  },
  info: {
    icon: Info,
    accent: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
    text: "text-blue-300",
  },
};

/* =========================================================
   PROVIDER
   ========================================================= */

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [position, setPosition] = useState<ToastPosition>("top-right");
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  /* Nettoie tous les timers au démontage */
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current.clear();
    setToasts([]);
  }, []);

  const toast = useCallback(
    (type: ToastType, message: string, options?: ToastOptions) => {
      const id = Math.random().toString(36).slice(2, 10);
      const duration = options?.duration ?? DEFAULT_DURATION;

      const item: ToastItem = {
        id,
        type,
        message,
        description: options?.description,
        duration,
        createdAt: Date.now(),
      };

      setToasts((prev) => {
        const next = [...prev, item];
        // Limite à MAX_TOASTS
        return next.length > MAX_TOASTS ? next.slice(-MAX_TOASTS) : next;
      });

      // Auto-dismiss
      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [dismiss],
  );

  const success = useCallback(
    (m: string, o?: ToastOptions) => toast("success", m, o),
    [toast],
  );
  const error = useCallback(
    (m: string, o?: ToastOptions) => toast("error", m, o),
    [toast],
  );
  const warning = useCallback(
    (m: string, o?: ToastOptions) => toast("warning", m, o),
    [toast],
  );
  const info = useCallback(
    (m: string, o?: ToastOptions) => toast("info", m, o),
    [toast],
  );

  /* Position CSS selon le choix */
  const positionClasses: Record<ToastPosition, string> = {
    "top-right": "top-4 right-4 items-end",
    "top-left": "top-4 left-4 items-start",
    "bottom-right": "bottom-4 right-4 items-end",
    "bottom-left": "bottom-4 left-4 items-start",
  };

  return (
    <ToastContext.Provider
      value={{
        toast,
        success,
        error,
        warning,
        info,
        dismiss,
        dismissAll,
        setPosition,
      }}
    >
      {children}

      {/* Container */}
      <div
        className={cn(
          "fixed z-[300] flex flex-col gap-3 w-full max-w-sm pointer-events-none",
          positionClasses[position],
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastCard key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/* =========================================================
   TOAST CARD
   ========================================================= */

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: () => void;
}) {
  const config = TYPE_CONFIG[item.type];
  const Icon = config.icon;

  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  const remainingRef = useRef(item.duration);
  const startRef = useRef(Date.now());

  /* Barre de progression */
  useEffect(() => {
    if (item.duration <= 0) return;

    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / item.duration) * 100);
      setProgress(pct);
      if (pct > 0 && !paused) {
        raf = requestAnimationFrame(tick);
      }
    };

    if (!paused) {
      startRef.current = Date.now();
      raf = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(raf);
  }, [paused, item.duration]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn(
        "relative pointer-events-auto w-full rounded-xl border backdrop-blur-md shadow-xl overflow-hidden",
        config.bg,
      )}
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.accent)} />

        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-semibold", config.text)}>
            {item.message}
          </p>
          {item.description && (
            <p className="mt-1 text-xs text-foreground-muted leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        <button
          onClick={onDismiss}
          aria-label="Fermer"
          className="flex-shrink-0 p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Barre de progression */}
      {item.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
          <div
            className={cn("h-full transition-none", config.accent.replace("text-", "bg-"))}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  );
}

/* =========================================================
   HOOK
   ========================================================= */

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast doit être utilisé dans <ToastProvider>");
  }
  return ctx;
}