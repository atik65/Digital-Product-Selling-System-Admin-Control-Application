import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag, ChevronRight, CheckCircle2, MessageSquare } from "lucide-react";
import { formatDate, formatPrice, getStatusBadge } from "@/lib/formatters";

const MobileOrderCard = ({
  row,
  onClick,
  onUpdateStatus,
  onEditNote,
}) => {
  const badge = getStatusBadge(row.status);
  const items = row.items || [];
  const firstItem = items[0];

  return (
    <div
      onClick={() => onClick && onClick(row)}
      className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-emerald-300 transition-all active:scale-[0.99] cursor-pointer space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-slate-900">
            <span>{row.order_number}</span>
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

      {/* Customer & Product preview */}
      <div className="bg-slate-50 rounded-xl p-2.5 text-xs space-y-1">
        <div className="flex items-center justify-between text-slate-600">
          <span className="font-semibold text-slate-800">
            {row.user?.name || row.user?.username || `User #${row.user_id}`}
          </span>
          <span className="font-bold text-emerald-700">
            {formatPrice(row.total_amount)}
          </span>
        </div>
        {firstItem && (
          <p className="text-[11px] text-slate-500 truncate">
            {firstItem.product_name} • {firstItem.package_name}
            {items.length > 1 && ` (+${items.length - 1} more)`}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div
        className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-2 gap-1 rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={() => onUpdateStatus(row)}
          >
            <CheckCircle2 className="h-3 w-3" />
            Status
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs px-2 gap-1 rounded-lg text-slate-500 hover:bg-slate-100"
            onClick={() => onEditNote(row)}
          >
            <MessageSquare className="h-3 w-3" />
            Note
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-slate-400 hover:text-slate-700 rounded-lg"
          onClick={() => onClick(row)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MobileOrderCard;
