import type { BaseTranslation } from "./common.types";

export interface SiteSettingsTranslation extends BaseTranslation {
  tagline: string | null;
  about: string | null;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  logo: string;
  favicon: string | null;
  email: string;
  emailSecondary: string | null;
  phone: string;
  phoneSecondary: string | null;
  whatsapp: string | null;
  whatsappSecondary: string | null;
  address: string;
  mapEmbedUrl: string | null;
  availability: string;
  defaultMetaTitle: string | null;
  defaultMetaDescription: string | null;
  googleAnalyticsId: string | null;
  translations: SiteSettingsTranslation[];
  updatedAt: string;
}

export interface SiteSettingsUpdateInput {
  siteName?: string;
  logo?: string;
  favicon?: string;
  email?: string;
  emailSecondary?: string;
  phone?: string;
  phoneSecondary?: string;
  whatsapp?: string;
  whatsappSecondary?: string;
  address?: string;
  mapEmbedUrl?: string;
  availability?: string;
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  googleAnalyticsId?: string;
  translations?: SiteSettingsTranslation[];
}