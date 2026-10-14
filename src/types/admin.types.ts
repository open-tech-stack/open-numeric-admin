/* ============================================================
   Rôles
   ============================================================ */

export type AdminRole = "ADMIN" | "EDITOR";

export const ADMIN_ROLES: {
  value: AdminRole;
  label: string;
  description: string;
}[] = [
  {
    value: "ADMIN",
    label: "Administrateur",
    description:
      "Accès complet : gestion du contenu, paramètres, administrateurs.",
  },
  {
    value: "EDITOR",
    label: "Éditeur",
    description:
      "Gestion du contenu uniquement (pas d'accès aux admins/paramètres).",
  },
];

/* ============================================================
   Entité
   ============================================================ */

export interface Admin {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
  role: AdminRole;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ============================================================
   Payloads API
   ============================================================ */

export interface AdminCreateInput {
  username: string;
  password: string;
  displayName: string;
  email?: string;
  role: AdminRole;
}

export interface AdminUpdateInput {
  username?: string;
  password?: string;
  displayName?: string;
  email?: string;
  role?: AdminRole;
}

export type CreateAdminInput = AdminCreateInput;
export type UpdateAdminInput = AdminUpdateInput;

/* ============================================================
   Version allégée (auteurs, selects)
   ============================================================ */

export interface AdminMinimal {
  id: string;
  username: string;
  displayName: string;
  role: AdminRole;
}