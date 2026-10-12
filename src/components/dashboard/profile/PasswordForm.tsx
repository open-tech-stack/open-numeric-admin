"use client";

import { useState } from "react";
import { KeyRound, Eye, EyeOff, Save } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import type { ChangePasswordInput } from "@/types";

interface PasswordFormProps {
  submitting?: boolean;
  onSubmit: (data: ChangePasswordInput) => void | Promise<void>;
}

export function PasswordForm({ submitting, onSubmit }: PasswordFormProps) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
    setShowCurrent(false);
    setShowNext(false);
    setErrors({});
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!current) e.current = "Requis.";
    if (next.length < 8) e.next = "Minimum 8 caractères.";
    if (next === current) e.next = "Doit être différent de l'actuel.";
    if (confirm !== next) e.confirm = "Ne correspond pas.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    await onSubmit({ currentPassword: current, newPassword: next });
    reset();
  };

  const isDirty = current || next || confirm;

  return (
    <Card padded>
      <CardHeader
        title="Sécurité"
        description="Changez votre mot de passe. Toutes vos sessions seront révoquées."
      />
      <CardBody className="pb-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Mot de passe actuel"
            type={showCurrent ? "text" : "password"}
            leftIcon={KeyRound}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            error={errors.current}
            disabled={submitting}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                tabIndex={-1}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-hover"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          <Input
            label="Nouveau mot de passe"
            type={showNext ? "text" : "password"}
            leftIcon={KeyRound}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            error={errors.next}
            hint="Minimum 8 caractères."
            disabled={submitting}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowNext((v) => !v)}
                tabIndex={-1}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-hover"
              >
                {showNext ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          <Input
            label="Confirmer le nouveau mot de passe"
            type={showNext ? "text" : "password"}
            leftIcon={KeyRound}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={errors.confirm}
            disabled={submitting}
          />

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              leftIcon={Save}
              loading={submitting}
              disabled={!isDirty || submitting}
            >
              Changer le mot de passe
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}