"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Eye, EyeOff, User, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/services/core/http.service";
import { cn } from "@/lib/cn";

interface FormState {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  global?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const { login, user } = useAuth();
  const toast = useToast();

  const [values, setValues] = useState<FormState>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* Si déjà connecté → redirige */
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  /* Validation */
  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!values.username.trim()) {
      errs.username = "Le nom d'utilisateur est requis.";
    } else if (values.username.trim().length < 3) {
      errs.username = "Minimum 3 caractères.";
    }

    if (!values.password) {
      errs.password = "Le mot de passe est requis.";
    } else if (values.password.length < 8) {
      errs.password = "Minimum 8 caractères.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* Submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    setErrors({});

    try {
      await login({
        username: values.username.trim(),
        password: values.password,
      });

      toast.success("Connexion réussie", {
        description: "Bienvenue sur votre dashboard.",
      });

      router.replace("/dashboard");
    } catch (err) {
      let globalError = "Une erreur est survenue. Réessayez.";

      if (err instanceof ApiError) {
        if (err.isUnauthorized) {
          globalError = "Identifiants invalides.";
        } else if (err.isRateLimited) {
          globalError = "Trop de tentatives. Réessayez dans une minute.";
        } else if (err.status === 400) {
          globalError = "Veuillez vérifier vos informations.";
        } else if (err.status === 0) {
          globalError = "Impossible de contacter le serveur.";
        }
      }

      setErrors({ global: globalError });
      toast.error("Échec de la connexion", { description: globalError });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden">
      {/* Barre gradient en haut */}
      <div className="h-1 bg-gradient-to-r from-primary via-primary-hover to-primary" />

      <div className="p-6 sm:p-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-foreground-muted">
            Accédez à votre espace d'administration.
          </p>
        </div>

        {/* Erreur globale */}
        {errors.global && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm"
          >
            <span className="flex-shrink-0 mt-0.5">⚠️</span>
            <p className="font-medium">{errors.global}</p>
          </motion.div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Input
            label="Nom d'utilisateur"
            placeholder="admin"
            autoComplete="username"
            autoFocus
            leftIcon={User}
            value={values.username}
            onChange={(e) =>
              setValues((v) => ({ ...v, username: e.target.value }))
            }
            error={errors.username}
            disabled={submitting}
            required
          />

          <Input
            label="Mot de passe"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
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
            disabled={submitting}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={submitting}
            leftIcon={submitting ? undefined : LogIn}
            fullWidth
          >
            {submitting ? "Connexion…" : "Se connecter"}
          </Button>
        </form>

        {/* Footer du formulaire */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-center text-foreground-subtle">
            Accès réservé aux administrateurs.
          </p>
        </div>
      </div>
    </div>
  );
}