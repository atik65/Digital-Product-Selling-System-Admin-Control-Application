import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Copy, Check } from "lucide-react";
import { formatDate, formatPrice, getStatusBadge } from "@/lib/formatters";
import { useState } from "react";
import { toast } from "sonner";

const MobilePaymentCard = ({ row, onAction }) => {
  const [copied, setCopied] = useState(false);
  const badge = getStatusBadge(row.status);
  const canVerify = row.status === "PENDING" || row.status === "VERIFYING";

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
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-slate-900">
            <span className="select-all truncate">{row.transaction_id}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-slate-400 hover:text-slate-700 shrink-0"
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

      <div className="bg-slate-50 rounded-xl p-2.5 text-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Order & User:</span>
          <span className="font-semibold text-slate-800">
            Order #{row.order_id} (User #{row.user_id})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Sender Number:</span>
          <span className="font-mono font-medium text-slate-700">
            {row.sender_number}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-slate-200 font-bold">
          <span>Amount:</span>
          <span className="text-emerald-700">{formatPrice(row.amount)}</span>
        </div>
      </div>

      {canVerify && (
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs font-semibold rounded-xl"
            onClick={() => onAction(row, "VERIFY")}
          >
            <CheckCircle className="mr-1 h-3.5 w-3.5" />
            Verify
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

export default MobilePaymentCard;
