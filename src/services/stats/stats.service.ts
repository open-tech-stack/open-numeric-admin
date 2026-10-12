import { STATS_ENDPOINTS } from "@/endpoints/stats.endpoints";
import type { StatsResponse } from "@/types";
import { httpClient } from "../core/http.service";

export const statsService = {
  async get(): Promise<StatsResponse> {
    return httpClient.get<StatsResponse>(STATS_ENDPOINTS.get);
  },
};