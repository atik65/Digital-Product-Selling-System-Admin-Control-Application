import useSyncParams from "@/hooks/useSyncParams";
import { appointmentColumns } from "./utils/columns";
import appointmentApi from "./api";
import { useState } from "react";
import useTable from "@/components/common/table/hooks/useTable";
import AddEdit from "./components/AddEdit";
import TableMaker from "@/components/common/table/TableMaker";
import { Button } from "@/components/ui/button";
import TableSearch from "@/components/common/table/TableSearch";
import { Plus, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import Select from "@/components/common/select/Select";
import MobileAppointmentCard from "./components/MobileAppointmentCard";
import AppointmentDetailDrawer from "./components/AppointmentDetailDrawer";

const statusOptions = [
  { id: "", label: "All Status" },
  { id: "SUBMITTED", label: "Submitted" },
  { id: "UNDER-REVIEW", label: "Under Review" },
  { id: "APPROVED", label: "Approved" },
  { id: "PENDING", label: "Pending" },
  { id: "REJECTED", label: "Slot Offered" },
];

const DemoList = () => {
  const { searchParamsSyncParams, routerSyncParams } = useSyncParams();
  const searchParams = searchParamsSyncParams;

  const search = searchParams?.get("search") || "";
  const status = searchParams?.get("status") || "";

  // Add/Edit sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // iOS-style Bottom Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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

  const handleOpenDrawer = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedAppointment(null);
  };

  // Table configuration with real API
  const { tableInfo } = useTable({
    filter: {
      search,
      status,
    },
    api: appointmentApi.list,
    apiCacheKey: appointmentApi.cacheKey,
  });

  return (
    <div className="space-y-6">
      {/* Add/Edit Side Sheet */}
      <AddEdit
        open={isSheetOpen}
        onClose={handleCloseSheet}
        editData={editData}
      />

      {/* iOS-Style Bottom Drawer for Mobile Details */}
      <AppointmentDetailDrawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        appointment={selectedAppointment}
        onEdit={handleEdit}
      />

      <section className="space-y-6">
        <TableMaker
          className="overflow-hidden [&_td]:bg-white"
          columns={appointmentColumns}
          tableInfo={tableInfo}
          showPagination={true}
          logics={{ handleEdit }}
          // Custom mobile card renderer for touch screens (< md)
          mobileCardRender={({ row }) => (
            <MobileAppointmentCard
              key={row.id}
              row={row}
              onClick={handleOpenDrawer}
              onEdit={handleEdit}
            />
          )}
          render={(tableInfo) => (
            <>
              {/* Table search, filter, and Add Action card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
                {/* Header Title and Add Button */}
                <div className="flex items-start sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                      Appointments List
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Manage and verify appointment requests
                    </p>
                  </div>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shrink-0 rounded-xl h-10 px-4 text-xs sm:text-sm font-medium"
                    onClick={handleAdd}
                  >
                    <Plus className="mr-1.5 h-4 w-4" />
                    <span>Add Item</span>
                  </Button>
                </div>

                {/* Search and Dropdown Filter Row */}
                <div className="flex items-stretch sm:items-center gap-2 flex-col sm:flex-row">
                  <div className="flex-1">
                    <TableSearch
                      placeholder="Search by ID, applicant, email..."
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
                      manualOption={statusOptions}
                      value={status}
                      setValue={(value) =>
                        routerSyncParams({ status: value, page: 1 })
                      }
                    />
                  </div>
                </div>

                {/* Mobile-Friendly Status Filter Pills (Scrollable touch chips) */}
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
            </>
          )}
          noDataRender={() => (
            <div className="flex h-56 flex-col items-center justify-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <p className="text-base font-semibold text-slate-800">
                No Appointments Found
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                Try adjusting your search query or switching the status filter.
              </p>
              {(search || status) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => routerSyncParams({ search: "", status: "", page: 1 })}
                  className="mt-4 text-xs rounded-xl"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default DemoList;
