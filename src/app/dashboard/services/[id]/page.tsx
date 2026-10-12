"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { httpClient } from "@/services/core/http.service";
import { SERVICES_ENDPOINTS } from "@/endpoints/services.endpoints";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import Icon from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";
import type { Service, ServiceCategory, ServiceItem } from "@/types";
import { cn } from "@/lib/cn";
import ServiceCategoryForm from "@/components/dashboard/services/ServiceCategoryForm";
import ServiceItemForm from "@/components/dashboard/services/ServiceItemForm";
import { serviceService } from "@/services/services/service.service";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ServiceDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const toast = useToast();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  /* Catégorie */
  const [catFormOpen, setCatFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [catSubmitting, setCatSubmitting] = useState(false);

  /* Item */
  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [itemCategoryId, setItemCategoryId] = useState<string | null>(null);
  const [itemSubmitting, setItemSubmitting] = useState(false);

  /* Delete */
  const [toDelete, setToDelete] = useState<
    { type: "category" | "item"; id: string; name: string } | null
  >(null);
  const [deleting, setDeleting] = useState(false);

  /* =========================================================
     LOAD
     ========================================================= */
  const load = async () => {
    setLoading(true);
    try {
      const data = await serviceService.getById(id);
      setService(data);
      if (data.categories.length > 0) {
        setOpenCategories(new Set([data.categories[0].id]));
      }
    } catch {
      toast.error("Impossible de charger le service.");
      router.replace("/dashboard/services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  /* =========================================================
     CATÉGORIE — Submit
     ========================================================= */
  const handleCategorySubmit = async (payload: any) => {
    if (!service) return;
    setCatSubmitting(true);
    try {
      if (editingCategory) {
        await httpClient.patch(
          SERVICES_ENDPOINTS.updateCategory(editingCategory.id),
          payload,
        );
        toast.success("Catégorie mise à jour");
      } else {
        await httpClient.post(
          SERVICES_ENDPOINTS.createCategory(service.id),
          payload,
        );
        toast.success("Catégorie créée");
      }
      setCatFormOpen(false);
      setEditingCategory(null);
      await load();
    } catch {
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setCatSubmitting(false);
    }
  };

  /* =========================================================
     ITEM — Submit
     ========================================================= */
  const handleItemSubmit = async (payload: any) => {
    if (!itemCategoryId) return;
    setItemSubmitting(true);
    try {
      if (editingItem) {
        await httpClient.patch(
          SERVICES_ENDPOINTS.updateItem(editingItem.id),
          payload,
        );
        toast.success("Item mis à jour");
      } else {
        await httpClient.post(
          SERVICES_ENDPOINTS.createItem(itemCategoryId),
          payload,
        );
        toast.success("Item créé");
      }
      setItemFormOpen(false);
      setEditingItem(null);
      setItemCategoryId(null);
      await load();
    } catch {
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setItemSubmitting(false);
    }
  };

  /* =========================================================
     DELETE
     ========================================================= */
  const handleConfirmDelete = async () => {
    if (!toDelete || !service) return;
    setDeleting(true);
    try {
      if (toDelete.type === "category") {
        await httpClient.delete(SERVICES_ENDPOINTS.deleteCategory(toDelete.id));
        toast.success("Catégorie supprimée");
      } else {
        await httpClient.delete(SERVICES_ENDPOINTS.deleteItem(toDelete.id));
        toast.success("Item supprimé");
      }
      setToDelete(null);
      await load();
    } catch {
      toast.error("Erreur lors de la suppression.");
    } finally {
      setDeleting(false);
    }
  };

  /* =========================================================
     LOADING
     ========================================================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!service) return null;

  const serviceName =
    service.translations.find((t) => t.locale === "fr")?.name ?? service.key;

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={ArrowLeft}
            onClick={() => router.push("/dashboard/services")}
          >
            Retour
          </Button>

          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
                service.accent,
              )}
            >
              <Icon name={service.icon} className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {serviceName}
              </h1>
              <p className="text-sm text-foreground-muted font-mono">
                /{service.slug}
              </p>
            </div>
          </div>
        </div>

        <Button
          leftIcon={Plus}
          onClick={() => {
            setEditingCategory(null);
            setCatFormOpen(true);
          }}
        >
          Nouvelle catégorie
        </Button>
      </div>

      {/* Liste catégories */}
      {service.categories.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-foreground-muted mb-4">
              Aucune catégorie pour ce service.
            </p>
            <Button
              leftIcon={Plus}
              onClick={() => {
                setEditingCategory(null);
                setCatFormOpen(true);
              }}
            >
              Créer la première catégorie
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {service.categories
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((category) => {
              const isOpen = openCategories.has(category.id);
              const catName =
                category.translations.find((t) => t.locale === "fr")?.name ??
                category.key;

              return (
                <Card key={category.id} padded={false}>
                  {/* Header catégorie */}
                  <div className="flex items-center gap-3 p-4">
                    <button
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted hover:bg-surface-hover transition-colors"
                      aria-label={isOpen ? "Réduire" : "Étendre"}
                    >
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>

                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white",
                        category.accent,
                      )}
                    >
                      <Icon name={category.icon} className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {catName}
                      </p>
                      <p className="text-xs text-foreground-subtle font-mono">
                        {category.key}
                      </p>
                    </div>

                    <Badge variant="primary">
                      {category.items.length} item
                      {category.items.length > 1 ? "s" : ""}
                    </Badge>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(category);
                          setCatFormOpen(true);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setToDelete({
                            type: "category",
                            id: category.id,
                            name: catName,
                          })
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Items */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border p-4 space-y-2">
                          {category.items.length === 0 ? (
                            <p className="text-sm text-foreground-muted text-center py-4">
                              Aucun item dans cette catégorie.
                            </p>
                          ) : (
                            category.items
                              .slice()
                              .sort((a, b) => a.order - b.order)
                              .map((item) => {
                                const itemName =
                                  item.translations.find(
                                    (t) => t.locale === "fr",
                                  )?.name ?? item.key;

                                return (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background-alt/50"
                                  >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-hover border border-border flex-shrink-0 overflow-hidden">
                                      {item.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                          src={item.image}
                                          alt={itemName}
                                          className="h-full w-full object-contain p-1"
                                        />
                                      ) : item.icon ? (
                                        <Icon
                                          name={item.icon}
                                          className="h-4 w-4 text-primary"
                                        />
                                      ) : (
                                        <span className="text-xs font-bold text-foreground-muted">
                                          {itemName.charAt(0)}
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-foreground truncate">
                                        {itemName}
                                      </p>
                                      <p className="text-[10px] text-foreground-subtle font-mono">
                                        {item.key}
                                      </p>
                                    </div>

                                    <Badge variant="default">
                                      {item.translations.length} / 5
                                    </Badge>

                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingItem(item);
                                          setItemCategoryId(category.id);
                                          setItemFormOpen(true);
                                        }}
                                        className="flex h-7 w-7 items-center justify-center rounded-md text-blue-400 hover:bg-blue-500/10 transition-colors"
                                        title="Modifier"
                                      >
                                        <Edit className="h-3.5 w-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setToDelete({
                                            type: "item",
                                            id: item.id,
                                            name: itemName,
                                          })
                                        }
                                        className="flex h-7 w-7 items-center justify-center rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                                        title="Supprimer"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                          )}

                          {/* Bouton ajouter item */}
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={Plus}
                            fullWidth
                            onClick={() => {
                              setEditingItem(null);
                              setItemCategoryId(category.id);
                              setItemFormOpen(true);
                            }}
                          >
                            Ajouter un item
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
        </div>
      )}

      {/* =========================================================
          MODALES
          ========================================================= */}

      {/* Catégorie */}
      <ServiceCategoryForm
        open={catFormOpen}
        onClose={() => {
          setCatFormOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleCategorySubmit}
        initialData={editingCategory}
        submitting={catSubmitting}
      />

      {/* Item */}
      <ServiceItemForm
        open={itemFormOpen}
        onClose={() => {
          setItemFormOpen(false);
          setEditingItem(null);
          setItemCategoryId(null);
        }}
        onSubmit={handleItemSubmit}
        initialData={editingItem}
        submitting={itemSubmitting}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title={`Supprimer ${toDelete?.type === "category" ? "cette catégorie" : "cet item"} ?`}
        description={`Cette action supprimera définitivement "${toDelete?.name}". Elle est irréversible.`}
        confirmLabel="Supprimer"
      />
    </div>
  );
}