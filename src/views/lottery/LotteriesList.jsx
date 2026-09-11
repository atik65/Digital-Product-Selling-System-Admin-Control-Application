import { useState } from "react";
import useTable from "@/components/common/table/hooks/useTable";
import TableMaker from "@/components/common/table/TableMaker";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import lotteryApi from "./api";
import { lotteryColumns } from "./utils/columns";
import AddEditCampaign from "./components/AddEditCampaign";
import ManagePrizesModal from "./components/ManagePrizesModal";
import LotteryEntriesModal from "./components/LotteryEntriesModal";

const LotteriesList = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedLotteryPrizes, setSelectedLotteryPrizes] = useState(null);
  const [selectedLotteryEntries, setSelectedLotteryEntries] = useState(null);

  const handleManagePrizes = (lottery) => {
    setSelectedLotteryPrizes(lottery);
  };

  const handleViewEntries = (lottery) => {
    setSelectedLotteryEntries(lottery);
  };

  const { tableInfo } = useTable({
    api: lotteryApi.list,
    apiCacheKey: lotteryApi.cacheKey,
  });

  return (
    <div className="space-y-6">
      {/* Create Campaign Sheet */}
      <AddEditCampaign
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />

      {/* Prize Pool Modal */}
      <ManagePrizesModal
        open={!!selectedLotteryPrizes}
        onClose={() => setSelectedLotteryPrizes(null)}
        lottery={selectedLotteryPrizes}
      />

      {/* Entry Logs Modal */}
      <LotteryEntriesModal
        open={!!selectedLotteryEntries}
        onClose={() => setSelectedLotteryEntries(null)}
        lottery={selectedLotteryEntries}
      />

      <section className="space-y-6">
        <TableMaker
          className="overflow-hidden [&_td]:bg-white"
          columns={lotteryColumns}
          tableInfo={tableInfo}
          showPagination={true}
          logics={{
            handleManagePrizes,
            handleViewEntries,
          }}
          render={() => (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs flex items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Gamified Lucky Wheel & Lotteries
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Engage customers with gamified promotional spin wheels, prize pools, and probability engines
                </p>
              </div>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shrink-0 rounded-xl h-10 px-4 text-xs sm:text-sm font-medium"
                onClick={() => setIsSheetOpen(true)}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                <span>New Campaign</span>
              </Button>
            </div>
          )}
          noDataRender={() => (
            <div className="flex h-56 flex-col items-center justify-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-base font-semibold text-slate-800">
                No Lottery Campaigns
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
                Launch a lucky wheel campaign to retain and reward active customers.
              </p>
              <Button
                onClick={() => setIsSheetOpen(true)}
                className="mt-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                size="sm"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                New Campaign
              </Button>
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default LotteriesList;
