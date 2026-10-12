import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import Logo from "@/components/auth/Logo";

export const metadata: Metadata = {
  title: "Connexion — Open Numeric Admin",
  description: "Connectez-vous à votre espace d'administration.",
};

export default function AuthPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center mb-8">
        <Logo size="lg" linked={false} />
      </div>

      <LoginForm />
    </AuthLayout>
  );
}