import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Copy, Check, CreditCard } from "lucide-react";
import { formatDate, formatPrice, getStatusBadge } from "@/lib/formatters";
import { getImageUrl } from "@/lib/media";
import { useState } from "react";
import { toast } from "sonner";

const MobileTopUpCard = ({ row, onAction }) => {
  const [copied, setCopied] = useState(false);
  const badge = getStatusBadge(row.status);
  const isPending = row.status === "PENDING";

  const user = row.user;
  const avatar = getImageUrl(user?.image);
  const displayName =
    user?.name ||
    user?.username ||
    (row.user_id ? `User #${row.user_id}` : "Customer");
  const initials = (
    (user?.name?.[0] || user?.username?.[0] || user?.email?.[0] || "U")
  ).toUpperCase();

  const method = row.payment_method;
  const logo = getImageUrl(method?.logo);
  const methodName =
    method?.name ||
    (row.payment_method_id
      ? `Method #${row.payment_method_id}`
      : "Direct Transfer");

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(row.transaction_id);
    setCopied(true);
    toast.success("Copied TrxID");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-slate-900">
            <span className="select-all">{row.transaction_id}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-slate-400 hover:text-slate-700"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            {formatDate(row.created_at)}
          </span>
        </div>

        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border shrink-0",
            badge.bg,
            badge.text,
            badge.border
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", badge.dot)} />
          {badge.label}
        </span>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-2">
        {/* Customer Info */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500 shrink-0">Customer:</span>
          <div className="flex items-center gap-2 min-w-0 text-right">
            <div className="h-6 w-6 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-[10px] flex items-center justify-center overflow-hidden shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="font-semibold text-slate-800 truncate">
                {displayName}
              </span>
              {user?.email && (
                <span className="text-[10px] text-slate-400 truncate">
                  {user.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500 shrink-0">Method:</span>
          <div className="flex items-center gap-1.5 min-w-0 text-right">
            <div className="h-5 w-5 rounded bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              {logo ? (
                <img
                  src={logo}
                  alt={methodName}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <CreditCard className="h-3 w-3 text-emerald-600" />
              )}
            </div>
            <span className="font-medium text-slate-800 truncate">
              {methodName}
            </span>
          </div>
        </div>

        {/* Sender or Account */}
        {row.sender_number ? (
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500 shrink-0">Sender Phone:</span>
            <span className="font-mono text-slate-700">{row.sender_number}</span>
          </div>
        ) : method?.account_number ? (
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500 shrink-0">Target Acct:</span>
            <span className="font-mono text-slate-700">{method.account_number}</span>
          </div>
        ) : null}

        {/* Amount */}
        <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/80 font-bold">
          <span className="text-slate-700">Amount:</span>
          <span className="text-emerald-700 text-sm font-extrabold">{formatPrice(row.amount)}</span>
        </div>
      </div>

      {isPending && (
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs font-semibold rounded-xl"
            onClick={() => onAction(row, "APPROVE")}
          >
            <CheckCircle className="mr-1 h-3.5 w-3.5" />
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 h-8 text-xs font-semibold rounded-xl"
            onClick={() => onAction(row, "REJECT")}
          >
            <XCircle className="mr-1 h-3.5 w-3.5" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileTopUpCard;
