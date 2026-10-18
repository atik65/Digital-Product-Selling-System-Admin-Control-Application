import useApi from "@/hooks/useApi";
import useSyncParams from "@/hooks/useSyncParams";
import useTable from "@/components/common/table/hooks/useTable";
import TableMaker from "@/components/common/table/TableMaker";
import TableSearch from "@/components/common/table/TableSearch";
import Select from "@/components/common/select/Select";
import DatePicker from "@/components/common/DatePicker";
import { History, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import paymentApi from "../api";
import { transactionColumns } from "./columns";

const typeOptions = [
  { id: "", label: "All Types" },
  { id: "ORDER_PAYMENT", label: "Order Payments" },
  { id: "WALLET_TOPUP", label: "Wallet Top-Ups" },
];

const dateInputClass = "w-full lg:w-[150px]";

const TransactionsList = () => {
  const { searchParamsSyncParams, routerSyncParams } = useSyncParams();
  const searchParams = searchParamsSyncParams;

  const search = searchParams?.get("search") || "";
  const methodId = searchParams?.get("payment_method_id") || "";
  const sourceType = searchParams?.get("source_type") || "";
  const dateFrom = searchParams?.get("date_from") || "";
  const dateTo = searchParams?.get("date_to") || "";

  const filter = {};
  if (search) filter.search = search;
  if (methodId) filter.payment_method_id = methodId;
  if (sourceType) filter.source_type = sourceType;
  if (dateFrom) filter.date_from = dateFrom;
  if (dateTo) filter.date_to = dateTo;

  const { tableInfo } = useTable({
    filter,
    api: paymentApi.listTransactions,
    apiCacheKey: paymentApi.transactionsCacheKey,
    // New rows can appear at any time (SMS auto-verification), never serve stale
    staleTime: 0,
  });

  // Payment methods double as the per-method filter chips (with live counters)
  const { data: methodsData } = useApi({
    api: paymentApi.listMethods,
    cacheKey: paymentApi.methodsCacheKey,
    staleTime: 0,
  });
  const methods = Array.isArray(methodsData?.data) ? methodsData.data : [];

  const hasFilters = !!(methodId || sourceType || dateFrom || dateTo || search);

  const clearAll = () =>
    routerSyncParams({
      search: "",
      payment_method_id: "",
      source_type: "",
      date_from: "",
      date_to: "",
      page: 1,
    });

  const chipClass = (isActive) =>
    cn(
      "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0",
      isActive
        ? "bg-emerald-700 text-white shadow-xs font-semibold"
        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
    );

  return (
    <div className="space-y-6">
      <section className="space-y-6">
        <TableMaker
          className="overflow-hidden [&_td]:bg-white"
          columns={transactionColumns}
          tableInfo={tableInfo}
          showPagination={true}
          render={(tableInfo) => (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Transaction History
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Every successful transaction received on each payment method:
                  sender number, amount and date
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex items-stretch lg:items-center gap-2 flex-col lg:flex-row">
                <div className="flex-1">
                  <TableSearch
                    placeholder="Search by Transaction ID or sender number..."
                    searchTableParams={search}
                    tableInfo={tableInfo}
                    className="w-full"
                  />
                </div>
                <div className="shrink-0">
                  <Select
                    inputClassName="w-full lg:min-w-[170px] h-10 rounded-xl"
                    placeholder="All Types"
                    optionSchema={{ id: "id", label: "label" }}
                    manualOption={typeOptions}
                    value={sourceType}
                    setValue={(value) =>
                      routerSyncParams({ source_type: value, page: 1 })
                    }
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <DatePicker
                    aria-label="From date"
                    placeholder="From date"
                    displayFormat="dd MMM yyyy"
                    value={dateFrom}
                    max={dateTo || undefined}
                    onChange={(value) =>
                      routerSyncParams({ date_from: value, page: 1 })
                    }
                    className={dateInputClass}
                  />
                  <span className="text-xs text-slate-400">to</span>
                  <DatePicker
                    aria-label="To date"
                    placeholder="To date"
                    displayFormat="dd MMM yyyy"
                    value={dateTo}
                    min={dateFrom || undefined}
                    onChange={(value) =>
                      routerSyncParams({ date_to: value, page: 1 })
                    }
                    className={dateInputClass}
                  />
                </div>
              </div>

              {/* Payment Method Chips */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1 shrink-0 flex items-center gap-1">
                    <SlidersHorizontal className="h-3 w-3" />
                    Method:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      routerSyncParams({ payment_method_id: "", page: 1 })
                    }
                    className={chipClass(!methodId)}
                  >
                    All Methods
                  </button>
                  {methods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      title={`${method.monthly_transaction_count ?? 0} this month, ${method.daily_transaction_count ?? 0} today`}
                      onClick={() =>
                        routerSyncParams({
                          payment_method_id: method.id,
                          page: 1,
                        })
                      }
                      className={chipClass(String(method.id) === methodId)}
                    >
                      {method.name}
                      <span className="ml-1.5 opacity-75">
                        {method.monthly_transaction_count ?? 0} this month
                      </span>
                    </button>
                  ))}
                  {hasFilters && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-rose-600 hover:bg-rose-50 shrink-0"
                    >
                      <X className="h-3 w-3" />
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          noDataRender={() => (
            <div className="flex h-56 flex-col items-center justify-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <History className="h-5 w-5" />
              </div>
              <p className="text-base font-semibold text-slate-800">
                No Transactions Found
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                Verified order payments and approved wallet top-ups will appear
                here.
              </p>
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default TransactionsList;
