"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import BrandIcon from "@/components/ui/BrandIcon";
import type { Social } from "@/types";

/* =========================================================
   ICÔNES DE MARQUE DISPONIBLES
   ========================================================= */

const ICON_OPTIONS = [
  { value: "Facebook", label: "Facebook" },
  { value: "Twitter", label: "Twitter" },
  { value: "X", label: "X (Twitter)" },
  { value: "Linkedin", label: "LinkedIn" },
  { value: "Instagram", label: "Instagram" },
  { value: "Youtube", label: "YouTube" },
  { value: "Tiktok", label: "TikTok" },
  { value: "Github", label: "GitHub" },
  { value: "Dribbble", label: "Dribbble" },
  { value: "Behance", label: "Behance" },
  { value: "Whatsapp", label: "WhatsApp" },
  { value: "Telegram", label: "Telegram" },
  { value: "Discord", label: "Discord" },
  { value: "Reddit", label: "Reddit" },
  { value: "Pinterest", label: "Pinterest" },
  { value: "Medium", label: "Medium" },
  { value: "Threads", label: "Threads" },
  { value: "Mastodon", label: "Mastodon" },
  { value: "Twitch", label: "Twitch" },
  { value: "Slack", label: "Slack" },
  { value: "StackOverflow", label: "Stack Overflow" },
];

/* =========================================================
   COULEURS DE HOVER
   ========================================================= */

const HOVER_COLORS = [
  { value: "hover:text-blue-600", label: "Bleu", preview: "text-blue-600" },
  { value: "hover:text-sky-500", label: "Ciel", preview: "text-sky-500" },
  { value: "hover:text-blue-700", label: "Bleu foncé", preview: "text-blue-700" },
  { value: "hover:text-pink-600", label: "Rose", preview: "text-pink-600" },
  { value: "hover:text-red-600", label: "Rouge", preview: "text-red-600" },
  { value: "hover:text-purple-600", label: "Violet", preview: "text-purple-600" },
  { value: "hover:text-emerald-500", label: "Émeraude", preview: "text-emerald-500" },
  { value: "hover:text-gray-900", label: "Noir", preview: "text-gray-900" },
];

/* =========================================================
   TYPES
   ========================================================= */

interface SocialFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    key: string;
    icon: string;
    url: string;
    hoverColor: string;
    order?: number;
    isActive?: boolean;
  }) => void | Promise<void>;
  initialData?: Social | null;
  submitting?: boolean;
}

interface FormValues {
  key: string;
  icon: string;
  url: string;
  hoverColor: string;
  order: number;
  isActive: boolean;
}

const DEFAULT_VALUES: FormValues = {
  key: "",
  icon: "Facebook",
  url: "",
  hoverColor: "hover:text-blue-600",
  order: 0,
  isActive: true,
};

/* =========================================================
   COMPOSANT
   ========================================================= */

export default function SocialForm({
  open,
  onClose,
  onSubmit,
  initialData,
  submitting = false,
}: SocialFormProps) {
  const [values, setValues] = useState<FormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setValues({
          key: initialData.key,
          icon: initialData.icon,
          url: initialData.url,
          hoverColor: initialData.hoverColor,
          order: initialData.order,
          isActive: initialData.isActive,
        });
      } else {
        setValues(DEFAULT_VALUES);
      }
      setErrors({});
    }
  }, [open, initialData]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!isEdit && !values.key.trim()) {
      errs.key = "La clé est requise.";
    } else if (!isEdit && !/^[a-z0-9-]+$/.test(values.key.trim())) {
      errs.key = "Minuscules, chiffres et tirets uniquement.";
    }
    if (!values.url.trim()) errs.url = "L'URL est requise.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    const payload: any = {
      icon: values.icon,
      url: values.url.trim(),
      hoverColor: values.hoverColor,
      order: values.order,
      isActive: values.isActive,
    };

    if (!isEdit) payload.key = values.key.trim();

    await onSubmit(payload);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={isEdit ? "Modifier le réseau social" : "Nouveau réseau social"}
      description={
        isEdit
          ? `Modifiez les informations de ${initialData?.key}.`
          : "Ajoutez un nouveau réseau social."
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
      <form onSubmit={handleSubmit} className="space-y-5">
        {!isEdit && (
          <Input
            label="Clé unique"
            placeholder="facebook"
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

        {/* Sélecteur d'icônes */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-foreground">
            Icône
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-1 rounded-lg border border-border bg-surface">
            {ICON_OPTIONS.map((opt) => {
              const isSelected = values.icon === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValues((v) => ({ ...v, icon: opt.value }))}
                  disabled={submitting}
                  title={opt.label}
                  className={`group flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-lg border transition-all ${
                    isSelected
                      ? "border-primary bg-primary-soft shadow-md"
                      : "border-transparent hover:border-border hover:bg-surface-hover"
                  }`}
                >
                  <BrandIcon
                    name={opt.value}
                    className={`h-5 w-5 ${
                      isSelected ? "text-primary" : "text-foreground-muted"
                    }`}
                  />
                  <span className="text-[9px] text-foreground-subtle font-medium truncate w-full text-center">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Input
          label="URL du profil"
          placeholder="https://facebook.com/open-numeric"
          value={values.url}
          onChange={(e) => setValues((v) => ({ ...v, url: e.target.value }))}
          error={errors.url}
          required
          disabled={submitting}
        />

        {/* Couleur de hover */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-foreground">
            Couleur de hover
          </label>
          <div className="grid grid-cols-4 gap-2">
            {HOVER_COLORS.map((color) => {
              const isSelected = values.hoverColor === color.value;
              return (
                <button
                  key={color.value}
                  type="button"
                  onClick={() =>
                    setValues((v) => ({ ...v, hoverColor: color.value }))
                  }
                  disabled={submitting}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? "border-primary bg-primary-soft"
                      : "border-border bg-surface hover:bg-surface-hover"
                  }`}
                >
                  <span
                    className={`h-3 w-3 rounded-full bg-current ${color.preview}`}
                  />
                  <span className="text-xs font-medium truncate">
                    {color.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
      </form>
    </Modal>
  );
}