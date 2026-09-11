import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, Gift, Users, Calendar } from "lucide-react";
import { formatDate } from "@/lib/formatters";

export const lotteryColumns = [
  {
    header: "CAMPAIGN NAME",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-xs text-slate-900 truncate">
            {row.name}
          </span>
          {row.description && (
            <span className="text-[11px] text-slate-500 truncate max-w-xs">
              {row.description}
            </span>
          )}
        </div>
      </div>
    ),
  },
  {
    header: "PRIZE POOL",
    accessorKey: "prizes",
    cell: ({ row }) => {
      const count = (row.prizes || []).length;
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
          <Gift className="h-3 w-3 text-amber-600" />
          {count} {count === 1 ? "Prize" : "Prizes"}
        </span>
      );
    },
  },
  {
    header: "CAMPAIGN TIMELINE",
    accessorKey: "starts_at",
    cell: ({ row }) => (
      <div className="flex flex-col text-xs text-slate-500">
        <span>Start: {row.starts_at ? formatDate(row.starts_at) : "Immediate"}</span>
        <span>End: {row.ends_at ? formatDate(row.ends_at) : "Ongoing"}</span>
      </div>
    ),
  },
  {
    header: "STATUS",
    accessorKey: "is_active",
    cell: ({ row }) => {
      const isActive = row.is_active;
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border",
            isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-100 text-slate-600 border-slate-200"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isActive ? "bg-emerald-500" : "bg-slate-400"
            )}
          />
          {isActive ? "Active Spin Wheel" : "Inactive"}
        </span>
      );
    },
  },
  {
    header: "ACTIONS",
    accessorKey: "actions",
    cell: ({ row, logics }) => (
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="border-amber-200 text-amber-700 hover:bg-amber-50 h-8 px-2.5 rounded-lg text-xs font-medium gap-1"
          onClick={() => logics.handleManagePrizes(row)}
        >
          <Gift className="h-3.5 w-3.5" />
          <span>Prizes</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-slate-600 hover:bg-slate-100 h-8 px-2.5 rounded-lg text-xs font-medium gap-1"
          onClick={() => logics.handleViewEntries(row)}
        >
          <Users className="h-3.5 w-3.5" />
          <span>Spins Log</span>
        </Button>
      </div>
    ),
  },
];
