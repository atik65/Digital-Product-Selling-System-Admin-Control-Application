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
import categoryApi from "../api";
import categorySchema from "../utils/schema";
import { uploadMedia, getImageUrl } from "@/lib/media";
import { toast } from "sonner";

const AddEdit = ({ open, onClose, editData = null }) => {
  const { mutateAsync, isPending } = useRequest();
  const isEditMode = !!editData;
  const [isUploading, setIsUploading] = useState(false);

  const form = useFormik({
    schema: categorySchema.validation,
    defaultValues: categorySchema.values(editData),
    onSubmit,
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(categorySchema.values(editData));
  }, [editData]);

  // Auto-generate slug when name changes if adding new category
  const handleNameChange = (e) => {
    const nameVal = e.target.value;
    form.setValue("name", nameVal, { shouldValidate: true });
    if (!isEditMode) {
      const generatedSlug = nameVal
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      form.setValue("slug", generatedSlug, { shouldValidate: true });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileUrl = await uploadMedia(file, "categories");
      form.setValue("image", fileUrl, { shouldValidate: true });
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Image upload failed");
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
          ? categoryApi.update(editData.id)
          : categoryApi.create,
        cacheKey: categoryApi.cacheKey,
        handleDone: async () => {
          onClose();
          form.reset();
        },
      });
    } catch (error) {
      console.error("Category save error:", error);
    }
  }

  const handleClose = () => {
    if (!isPending) {
      form.reset();
      onClose();
    }
  };

  const currentImage = form.watch("image");

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditMode ? "Edit Category" : "Add New Category"}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Update category configuration and display settings."
              : "Create a digital product catalog category."}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 px-1">
          <FormikWrapper form={form}>
            <div className="space-y-4">
              {/* Category Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">
                  Category Icon / Image
                </label>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {currentImage ? (
                      <>
                        <img
                          src={getImageUrl(currentImage)}
                          alt="preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => form.setValue("image", "")}
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <UploadCloud className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 cursor-pointer">
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <span>Choose File</span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mt-1">
                      PNG, JPG, SVG or WEBP up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              <FieldInput
                form={form}
                name="name"
                label="Category Name"
                placeholder="e.g., Streaming, Gaming"
                onChange={handleNameChange}
                required
              />

              <FieldInput
                form={form}
                name="slug"
                label="URL Slug"
                placeholder="e.g., streaming-services"
                required
              />

              <FieldInput
                form={form}
                name="description"
                label="Description"
                placeholder="Short summary of products in this category"
              />

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
                    label="Active in Store"
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
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{isEditMode ? "Save Changes" : "Create Category"}</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
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

export default AddEdit;
