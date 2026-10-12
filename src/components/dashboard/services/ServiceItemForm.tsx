"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Save, Image as ImageIcon } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Icon from "@/components/ui/Icon";
import type { Locale, ServiceItem, ServiceItemTranslation } from "@/types";
import { SUPPORTED_LOCALES } from "@/types";
import { cn } from "@/lib/cn";
import TranslationTabs from "@/components/ui/TranslationTabs";

/* =========================================================
   ICÔNES (optionnelles)
   ========================================================= */

const ICON_OPTIONS = [
  { value: "", label: "Aucune" },
  { value: "Code2", label: "Code" },
  { value: "Server", label: "Server" },
  { value: "Smartphone", label: "Mobile" },
  { value: "Globe", label: "Web" },
  { value: "Layers", label: "Layers" },
  { value: "Palette", label: "Palette" },
  { value: "Shield", label: "Shield" },
  { value: "Cpu", label: "Cpu" },
  { value: "HardDrive", label: "Storage" },
];

/* =========================================================
   TYPES
   ========================================================= */

type TranslationsMap = Record<Locale, Omit<ServiceItemTranslation, "locale">>;

const EMPTY_TRANSLATION = { name: "", description: "" };

const DEFAULT_TRANSLATIONS: TranslationsMap = SUPPORTED_LOCALES.reduce(
  (acc, loc) => ({ ...acc, [loc.value]: { ...EMPTY_TRANSLATION } }),
  {} as TranslationsMap,
);

interface ServiceItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void | Promise<void>;
  initialData?: ServiceItem | null;
  submitting?: boolean;
}

interface FormValues {
  key: string;
  image: string;
  icon: string;
  order: number;
  translations: TranslationsMap;
}

const DEFAULT_VALUES: FormValues = {
  key: "",
  image: "",
  icon: "",
  order: 0,
  translations: DEFAULT_TRANSLATIONS,
};

/* =========================================================
   COMPOSANT
   ========================================================= */

export default function ServiceItemForm({
  open,
  onClose,
  onSubmit,
  initialData,
  submitting = false,
}: ServiceItemFormProps) {
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
        image: initialData.image ?? "",
        icon: initialData.icon ?? "",
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

    const translations: ServiceItemTranslation[] = SUPPORTED_LOCALES
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
      image: values.image.trim() || undefined,
      icon: values.icon.trim() || undefined,
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
      title={isEdit ? "Modifier l'item" : "Nouvel item"}
      description={
        isEdit
          ? `Modifiez les informations de ${initialData?.key}.`
          : "Ajoutez un nouvel item à la catégorie."
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
            placeholder="react"
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

        {/* Image */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-foreground">
            Image (optionnelle)
          </label>
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0">
              <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-border bg-surface-hover flex items-center justify-center">
                {values.image ? (
                  <Image
                    src={values.image}
                    alt="Aperçu"
                    fill
                    className="object-contain p-2"
                    sizes="80px"
                  />
                ) : (
                  <ImageIcon className="h-6 w-6 text-foreground-subtle" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <Input
                label=""
                placeholder="/images/dev/react.png"
                hint="Chemin public ou URL complète."
                value={values.image}
                onChange={(e) =>
                  setValues((v) => ({ ...v, image: e.target.value }))
                }
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        {/* Icône (si pas d'image) */}
        {!values.image && (
          <div>
            <label className="block mb-2 text-sm font-semibold text-foreground">
              Ou icône (utilisée si pas d'image)
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {ICON_OPTIONS.map((opt) => {
                const isSelected = values.icon === opt.value;
                return (
                  <button
                    key={opt.value || "none"}
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
                    {opt.value ? (
                      <Icon
                        name={opt.value}
                        className={cn(
                          "h-4 w-4",
                          isSelected ? "text-primary" : "text-foreground-muted",
                        )}
                      />
                    ) : (
                      <span
                        className={cn(
                          "text-xs font-bold",
                          isSelected ? "text-primary" : "text-foreground-muted",
                        )}
                      >
                        ∅
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

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
                label="Nom de l'item"
                placeholder="React / Next.js"
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
                  placeholder="Frameworks performants SSR, ISR et SSG."
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