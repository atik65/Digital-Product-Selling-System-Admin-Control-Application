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
import paymentApi from "../../api";
import { uploadMedia, getImageUrl } from "@/lib/media";
import * as yup from "yup";
import { toast } from "sonner";

const methodValidation = yup.object({
  name: yup.string().trim().required("Method name is required"),
  account_number: yup.string().trim().required("Account number is required"),
  instructions: yup.string().nullable().optional(),
  logo: yup.string().nullable().optional(),
  sort_order: yup.number().typeError("Must be a number").default(0),
  is_active: yup.boolean().default(true),
});

const getValues = (data) => ({
  name: data?.name || "",
  account_number: data?.account_number || "",
  instructions: data?.instructions || "",
  logo: data?.logo || "",
  sort_order: data?.sort_order ?? 0,
  is_active: data?.is_active ?? true,
});

const AddEditMethod = ({ open, onClose, editData = null }) => {
  const { mutateAsync, isPending } = useRequest();
  const isEditMode = !!editData;
  const [isUploading, setIsUploading] = useState(false);

  const form = useFormik({
    schema: methodValidation,
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
      const fileUrl = await uploadMedia(file, "payments");
      form.setValue("logo", fileUrl, { shouldValidate: true });
      toast.success("Logo uploaded successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Logo upload failed");
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
          ? paymentApi.updateMethod(editData.id)
          : paymentApi.createMethod,
        cacheKey: paymentApi.methodsCacheKey,
        handleDone: () => {
          onClose();
          form.reset();
        },
      });
    } catch (err) {
      console.error("Save payment method error:", err);
    }
  }

  const currentLogo = form.watch("logo");

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditMode ? "Edit Payment Method" : "Add Payment Method"}
          </SheetTitle>
          <SheetDescription>
            Configure mobile banking or manual gateway accounts (bKash, Nagad, Rocket, Bank)
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 px-1">
          <FormikWrapper form={form}>
            <div className="space-y-4">
              {/* Logo / QR Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">
                  Gateway Logo / QR Code
                </label>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {currentLogo ? (
                      <>
                        <img
                          src={getImageUrl(currentLogo)}
                          alt="preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => form.setValue("logo", "")}
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
                        <span>Upload Logo</span>
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
                      PNG, JPG or WEBP icon or QR code
                    </p>
                  </div>
                </div>
              </div>

              <FieldInput
                form={form}
                name="name"
                label="Gateway Name"
                placeholder="e.g., bKash Personal, Nagad Agent, Rocket"
                required
              />

              <FieldInput
                form={form}
                name="account_number"
                label="Account / Wallet Number"
                placeholder="e.g., 01700112233"
                required
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Payment Instructions for Customer
                </label>
                <textarea
                  {...form.register("instructions")}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="e.g., Send Money to this personal number and input TrxID below."
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-end">
                <FieldInput
                  form={form}
                  name="sort_order"
                  label="Display Order"
                  type="number"
                  placeholder="0"
                />

                <div className="pb-2">
                  <SwitchField
                    form={form}
                    name="is_active"
                    label="Active in Checkout"
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
                      Saving...
                    </>
                  ) : (
                    <>{isEditMode ? "Save Changes" : "Create Gateway"}</>
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

export default AddEditMethod;
