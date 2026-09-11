import { useState, useEffect } from "react";
import FieldInput from "@/components/common/Formik/FieldInput";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
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
import useApi from "@/hooks/useApi";
import { Loader2, UploadCloud, X } from "lucide-react";
import productApi from "../api";
import { productSchema } from "../utils/schema";
import { uploadMedia, getImageUrl } from "@/lib/media";
import categoryApi from "@/views/categories/api";
import { toast } from "sonner";

const AddEditProduct = ({ open, onClose, editData = null }) => {
  const { mutateAsync, isPending } = useRequest();
  const isEditMode = !!editData;
  const [isUploading, setIsUploading] = useState(false);

  // Fetch categories for dropdown
  const { data: categoriesData } = useApi({
    api: categoryApi.list,
    cacheKey: categoryApi.cacheKey,
  });
  const categories = categoriesData?.data || [];

  const form = useFormik({
    schema: productSchema.validation,
    defaultValues: productSchema.values(editData),
    onSubmit,
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(productSchema.values(editData));
  }, [editData]);

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
      const fileUrl = await uploadMedia(file, "products");
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
          category_id: Number(data.category_id),
          sort_order: Number(data.sort_order) || 0,
        },
        api: isEditMode
          ? productApi.update(editData.id)
          : productApi.create,
        cacheKey: productApi.cacheKey,
        handleDone: async () => {
          onClose();
          form.reset();
        },
      });
    } catch (error) {
      console.error("Product save error:", error);
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
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditMode ? "Edit Product" : "Create Digital Product"}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Update digital product details, category, and fulfillment instructions."
              : "Add a digital subscription, voucher, or game currency product to the catalog."}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 px-1">
          <FormikWrapper form={form}>
            <div className="space-y-4">
              {/* Product Image */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">
                  Product Thumbnail / Banner
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
                        <span>Upload Image</span>
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

              {/* Category Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  {...form.register("category_id")}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">Select a Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {form.formState.errors.category_id && (
                  <p className="text-[11px] text-rose-500">
                    {form.formState.errors.category_id.message}
                  </p>
                )}
              </div>

              <FieldInput
                form={form}
                name="name"
                label="Product Name"
                placeholder="e.g., Free Fire Diamonds, Netflix 4K"
                onChange={handleNameChange}
                required
              />

              <FieldInput
                form={form}
                name="slug"
                label="URL Slug"
                placeholder="e.g., free-fire-diamonds"
                required
              />

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  {...form.register("description")}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Overview of this digital subscription or item"
                />
              </div>

              {/* Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Customer Fulfillment Instructions
                </label>
                <textarea
                  {...form.register("instructions")}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="e.g., Provide your in-game Player ID carefully. Delivery takes 10-30 mins."
                />
              </div>

              <div className="w-1/2">
                <FieldInput
                  form={form}
                  name="sort_order"
                  label="Sort Order"
                  type="number"
                  placeholder="0"
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
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{isEditMode ? "Save Changes" : "Create Product"}</>
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

export default AddEditProduct;
