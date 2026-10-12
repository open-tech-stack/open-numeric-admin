"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Icon from "@/components/ui/Icon";
import type { Locale, Service, ServiceTranslation } from "@/types";
import { SUPPORTED_LOCALES } from "@/types";
import { cn } from "@/lib/cn";
import TranslationTabs from "@/components/ui/TranslationTabs";

/* =========================================================
   ICÔNES DISPONIBLES (toutes présentes dans Icon.tsx)
   ========================================================= */

const ICON_OPTIONS = [
  { value: "Code2", label: "Code" },
  { value: "PenTool", label: "Design" },
  { value: "GraduationCap", label: "Formation" },
  { value: "Wrench", label: "Maintenance" },
  { value: "ShoppingBag", label: "Boutique" },
  { value: "Globe", label: "Web" },
  { value: "Smartphone", label: "Mobile" },
  { value: "Server", label: "Backend" },
  { value: "Palette", label: "Couleurs" },
  { value: "Sparkles", label: "IA" },
];

/* =========================================================
   ACCENTS (dégradés Tailwind statiques)
   ========================================================= */

const ACCENT_OPTIONS = [
  { value: "from-blue-500 to-cyan-500", label: "Bleu / Cyan" },
  { value: "from-pink-500 to-purple-500", label: "Rose / Violet" },
  { value: "from-emerald-500 to-teal-500", label: "Émeraude" },
  { value: "from-amber-500 to-orange-500", label: "Ambre / Orange" },
  { value: "from-red-500 to-amber-500", label: "Rouge / Ambre" },
  { value: "from-violet-500 to-purple-500", label: "Violet" },
  { value: "from-cyan-500 to-blue-500", label: "Cyan / Bleu" },
  { value: "from-orange-500 to-red-500", label: "Orange / Rouge" },
];

/* =========================================================
   TYPES
   ========================================================= */

type TranslationsMap = Record<Locale, Omit<ServiceTranslation, "locale">>;

const EMPTY_TRANSLATION = {
  name: "",
  heroTitle: "",
  heroTitleHighlight: "",
  heroSubtitle: "",
};

const DEFAULT_TRANSLATIONS: TranslationsMap = SUPPORTED_LOCALES.reduce(
  (acc, loc) => ({ ...acc, [loc.value]: { ...EMPTY_TRANSLATION } }),
  {} as TranslationsMap,
);

interface ServiceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void | Promise<void>;
  initialData?: Service | null;
  submitting?: boolean;
}

interface FormValues {
  key: string;
  slug: string;
  href: string;
  icon: string;
  accent: string;
  order: number;
  isActive: boolean;
  translations: TranslationsMap;
}

const DEFAULT_VALUES: FormValues = {
  key: "",
  slug: "",
  href: "",
  icon: "Code2",
  accent: "from-blue-500 to-cyan-500",
  order: 0,
  isActive: true,
  translations: DEFAULT_TRANSLATIONS,
};

/* =========================================================
   COMPOSANT
   ========================================================= */

