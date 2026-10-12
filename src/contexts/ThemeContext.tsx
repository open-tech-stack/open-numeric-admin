"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* =========================================================
   TYPES
   ========================================================= */

export type AdminTheme = "dark-orange" | "dark-blue";

export interface ThemeColors {
  /** Fond principal */
  background: string;
  /** Fond secondaire (alt) */
  backgroundAlt: string;
  /** Surface (cartes, tableaux) */
  surface: string;
  /** Surface au hover */
  surfaceAlt: string;

  /** Texte principal */
  text: string;
  /** Texte secondaire */
  textSecondary: string;
  /** Texte discret */
  textMuted: string;

  /** Bordures */
  border: string;
  /** Bordures fortes */
  borderStrong: string;

  /** Couleur primaire */
  primary: string;
  /** Primaire au hover */
  primaryHover: string;
  /** Texte sur primaire */
  onPrimary: string;
  /** Primaire soft (bg) */
  primarySoft: string;

  /** États */
  success: string;
  warning: string;
  danger: string;

  /** Sidebar */
  sidebarBg: string;
  sidebarBorder: string;
  sidebarText: string;
  sidebarTextActive: string;
  sidebarBgActive: string;
}

/* =========================================================
   PALETTES
   ========================================================= */

const COLORS: Record<AdminTheme, ThemeColors> = {
  "dark-orange": {
    background: "#15100a",
    backgroundAlt: "#1f160d",
    surface: "#251a10",
    surfaceAlt: "#352413",

    text: "#fff4e6",
    textSecondary: "#d4a878",
    textMuted: "#9c7a52",

    border: "#3a2818",
    borderStrong: "#5a3d24",

    primary: "#f97316",
    primaryHover: "#fb923c",
    onPrimary: "#ffffff",
    primarySoft: "rgba(249, 115, 22, 0.15)",

    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",

    sidebarBg: "#1a120b",
    sidebarBorder: "#3a2818",
    sidebarText: "#d4a878",
    sidebarTextActive: "#fb923c",
    sidebarBgActive: "rgba(249, 115, 22, 0.12)",
  },

  "dark-blue": {
    background: "#0a1128",
    backgroundAlt: "#0f1a3a",
    surface: "#14224a",
    surfaceAlt: "#1c2e5e",

    text: "#e0eaff",
    textSecondary: "#93a8d4",
    textMuted: "#5e73a3",

    border: "#1e2f5e",
    borderStrong: "#2f4585",

    primary: "#3b82f6",
    primaryHover: "#60a5fa",
    onPrimary: "#ffffff",
    primarySoft: "rgba(59, 130, 246, 0.18)",

    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",

    sidebarBg: "#0a1128",
    sidebarBorder: "#1e2f5e",
    sidebarText: "#93a8d4",
    sidebarTextActive: "#60a5fa",
    sidebarBgActive: "rgba(59, 130, 246, 0.15)",
  },
};

/* =========================================================
   META THÈMES (pour le sélecteur)
   ========================================================= */

export const ADMIN_THEMES: {
  value: AdminTheme;
  label: string;
  preview: string;
}[] = [
  {
    value: "dark-orange",
    label: "Orange",
    preview: "linear-gradient(135deg, #15100a 0%, #f97316 100%)",
  },
  {
    value: "dark-blue",
    label: "Bleu",
    preview: "linear-gradient(135deg, #0a1128 0%, #3b82f6 100%)",
  },
];

const DEFAULT_THEME: AdminTheme = "dark-orange";
const STORAGE_KEY = "open-numeric-admin-theme";

/* =========================================================
   CONTEXT
   ========================================================= */

interface ThemeContextValue {
  theme: AdminTheme;
  /** Palette de couleurs du thème actif (utile pour les inline styles) */
  colors: ThemeColors;
  setTheme: (theme: AdminTheme) => void;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as AdminTheme | null;
    const valid = ADMIN_THEMES.some((t) => t.value === stored);
    const initial = valid ? (stored as AdminTheme) : DEFAULT_THEME;

    setThemeState(initial);
    document.documentElement.setAttribute("data-theme", initial);
    setMounted(true);
  }, []);

  const setTheme = useCallback((newTheme: AdminTheme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next: AdminTheme = current === "dark-orange" ? "dark-blue" : "dark-orange";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: COLORS[theme],
        setTheme,
        toggleTheme,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme doit être utilisé dans <ThemeProvider>");
  return ctx;
}