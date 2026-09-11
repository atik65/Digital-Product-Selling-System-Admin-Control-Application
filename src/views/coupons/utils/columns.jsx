import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit2, Trash2, Tag } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/formatters";
import ActionDialogDelete from "@/components/common/ActionDialogDelete";

export const couponColumns = [
  {
    header: "COUPON CODE",
    accessorKey: "code",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
          <Tag className="h-4 w-4" />
        </div>
        <code className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded-md">
          {row.code}
        </code>
      </div>
    ),
  },
  {
    header: "DISCOUNT",
    accessorKey: "value",
    cell: ({ row }) => {
      const isPercent = row.type === "PERCENTAGE";
      return (
        <div className="flex flex-col">
          <span className="font-bold text-xs text-emerald-700">
            {isPercent ? `${row.value}% OFF` : `${formatPrice(row.value)} OFF`}
          </span>
          {row.max_discount && isPercent && (
            <span className="text-[10px] text-slate-400">
              Max Cap: {formatPrice(row.max_discount)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    header: "MIN ORDER",
    accessorKey: "minimum_order_amount",
    cell: ({ row }) => (
      <span className="text-xs text-slate-700 font-medium">
        {row.minimum_order_amount > 0
          ? formatPrice(row.minimum_order_amount)
          : "No Min"}
      </span>
    ),
  },
  {
    header: "USAGE REDEEMED",
    accessorKey: "used_count",
    cell: ({ row }) => (
      <div className="flex flex-col text-xs">
        <span className="font-semibold text-slate-800">
          {row.used_count || 0}
          {row.usage_limit ? ` / ${row.usage_limit}` : " uses"}
        </span>
        <span className="text-[10px] text-slate-400">
          Limit {row.per_user_limit || 1} per user
        </span>
      </div>
    ),
  },
  {
    header: "STATUS",
    accessorKey: "is_active",
    cell: ({ row }) => {
      const isActive = row.is_active;
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border",
            isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-100 text-slate-600 border-slate-200"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isActive ? "bg-emerald-500" : "bg-slate-400"
            )}
          />
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    header: "EXPIRES AT",
    accessorKey: "expires_at",
    cell: ({ row }) => (
      <span className="text-xs text-slate-500">
        {row.expires_at ? formatDate(row.expires_at) : "No Expiry"}
      </span>
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
          className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 h-8 w-8 p-0 rounded-lg"
          onClick={() => logics.handleEdit(row)}
          title="Edit Coupon"
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        <ActionDialogDelete
          name={row.code}
          request={{
            id: row.id,
            api: logics.deleteApi(row.id),
            cacheKey: logics.cacheKey,
          }}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8 w-8 p-0 rounded-lg"
              title="Delete Coupon"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          }
        />
      </div>
    ),
  },
];
