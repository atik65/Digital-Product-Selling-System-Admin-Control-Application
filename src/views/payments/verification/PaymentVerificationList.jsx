import { useState } from "react";
import useSyncParams from "@/hooks/useSyncParams";
import useTable from "@/components/common/table/hooks/useTable";
import TableMaker from "@/components/common/table/TableMaker";
import TableSearch from "@/components/common/table/TableSearch";
import { SlidersHorizontal, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import Select from "@/components/common/select/Select";
import paymentApi from "../api";
import { paymentColumns } from "./utils/columns";
import VerifyRejectModal from "./components/VerifyRejectModal";
import MobilePaymentCard from "./components/MobilePaymentCard";

const statusFilterOptions = [
  { id: "", label: "All Payments" },
  { id: "VERIFYING", label: "Verifying (Pending)" },
  { id: "PENDING", label: "Pending" },
  { id: "VERIFIED", label: "Verified" },
  { id: "REJECTED", label: "Rejected" },
];

const PaymentVerificationList = () => {
  const { searchParamsSyncParams, routerSyncParams } = useSyncParams();
  const searchParams = searchParamsSyncParams;

  const search = searchParams?.get("search") || "";
  const statusFilter = searchParams?.get("status_filter") || "";

  // Modal State
  const [actionPayment, setActionPayment] = useState(null);
  const [actionType, setActionType] = useState("VERIFY");

  const handleOpenActionModal = (payment, type) => {
    setActionPayment(payment);
    setActionType(type);
  };

  const handleCloseModal = () => {
    setActionPayment(null);
  };

  // Build filter object for useTable
  const filter = {};
  if (search) filter.search = search;
  if (statusFilter) filter.status_filter = statusFilter;

  const { tableInfo } = useTable({
    filter,
    api: paymentApi.list,
    apiCacheKey: paymentApi.cacheKey,
  });

  return (
    <div className="space-y-6">
      {/* Verify/Reject Modal */}
      <VerifyRejectModal
        open={!!actionPayment}
        onClose={handleCloseModal}
        payment={actionPayment}
        actionType={actionType}
      />

      <section className="space-y-6">
        <TableMaker
          className="overflow-hidden [&_td]:bg-white"
          columns={paymentColumns}
          tableInfo={tableInfo}
          showPagination={true}
          logics={{
            handleOpenActionModal,
          }}
          mobileCardRender={({ row }) => (
            <MobilePaymentCard
              key={row.id}
              row={row}
              onAction={handleOpenActionModal}
            />
          )}
          render={(tableInfo) => (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
              {/* Header Title */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Payment Verification Queue
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Review customer manual transaction ID submissions and reconcile with mobile banking accounts
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
                <CheckCheck className="h-5 w-5" />
              </div>
              <p className="text-base font-semibold text-slate-800">
                No Payments in Queue
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                Incoming transaction ID submissions will appear here for verification.
              </p>
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default PaymentVerificationList;
