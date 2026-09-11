import { useState } from "react";
import useSyncParams from "@/hooks/useSyncParams";
import useTable from "@/components/common/table/hooks/useTable";
import TableMaker from "@/components/common/table/TableMaker";
import TableSearch from "@/components/common/table/TableSearch";
import { SlidersHorizontal, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import Select from "@/components/common/select/Select";
import walletApi from "./api";
import { topupColumns } from "./utils/columns";
import TopUpActionModal from "./components/TopUpActionModal";
import MobileTopUpCard from "./components/MobileTopUpCard";

const statusFilterOptions = [
  { id: "", label: "All Requests" },
  { id: "PENDING", label: "Pending Review" },
  { id: "APPROVED", label: "Approved" },
  { id: "REJECTED", label: "Rejected" },
];

const TopUpsList = () => {
  const { searchParamsSyncParams, routerSyncParams } = useSyncParams();
  const searchParams = searchParamsSyncParams;

  const search = searchParams?.get("search") || "";
  const statusFilter = searchParams?.get("status_filter") || "";

  // Modal State
  const [actionTopup, setActionTopup] = useState(null);
  const [actionType, setActionType] = useState("APPROVE");

  const handleOpenActionModal = (topup, type) => {
    setActionTopup(topup);
    setActionType(type);
  };

  const handleCloseModal = () => {
    setActionTopup(null);
  };

  // Build filter object for useTable
  const filter = {};
  if (search) filter.search = search;
  if (statusFilter) filter.status_filter = statusFilter;

  const { tableInfo } = useTable({
    filter,
    api: walletApi.listTopups,
    apiCacheKey: walletApi.cacheKey,
  });

  return (
    <div className="space-y-6">
      {/* Action Approval / Rejection Modal */}
      <TopUpActionModal
        open={!!actionTopup}
        onClose={handleCloseModal}
        topup={actionTopup}
        actionType={actionType}
      />

      <section className="space-y-6">
        <TableMaker
          className="overflow-hidden [&_td]:bg-white"
          columns={topupColumns}
          tableInfo={tableInfo}
          showPagination={true}
          logics={{
            handleOpenActionModal,
          }}
          mobileCardRender={({ row }) => (
            <MobileTopUpCard
              key={row.id}
              row={row}
              onAction={handleOpenActionModal}
            />
          )}
          render={(tableInfo) => (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Wallet Top-Up Requests
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Review incoming customer pre-funded wallet credit requests and verify transactions
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex items-stretch sm:items-center gap-2 flex-col sm:flex-row">
                <div className="flex-1">
                  <TableSearch
                    placeholder="Search by Transaction ID, sender phone..."
                    searchTableParams={search}
                    tableInfo={tableInfo}
                    className="w-full"
                  />
                </div>
                <div className="shrink-0">
                  <Select
                    inputClassName="w-full sm:min-w-[190px] h-10 rounded-xl"
                    placeholder="All Status"
                    optionSchema={{
                      id: "id",
                      label: "label",
                    }}
                    manualOption={statusFilterOptions}
                    value={statusFilter}
                    setValue={(value) =>
                      routerSyncParams({ status_filter: value, page: 1 })
                    }
                  />
                </div>
              </div>

              {/* Status Chips */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1 shrink-0 flex items-center gap-1">
                    <SlidersHorizontal className="h-3 w-3" />
                    Status:
                  </span>
                  {statusFilterOptions.map((opt) => {
                    const isActive = (statusFilter || "") === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          routerSyncParams({ status_filter: opt.id, page: 1 })
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
                <Coins className="h-5 w-5" />
              </div>
              <p className="text-base font-semibold text-slate-800">
                No Top-Up Requests
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                Customer manual wallet top-up requests will appear here for audit and crediting.
              </p>
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default TopUpsList;
