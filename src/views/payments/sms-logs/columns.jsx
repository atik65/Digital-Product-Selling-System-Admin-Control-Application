import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";
import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

/**
 * ExpandableMessage - Compact monospace payload viewer with expand/collapse and quick-copy.
 */
export const ExpandableMessage = ({ message, maxLength = 85 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const rawText = message || "";

  if (!rawText) {
    return <span className="text-xs text-slate-400 font-mono">-</span>;
  }

  const isLong = rawText.length > maxLength;
  const displayText =
    isLong && !isExpanded ? `${rawText.slice(0, maxLength).trim()}...` : rawText;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    toast.success("SMS payload copied");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group/msg relative rounded-lg border border-slate-200/80 bg-slate-50/90 p-2.5 text-left transition-all hover:bg-slate-100/70 hover:border-slate-300 max-w-xl w-full">
      <div className="flex items-start justify-between gap-2">
        <p className="flex-1 font-mono text-xs text-slate-700 whitespace-normal break-words break-all leading-relaxed select-text">
          {displayText}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700 transition shadow-2xs"
          title="Copy full message"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {isLong && (
        <div className="mt-2 flex items-center justify-between border-t border-slate-200/70 pt-1.5">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition cursor-pointer select-none"
          >
            <span>{isExpanded ? "Collapse" : "Expand"}</span>
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
          <span className="font-mono text-[10px] text-slate-400">
            {rawText.length} chars
          </span>
        </div>
      )}
    </div>
  );
};

export const smsColumns = [
  {
    header: "SENDER / PROVIDER",
    accessorKey: "sender",
    classHeader: "w-[180px] min-w-[160px]",
    classCell: "whitespace-nowrap align-top",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
          <MessageSquare className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-xs text-slate-900 font-mono">
            {row.sender || row.provider || "Android Gateway"}
          </span>
          {row.sim_slot && (
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
    classHeader: "min-w-[280px]",
    classCell: "whitespace-normal min-w-[280px] max-w-xl align-top",
    cell: ({ row }) => (
      <ExpandableMessage message={row?.raw_message || row?.message} />
    ),
  },
  {
    header: "MATCH STATUS",
    accessorKey: "is_matched",
    classHeader: "w-[140px] min-w-[130px]",
    classCell: "whitespace-nowrap align-top",
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
    classHeader: "w-[170px] min-w-[150px]",
    classCell: "whitespace-nowrap align-top",
    cell: ({ row }) => (
      <span className="text-xs text-slate-500">
        {formatDate(row.created_at || row.timestamp)}
      </span>
    ),
  },
];
