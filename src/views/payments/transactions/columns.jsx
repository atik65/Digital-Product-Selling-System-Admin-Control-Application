import { cn } from "@/lib/utils";
import { formatDate, formatPrice } from "@/lib/formatters";
import { CreditCard } from "lucide-react";
import { CopyButton } from "../verification/utils/columns";

export const sourceTypeLabels = {
  ORDER_PAYMENT: "Order Payment",
  WALLET_TOPUP: "Wallet Top-Up",
};

const sourceTypeStyles = {
  ORDER_PAYMENT: "bg-blue-50 text-blue-700 border-blue-200",
  WALLET_TOPUP: "bg-purple-50 text-purple-700 border-purple-200",
};

export const transactionColumns = [
  {
    header: "DATE & TIME",
    accessorKey: "transaction_at",
    classCell: "whitespace-nowrap",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600">
        {formatDate(row.transaction_at)}
      </span>
    ),
  },
  {
    header: "PAYMENT METHOD",
    accessorKey: "payment_method_id",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-brand-600 shrink-0">
          <CreditCard className="h-4 w-4" />
        </div>
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-slate-900">
            {row.payment_method?.name || `Method #${row.payment_method_id}`}
          </span>
          {row.payment_method?.account_number && (
            <span className="text-[11px] font-mono text-slate-500">
              {row.payment_method.account_number}
            </span>
          )}
        </div>
      </div>
    ),
  },
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
    header: "SENT FROM",
    accessorKey: "sender_number",
    cell: ({ row }) =>
      row.sender_number ? (
        <span className="text-xs font-mono text-slate-700 select-all">
          {row.sender_number}
        </span>
      ) : (
        <span className="text-xs text-slate-400">-</span>
      ),
  },
  {
    header: "AMOUNT",
    accessorKey: "amount",
    cell: ({ row }) => (
      <span className="font-bold text-xs text-brand-700">
        {formatPrice(row.amount)}
      </span>
    ),
  },
  {
    header: "TYPE",
    accessorKey: "source_type",
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border whitespace-nowrap",
          sourceTypeStyles[row.source_type] ||
            "bg-slate-100 text-slate-600 border-slate-200"
        )}
      >
        {sourceTypeLabels[row.source_type] || row.source_type}
      </span>
    ),
  },
  {
    header: "CUSTOMER",
    accessorKey: "user",
    cell: ({ row }) =>
      row.user ? (
        <div className="flex flex-col text-xs">
          <span className="font-medium text-slate-900">
            {row.user.name || row.user.username}
          </span>
          <span className="text-[11px] text-slate-500">{row.user.email}</span>
        </div>
      ) : (
        <span className="text-xs text-slate-400">-</span>
      ),
  },
];
