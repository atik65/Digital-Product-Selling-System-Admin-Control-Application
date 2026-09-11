import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const appointmentColumns = [
  {
    header: "APPLICANT",
    accessorKey: "user",
    cell: ({ row }) => {
      const user = row.user;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">
            {user?.first_name} {user?.last_name}
          </span>
          <span className="text-xs text-slate-500">{user?.email}</span>
        </div>
      );
    },
  },
  {
    header: "CATEGORY",
    accessorKey: "document_category",
    cell: ({ row }) => {
      return (
        <span className="capitalize">{row.document_category?.name || "-"}</span>
      );
    },
  },
  {
    header: "DATE",
    accessorKey: "created_at",
    cell: ({ row }) => new Date(row.created_at).toLocaleDateString(),
  },
  {
    header: "STATUS",
    accessorKey: "status",
    cell: ({ row }) => {
      const statusMap = {
        SUBMITTED: {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          label: "documents submitted",
        },
        PENDING: {
          bg: "bg-slate-100",
          text: "text-slate-600",
          label: "pending",
        },
        "UNDER-REVIEW": {
          bg: "bg-blue-50",
          text: "text-blue-700",
          label: "under review",
        },
        APPROVED: {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          label: "approved",
        },
        REJECTED: {
          bg: "bg-rose-50",
          text: "text-rose-700",
          label: "slot offered",
        },
      };
      const status = statusMap[row.status] || statusMap.PENDING;
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize",
            status.bg,
            status.text
          )}
        >
          {status.label}
        </span>
      );
    },
  },
  {
    header: "ACTIONS",
    accessorKey: "actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 gap-1"
          onClick={() =>
            navigate(`/document-verification?applicant_id=${row.id}`)
          }
        >
          <Eye className="h-4 w-4" />
          <span className="text-xs">View Details</span>
        </Button>
      );
    },
  },
];
