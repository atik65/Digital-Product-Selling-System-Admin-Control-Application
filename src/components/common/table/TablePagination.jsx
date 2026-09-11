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
    <div className="flex items-center justify-between px-2 flex-wrap gap-2.5">
      {enableSelect ? (
        <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
          {selectedRows.length} of {total} row(s) selected.
        </div>
      ) : (
        <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
          Showing {from} to {to} of {total} row(s).
        </div>
      )}
      <div className="flex items-center flex-row flex-wrap ml-auto gap-3">
        <Button
          className="rounded-full"
          variant="outline"
          size="icon"
          onClick={async () => {
            await revalidateCache(cacheKey);
          }}
        >
          <RefreshCcw />
        </Button>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${per_page}`}
            onValueChange={(value) => {
              routerSyncParams({
                per_page: Number(value),
                ...(page !== 1 && { page: 1 }),
              });
            }}
          >
            <SelectTrigger className="h-8 w-17.5">
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
        <div className="flex w-25 items-center justify-center text-sm font-medium">
          Page {page} of {last_page || 0}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => routerSyncParams({ page: 1 })}
            disabled={page === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => routerSyncParams({ page: page - 1 })}
            disabled={page === prev_page || !prev_page}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => routerSyncParams({ page: page + 1 })}
            disabled={page === next_page || !next_page}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => routerSyncParams({ page: last_page })}
            disabled={page === last_page || !last_page}
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
