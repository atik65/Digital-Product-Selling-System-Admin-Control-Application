import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit2, Trash2, BellRing } from "lucide-react";
import ActionDialogDelete from "@/components/common/ActionDialogDelete";

export const popupColumns = [
  {
    header: "MODAL POPUP",
    accessorKey: "title",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
          <BellRing className="h-4 w-4" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-xs text-slate-900 truncate">
            {row.title}
          </span>
          {row.content && (
            <span className="text-[11px] text-slate-500 truncate max-w-xs">
              {row.content}
            </span>
          )}
        </div>
      </div>
    ),
  },
  {
    header: "TRIGGER RULE",
    accessorKey: "display_type",
    cell: ({ row }) => {
      const typeLabels = {
        ON_FIRST_VISIT: "On First Visit (Session)",
        ONCE_PER_USER: "Once Per User Lifetime",
        AFTER_X_SECONDS: "Timed Delay (5s-10s)",
      };

      return (
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
          {typeLabels[row.display_type] || row.display_type}
        </span>
      );
    },
  },
  {
    header: "CALL TO ACTION",
    accessorKey: "button_text",
    cell: ({ row }) => (
      <div className="flex flex-col text-xs">
        <span className="font-medium text-slate-800">
          {row.button_text || "Dismiss only"}
        </span>
        {row.button_url && (
          <span className="text-[10px] text-emerald-600 font-mono truncate max-w-[140px]">
            {row.button_url}
          </span>
        )}
      </div>
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
            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border",
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
          {isActive ? "Active Popup" : "Disabled"}
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
          title="Edit Announcement Popup"
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        <ActionDialogDelete
          name={row.title}
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
              title="Delete Popup"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          }
        />
      </div>
    ),
  },
];
