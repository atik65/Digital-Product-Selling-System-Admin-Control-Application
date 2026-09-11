import { useState } from "react";
import useSyncParams from "@/hooks/useSyncParams";
import useTable from "@/components/common/table/hooks/useTable";
import TableMaker from "@/components/common/table/TableMaker";
import TableSearch from "@/components/common/table/TableSearch";
import { SlidersHorizontal, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import Select from "@/components/common/select/Select";
import useRequest from "@/hooks/useRequest";
import userApi from "./api";
import { userColumns } from "./utils/columns";
import UserDetailDrawer from "./components/UserDetailDrawer";
import MobileUserCard from "./components/MobileUserCard";
import WalletAdjustModal from "@/views/wallet/components/WalletAdjustModal";

const statusFilterOptions = [
  { id: "", label: "All Users" },
  { id: "true", label: "Active Only" },
  { id: "false", label: "Suspended Only" },
];

const UsersList = () => {
  const { searchParamsSyncParams, routerSyncParams } = useSyncParams();
  const searchParams = searchParamsSyncParams;

  const search = searchParams?.get("search") || "";
  const isActiveParam = searchParams?.get("is_active") || "";

  // Drawer and Modal states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustModalUser, setAdjustModalUser] = useState(null);

  const { mutateAsync } = useRequest();

  const handleOpenDrawer = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleOpenAdjustModal = (user) => {
    setAdjustModalUser(user);
  };

  const handleToggleStatus = async (user) => {
    try {
      await mutateAsync({
        id: user.id,
        data: { is_active: !user.is_active },
        api: userApi.toggleStatus(user.id),
        cacheKey: userApi.cacheKey,
      });
    } catch (err) {
      console.error("Toggle user status error:", err);
    }
  };

  // Build filter object for useTable
  const filter = {};
  if (search) filter.search = search;
  if (isActiveParam !== "") filter.is_active = isActiveParam === "true";

  const { tableInfo } = useTable({
    filter,
    api: userApi.list,
    apiCacheKey: userApi.cacheKey,
  });

  return (
    <div className="space-y-6">
      {/* User Detail Drawer */}
      <UserDetailDrawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        user={selectedUser}
        onAdjustBalance={handleOpenAdjustModal}
      />

      {/* Wallet Balance Adjust Modal */}
      <WalletAdjustModal
        open={!!adjustModalUser}
        onClose={() => setAdjustModalUser(null)}
        user={adjustModalUser}
      />

      <section className="space-y-6">
        <TableMaker
          className="overflow-hidden [&_td]:bg-white"
          columns={userColumns}
          tableInfo={tableInfo}
          showPagination={true}
          logics={{
            handleOpenDrawer,
            handleOpenAdjustModal,
            handleToggleStatus,
          }}
          mobileCardRender={({ row }) => (
            <MobileUserCard
              key={row.id}
              row={row}
              onClick={handleOpenDrawer}
              onAdjustBalance={handleOpenAdjustModal}
              onToggleStatus={handleToggleStatus}
            />
          )}
          render={(tableInfo) => (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  User Management
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  View customer registrations, inspect profile histories, and manage account statuses
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex items-stretch sm:items-center gap-2 flex-col sm:flex-row">
                <div className="flex-1">
                  <TableSearch
                    placeholder="Search by email, username, phone..."
                    searchTableParams={search}
                    tableInfo={tableInfo}
                    className="w-full"
                  />
                </div>
                <div className="shrink-0">
                  <Select
                    inputClassName="w-full sm:min-w-[190px] h-10 rounded-xl"
                    placeholder="All Users"
                    optionSchema={{
                      id: "id",
                      label: "label",
                    }}
                    manualOption={statusFilterOptions}
                    value={isActiveParam}
                    setValue={(value) =>
                      routerSyncParams({ is_active: value, page: 1 })
                    }
                  />
                </div>
              </div>

              {/* Filter Pills */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1 shrink-0 flex items-center gap-1">
                    <SlidersHorizontal className="h-3 w-3" />
                    Status:
                  </span>
                  {statusFilterOptions.map((opt) => {
                    const isActive = (isActiveParam || "") === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          routerSyncParams({ is_active: opt.id, page: 1 })
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
                <Users className="h-5 w-5" />
              </div>
              <p className="text-base font-semibold text-slate-800">
                No Users Found
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                Customers who sign in with Google OAuth will appear in this registry.
              </p>
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default UsersList;
