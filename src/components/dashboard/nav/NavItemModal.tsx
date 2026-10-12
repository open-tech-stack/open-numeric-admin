"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import {
  SUPPORTED_LOCALES,
  type Locale,
  type NavItem,
  type NavTranslationInput,
  type CreateNavItemInput,
  type UpdateNavItemInput,
} from "@/types";

/* ============================================================
   Props
   ============================================================ */

interface NavItemModalProps {
  open: boolean;
  /** null = création, sinon édition */
  item: NavItem | null;
  /** Item parent par défaut (pour "Ajouter un enfant") */
  defaultParent: NavItem | null;
  /** Liste complète (pour le select parent) */
  flat: NavItem[];
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateNavItemInput | UpdateNavItemInput,
    isEdit: boolean,
    id?: string,
  ) => void | Promise<void>;
}

/* ============================================================
   Helpers
   ============================================================ */

const DEFAULT_LOCALES: Locale[] = ["fr", "en"];

function emptyTranslations(): NavTranslationInput[] {
  return DEFAULT_LOCALES.map((locale) => ({ locale, label: "" }));
}

function hasTranslation(
  arr: NavTranslationInput[],
  locale: Locale,
): boolean {
  return arr.some((t) => t.locale === locale);
}

function getLabel(
  arr: NavTranslationInput[],
  locale: Locale,
): string {
  return arr.find((t) => t.locale === locale)?.label ?? "";
}

/* ============================================================
   Composant
   ============================================================ */

export function NavItemModal({
  open,
  item,
  defaultParent,
  flat,
  submitting,
  onClose,
  onSubmit,
}: NavItemModalProps) {
  const isEdit = !!item;

  const [key, setKey] = useState("");
  const [href, setHref] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState<number>(0);
  const [translations, setTranslations] = useState<NavTranslationInput[]>(
    emptyTranslations(),
  );

  /* Sync à l'ouverture */
  useEffect(() => {
    if (!open) return;
    if (item) {
      setKey(item.key);
      setHref(item.href);
      setParentId(item.parentId);
      setIsActive(item.isActive);
      setOrder(item.order);
      setTranslations(
        item.translations.length
          ? item.translations.map((t) => ({ locale: t.locale, label: t.label }))
          : emptyTranslations(),
      );
    } else {
      setKey("");
      setHref("");
      setParentId(defaultParent?.id ?? null);
      setIsActive(true);
      setOrder(0);
      setTranslations(emptyTranslations());
    }
  }, [open, item, defaultParent]);

  /* Empêche de se choisir soi-même comme parent */
  const parentOptions = flat.filter((it) => it.id !== item?.id);

  /* ---------------- Traductions ---------------- */

  const updateTranslation = (locale: Locale, label: string) => {
    setTranslations((prev) => {
      const idx = prev.findIndex((t) => t.locale === locale);
      if (idx === -1) return [...prev, { locale, label }];
      const copy = [...prev];
      copy[idx] = { locale, label };
      return copy;
    });
  };

  const addLocale = (locale: Locale) => {
    setTranslations((prev) =>
      hasTranslation(prev, locale) ? prev : [...prev, { locale, label: "" }],
    );
  };

  const removeLocale = (locale: Locale) => {
    setTranslations((prev) => prev.filter((t) => t.locale !== locale));
  };

  /* ---------------- Submit ---------------- */

  const canSubmit =
    (isEdit || key.trim().length >= 2) &&
    href.trim().length > 0 &&
    translations.some((t) => t.label.trim().length > 0);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const cleanedTranslations = translations
      .filter((t) => t.label.trim().length > 0)
      .map((t) => ({ locale: t.locale, label: t.label.trim() }));

    if (isEdit) {
      const payload: UpdateNavItemInput = {
        href: href.trim(),
        parentId,
        isActive,
        order,
        translations: cleanedTranslations,
      };
      await onSubmit(payload, true, item!.id);
    } else {
      const payload: CreateNavItemInput = {
        key: key.trim(),
        href: href.trim(),
        parentId,
        isActive,
        order,
        translations: cleanedTranslations,
      };
      await onSubmit(payload, false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={isEdit ? "Modifier l'élément" : "Nouvel élément"}
      description={
        isEdit
          ? `Clé : ${item?.key}`
          : "Ajoutez un lien à la navigation du site."
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={submitting}
            disabled={!canSubmit || submitting}
          >
            {isEdit ? "Enregistrer" : "Créer"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Infos de base */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Clé (slug)"
            name="key"
            placeholder="services"
            value={key}
            onChange={(e) => setKey(e.target.value.toLowerCase())}
            disabled={isEdit}
            hint={
              isEdit
                ? "La clé ne peut pas être modifiée."
                : "Minuscules, chiffres et tirets uniquement."
            }
            pattern="^[a-z0-9-]+$"
          />
          <Input
            label="Lien (href)"
            name="href"
            placeholder="/services"
            value={href}
            onChange={(e) => setHref(e.target.value)}
          />
        </div>

        {/* Parent + ordre */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Parent"
            name="parentId"
            value={parentId ?? ""}
            onChange={(e) =>
              setParentId(e.target.value === "" ? null : e.target.value)
            }
          >
            <option value="">— Racine —</option>
            {parentOptions.map((it) => (
              <option key={it.id} value={it.id}>
                {it.translations[0]?.label ?? it.key}
              </option>
            ))}
          </Select>

          <Input
            label="Ordre"
            name="order"
            type="number"
            min={0}
            value={order}
            onChange={(e) => setOrder(Number(e.target.value) || 0)}
            hint="Utilisé pour le tri à ce niveau."
          />
        </div>

        {/* Actif */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-surface-hover border border-border">
          <div>
            <p className="text-sm font-semibold text-foreground">Actif</p>
            <p className="text-xs text-foreground-muted">
              Visible sur le site public.
            </p>
          </div>
          <Toggle
            checked={isActive}
            onChange={setIsActive}
            aria-label="Activer l'élément"
          />
        </div>

        {/* Traductions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
              Traductions
            </p>
            <div className="flex items-center gap-1">
              {SUPPORTED_LOCALES.filter(
                (l) => !hasTranslation(translations, l.value),
              ).map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => addLocale(l.value)}
                  className="text-xs px-2 py-1 rounded-md border border-border text-foreground-muted hover:border-primary/40 hover:text-primary transition-colors"
                >
                  + {l.flag} {l.value.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {translations.map((t) => {
              const meta = SUPPORTED_LOCALES.find(
                (l) => l.value === t.locale,
              );
              return (
                <div
                  key={t.locale}
                  className="flex items-center gap-2 p-2 rounded-lg border border-border bg-surface"
                >
                  <Badge variant="default" className="shrink-0 font-mono">
                    {meta?.flag} {t.locale.toUpperCase()}
                  </Badge>
                  <Input
                    className="flex-1"
                    placeholder={`Libellé (${t.locale})`}
                    value={t.label}
                    onChange={(e) => updateTranslation(t.locale, e.target.value)}
                  />
                  {translations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLocale(t.locale)}
                      className="shrink-0 p-1.5 rounded-lg text-foreground-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Retirer cette langue"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}