/**
 * Formats numeric price into Bangladeshi Taka (৳) currency representation.
 * @param {number|string} amount
 * @returns {string} e.g. "৳150.00"
 */
export const formatPrice = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return "৳0.00";
  return `৳${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Formats ISO date string into readable human localized representation.
 * @param {string} dateStr
 * @returns {string} e.g. "Sep 11, 2026, 02:30 PM"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

/**
 * Returns color mapping and label for an Order or Payment status.
 * @param {string} status
 */
export const getStatusBadge = (status) => {
  const normalized = (status || "").toUpperCase();
  const map = {
    // Order & Payment shared
    PAID: {
      label: "Paid",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    VERIFIED: {
      label: "Verified",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    APPROVED: {
      label: "Approved",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    COMPLETED: {
      label: "Completed",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    PROCESSING: {
      label: "Processing",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    VERIFYING: {
      label: "Verifying",
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
      dot: "bg-indigo-500",
    },
    PAYMENT_PENDING: {
      label: "Payment Pending",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    PENDING: {
      label: "Pending",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    REJECTED: {
      label: "Rejected",
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      dot: "bg-rose-500",
    },
    FAILED: {
      label: "Failed",
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      dot: "bg-rose-500",
    },
    CANCELLED: {
      label: "Cancelled",
      bg: "bg-slate-100",
      text: "text-slate-600",
      border: "border-slate-200",
      dot: "bg-slate-400",
    },
    REFUNDED: {
      label: "Refunded",
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      dot: "bg-purple-500",
    },
  };

  return (
    map[normalized] || {
      label: status || "Unknown",
      bg: "bg-slate-100",
      text: "text-slate-600",
      border: "border-slate-200",
      dot: "bg-slate-400",
    }
  );
};
