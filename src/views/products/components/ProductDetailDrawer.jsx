import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import {
  Layers,
  Edit,
  Package,
  Sliders,
  Calendar,
  Hash,
  CheckCircle2,
  XCircle,
  FileText,
  Info,
} from "lucide-react";
import { getImageUrl } from "@/lib/media";
import { formatDate, formatPrice } from "@/lib/formatters";

const ProductDetailDrawer = ({
  open,
  onClose,
  product,
  onEdit,
  onManagePackages,
  onManageFields,
}) => {
  if (!product) return null;

  const img = getImageUrl(product.image);
  const isActive = product.is_active;
  const pkgs = product.packages || [];

  return (
    <Drawer open={open} onOpenChange={(val) => !val && onClose()}>
      <DrawerContent className="max-h-[88vh]">
        <div className="mx-auto w-full max-w-lg overflow-y-auto px-4 pb-6 pt-2">
          {/* iOS Handle bar */}
          <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-200 mb-4" />

          <DrawerHeader className="px-0 pb-3 pt-0">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                {img ? (
                  <img
                    src={img}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Layers className="h-7 w-7 text-emerald-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <DrawerTitle className="text-lg font-bold text-slate-900 truncate">
                    {product.name}
                  </DrawerTitle>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border",
                      isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    )}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {product.category?.name || "Uncategorized"}
                  </span>
                  <span className="font-mono">/{product.slug}</span>
                </div>
              </div>
            </div>
          </DrawerHeader>

          <div className="space-y-4 py-2">
            {/* Quick Management Triggers */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-10 text-xs border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100/70 rounded-xl"
                onClick={() => {
                  onClose();
                  onManagePackages(product);
                }}
              >
                <Package className="mr-1.5 h-3.5 w-3.5" />
                Manage Packages ({pkgs.length})
              </Button>

              <Button
                variant="outline"
                className="h-10 text-xs border-amber-200 text-amber-700 bg-amber-50/50 hover:bg-amber-100/70 rounded-xl"
                onClick={() => {
                  onClose();
                  onManageFields(product);
                }}
              >
                <Sliders className="mr-1.5 h-3.5 w-3.5" />
                Manage Input Fields
              </Button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1 mb-1">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  Description
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Instructions */}
            {product.instructions && (
              <div className="bg-blue-50/60 rounded-xl p-3.5 border border-blue-100 text-xs text-blue-900">
                <span className="font-semibold flex items-center gap-1 mb-1 text-blue-800">
                  <Info className="h-3.5 w-3.5 text-blue-600" />
                  Customer Instructions
                </span>
                <p className="leading-relaxed">{product.instructions}</p>
              </div>
            )}

            {/* Package Tiers preview */}
            {pkgs.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  Available Tiers
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {pkgs.map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <span className="font-medium text-xs text-slate-800 block truncate">
                        {p.name}
                      </span>
                      <span className="font-bold text-sm text-emerald-600">
                        {formatPrice(p.price)}
                      </span>
                      {p.duration && (
                        <span className="text-[10px] text-slate-400 block">
                          {p.duration}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl bg-white overflow-hidden text-xs">
              <div className="flex items-center justify-between p-3">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-slate-400" />
                  Sort Sequence
                </span>
                <span className="font-semibold text-slate-800">
                  #{product.sort_order ?? 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Created At
                </span>
                <span className="font-medium text-slate-700">
                  {formatDate(product.created_at)}
                </span>
              </div>
            </div>
          </div>

          <DrawerFooter className="px-0 pt-4 flex-row gap-2">
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 text-xs font-semibold"
              onClick={() => {
                onClose();
                onEdit(product);
              }}
            >
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              Edit Details
            </Button>
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-11 text-xs font-semibold"
              >
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductDetailDrawer;
