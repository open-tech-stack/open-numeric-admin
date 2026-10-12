import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    // Autorise les formats modernes
    formats: ["image/avif", "image/webp"],

    // Domaines autorisés
    remotePatterns: [
      // ─────────────────────────────────────────────
      // Banques d'images & stocks
      // ─────────────────────────────────────────────
      { protocol: "https", hostname: "img.freepik.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "media.istockphoto.com" },
      { protocol: "https", hostname: "static.vecteezy.com" },

      // ─────────────────────────────────────────────
      // Hébergement d'images / CDN
      // ─────────────────────────────────────────────
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "user-images.githubusercontent.com" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "*.githubusercontent.com" },

      // ─────────────────────────────────────────────
      // Storage cloud (si tu migres plus tard)
      // ─────────────────────────────────────────────
      { protocol: "https", hostname: "*.amazonaws.com" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.blob.core.windows.net" },

      // ─────────────────────────────────────────────
      // Autres services
      // ─────────────────────────────────────────────
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "www.gravatar.com" },
      { protocol: "https", hostname: "secure.gravatar.com" },
      { protocol: "https", hostname: "ui-avatars.com" },

      // ─────────────────────────────────────────────
      // Ton propre domaine (production)
      // ─────────────────────────────────────────────
      { protocol: "https", hostname: "open-numeric.com" },
      { protocol: "https", hostname: "*.open-numeric.com" },
      { protocol: "https", hostname: "*.vercel.app" },

      // ─────────────────────────────────────────────
      // Développement local (API backend)
      // ─────────────────────────────────────────────
      { protocol: "http", hostname: "localhost", port: "5000" },
    ],

    // Domaines legacy (si tu utilises des URLs sans sous-domaine wildcard)
    domains: [],

    // Cache : 60 jours
    minimumCacheTTL: 60 * 60 * 24 * 60,
  },
};
