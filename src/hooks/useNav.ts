"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "@/services/core/http.service";
import { navService } from "@/services/nav/nav.service";
import type {
  CreateNavItemInput,
  NavItem,
  ReorderNavInput,
  UpdateNavItemInput,
} from "@/types";
import { useToast } from "@/components/ui/Toast";

/* ============================================================
   Helpers
   ============================================================ */

/** Construit l'arbre récursif à partir de la liste à plat. */
export function buildTree(flat: NavItem[]): NavItem[] {
  const map = new Map<string, NavItem>();
  const roots: NavItem[] = [];

  for (const it of flat) map.set(it.id, { ...it, children: [] });

  for (const it of flat) {
    const node = map.get(it.id)!;
    if (it.parentId && map.has(it.parentId)) {
      map.get(it.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortRec = (nodes: NavItem[]) => {
    nodes.sort((a, b) => a.order - b.order);
    for (const n of nodes) sortRec(n.children);
  };
  sortRec(roots);

  return roots;
}

/** Aplatit un arbre récursif. */
export function flattenTree(tree: NavItem[]): NavItem[] {
  const out: NavItem[] = [];
  const walk = (nodes: NavItem[]) => {
    for (const n of nodes) {
      out.push(n);
      if (n.children.length) walk(n.children);
    }
  };
  walk(tree);
  return out;
}

/* ============================================================
   Hook principal
   ============================================================ */

export function useNav() {
  const toast = useToast();

  const [flat, setFlat] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const items = await navService.listAll();
      setFlat(items);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erreur de chargement";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const tree = useMemo(() => buildTree(flat), [flat]);

  /* ---------------- Mutations ---------------- */

  const create = useCallback(
    async (input: CreateNavItemInput) => {
      setMutating(true);
      try {
        const created = await navService.create(input);
        setFlat((prev) => [...prev, { ...created, children: [] }]);
        toast.success("Élément créé");
        return created;
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : "Erreur";
        toast.error(msg);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [toast],
  );

  const update = useCallback(
    async (id: string, input: UpdateNavItemInput) => {
      setMutating(true);
      try {
        const updated = await navService.update(id, input);
        setFlat((prev) =>
          prev.map((it) => (it.id === id ? { ...updated, children: [] } : it)),
        );
        toast.success("Élément mis à jour");
        return updated;
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : "Erreur";
        toast.error(msg);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [toast],
  );

  const remove = useCallback(
    async (id: string) => {
      setMutating(true);
      try {
        await navService.delete(id);
        // Suppression en cascade côté back → on retire aussi les enfants locaux
        setFlat((prev) => {
          const toRemove = new Set<string>([id]);
          let grew = true;
          while (grew) {
            grew = false;
            for (const it of prev) {
              if (it.parentId && toRemove.has(it.parentId) && !toRemove.has(it.id)) {
                toRemove.add(it.id);
                grew = true;
              }
            }
          }
          return prev.filter((it) => !toRemove.has(it.id));
        });
        toast.success("Élément supprimé");
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : "Erreur";
        toast.error(msg);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [toast],
  );

  const reorder = useCallback(
    async (input: ReorderNavInput) => {
      setMutating(true);
      try {
        const updated = await navService.reorder(input);
        setFlat(updated.map((x) => ({ ...x, children: [] })));
        toast.success("Ordre enregistré");
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : "Erreur";
        toast.error(msg);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [toast],
  );

  return {
    tree,
    flat,
    loading,
    mutating,
    refresh,
    create,
    update,
    remove,
    reorder,
  };
}