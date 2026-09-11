import { useState } from "react";
import useTable from "@/components/common/table/hooks/useTable";
import TableMaker from "@/components/common/table/TableMaker";
import { Button } from "@/components/ui/button";
import { Plus, Image as ImageIcon } from "lucide-react";
import marketingApi from "../api";
import { bannerColumns } from "./columns";
import AddEditBanner from "./components/AddEditBanner";

const BannersList = () => {
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

  const { tableInfo } = useTable({
    api: marketingApi.listBanners,
    apiCacheKey: marketingApi.bannersCacheKey,
  });

  return (
    <div className="space-y-6">
      <AddEditBanner
        open={isSheetOpen}
        onClose={handleCloseSheet}
        editData={editData}
      />

      <section className="space-y-6">
        <TableMaker
          className="overflow-hidden [&_td]:bg-white"
          columns={bannerColumns}
          tableInfo={tableInfo}
          showPagination={true}
          logics={{
            handleEdit,
            deleteApi: marketingApi.deleteBanner,
            cacheKey: marketingApi.bannersCacheKey,
          }}
          render={() => (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  Storefront Carousel Banners
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Promotional header slides displayed prominently on customer homepages
                </p>
              </div>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shrink-0 rounded-xl h-10 px-4 text-xs font-semibold"
                onClick={handleAdd}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                <span>Add Banner</span>
              </Button>
            </div>
          )}
          noDataRender={() => (
            <div className="flex h-56 flex-col items-center justify-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <ImageIcon className="h-5 w-5" />
              </div>
              <p className="text-base font-semibold text-slate-800">
                No Promotional Banners
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                Upload carousel banners to highlight ongoing discounts or featured digital subscriptions.
              </p>
              <Button
                onClick={handleAdd}
                className="mt-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                size="sm"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Banner
              </Button>
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default BannersList;
