import { SETTINGS_ENDPOINTS } from "@/endpoints/settings.endpoints";
import { SiteSettings, SiteSettingsUpdateInput } from "@/types";
import { httpClient } from "../core/http.service";

export const settingsService = {
  async get(): Promise<SiteSettings> {
    return httpClient.get<SiteSettings>(SETTINGS_ENDPOINTS.get);
  },
  async update(data: SiteSettingsUpdateInput): Promise<SiteSettings> {
    return httpClient.patch<SiteSettings>(SETTINGS_ENDPOINTS.update, data);
  },
};