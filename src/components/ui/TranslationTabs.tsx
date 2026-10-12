"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SUPPORTED_LOCALES, type Locale } from "@/types";
import { cn } from "@/lib/cn";

/* =========================================================
   TYPES
   ========================================================= */

export interface TranslationTabsRenderProps<T> {
  locale: Locale;
  value: T;
  onChange: (value: T) => void;
}

interface TranslationTabsProps<T> {
  /** Objet contenant les traductions par locale */
  translations: Record<Locale, T>;
  /** Callback quand une traduction change */
  onChange: (translations: Record<Locale, T>) => void;
  /** Fonction de rendu des champs pour une locale */
  render: (props: TranslationTabsRenderProps<T>) => ReactNode;
}

/* =========================================================
   COMPOSANT
   ========================================================= */

export default function TranslationTabs<T extends Record<string, any>>({
  translations,
  onChange,
  render,
}: TranslationTabsProps<T>) {
  const [activeLocale, setActiveLocale] = useState<Locale>("fr");

  const updateLocale = (value: T) => {
    onChange({ ...translations, [activeLocale]: value });
  };

  /** Vérifie si une locale a du contenu rempli */
  const isFilled = (locale: Locale): boolean => {
    const t = translations[locale];
    return Object.values(t).some(
      (v) => typeof v === "string" && v.trim() !== "",
    );
  };

  const filledCount = SUPPORTED_LOCALES.filter((l) => isFilled(l.value)).length;

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-semibold text-foreground">
            Traductions
          </label>
          <p className="text-xs text-foreground-subtle mt-0.5">
            {filledCount} / {SUPPORTED_LOCALES.length} langue(s) remplie(s)
          </p>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-surface border border-border">
        {SUPPORTED_LOCALES.map((loc) => {
          const isActive = activeLocale === loc.value;
          const filled = isFilled(loc.value);
          return (
            <button
              key={loc.value}
              type="button"
              onClick={() => setActiveLocale(loc.value)}
              className={cn(
                "relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "text-primary-foreground shadow-md"
                  : "text-foreground-muted hover:text-foreground hover:bg-surface-hover",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="translation-tab"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary to-primary-hover"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 text-base leading-none">
                {loc.flag}
              </span>
              <span className="relative z-10 hidden sm:inline">
                {loc.label}
              </span>
              <span className="relative z-10 text-xs uppercase">
                {loc.value}
              </span>
              {filled && !isActive && (
                <Check className="relative z-10 h-3 w-3 text-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Contenu de la langue active */}
      <motion.div
        key={activeLocale}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl border border-border bg-background-alt/30 p-4"
      >
        {render({
          locale: activeLocale,
          value: translations[activeLocale],
          onChange: updateLocale,
        })}
      </motion.div>
    </div>
  );
}