import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useApi from "@/hooks/useApi";
import lotteryApi from "../api";
import { Loader2, Users, Gift, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/formatters";

const LotteryEntriesModal = ({ open, onClose, lottery }) => {
  const { data: entriesData, isLoading } = useApi({
    api: lottery?.id ? lotteryApi.listEntries(lottery.id) : null,
    cacheKey: `lotteryEntries-${lottery?.id}`,
    trigger: !!lottery?.id && open,
  });

  if (!lottery) return null;

  const entries = entriesData?.data?.items || entriesData?.data || [];

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Customer Wheel Spins Log
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Audit logs of participant entries and won prize allocations for {lottery.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2">
          {isLoading ? (
            <div className="flex justify-center py-8 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500">No customer spin records logged yet.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Spins taken by customers through the storefront lucky wheel will be tracked here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Gift className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        User #{entry.user_id}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(entry.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {entry.prize ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        <CheckCircle2 className="h-3 w-3" />
                        Won {entry.prize.discount_value} ({entry.prize.discount_type})
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">
                        No prize awarded
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LotteryEntriesModal;
