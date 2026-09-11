import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit2, Trash2, Package, Sliders, Layers, Eye } from "lucide-react";
import { getImageUrl } from "@/lib/media";
import { formatPrice } from "@/lib/formatters";
import ActionDialogDelete from "@/components/common/ActionDialogDelete";

export const productColumns = [
  {
    header: "PRODUCT",
    accessorKey: "name",
    cell: ({ row }) => {
      const img = getImageUrl(row.image);
      return (
        <div className="flex items-center gap-3">
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
              <Layers className="h-5 w-5 text-emerald-600" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-slate-900 truncate">
              {row.name}
            </span>
            <code className="text-[11px] text-slate-500 font-mono truncate max-w-xs">
              /{row.slug}
            </code>
          </div>
        </div>
      );
    },
  },
  {
    header: "CATEGORY",
    accessorKey: "category",
    cell: ({ row }) => {
      const catName = row.category?.name || "Uncategorized";
      return (
        <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200/60">
          {catName}
        </span>
      );
    },
  },
  {
    header: "PACKAGES",
    accessorKey: "packages",
    cell: ({ row }) => {
      const pkgs = row.packages || [];
      const lowestPrice = pkgs.length
        ? Math.min(...pkgs.map((p) => p.price))
        : null;

      return (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-800">
            {pkgs.length} {pkgs.length === 1 ? "Tier" : "Tiers"}
          </span>
          {lowestPrice !== null && (
            <span className="text-[11px] text-emerald-600 font-medium">
              from {formatPrice(lowestPrice)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    header: "STATUS",
    accessorKey: "is_active",
    cell: ({ row, logics }) => {
      const isActive = row.is_active;
      return (
        <button
          type="button"
          onClick={() => logics.handleToggleStatus && logics.handleToggleStatus(row)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border transition-all cursor-pointer",
            isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
          )}
          title="Click to toggle status"
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isActive ? "bg-emerald-500" : "bg-slate-400"
            )}
          />
          {isActive ? "Active" : "Inactive"}
        </button>
      );
    },
  },
  {
    header: "ACTIONS",
    accessorKey: "actions",
    cell: ({ row, logics }) => {
      return (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 px-2 rounded-lg gap-1 text-xs font-medium"
            onClick={() => logics.handleManagePackages(row)}
            title="Manage Purchase Packages"
          >
            <Package className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Packages</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-8 px-2 rounded-lg gap-1 text-xs font-medium"
            onClick={() => logics.handleManageFields(row)}
            title="Configure Customer Input Fields"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Fields</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 h-8 w-8 p-0 rounded-lg"
            onClick={() => logics.handleEdit(row)}
            title="Edit Product Details"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>

          <ActionDialogDelete
            name={row.name}
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
                title="Delete Product"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            }
          />
        </div>
      );
    },
  },
];
