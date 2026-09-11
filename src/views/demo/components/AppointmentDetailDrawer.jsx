import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Edit,
  ExternalLink,
  FileCheck2,
  Mail,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { statusConfig } from "./MobileAppointmentCard";

const AppointmentDetailDrawer = ({
  open,
  onClose,
  appointment,
  onEdit,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!appointment) return null;

  const user = appointment.user;
  const fullName =
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    "Applicant Details";
  const initials = (
    (user?.first_name?.[0] || "") + (user?.last_name?.[0] || "")
  ).toUpperCase() || "A";

  const status = statusConfig[appointment.status] || statusConfig.PENDING;

  const formattedDate = appointment.created_at
    ? new Date(appointment.created_at).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not available";

  const formattedTime = appointment.created_at
    ? new Date(appointment.created_at).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const handleCopy = () => {
    if (appointment.id) {
      navigator.clipboard.writeText(appointment.id);
      setCopied(true);
      toast.success(`Application ID ${appointment.id} copied!`);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleEdit = () => {
    onClose();
    if (onEdit) onEdit(appointment);
  };

  const handleViewVerification = () => {
    onClose();
    navigate(`/document-verification?applicant_id=${appointment.id}`);
  };

  // Status timeline stages
  const isApproved = appointment.status === "APPROVED";
  const isRejected = appointment.status === "REJECTED";
  const isUnderReview =
    appointment.status === "UNDER-REVIEW" || isApproved || isRejected;
  const isSubmitted = true;

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-h-[90vh] bg-white rounded-t-3xl border-slate-200">
        {/* iOS Drag Handle */}
        <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-slate-300" />

        {/* Header */}
        <DrawerHeader className="px-6 pt-3 pb-2 text-left">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-12 w-12 shrink-0 rounded-full bg-linear-to-br from-emerald-600 to-teal-700 text-white font-semibold flex items-center justify-center text-base shadow-sm ring-2 ring-emerald-100">
                {initials}
              </div>
              <div className="min-w-0">
                <DrawerTitle className="text-lg font-bold text-slate-900 truncate">
                  {fullName}
                </DrawerTitle>
                <DrawerDescription className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="truncate">{user?.email || "No email"}</span>
                </DrawerDescription>
              </div>
            </div>

            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border shrink-0",
                status.bg
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", status.dot)} />
              {status.label}
            </span>
          </div>
        </DrawerHeader>

        {/* Scrollable Content */}
        <div className="px-6 py-3 space-y-4 overflow-y-auto max-h-[calc(85vh-160px)]">
          {/* Quick Action Chips */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="h-10 text-xs font-medium border-slate-200 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl"
            >
              <Edit className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
              Edit Details
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleViewVerification}
              className="h-10 text-xs font-medium border-slate-200 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-xl"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
              Verification
            </Button>
          </div>

          {/* Status Tracker & Timeline */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Application Progress
            </h4>

            <div className="relative flex items-center justify-between text-center pt-1">
              {/* Progress Line */}
              <div className="absolute left-6 right-6 top-4 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />

              {/* Step 1: Submitted */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-xs transition-colors",
                    isSubmitted
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  )}
                >
                  <FileCheck2 className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-medium text-slate-700">
                  Submitted
                </span>
              </div>

              {/* Step 2: Under Review */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-xs transition-colors",
                    isUnderReview
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  )}
                >
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-medium text-slate-700">
                  Under Review
                </span>
              </div>

              {/* Step 3: Result */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-xs transition-colors",
                    isApproved
                      ? "bg-emerald-600 text-white"
                      : isRejected
                      ? "bg-rose-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  )}
                >
                  {isRejected ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </div>
                <span className="text-[11px] font-medium text-slate-700">
                  {isRejected ? "Rejected" : isApproved ? "Approved" : "Decision"}
                </span>
              </div>
            </div>
          </div>

          {/* Application Metadata Grid */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 shadow-2xs">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Application Details
            </h4>

            <div className="divide-y divide-slate-100 text-sm">
              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 font-medium">Application ID</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
                >
                  <span>{appointment.id}</span>
                  <Copy className="h-3 w-3 text-slate-500" />
                </button>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 font-medium">Document Category</span>
                <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                  {appointment.document_category?.name || "Standard Application"}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 font-medium">Submission Date</span>
                <div className="text-right">
                  <div className="font-medium text-slate-900 text-xs sm:text-sm flex items-center gap-1 justify-end">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formattedDate}</span>
                  </div>
                  {formattedTime && (
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {formattedTime}
                    </div>
                  )}
                </div>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 font-medium">Current Status</span>
                <span className="font-medium capitalize text-xs text-slate-800">
                  {status.label}
                </span>
              </div>
            </div>
          </div>

          {/* Applicant Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 shadow-2xs">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Applicant Profile
            </h4>

            <div className="divide-y divide-slate-100 text-sm">
              <div className="py-2 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 font-medium">First Name</span>
                <span className="font-medium text-slate-900 text-xs sm:text-sm">
                  {user?.first_name || "-"}
                </span>
              </div>
              <div className="py-2 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 font-medium">Last Name</span>
                <span className="font-medium text-slate-900 text-xs sm:text-sm">
                  {user?.last_name || "-"}
                </span>
              </div>
              <div className="py-2 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 font-medium">Email Address</span>
                <span className="font-medium text-slate-900 text-xs truncate max-w-[200px]">
                  {user?.email || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DrawerFooter className="px-6 py-4 pt-2 border-t border-slate-100 flex flex-row gap-3">
          <Button
            type="button"
            onClick={handleEdit}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl h-11 shadow-sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Record
          </Button>

          <DrawerClose asChild>
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl h-11 border-slate-200 font-medium text-slate-700"
            >
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AppointmentDetailDrawer;
