import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit2, Trash2, CreditCard } from "lucide-react";
import { getImageUrl } from "@/lib/media";
import ActionDialogDelete from "@/components/common/ActionDialogDelete";

export const paymentMethodColumns = [
  {
    header: "METHOD",
    accessorKey: "name",
    cell: ({ row }) => {
      const logo = getImageUrl(row.logo);
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
            {logo ? (
              <img
                src={logo}
                alt={row.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <CreditCard className="h-5 w-5 text-emerald-600" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-xs text-slate-900 truncate">
              {row.name}
            </span>
            {row.instructions && (
              <span className="text-[11px] text-slate-500 truncate max-w-xs">
                {row.instructions}
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    header: "ACCOUNT NUMBER",
    accessorKey: "account_number",
    cell: ({ row }) => (
      <code className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded-md font-mono font-semibold">
        {row.account_number}
      </code>
    ),
  },
  {
    header: "SORT ORDER",
    accessorKey: "sort_order",
    cell: ({ row }) => (
      <span className="text-xs font-semibold text-slate-600">
        #{row.sort_order ?? 0}
      </span>
    ),
  },
  {
    header: "STATUS",
    accessorKey: "is_active",
    cell: ({ row }) => {
      const isActive = row.is_active;
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border",
            isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-100 text-slate-600 border-slate-200"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isActive ? "bg-emerald-500" : "bg-slate-400"
            )}
          />
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    header: "ACTIONS",
    accessorKey: "actions",
    cell: ({ row, logics }) => (
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 h-8 w-8 p-0 rounded-lg"
          onClick={() => logics.handleEdit(row)}
          title="Edit Payment Method"
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        <ActionDialogDelete
          name={row.name}
          request={{
            id: row.id,
            api: logics.deleteApi(row.id),
            cacheKey: logics.cacheKey,
          }}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8 w-8 p-0 rounded-lg"
              title="Delete Payment Method"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          }
        />
      </div>
    ),
  },
];
