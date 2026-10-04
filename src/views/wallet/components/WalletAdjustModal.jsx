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
import useApi from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import walletApi from "../api";
import userApi from "@/views/users/api";
import { Loader2, Coins, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";

const WalletAdjustModal = ({ open, onClose, user }) => {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("CREDIT");
  const [description, setDescription] = useState("");
  const { mutateAsync, isPending } = useRequest();

  const { data: detailData, isLoading: isFetchingUser } = useApi({
    api: user?.id ? userApi.show(user.id) : null,
    cacheKey: `userDetail-${user?.id}`,
    trigger: !!user?.id && open,
  });

  const userData = detailData?.data || user;
  const currentBalance = userData?.wallet?.balance ?? userData?.wallet_balance ?? 0;
  const currency = userData?.wallet?.currency || "BDT";

  useEffect(() => {
    if (open) {
      setAmount("");
      setDescription("");
      setType("CREDIT");
    }
  }, [open, user?.id]);

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
          queryClient.invalidateQueries({ queryKey: [`userDetail-${user.id}`] });
          queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
          queryClient.invalidateQueries({ queryKey: ["adminTopups"] });
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
                {userData.email || userData.username || `User #${userData.id}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 space-y-3">
          {/* Current Wallet Balance Card */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-700 font-semibold block">
                Current Wallet Balance
              </span>
              <span className="text-xl font-extrabold text-emerald-800 flex items-center gap-1.5">
                {isFetchingUser && !detailData ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-normal text-emerald-600">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Fetching balance...
                  </span>
                ) : (
                  formatPrice(currentBalance)
                )}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Currency
              </span>
              <span className="text-xs font-mono font-bold text-slate-700">
                {currency}
              </span>
            </div>
          </div>
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
