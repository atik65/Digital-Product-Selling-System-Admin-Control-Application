import useSyncParams from "@/hooks/useSyncParams";
import useTable from "@/components/common/table/hooks/useTable";
import TableMaker from "@/components/common/table/TableMaker";
import TableSearch from "@/components/common/table/TableSearch";
import { MessageSquare, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import Select from "@/components/common/select/Select";
import paymentApi from "../api";
import { smsColumns } from "./columns";

const matchOptions = [
  { id: "", label: "All Logs" },
  { id: "true", label: "Reconciled (Matched)" },
  { id: "false", label: "Unmatched" },
];

const SmsLogsList = () => {
  const { searchParamsSyncParams, routerSyncParams } = useSyncParams();
  const searchParams = searchParamsSyncParams;

  const search = searchParams?.get("search") || "";
  const isMatched = searchParams?.get("is_matched") || "";

  const filter = {};
  if (search) filter.search = search;
  if (isMatched !== "") filter.is_matched = isMatched === "true";

  const { tableInfo } = useTable({
    filter,
    api: paymentApi.listSmsLogs,
    apiCacheKey: paymentApi.smsLogsCacheKey,
  });

  return (
    <div className="space-y-6">
      <section className="space-y-6">
        <TableMaker
          className="overflow-hidden [&_td]:bg-white"
          columns={smsColumns}
          tableInfo={tableInfo}
          showPagination={true}
          render={(tableInfo) => (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  SMS Gateway Logs
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Real-time raw SMS messages received from Android forwarder devices for automated transaction reconciliation
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex items-stretch sm:items-center gap-2 flex-col sm:flex-row">
                <div className="flex-1">
                  <TableSearch
                    placeholder="Search in SMS text or sender..."
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
                    manualOption={matchOptions}
                    value={isMatched}
                    setValue={(value) =>
                      routerSyncParams({ is_matched: value, page: 1 })
                    }
                  />
                </div>
              </div>

              {/* Quick Filter Chips */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1 shrink-0 flex items-center gap-1">
                    <SlidersHorizontal className="h-3 w-3" />
                    Status:
                  </span>
                  {matchOptions.map((opt) => {
                    const isActive = (isMatched || "") === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          routerSyncParams({ is_matched: opt.id, page: 1 })
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
                <MessageSquare className="h-5 w-5" />
              </div>
              <p className="text-base font-semibold text-slate-800">
                No SMS Logs Recorded
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                Incoming bank SMS notifications forwarded from Android devices will be logged here.
              </p>
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default SmsLogsList;
