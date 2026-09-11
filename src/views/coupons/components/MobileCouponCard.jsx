import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tag, Edit } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/formatters";

const MobileCouponCard = ({ row, onEdit }) => {
  const isPercent = row.type === "PERCENTAGE";
  const isActive = row.is_active;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
            <Tag className="h-4 w-4" />
          </div>
          <div>
            <code className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
              {row.code}
            </code>
            <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
              {isPercent ? `${row.value}% OFF` : `${formatPrice(row.value)} FLAT`}
            </span>
          </div>
        </div>

        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border shrink-0",
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
      </div>

      <div className="bg-slate-50 rounded-xl p-2.5 text-xs space-y-1">
        <div className="flex justify-between text-slate-600">
          <span>Usage:</span>
          <span className="font-semibold text-slate-800">
            {row.used_count || 0}{row.usage_limit ? ` / ${row.usage_limit}` : " used"}
          </span>
        </div>
        {row.minimum_order_amount > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Min Order:</span>
            <span>{formatPrice(row.minimum_order_amount)}</span>
          </div>
        )}
        {row.expires_at && (
          <div className="flex justify-between text-slate-500 text-[11px]">
            <span>Expires:</span>
            <span>{formatDate(row.expires_at)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-1 border-t border-slate-100">
        <Button
          variant="ghost"
          size="sm"
          className="text-emerald-700 hover:bg-emerald-50 h-7 text-xs px-2 gap-1 rounded-lg"
          onClick={() => onEdit(row)}
        >
          <Edit className="h-3.5 w-3.5" />
          Edit Coupon
        </Button>
      </div>
    </div>
  );
};

export default MobileCouponCard;
