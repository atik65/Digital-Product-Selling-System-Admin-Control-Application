import { useEffect } from "react";
import Text from "@/components/common/Text";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/media";
import useApi from "@/hooks/useApi";
import settingsApi from "@/views/settings/api";
import { Phone, Mail, Send, Facebook, ShieldCheck, AlertCircle } from "lucide-react";

const AuthLayout = ({
  title,
  subtitle,
  children,
  className,
  settings: propSettings,
  isLoading: propLoading,
}) => {
  // If settings wasn't passed directly as prop, fetch it
  const { data: settingsData, isLoading: queryLoading } = useApi({
    api: settingsApi.get,
    cacheKey: settingsApi.cacheKey,
    trigger: !propSettings,
  });

  const settings = propSettings || settingsData?.data;
  const isLoading = propLoading !== undefined ? propLoading : queryLoading;

  const siteName = settings?.site_name || "Digital Product Selling System";
  const siteTitle = settings?.site_title;
  const logoUrl = settings?.logo ? getImageUrl(settings.logo) : "/logo.png";

  // Dynamic document title and favicon
  useEffect(() => {
    if (siteName) {
      document.title = `${title ? `${title} — ` : ""}${siteName}${siteTitle ? ` | ${siteTitle}` : ""}`;
    }
    if (settings?.favicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = getImageUrl(settings.favicon);
    }
  }, [siteName, siteTitle, title, settings?.favicon]);

  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center px-4 py-8 bg-slate-50/60 selection:bg-emerald-500 selection:text-white",
        className
      )}
    >
      {/* Background Decorative Gradients & Mesh Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px]" />

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-xl shadow-emerald-950/5 ring-1 ring-slate-900/10 transition-all">
        {/* Brand & Logo Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center justify-center">
            {settings?.logo ? (
              <img
                src={logoUrl}
                alt={siteName}
                className="max-h-14 max-w-[220px] object-contain transition-transform duration-200 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/logo.png";
                }}
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-200/80 shadow-xs">
                <img
                  src="/logo.png"
                  alt={siteName}
                  className="h-7 w-7 object-contain"
                />
              </div>
            )}
          </div>

          {/* Project Name Badge */}
          {/* {siteName && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/60 text-emerald-800 text-xs font-semibold tracking-wide shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{siteName}</span>
            </div>
          )} */}

          {/* Title & Subtitle */}
          <div className="space-y-1 mb-3">
            {/* <Text
              component="h1"
              className="text-2xl font-bold tracking-tight text-neutral-900"
            >
              {title}
            </Text> */}
            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
              {subtitle || siteTitle || "Administrator Console"}
            </p>
          </div>

          {/* Optional System Notice from Settings */}
          {settings?.notice_text && (
            <div className="w-full mt-2 flex items-start gap-2.5 rounded-xl bg-amber-50/90 border border-amber-200/70 p-3 text-left text-xs text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div className="leading-relaxed">{settings.notice_text}</div>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="mt-6">{children}</div>

        {/* Official Channels & Customer Support Contacts */}
        {/* {(settings?.support_phone ||
          settings?.support_email ||
          settings?.telegram_url ||
          settings?.facebook_url) && (
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-500">
              {settings?.support_phone && (
                <a
                  href={`tel:${settings.support_phone}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border border-slate-200/60"
                  title="Support Helpline"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{settings.support_phone}</span>
                </a>
              )}
              {settings?.support_email && (
                <a
                  href={`mailto:${settings.support_email}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border border-slate-200/60"
                  title="Support Email"
                >
                  <Mail className="h-3.5 w-3.5 text-amber-600" />
                  <span>{settings.support_email}</span>
                </a>
              )}
              {settings?.telegram_url && (
                <a
                  href={settings.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition-colors border border-slate-200/60"
                  title="Official Telegram Channel"
                >
                  <Send className="h-3.5 w-3.5 text-blue-500" />
                  <span>Telegram</span>
                </a>
              )}
              {settings?.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors border border-slate-200/60"
                  title="Official Facebook Page"
                >
                  <Facebook className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Facebook</span>
                </a>
              )}
            </div>
          )} */}
      </div>

      {/* Footer Branding & Security Notice */}
      <div className="relative z-10 mt-6 text-center text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-slate-500 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Secure Administrator Control Gateway</span>
        </div>
        <p>
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
