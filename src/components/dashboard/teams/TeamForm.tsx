"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Save, Image as ImageIcon } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Locale, TeamMember, TeamMemberTranslation } from "@/types";
import { SUPPORTED_LOCALES } from "@/types";
import TranslationTabs from "@/components/ui/TranslationTabs";

/* =========================================================
   TYPES
   ========================================================= */

type TranslationsMap = Record<Locale, Omit<TeamMemberTranslation, "locale">>;

const EMPTY_TRANSLATION = { name: "", role: "", bio: "" };

const DEFAULT_TRANSLATIONS: TranslationsMap = SUPPORTED_LOCALES.reduce(
  (acc, loc) => ({ ...acc, [loc.value]: { ...EMPTY_TRANSLATION } }),
  {} as TranslationsMap,
);

interface TeamFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void | Promise<void>;
  initialData?: TeamMember | null;
  submitting?: boolean;
}

interface FormValues {
  key: string;
  image: string;
  linkedin: string;
  twitter: string;
  order: number;
  isActive: boolean;
  translations: TranslationsMap;
}

const DEFAULT_VALUES: FormValues = {
  key: "",
  image: "",
  linkedin: "",
  twitter: "",
  order: 0,
  isActive: true,
  translations: DEFAULT_TRANSLATIONS,
};

/* =========================================================
   COMPOSANT
   ========================================================= */

export default function TeamForm({
  open,
  onClose,
  onSubmit,
  initialData,
  submitting = false,
}: TeamFormProps) {
  const [values, setValues] = useState<FormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = Boolean(initialData);

  /* Init */
  useEffect(() => {
    if (!open) return;

    if (initialData) {
      /* Reconstruit le map depuis le tableau */
      const transMap = SUPPORTED_LOCALES.reduce((acc, loc) => {
        const tr = initialData.translations.find((t) => t.locale === loc.value);
        acc[loc.value] = tr
          ? { name: tr.name, role: tr.role, bio: tr.bio }
          : { ...EMPTY_TRANSLATION };
        return acc;
      }, {} as TranslationsMap);

      setValues({
        key: initialData.key,
        image: initialData.image,
        linkedin: initialData.linkedin ?? "",
        twitter: initialData.twitter ?? "",
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
    if (!fr.name.trim()) errs.fr_name = "Le nom (FR) est requis.";
    if (!fr.role.trim()) errs.fr_role = "Le rôle (FR) est requis.";
    if (!fr.bio.trim()) errs.fr_bio = "La bio (FR) est requise.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* Submit */
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    /* Transforme le map en tableau, en ne gardant que les langues non vides */
    const translations: TeamMemberTranslation[] = SUPPORTED_LOCALES
      .map((loc) => {
        const t = values.translations[loc.value];
        return {
          locale: loc.value,
          name: t.name.trim(),
          role: t.role.trim(),
          bio: t.bio.trim(),
        };
      })
      .filter((t) => t.name || t.role || t.bio);

    const payload: any = {
      image: values.image.trim(),
      linkedin: values.linkedin.trim() || undefined,
      twitter: values.twitter.trim() || undefined,
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
      title={isEdit ? "Modifier un membre" : "Nouveau membre"}
      description={
        isEdit
          ? `Modifiez les informations de ${initialData?.key}.`
          : "Ajoutez un membre à votre équipe."
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
        {/* Clé (création seulement) */}
        {!isEdit && (
          <Input
            label="Clé unique"
            placeholder="ceo"
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
            Photo
          </label>
          <div className="flex gap-4 items-start">
            {/* Aperçu */}
            <div className="flex-shrink-0">
              <div className="relative h-24 w-24 rounded-2xl overflow-hidden border border-border bg-surface-hover flex items-center justify-center">
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

            {/* Champ */}
            <div className="flex-1">
              <Input
                label=""
                placeholder="/images/dev.jpg"
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

        {/* Liens sociaux */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="LinkedIn (optionnel)"
            placeholder="https://linkedin.com/in/..."
            value={values.linkedin}
            onChange={(e) =>
              setValues((v) => ({ ...v, linkedin: e.target.value }))
            }
            disabled={submitting}
          />
          <Input
            label="Twitter / X (optionnel)"
            placeholder="https://twitter.com/..."
            value={values.twitter}
            onChange={(e) =>
              setValues((v) => ({ ...v, twitter: e.target.value }))
            }
            disabled={submitting}
          />
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
              <Input
                label="Nom complet"
                placeholder="Nestor COMPAORE"
                value={value.name}
                onChange={(e) => onChange({ ...value, name: e.target.value })}
                error={errors[`${locale}_name`]}
                required={locale === "fr"}
                disabled={submitting}
              />

              <Input
                label="Rôle"
                placeholder="CEO & Développeur Principal"
                value={value.role}
                onChange={(e) => onChange({ ...value, role: e.target.value })}
                error={errors[`${locale}_role`]}
                required={locale === "fr"}
                disabled={submitting}
              />

              <div>
                <label className="block mb-2 text-sm font-semibold text-foreground">
                  Bio
                  {locale === "fr" && (
                    <span className="ml-1 text-danger">*</span>
                  )}
                </label>
                <textarea
                  rows={3}
                  placeholder="Courte biographie…"
                  value={value.bio}
                  onChange={(e) => onChange({ ...value, bio: e.target.value })}
                  disabled={submitting}
                  className={`w-full px-4 py-3 rounded-xl bg-surface border text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 transition-all resize-none ${
                    errors[`${locale}_bio`]
                      ? "border-danger focus:border-danger focus:ring-danger/20"
                      : "border-border focus:border-primary focus:ring-primary/20"
                  }`}
                />
                {errors[`${locale}_bio`] && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors[`${locale}_bio`]}
                  </p>
                )}
              </div>
            </div>
          )}
        />
      </form>
    </Modal>
  );
}