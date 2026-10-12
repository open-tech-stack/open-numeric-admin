import type { SubmissionStatus } from "./api.types";

/* ============================================================
   Réponses backend — /api/stats
   ============================================================ */

export interface StatsProjects {
  total: number;
  active: number;
  featured: number;
  published: number;
  inProgress: number;
  byCategory: Record<string, number>;
  byScope: Record<string, number>;
}

export interface StatsSimpleEntity {
  total: number;
  active: number;
}

export interface StatsContacts {
  total: number;
  new: number;
  read: number;
  replied: number;
  archived: number;
  spam: number;
  last7Days: number;
}

export type StatsQuotes = StatsContacts; // même forme

export interface RecentContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: SubmissionStatus;
  createdAt: string;
}

export interface RecentQuote {
  id: string;
  name: string;
  email: string;
  projectType: string;
  status: SubmissionStatus;
  createdAt: string;
}

export interface StatsResponse {
  content: {
    projects: StatsProjects;
    services: StatsSimpleEntity;
    team: StatsSimpleEntity;
    clients: StatsSimpleEntity;
    testimonials: StatsSimpleEntity;
    socials: StatsSimpleEntity;
    navigation: StatsSimpleEntity;
  };
  interactions: {
    contacts: StatsContacts;
    quotes: StatsQuotes;
  };
  activity: {
    lastContacts: RecentContact[];
    lastQuotes: RecentQuote[];
  };
  generatedAt: string;
}