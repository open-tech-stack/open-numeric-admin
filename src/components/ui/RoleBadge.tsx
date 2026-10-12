"use client";

import { Shield, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { AdminRole } from "@/types";

const ROLE_CONFIG: Record<
  AdminRole,
  { label: string; variant: "primary" | "info"; icon: typeof Shield }
> = {
  ADMIN: { label: "Administrateur", variant: "primary", icon: ShieldCheck },
  EDITOR: { label: "Éditeur", variant: "info", icon: Shield },
};

export function RoleBadge({ role }: { role: AdminRole }) {
  const config = ROLE_CONFIG[role];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

export { ROLE_CONFIG };