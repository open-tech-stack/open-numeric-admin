"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { DASHBOARD_NAV, type DashboardNavItem } from "@/data/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/cn";
import Logo from "@/components/auth/Logo";

interface SidebarProps {
  /** Sur mobile : panneau ouvert */
  mobileOpen: boolean;
  /** Sur mobile : ferme le panneau */
  onMobileClose: () => void;
  /** État réduit (contrôlé par le parent) */
  collapsed: boolean;
  /** Callback pour basculer réduit/étendu */
  onToggleCollapsed: () => void;
}

export default function Sidebar({
  mobileOpen,
  onMobileClose,
  collapsed,
  onToggleCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());

  /* Auto-ouvre les sous-menus actifs */
  useEffect(() => {
    const toOpen = new Set<string>();
    for (const section of DASHBOARD_NAV) {
      for (const item of section.items) {
        if (item.children?.some((child) => pathname.startsWith(child.href))) {
          toOpen.add(item.key);
        }
      }
    }
    setOpenSubmenus(toOpen);
  }, [pathname]);

  /* Ferme le menu mobile à chaque navigation */
  useEffect(() => {
    onMobileClose();
  }, [pathname, onMobileClose]);

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const isItemActive = (item: DashboardNavItem) =>
    pathname === item.href ||
    (item.children?.some((c) => pathname.startsWith(c.href)) ?? false);

  /* Filtre les items selon le rôle */
  const visibleSections = DASHBOARD_NAV.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) => !item.adminOnly || user?.role === "ADMIN",
    ),
  })).filter((section) => section.items.length > 0);

  const sidebarWidth = collapsed ? "w-20" : "w-72";

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onMobileClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen flex flex-col border-r transition-all duration-300",
          sidebarWidth,
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        style={{
          backgroundColor: colors.sidebarBg,
          borderColor: colors.sidebarBorder,
        }}
      >
        {/* HEADER */}
        <div
          className={cn(
            "flex items-center h-16 border-b flex-shrink-0 px-3",
            collapsed ? "justify-center" : "justify-between",
          )}
          style={{ borderColor: colors.sidebarBorder }}
        >
          {!collapsed && <Logo size="sm" />}

          {/* Bouton collapse (desktop) */}
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Étendre la sidebar" : "Réduire la sidebar"}
            className={cn(
              "hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted transition-colors",
              "hover:bg-surface-hover hover:text-foreground",
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          {/* Bouton fermer (mobile) */}
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Fermer"
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2">
          {visibleSections.map((section) => (
            <div key={section.title} className="mb-4">
              {/* Titre de section */}
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">
                  {section.title}
                </p>
              )}

              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = isItemActive(item);
                  const hasChildren = (item.children?.length ?? 0) > 0;
                  const isSubmenuOpen = openSubmenus.has(item.key);

                  const Icon = item.icon;

                  return (
                    <li key={item.key}>
                      {hasChildren ? (
                        <>
                          <button
                            type="button"
                            onClick={() => toggleSubmenu(item.key)}
                            title={collapsed ? item.label : undefined}
                            className={cn(
                              "w-full flex items-center gap-3 rounded-lg transition-colors",
                              collapsed
                                ? "justify-center h-11 w-11 mx-auto"
                                : "px-3 py-2.5",
                              isActive
                                ? "bg-primary-soft text-primary font-semibold"
                                : "text-foreground-muted hover:bg-surface-hover hover:text-foreground",
                            )}
                          >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            {!collapsed && (
                              <>
                                <span className="flex-1 text-left text-sm">
                                  {item.label}
                                </span>
                                <ChevronDown
                                  className={cn(
                                    "h-4 w-4 transition-transform",
                                    isSubmenuOpen && "rotate-180",
                                  )}
                                />
                              </>
                            )}
                          </button>

                          {/* Sous-menu */}
                          <AnimatePresence initial={false}>
                            {isSubmenuOpen && !collapsed && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pl-11 pr-3 mt-1 space-y-0.5"
                              >
                                {item.children!.map((child) => {
                                  const childActive = pathname === child.href;
                                  return (
                                    <li key={child.href}>
                                      <Link
                                        href={child.href}
                                        className={cn(
                                          "block px-3 py-2 rounded-md text-xs transition-colors",
                                          childActive
                                            ? "text-primary font-semibold bg-primary-soft"
                                            : "text-foreground-muted hover:text-foreground hover:bg-surface-hover",
                                        )}
                                      >
                                        {child.label}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          title={collapsed ? item.label : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-lg transition-colors",
                            collapsed
                              ? "justify-center h-11 w-11 mx-auto"
                              : "px-3 py-2.5",
                            isActive
                              ? "bg-primary-soft text-primary font-semibold"
                              : "text-foreground-muted hover:bg-surface-hover hover:text-foreground",
                          )}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />

                          {!collapsed && (
                            <>
                              <span className="flex-1 text-sm">{item.label}</span>
                              {item.badge && item.badge > 0 && (
                                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                                  {item.badge > 99 ? "99+" : item.badge}
                                </span>
                              )}
                            </>
                          )}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* FOOTER — user + logout */}
        <div
          className="border-t flex-shrink-0 p-3"
          style={{ borderColor: colors.sidebarBorder }}
        >
          {collapsed ? (
            <button
              type="button"
              onClick={() => logout()}
              title="Déconnexion"
              aria-label="Déconnexion"
              className="flex h-11 w-11 mx-auto items-center justify-center rounded-lg text-foreground-muted hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">
                  {user?.displayName?.charAt(0).toUpperCase() ?? "?"}
                </span>
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user?.displayName ?? "Utilisateur"}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                  {user?.role ?? "—"}
                </p>
              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={() => logout()}
                title="Déconnexion"
                aria-label="Déconnexion"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted hover:bg-red-500/10 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}