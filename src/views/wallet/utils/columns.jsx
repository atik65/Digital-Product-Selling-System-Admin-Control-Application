import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Copy, Check } from "lucide-react";
import { formatDate, formatPrice, getStatusBadge } from "@/lib/formatters";
import { useState } from "react";
import { toast } from "sonner";

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-slate-400 hover:text-slate-700"
    >
      {copied ? (
        <Check className="h-3 w-3 text-emerald-600" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  );
};

export const topupColumns = [
  {
    header: "TRANSACTION ID",
    accessorKey: "transaction_id",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 font-mono">
        <span className="font-bold text-xs text-slate-900 select-all">
          {row.transaction_id}
        </span>
        <CopyButton text={row.transaction_id} />
      </div>
    ),
  },
  {
    header: "CUSTOMER",
    accessorKey: "user_id",
    cell: ({ row }) => (
      <div className="flex flex-col text-xs">
        <span className="font-semibold text-slate-900">
          User #{row.user_id}
        </span>
        <span className="text-[11px] text-slate-500 font-mono">
          Sender: {row.sender_number}
        </span>
      </div>
    ),
  },
  {
    header: "PAYMENT METHOD",
    accessorKey: "payment_method_id",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-slate-800">
        Method #{row.payment_method_id}
      </span>
    ),
  },
  {
    header: "AMOUNT",
    accessorKey: "amount",
    cell: ({ row }) => (
      <span className="font-bold text-xs text-emerald-700">
        {formatPrice(row.amount)}
      </span>
    ),
  },
  {
    header: "STATUS",
    accessorKey: "status",
    cell: ({ row }) => {
      const badge = getStatusBadge(row.status);
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border",
            badge.bg,
            badge.text,
            badge.border
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", badge.dot)} />
          {badge.label}
        </span>
      );
    },
  },
  {
    header: "DATE",
    accessorKey: "created_at",
    cell: ({ row }) => (
      <span className="text-xs text-slate-500">
        {formatDate(row.created_at)}
      </span>
    ),
  },
  {
    header: "ACTIONS",
    accessorKey: "actions",
    cell: ({ row, logics }) => {
      const isPending = row.status === "PENDING";

      return (
        <div className="flex items-center justify-end gap-1.5">
          {isPending ? (
            <>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-2.5 rounded-lg text-xs font-semibold gap-1"
                onClick={() => logics.handleOpenActionModal(row, "APPROVE")}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Approve</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-rose-200 text-rose-600 hover:bg-rose-50 h-8 px-2.5 rounded-lg text-xs font-semibold gap-1"
                onClick={() => logics.handleOpenActionModal(row, "REJECT")}
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Reject</span>
              </Button>
            </>
          ) : (
            <span className="text-[11px] text-slate-400 italic">
              {row.status === "APPROVED" ? "Credited" : "Rejected"}
            </span>
          )}
        </div>
      );
    },
  },
];
