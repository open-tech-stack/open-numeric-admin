"use client";

import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaGithub,
  FaTiktok,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaReddit,
  FaPinterest,
  FaSnapchat,
  FaDribbble,
  FaBehance,
  FaMedium,
  FaTwitch,
  FaSkype,
  FaSlack,
  FaStackOverflow,
} from "react-icons/fa";
import type { IconType } from "react-icons";

import {
  SiX,
  SiThreads,
  SiMastodon,
} from "react-icons/si";

/* =========================================================
   MAP
   ========================================================= */

const BRAND_ICONS: Record<string, IconType> = {
  /* Font Awesome (fa) */
  Facebook: FaFacebookF,
  Twitter: FaTwitter,
  Linkedin: FaLinkedinIn,
  Instagram: FaInstagram,
  Youtube: FaYoutube,
  Github: FaGithub,
  Tiktok: FaTiktok,
  Whatsapp: FaWhatsapp,
  Telegram: FaTelegram,
  Discord: FaDiscord,
  Reddit: FaReddit,
  Pinterest: FaPinterest,
  Snapchat: FaSnapchat,
  Dribbble: FaDribbble,
  Behance: FaBehance,
  Medium: FaMedium,
  Twitch: FaTwitch,
  Skype: FaSkype,
  Slack: FaSlack,
  StackOverflow: FaStackOverflow,

  /* Simple Icons (si) */
  X: SiX,
  Threads: SiThreads,
  Mastodon: SiMastodon,
};

/* =========================================================
   COMPOSANT
   ========================================================= */

interface BrandIconProps {
  name: string;
  className?: string;
}

export default function BrandIcon({ name, className }: BrandIconProps) {
  const Brand = BRAND_ICONS[name];
  if (!Brand) return null;
  return <Brand className={className} />;
}

/* =========================================================
   HELPERS
   ========================================================= */

/** Liste des noms valides (pour le formulaire Socials) */
export const BRAND_ICON_NAMES = Object.keys(BRAND_ICONS);

/** Vérifie si un nom est une icône de marque valide */
export function isBrandIcon(name: string): boolean {
  return name in BRAND_ICONS;
}