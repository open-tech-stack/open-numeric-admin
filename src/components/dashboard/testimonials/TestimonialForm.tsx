"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Save, Image as ImageIcon, Star } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Locale, Testimonial, TestimonialTranslation } from "@/types";
import { SUPPORTED_LOCALES } from "@/types";
import { cn } from "@/lib/cn";
import TranslationTabs from "@/components/ui/TranslationTabs";

/* =========================================================
   TYPES
   ========================================================= */

type TranslationsMap = Record<Locale, Omit<TestimonialTranslation, "locale">>;

const EMPTY_TRANSLATION = { quote: "", author: "", company: "" };

const DEFAULT_TRANSLATIONS: TranslationsMap = SUPPORTED_LOCALES.reduce(
  (acc, loc) => ({ ...acc, [loc.value]: { ...EMPTY_TRANSLATION } }),
  {} as TranslationsMap,
);

interface TestimonialFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void | Promise<void>;
  initialData?: Testimonial | null;
  submitting?: boolean;
}

interface FormValues {
  key: string;
  image: string;
  rating: number;
  order: number;
  isActive: boolean;
  translations: TranslationsMap;
}

const DEFAULT_VALUES: FormValues = {
  key: "",
  image: "",
  rating: 5,
  order: 0,
  isActive: true,
  translations: DEFAULT_TRANSLATIONS,
};

/* =========================================================
   COMPOSANT
   ========================================================= */

export default function TestimonialForm({
  open,
  onClose,
  onSubmit,
  initialData,
  submitting = false,
}: TestimonialFormProps) {
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
          ? { quote: tr.quote, author: tr.author, company: tr.company }
          : { ...EMPTY_TRANSLATION };
        return acc;
      }, {} as TranslationsMap);

      setValues({
        key: initialData.key,
        image: initialData.image,
        rating: initialData.rating,
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

  /* Validation */
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!isEdit && !values.key.trim()) {
      errs.key = "La clé est requise.";
    } else if (!isEdit && !/^[a-z0-9-]+$/.test(values.key.trim())) {
      errs.key = "Minuscules, chiffres et tirets uniquement.";
    }

    if (!values.image.trim()) errs.image = "L'image est requise.";

    /* Au moins le FR doit être rempli */
    const fr = values.translations.fr;
    if (!fr.quote.trim()) errs.fr_quote = "La citation (FR) est requise.";
    if (!fr.author.trim()) errs.fr_author = "L'auteur (FR) est requis.";
    if (!fr.company.trim()) errs.fr_company = "L'entreprise (FR) est requise.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* Submit */
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    const translations: TestimonialTranslation[] = SUPPORTED_LOCALES
      .map((loc) => {
        const t = values.translations[loc.value];
        return {
          locale: loc.value,
          quote: t.quote.trim(),
          author: t.author.trim(),
          company: t.company.trim(),
        };
      })
      .filter((t) => t.quote || t.author || t.company);

    const payload: any = {
      image: values.image.trim(),
      rating: values.rating,
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
      title={isEdit ? "Modifier un témoignage" : "Nouveau témoignage"}
      description={
        isEdit
          ? `Modifiez les informations de ${initialData?.key}.`
          : "Ajoutez un témoignage client."
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
        {/* Clé */}
        {!isEdit && (
          <Input
            label="Clé unique"
            placeholder="t1"
            hint="Identifiant technique (minuscules, chiffres, tirets). Non modifiable."
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
            Photo de l'auteur
          </label>
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border border-border bg-surface-hover flex items-center justify-center">
                {values.image ? (
                  <Image
                    src={values.image}
                    alt="Aperçu"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-foreground-subtle" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <Input
                label=""
                placeholder="/images/test1.jpg"
                hint="Chemin public ou URL complète."
                value={values.image}
                onChange={(e) =>
                  setValues((v) => ({ ...v, image: e.target.value }))
                }
                error={errors.image}
                required
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-foreground">
            Note
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setValues((v) => ({ ...v, rating: n }))}
                disabled={submitting}
                aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
                className="p-1 transition-transform hover:scale-110 disabled:opacity-50"
              >
                <Star
                  className={cn(
                    "h-7 w-7 transition-colors",
                    n <= values.rating
                      ? "fill-primary text-primary"
                      : "text-foreground-subtle",
                  )}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-foreground-muted">
              {values.rating} / 5
            </span>
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
              className={`w-full h-11 rounded-xl border transition-colors ${
                values.isActive
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  : "bg-surface border-border text-foreground-muted"
              }`}
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
              <div>
                <label className="block mb-2 text-sm font-semibold text-foreground">
                  Citation
                  {locale === "fr" && (
                    <span className="ml-1 text-danger">*</span>
                  )}
                </label>
                <textarea
                  rows={3}
                  placeholder="« Open Numeric a transformé notre présence en ligne… »"
                  value={value.quote}
                  onChange={(e) => onChange({ ...value, quote: e.target.value })}
                  disabled={submitting}
                  className={`w-full px-4 py-3 rounded-xl bg-surface border text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 transition-all resize-none ${
                    errors[`${locale}_quote`]
                      ? "border-danger focus:border-danger focus:ring-danger/20"
                      : "border-border focus:border-primary focus:ring-primary/20"
                  }`}
                />
                {errors[`${locale}_quote`] && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors[`${locale}_quote`]}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Auteur"
                  placeholder="Jean Lambert"
                  value={value.author}
                  onChange={(e) =>
                    onChange({ ...value, author: e.target.value })
                  }
                  error={errors[`${locale}_author`]}
                  required={locale === "fr"}
                  disabled={submitting}
                />
                <Input
                  label="Entreprise"
                  placeholder="CEO, TechCorp"
                  value={value.company}
                  onChange={(e) =>
                    onChange({ ...value, company: e.target.value })
                  }
                  error={errors[`${locale}_company`]}
                  required={locale === "fr"}
                  disabled={submitting}
                />
              </div>
            </div>
          )}
        />
      </form>
    </Modal>
  );
}