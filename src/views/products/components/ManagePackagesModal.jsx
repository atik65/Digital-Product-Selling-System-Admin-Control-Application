import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useApi from "@/hooks/useApi";
import useRequest from "@/hooks/useRequest";
import productApi from "../api";
import { Loader2, Plus, Trash2, Edit2, Package, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { packageSchema } from "../utils/schema";
import useFormik from "@/hooks/useFormik";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import FieldInput from "@/components/common/Formik/FieldInput";
import SwitchField from "@/components/common/Formik/SwitchField";
import { formatPrice } from "@/lib/formatters";

const ManagePackagesModal = ({ open, onClose, product }) => {
  const [editingPackage, setEditingPackage] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const { mutateAsync, isPending } = useRequest();

  const cacheKey = `productPackages-${product?.id}`;
  const { data: packagesData, isLoading, refetch } = useApi({
    api: product?.id ? productApi.listPackages(product.id) : null,
    cacheKey,
    trigger: !!product?.id && open,
  });

  const packages = packagesData?.data || [];

  const form = useFormik({
    schema: packageSchema.validation,
    defaultValues: packageSchema.values(editingPackage),
    onSubmit,
    mode: "onChange",
  });

  const handleStartAdd = () => {
    setEditingPackage(null);
    form.reset(packageSchema.values(null));
    setIsAdding(true);
  };

  const handleStartEdit = (pkg) => {
    setEditingPackage(pkg);
    form.reset(packageSchema.values(pkg));
    setIsAdding(true);
  };

  const handleCancelForm = () => {
    setEditingPackage(null);
    setIsAdding(false);
    form.reset();
  };

  async function onSubmit(data) {
    if (!product?.id) return;

    try {
      if (editingPackage?.id) {
        await mutateAsync({
          id: editingPackage.id,
          data: {
            ...data,
            price: Number(data.price),
            compare_price: data.compare_price ? Number(data.compare_price) : null,
            sort_order: Number(data.sort_order) || 0,
          },
          api: productApi.updatePackage(editingPackage.id),
          cacheKey: productApi.cacheKey,
          handleDone: () => {
            handleCancelForm();
            refetch();
          },
        });
      } else {
        await mutateAsync({
          data: {
            ...data,
            price: Number(data.price),
            compare_price: data.compare_price ? Number(data.compare_price) : null,
            sort_order: Number(data.sort_order) || 0,
          },
          api: productApi.createPackage(product.id),
          cacheKey: productApi.cacheKey,
          handleDone: () => {
            handleCancelForm();
            refetch();
          },
        });
      }
    } catch (err) {
      console.error("Save package error:", err);
    }
  }

  const handleToggleStatus = async (pkg) => {
    try {
      await mutateAsync({
        id: pkg.id,
        data: { is_active: !pkg.is_active },
        api: productApi.togglePackageStatus(pkg.id),
        cacheKey: productApi.cacheKey,
        handleDone: () => {
          refetch();
        },
      });
    } catch (err) {
      console.error("Toggle package status error:", err);
    }
  };

  const handleDeletePackage = async (packageId) => {
    if (!confirm("Are you sure you want to remove this package tier?")) return;
    try {
      await mutateAsync({
        id: packageId,
        api: productApi.deletePackage(packageId),
        cacheKey: productApi.cacheKey,
        handleDone: () => {
          refetch();
        },
      });
    } catch (err) {
      console.error("Delete package error:", err);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Purchase Package Tiers
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Manage denominations, pricing, and discount tiers for {product.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 space-y-4">
          {/* Header Action */}
          {!isAdding && (
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-700">
                Active Tiers ({packages.length})
              </span>
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 text-xs font-medium"
                onClick={handleStartAdd}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add Package
              </Button>
            </div>
          )}

          {/* Form to Add or Edit Package */}
          {isAdding && (
            <div className="p-4 rounded-xl border border-indigo-200/80 bg-indigo-50/40 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">
                {editingPackage ? "Edit Package Tier" : "New Package Tier"}
              </h4>

              <FormikWrapper form={form}>
                <div className="space-y-3">
                  <FieldInput
                    form={form}
                    name="name"
                    label="Package Name"
                    placeholder="e.g., 115 Diamonds, 1 Month Ultra HD"
                    required
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FieldInput
                      form={form}
                      name="price"
                      label="Sale Price (৳)"
                      type="number"
                      placeholder="e.g., 85"
                      required
                    />

                    <FieldInput
                      form={form}
                      name="compare_price"
                      label="Compare/Original Price (৳)"
                      type="number"
                      placeholder="e.g., 100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FieldInput
                      form={form}
                      name="duration"
                      label="Duration / Delivery"
                      placeholder="e.g., Instant, 30 Days, 1 Year"
                    />

                    <FieldInput
                      form={form}
                      name="sort_order"
                      label="Sort Order"
                      type="number"
                      placeholder="0"
                    />
                  </div>

                  <div className="pb-1">
                    <SwitchField
                      form={form}
                      name="is_active"
                      label="Active for Purchase"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <span>{editingPackage ? "Update Package" : "Create Package"}</span>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelForm}
                      disabled={isPending}
                      className="text-xs h-9"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </FormikWrapper>
            </div>
          )}

          {/* List of Existing Packages */}
          {isLoading ? (
            <div className="flex justify-center py-6 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500">
                No pricing tiers added for this product yet.
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Customers cannot order until you add at least one package tier.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {packages.map((pkg) => {
                const hasDiscount =
                  pkg.compare_price && pkg.compare_price > pkg.price;
                const discountPct = hasDiscount
                  ? Math.round(
                      ((pkg.compare_price - pkg.price) / pkg.compare_price) *
                        100
                    )
                  : 0;

                return (
                  <div
                    key={pkg.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900">
                          {pkg.name}
                        </span>
                        {pkg.duration && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
                            <Clock className="h-2.5 w-2.5" />
                            {pkg.duration}
                          </span>
                        )}
                        {hasDiscount && (
                          <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-200 px-1.5 py-0.5 rounded-full font-medium">
                            {discountPct}% OFF
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-sm text-emerald-600">
                          {formatPrice(pkg.price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatPrice(pkg.compare_price)}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 ml-2">
                          Order #{pkg.sort_order ?? 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(pkg)}
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[11px] font-medium border transition-colors",
                          pkg.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        )}
                      >
                        {pkg.is_active ? "Active" : "Disabled"}
                      </button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg"
                        onClick={() => handleStartEdit(pkg)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        onClick={() => handleDeletePackage(pkg.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManagePackagesModal;
