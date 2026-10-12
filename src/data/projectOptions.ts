import type {
  ProjectCategory,
  ProjectLinkType,
  ProjectScope,
  ProjectStatus,
} from "@/types";

/* =========================================================
   CATEGORIES
   ========================================================= */

export const PROJECT_CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: "WEB", label: "Web" },
  { value: "MOBILE", label: "Mobile" },
  { value: "SOFTWARE", label: "Logiciel" },
  { value: "API", label: "API" },
  { value: "MODULE", label: "Module" },
  { value: "PACKAGE", label: "Package" },
  { value: "SERVICE", label: "Service" },
  { value: "IA", label: "IA" },
  { value: "DESIGN", label: "Design" },
  { value: "LOGO", label: "Logo" },
  { value: "TRAINING", label: "Formation" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "SALES", label: "Vente" },
];

/* =========================================================
   SCOPES
   ========================================================= */

export const PROJECT_SCOPES: { value: ProjectScope; label: string }[] = [
  { value: "INTERNAL", label: "Interne" },
  { value: "CLIENT", label: "Client" },
  { value: "PUBLIC", label: "Public" },
  { value: "OPEN_SOURCE", label: "Open Source" },
  { value: "EXTERNAL", label: "Externe" },
];

/* =========================================================
   STATUS
   ========================================================= */

export const PROJECT_STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: "COMPLETED", label: "Livré" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "PLANNED", label: "Prévu" },
  { value: "ARCHIVED", label: "Archivé" },
];

/* =========================================================
   LINK TYPES
   ========================================================= */

export const PROJECT_LINK_TYPES: {
  value: ProjectLinkType;
  label: string;
  icon: string;
}[] = [
  { value: "DEMO", label: "Démo", icon: "Play" },
  { value: "GITHUB", label: "GitHub", icon: "Github" },
  { value: "NPM", label: "npm", icon: "Package" },
  { value: "DOC", label: "Documentation", icon: "BookOpen" },
  { value: "SITE", label: "Site web", icon: "Globe" },
  { value: "STORE", label: "Store", icon: "ShoppingBag" },
  { value: "ARTICLE", label: "Article", icon: "FileText" },
];

/* =========================================================
   ICÔNES POUR LES FEATURES
   ========================================================= */

export const FEATURE_ICONS = [
  { value: "ShieldCheck", label: "Sécurité" },
  { value: "CreditCard", label: "Paiement" },
  { value: "BarChart3", label: "Analytics" },
  { value: "Users", label: "Multi-utilisateurs" },
  { value: "Zap", label: "Performance" },
  { value: "Smartphone", label: "Mobile" },
  { value: "Globe", label: "Web" },
  { value: "Layers", label: "Architecture" },
  { value: "Webhook", label: "Webhooks" },
  { value: "Package", label: "Package" },
  { value: "Accessibility", label: "Accessibilité" },
  { value: "Palette", label: "Design" },
  { value: "FileCode", label: "Code" },
  { value: "Bell", label: "Notifications" },
  { value: "Route", label: "Routing" },
  { value: "Cpu", label: "IA / CPU" },
  { value: "BookOpen", label: "Documentation" },
  { value: "Settings", label: "Configuration" },
  { value: "Clock", label: "Temps réel" },
  { value: "MapPin", label: "Géolocalisation" },
];