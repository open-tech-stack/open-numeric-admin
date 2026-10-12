"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface LogoProps {
  /** Affiche le texte à côté du logo */
  showText?: boolean;
  /** Taille du logo */
  size?: "sm" | "md" | "lg";
  /** Lien (si true, enveloppe dans <Link />) */
  linked?: boolean;
  /** Classes additionnelles */
  className?: string;
}

const SIZES = {
  sm: { container: "h-8 w-8", text: "text-base" },
  md: { container: "h-10 w-10", text: "text-lg" },
  lg: { container: "h-14 w-14", text: "text-2xl" },
};

export default function Logo({
  showText = true,
  size = "md",
  linked = false,
  className,
}: LogoProps) {
  const s = SIZES[size];

  const content = (
    <div className={cn("flex items-center gap-3 group", className)}>
      <motion.div
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={cn(
          "rounded-full overflow-hidden ring-2 ring-primary/40 group-hover:ring-primary transition-all shadow-md flex-shrink-0",
          s.container,
        )}
      >
        <Image
          src="/images/logo.png"
          alt="Open Numeric"
          width={size === "lg" ? 56 : size === "sm" ? 32 : 40}
          height={size === "lg" ? 56 : size === "sm" ? 32 : 40}
          className="h-full w-full object-cover"
          priority
        />
      </motion.div>

      {showText && (
        <span
          className={cn(
            "font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent whitespace-nowrap",
            s.text,
          )}
        >
          Open Numeric
        </span>
      )}
    </div>
  );

  if (linked) {
    return <Link href="/dashboard">{content}</Link>;
  }

  return content;
}