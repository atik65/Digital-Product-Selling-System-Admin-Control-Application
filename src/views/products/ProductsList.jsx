import { useState } from "react";
import useSyncParams from "@/hooks/useSyncParams";
import useTable from "@/components/common/table/hooks/useTable";
import TableMaker from "@/components/common/table/TableMaker";
import TableSearch from "@/components/common/table/TableSearch";
import { Button } from "@/components/ui/button";
import { Plus, SlidersHorizontal, Layers, PackagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import Select from "@/components/common/select/Select";
import useApi from "@/hooks/useApi";
import useRequest from "@/hooks/useRequest";
import productApi from "./api";
import categoryApi from "@/views/categories/api";
import { productColumns } from "./utils/columns";
import AddEditProduct from "./components/AddEditProduct";
import ManagePackagesModal from "./components/ManagePackagesModal";
import ManageFieldsModal from "./components/ManageFieldsModal";
import MobileProductCard from "./components/MobileProductCard";
import ProductDetailDrawer from "./components/ProductDetailDrawer";

const statusOptions = [
  { id: "", label: "All Products" },
  { id: "true", label: "Active Only" },
  { id: "false", label: "Inactive Only" },
];

const ProductsList = () => {
  const { searchParamsSyncParams, routerSyncParams } = useSyncParams();
  const searchParams = searchParamsSyncParams;

  const search = searchParams?.get("search") || "";
  const categoryId = searchParams?.get("category_id") || "";
  const status = searchParams?.get("status") || "";

  // Modal & Drawer states
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [packageModalProduct, setPackageModalProduct] = useState(null);
  const [fieldModalProduct, setFieldModalProduct] = useState(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { mutateAsync } = useRequest();

  // Load categories for filter dropdown
  const { data: categoriesData } = useApi({
    api: categoryApi.list,
    cacheKey: categoryApi.cacheKey,
  });
  const categoryOptions = [
    { id: "", label: "All Categories" },
    ...(categoriesData?.data || []).map((c) => ({
      id: String(c.id),
      label: c.name,
    })),
  ];

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

  const handleOpenDrawer = (prod) => {
    setSelectedProduct(prod);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };

  const handleManagePackages = (prod) => {
    setPackageModalProduct(prod);
  };

  const handleManageFields = (prod) => {
    setFieldModalProduct(prod);
  };

  const handleToggleStatus = async (row) => {
    try {
      await mutateAsync({
        id: row.id,
        data: { is_active: !row.is_active },
        api: productApi.toggleStatus(row.id),
        cacheKey: productApi.cacheKey,
      });
    } catch (err) {
      console.error("Toggle product status error:", err);
    }
  };

  // Build filter object for useTable
  const filter = {};
  if (search) filter.search = search;
  if (categoryId) filter.category_id = categoryId;
  if (status !== "") filter.is_active = status === "true";

  const { tableInfo } = useTable({
    filter,
    api: productApi.list,
    apiCacheKey: productApi.cacheKey,
  });

  return (
    <div className="space-y-6">
      {/* Product Add/Edit Sheet */}
      <AddEditProduct
        open={isSheetOpen}
        onClose={handleCloseSheet}
        editData={editData}
      />

      {/* Dynamic Fields Config Modal */}
      <ManageFieldsModal
        open={!!fieldModalProduct}
        onClose={() => setFieldModalProduct(null)}
        product={fieldModalProduct}
      />

      {/* Packages Config Modal */}
      <ManagePackagesModal
        open={!!packageModalProduct}
        onClose={() => setPackageModalProduct(null)}
        product={packageModalProduct}
      />

      {/* Product Mobile Drawer */}
      <ProductDetailDrawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        product={selectedProduct}
        onEdit={handleEdit}
        onManagePackages={handleManagePackages}
        onManageFields={handleManageFields}
      />

      <section className="space-y-6">
        <TableMaker
          className="overflow-hidden [&_td]:bg-white"
          columns={productColumns}
          tableInfo={tableInfo}
          showPagination={true}
          logics={{
            handleEdit,
            handleManagePackages,
            handleManageFields,
            handleToggleStatus,
            deleteApi: productApi.delete,
            cacheKey: productApi.cacheKey,
          }}
          mobileCardRender={({ row }) => (
            <MobileProductCard
              key={row.id}
              row={row}
              onClick={handleOpenDrawer}
              onEdit={handleEdit}
              onManagePackages={handleManagePackages}
              onManageFields={handleManageFields}
              onToggleStatus={handleToggleStatus}
            />
          )}
          render={(tableInfo) => (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
              {/* Header Title and Add Button */}
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Products Catalog
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Manage digital products, tier packages, and dynamic customer inputs
                  </p>
                </div>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shrink-0 rounded-xl h-10 px-4 text-xs sm:text-sm font-medium"
                  onClick={handleAdd}
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  <span>Add Product</span>
                </Button>
              </div>

              {/* Search and Filters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <div className="sm:col-span-6">
                  <TableSearch
                    placeholder="Search by product name, slug..."
                    searchTableParams={search}
                    tableInfo={tableInfo}
                    className="w-full"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Select
                    inputClassName="w-full h-10 rounded-xl"
                    placeholder="All Categories"
                    optionSchema={{
                      id: "id",
                      label: "label",
                    }}
                    manualOption={categoryOptions}
                    value={categoryId}
                    setValue={(value) =>
                      routerSyncParams({ category_id: value, page: 1 })
                    }
                  />
                </div>
                <div className="sm:col-span-3">
                  <Select
                    inputClassName="w-full h-10 rounded-xl"
                    placeholder="All Status"
                    optionSchema={{
                      id: "id",
                      label: "label",
                    }}
                    manualOption={statusOptions}
                    value={status}
                    setValue={(value) =>
                      routerSyncParams({ status: value, page: 1 })
                    }
                  />
                </div>
              </div>

              {/* Quick Status Chips */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1 shrink-0 flex items-center gap-1">
                    <SlidersHorizontal className="h-3 w-3" />
                    Status:
                  </span>
                  {statusOptions.map((opt) => {
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
                <PackagePlus className="h-5 w-5" />
              </div>
              <p className="text-base font-semibold text-slate-800">
                No Products Found
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                Create a digital product and add purchase packages to begin selling.
              </p>
              <Button
                onClick={handleAdd}
                className="mt-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                size="sm"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Product
              </Button>
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default ProductsList;
