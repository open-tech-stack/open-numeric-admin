"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/services/core/http.service";
import { statsService } from "@/services/stats/stats.service";
import type { StatsResponse } from "@/types";

interface UseStatsResult {
  data: StatsResponse | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useStats(auto = true): UseStatsResult {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await statsService.get();
      setData(res);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auto) refresh();
  }, [auto, refresh]);

  return { data, loading, error, refresh };
}