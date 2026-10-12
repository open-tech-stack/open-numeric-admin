"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Icon from "@/components/ui/Icon";
import type {
  Locale,
  ServiceCategory,
  ServiceCategoryTranslation,
} from "@/types";
import { SUPPORTED_LOCALES } from "@/types";
import { cn } from "@/lib/cn";
import TranslationTabs from "@/components/ui/TranslationTabs";

/* =========================================================
   ICÔNES
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
  { value: "Layers", label: "Layers" },
  { value: "Cpu", label: "Cpu" },
  { value: "Shield", label: "Shield" },
];

/* =========================================================
   ACCENTS
   ========================================================= */

const ACCENT_OPTIONS = [
  { value: "from-blue-500 to-cyan-500", label: "Bleu / Cyan" },
  { value: "from-pink-500 to-purple-500", label: "Rose / Violet" },
  { value: "from-emerald-500 to-teal-500", label: "Émeraude" },
  { value: "from-amber-500 to-orange-500", label: "Ambre / Orange" },
  { value: "from-red-500 to-amber-500", label: "Rouge / Ambre" },
  { value: "from-violet-500 to-purple-500", label: "Violet" },
  { value: "from-cyan-500 to-blue-500", label: "Cyan / Bleu" },
  { value: "from-rose-500 to-pink-500", label: "Rose / Rose" },
];

/* =========================================================
   TYPES
   ========================================================= */

type TranslationsMap = Record<
  Locale,
  Omit<ServiceCategoryTranslation, "locale">
>;

const EMPTY_TRANSLATION = { name: "", description: "" };

const DEFAULT_TRANSLATIONS: TranslationsMap = SUPPORTED_LOCALES.reduce(
  (acc, loc) => ({ ...acc, [loc.value]: { ...EMPTY_TRANSLATION } }),
  {} as TranslationsMap,
);

interface ServiceCategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void | Promise<void>;
  initialData?: ServiceCategory | null;
  submitting?: boolean;
}

interface FormValues {
  key: string;
  icon: string;
  accent: string;
  order: number;
  translations: TranslationsMap;
}

const DEFAULT_VALUES: FormValues = {
  key: "",
  icon: "Code2",
  accent: "from-blue-500 to-cyan-500",
  order: 0,
  translations: DEFAULT_TRANSLATIONS,
};

/* =========================================================
   COMPOSANT
   ========================================================= */

export default function ServiceCategoryForm({
  open,
  onClose,
  onSubmit,
  initialData,
  submitting = false,
}: ServiceCategoryFormProps) {
  const [values, setValues] = useState<FormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      const transMap = SUPPORTED_LOCALES.reduce((acc, loc) => {
        const tr = initialData.translations.find((t) => t.locale === loc.value);
        acc[loc.value] = tr
          ? { name: tr.name, description: tr.description ?? "" }
          : { ...EMPTY_TRANSLATION };
        return acc;
      }, {} as TranslationsMap);

      setValues({
        key: initialData.key,
        icon: initialData.icon,
        accent: initialData.accent,
        order: initialData.order,
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

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!isEdit && !values.key.trim()) {
      errs.key = "La clé est requise.";
    } else if (!isEdit && !/^[a-z0-9-]+$/.test(values.key.trim())) {
      errs.key = "Minuscules, chiffres et tirets uniquement.";
    }

    const fr = values.translations.fr;
    if (!fr.name.trim()) errs.fr_name = "Le nom (FR) est requis.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    const translations: ServiceCategoryTranslation[] = SUPPORTED_LOCALES
      .map((loc) => {
        const t = values.translations[loc.value];
        return {
          locale: loc.value,
          name: t.name.trim(),
          description: t.description?.trim() || null,
        };
      })
      .filter((t) => t.name);

    const payload: any = {
      icon: values.icon,
      accent: values.accent,
      order: values.order,
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
      title={isEdit ? "Modifier la catégorie" : "Nouvelle catégorie"}
      description={
        isEdit
          ? `Modifiez les informations de ${initialData?.key}.`
          : "Ajoutez une nouvelle catégorie au service."
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
        {!isEdit && (
          <Input
            label="Clé unique"
            placeholder="frontend"
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
            disabled={submitting}
            autoFocus
          />
        )}

        {/* Icône */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-foreground">
            Icône
          </label>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
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

        {/* Ordre */}
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

        {/* Traductions */}
        <TranslationTabs
          translations={values.translations}
          onChange={(translations) =>
            setValues((v) => ({ ...v, translations }))
          }
          render={({ locale, value, onChange }) => (
            <div className="space-y-4">
              <Input
                label="Nom de la catégorie"
                placeholder="Frontend"
                value={value.name}
                onChange={(e) => onChange({ ...value, name: e.target.value })}
                error={errors[`${locale}_name`]}
                required={locale === "fr"}
                disabled={submitting}
              />

              <div>
                <label className="block mb-2 text-sm font-semibold text-foreground">
                  Description (optionnelle)
                </label>
                <textarea
                  rows={2}
                  placeholder="Frameworks modernes…"
                  value={value.description ?? ""}
                  onChange={(e) =>
                    onChange({ ...value, description: e.target.value })
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