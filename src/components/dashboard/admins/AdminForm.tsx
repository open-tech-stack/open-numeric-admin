"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Eye,
  EyeOff,
  Lock,
  Shield,
  User,
  Mail,
  AlertCircle,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { Admin, AdminRole } from "@/types";

/* =========================================================
   TYPES
   ========================================================= */

interface AdminFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void | Promise<void>;
  initialData?: Admin | null;
  submitting?: boolean;
}

interface FormValues {
  username: string;
  password: string;
  displayName: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
}

const DEFAULT_VALUES: FormValues = {
  username: "",
  password: "",
  displayName: "",
  email: "",
  role: "EDITOR",
  isActive: true,
};

/* =========================================================
   ROLES
   ========================================================= */

const ROLE_OPTIONS: { value: AdminRole; label: string; description: string }[] = [
  {
    value: "ADMIN",
    label: "Administrateur",
    description: "Accès complet : gestion du contenu, paramètres, admins.",
  },
  {
    value: "EDITOR",
    label: "Éditeur",
    description: "Gestion du contenu uniquement (pas d'accès aux admins/paramètres).",
  },
];

/* =========================================================
   COMPOSANT
   ========================================================= */

export default function AdminForm({
  open,
  onClose,
  onSubmit,
  initialData,
  submitting = false,
}: AdminFormProps) {
  const [values, setValues] = useState<FormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const isEdit = Boolean(initialData);

  /* Init */
  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setValues({
        username: initialData.username,
        password: "",
        displayName: initialData.displayName,
        email: initialData.email ?? "",
        role: initialData.role,
        isActive: initialData.isActive,
      });
    } else {
      setValues(DEFAULT_VALUES);
    }
    setErrors({});
    setShowPassword(false);
  }, [open, initialData]);

  /* Validation */
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!isEdit) {
      if (!values.username.trim()) {
        errs.username = "Le nom d'utilisateur est requis.";
      } else if (!/^[a-z0-9_.-]+$/.test(values.username.trim())) {
        errs.username = "Minuscules, chiffres, . _ - uniquement.";
      } else if (values.username.trim().length < 3) {
        errs.username = "Minimum 3 caractères.";
      }

      if (!values.password) {
        errs.password = "Le mot de passe est requis.";
      } else if (values.password.length < 8) {
        errs.password = "Minimum 8 caractères.";
      }
    } else {
      /* En édition : si password est fourni, il doit être valide */
      if (values.password && values.password.length < 8) {
        errs.password = "Minimum 8 caractères.";
      }
    }

    if (!values.displayName.trim()) {
      errs.displayName = "Le nom affiché est requis.";
    }

    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errs.email = "Email invalide.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* Submit */
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    const payload: any = {
      displayName: values.displayName.trim(),
      email: values.email.trim() || undefined,
      role: values.role,
      isActive: values.isActive,
    };

    if (!isEdit) {
      payload.username = values.username.trim();
      payload.password = values.password;
    } else if (values.password) {
      /* En édition, on n'envoie le password que s'il est rempli */
      payload.password = values.password;
    }

    await onSubmit(payload);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={isEdit ? "Modifier un administrateur" : "Nouvel administrateur"}
      description={
        isEdit
          ? `Modifiez les informations de ${initialData?.username}.`
          : "Créez un nouveau compte administrateur."
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
        {/* Username (création uniquement) */}
        {!isEdit ? (
          <Input
            label="Nom d'utilisateur"
            placeholder="nestor"
            hint="Identifiant de connexion. Minuscules, chiffres, . _ - uniquement."
            leftIcon={User}
            value={values.username}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                username: e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""),
              }))
            }
            error={errors.username}
            required
            disabled={submitting}
            autoFocus
          />
        ) : (
          <div>
            <label className="block mb-2 text-sm font-semibold text-foreground">
              Nom d'utilisateur
            </label>
            <div className="flex items-center gap-3 h-11 px-4 rounded-xl bg-surface border border-border text-foreground-muted">
              <User className="h-4 w-4 flex-shrink-0" />
              <code className="text-sm font-mono">{values.username}</code>
              <span className="ml-auto text-[10px] uppercase tracking-wider text-foreground-subtle">
                Non modifiable
              </span>
            </div>
          </div>
        )}

        {/* Display name */}
        <Input
          label="Nom affiché"
          placeholder="Nestor COMPAORE"
          hint="Nom qui apparaîtra dans l'interface (sidebar, header)."
          value={values.displayName}
          onChange={(e) =>
            setValues((v) => ({ ...v, displayName: e.target.value }))
          }
          error={errors.displayName}
          required
          disabled={submitting}
        />

        {/* Email */}
        <Input
          label="Email (optionnel)"
          type="email"
          placeholder="nestor@open-numeric.com"
          leftIcon={Mail}
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          error={errors.email}
          disabled={submitting}
        />

        {/* Password */}
        <Input
          label={isEdit ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          hint={
            isEdit
              ? "Laissez vide pour conserver le mot de passe actuel."
              : "Minimum 8 caractères."
          }
          leftIcon={Lock}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Cacher" : "Voir"}
              tabIndex={-1}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
          value={values.password}
          onChange={(e) =>
            setValues((v) => ({ ...v, password: e.target.value }))
          }
          error={errors.password}
          required={!isEdit}
          disabled={submitting}
        />

        {/* Rôle */}
        <div>
          <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-foreground">
            <Shield className="h-4 w-4" />
            Rôle
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ROLE_OPTIONS.map((opt) => {
              const isSelected = values.role === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValues((v) => ({ ...v, role: opt.value }))}
                  disabled={submitting}
                  className={cn(
                    "flex flex-col items-start gap-1 p-4 rounded-xl border text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary-soft shadow-md"
                      : "border-border bg-surface hover:border-primary/40 hover:bg-surface-hover",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-bold",
                      isSelected ? "text-primary" : "text-foreground",
                    )}
                  >
                    {opt.label}
                  </span>
                  <span className="text-xs text-foreground-muted leading-relaxed">
                    {opt.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Statut */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-foreground">
            Statut
          </label>
          <button
            type="button"
            onClick={() => setValues((v) => ({ ...v, isActive: !v.isActive }))}
            disabled={submitting}
            className={cn(
              "w-full h-11 rounded-xl border transition-colors",
              values.isActive
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                : "bg-surface border-border text-foreground-muted",
            )}
          >
            {values.isActive ? "Compte actif" : "Compte désactivé"}
          </button>
        </div>

        {/* Warning : édition d'un admin existant */}
        {isEdit && initialData?.role === "ADMIN" && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              Vous modifiez un compte ADMIN. Assurez-vous de conserver au moins
              un administrateur actif pour éviter de perdre l'accès.
            </p>
          </div>
        )}
      </form>
    </Modal>
  );
}