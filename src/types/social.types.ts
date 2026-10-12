export interface Social {
  id: string;
  /** Clé unique : "facebook", "twitter", "linkedin", "instagram" */
  key: string;
  /** Nom d'icône Lucide : "Facebook", "Twitter", "Linkedin", "Instagram" */
  icon: string;
  url: string;
  /** Classe Tailwind de hover : "hover:text-blue-600" */
  hoverColor: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SocialCreateInput {
  key: string;
  icon: string;
  url: string;
  hoverColor: string;
  order?: number;
  isActive?: boolean;
}

export type SocialUpdateInput = Partial<Omit<SocialCreateInput, "key">>;