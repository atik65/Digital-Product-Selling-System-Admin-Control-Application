import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, Coins, UserCheck, UserX, User } from "lucide-react";
import { formatDate } from "@/lib/formatters";
import { getImageUrl } from "@/lib/media";

export const userColumns = [
  {
    header: "USER",
    accessorKey: "email",
    cell: ({ row }) => {
      const avatar = getImageUrl(row.image);
      const initials = (
        (row.name?.[0] || row.username?.[0] || row.email?.[0] || "U")
      ).toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={row.name || row.username}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-xs text-slate-900 truncate">
              {row.name || row.username}
            </span>
            <span className="text-[11px] text-slate-500 truncate">
              {row.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    header: "ROLE",
    accessorKey: "role",
    cell: ({ row }) => {
      const isAdmin = row.role === "admin";
      return (
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border",
            isAdmin
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          )}
        >
          {isAdmin ? "Super Admin" : "Customer"}
        </span>
      );
    },
  },
  {
    header: "PHONE",
    accessorKey: "phone",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-slate-600">
        {row.phone || "-"}
      </span>
    ),
  },
  {
    header: "STATUS",
    accessorKey: "is_active",
    cell: ({ row, logics }) => {
      const isActive = row.is_active;
      return (
        <button
          type="button"
          onClick={() => logics.handleToggleStatus && logics.handleToggleStatus(row)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border transition-all cursor-pointer",
            isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
          )}
          title="Click to activate or suspend account"
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isActive ? "bg-emerald-500" : "bg-rose-500"
            )}
          />
          {isActive ? "Active" : "Suspended"}
        </button>
      );
    },
  },
  {
    header: "REGISTERED",
    accessorKey: "created_at",
    cell: ({ row }) => (
      <span className="text-xs text-slate-500">
        {formatDate(row.created_at)}
      </span>
    ),
  },
  {
    header: "ACTIONS",
    accessorKey: "actions",
    cell: ({ row, logics }) => (
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 h-8 px-2 rounded-lg gap-1 text-xs font-medium"
          onClick={() => logics.handleOpenDrawer(row)}
          title="View Profile Details"
        >
          <Eye className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Inspect</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-8 px-2 rounded-lg gap-1 text-xs font-medium"
          onClick={() => logics.handleOpenAdjustModal(row)}
          title="Adjust Customer Wallet Balance"
        >
          <Coins className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Wallet</span>
        </Button>
      </div>
    ),
  },
];
