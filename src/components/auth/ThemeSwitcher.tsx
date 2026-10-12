"use client";

import { motion } from "framer-motion";
import { Palette, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme, ADMIN_THEMES, type AdminTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/cn";

interface ThemeSwitcherProps {
  /** Variante compacte (icône seule) */
  compact?: boolean;
}

export default function ThemeSwitcher({ compact = false }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const current = ADMIN_THEMES.find((t) => t.value === theme);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Changer le thème"
        className={cn(
          "flex items-center gap-2 rounded-lg transition-colors",
          "text-foreground-muted hover:text-foreground hover:bg-surface-hover",
          compact ? "h-10 w-10 justify-center" : "px-3 py-2 text-sm font-medium",
        )}
      >
        <Palette className="h-4 w-4" />
        {!compact && <span>{current?.label}</span>}
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface shadow-2xl p-2 z-50"
        >
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">
            Thème
          </p>
          {ADMIN_THEMES.map((t) => {
            const isActive = theme === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => {
                  setTheme(t.value as AdminTheme);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-foreground-muted hover:bg-surface-hover hover:text-foreground",
                )}
              >
                <span
                  className="h-5 w-5 rounded-md border border-border flex-shrink-0"
                  style={{ background: t.preview }}
                />
                <span className="flex-1 text-left font-medium">{t.label}</span>
                {isActive && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}