export default function ServiceForm({
  open,
  onClose,
  onSubmit,
  initialData,
  submitting = false,
}: ServiceFormProps) {
  const [values, setValues] = useState<FormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = Boolean(initialData);

  /* Init */
  useEffect(() => {
    if (!open) return;

    if (initialData) {
      const transMap = SUPPORTED_LOCALES.reduce((acc, loc) => {
        const tr = initialData.translations.find((t) => t.locale === loc.value);
        acc[loc.value] = tr
          ? {
              name: tr.name,
              heroTitle: tr.heroTitle ?? "",
              heroTitleHighlight: tr.heroTitleHighlight ?? "",
              heroSubtitle: tr.heroSubtitle ?? "",
            }
          : { ...EMPTY_TRANSLATION };
        return acc;
      }, {} as TranslationsMap);

      setValues({
        key: initialData.key,
        slug: initialData.slug,
        href: initialData.href,
        icon: initialData.icon,
        accent: initialData.accent,
        order: initialData.order,
        isActive: initialData.isActive,
        translations: transMap,
      });
    } else {
      setValues({
        ...DEFAULT_VALUES,
        translations: { ...DEFAULT_TRANSLATIONS },
      });
    }
    setErrors({});
  }, [open, initialData]);

  /* Auto-remplit href depuis slug */
  useEffect(() => {
    if (!isEdit && values.slug && !values.href) {
      setValues((v) => ({ ...v, href: `/services/${v.slug}` }));
    }
  }, [values.slug, values.href, isEdit]);

  /* Validation */
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!isEdit && !values.key.trim()) {
      errs.key = "La clé est requise.";
    } else if (!isEdit && !/^[a-z0-9-]+$/.test(values.key.trim())) {
      errs.key = "Minuscules, chiffres et tirets uniquement.";
    }

    if (!values.slug.trim()) {
      errs.slug = "Le slug est requis.";
    } else if (!/^[a-z0-9-]+$/.test(values.slug.trim())) {
      errs.slug = "Minuscules, chiffres et tirets uniquement.";
    }

    if (!values.href.trim()) errs.href = "L'URL est requise.";

    const fr = values.translations.fr;
    if (!fr.name.trim()) errs.fr_name = "Le nom (FR) est requis.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* Submit */
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    const translations: ServiceTranslation[] = SUPPORTED_LOCALES
      .map((loc) => {
        const t = values.translations[loc.value];
        return {
          locale: loc.value,
          name: t.name.trim(),
          heroTitle: t.heroTitle?.trim() || null,
          heroTitleHighlight: t.heroTitleHighlight?.trim() || null,
          heroSubtitle: t.heroSubtitle?.trim() || null,
        };
      })
      .filter((t) => t.name);

    const payload: any = {
      slug: values.slug.trim(),
      href: values.href.trim(),
      icon: values.icon,
      accent: values.accent,
      order: values.order,
      isActive: values.isActive,
      translations,
    };

    if (!isEdit) payload.key = values.key.trim();

    await onSubmit(payload);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title={isEdit ? "Modifier un service" : "Nouveau service"}
      description={
        isEdit
          ? `Modifiez les informations de ${initialData?.key}.`
          : "Ajoutez un nouveau service à votre offre."
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Annuler
          </Button>
          <Button
            variant="primary"
            leftIcon={Save}
            onClick={() => handleSubmit()}
            loading={submitting}
          >
            {isEdit ? "Enregistrer" : "Créer"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Clé + Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Clé unique"
            placeholder="development"
            hint="Identifiant technique (minuscules, chiffres, tirets)."
            value={values.key}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                key: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
              }))
            }
            error={errors.key}
            required
            disabled={isEdit || submitting}
            autoFocus={!isEdit}
          />

          <Input
            label="Slug"
            placeholder="developpement"
            hint="Utilisé dans l'URL (ex: /services/developpement)."
            value={values.slug}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
              }))
            }
            error={errors.slug}
            required
            disabled={submitting}
          />
        </div>

        {/* Href */}
        <Input
          label="URL (href)"
          placeholder="/services/developpement"
          hint="Auto-rempli depuis le slug."
          value={values.href}
          onChange={(e) =>
            setValues((v) => ({ ...v, href: e.target.value }))
          }
          error={errors.href}
          required
          disabled={submitting}
        />

        {/* Icône */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-foreground">
            Icône
          </label>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {ICON_OPTIONS.map((opt) => {
              const isSelected = values.icon === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValues((v) => ({ ...v, icon: opt.value }))}
                  disabled={submitting}
                  title={opt.label}
                  className={cn(
                    "flex items-center justify-center p-3 rounded-xl border transition-all",
                    isSelected
                      ? "border-primary bg-primary-soft shadow-md"
                      : "border-border bg-surface hover:border-primary/40 hover:bg-surface-hover",
                  )}
                >
                  <Icon
                    name={opt.value}
                    className={cn(
                      "h-5 w-5",
                      isSelected ? "text-primary" : "text-foreground-muted",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-foreground">
            Couleur d'accent
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ACCENT_OPTIONS.map((opt) => {
              const isSelected = values.accent === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValues((v) => ({ ...v, accent: opt.value }))}
                  disabled={submitting}
                  className={cn(
                    "flex items-center gap-2 p-2.5 rounded-xl border transition-all",
                    isSelected
                      ? "border-primary bg-primary-soft"
                      : "border-border bg-surface hover:bg-surface-hover",
                  )}
                >
                  <span
                    className={cn(
                      "h-6 w-6 rounded-md bg-gradient-to-br flex-shrink-0",
                      opt.value,
                    )}
                  />
                  <span className="text-xs font-medium truncate">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ordre + Statut */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Ordre d'affichage"
            type="number"
            min={0}
            value={values.order}
            onChange={(e) =>
              setValues((v) => ({ ...v, order: Number(e.target.value) || 0 }))
            }
            disabled={submitting}
          />

          <div>
            <label className="block mb-2 text-sm font-semibold text-foreground">
              Statut
            </label>
            <button
              type="button"
              onClick={() =>
                setValues((v) => ({ ...v, isActive: !v.isActive }))
              }
              disabled={submitting}
              className={cn(
                "w-full h-11 rounded-xl border transition-colors",
                values.isActive
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  : "bg-surface border-border text-foreground-muted",
              )}
            >
              {values.isActive ? "Actif" : "Inactif"}
            </button>
          </div>
        </div>

        {/* Traductions */}
        <TranslationTabs
          translations={values.translations}
          onChange={(translations) =>
            setValues((v) => ({ ...v, translations }))
          }
          render={({ locale, value, onChange }) => (
            <div className="space-y-4">
              <Input
                label="Nom du service"
                placeholder="Développement"
                value={value.name}
                onChange={(e) => onChange({ ...value, name: e.target.value })}
                error={errors[`${locale}_name`]}
                required={locale === "fr"}
                disabled={submitting}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Hero — Titre"
                  placeholder="Développement"
                  value={value.heroTitle ?? ""}
                  onChange={(e) =>
                    onChange({ ...value, heroTitle: e.target.value })
                  }
                  disabled={submitting}
                />
                <Input
                  label="Hero — Titre (highlight)"
                  placeholder="Logiciel"
                  value={value.heroTitleHighlight ?? ""}
                  onChange={(e) =>
                    onChange({ ...value, heroTitleHighlight: e.target.value })
                  }
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-foreground">
                  Hero — Sous-titre
                </label>
                <textarea
                  rows={3}
                  placeholder="Des solutions technologiques sur mesure…"
                  value={value.heroSubtitle ?? ""}
                  onChange={(e) =>
                    onChange({ ...value, heroSubtitle: e.target.value })
                  }
                  disabled={submitting}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>
            </div>
          )}
        />
      </form>
    </Modal>
  );
}