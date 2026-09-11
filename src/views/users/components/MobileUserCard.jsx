import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, Coins, ChevronRight, User } from "lucide-react";
import { formatDate } from "@/lib/formatters";
import { getImageUrl } from "@/lib/media";

const MobileUserCard = ({
  row,
  onClick,
  onAdjustBalance,
  onToggleStatus,
}) => {
  const avatar = getImageUrl(row.image);
  const isAdmin = row.role === "admin";
  const isActive = row.is_active;

  return (
    <div
      onClick={() => onClick && onClick(row)}
      className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-emerald-300 transition-all active:scale-[0.99] cursor-pointer space-y-3"
    >
      <div className="flex items-center justify-between gap-3">
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

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus && onToggleStatus(row);
            }}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border",
              isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isActive ? "bg-emerald-500" : "bg-rose-500"
              )}
            />
            {isActive ? "Active" : "Suspended"}
          </button>
          <span className="text-[11px] text-slate-400">
            {formatDate(row.created_at)}
          </span>
        </div>

        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-2 gap-1 rounded-lg border-amber-200 text-amber-700 hover:bg-amber-50"
            onClick={() => onAdjustBalance(row)}
          >
            <Coins className="h-3 w-3" />
            Wallet
          </Button>

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
    </div>
  );
};

export default MobileUserCard;
