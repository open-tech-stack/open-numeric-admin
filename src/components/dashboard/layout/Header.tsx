"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/cn";
import ThemeSwitcher from "@/components/auth/ThemeSwitcher";

interface HeaderProps {
  /** Callback pour ouvrir la sidebar en mobile */
  onMenuClick: () => void;
}

/** Traduit un segment d'URL en titre lisible */
function getPageTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Tableau de bord";

  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1];

  const titles: Record<string, string> = {
    projects: "Projets",
    services: "Services",
    team: "Équipe",
    clients: "Clients",
    testimonials: "Témoignages",
    socials: "Réseaux sociaux",
    contacts: "Messages",
    quotes: "Devis",
    uploads: "Médias",
    settings: "Paramètres",
    admins: "Administrateurs",
  };

  return titles[last] ?? last.charAt(0).toUpperCase() + last.slice(1);
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [userMenuOpen]);

  const pageTitle = getPageTitle(pathname);

  return (
    <header
      className="sticky top-0 z-30 h-16 border-b bg-surface/80 backdrop-blur-md flex items-center px-4 sm:px-6 gap-4"
      style={{ borderColor: colors.border }}
    >
      {/* Burger mobile */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Ouvrir le menu"
        className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Titre */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
          {pageTitle}
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Theme */}
        <ThemeSwitcher compact />

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
        </button>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen((v) => !v)}
            aria-expanded={userMenuOpen}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">
                {user?.displayName?.charAt(0).toUpperCase() ?? "?"}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-foreground leading-tight">
                {user?.displayName ?? "Utilisateur"}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                {user?.role ?? "—"}
              </p>
            </div>
            <ChevronDown
              className={cn(
                "hidden sm:block h-4 w-4 transition-transform",
                userMenuOpen && "rotate-180",
              )}
            />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface shadow-2xl overflow-hidden z-50"
              >
                {/* Info utilisateur */}
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user?.displayName}
                  </p>
                  <p className="text-xs text-foreground-muted truncate">
                    {user?.email ?? user?.username}
                  </p>
                </div>

                {/* Actions */}
                <div className="p-1">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Paramètres
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Mon profil
                  </Link>
                </div>

                {/* Déconnexion */}
                <div className="p-1 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}