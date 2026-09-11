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
import { Folder, Edit, Calendar, Hash, Globe, CheckCircle2, XCircle } from "lucide-react";
import { getImageUrl } from "@/lib/media";
import { formatDate } from "@/lib/formatters";

const CategoryDetailDrawer = ({ open, onClose, category, onEdit }) => {
  if (!category) return null;

  const img = getImageUrl(category.image);
  const isActive = category.is_active;

  return (
    <Drawer open={open} onOpenChange={(val) => !val && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-lg overflow-y-auto px-4 pb-6 pt-2">
          {/* iOS Handle bar */}
          <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-200 mb-4" />

          <DrawerHeader className="px-0 pb-3 pt-0">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                {img ? (
                  <img
                    src={img}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Folder className="h-7 w-7 text-emerald-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <DrawerTitle className="text-lg font-bold text-slate-900 truncate">
                    {category.name}
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
                <DrawerDescription className="text-xs text-slate-500 font-mono mt-0.5">
                  Slug: /{category.slug}
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>

          <div className="space-y-4 py-2">
            {/* Description */}
            {category.description && (
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 block mb-1">
                  Description
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {category.description}
                </p>
              </div>
            )}

            {/* Quick Details List */}
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl bg-white overflow-hidden text-xs">
              <div className="flex items-center justify-between p-3">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-slate-400" />
                  Sort Sequence
                </span>
                <span className="font-semibold text-slate-800">
                  #{category.sort_order ?? 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Created At
                </span>
                <span className="font-medium text-slate-700">
                  {formatDate(category.created_at)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                  Visibility Status
                </span>
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  {isActive ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Visible in Storefront
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3.5 w-3.5 text-slate-400" />
                      Hidden
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <DrawerFooter className="px-0 pt-4 flex-row gap-2">
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 text-xs font-semibold"
              onClick={() => {
                onClose();
                onEdit(category);
              }}
            >
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              Edit Category
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

export default CategoryDetailDrawer;
