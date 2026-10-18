import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, Edit3, CheckCircle2, MessageSquare } from "lucide-react";
import { formatDate, formatPrice, getStatusBadge } from "@/lib/formatters";
import { CopyButton } from "@/views/payments/verification/utils/columns";

export const orderColumns = [
  {
    header: "ORDER NO",
    accessorKey: "order_number",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-mono font-bold text-xs text-slate-900">
          {row.order_number}
        </span>
        <span className="text-[11px] text-slate-400">
          {formatDate(row.created_at)}
        </span>
      </div>
    ),
  },
  {
    header: "CUSTOMER",
    accessorKey: "user",
    cell: ({ row }) => {
      const user = row.user;
      return (
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-xs text-slate-800 truncate">
            {user?.name || user?.username || `User #${row.user_id}`}
          </span>
          <span className="text-[11px] text-slate-500 truncate">
            {user?.email || user?.phone || "-"}
          </span>
        </div>
      );
    },
  },
  {
    header: "PACKAGE / ITEMS",
    accessorKey: "items",
    cell: ({ row }) => {
      const items = row.items || [];
      if (!items.length) return <span className="text-xs text-slate-400">-</span>;
      const firstItem = items[0];

      return (
        <div className="flex flex-col">
          <span className="font-medium text-xs text-slate-900 truncate max-w-xs">
            {firstItem.product_name} • {firstItem.package_name}
          </span>
          {items.length > 1 && (
            <span className="text-[10px] text-slate-400">
              +{items.length - 1} more item(s)
            </span>
          )}
        </div>
      );
    },
  },
  {
    header: "TOTAL AMOUNT",
    accessorKey: "total_amount",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-xs text-brand-700">
          {formatPrice(row.total_amount)}
        </span>
        {row.discount > 0 && (
          <span className="text-[10px] text-rose-500 font-medium">
            Saved {formatPrice(row.discount)}
          </span>
        )}
      </div>
    ),
  },
  {
    header: "TRANSACTION ID",
    accessorKey: "payments",
    cell: ({ row }) => {
      // Latest submission first; an order can have several (e.g. after a rejection)
      const payments = [...(row.payments || [])].sort((a, b) => b.id - a.id);
      if (!payments.length) {
        return <span className="text-xs text-slate-400">-</span>;
      }
      const latest = payments[0];
      const badge = getStatusBadge(latest.status);

      return (
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="font-bold text-xs text-slate-900 select-all">
              {latest.transaction_id}
            </span>
            <CopyButton text={latest.transaction_id} />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", badge.dot)} />
            <span className="truncate">
              {latest.payment_method?.name || `Method #${latest.payment_method_id}`}
              {" • "}
              {badge.label}
            </span>
          </div>
          {payments.length > 1 && (
            <span
              className="text-[10px] text-slate-400"
              title={payments.map((p) => p.transaction_id).join(", ")}
            >
              +{payments.length - 1} earlier attempt(s)
            </span>
          )}
        </div>
      );
    },
  },
  {
    header: "STATUS",
    accessorKey: "status",
    cell: ({ row, logics }) => {
      const badge = getStatusBadge(row.status);
      return (
        <button
          type="button"
          onClick={() => logics.handleOpenStatusModal && logics.handleOpenStatusModal(row)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border transition-all cursor-pointer",
            badge.bg,
            badge.text,
            badge.border,
            "hover:opacity-85"
          )}
          title="Click to update order status"
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", badge.dot)} />
          {badge.label}
        </button>
      );
    },
  },
  {
    header: "ADMIN NOTE",
    accessorKey: "admin_note",
    cell: ({ row, logics }) => (
      <div
        className="max-w-[140px] truncate text-xs cursor-pointer text-slate-500 hover:text-slate-800"
        onClick={() => logics.handleOpenNoteModal && logics.handleOpenNoteModal(row)}
        title="Click to edit fulfillment note"
      >
        {row.admin_note ? (
          <span className="font-medium text-slate-700">{row.admin_note}</span>
        ) : (
          <span className="text-slate-400 italic flex items-center gap-1">
            <Edit3 className="h-3 w-3" /> Add note
          </span>
        )}
      </div>
    ),
  },
  {
    header: "ACTIONS",
    accessorKey: "actions",
    cell: ({ row, logics }) => (
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="text-brand-700 hover:text-brand-800 hover:bg-brand-50 h-8 px-2 rounded-lg gap-1 text-xs font-medium"
          onClick={() => logics.handleOpenDrawer(row)}
          title="View Order Details"
        >
          <Eye className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Inspect</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0 rounded-lg"
          onClick={() => logics.handleOpenStatusModal(row)}
          title="Update Status"
        >
          <CheckCircle2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 h-8 w-8 p-0 rounded-lg"
          onClick={() => logics.handleOpenNoteModal(row)}
          title="Edit Admin Note"
        >
          <MessageSquare className="h-3.5 w-3.5" />
        </Button>
      </div>
    ),
  },
];
