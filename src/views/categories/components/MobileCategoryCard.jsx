import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit, Folder, ChevronRight, Hash } from "lucide-react";
import { getImageUrl } from "@/lib/media";
import { formatDate } from "@/lib/formatters";

const MobileCategoryCard = ({ row, onClick, onEdit }) => {
  const img = getImageUrl(row.image);
  const isActive = row.is_active;

  return (
    <div
      onClick={() => onClick && onClick(row)}
      className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-emerald-300 transition-all active:scale-[0.99] cursor-pointer space-y-3"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-11 w-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
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
              <Folder className="h-5 w-5 text-emerald-600" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-slate-900 text-sm truncate">
              {row.name}
            </h4>
            <code className="text-[11px] text-slate-500 font-mono">
              /{row.slug}
            </code>
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

      {row.description && (
        <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 rounded-lg p-2">
          {row.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-1 font-medium">
          <Hash className="h-3 w-3 text-slate-400" />
          <span>Sort #{row.sort_order ?? 0}</span>
          <span className="mx-1.5 text-slate-300">•</span>
          <span>{formatDate(row.created_at)}</span>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
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

export default MobileCategoryCard;
