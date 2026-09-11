import useSyncParams from "@/hooks/useSyncParams";
import { appointmentColumns } from "./utils/columns";
import appointmentApi from "./api";
import { useState } from "react";
import useTable from "@/components/common/table/hooks/useTable";
import AddEdit from "./components/AddEdit";
import TableMaker from "@/components/common/table/TableMaker";
import { Button } from "@/components/ui/button";
import TableSearch from "@/components/common/table/TableSearch";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Select from "@/components/common/select/Select";
import { appointmentMockData } from "./utils/mockData";

const categories = [
  { key: "all", label: "All Categories", count: 3 },
  { key: "visa", label: "Visa Application", count: 1 },
  { key: "passport", label: "E-Passport", count: 0 },
  { key: "birth", label: "Birth Certificate", count: 1 },
  { key: "nid", label: "NID Card", count: 1 },
  { key: "poa", label: "Power of Attorney", count: 0 },
];

const DemoList = () => {
  const { searchParamsSyncParams, routerSyncParams } = useSyncParams();
  const searchParams = searchParamsSyncParams;

  const search = searchParams?.get("search") || "";

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

  // Table configuration with real API
  const { tableInfo } = useTable({
    filter: {
      search,
    },
    api: appointmentApi.list,
    apiCacheKey: appointmentApi.cacheKey,
  });

  // Please go to useTable hook and uncomment  real api data on tableInfo on return  and comment out mock data when integrating with real api

  return (
    <div className="space-y-6">
      <AddEdit
        open={isSheetOpen}
        onClose={handleCloseSheet}
        editData={editData}
      />

      <section className="space-y-6">
        {" "}
        <TableMaker
          className="overflow-hidden [&_td]:bg-white  "
          columns={appointmentColumns}
          tableInfo={tableInfo}
          showPagination={true}
          logics={{ handleEdit }}
          // enableSelect
          render={(tableInfo) => (
            <>
              {/* table search and filter and  Add Action */}
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center flex-col md:flex-row gap-3 justify-between mb-5">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      Title of Demo List
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                      Manage your list items here
                    </p>
                  </div>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto"
                    onClick={handleAdd}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Item
                  </Button>
                </div>

                <div className="flex items-center gap-2 flex-col md:flex-row ">
                  <TableSearch
                    placeholder="Search by ID, name, or email..."
                    searchTableParams={search}
                    tableInfo={tableInfo}
                    className="w-full md:w-96"
                  />
                  <div>
                    <Select
                      inputClassName="min-w-full md:min-w-[200px]"
                      placeholder="All Status"
                      optionSchema={{
                        id: "id",
                        label: "label",
                      }}
                      manualOption={[
                        { id: "", label: "All Status" },
                        {
                          id: "option-one",
                          label: "Option One",
                        },
                        { id: "option-two", label: "Option Two" },
                        { id: "option-three", label: "Option Three" },
                      ]}
                      value={status}
                      setValue={(value) => routerSyncParams({ status: value })}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          noDataRender={() => (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold text-slate-700">
                No Items Found
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default DemoList;
