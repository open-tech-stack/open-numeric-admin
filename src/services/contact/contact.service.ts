import { CONTACTS_ENDPOINTS } from "@/endpoints/contacts.endpoints";
import type {
  ContactSubmission,
  ContactStatusUpdate,
  PaginatedResponse,
  SubmissionStatus,
} from "@/types";
import { httpClient } from "../core/http.service";

export interface QueryContactsParams {
  page?: number;
  limit?: number;
  status?: SubmissionStatus;
  search?: string;
}

export const contactService = {
  async list(params: QueryContactsParams = {}): Promise<PaginatedResponse<ContactSubmission>> {
    const search = new URLSearchParams();

    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.status) search.set("status", params.status);
    if (params.search) search.set("search", params.search);

    const qs = search.toString();
    return httpClient.get<PaginatedResponse<ContactSubmission>>(
      `${CONTACTS_ENDPOINTS.base}${qs ? `?${qs}` : ""}`,
    );
  },

  async getById(id: string): Promise<ContactSubmission> {
    return httpClient.get<ContactSubmission>(CONTACTS_ENDPOINTS.detail(id));
  },

  async updateStatus(id: string, data: ContactStatusUpdate): Promise<ContactSubmission> {
    return httpClient.patch<ContactSubmission>(
      CONTACTS_ENDPOINTS.updateStatus(id),
      data,
    );
  },

  async delete(id: string): Promise<{ success: true }> {
    return httpClient.delete<{ success: true }>(CONTACTS_ENDPOINTS.delete(id));
  },
};