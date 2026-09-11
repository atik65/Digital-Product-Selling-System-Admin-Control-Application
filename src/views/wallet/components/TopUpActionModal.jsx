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
import walletApi from "../api";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/formatters";

const TopUpActionModal = ({ open, onClose, topup, actionType = "APPROVE" }) => {
  const [adminNote, setAdminNote] = useState("");
  const { mutateAsync, isPending } = useRequest();
  const isApprove = actionType === "APPROVE";

  useEffect(() => {
    setAdminNote("");
  }, [topup, actionType]);

  const handleSubmit = async () => {
    if (!topup?.id) return;

    try {
      const apiEndpoint = isApprove
        ? walletApi.approveTopup(topup.id)
        : walletApi.rejectTopup(topup.id);

      await mutateAsync({
        id: topup.id,
        data: { admin_notes: adminNote },
        api: apiEndpoint,
        cacheKey: walletApi.cacheKey,
        handleDone: () => {
          onClose();
        },
      });
    } catch (err) {
      console.error(`Top-up ${actionType} error:`, err);
    }
  };

  if (!topup) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${
                isApprove
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "bg-rose-50 border-rose-200 text-rose-600"
              }`}
            >
              {isApprove ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                {isApprove ? "Approve Wallet Top-Up" : "Reject Top-Up Request"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {isApprove
                  ? "Approving will atomically credit customer balance by the specified amount."
                  : "Rejecting will decline this balance top-up request."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 space-y-3">
          {/* Summary */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-semibold text-slate-800">User #{topup.user_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction ID:</span>
              <span className="font-mono font-bold text-slate-900 select-all">
                {topup.transaction_id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sender Number:</span>
              <span className="font-mono font-medium text-slate-800">
                {topup.sender_number}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
              <span>Credit Amount:</span>
              <span className="text-emerald-700 text-sm">{formatPrice(topup.amount)}</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              {isApprove ? "Admin Notes (Optional)" : "Reason for Rejection *"}
            </label>
            <textarea
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder={
                isApprove
                  ? "e.g., Verified in Nagad merchant statement"
                  : "e.g., TrxID invalid or already used"
              }
            />
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={isPending || (!isApprove && !adminNote.trim())}
            className={`flex-1 text-white text-xs h-10 font-semibold ${
              isApprove
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
              <span>{isApprove ? "Approve & Credit Balance" : "Confirm Rejection"}</span>
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

export default TopUpActionModal;
