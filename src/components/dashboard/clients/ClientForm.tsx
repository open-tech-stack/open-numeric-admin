"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Client } from "@/types";

interface ClientFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    logo: string;
    url?: string;
    order?: number;
    isActive?: boolean;
  }) => void | Promise<void>;
  initialData?: Client | null;
  submitting?: boolean;
}

interface FormValues {
  name: string;
  logo: string;
  url: string;
  order: number;
  isActive: boolean;
}

const DEFAULT_VALUES: FormValues = {
  name: "",
  logo: "",
  url: "",
  order: 0,
  isActive: true,
};

export default function ClientForm({
  open,
  onClose,
  onSubmit,
  initialData,
  submitting = false,
}: ClientFormProps) {
  const [values, setValues] = useState<FormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = Boolean(initialData);

  /* Initialise les valeurs */
  useEffect(() => {
    if (open) {
      if (initialData) {
        setValues({
          name: initialData.name,
          logo: initialData.logo,
          url: initialData.url ?? "",
          order: initialData.order,
          isActive: initialData.isActive,
        });
      } else {
        setValues(DEFAULT_VALUES);
      }
      setErrors({});
    }
  }, [open, initialData]);

  /* Validation */
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!values.name.trim()) errs.name = "Le nom est requis.";
    if (!values.logo.trim()) errs.logo = "Le logo est requis.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* Submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      name: values.name.trim(),
      logo: values.logo.trim(),
      url: values.url.trim() || undefined,
      order: values.order,
      isActive: values.isActive,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={isEdit ? "Modifier le client" : "Nouveau client"}
      description={
        isEdit
          ? "Modifiez les informations du client."
          : "Ajoutez un nouveau client à votre portfolio."
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Annuler
          </Button>
          <Button
            variant="primary"
            leftIcon={Save}
            onClick={handleSubmit}
            loading={submitting}
          >
            {isEdit ? "Enregistrer" : "Créer"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nom du client"
          placeholder="TechCorp"
          value={values.name}
          onChange={(e) =>
            setValues((v) => ({ ...v, name: e.target.value }))
          }
          error={errors.name}
          required
          disabled={submitting}
          autoFocus
        />

        <Input
          label="Logo (URL)"
          placeholder="/images/custo1.png"
          hint="Chemin public ou URL complète."
          value={values.logo}
          onChange={(e) =>
            setValues((v) => ({ ...v, logo: e.target.value }))
          }
          error={errors.logo}
          required
          disabled={submitting}
        />

        <Input
          label="Site web (optionnel)"
          placeholder="https://techcorp.com"
          value={values.url}
          onChange={(e) =>
            setValues((v) => ({ ...v, url: e.target.value }))
          }
          disabled={submitting}
        />

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