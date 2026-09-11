import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Check,
  Copy,
  Edit,
  Eye,
  FileText,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const statusConfig = {
  SUBMITTED: {
    bg: "bg-amber-50 border-amber-200 text-amber-700",
    dot: "bg-amber-500",
    label: "Documents Submitted",
  },
  PENDING: {
    bg: "bg-slate-100 border-slate-200 text-slate-700",
    dot: "bg-slate-400",
    label: "Pending",
  },
  "UNDER-REVIEW": {
    bg: "bg-blue-50 border-blue-200 text-blue-700",
    dot: "bg-blue-500",
    label: "Under Review",
  },
  APPROVED: {
    bg: "bg-emerald-50 border-emerald-200 text-emerald-700",
    dot: "bg-emerald-500",
    label: "Approved",
  },
  REJECTED: {
    bg: "bg-rose-50 border-rose-200 text-rose-700",
    dot: "bg-rose-500",
    label: "Slot Offered",
  },
};

const MobileAppointmentCard = ({ row, onClick, onEdit }) => {
  const [copied, setCopied] = useState(false);
  const user = row.user;
  const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Unknown Applicant";
  const initials = (
    (user?.first_name?.[0] || "") + (user?.last_name?.[0] || "")
  ).toUpperCase() || "A";

  const status = statusConfig[row.status] || statusConfig.PENDING;
  const formattedDate = row.created_at
    ? new Date(row.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-";

  const handleCopyId = (e) => {
    e.stopPropagation();
    if (row.id) {
      navigator.clipboard.writeText(row.id);
      setCopied(true);
      toast.success(`Copied ID: ${row.id}`);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(row);
  };

  return (
    <div
      onClick={() => onClick && onClick(row)}
      className={cn(
        "group relative bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs",
        "transition-all duration-200 hover:shadow-md hover:border-slate-300",
        "active:scale-[0.99] active:bg-slate-50/50 cursor-pointer select-none"
      )}
    >
      {/* Top row: Avatar, Name/Category, and Status Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-11 w-11 shrink-0 rounded-full bg-linear-to-br from-emerald-500 to-teal-700 text-white font-semibold flex items-center justify-center text-sm shadow-xs ring-2 ring-emerald-100">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
              {fullName}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
              <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{user?.email || "No email"}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border shrink-0",
            status.bg
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", status.dot)} />
          <span>{status.label}</span>
        </span>
      </div>

      {/* Middle row: Category tag & ID */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 truncate bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
          <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate font-medium">
            {row.document_category?.name || "General"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyId}
          className="flex items-center justify-between text-slate-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-100 transition-colors text-left"
          title="Click to copy ID"
        >
          <span className="truncate font-mono font-medium">{row.id || "-"}</span>
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 ml-1" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-1" />
          )}
        </button>
      </div>

      {/* Bottom row: Submission date & Quick Action triggers */}
      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleEditClick}
            className="h-7 px-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-medium rounded-lg"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick(row);
            }}
            className="h-7 px-2.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-xs font-medium rounded-lg"
          >
            <Eye className="h-3 w-3 mr-1" />
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileAppointmentCard;
