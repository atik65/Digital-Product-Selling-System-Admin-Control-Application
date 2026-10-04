import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Coins, ChevronRight, ShoppingBag, CreditCard } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/formatters";
import { getImageUrl } from "@/lib/media";

const MobileUserCard = ({
  row,
  onClick,
  onAdjustBalance,
  onOpenOrders,
  onOpenTopups,
  onToggleStatus,
}) => {
  const avatar = getImageUrl(row.image);
  const isAdmin = row.role === "admin";
  const isActive = row.is_active;

  return (
    <div
      onClick={() => onClick && onClick(row)}
      className="group bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-emerald-300 transition-all active:scale-[0.99] cursor-pointer space-y-3"
    >
      {/* Top: Avatar, Name, Email, Role Pill & Chevron */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={row.name || row.username}
                className="h-full w-full object-cover"
              />
            ) : (
              (row.name?.[0] || row.username?.[0] || "U").toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-slate-900 text-sm truncate">
              {row.name || row.username}
            </h4>
            <p className="text-[11px] text-slate-500 truncate">{row.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
              isAdmin
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
            )}
          >
            {isAdmin ? "Admin" : "Customer"}
          </span>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>

      {/* Middle: Status Toggle & Registered Date */}
      <div className="flex items-center justify-between text-xs pt-0.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus && onToggleStatus(row);
            }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium border transition-colors cursor-pointer",
              isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
            )}
            title="Click to toggle status"
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isActive ? "bg-emerald-500" : "bg-rose-500"
              )}
            />
            {isActive ? "Active" : "Suspended"}
          </button>

          {row.wallet_balance !== undefined && row.wallet_balance !== null && (
            <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-full border border-emerald-200/60">
              {formatPrice(row.wallet_balance)}
            </span>
          )}
        </div>

        <span className="text-[11px] text-slate-400">
          {formatDate(row.created_at)}
        </span>
      </div>

      {/* Bottom: Dedicated 3-Column Action Grid */}
      <div
        className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs font-medium px-2 gap-1.5 rounded-xl border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100/70 shadow-2xs"
          onClick={() => onOpenOrders && onOpenOrders(row)}
          title="View Customer Orders"
        >
          <ShoppingBag className="h-3.5 w-3.5 text-blue-600 shrink-0" />
          <span>Orders</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs font-medium px-2 gap-1.5 rounded-xl border-purple-200 text-purple-700 bg-purple-50/50 hover:bg-purple-100/70 shadow-2xs"
          onClick={() => onOpenTopups && onOpenTopups(row)}
          title="View Customer Top-ups"
        >
          <CreditCard className="h-3.5 w-3.5 text-purple-600 shrink-0" />
          <span>Top-ups</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs font-medium px-2 gap-1.5 rounded-xl border-amber-200 text-amber-700 bg-amber-50/50 hover:bg-amber-100/70 shadow-2xs"
          onClick={() => onAdjustBalance && onAdjustBalance(row)}
          title="Adjust Wallet Balance"
        >
          <Coins className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span>Wallet</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileUserCard;
