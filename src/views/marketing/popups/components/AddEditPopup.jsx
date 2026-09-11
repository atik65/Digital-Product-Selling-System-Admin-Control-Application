import { useState, useEffect } from "react";
import FieldInput from "@/components/common/Formik/FieldInput";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import SwitchField from "@/components/common/Formik/SwitchField";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useFormik from "@/hooks/useFormik";
import useRequest from "@/hooks/useRequest";
import { Loader2, UploadCloud, X } from "lucide-react";
import marketingApi from "../../api";
import { uploadMedia, getImageUrl } from "@/lib/media";
import * as yup from "yup";
import { toast } from "sonner";

const displayTypes = [
  { id: "ON_FIRST_VISIT", label: "Once Per Session (First Visit)" },
  { id: "ONCE_PER_USER", label: "Once Ever Per User Browser" },
  { id: "AFTER_X_SECONDS", label: "Delayed (After 5-10 Seconds)" },
];

const popupValidation = yup.object({
  title: yup.string().trim().required("Title is required"),
  content: yup.string().nullable().optional(),
  image: yup.string().nullable().optional(),
  button_text: yup.string().nullable().optional(),
  button_url: yup.string().nullable().optional(),
  display_type: yup.string().required("Display trigger rule is required"),
  starts_at: yup.string().nullable().optional(),
  ends_at: yup.string().nullable().optional(),
  is_active: yup.boolean().default(true),
});

const getValues = (data) => ({
  title: data?.title || "",
  content: data?.content || "",
  image: data?.image || "",
  button_text: data?.button_text || "",
  button_url: data?.button_url || "",
  display_type: data?.display_type || "ON_FIRST_VISIT",
  starts_at: data?.starts_at ? data.starts_at.slice(0, 16) : "",
  ends_at: data?.ends_at ? data.ends_at.slice(0, 16) : "",
  is_active: data?.is_active ?? true,
});

const AddEditPopup = ({ open, onClose, editData = null }) => {
  const { mutateAsync, isPending } = useRequest();
  const isEditMode = !!editData;
  const [isUploading, setIsUploading] = useState(false);

  const form = useFormik({
    schema: popupValidation,
    defaultValues: getValues(editData),
    onSubmit,
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(getValues(editData));
  }, [editData]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileUrl = await uploadMedia(file, "popups");
      form.setValue("image", fileUrl, { shouldValidate: true });
      toast.success("Graphic uploaded successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(data) {
    try {
      await mutateAsync({
        id: editData?.id,
        data: {
          ...data,
          starts_at: data.starts_at ? new Date(data.starts_at).toISOString() : null,
          ends_at: data.ends_at ? new Date(data.ends_at).toISOString() : null,
        },
        api: isEditMode
          ? marketingApi.updatePopup(editData.id)
          : marketingApi.createPopup,
        cacheKey: marketingApi.popupsCacheKey,
        handleDone: () => {
          onClose();
          form.reset();
        },
      });
    } catch (err) {
      console.error("Save popup error:", err);
    }
  }

  const currentImage = form.watch("image");

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditMode ? "Edit Announcement Modal" : "Create Announcement Popup"}
          </SheetTitle>
          <SheetDescription>
            Configure notice modals, promotional graphics, and trigger behaviors
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 px-1">
          <FormikWrapper form={form}>
            <div className="space-y-4">
              {/* Image Graphic */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">
                  Modal Graphic (Optional)
                </label>
                <div className="h-24 w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative group">
                  {currentImage ? (
                    <>
                      <img
                        src={getImageUrl(currentImage)}
                        alt="popup preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => form.setValue("image", "")}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                      <UploadCloud className="h-6 w-6 text-slate-400 mb-1" />
                      <span className="text-xs font-medium text-slate-600">
                        Upload banner graphic (PNG/JPG)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <FieldInput
                form={form}
                name="title"
                label="Popup Headline"
                placeholder="e.g., Notice: Server Maintenance at 2 AM"
                required
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Notice Body / Content
                </label>
                <textarea
                  {...form.register("content")}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="e.g., Our payments gateway will be briefly updating tonight. All pending orders are safe."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Trigger Behavior *
                </label>
                <select
                  {...form.register("display_type")}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {displayTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FieldInput
                  form={form}
                  name="button_text"
                  label="Button Label"
                  placeholder="e.g., Read More, Join Telegram"
                />

                <FieldInput
                  form={form}
                  name="button_url"
                  label="Button Target URL"
                  placeholder="e.g., https://t.me/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Starts At
                  </label>
                  <input
                    type="datetime-local"
                    {...form.register("starts_at")}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Ends At
                  </label>
                  <input
                    type="datetime-local"
                    {...form.register("ends_at")}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="pb-1">
                <SwitchField
                  form={form}
                  name="is_active"
                  label="Active Popup Announcement"
                />
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-100">
                <Button
                  type="submit"
                  disabled={isPending || isUploading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <span>{isEditMode ? "Save Changes" : "Create Popup"}</span>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isPending}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </FormikWrapper>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddEditPopup;
