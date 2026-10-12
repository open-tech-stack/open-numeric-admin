"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Save,
  Info,
  Image as ImageIcon,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import {
  PROJECT_CATEGORIES,
  PROJECT_SCOPES,
  PROJECT_STATUSES,
  PROJECT_LINK_TYPES,
  FEATURE_ICONS,
} from "@/data/projectOptions";
import type {
  Locale,
  Project,
  ProjectCategory,
  ProjectCreateInput,
  ProjectLinkType,
  ProjectScope,
  ProjectStatus,
  ProjectTranslation,
  ProjectGalleryTranslation,
  ProjectFeatureTranslation,
} from "@/types";
import { SUPPORTED_LOCALES } from "@/types";
import { cn } from "@/lib/cn";
import TranslationTabs from "@/components/ui/TranslationTabs";

/* =========================================================
   TYPES
   ========================================================= */

/** Traductions du projet éditées (sans `locale`) */
type ProjectTranslationsMap = Record<
  Locale,
  Omit<ProjectTranslation, "locale">
>;

/** Traductions de la galerie (sans `locale`) */
type GalleryTranslationsMap = Record<
  Locale,
  Omit<ProjectGalleryTranslation, "locale">
>;

/** Traductions des features (sans `locale`) */
type FeatureTranslationsMap = Record<
  Locale,
  Omit<ProjectFeatureTranslation, "locale">
>;

type TabKey = "info" | "media" | "details";

/* ---------- Valeurs par défaut ---------- */

const EMPTY_PROJECT_TRANSLATION: Omit<ProjectTranslation, "locale"> = {
  title: "",
  description: "",
  longDescription: "",
};

const EMPTY_GALLERY_TRANSLATION: Omit<ProjectGalleryTranslation, "locale"> = {
  caption: "",
};

const EMPTY_FEATURE_TRANSLATION: Omit<ProjectFeatureTranslation, "locale"> = {
  title: "",
  description: "",
};

const DEFAULT_PROJECT_TRANSLATIONS: ProjectTranslationsMap =
  SUPPORTED_LOCALES.reduce(
    (acc, loc) => ({
      ...acc,
      [loc.value]: { ...EMPTY_PROJECT_TRANSLATION },
    }),
    {} as ProjectTranslationsMap,
  );

const DEFAULT_GALLERY_TRANSLATIONS: GalleryTranslationsMap =
  SUPPORTED_LOCALES.reduce(
    (acc, loc) => ({
      ...acc,
      [loc.value]: { ...EMPTY_GALLERY_TRANSLATION },
    }),
    {} as GalleryTranslationsMap,
  );

const DEFAULT_FEATURE_TRANSLATIONS: FeatureTranslationsMap =
  SUPPORTED_LOCALES.reduce(
    (acc, loc) => ({
      ...acc,
      [loc.value]: { ...EMPTY_FEATURE_TRANSLATION },
    }),
    {} as FeatureTranslationsMap,
  );

/* ---------- Lignes de formulaire ---------- */

interface GalleryRow {
  id: string;
  src: string;
  order: number;
  translations: GalleryTranslationsMap;
}

interface FeatureRow {
  id: string;
  key: string;
  icon: string;
  order: number;
  translations: FeatureTranslationsMap;
}

interface LinkRow {
  id: string;
  type: ProjectLinkType;
  url: string;
  order: number;
}

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectCreateInput) => void | Promise<void>;
  initialData?: Project | null;
  submitting?: boolean;
}

interface FormValues {
  slug: string;
  cover: string;
  heroImage: string;
  category: ProjectCategory;
  scope: ProjectScope;
  status: ProjectStatus;
  year: number;
  techInput: string;
  tech: string[];
  tagInput: string;
  tags: string[];
  featured: boolean;
  order: number;
  isActive: boolean;
  translations: ProjectTranslationsMap;
  gallery: GalleryRow[];
  features: FeatureRow[];
  links: LinkRow[];
}

const currentYear = new Date().getFullYear();

const DEFAULT_VALUES: FormValues = {
  slug: "",
  cover: "",
  heroImage: "",
  category: "WEB",
  scope: "CLIENT",
  status: "COMPLETED",
  year: currentYear,
  techInput: "",
  tech: [],
  tagInput: "",
  tags: [],
  featured: false,
  order: 0,
  isActive: true,
  translations: DEFAULT_PROJECT_TRANSLATIONS,
  gallery: [],
  features: [],
  links: [],
};

