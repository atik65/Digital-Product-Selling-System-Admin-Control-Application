import { useState } from "react";
import useTable from "@/components/common/table/hooks/useTable";
import TableMaker from "@/components/common/table/TableMaker";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard } from "lucide-react";
import paymentApi from "../api";
import { paymentMethodColumns } from "./columns";
import AddEditMethod from "./components/AddEditMethod";

const PaymentMethodsList = () => {
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
    api: paymentApi.listMethods,
    apiCacheKey: paymentApi.methodsCacheKey,
  });

  return (
    <div className="space-y-6">
      <AddEditMethod
        open={isSheetOpen}
        onClose={handleCloseSheet}
        editData={editData}
      />

      <section className="space-y-6">
        <TableMaker
          className="overflow-hidden [&_td]:bg-white"
          columns={paymentMethodColumns}
          tableInfo={tableInfo}
          showPagination={true}
          logics={{
            handleEdit,
            deleteApi: paymentApi.deleteMethod,
            cacheKey: paymentApi.methodsCacheKey,
          }}
          render={() => (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs flex items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Payment Methods & Gateways
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Manage recipient mobile financial accounts (bKash, Nagad, Rocket) and customer instructions
                </p>
              </div>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shrink-0 rounded-xl h-10 px-4 text-xs sm:text-sm font-medium"
                onClick={handleAdd}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                <span>Add Gateway</span>
              </Button>
            </div>
          )}
          noDataRender={() => (
            <div className="flex h-56 flex-col items-center justify-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <CreditCard className="h-5 w-5" />
              </div>
              <p className="text-base font-semibold text-slate-800">
                No Payment Methods Configured
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                Add bKash, Nagad, or bank accounts so customers can complete payments.
              </p>
              <Button
                onClick={handleAdd}
                className="mt-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                size="sm"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Gateway
              </Button>
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default PaymentMethodsList;
