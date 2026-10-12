import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Users,
  Building2,
  Star,
  Share2,
  MessageSquare,
  FileText,
  Navigation,
  Settings,
  Shield,
  type LucideIcon,
} from "lucide-react";

export interface DashboardNavItem {
  key: string;
  /** Clé i18n ou label direct */
  label: string;
  href: string;
  icon: LucideIcon;
  /** Sous-menu (optionnel) */
  children?: {
    label: string;
    href: string;
  }[];
  /** Badge (ex: nombre de messages non lus) */
  badge?: number;
  /** Réservé aux ADMIN */
  adminOnly?: boolean;
}

export interface DashboardNavSection {
  title: string;
  items: DashboardNavItem[];
}

export const DASHBOARD_NAV: DashboardNavSection[] = [
  {
    title: "Général",
    items: [
      {
        key: "dashboard",
        label: "Tableau de bord",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Contenu",
    items: [
      {
        key: "projects",
        label: "Projets",
        href: "/dashboard/projects",
        icon: FolderKanban,
      },
      {
        key: "services",
        label: "Services",
        href: "/dashboard/services",
        icon: Briefcase,
      },
      {
        key: "team",
        label: "Équipe",
        href: "/dashboard/team",
        icon: Users,
      },
      {
        key: "clients",
        label: "Clients",
        href: "/dashboard/clients",
        icon: Building2,
      },
      {
        key: "testimonials",
        label: "Témoignages",
        href: "/dashboard/testimonials",
        icon: Star,
      },
      {
        key: "socials",
        label: "Réseaux sociaux",
        href: "/dashboard/socials",
        icon: Share2,
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        key: "contacts",
        label: "Messages",
        href: "/dashboard/contacts",
        icon: MessageSquare,
      },
      {
        key: "quotes",
        label: "Devis",
        href: "/dashboard/quotes",
        icon: FileText,
      },
    ],
  },
  {
    title: "Ressources",
    items: [
      {
        key: "settings",
        label: "Paramètres",
        href: "/dashboard/settings",
        icon: Settings,
        adminOnly: true,
      },
      {
        key: "navigations",
        label: "Navigation",
        href: "/dashboard/navigations",
        icon: Navigation,
        adminOnly: true,
      },
      {
        key: "admins",
        label: "Administrateurs",
        href: "/dashboard/admins",
        icon: Shield,
        adminOnly: true,
      },
    ],
  },
];