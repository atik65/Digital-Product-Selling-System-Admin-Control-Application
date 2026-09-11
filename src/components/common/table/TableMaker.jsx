import { memo } from "react";
import TableLoading from "./TableLoading";
import Table from "./Table";
import TablePagination from "./TablePagination";

/**
 * TableMaker - Declarative table scaffolding that pairs naturally with useRequest.
 *
 * WHAT IT DOES:
 * - Shares the same `tableInfo` object throughout render/header/table/pagination so UI stays synced.
 * - Handles the full loading→data lifecycle with zero boilerplate.
 * - Keeps pagination outside <Table> so layout remains stable while switching pages.
 *
 * PROPS:
 * - `columns` (Array): column config consumed by <Table />.
 * - `tableInfo` (Object): exact useRequest response (data, meta, isLoading, handlers).
 * - `render(tableInfo)` (Function): render controls above the table (filters, stats, CTA).
 * - `headerRender(tableInfo)` (Function): inject custom header rows/toolbars.
 * - `noDataRender()` (Function): custom empty state for <Table />.
 * - `enableSelect` (Boolean): enable checkbox selection.
 * - `showPagination` (Boolean): toggle pagination footer.
 * - `showTableHeader` (Boolean): hide native table header when embedding custom columns.
 * - `logics` (Object): pass helpers (sorting handlers, bulk actions, etc.) straight to <Table />.
 *
 * RENDER LIFECYCLE:
 * 1. Always runs `render(tableInfo)` first so ancillary UI can react to request state.
 * 2. Shows <TableLoading /> while `tableInfo.isLoading` is true.
 * 3. Renders headerRender + <Table /> with `tableInfo.data?.data`.
 * 4. Adds <TablePagination /> when `showPagination` is true (reads meta from tableInfo).
 *
 * USAGE RECIPES:
 *
 * 1. BASIC LIST VIEW
 * ```jsx
 * const { tableInfo } = useTable({
 *   filter: { search },
 *   api: documentTypeApi.list,
 *   apiCacheKey: documentTypeApi.cacheKey,
 * });
 *
 * <TableMaker columns={columns} tableInfo={tableInfo} />;
 * ```
 *
 * 2. LIST WITH FILTERS & TOOLBAR
 * ```jsx
 * <TableMaker
 *   columns={columns}
 *   tableInfo={tableInfo}
 *   render={() => <Filters />}
 *   headerRender={() => <TableToolbar />}
 *   noDataRender={() => <EmptyState message="No records yet" />}
 * />;
 * ```
 *
 * 3. READ-ONLY TABLE WITHOUT PAGINATION
 * ```jsx
 * <TableMaker
 *   columns={columns}
 *   tableInfo={tableInfo}
 *   showTableHeader={false}
 *   showPagination={false}
 * />;
 * ```
 */
/**
 * Default mobile card view when no custom mobileCardRender is provided
 */
const DefaultMobileCard = ({ row, columns, tableInfo, logics, enableSelect }) => {
  const getNestedValue = (obj, path) => {
    if (!path) return null;
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  return (
    <div className="bg-white rounded-xl border p-4 shadow-xs space-y-3">
      {enableSelect && (
        <div className="flex items-center justify-between pb-2 border-b">
          <span className="text-xs font-semibold uppercase text-slate-500">Select</span>
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            checked={tableInfo?.selectedRows?.includes(row?.id)}
            onChange={() => tableInfo?.handleRowSelect(row?.id)}
          />
        </div>
      )}
      <div className="grid grid-cols-1 gap-2">
        {columns.map((col, idx) => {
          if (col.accessorKey === "actions" || col.accessorKey === "select") return null;
          const headerText =
            typeof col.header === "function" ? col.header({ tableInfo }) : col.header;
          const cellContent = col.cell
            ? col.cell({ row, tableInfo, logics })
            : getNestedValue(row, col.accessorKey);

          return (
            <div key={idx} className="flex items-start justify-between gap-2 py-1 border-b last:border-b-0">
              <span className="text-xs font-medium text-slate-500">{headerText}</span>
              <div className="text-sm font-medium text-slate-900 text-right">{cellContent}</div>
            </div>
          );
        })}
      </div>
      {columns.find((c) => c.accessorKey === "actions") && (
        <div className="pt-2 border-t flex justify-end">
          {columns
            .find((c) => c.accessorKey === "actions")
            ?.cell?.({ row, tableInfo, logics })}
        </div>
      )}
    </div>
  );
};

const TableMaker = memo(
  ({
    columns,
    enableSelect = false,
    render = () => null,
    tableInfo,
    className,
    headerRender = () => null,
    noDataRender = () => null,
    showPagination = true,
    showTableHeader = true,
    logics = {},
    mobileCardRender = null,
  }) => {
    const data = tableInfo?.data?.data;
    const hasData = Array.isArray(data) && data.length > 0;

    return (
      <>
        {render(tableInfo)}

        {tableInfo?.isLoading ? (
          <TableLoading
            columnCount={columns.length}
            showPagination={showPagination}
          />
        ) : (
          <>
            {headerRender(tableInfo)}

            {/* Desktop Table View (≥ md) */}
            <div className="hidden md:block">
              <Table
                className={className}
                enableSelect={enableSelect}
                columns={columns}
                data={data}
                tableInfo={tableInfo}
                showTableHeader={showTableHeader}
                noDataRender={noDataRender}
                logics={logics}
              />
            </div>

            {/* Mobile Card View (< md) */}
            <div className="block md:hidden mb-4">
              {hasData ? (
                <div className="space-y-3">
                  {data.map((row, index) =>
                    mobileCardRender ? (
                      mobileCardRender({ row, index, tableInfo, logics })
                    ) : (
                      <DefaultMobileCard
                        key={row.id || index}
                        row={row}
                        columns={columns}
                        tableInfo={tableInfo}
                        logics={logics}
                        enableSelect={enableSelect}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl border p-8 text-center">
                  {noDataRender ? noDataRender() : "No results."}
                </div>
              )}
            </div>

            {showPagination && (
              <TablePagination
                tableInfo={tableInfo}
                enableSelect={enableSelect}
              />
            )}
          </>
        )}
      </>
    );
  }
);
TableMaker.displayName = "TableMaker";

export default TableMaker;
