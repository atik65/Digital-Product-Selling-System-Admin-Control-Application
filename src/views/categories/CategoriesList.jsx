import { useState } from "react";
import useSyncParams from "@/hooks/useSyncParams";
import useTable from "@/components/common/table/hooks/useTable";
import TableMaker from "@/components/common/table/TableMaker";
import TableSearch from "@/components/common/table/TableSearch";
import { Button } from "@/components/ui/button";
import { Plus, SlidersHorizontal, FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import Select from "@/components/common/select/Select";
import categoryApi from "./api";
import { categoryColumns } from "./utils/columns";
import AddEdit from "./components/AddEdit";
import MobileCategoryCard from "./components/MobileCategoryCard";
import CategoryDetailDrawer from "./components/CategoryDetailDrawer";
import ActionDialogDelete from "@/components/common/ActionDialogDelete";

const statusOptions = [
  { id: "", label: "All Categories" },
  { id: "true", label: "Active Only" },
  { id: "false", label: "Inactive Only" },
];

const CategoriesList = () => {
  const { searchParamsSyncParams, routerSyncParams } = useSyncParams();
  const searchParams = searchParamsSyncParams;

  const search = searchParams?.get("search") || "";
  const status = searchParams?.get("status") || "";

  // Sheet & Drawer states
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  const handleOpenDrawer = (category) => {
    setSelectedCategory(category);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedCategory(null);
  };

  const handleDelete = (row) => {
    setDeleteTarget(row);
  };

  // Build filter object for useTable
  const filter = {};
  if (search) filter.search = search;
  if (status !== "") filter.is_active = status === "true";

  const { tableInfo } = useTable({
    filter,
    api: categoryApi.list,
    apiCacheKey: categoryApi.cacheKey,
  });

  return (
    <div className="space-y-6">
      {/* Add/Edit Slide-over Sheet */}
      <AddEdit
        open={isSheetOpen}
        onClose={handleCloseSheet}
        editData={editData}
      />

      {/* Mobile iOS Detail Drawer */}
      <CategoryDetailDrawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        category={selectedCategory}
        onEdit={handleEdit}
      />

      <section className="space-y-6">
        <TableMaker
          className="overflow-hidden [&_td]:bg-white"
          columns={categoryColumns}
          tableInfo={tableInfo}
          showPagination={true}
          logics={{
            handleEdit,
            deleteApi: categoryApi.delete,
            cacheKey: categoryApi.cacheKey,
          }}
          mobileCardRender={({ row }) => (
            <MobileCategoryCard
              key={row.id}
              row={row}
              onClick={handleOpenDrawer}
              onEdit={handleEdit}
            />
          )}
          render={(tableInfo) => (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
              {/* Header Title and Add Button */}
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Categories
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Manage digital product categories, hierarchies, and visibility
                  </p>
                </div>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shrink-0 rounded-xl h-10 px-4 text-xs sm:text-sm font-medium"
                  onClick={handleAdd}
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  <span>Add Category</span>
                </Button>
              </div>

              {/* Search and Filters Row */}
              <div className="flex items-stretch sm:items-center gap-2 flex-col sm:flex-row">
                <div className="flex-1">
                  <TableSearch
                    placeholder="Search by category name, slug..."
                    searchTableParams={search}
                    tableInfo={tableInfo}
                    className="w-full"
                  />
                </div>
                <div className="shrink-0">
                  <Select
                    inputClassName="w-full sm:min-w-[180px] h-10 rounded-xl"
                    placeholder="All Categories"
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

              {/* Filter Pills */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1 shrink-0 flex items-center gap-1">
                    <SlidersHorizontal className="h-3 w-3" />
                    Filter:
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
                <FolderPlus className="h-5 w-5" />
              </div>
              <p className="text-base font-semibold text-slate-800">
                No Categories Found
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                Get started by creating your first product category.
              </p>
              <Button
                onClick={handleAdd}
                className="mt-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                size="sm"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Category
              </Button>
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default CategoriesList;
