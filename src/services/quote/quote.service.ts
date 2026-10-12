import { QUOTES_ENDPOINTS } from "@/endpoints/quotes.endpoints";
import type {
  PaginatedResponse,
  QuoteRequest,
  QuoteStatusUpdate,
  SubmissionStatus,
} from "@/types";
import { httpClient } from "../core/http.service";

export interface QueryQuotesParams {
  page?: number;
  limit?: number;
  status?: SubmissionStatus;
  projectType?: string;
  search?: string;
}

export const quoteService = {
  async list(params: QueryQuotesParams = {}): Promise<PaginatedResponse<QuoteRequest>> {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.status) search.set("status", params.status);
    if (params.projectType) search.set("projectType", params.projectType);
    if (params.search) search.set("search", params.search);
    const qs = search.toString();
    return httpClient.get<PaginatedResponse<QuoteRequest>>(
      `${QUOTES_ENDPOINTS.base}${qs ? `?${qs}` : ""}`,
    );
  },

  async getById(id: string): Promise<QuoteRequest> {
    return httpClient.get<QuoteRequest>(QUOTES_ENDPOINTS.detail(id));
  },

  async updateStatus(id: string, data: QuoteStatusUpdate): Promise<QuoteRequest> {
    return httpClient.patch<QuoteRequest>(QUOTES_ENDPOINTS.updateStatus(id), data);
  },

  async delete(id: string): Promise<{ success: true }> {
    return httpClient.delete<{ success: true }>(QUOTES_ENDPOINTS.delete(id));
  },
};