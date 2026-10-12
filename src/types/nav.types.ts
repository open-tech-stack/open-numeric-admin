import { Locale } from ".";

export interface NavTranslation {
  locale: Locale;
  label: string;
}

export interface NavItem {
  id: string;
  key: string;
  href: string;
  order: number;
  isActive: boolean;
  parentId: string | null;
  translations: NavTranslation[];
  children: NavItem[];
}

/* ============================================================
   Payloads API
   ============================================================ */

export interface NavTranslationInput {
  locale: Locale;
  label: string;
}

export interface CreateNavItemInput {
  key: string;
  href: string;
  order?: number;
  isActive?: boolean;
  parentId?: string | null;
  translations: NavTranslationInput[];
}

export type UpdateNavItemInput = Partial<Omit<CreateNavItemInput, "key">>;

export interface NavReorderItem {
  id: string;
  order: number;
  parentId: string | null;
}

export interface ReorderNavInput {
  items: NavReorderItem[];
}