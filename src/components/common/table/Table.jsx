import { Checkbox } from "@/components/ui/checkbox";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as TableWrap,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const selectColumn = {
  classHeader: "w-[2.5%]",
  header: ({ tableInfo }) => (
    <div className="flex items-center">
      <Checkbox
        checked={
          tableInfo?.data?.items?.length &&
          tableInfo?.selectedRows?.length === tableInfo?.data?.items?.length
        }
        onCheckedChange={() =>
          tableInfo.handleSelectAll(tableInfo?.data?.items)
        }
        aria-label="Select all"
      />
    </div>
  ),
  cell: ({ row, tableInfo }) => (
    <div className="flex items-center">
      <Checkbox
        checked={tableInfo?.selectedRows.includes(row?.id)}
        onCheckedChange={() => tableInfo?.handleRowSelect(row?.id)}
        aria-label="Select row"
      />
    </div>
  ),
};

const Table = ({
  data,
  columns,
  tableInfo = {},
  enableSelect,
  className,
  showTableHeader = true,
  noDataRender = () => null,
  logics = {},
}) => {
  const navigate = useNavigate();
  const allColumns = enableSelect ? [selectColumn, ...columns] : columns;

  // Helper function to get nested property value
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  return (
    <div className={cn("border rounded-xl mb-4 ", className)}>
      <TableWrap>
        {showTableHeader && (
          <TableHeader>
            <TableRow>
              {allColumns.map((item, i) => (
                <TableHead
                  key={i}
                  className={cn(
                    "px-5 text-xs font-semibold uppercase",
                    item?.classHeader,
                  )}
                >
                  {item.header instanceof Function
                    ? item.header({ tableInfo })
                    : item.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}

        <TableBody>
          {
            data?.length
              ? data?.map((row) => (
                  <TableRow key={row.id}>
                    {allColumns.map((item, i) => (
                      <TableCell
                        key={i}
                        className={cn("px-5 py-3", item?.classCell)}
                      >
                        {item?.cell
                          ? item.cell({
                              row,
                              tableInfo,
                              toast,
                              navigate,
                              logics,
                            })
                          : getNestedValue(row, item?.accessorKey)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : (
                  <TableRow>
                    <TableCell
                      colSpan={allColumns.length}
                      className="h-40 text-center"
                    >
                      {noDataRender()}
                    </TableCell>
                  </TableRow>
                ) || (
                  <TableRow>
                    <TableCell
                      colSpan={allColumns.length}
                      className="h-40 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )
            // <div className="h-96 flex items-center justify-center text-center">
            //   No results.
            // </div>
          }
        </TableBody>
      </TableWrap>
    </div>
  );
};

export default Table;
