import type { BaseTranslation } from "./common.types";

/* =========================================================
   TRADUCTIONS
   ========================================================= */

export interface ServiceTranslation extends BaseTranslation {
  name: string;
  heroTitle: string | null;
  heroTitleHighlight: string | null;
  heroSubtitle: string | null;
}

export interface ServiceCategoryTranslation extends BaseTranslation {
  name: string;
  description: string | null;
}

export interface ServiceItemTranslation extends BaseTranslation {
  name: string;
  description: string | null;
}

/* =========================================================
   ITEM
   ========================================================= */

export interface ServiceItem {
  id: string;
  key: string;
  image: string | null;
  icon: string | null;
  order: number;
  translations: ServiceItemTranslation[];
}

export interface ServiceItemCreateInput {
  key: string;
  image?: string;
  icon?: string;
  order?: number;
  translations: ServiceItemTranslation[];
}

/* =========================================================
   CATÉGORIE
   ========================================================= */

export interface ServiceCategory {
  id: string;
  key: string;
  icon: string;
  accent: string;
  order: number;
  translations: ServiceCategoryTranslation[];
  items: ServiceItem[];
}

export interface ServiceCategoryCreateInput {
  key: string;
  icon: string;
  accent: string;
  order?: number;
  translations: ServiceCategoryTranslation[];
  items?: ServiceItemCreateInput[];
}

/* =========================================================
   SERVICE
   ========================================================= */

export interface Service {
  id: string;
  key: string;
  slug: string;
  href: string;
  icon: string;
  accent: string;
  order: number;
  isActive: boolean;
  translations: ServiceTranslation[];
  categories: ServiceCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCreateInput {
  key: string;
  slug: string;
  href: string;
  icon: string;
  accent: string;
  order?: number;
  isActive?: boolean;
  translations: ServiceTranslation[];
}

export type ServiceUpdateInput = Partial<Omit<ServiceCreateInput, "key">>;