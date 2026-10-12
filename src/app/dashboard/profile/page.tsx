"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ProfileForm } from "@/components/dashboard/profile/ProfileForm";
import { PasswordForm } from "@/components/dashboard/profile/PasswordForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { authService } from "@/services/auth/auth.service";
import { ApiError } from "@/services/core/http.service";
import type { ChangePasswordInput, UpdateProfileInput } from "@/types";

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  if (!user) return null;

  /* ---------------- Profile ---------------- */
  const handleUpdateProfile = async (data: UpdateProfileInput) => {
    setUpdatingProfile(true);
    try {
      const updated = await authService.updateProfile(data);
      setUser(updated);
      toast.success("Profil mis à jour");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erreur";
      toast.error(msg);
    } finally {
      setUpdatingProfile(false);
    }
  };

  /* ---------------- Password ---------------- */
  const handleChangePassword = async (data: ChangePasswordInput) => {
    setChangingPassword(true);
    try {
      await authService.changePassword(data);
      toast.success("Mot de passe changé. Reconnectez-vous.");
      // Le backend a révoqué les tokens : on force la déconnexion
      setTimeout(async () => {
        await logout();
        router.replace("/auth");
      }, 800);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erreur";
      toast.error(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  /* ---------------- Logout ---------------- */
  const handleLogout = async () => {
    await logout();
    router.replace("/auth");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mon profil</h1>
        <p className="text-sm text-foreground-muted mt-1">
          Gérez vos informations personnelles et votre sécurité.
        </p>
      </div>

      <ProfileForm
        user={user}
        submitting={updatingProfile}
        onSubmit={handleUpdateProfile}
      />

      <PasswordForm
        submitting={changingPassword}
        onSubmit={handleChangePassword}
      />

      {/* Zone dangereuse */}
      <Card padded>
        <CardHeader
          title="Session"
          description="Déconnectez-vous de cet appareil."
        />
        <CardBody className="pb-0">
          <Button
            variant="danger"
            leftIcon={LogOut}
            onClick={() => setConfirmLogout(true)}
          >
            Se déconnecter
          </Button>
        </CardBody>
      </Card>

      <ConfirmDialog
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
        title="Se déconnecter ?"
        description="Vous serez redirigé vers la page de connexion."
        confirmLabel="Déconnexion"
      />
    </div>
  );
}