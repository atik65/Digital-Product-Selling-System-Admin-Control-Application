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

const bannerValidation = yup.object({
  image: yup.string().trim().required("Desktop Banner Image is required"),
  mobile_image: yup.string().nullable().optional(),
  title: yup.string().nullable().optional(),
  description: yup.string().nullable().optional(),
  button_text: yup.string().nullable().optional(),
  button_url: yup.string().nullable().optional(),
  sort_order: yup.number().typeError("Must be a number").default(0),
  is_active: yup.boolean().default(true),
});

const getValues = (data) => ({
  image: data?.image || "",
  mobile_image: data?.mobile_image || "",
  title: data?.title || "",
  description: data?.description || "",
  button_text: data?.button_text || "",
  button_url: data?.button_url || "",
  sort_order: data?.sort_order ?? 0,
  is_active: data?.is_active ?? true,
});

const AddEditBanner = ({ open, onClose, editData = null }) => {
  const { mutateAsync, isPending } = useRequest();
  const isEditMode = !!editData;
  const [isUploading, setIsUploading] = useState(false);

  const form = useFormik({
    schema: bannerValidation,
    defaultValues: getValues(editData),
    onSubmit,
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(getValues(editData));
  }, [editData]);

  const handleFileUpload = async (e, fieldName = "image") => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileUrl = await uploadMedia(file, "banners");
      form.setValue(fieldName, fileUrl, { shouldValidate: true });
      toast.success("Banner uploaded successfully");
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
          sort_order: Number(data.sort_order) || 0,
        },
        api: isEditMode
          ? marketingApi.updateBanner(editData.id)
          : marketingApi.createBanner,
        cacheKey: marketingApi.bannersCacheKey,
        handleDone: () => {
          onClose();
          form.reset();
        },
      });
    } catch (err) {
      console.error("Save banner error:", err);
    }
  }

  const currentImage = form.watch("image");

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditMode ? "Edit Promotional Banner" : "New Hero Banner"}
          </SheetTitle>
          <SheetDescription>
            Configure storefront carousel banner images, call-to-action buttons, and links
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 px-1">
          <FormikWrapper form={form}>
            <div className="space-y-4">
              {/* Desktop Banner Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">
                  Banner Graphic (Desktop / Wide) *
                </label>
                <div className="h-28 w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative group">
                  {currentImage ? (
                    <>
                      <img
                        src={getImageUrl(currentImage)}
                        alt="banner preview"
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
                      <UploadCloud className="h-7 w-7 text-slate-400 mb-1" />
                      <span className="text-xs font-medium text-slate-600">
                        Upload 1920×600 or 1200×400 banner
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "image")}
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
                label="Headline Title"
                placeholder="e.g., Eid Special 50% Off On All Diamonds"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Subtitle Description
                </label>
                <textarea
                  {...form.register("description")}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="e.g., Instant delivery directly to your game player ID 24/7."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FieldInput
                  form={form}
                  name="button_text"
                  label="Button Label"
                  placeholder="e.g., Buy Now, Top-Up"
                />

                <FieldInput
                  form={form}
                  name="button_url"
                  label="Button Target URL"
                  placeholder="e.g., /products/free-fire-diamonds"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-end">
                <FieldInput
                  form={form}
                  name="sort_order"
                  label="Sort Order"
                  type="number"
                  placeholder="0"
                />

                <div className="pb-2">
                  <SwitchField
                    form={form}
                    name="is_active"
                    label="Active on Storefront"
                  />
                </div>
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
                    <span>{isEditMode ? "Save Changes" : "Create Banner"}</span>
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

export default AddEditBanner;
