"use client";

import { useEffect, useState } from "react";
import { Save, User, Mail, AtSign, Shield } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { AuthUser, UpdateProfileInput } from "@/types";

interface ProfileFormProps {
  user: AuthUser;
  submitting?: boolean;
  onSubmit: (data: UpdateProfileInput) => void | Promise<void>;
}

export function ProfileForm({ user, submitting, onSubmit }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setDisplayName(user.displayName);
    setEmail(user.email ?? "");
    setErrors({});
  }, [user]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (displayName.trim().length < 2) {
      e.displayName = "Minimum 2 caractères.";
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Email invalide.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    const payload: UpdateProfileInput = {};
    if (displayName.trim() !== user.displayName) {
      payload.displayName = displayName.trim();
    }
    const trimmedEmail = email.trim();
    if (trimmedEmail !== (user.email ?? "")) {
      payload.email = trimmedEmail;
    }
    if (Object.keys(payload).length === 0) return;

    await onSubmit(payload);
  };

  const isDirty =
    displayName !== user.displayName || email !== (user.email ?? "");

  return (
    <Card padded>
      <CardHeader
        title="Informations personnelles"
        description="Modifiez votre nom affiché et votre adresse email."
        action={
          <Badge variant={user.role === "ADMIN" ? "primary" : "info"}>
            <Shield className="h-3 w-3" />
            {user.role === "ADMIN" ? "Administrateur" : "Éditeur"}
          </Badge>
        }
      />
      <CardBody className="pb-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom d'utilisateur"
            value={user.username}
            leftIcon={AtSign}
            disabled
            hint="Non modifiable. Contactez un admin si besoin."
          />

          <Input
            label="Nom affiché"
            placeholder="Nestor COMPAORE"
            leftIcon={User}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            error={errors.displayName}
            disabled={submitting}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="nestor@open-numeric.com"
            leftIcon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            disabled={submitting}
          />

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              leftIcon={Save}
              loading={submitting}
              disabled={!isDirty || submitting}
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}