/* =========================================================
   HELPERS
   ========================================================= */

const uid = () => Math.random().toString(36).slice(2, 10);

/* =========================================================
   COMPOSANT
   ========================================================= */

export default function ProjectForm({
  open,
  onClose,
  onSubmit,
  initialData,
  submitting = false,
}: ProjectFormProps) {
  const [values, setValues] = useState<FormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<TabKey>("info");

  const isEdit = Boolean(initialData);

  /* Init */
  useEffect(() => {
    if (!open) return;

    if (initialData) {
      /* Traductions du projet */
      const transMap = SUPPORTED_LOCALES.reduce((acc, loc) => {
        const tr = initialData.translations.find((t) => t.locale === loc.value);
        acc[loc.value] = tr
          ? {
              title: tr.title,
              description: tr.description,
              longDescription: tr.longDescription ?? "",
            }
          : { ...EMPTY_PROJECT_TRANSLATION };
        return acc;
      }, {} as ProjectTranslationsMap);

      /* Galerie */
      const gallery: GalleryRow[] = (initialData.gallery ?? []).map((g) => ({
        id: g.id,
        src: g.src,
        order: g.order,
        translations: SUPPORTED_LOCALES.reduce((acc, loc) => {
          const tr = g.translations.find((t) => t.locale === loc.value);
          acc[loc.value] = { caption: tr?.caption ?? "" };
          return acc;
        }, {} as GalleryTranslationsMap),
      }));

      /* Features */
      const features: FeatureRow[] = (initialData.features ?? []).map((f) => ({
        id: f.id,
        key: f.key,
        icon: f.icon,
        order: f.order,
        translations: SUPPORTED_LOCALES.reduce((acc, loc) => {
          const tr = f.translations.find((t) => t.locale === loc.value);
          acc[loc.value] = {
            title: tr?.title ?? "",
            description: tr?.description ?? "",
          };
          return acc;
        }, {} as FeatureTranslationsMap),
      }));

      /* Links */
      const links: LinkRow[] = (initialData.links ?? []).map((l) => ({
        id: l.id,
        type: l.type,
        url: l.url,
        order: l.order,
      }));

      setValues({
        slug: initialData.slug,
        cover: initialData.cover,
        heroImage: initialData.heroImage ?? "",
        category: initialData.category,
        scope: initialData.scope,
        status: initialData.status,
        year: initialData.year,
        techInput: "",
        tech: [...initialData.tech],
        tagInput: "",
        tags: [...initialData.tags],
        featured: initialData.featured,
        order: initialData.order,
        isActive: initialData.isActive,
        translations: transMap,
        gallery,
        features,
        links,
      });
    } else {
      setValues({
        ...DEFAULT_VALUES,
        translations: { ...DEFAULT_PROJECT_TRANSLATIONS },
      });
    }
    setErrors({});
    setActiveTab("info");
  }, [open, initialData]);

  /* Tech */
  const addTech = () => {
    const v = values.techInput.trim();
    if (!v || values.tech.includes(v)) return;
    setValues((prev) => ({ ...prev, tech: [...prev.tech, v], techInput: "" }));
  };
  const removeTech = (v: string) =>
    setValues((prev) => ({ ...prev, tech: prev.tech.filter((x) => x !== v) }));

  /* Tags */
  const addTag = () => {
    const v = values.tagInput.trim();
    if (!v || values.tags.includes(v)) return;
    setValues((prev) => ({ ...prev, tags: [...prev.tags, v], tagInput: "" }));
  };
  const removeTag = (v: string) =>
    setValues((prev) => ({ ...prev, tags: prev.tags.filter((x) => x !== v) }));

  /* Galerie */
  const addGallery = () =>
    setValues((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        {
          id: uid(),
          src: "",
          order: prev.gallery.length,
          translations: { ...DEFAULT_GALLERY_TRANSLATIONS },
        },
      ],
    }));

  const updateGallery = (id: string, patch: Partial<GalleryRow>) =>
    setValues((prev) => ({
      ...prev,
      gallery: prev.gallery.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    }));

  const removeGallery = (id: string) =>
    setValues((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((g) => g.id !== id),
    }));

  /* Features */
  const addFeature = () =>
    setValues((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        {
          id: uid(),
          key: "",
          icon: "ShieldCheck",
          order: prev.features.length,
          translations: { ...DEFAULT_FEATURE_TRANSLATIONS },
        },
      ],
    }));

  const updateFeature = (id: string, patch: Partial<FeatureRow>) =>
    setValues((prev) => ({
      ...prev,
      features: prev.features.map((f) =>
        f.id === id ? { ...f, ...patch } : f,
      ),
    }));

  const removeFeature = (id: string) =>
    setValues((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f.id !== id),
    }));

  /* Links */
  const addLink = () =>
    setValues((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        { id: uid(), type: "DEMO", url: "", order: prev.links.length },
      ],
    }));

  const updateLink = (id: string, patch: Partial<LinkRow>) =>
    setValues((prev) => ({
      ...prev,
      links: prev.links.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));

  const removeLink = (id: string) =>
    setValues((prev) => ({
      ...prev,
      links: prev.links.filter((l) => l.id !== id),
    }));

  /* Validation */
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!isEdit && !values.slug.trim()) {
      errs.slug = "Le slug est requis.";
    } else if (!isEdit && !/^[a-z0-9-]+$/.test(values.slug.trim())) {
      errs.slug = "Minuscules, chiffres et tirets uniquement.";
    }

    if (!values.cover.trim()) errs.cover = "La couverture est requise.";
    if (!values.year || values.year < 2000) errs.year = "Année invalide.";

    const fr = values.translations.fr;
    if (!fr.title.trim()) errs.fr_title = "Le titre (FR) est requis.";
    if (!fr.description.trim())
      errs.fr_description = "La description (FR) est requise.";

    setErrors(errs);
    if (Object.keys(errs).length > 0) setActiveTab("info");
    return Object.keys(errs).length === 0;
  };

  /* Submit */
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    /* ----- Traductions du projet ----- */
    const translations: ProjectTranslation[] = SUPPORTED_LOCALES.map((loc) => {
      const t = values.translations[loc.value];
      return {
        locale: loc.value,
        title: t.title.trim(),
        description: t.description.trim(),
        longDescription: t.longDescription?.trim() || null,
      };
    }).filter((t) => t.title || t.description);

    /* ----- Galerie ----- */
    const gallery: NonNullable<ProjectCreateInput["gallery"]> = values.gallery
      .filter((g) => g.src.trim())
      .map((g) => ({
        src: g.src.trim(),
        order: g.order,
        translations: SUPPORTED_LOCALES.map<ProjectGalleryTranslation>(
          (loc) => ({
            locale: loc.value,
            caption: g.translations[loc.value]?.caption?.trim() ?? "",
          }),
        ).filter((t) => t.caption),
      }));

    /* ----- Features ----- */
    const features: NonNullable<ProjectCreateInput["features"]> =
      values.features
        .filter((f) => f.key.trim())
        .map((f) => ({
          key: f.key.trim().toLowerCase().replace(/[^a-z0-9-]/g, ""),
          icon: f.icon,
          order: f.order,
          translations: SUPPORTED_LOCALES.map<ProjectFeatureTranslation>(
            (loc) => ({
              locale: loc.value,
              title: f.translations[loc.value]?.title?.trim() ?? "",
              description:
                f.translations[loc.value]?.description?.trim() ?? "",
            }),
          ).filter((t) => t.title || t.description),
        }));

    /* ----- Links ----- */
    const links: NonNullable<ProjectCreateInput["links"]> = values.links
      .filter((l) => l.url.trim())
      .map((l) => ({
        type: l.type,
        url: l.url.trim(),
        order: l.order,
      }));

    /* ----- Payload ----- */
    const payload: ProjectCreateInput = {
      slug: values.slug.trim(),
      cover: values.cover.trim(),
      heroImage: values.heroImage.trim() || undefined,
      category: values.category,
      scope: values.scope,
      status: values.status,
      year: values.year,
      tech: values.tech,
      tags: values.tags,
      featured: values.featured,
      order: values.order,
      isActive: values.isActive,
      translations,
      gallery,
      features,
      links,
    };

    await onSubmit(payload);
  };

  /* Tabs */
  const TABS: { key: TabKey; label: string; icon: typeof Info }[] = [
    { key: "info", label: "Infos", icon: Info },
    { key: "media", label: "Médias", icon: ImageIcon },
    { key: "details", label: "Détails", icon: Sparkles },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title={isEdit ? "Modifier un projet" : "Nouveau projet"}
      description={
        isEdit
          ? `Modifiez les informations de ${initialData?.slug}.`
          : "Ajoutez un projet à votre portfolio."
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Annuler
          </Button>
          <Button
            variant="primary"
            leftIcon={Save}
            onClick={() => handleSubmit()}
            loading={submitting}
          >
            {isEdit ? "Enregistrer" : "Créer"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TABS */}
        <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-surface border border-border">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary-soft text-primary shadow-sm"
                    : "text-foreground-muted hover:text-foreground hover:bg-surface-hover",
                )}
              >
                <TabIcon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ============= ONGLET INFO ============= */}
        {activeTab === "info" && (
          <div className="space-y-5">
            {!isEdit && (
              <Input
                label="Slug (URL)"
                placeholder="ecommerce-multi-vendeurs"
                hint="Utilisé dans l'URL : /portfolio/<slug>"
                value={values.slug}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, ""),
                  }))
                }
                error={errors.slug}
                required
                disabled={submitting}
                autoFocus
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-semibold text-foreground">
                  Catégorie
                </label>
                <select
                  value={values.category}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      category: e.target.value as ProjectCategory,
                    }))
                  }
                  disabled={submitting}
                  className="w-full h-11 px-4 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  {PROJECT_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-foreground">
                  Portée
                </label>
                <select
                  value={values.scope}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      scope: e.target.value as ProjectScope,
                    }))
                  }
                  disabled={submitting}
                  className="w-full h-11 px-4 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  {PROJECT_SCOPES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-semibold text-foreground">
                  Statut
                </label>
                <select
                  value={values.status}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      status: e.target.value as ProjectStatus,
                    }))
                  }
                  disabled={submitting}
                  className="w-full h-11 px-4 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  {PROJECT_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Année"
                type="number"
                min={2000}
                max={2100}
                value={values.year}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    year: Number(e.target.value) || currentYear,
                  }))
                }
                error={errors.year}
                required
                disabled={submitting}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Ordre"
                type="number"
                min={0}
                value={values.order}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    order: Number(e.target.value) || 0,
                  }))
                }
                disabled={submitting}
              />

              <div>
                <label className="block mb-2 text-sm font-semibold text-foreground">
                  À la une
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setValues((v) => ({ ...v, featured: !v.featured }))
                  }
                  disabled={submitting}
                  className={`w-full h-11 rounded-xl border transition-colors ${
                    values.featured
                      ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                      : "bg-surface border-border text-foreground-muted"
                  }`}
                >
                  {values.featured ? "★ À la une" : "☆ Normal"}
                </button>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-foreground">
                  Actif
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setValues((v) => ({ ...v, isActive: !v.isActive }))
                  }
                  disabled={submitting}
                  className={`w-full h-11 rounded-xl border transition-colors ${
                    values.isActive
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : "bg-surface border-border text-foreground-muted"
                  }`}
                >
                  {values.isActive ? "Actif" : "Inactif"}
                </button>
              </div>
            </div>

            <TranslationTabs
              translations={values.translations}
              onChange={(translations) =>
                setValues((v) => ({
                  ...v,
                  translations: translations as ProjectTranslationsMap,
                }))
              }
              render={({ locale, value, onChange }) => (
                <div className="space-y-4">
                  <Input
                    label="Titre"
                    placeholder="Plateforme E-commerce"
                    value={value.title}
                    onChange={(e) =>
                      onChange({ ...value, title: e.target.value })
                    }
                    error={errors[`${locale}_title`]}
                    required={locale === "fr"}
                    disabled={submitting}
                  />
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-foreground">
                      Description courte
                      {locale === "fr" && (
                        <span className="ml-1 text-danger">*</span>
                      )}
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Marketplace complète avec paiement sécurisé…"
                      value={value.description}
                      onChange={(e) =>
                        onChange({ ...value, description: e.target.value })
                      }
                      disabled={submitting}
                      className={`w-full px-4 py-3 rounded-xl bg-surface border text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 transition-all resize-none ${
                        errors[`${locale}_description`]
                          ? "border-danger focus:border-danger focus:ring-danger/20"
                          : "border-border focus:border-primary focus:ring-primary/20"
                      }`}
                    />
                    {errors[`${locale}_description`] && (
                      <p className="mt-1.5 text-xs text-danger">
                        {errors[`${locale}_description`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-foreground">
                      Description longue (optionnel)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Description détaillée…"
                      value={value.longDescription ?? ""}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          longDescription: e.target.value,
                        })
                      }
                      disabled={submitting}
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>
                </div>
              )}
            />

            {/* Tech */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-foreground">
                Stack technique
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="React, Next.js, Node.js…"
                  value={values.techInput}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, techInput: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTech();
                    }
                  }}
                  disabled={submitting}
                  className="flex-1 h-11 px-4 rounded-xl bg-surface border border-border text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <Button
                  type="button"
                  variant="secondary"
                  leftIcon={Plus}
                  onClick={addTech}
                  disabled={submitting}
                >
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {values.tech.map((t) => (
                  <Badge key={t} variant="primary">
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTech(t)}
                      disabled={submitting}
                      className="ml-1 hover:text-danger"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-foreground">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="E-commerce, Marketplace…"
                  value={values.tagInput}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, tagInput: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  disabled={submitting}
                  className="flex-1 h-11 px-4 rounded-xl bg-surface border border-border text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <Button
                  type="button"
                  variant="secondary"
                  leftIcon={Plus}
                  onClick={addTag}
                  disabled={submitting}
                >
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {values.tags.map((t) => (
                  <Badge key={t} variant="default">
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      disabled={submitting}
                      className="ml-1 hover:text-danger"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============= ONGLET MEDIA ============= */}
        {activeTab === "media" && (
          <div className="space-y-5">
            {/* Cover */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-foreground">
                Image de couverture *
              </label>
              <div className="flex gap-4 items-start">
                <div className="relative h-24 w-40 rounded-xl overflow-hidden border border-border bg-surface-hover flex items-center justify-center flex-shrink-0">
                  {values.cover ? (
                    <Image
                      src={values.cover}
                      alt="Cover"
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-foreground-subtle" />
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    label=""
                    placeholder="/projects/ecommerce.jpg"
                    hint="Chemin public ou URL complète."
                    value={values.cover}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, cover: e.target.value }))
                    }
                    error={errors.cover}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>

            {/* Hero */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-foreground">
                Image hero (optionnel)
              </label>
              <div className="flex gap-4 items-start">
                <div className="relative h-24 w-40 rounded-xl overflow-hidden border border-border bg-surface-hover flex items-center justify-center flex-shrink-0">
                  {values.heroImage ? (
                    <Image
                      src={values.heroImage}
                      alt="Hero"
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-foreground-subtle" />
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    label=""
                    placeholder="/projects/ecommerce-hero.jpg"
                    hint="Si vide, l'image de couverture sera utilisée."
                    value={values.heroImage}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, heroImage: e.target.value }))
                    }
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>

            {/* Galerie */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-foreground">
                  Galerie ({values.gallery.length})
                </label>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  leftIcon={Plus}
                  onClick={addGallery}
                  disabled={submitting}
                >
                  Ajouter une image
                </Button>
              </div>

              <div className="space-y-3">
                {values.gallery.map((g, i) => (
                  <div
                    key={g.id}
                    className="rounded-xl border border-border bg-surface p-3 space-y-3"
                  >
                    <div className="flex gap-3 items-start">
                      <div className="relative h-20 w-32 rounded-lg overflow-hidden border border-border bg-surface-hover flex items-center justify-center flex-shrink-0">
                        {g.src ? (
                          <Image
                            src={g.src}
                            alt={`Image ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-foreground-subtle" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Input
                          label=""
                          placeholder="/projects/ecommerce-1.jpg"
                          value={g.src}
                          onChange={(e) =>
                            updateGallery(g.id, { src: e.target.value })
                          }
                          disabled={submitting}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGallery(g.id)}
                        disabled={submitting}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Légende multilingue */}
                    <TranslationTabs
                      translations={g.translations}
                      onChange={(translations) =>
                        updateGallery(g.id, {
                          translations:
                            translations as GalleryTranslationsMap,
                        })
                      }
                      render={({ value, onChange }) => (
                        <Input
                          label="Légende"
                          placeholder="Capture d'écran du tableau de bord"
                          value={value.caption}
                          onChange={(e) =>
                            onChange({ ...value, caption: e.target.value })
                          }
                          disabled={submitting}
                        />
                      )}
                    />
                  </div>
                ))}
                {values.gallery.length === 0 && (
                  <p className="text-sm text-foreground-subtle text-center py-4">
                    Aucune image dans la galerie.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============= ONGLET DETAILS ============= */}
        {activeTab === "details" && (
          <div className="space-y-6">
            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-foreground">
                  Fonctionnalités clés ({values.features.length})
                </label>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  leftIcon={Plus}
                  onClick={addFeature}
                  disabled={submitting}
                >
                  Ajouter
                </Button>
              </div>

              <div className="space-y-3">
                {values.features.map((f) => (
                  <div
                    key={f.id}
                    className="rounded-xl border border-border bg-surface p-3 space-y-3"
                  >
                    <div className="flex gap-3 items-start">
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <Input
                          label="Clé"
                          placeholder="auth"
                          value={f.key}
                          onChange={(e) =>
                            updateFeature(f.id, {
                              key: e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9-]/g, ""),
                            })
                          }
                          disabled={submitting}
                        />
                        <div>
                          <label className="block mb-2 text-sm font-semibold text-foreground">
                            Icône
                          </label>
                          <select
                            value={f.icon}
                            onChange={(e) =>
                              updateFeature(f.id, { icon: e.target.value })
                            }
                            disabled={submitting}
                            className="w-full h-11 px-3 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          >
                            {FEATURE_ICONS.map((ic) => (
                              <option key={ic.value} value={ic.value}>
                                {ic.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft">
                          <Icon
                            name={f.icon}
                            className="h-5 w-5 text-primary"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFeature(f.id)}
                          disabled={submitting}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Traductions feature */}
                    <TranslationTabs
                      translations={f.translations}
                      onChange={(translations) =>
                        updateFeature(f.id, {
                          translations:
                            translations as FeatureTranslationsMap,
                        })
                      }
                      render={({ value, onChange }) => (
                        <div className="space-y-3">
                          <Input
                            label="Titre"
                            placeholder="Authentification sécurisée"
                            value={value.title}
                            onChange={(e) =>
                              onChange({ ...value, title: e.target.value })
                            }
                            disabled={submitting}
                          />
                          <Input
                            label="Description"
                            placeholder="Système JWT/OAuth2…"
                            value={value.description}
                            onChange={(e) =>
                              onChange({
                                ...value,
                                description: e.target.value,
                              })
                            }
                            disabled={submitting}
                          />
                        </div>
                      )}
                    />
                  </div>
                ))}
                {values.features.length === 0 && (
                  <p className="text-sm text-foreground-subtle text-center py-4">
                    Aucune fonctionnalité.
                  </p>
                )}
              </div>
            </div>

            {/* Links */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-foreground">
                  Liens utiles ({values.links.length})
                </label>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  leftIcon={Plus}
                  onClick={addLink}
                  disabled={submitting}
                >
                  Ajouter un lien
                </Button>
              </div>

              <div className="space-y-3">
                {values.links.map((l) => (
                  <div
                    key={l.id}
                    className="flex gap-3 items-start rounded-xl border border-border bg-surface p-3"
                  >
                    <div className="w-40 flex-shrink-0">
                      <label className="block mb-2 text-sm font-semibold text-foreground">
                        Type
                      </label>
                      <select
                        value={l.type}
                        onChange={(e) =>
                          updateLink(l.id, {
                            type: e.target.value as ProjectLinkType,
                          })
                        }
                        disabled={submitting}
                        className="w-full h-11 px-3 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      >
                        {PROJECT_LINK_TYPES.map((lt) => (
                          <option key={lt.value} value={lt.value}>
                            {lt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <Input
                        label="URL"
                        placeholder="https://..."
                        value={l.url}
                        onChange={(e) =>
                          updateLink(l.id, { url: e.target.value })
                        }
                        disabled={submitting}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLink(l.id)}
                      disabled={submitting}
                      className="mt-8 p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {values.links.length === 0 && (
                  <p className="text-sm text-foreground-subtle text-center py-4">
                    Aucun lien.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}