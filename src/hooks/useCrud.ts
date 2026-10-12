"use client";

import { useCallback, useEffect, useState } from "react";
import { CrudService } from "@/services/core/crud.service";
import { ApiError } from "@/services/core/http.service";
import { useToast } from "@/components/ui/Toast";

interface UseCrudOptions {
  /** Charge automatiquement au mount */
  autoLoad?: boolean;
  /** Message de succès (create) */
  successCreate?: string;
  /** Message de succès (update) */
  successUpdate?: string;
  /** Message de succès (delete) */
  successDelete?: string;
  /** Message d'erreur générique */
  errorMessage?: string;
}

export function useCrud<
  T extends { id: string },
  TCreate = Partial<T>,
  TUpdate = Partial<T>,
>(
  service: CrudService<T, TCreate, TUpdate>,
  options: UseCrudOptions = {},
) {
  const {
    autoLoad = true,
    successCreate = "Élément créé avec succès",
    successUpdate = "Élément mis à jour",
    successDelete = "Élément supprimé",
    errorMessage = "Une erreur est survenue",
  } = options;

  const toast = useToast();

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* =========================================================
     LOAD
     ========================================================= */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await service.listAll();
      // ✅ Garantie absolue : toujours un tableau
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : errorMessage;
      toast.error(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [service, errorMessage, toast]);

  useEffect(() => {
    if (autoLoad) load();
  }, [autoLoad, load]);

  /* =========================================================
     CREATE
     ========================================================= */
  const create = useCallback(
    async (data: TCreate): Promise<T | null> => {
      setSubmitting(true);
      try {
        const created = await service.create(data);
        setItems((prev) => [...prev, created]);
        toast.success(successCreate);
        return created;
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : errorMessage;
        toast.error(msg);
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [service, successCreate, errorMessage, toast],
  );

  /* =========================================================
     UPDATE
     ========================================================= */
  const update = useCallback(
    async (id: string, data: TUpdate): Promise<T | null> => {
      setSubmitting(true);
      try {
        const updated = await service.update(id, data);
        setItems((prev) =>
          prev.map((item) => (item.id === id ? updated : item)),
        );
        toast.success(successUpdate);
        return updated;
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : errorMessage;
        toast.error(msg);
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [service, successUpdate, errorMessage, toast],
  );

  /* =========================================================
     DELETE
     ========================================================= */
  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      setDeleting(true);
      try {
        await service.delete(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
        toast.success(successDelete);
        return true;
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : errorMessage;
        toast.error(msg);
        return false;
      } finally {
        setDeleting(false);
      }
    },
    [service, successDelete, errorMessage, toast],
  );

  return {
    items,
    loading,
    submitting,
    deleting,
    load,
    create,
    update,
    remove,
  };
}