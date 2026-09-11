import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { revalidateCache } from "@/lib/queryInstance";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCcw,
} from "lucide-react";

function TablePagination({ tableInfo, enableSelect }) {
  console.log("TablePagination Info:", tableInfo);
  const { selectedRows, pagination, routerSyncParams, cacheKey } = tableInfo;
  const { page, per_page, prev_page, next_page, last_page, total, from, to } =
    pagination;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-2 gap-3">
      {/* Row count summary */}
      {enableSelect ? (
        <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left w-full sm:w-auto">
          <span className="font-semibold text-slate-800">{selectedRows.length}</span> of {total || 0} row(s) selected
        </div>
      ) : (
        <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left w-full sm:w-auto">
          Showing <span className="font-medium text-slate-800">{from || 0}</span> to{" "}
          <span className="font-medium text-slate-800">{to || 0}</span> of{" "}
          <span className="font-semibold text-slate-800">{total || 0}</span> rows
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 sm:gap-3">
        {/* Refresh button */}
        <Button
          className="rounded-full h-8 w-8 sm:h-9 sm:w-9 shrink-0"
          variant="outline"
          size="icon"
          title="Refresh table data"
          onClick={async () => {
            await revalidateCache(cacheKey);
          }}
        >
          <RefreshCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>

        {/* Rows per page selector (hidden on tiny screens, visible on sm+) */}
        <div className="hidden sm:flex items-center gap-2">
          <p className="text-xs sm:text-sm font-medium whitespace-nowrap">Rows</p>
          <Select
            value={`${per_page}`}
            onValueChange={(value) => {
              routerSyncParams({
                per_page: Number(value),
                ...(page !== 1 && { page: 1 }),
              });
            }}
          >
            <SelectTrigger className="h-8 w-16 text-xs">
              <SelectValue placeholder={per_page} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page counter */}
        <div className="text-xs sm:text-sm font-medium px-2 py-1 rounded bg-slate-100 text-slate-700 whitespace-nowrap">
          {page} / {last_page || 1}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => routerSyncParams({ page: 1 })}
            disabled={page === 1}
            title="First page"
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => routerSyncParams({ page: page - 1 })}
            disabled={page === prev_page || !prev_page}
            title="Previous page"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => routerSyncParams({ page: page + 1 })}
            disabled={page === next_page || !next_page}
            title="Next page"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => routerSyncParams({ page: last_page })}
            disabled={page === last_page || !last_page}
            title="Last page"
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TablePagination;
