"use client";

import { motion } from "framer-motion";
import {
  FolderKanban,
  Briefcase,
  Users,
  MessageSquare,
  FileText,
  TrendingUp,
  ArrowRight,
  Clock,
  Mail,
  MessageSquareQuote,
  Compass,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useStats } from "@/hooks/useStats";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/cn";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DashboardHome() {
  const { user } = useAuth();
  const { data, loading, error } = useStats();

  const c = data?.content;
  const i = data?.interactions;
  const a = data?.activity;

  /* =========================================================
     Cartes principales — dérivées des vraies données
     ========================================================= */
  const stats = [
    {
      key: "projects",
      label: "Projets",
      value: c?.projects.total ?? 0,
      hint: c ? `${c.projects.active} actifs · ${c.projects.featured} featured` : undefined,
      icon: FolderKanban,
      href: "/dashboard/projects",
      accent: "from-blue-500 to-cyan-500",
    },
    {
      key: "services",
      label: "Services",
      value: c?.services.total ?? 0,
      hint: c ? `${c.services.active} actifs` : undefined,
      icon: Briefcase,
      href: "/dashboard/services",
      accent: "from-emerald-500 to-teal-500",
    },
    {
      key: "team",
      label: "Équipe",
      value: c?.team.total ?? 0,
      hint: c ? `${c.team.active} actifs` : undefined,
      icon: Users,
      href: "/dashboard/team",
      accent: "from-purple-500 to-pink-500",
    },
    {
      key: "contacts",
      label: "Messages",
      value: i?.contacts.total ?? 0,
      hint: i ? `${i.contacts.new} nouveaux · ${i.contacts.last7Days} / 7j` : undefined,
      icon: MessageSquare,
      href: "/dashboard/contacts",
      accent: "from-amber-500 to-orange-500",
    },
    {
      key: "quotes",
      label: "Devis",
      value: i?.quotes.total ?? 0,
      hint: i ? `${i.quotes.new} nouveaux · ${i.quotes.last7Days} / 7j` : undefined,
      icon: FileText,
      href: "/dashboard/quotes",
      accent: "from-rose-500 to-pink-500",
    },
  ];

  /* =========================================================
     Répartition projets (top 5)
     ========================================================= */
  const topCategories = c
    ? Object.entries(c.projects.byCategory)
        .sort(([, x], [, y]) => y - x)
        .slice(0, 5)
    : [];

  const topScopes = c
    ? Object.entries(c.projects.byScope)
        .sort(([, x], [, y]) => y - x)
        .slice(0, 5)
    : [];

  const maxCategory = topCategories[0]?.[1] ?? 1;
  const maxScope = topScopes[0]?.[1] ?? 1;

  return (
    <div className="space-y-8">
      {/* =========================================================
          HERO
         ========================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <p className="text-sm text-foreground-muted mb-2">Bienvenue,</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
              {user?.displayName ?? "Utilisateur"} 👋
            </h1>
            <p className="text-base text-foreground-muted max-w-2xl">
              Voici un aperçu de votre espace d'administration. Gérez vos projets,
              services, équipe et communications depuis ce tableau de bord.
            </p>
          </div>
        </div>
      </motion.div>

      {/* =========================================================
          ERREUR
         ========================================================= */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* =========================================================
          APERÇU — 5 cartes
         ========================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Aperçu
          </h2>
          {data?.generatedAt && (
            <p className="text-xs text-foreground-subtle inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {new Date(data.generatedAt).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link href={stat.href}>
                  <Card hover padded className="cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform group-hover:scale-110",
                          stat.accent,
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-foreground-subtle group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>

                    {loading ? (
                      <div className="mt-4 h-9 w-20 animate-pulse rounded-lg bg-surface-hover" />
                    ) : (
                      <p className="mt-4 text-3xl font-black text-foreground tabular-nums">
                        {stat.value}
                      </p>
                    )}

                    <p className="text-sm text-foreground-muted mt-1">
                      {stat.label}
                    </p>

                    {stat.hint && !loading && (
                      <p className="text-xs text-foreground-subtle mt-1.5">
                        {stat.hint}
                      </p>
                    )}
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          RÉPARTITION PROJETS — byCategory / byScope
         ========================================================= */}
      {c && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <Card padded>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-primary" />
                  Projets par catégorie
                </span>
              }
              action={
                <span className="text-xs text-foreground-subtle tabular-nums">
                  {c.projects.total} total
                </span>
              }
            />
            <CardBody className="pb-0">
              {topCategories.length === 0 ? (
                <EmptyState
                  icon={Compass}
                  title="Aucune catégorie"
                  description="Les projets n'ont pas encore de catégorie."
                />
              ) : (
                <div className="space-y-3.5">
                  {topCategories.map(([label, value]) => (
                    <ProgressBar
                      key={label}
                      label={label}
                      value={value}
                      max={maxCategory}
                      rightLabel={value}
                    />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card padded>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Projets par scope
                </span>
              }
            />
            <CardBody className="pb-0">
              {topScopes.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  title="Aucun scope"
                  description="Aucun scope défini pour l'instant."
                />
              ) : (
                <div className="space-y-3.5">
                  {topScopes.map(([label, value]) => (
                    <ProgressBar
                      key={label}
                      label={label}
                      value={value}
                      max={maxScope}
                      rightLabel={value}
                    />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* =========================================================
          INTERACTIONS — contacts & devis par statut
         ========================================================= */}
      {i && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <StatusBreakdown title="Messages par statut" data={i.contacts} icon={Mail} />
          <StatusBreakdown title="Devis par statut" data={i.quotes} icon={MessageSquareQuote} />
        </motion.div>
      )}

      {/* =========================================================
          ACTIVITÉ RÉCENTE
         ========================================================= */}
      {a && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <RecentList
            title="Derniers messages"
            icon={Mail}
            items={a.lastContacts.map((x) => ({
              id: x.id,
              primary: x.subject,
              secondary: `${x.name} · ${x.email}`,
              status: x.status,
              createdAt: x.createdAt,
              href: `/dashboard/contacts?id=${x.id}`,
            }))}
            emptyLabel="Aucun message"
          />

          <RecentList
            title="Derniers devis"
            icon={MessageSquareQuote}
            items={a.lastQuotes.map((x) => ({
              id: x.id,
              primary: x.projectType,
              secondary: `${x.name} · ${x.email}`,
              status: x.status,
              createdAt: x.createdAt,
              href: `/dashboard/quotes?id=${x.id}`,
            }))}
            emptyLabel="Aucun devis"
          />
        </motion.div>
      )}
    </div>
  );
}

/* =========================================================
   Sous-composants locaux
   ========================================================= */

function StatusBreakdown({
  title,
  data,
  icon: Icon,
}: {
  title: string;
  data: {
    total: number;
    new: number;
    read: number;
    replied: number;
    archived: number;
    spam: number;
  };
  icon: React.ElementType;
}) {
  const rows = [
    { key: "new", label: "Nouveaux", value: data.new, color: "text-blue-400" },
    { key: "read", label: "Lus", value: data.read, color: "text-amber-400" },
    { key: "replied", label: "Répondus", value: data.replied, color: "text-emerald-400" },
    { key: "archived", label: "Archivés", value: data.archived, color: "text-foreground-muted" },
    { key: "spam", label: "Spam", value: data.spam, color: "text-red-400" },
  ];

  return (
    <Card padded>
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" />
            {title}
          </span>
        }
        action={
          <span className="text-xs text-foreground-subtle tabular-nums">
            {data.total} total
          </span>
        }
      />
      <CardBody className="pb-0">
        <div className="grid grid-cols-5 gap-2">
          {rows.map((r) => (
            <div
              key={r.key}
              className="rounded-xl border border-border bg-background-alt p-3 text-center"
            >
              <p className={cn("text-lg font-black tabular-nums", r.color)}>
                {r.value}
              </p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-foreground-subtle mt-0.5">
                {r.label}
              </p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function RecentList({
  title,
  icon: Icon,
  items,
  emptyLabel,
}: {
  title: string;
  icon: React.ElementType;
  items: {
    id: string;
    primary: string;
    secondary: string;
    status: string;
    createdAt: string;
    href: string;
  }[];
  emptyLabel: string;
}) {
  return (
    <Card padded>
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" />
            {title}
          </span>
        }
      />
      <CardBody className="pb-0">
        {items.length === 0 ? (
          <EmptyState icon={Icon} title={emptyLabel} />
        ) : (
          <ul className="divide-y divide-border">
            {items.map((x) => (
              <li key={x.id}>
                <Link
                  href={x.href}
                  className="flex items-center gap-3 py-2.5 -mx-2 px-2 rounded-lg hover:bg-surface-hover transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {x.primary}
                    </p>
                    <p className="text-xs text-foreground-muted truncate">
                      {x.secondary}
                    </p>
                  </div>
                  <StatusBadge status={x.status as never} />
                  <span className="hidden sm:block text-[11px] text-foreground-subtle whitespace-nowrap tabular-nums">
                    {new Date(x.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}