import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import {
  Coins,
  Copy,
  Check,
  Calendar,
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
  Wallet,
  Phone,
} from "lucide-react";
import useApi from "@/hooks/useApi";
import userApi from "../api";
import { formatDate, formatPrice, getStatusBadge } from "@/lib/formatters";
import { getImageUrl } from "@/lib/media";
import { toast } from "sonner";

const UserTopUpsDrawer = ({ open, onClose, user, onAdjustBalance, onAction }) => {
  const [copiedKey, setCopiedKey] = useState(null);

  const { data: detailData, isLoading } = useApi({
    api: user?.id ? userApi.show(user.id) : null,
    cacheKey: `userDetail-${user?.id}`,
    trigger: !!user?.id && open,
  });

  if (!user) return null;

  const userData = detailData?.data || user;
  const avatar = getImageUrl(userData.image);
  const isAdmin = userData.role === "admin";
  const topups = userData.topups || [];
  const currentBalance = userData.wallet?.balance ?? userData.wallet_balance ?? 0;
  const currency = userData.wallet?.currency || "BDT";

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    setCopiedKey(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <Drawer open={open} onOpenChange={(val) => !val && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-2xl overflow-y-auto px-4 pb-6 pt-2">
          {/* iOS Handle bar */}
          <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-200 mb-4" />

          {/* Header */}
          <DrawerHeader className="px-0 pb-3 pt-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-12 w-12 rounded-full bg-purple-100 border border-purple-200 text-purple-800 font-bold text-base flex items-center justify-center overflow-hidden shrink-0">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={userData.name || userData.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (userData.name?.[0] || userData.username?.[0] || "U").toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <DrawerTitle className="text-lg font-bold text-slate-900 truncate">
                      {userData.name || userData.username}&apos;s Top-Ups
                    </DrawerTitle>
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0",
                        isAdmin
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      )}
                    >
                      {isAdmin ? "Admin" : "Customer"}
                    </span>
                  </div>
                  <DrawerDescription className="text-xs text-slate-500 truncate mt-0.5">
                    {userData.email}
                  </DrawerDescription>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200/80 text-purple-700 shrink-0">
                <CreditCard className="h-4 w-4" />
                <span className="text-xs font-bold">
                  {topups.length} {topups.length === 1 ? "Request" : "Requests"}
                </span>
              </div>
            </div>
          </DrawerHeader>

          {/* Wallet Balance Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between my-3">
            <div>
              <span className="text-[11px] text-emerald-700 font-semibold block">
                Available Wallet Credits
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-emerald-800">
                  {formatPrice(currentBalance)}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600">
                  {currency}
                </span>
              </div>
            </div>
            {onAdjustBalance && (
              <Button
                size="sm"
                className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold h-9 shadow-xs"
                onClick={() => {
                  onClose();
                  onAdjustBalance(userData);
                }}
              >
                <Coins className="mr-1.5 h-3.5 w-3.5" />
                Adjust Balance
              </Button>
            )}
          </div>

          {/* Content Body */}
          <div className="space-y-3 py-2">
            {isLoading && !detailData ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <Loader2 className="h-8 w-8 text-purple-600 animate-spin mb-3" />
                <p className="text-sm font-semibold text-slate-700">Loading Top-Up History...</p>
                <p className="text-xs text-slate-400 mt-0.5">Fetching latest transaction records</p>
              </div>
            ) : topups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-6">
                <div className="h-12 w-12 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-500 mb-3">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">No Top-Up Requests</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  This user has not submitted any manual wallet deposit requests yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {topups.map((topup) => {
                  const badge = getStatusBadge(topup.status);
                  const isPending = topup.status === "PENDING";
                  const paymentMethod = topup.payment_method;

                  return (
                    <div
                      key={topup.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs hover:border-purple-200 transition-all"
                    >
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900">
                            <span className="select-all">{topup.transaction_id}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(topup.transaction_id, `trx-${topup.id}`)}
                              className="text-slate-400 hover:text-slate-700 transition-colors"
                              title="Copy Transaction ID"
                            >
                              {copiedKey === `trx-${topup.id}` ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <Calendar className="h-3 w-3" />
                            <span>Submitted on {formatDate(topup.created_at)}</span>
                          </div>
                        </div>

                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border shrink-0",
                            badge.bg,
                            badge.text,
                            badge.border
                          )}
                        >
                          <span className={cn("h-1.5 w-1.5 rounded-full", badge.dot)} />
                          {badge.label}
                        </span>
                      </div>

                      {/* Payment Details Card */}
                      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[11px] text-slate-400 block">Payment Method</span>
                          <span className="font-semibold text-slate-800">
                            {paymentMethod?.name ||
                              (topup.payment_method_id
                                ? `Method #${topup.payment_method_id}`
                                : "Direct Transfer")}
                          </span>
                          {paymentMethod?.account_number && (
                            <span className="text-[11px] text-slate-500 font-mono block">
                              Target: {paymentMethod.account_number}
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="text-[11px] text-slate-400 block">Sender Number</span>
                          <span className="font-mono font-medium text-slate-800 flex items-center gap-1">
                            <Phone className="h-3 w-3 text-slate-400" />
                            {topup.sender_number || "Not provided"}
                          </span>
                        </div>

                        <div className="sm:col-span-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Requested Credit:</span>
                          <span className="text-base font-extrabold text-emerald-700">
                            {formatPrice(topup.amount)}
                          </span>
                        </div>
                      </div>

                      {/* Verification Remarks & Admin Note */}
                      {(topup.verified_at || topup.admin_note) && (
                        <div className="bg-blue-50/60 rounded-xl p-2.5 border border-blue-100 text-xs text-blue-900 space-y-1">
                          {topup.verified_at && (
                            <span className="text-[11px] text-blue-700 block">
                              Verified at: {formatDate(topup.verified_at)}
                            </span>
                          )}
                          {topup.admin_note && (
                            <p className="leading-relaxed italic">
                              &quot;{topup.admin_note}&quot;
                            </p>
                          )}
                        </div>
                      )}

                      {/* Action buttons if Pending */}
                      {isPending && onAction && (
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                          <Button
                            size="sm"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs font-semibold rounded-xl"
                            onClick={() => onAction(topup, "APPROVE")}
                          >
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                            Approve & Credit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 h-8 text-xs font-semibold rounded-xl"
                            onClick={() => onAction(topup, "REJECT")}
                          >
                            <XCircle className="mr-1 h-3.5 w-3.5" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DrawerFooter className="px-0 pt-4 flex-row gap-2">
            {onAdjustBalance && (
              <Button
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-11 text-xs font-semibold"
                onClick={() => {
                  onClose();
                  onAdjustBalance(userData);
                }}
              >
                <Coins className="mr-1.5 h-3.5 w-3.5" />
                Adjust Wallet Balance
              </Button>
            )}
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-11 text-xs font-semibold"
              >
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default UserTopUpsDrawer;
