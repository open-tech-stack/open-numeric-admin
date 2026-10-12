"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { ApiError } from "@/services/core/http.service";
import type { SiteSettings, SiteSettingsUpdateInput } from "@/types";
import { settingsService } from "@/services/settings/settings.service";

export default function SettingsPage() {
  const toast = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState<SiteSettingsUpdateInput>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* Load */
  useEffect(() => {
    (async () => {
      try {
        const data = await settingsService.get();
        setSettings(data);
        setForm({
          siteName: data.siteName,
          logo: data.logo,
          favicon: data.favicon ?? "",
          email: data.email,
          emailSecondary: data.emailSecondary ?? "",
          phone: data.phone,
          phoneSecondary: data.phoneSecondary ?? "",
          whatsapp: data.whatsapp ?? "",
          whatsappSecondary: data.whatsappSecondary ?? "",
          address: data.address,
          mapEmbedUrl: data.mapEmbedUrl ?? "",
          availability: data.availability,
          defaultMetaTitle: data.defaultMetaTitle ?? "",
          defaultMetaDescription: data.defaultMetaDescription ?? "",
          googleAnalyticsId: data.googleAnalyticsId ?? "",
        });
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : "Erreur";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  /* Save */
  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await settingsService.update(form);
      setSettings(updated);
      toast.success("Paramètres enregistrés");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erreur";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const set = <K extends keyof SiteSettingsUpdateInput>(
    key: K,
    value: SiteSettingsUpdateInput[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="text-sm text-foreground-muted mt-1">
          Configuration globale du site et informations de contact.
        </p>
      </div>

      {/* Identité */}
      <Card>
        <CardHeader title="Identité du site" />
        <CardBody className="space-y-5">
          <Input
            label="Nom du site"
            value={form.siteName ?? ""}
            onChange={(e) => set("siteName", e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Logo (URL)"
              value={form.logo ?? ""}
              onChange={(e) => set("logo", e.target.value)}
            />
            <Input
              label="Favicon (URL)"
              value={form.favicon ?? ""}
              onChange={(e) => set("favicon", e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader title="Informations de contact" />
        <CardBody className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input label="Email principal" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} />
            <Input label="Email secondaire" value={form.emailSecondary ?? ""} onChange={(e) => set("emailSecondary", e.target.value)} />
            <Input label="Téléphone" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
            <Input label="Téléphone secondaire" value={form.phoneSecondary ?? ""} onChange={(e) => set("phoneSecondary", e.target.value)} />
            <Input label="WhatsApp" value={form.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} />
            <Input label="WhatsApp secondaire" value={form.whatsappSecondary ?? ""} onChange={(e) => set("whatsappSecondary", e.target.value)} />
          </div>
          <Input label="Adresse" value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} />
          <Input label="Disponibilité" value={form.availability ?? ""} onChange={(e) => set("availability", e.target.value)} placeholder="24/7" />
          <Input label="Google Maps (URL embed)" value={form.mapEmbedUrl ?? ""} onChange={(e) => set("mapEmbedUrl", e.target.value)} />
        </CardBody>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader title="SEO & Analytics" />
        <CardBody className="space-y-5">
          <Input label="Meta title par défaut" value={form.defaultMetaTitle ?? ""} onChange={(e) => set("defaultMetaTitle", e.target.value)} />
          <Input label="Meta description par défaut" value={form.defaultMetaDescription ?? ""} onChange={(e) => set("defaultMetaDescription", e.target.value)} />
          <Input label="Google Analytics ID" value={form.googleAnalyticsId ?? ""} onChange={(e) => set("googleAnalyticsId", e.target.value)} placeholder="G-XXXXXXXXXX" />
        </CardBody>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button leftIcon={Save} onClick={handleSave} loading={saving} size="lg">
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
}