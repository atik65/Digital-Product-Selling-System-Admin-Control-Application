import { useEffect } from "react";
import useApi from "@/hooks/useApi";
import settingsApi from "@/views/settings/api";
import { getImageUrl } from "@/lib/media";

/**
 * GlobalSettingsHandler
 * Handles application-wide dynamic settings such as browser favicon,
 * title, and meta tags based on the backend settings API response.
 */
export default function GlobalSettingsHandler() {
  const { data: settingsData } = useApi({
    api: settingsApi.get,
    cacheKey: settingsApi.cacheKey,
  });

  const settings = settingsData?.data;

  useEffect(() => {
    if (!settings) return;

    // 1. Dynamic Favicon Update
    if (settings.favicon) {
      const faviconUrl = getImageUrl(settings.favicon);

      // Standard rel="icon"
      let iconLink = document.querySelector("link[rel~='icon']");
      if (!iconLink) {
        iconLink = document.createElement("link");
        iconLink.rel = "icon";
        document.head.appendChild(iconLink);
      }
      iconLink.removeAttribute("type"); // Allow any image type (PNG, ICO, SVG, WEBP)
      iconLink.href = faviconUrl;

      // Shortcut icon
      let shortcutLink = document.querySelector("link[rel='shortcut icon']");
      if (!shortcutLink) {
        shortcutLink = document.createElement("link");
        shortcutLink.rel = "shortcut icon";
        document.head.appendChild(shortcutLink);
      }
      shortcutLink.href = faviconUrl;

      // Apple Touch Icon
      let appleLink = document.querySelector("link[rel='apple-touch-icon']");
      if (!appleLink) {
        appleLink = document.createElement("link");
        appleLink.rel = "apple-touch-icon";
        document.head.appendChild(appleLink);
      }
      appleLink.href = faviconUrl;
    }

    // 2. Set default page title if not customized
    if (settings.site_name) {
      if (!document.title || document.title.includes("%VITE_APP_TITLE%")) {
        document.title = settings.site_title
          ? `${settings.site_name} | ${settings.site_title}`
          : settings.site_name;
      }
    }
  }, [settings]);

  return null;
}
