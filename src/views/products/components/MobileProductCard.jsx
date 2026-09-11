import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Layers, Edit, Package, Sliders, ChevronRight, Hash } from "lucide-react";
import { getImageUrl } from "@/lib/media";
import { formatPrice } from "@/lib/formatters";

const MobileProductCard = ({
  row,
  onClick,
  onEdit,
  onManagePackages,
  onManageFields,
  onToggleStatus,
}) => {
  const img = getImageUrl(row.image);
  const isActive = row.is_active;
  const pkgs = row.packages || [];
  const lowestPrice = pkgs.length
    ? Math.min(...pkgs.map((p) => p.price))
    : null;

  return (
    <div
      onClick={() => onClick && onClick(row)}
      className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-emerald-300 transition-all active:scale-[0.99] cursor-pointer space-y-3"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
            {img ? (
              <img
                src={img}
                alt={row.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <Layers className="h-5 w-5 text-emerald-600" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-slate-900 text-sm truncate">
              {row.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-1.5 py-0.2 rounded font-medium">
                {row.category?.name || "Uncategorized"}
              </span>
              <code className="text-[10px] text-slate-400 font-mono truncate">
                /{row.slug}
              </code>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus && onToggleStatus(row);
          }}
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
        </button>
      </div>

      {/* Pricing & Packages quick preview */}
      <div className="flex items-center justify-between bg-slate-50 rounded-xl p-2.5 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Package className="h-3.5 w-3.5 text-indigo-500" />
          <span>{pkgs.length} Tiers</span>
        </div>
        {lowestPrice !== null && (
          <span className="font-bold text-emerald-600">
            Starts {formatPrice(lowestPrice)}
          </span>
        )}
      </div>

      <div
        className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-2 gap-1 rounded-lg border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            onClick={() => onManagePackages(row)}
          >
            <Package className="h-3 w-3" />
            Tiers
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-2 gap-1 rounded-lg border-amber-200 text-amber-700 hover:bg-amber-50"
            onClick={() => onManageFields(row)}
          >
            <Sliders className="h-3 w-3" />
            Inputs
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-slate-600 hover:text-emerald-700 rounded-lg"
            onClick={() => onEdit(row)}
          >
            <Edit className="h-3.5 w-3.5" />
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

export default MobileProductCard;
