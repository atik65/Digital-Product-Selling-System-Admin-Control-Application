import { cn } from "@/lib/utils";

/**
 * UsageMeter - Shows how many successful transactions a payment method has
 * handled in a period against its (optional) limit. Display only: nothing is
 * blocked when the limit is reached, the admin changes the number or disables
 * the method manually.
 */
const UsageMeter = ({ label, count = 0, limit = null, remaining = null }) => {
  const hasLimit = limit !== null && limit !== undefined;
  const ratio = hasLimit && limit > 0 ? count / limit : 0;
  const reached = hasLimit && count >= limit;

  const tone = reached
    ? { text: "text-rose-700", bar: "bg-rose-500" }
    : ratio >= 0.8
      ? { text: "text-amber-700", bar: "bg-amber-500" }
      : { text: "text-emerald-700", bar: "bg-emerald-500" };

  return (
    <div className="min-w-[120px]">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <span className={cn("text-xs font-bold", hasLimit ? tone.text : "text-slate-800")}>
          {count}
          {hasLimit && (
            <span className="font-medium text-slate-400"> / {limit}</span>
          )}
        </span>
      </div>

      {hasLimit ? (
        <>
          <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", tone.bar)}
              style={{ width: `${Math.min(ratio * 100, 100)}%` }}
            />
          </div>
          <span
            className={cn(
              "mt-1 block text-[11px]",
              reached ? "font-semibold text-rose-600" : "text-slate-500"
            )}
          >
            {reached ? "Limit reached" : `${remaining ?? limit - count} left`}
          </span>
        </>
      ) : (
        <span className="mt-1 block text-[11px] text-slate-400">No limit set</span>
      )}
    </div>
  );
};

export default UsageMeter;
