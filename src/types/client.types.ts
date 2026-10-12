export interface Client {
  id: string;
  name: string;
  logo: string;
  url: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientCreateInput {
  name: string;
  logo: string;
  url?: string;
  order?: number;
  isActive?: boolean;
}

export type ClientUpdateInput = Partial<ClientCreateInput>;