import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useRequest from "@/hooks/useRequest";
import lotteryApi from "../api";
import { Loader2, Plus, Gift, Percent, Tag, Award } from "lucide-react";
import useFormik from "@/hooks/useFormik";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import FieldInput from "@/components/common/Formik/FieldInput";
import * as yup from "yup";

const prizeValidation = yup.object({
  discount_type: yup
    .string()
    .oneOf(["PERCENTAGE", "FIXED", "FREE"])
    .required("Type is required"),
  discount_value: yup
    .number()
    .typeError("Value must be a number")
    .min(0.01, "Must be greater than 0")
    .required("Value is required"),
  probability: yup
    .number()
    .typeError("Probability must be a number")
    .min(0.001, "Min probability is 0.001")
    .max(1.0, "Max probability is 1.0")
    .required("Probability is required"),
  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .min(1)
    .required("Quantity is required"),
});

const discountTypes = [
  { id: "PERCENTAGE", label: "Percentage Discount (e.g. 20%)" },
  { id: "FIXED", label: "Fixed Taka Discount (e.g. ৳50)" },
  { id: "FREE", label: "Free Reward (e.g. 100 Diamonds)" },
];

const ManagePrizesModal = ({ open, onClose, lottery }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { mutateAsync, isPending } = useRequest();

  const form = useFormik({
    schema: prizeValidation,
    defaultValues: {
      discount_type: "PERCENTAGE",
      discount_value: "",
      probability: "",
      quantity: 10,
    },
    onSubmit,
    mode: "onChange",
  });

  async function onSubmit(data) {
    if (!lottery?.id) return;

    try {
      await mutateAsync({
        data: {
          discount_type: data.discount_type,
          discount_value: Number(data.discount_value),
          probability: Number(data.probability),
          quantity: Number(data.quantity),
        },
        api: lotteryApi.addPrize(lottery.id),
        cacheKey: lotteryApi.cacheKey,
        handleDone: () => {
          setIsAdding(false);
          form.reset();
        },
      });
    } catch (err) {
      console.error("Add prize error:", err);
    }
  }

  if (!lottery) return null;

  const prizes = lottery.prizes || [];

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <Gift className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Prize Pool Configurator
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Configure prize segments and winning chances for {lottery.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 space-y-4">
          {!isAdding && (
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-700">
                Prize Segments ({prizes.length})
              </span>
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg h-8 text-xs font-medium"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add Prize Segment
              </Button>
            </div>
          )}

          {isAdding && (
            <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">
                New Prize Segment
              </h4>

              <FormikWrapper form={form}>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Prize Type *
                    </label>
                    <select
                      {...form.register("discount_type")}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                      {discountTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <FieldInput
                      form={form}
                      name="discount_value"
                      label="Prize Value"
                      type="number"
                      placeholder="e.g., 20 or 50"
                      required
                    />

                    <FieldInput
                      form={form}
                      name="probability"
                      label="Probability (0 - 1)"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 0.10"
                      required
                    />

                    <FieldInput
                      form={form}
                      name="quantity"
                      label="Quantity Available"
                      type="number"
                      placeholder="10"
                      required
                    />
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Example: Probability 0.05 represents a 5% winning chance on each customer wheel spin.
                  </p>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-9"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <span>Add to Wheel</span>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAdding(false)}
                      disabled={isPending}
                      className="text-xs h-9"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </FormikWrapper>
            </div>
          )}

          {/* Existing Prizes */}
          {prizes.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500">No prizes configured for this campaign yet.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Add at least one prize segment so the wheel has reward options.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {prizes.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">
                      {p.discount_type === "PERCENTAGE" ? "%" : "৳"}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">
                        {p.discount_type === "PERCENTAGE"
                          ? `${p.discount_value}% Discount`
                          : p.discount_type === "FREE"
                          ? `Free Reward (${p.discount_value})`
                          : `৳${p.discount_value} Discount`}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Probability: {(p.probability * 100).toFixed(1)}% • Remaining: {p.quantity} left
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {(p.probability * 100).toFixed(1)}% chance
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManagePrizesModal;
