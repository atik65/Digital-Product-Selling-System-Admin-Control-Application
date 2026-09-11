import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "../TableSkeleton";

export default function TableLoading({
  columnCount,
  rowCount = 10,
  showPagination = true,
}) {
  return (
    <div className="w-full space-y-3 overflow-auto">
      <TableSkeleton columnCount={columnCount} rowCount={rowCount} />
      {showPagination && (
        <div className="flex gap-4 justify-between">
          <Skeleton className="h-8 w-32" />

          <div className="flex w-full flex-col items-center justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8 ml-auto">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-[70px]" />
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                <Skeleton className="h-8 w-20" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="hidden h-8 w-8 lg:block" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="hidden h-8 w-8 lg:block" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
