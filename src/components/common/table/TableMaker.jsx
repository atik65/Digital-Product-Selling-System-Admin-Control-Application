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
  }) => {
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
            <Table
              className={className}
              enableSelect={enableSelect}
              columns={columns}
              data={tableInfo?.data?.data}
              tableInfo={tableInfo}
              showTableHeader={showTableHeader}
              noDataRender={noDataRender}
              logics={logics}
            />
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
