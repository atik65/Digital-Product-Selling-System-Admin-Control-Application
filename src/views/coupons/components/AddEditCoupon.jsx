import { useEffect } from "react";
import FieldInput from "@/components/common/Formik/FieldInput";
import FieldDatePicker from "@/components/common/Formik/FieldDatePicker";
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
import { Loader2 } from "lucide-react";
import couponApi from "../api";
import couponSchema from "../utils/schema";

const couponTypes = [
  { id: "PERCENTAGE", label: "Percentage (%) Discount" },
  { id: "FIXED", label: "Fixed Amount (৳) Discount" },
];

const AddEditCoupon = ({ open, onClose, editData = null }) => {
  const { mutateAsync, isPending } = useRequest();
  const isEditMode = !!editData;

  const form = useFormik({
    schema: couponSchema.validation,
    defaultValues: couponSchema.values(editData),
    onSubmit,
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(couponSchema.values(editData));
  }, [editData]);

  const discountType = form.watch("type");

  async function onSubmit(data) {
    try {
      await mutateAsync({
        id: editData?.id,
        data: {
          ...data,
          value: Number(data.value),
          max_discount: data.max_discount ? Number(data.max_discount) : null,
          minimum_order_amount: Number(data.minimum_order_amount) || 0,
          usage_limit: data.usage_limit ? Number(data.usage_limit) : null,
          per_user_limit: Number(data.per_user_limit) || 1,
          starts_at: data.starts_at ? new Date(data.starts_at).toISOString() : null,
          expires_at: data.expires_at ? new Date(data.expires_at).toISOString() : null,
        },
        api: isEditMode ? couponApi.update(editData.id) : couponApi.create,
        cacheKey: couponApi.cacheKey,
        handleDone: () => {
          onClose();
          form.reset();
        },
      });
    } catch (err) {
      console.error("Save coupon error:", err);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-slate-100">
          <SheetTitle className="text-base font-bold text-slate-900">
            {isEditMode ? "Edit Promotional Coupon" : "Create Coupon Code"}
          </SheetTitle>
          <SheetDescription className="text-xs text-slate-500">
            Configure promotional discount rules, caps, and redemption limits
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 pb-8">
          <FormikWrapper form={form}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FieldInput
                  form={form}
                  name="code"
                  label="Coupon Code"
                  placeholder="e.g., EID50, DISCOUNT10"
                  onChange={(e) =>
                    form.setValue("code", e.target.value.toUpperCase())
                  }
                  required
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 h-5 flex items-center">
                    Discount Type *
                  </label>
                  <select
                    {...form.register("type")}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {couponTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FieldInput
                  form={form}
                  name="value"
                  label={
                    discountType === "PERCENTAGE"
                      ? "Percentage Discount (%)"
                      : "Discount Amount (৳)"
                  }
                  type="number"
                  placeholder={discountType === "PERCENTAGE" ? "10" : "50"}
                  required
                />

                {discountType === "PERCENTAGE" && (
                  <FieldInput
                    form={form}
                    name="max_discount"
                    label="Max Discount Cap (৳)"
                    type="number"
                    placeholder="e.g., 200"
                  />
                )}
              </div>

              <FieldInput
                form={form}
                name="minimum_order_amount"
                label="Minimum Order Amount (৳)"
                type="number"
                placeholder="0"
              />

              <div className="grid grid-cols-2 gap-3">
                <FieldInput
                  form={form}
                  name="usage_limit"
                  label="Total Platform Usage Limit"
                  type="number"
                  placeholder="e.g., 500"
                />

                <FieldInput
                  form={form}
                  name="per_user_limit"
                  label="Per-User Usage Limit"
                  type="number"
                  placeholder="1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FieldDatePicker
                  form={form}
                  name="starts_at"
                  label="Starts At"
                  placeholder="Select start date"
                />

                <FieldDatePicker
                  form={form}
                  name="expires_at"
                  label="Expires At"
                  placeholder="Select expiry date"
                />
              </div>

              <div className="pb-1">
                <SwitchField
                  form={form}
                  name="is_active"
                  label="Active and Redeemable"
                />
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-100">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{isEditMode ? "Save Changes" : "Create Coupon"}</>
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

export default AddEditCoupon;
