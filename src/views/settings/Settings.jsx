import { useState, useEffect } from "react";
import useApi from "@/hooks/useApi";
import useRequest from "@/hooks/useRequest";
import useFormik from "@/hooks/useFormik";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import FieldInput from "@/components/common/Formik/FieldInput";
import { Button } from "@/components/ui/button";
import {
  Globe,
  UploadCloud,
  Loader2,
  X,
  Send,
  Facebook,
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";
import settingsApi from "./api";
import { uploadMedia, getImageUrl } from "@/lib/media";
import * as yup from "yup";
import { toast } from "sonner";

const settingsValidation = yup.object({
  site_name: yup.string().trim().required("Site name is required"),
  site_title: yup.string().trim().required("Site title / tagline is required"),
  logo: yup.string().nullable().optional(),
  favicon: yup.string().nullable().optional(),
  telegram_url: yup.string().nullable().optional(),
  facebook_url: yup.string().nullable().optional(),
  support_phone: yup.string().nullable().optional(),
  support_email: yup.string().email("Invalid email format").nullable().optional(),
});

const Settings = () => {
  const { data: settingsData, isLoading } = useApi({
    api: settingsApi.get,
    cacheKey: settingsApi.cacheKey,
  });

  const { mutateAsync, isPending } = useRequest();
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  const initialSettings = settingsData?.data || {
    site_name: "",
    site_title: "",
    logo: "",
    favicon: "",
    telegram_url: "",
    facebook_url: "",
    support_phone: "",
    support_email: "",
  };

  const form = useFormik({
    schema: settingsValidation,
    defaultValues: initialSettings,
    onSubmit,
    mode: "onChange",
  });

  useEffect(() => {
    if (settingsData?.data) {
      form.reset({
        site_name: settingsData.data.site_name || "",
        site_title: settingsData.data.site_title || "",
        logo: settingsData.data.logo || "",
        favicon: settingsData.data.favicon || "",
        telegram_url: settingsData.data.telegram_url || "",
        facebook_url: settingsData.data.facebook_url || "",
        support_phone: settingsData.data.support_phone || "",
        support_email: settingsData.data.support_email || "",
      });
    }
  }, [settingsData]);

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setUploading =
      fieldName === "logo" ? setIsUploadingLogo : setIsUploadingFavicon;

    try {
      setUploading(true);
      const fileUrl = await uploadMedia(file, "settings");
      form.setValue(fieldName, fileUrl, { shouldValidate: true });
      toast.success(`${fieldName === "logo" ? "Logo" : "Favicon"} uploaded successfully`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  async function onSubmit(data) {
    try {
      await mutateAsync({
        data,
        api: settingsApi.update,
        cacheKey: settingsApi.cacheKey,
      });
    } catch (err) {
      console.error("Save settings error:", err);
    }
  }

  const logoValue = form.watch("logo");
  const faviconValue = form.watch("favicon");

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            System & Brand Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure site branding, logos, customer support hotlines, and official community channels
          </p>
        </div>

        <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
          <Globe className="h-5 w-5" />
        </div>
      </div>

      <FormikWrapper form={form}>
        <div className="space-y-6">
          {/* Brand Identity Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Brand Identity & Logos
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldInput
                form={form}
                name="site_name"
                label="Site Brand Name"
                placeholder="e.g., BoostGhor Digital"
                required
              />

              <FieldInput
                form={form}
                name="site_title"
                label="Tagline / Window Title"
                placeholder="e.g., Fast & Secure Digital Subscriptions"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">
                  Storefront Logo (Light Header)
                </label>
                <div className="h-24 w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative group">
                  {logoValue ? (
                    <>
                      <img
                        src={getImageUrl(logoValue)}
                        alt="logo preview"
                        className="max-h-16 max-w-[80%] object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => form.setValue("logo", "")}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                      <UploadCloud className="h-6 w-6 text-slate-400 mb-1" />
                      <span className="text-xs font-medium text-slate-600">
                        Upload Brand Logo (PNG / SVG)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "logo")}
                        disabled={isUploadingLogo}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Favicon Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">
                  Browser Tab Favicon (Square Icon)
                </label>
                <div className="h-24 w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative group">
                  {faviconValue ? (
                    <>
                      <img
                        src={getImageUrl(faviconValue)}
                        alt="favicon preview"
                        className="h-10 w-10 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => form.setValue("favicon", "")}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                      <UploadCloud className="h-6 w-6 text-slate-400 mb-1" />
                      <span className="text-xs font-medium text-slate-600">
                        Upload Favicon (32×32 PNG / ICO)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "favicon")}
                        disabled={isUploadingFavicon}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social Channels & Customer Support Hotline */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Send className="h-4 w-4 text-emerald-600" />
              Community & Support Channels
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Send className="h-3.5 w-3.5 text-blue-500" />
                  Official Telegram Channel / Group
                </label>
                <input
                  {...form.register("telegram_url")}
                  placeholder="e.g., https://t.me/boostghordigital"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Facebook className="h-3.5 w-3.5 text-indigo-600" />
                  Facebook Page URL
                </label>
                <input
                  {...form.register("facebook_url")}
                  placeholder="e.g., https://facebook.com/boostghor"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  WhatsApp / Hotline Support Phone
                </label>
                <input
                  {...form.register("support_phone")}
                  placeholder="e.g., +8801812345678"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-amber-600" />
                  Official Support Email
                </label>
                <input
                  {...form.register("support_email")}
                  placeholder="e.g., support@boostghor.com"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isPending || isUploadingLogo || isUploadingFavicon}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-8 text-xs font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Settings...
                </>
              ) : (
                <span>Save Site Settings</span>
              )}
            </Button>
          </div>
        </div>
      </FormikWrapper>
    </div>
  );
};

export default Settings;
