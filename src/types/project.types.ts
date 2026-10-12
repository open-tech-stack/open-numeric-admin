import type { BaseTranslation } from "./common.types";

/* =========================================================
   ENUMS
   ========================================================= */

export type ProjectCategory =
  | "WEB"
  | "MOBILE"
  | "SOFTWARE"
  | "API"
  | "MODULE"
  | "PACKAGE"
  | "SERVICE"
  | "IA"
  | "DESIGN"
  | "LOGO"
  | "TRAINING"
  | "MAINTENANCE"
  | "SALES";

export type ProjectScope =
  | "INTERNAL"
  | "CLIENT"
  | "PUBLIC"
  | "OPEN_SOURCE"
  | "EXTERNAL";

export type ProjectStatus =
  | "COMPLETED"
  | "IN_PROGRESS"
  | "PLANNED"
  | "ARCHIVED";

export type ProjectLinkType =
  | "DEMO"
  | "GITHUB"
  | "NPM"
  | "DOC"
  | "SITE"
  | "STORE"
  | "ARTICLE";

/* =========================================================
   SOUS-ENTITÉS
   ========================================================= */

export interface ProjectTranslation extends BaseTranslation {
  title: string;
  description: string;
  longDescription?: string | null;
}

export interface ProjectGalleryTranslation extends BaseTranslation {
  caption: string;
}

export interface ProjectGalleryItem {
  id: string;
  src: string;
  order: number;
  translations: ProjectGalleryTranslation[];
}

export interface ProjectFeatureTranslation extends BaseTranslation {
  title: string;
  description: string;
}

export interface ProjectFeatureItem {
  id: string;
  key: string;
  icon: string;
  order: number;
  translations: ProjectFeatureTranslation[];
}

export interface ProjectLinkItem {
  id: string;
  type: ProjectLinkType;
  url: string;
  order: number;
}

export interface ProjectClient {
  id: string;
  name: string;
  logo: string;
  url: string | null;
}

/* =========================================================
   PROJET
   ========================================================= */

export interface Project {
  id: string;
  slug: string;
  cover: string;
  heroImage: string | null;
  category: ProjectCategory;
  scope: ProjectScope;
  status: ProjectStatus;
  year: number;
  tech: string[];
  tags: string[];
  featured: boolean;
  order: number;
  isActive: boolean;
  clientId: string | null;
  client: ProjectClient | null;
  translations: ProjectTranslation[];
  gallery: ProjectGalleryItem[];
  features: ProjectFeatureItem[];
  links: ProjectLinkItem[];
  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   INPUTS (ce qu'on envoie au backend)
   ========================================================= */

export interface ProjectCreateInput {
  slug: string;
  cover: string;
  heroImage?: string;
  category: ProjectCategory;
  scope: ProjectScope;
  status?: ProjectStatus;
  year: number;
  tech: string[];
  tags: string[];
  featured?: boolean;
  order?: number;
  isActive?: boolean;
  clientId?: string | null;
  translations: ProjectTranslation[];
  gallery?: {
    src: string;
    order?: number;
    translations: ProjectGalleryTranslation[];
  }[];
  features?: {
    key: string;
    icon: string;
    order?: number;
    translations: ProjectFeatureTranslation[];
  }[];
  links?: {
    type: ProjectLinkType;
    url: string;
    order?: number;
  }[];
}

export type ProjectUpdateInput = Partial<Omit<ProjectCreateInput, "slug">>;