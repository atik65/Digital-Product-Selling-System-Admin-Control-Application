import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "../TableSkeleton";

export default function TableLoading({
  columnCount,
  rowCount = 6,
  showPagination = true,
}) {
  return (
    <div className="w-full space-y-4">
      {/* Desktop Skeleton */}
      <div className="hidden md:block w-full overflow-auto">
        <TableSkeleton columnCount={columnCount} rowCount={rowCount} />
      </div>

      {/* Mobile Card Skeletons */}
      <div className="block md:hidden space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>

      {showPagination && (
        <div className="flex gap-4 justify-between items-center px-2">
          <Skeleton className="h-6 w-28 sm:w-36" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-16 rounded" />
            <Skeleton className="h-8 w-16 rounded" />
          </div>
        </div>
      )}
    </div>
  );
}
