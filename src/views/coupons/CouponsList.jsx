import { useState } from "react";
import useSyncParams from "@/hooks/useSyncParams";
import useTable from "@/components/common/table/hooks/useTable";
import TableMaker from "@/components/common/table/TableMaker";
import { Button } from "@/components/ui/button";
import { Plus, Tag, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import couponApi from "./api";
import { couponColumns } from "./utils/columns";
import AddEditCoupon from "./components/AddEditCoupon";
import MobileCouponCard from "./components/MobileCouponCard";

const statusFilterOptions = [
  { id: "", label: "All Coupons" },
  { id: "true", label: "Active" },
  { id: "false", label: "Inactive" },
];

const CouponsList = () => {
  const { searchParamsSyncParams, routerSyncParams } = useSyncParams();
  const searchParams = searchParamsSyncParams;
  const status = searchParams?.get("status") || "";

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleAdd = () => {
    setEditData(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setEditData(null);
  };

  const filter = {};
  if (status !== "") filter.is_active = status === "true";

  const { tableInfo } = useTable({
    filter,
    api: couponApi.list,
    apiCacheKey: couponApi.cacheKey,
  });

  return (
    <div className="space-y-6">
      <AddEditCoupon
        open={isSheetOpen}
        onClose={handleCloseSheet}
        editData={editData}
      />

      <section className="space-y-6">
        <TableMaker
          className="overflow-hidden [&_td]:bg-white"
          columns={couponColumns}
          tableInfo={tableInfo}
          showPagination={true}
          logics={{
            handleEdit,
            deleteApi: couponApi.delete,
            cacheKey: couponApi.cacheKey,
          }}
          mobileCardRender={({ row }) => (
            <MobileCouponCard key={row.id} row={row} onEdit={handleEdit} />
          )}
          render={() => (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Coupons & Promotional Discounts
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Configure promo codes, percentage or fixed discounts, user usage limits, and expiries
                  </p>
                </div>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shrink-0 rounded-xl h-10 px-4 text-xs sm:text-sm font-medium"
                  onClick={handleAdd}
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  <span>Create Coupon</span>
                </Button>
              </div>

              {/* Status Pills */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1 shrink-0 flex items-center gap-1">
                    <SlidersHorizontal className="h-3 w-3" />
                    Filter:
                  </span>
                  {statusFilterOptions.map((opt) => {
                    const isActive = (status || "") === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          routerSyncParams({ status: opt.id, page: 1 })
                        }
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0",
                          isActive
                            ? "bg-emerald-700 text-white shadow-xs font-semibold"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          noDataRender={() => (
            <div className="flex h-56 flex-col items-center justify-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Tag className="h-5 w-5" />
              </div>
              <p className="text-base font-semibold text-slate-800">
                No Coupons Created
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                Create coupon codes to offer discounts during checkout.
              </p>
              <Button
                onClick={handleAdd}
                className="mt-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                size="sm"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Create Coupon
              </Button>
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default CouponsList;
