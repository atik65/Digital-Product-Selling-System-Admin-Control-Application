import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";
import { MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";

export const smsColumns = [
  {
    header: "SENDER / PROVIDER",
    accessorKey: "sender",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
          <MessageSquare className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-xs text-slate-900 font-mono">
            {row.sender || row.provider || "Android Gateway"}
          </span>
          {row.sim_slot !== undefined && (
            <span className="text-[10px] text-slate-400">
              SIM Slot #{row.sim_slot}
            </span>
          )}
        </div>
      </div>
    ),
  },
  {
    header: "SMS MESSAGE PAYLOAD",
    accessorKey: "message",
    cell: ({ row }) => (
      <p className="text-xs text-slate-700 font-mono bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-xl break-all">
        {row.message}
      </p>
    ),
  },
  {
    header: "MATCH STATUS",
    accessorKey: "is_matched",
    cell: ({ row }) => {
      const isMatched = row.is_matched;
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border",
            isMatched
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          )}
        >
          {isMatched ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Reconciled
            </>
          ) : (
            <>
              <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
              Unmatched
            </>
          )}
        </span>
      );
    },
  },
  {
    header: "RECEIVED AT",
    accessorKey: "created_at",
    cell: ({ row }) => (
      <span className="text-xs text-slate-500">
        {formatDate(row.created_at || row.timestamp)}
      </span>
    ),
  },
];
