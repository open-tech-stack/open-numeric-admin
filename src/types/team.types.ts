import type { BaseTranslation } from "./common.types";

export interface TeamMemberTranslation extends BaseTranslation {
  name: string;
  role: string;
  bio: string;
}

export interface TeamMember {
  id: string;
  key: string;
  image: string;
  linkedin: string | null;
  twitter: string | null;
  order: number;
  isActive: boolean;
  translations: TeamMemberTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberCreateInput {
  key: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  order?: number;
  isActive?: boolean;
  translations: TeamMemberTranslation[];
}

export type TeamMemberUpdateInput = Partial<Omit<TeamMemberCreateInput, "key">>;