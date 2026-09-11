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
import paymentApi from "../../api";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/formatters";

const VerifyRejectModal = ({ open, onClose, payment, actionType = "VERIFY" }) => {
  const [adminNote, setAdminNote] = useState("");
  const { mutateAsync, isPending } = useRequest();
  const isVerify = actionType === "VERIFY";

  useEffect(() => {
    setAdminNote("");
  }, [payment, actionType]);

  const handleSubmit = async () => {
    if (!payment?.id) return;

    try {
      const apiEndpoint = isVerify
        ? paymentApi.verify(payment.id)
        : paymentApi.reject(payment.id);

      await mutateAsync({
        id: payment.id,
        data: { admin_notes: adminNote },
        api: apiEndpoint,
        cacheKey: paymentApi.cacheKey,
        handleDone: () => {
          onClose();
        },
      });
    } catch (err) {
      console.error(`Payment ${actionType} error:`, err);
    }
  };

  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${
                isVerify
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "bg-rose-50 border-rose-200 text-rose-600"
              }`}
            >
              {isVerify ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                {isVerify ? "Approve & Verify Payment" : "Reject Payment Request"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {isVerify
                  ? "Verifying payment will mark the associated order as PAID immediately."
                  : "Rejecting will return payment state to REJECTED."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 space-y-3">
          {/* Summary Box */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction ID:</span>
              <span className="font-mono font-bold text-slate-900 select-all">
                {payment.transaction_id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sender Phone:</span>
              <span className="font-mono font-semibold text-slate-800">
                {payment.sender_number}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Order Number:</span>
              <span className="font-semibold text-slate-800">
                Order #{payment.order_id}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
              <span>Amount:</span>
              <span className="text-emerald-700 text-sm">
                {formatPrice(payment.amount)}
              </span>
            </div>
          </div>

          {/* Note Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              {isVerify ? "Admin Notes (Optional)" : "Reason for Rejection *"}
            </label>
            <textarea
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder={
                isVerify
                  ? "e.g., Verified against bKash merchant statement #4912"
                  : "e.g., TrxID not found in bKash statement, amount mismatch"
              }
            />
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={isPending || (!isVerify && !adminNote.trim())}
            className={`flex-1 text-white text-xs h-10 font-semibold ${
              isVerify
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Processing...
              </>
            ) : (
              <span>{isVerify ? "Confirm & Verify" : "Confirm Rejection"}</span>
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

export default VerifyRejectModal;
