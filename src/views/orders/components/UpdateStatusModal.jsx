import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useRequest from "@/hooks/useRequest";
import orderApi from "../api";
import { Loader2, CheckCircle2 } from "lucide-react";
import { getStatusBadge } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const statusList = [
  { value: "PAYMENT_PENDING", label: "Payment Pending", desc: "Waiting for manual payment confirmation" },
  { value: "PAID", label: "Paid", desc: "Payment successfully verified" },
  { value: "PROCESSING", label: "Processing", desc: "Digital goods being procured/generated" },
  { value: "COMPLETED", label: "Completed", desc: "Order fulfilled and delivered to customer" },
  { value: "CANCELLED", label: "Cancelled", desc: "Order voided or aborted" },
  { value: "FAILED", label: "Failed", desc: "Payment or fulfillment failed" },
  { value: "REFUNDED", label: "Refunded", desc: "Payment returned to customer wallet" },
];

const UpdateStatusModal = ({ open, onClose, order }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const { mutateAsync, isPending } = useRequest();

  useEffect(() => {
    if (order?.status) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  const handleSubmit = async () => {
    if (!order?.id || !selectedStatus) return;

    try {
      await mutateAsync({
        id: order.id,
        data: { status: selectedStatus },
        api: orderApi.updateStatus(order.id),
        cacheKey: orderApi.cacheKey,
        handleDone: () => {
          onClose();
        },
      });
    } catch (err) {
      console.error("Order status update error:", err);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Update Order Status
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-mono">
                {order.order_number}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-3 space-y-2">
          {statusList.map((st) => {
            const isSelected = selectedStatus === st.value;
            const badge = getStatusBadge(st.value);

            return (
              <div
                key={st.value}
                onClick={() => setSelectedStatus(st.value)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer",
                  isSelected
                    ? "border-blue-500 bg-blue-50/50 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">
                      {st.label}
                    </span>
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        badge.dot
                      )}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{st.desc}</p>
                </div>

                <div
                  className={cn(
                    "h-4 w-4 rounded-full border flex items-center justify-center transition-colors shrink-0",
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white"
                  )}
                >
                  {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="flex-row gap-2 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={isPending || selectedStatus === order.status}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-10 font-semibold"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Updating...
              </>
            ) : (
              <span>Confirm Status</span>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="text-xs h-10 font-semibold"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusModal;
