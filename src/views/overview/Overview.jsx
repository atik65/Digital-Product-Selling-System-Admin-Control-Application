import useApi from "@/hooks/useApi";
import overviewApi from "./api";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Users,
  Coins,
  ArrowUpRight,
  RefreshCw,
  Package,
  CreditCard,
  Tag,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatPrice, formatDate, getStatusBadge } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const Overview = () => {
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useApi({
    api: overviewApi.summary,
    cacheKey: overviewApi.cacheKey,
  });

  const {
    data: activityData,
    isLoading: isActivityLoading,
    refetch: refetchActivity,
  } = useApi({
    api: overviewApi.recentActivity,
    cacheKey: overviewApi.activityCacheKey,
  });

  const summary = summaryData?.data || {
    today_sales: 0,
    today_orders: 0,
    pending_payments: 0,
    pending_orders: 0,
    total_users: 0,
    pending_topups: 0,
  };

  const recentOrders = activityData?.data?.recent_orders || [];
  const recentPayments = activityData?.data?.recent_payments || [];

  const handleRefresh = () => {
    refetchSummary();
    refetchActivity();
  };

  const stats = [
    {
      title: "Today's Gross Sales",
      value: formatPrice(summary.today_sales),
      icon: TrendingUp,
      accent: "text-emerald-700 bg-emerald-50 border-emerald-200/80",
      link: "/orders",
      subtext: "Gross customer order payments today",
    },
    {
      title: "Today's Orders",
      value: String(summary.today_orders),
      icon: ShoppingBag,
      accent: "text-blue-700 bg-blue-50 border-blue-200/80",
      link: "/orders",
      subtext: "Orders placed across all products",
    },
    {
      title: "Pending Payments",
      value: String(summary.pending_payments),
      icon: Clock,
      accent:
        summary.pending_payments > 0
          ? "text-amber-800 bg-amber-50 border-amber-300 ring-2 ring-amber-400/20"
          : "text-amber-700 bg-amber-50 border-amber-200/80",
      link: "/payments",
      subtext: "Awaiting admin manual verification",
      alert: summary.pending_payments > 0,
    },
    {
      title: "Pending Fulfillment",
      value: String(summary.pending_orders),
      icon: Package,
      accent:
        summary.pending_orders > 0
          ? "text-indigo-800 bg-indigo-50 border-indigo-300 ring-2 ring-indigo-400/20"
          : "text-indigo-700 bg-indigo-50 border-indigo-200/80",
      link: "/orders?status_filter=PAID",
      subtext: "Paid orders ready for delivery",
      alert: summary.pending_orders > 0,
    },
    {
      title: "Top-Up Requests",
      value: String(summary.pending_topups),
      icon: Coins,
      accent:
        summary.pending_topups > 0
          ? "text-rose-800 bg-rose-50 border-rose-300 ring-2 ring-rose-400/20"
          : "text-rose-700 bg-rose-50 border-rose-200/80",
      link: "/wallet-topups",
      subtext: "Pending customer wallet credits",
      alert: summary.pending_topups > 0,
    },
    {
      title: "Platform Customers",
      value: String(summary.total_users),
      icon: Users,
      accent: "text-purple-700 bg-purple-50 border-purple-200/80",
      link: "/users",
      subtext: "Registered user accounts",
    },
  ];

  const hasUrgentAction =
    summary.pending_payments > 0 ||
    summary.pending_orders > 0 ||
    summary.pending_topups > 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Refresh */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Platform Analytics & Operational Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor real-time sales performance, review fulfillment queues, and audit live activity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="rounded-xl h-9 px-3 text-xs font-semibold gap-1.5"
            disabled={isSummaryLoading || isActivityLoading}
          >
            <RefreshCw
              className={cn(
                "h-3.5 w-3.5",
                (isSummaryLoading || isActivityLoading) && "animate-spin"
              )}
            />
            <span>Refresh Metrics</span>
          </Button>
        </div>
      </div>

      {/* Urgent Action Notice (if items are awaiting review) */}
      {hasUrgentAction && (
        <div className="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm">
                Attention Required in Operational Queues
              </h4>
              <p className="text-xs text-amber-800">
                You have pending payments, unfulfilled paid orders, or wallet top-up requests waiting for review.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {summary.pending_payments > 0 && (
              <Link
                to="/payments"
                className="bg-white border border-amber-300 text-amber-800 hover:bg-amber-100/50 px-3 py-1.5 rounded-xl text-xs font-semibold"
              >
                Verify {summary.pending_payments} Payments
              </Link>
            )}
            {summary.pending_topups > 0 && (
              <Link
                to="/wallet-topups"
                className="bg-white border border-amber-300 text-amber-800 hover:bg-amber-100/50 px-3 py-1.5 rounded-xl text-xs font-semibold"
              >
                Review {summary.pending_topups} Top-ups
              </Link>
            )}
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className="group bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">
                  {item.title}
                </span>
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight block mt-1">
                  {item.value}
                </span>
              </div>

              <div
                className={cn(
                  "h-11 w-11 rounded-2xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                  item.accent
                )}
              >
                <item.icon className="h-5 w-5" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs text-slate-400">
              <span className="truncate">{item.subtext}</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Live Activity Feeds & Quick Action Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Stream */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">
                Recent Customer Orders
              </h3>
            </div>
            <Link
              to="/orders"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No recent orders recorded yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentOrders.map((ord) => {
                const badge = getStatusBadge(ord.status);
                return (
                  <Link
                    key={ord.id}
                    to="/orders"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          {ord.order_number}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.2 rounded-full text-[10px] font-semibold border",
                            badge.bg,
                            badge.text,
                            badge.border
                          )}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {formatDate(ord.created_at)}
                      </span>
                    </div>

                    <span className="font-bold text-emerald-700">
                      {formatPrice(ord.total_amount)}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Payment Verification Logs */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">
                Recent Payment Submissions
              </h3>
            </div>
            <Link
              to="/payments"
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-800"
            >
              Queue View
            </Link>
          </div>

          {recentPayments.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No recent payment transactions recorded yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentPayments.map((pm) => {
                const badge = getStatusBadge(pm.status);
                return (
                  <Link
                    key={pm.id}
                    to="/payments"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          {pm.transaction_id}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.2 rounded-full text-[10px] font-semibold border",
                            badge.bg,
                            badge.text,
                            badge.border
                          )}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Sender: {pm.sender_number} • Order #{pm.order_id}
                      </span>
                    </div>

                    <span className="font-bold text-emerald-700">
                      {formatPrice(pm.amount)}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
