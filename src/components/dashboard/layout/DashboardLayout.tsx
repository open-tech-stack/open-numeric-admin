"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/cn";
import Sidebar from "./Sidebar";
import Header from "./Header";

const STORAGE_KEY = "open-numeric-sidebar-collapsed";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { colors } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  /* Restaure l'état collapsed depuis localStorage */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "1") setCollapsed(true);
  }, []);

  /* Toggle + persistance */
  const toggleCollapsed = () => {
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
      />

      {/* Contenu principal — marge dynamique selon l'état collapsed */}
      <div
        className={cn(
          "transition-[padding] duration-300",
          collapsed ? "lg:pl-20" : "lg:pl-72",
        )}
      >
        <Header onMenuClick={() => setMobileOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}