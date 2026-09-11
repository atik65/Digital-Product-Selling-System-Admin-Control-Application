import { useState } from "react";
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
import { Loader2, Coins, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const WalletAdjustModal = ({ open, onClose, user }) => {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("CREDIT");
  const [description, setDescription] = useState("");
  const { mutateAsync, isPending } = useRequest();

  const handleSubmit = async () => {
    if (!user?.id || !amount || Number(amount) <= 0 || !description.trim()) return;

    try {
      await mutateAsync({
        id: user.id,
        data: {
          amount: Number(amount),
          type,
          description,
        },
        api: walletApi.adjustBalance(user.id),
        cacheKey: "adminUsers",
        handleDone: () => {
          onClose();
          setAmount("");
          setDescription("");
        },
      });
    } catch (err) {
      console.error("Wallet adjustment error:", err);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <Coins className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Adjust Customer Wallet
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {user.email || user.username || `User #${user.id}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 space-y-3">
          {/* Credit or Debit Type Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType("CREDIT")}
              className={cn(
                "flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all",
                type === "CREDIT"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              <ArrowUpRight className="h-4 w-4 text-emerald-600" />
              <span>Credit (Add Funds)</span>
            </button>

            <button
              type="button"
              onClick={() => setType("DEBIT")}
              className={cn(
                "flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all",
                type === "DEBIT"
                  ? "border-rose-500 bg-rose-50 text-rose-700 shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              <ArrowDownLeft className="h-4 w-4 text-rose-600" />
              <span>Debit (Deduct Funds)</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Adjustment Amount (৳) *
            </label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 500"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Audit Reason / Description *
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Promotional welcome bonus, manual refund for Order #12"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={isPending || !amount || !description.trim()}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-10 font-semibold"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Adjusting...
              </>
            ) : (
              <span>Confirm {type === "CREDIT" ? "Credit" : "Debit"}</span>
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

export default WalletAdjustModal;
