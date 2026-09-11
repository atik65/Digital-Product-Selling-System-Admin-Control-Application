import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock4,
} from "lucide-react";
import useApi from "@/hooks/useApi";
import overviewApi from "./api";

const getStats = (data) => [
  {
    key: "total",
    label: "Total Applications",
    value: data?.total_applications || "0",
    accent: "bg-[#eef4ff] text-[#1d4ed8]",
    icon: CalendarDays,
  },
  {
    key: "pending",
    label: "Pending Documents",
    value: data?.pending_documents || "0",
    accent: "bg-[#fff7ed] text-[#b45309]",
    icon: Clock4,
  },
  {
    key: "approved",
    label: "Approved Documents",
    value: data?.approved_documents || "0",
    accent: "bg-[#ecfdf3] text-[#15803d]",
    icon: CheckCircle2,
  },
  {
    key: "total_docs",
    label: "Total Documents",
    value: data?.total_documents || "0",
    accent: "bg-[#f5f3ff] text-[#6d28d9]",
    icon: ClipboardCheck,
  },
];

const statusStyles = {
  submitted: {
    label: "documents submitted",
    bg: "bg-[#fff7e6]",
    text: "text-[#b45309]",
    dot: "bg-[#fbbf24]",
  },
  review: {
    label: "under review",
    bg: "bg-[#eef2ff]",
    text: "text-[#5b21b6]",
    dot: "bg-[#a78bfa]",
  },
  slot: {
    label: "slot offered",
    bg: "bg-[#fdf2f8]",
    text: "text-[#c026d3]",
    dot: "bg-[#f472b6]",
  },
};

const getCategoryData = (data) =>
  data?.applications_by_category?.map((category) => ({
    id: category.category_id,
    name: category.category_name,
    count: category.application_count,
    status: "active",
  })) || [];

const StatusBadge = ({ status }) => {
  const style = statusStyles[status];
  if (!style) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${style.bg} ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
};

const Overview = () => {
  // const { data: statisticsData, isLoading } = useApi({
  //   api: overviewApi.statistics,
  //   cacheKey: overviewApi.cacheKey,
  // });

  const statisticsData = {
    data: {
      total_applications: 1200,
      pending_documents: 300,
      approved_documents: 800,
      total_documents: 5000,
      applications_by_category: [
        {
          category_id: 1,
          category_name: "Passport",
          application_count: 400,
        },
        {
          category_id: 2,
          category_name: "Driver's License",
          application_count: 300,
        },
      ],
    },
  };

  const isLoading = false;

  useEffect(() => {
    document.title = "Overview - Admin Dashboard";
  }, []);

  const stats = getStats(statisticsData?.data);
  const categories = getCategoryData(statisticsData?.data);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="rounded-2xl border border-white/60 bg-white p-6 shadow-sm ring-1 ring-black/5"
          >
            <div
              className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.accent}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Applications by Category
            </h2>
            <p className="text-sm text-slate-500">
              Distribution of applications across document categories
            </p>
          </div>
          {/* <Button
            variant="outline"
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            View all
          </Button> */}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="rounded-2xl border border-slate-100 bg-linear-to-br from-white to-slate-50 p-6 transition hover:border-[#0f6b47]/30 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-slate-500">Category</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {category.name}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      ID: {category.id}
                    </p>
                  </div>
                  <StatusBadge status={category.status} />
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Applications</p>
                    <p className="mt-1 text-3xl font-bold text-[#0f6b47]">
                      {category.count}
                    </p>
                  </div>
                  {/* <Button
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-slate-100"
                    size="sm"
                  >
                    View
                  </Button> */}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-slate-100 bg-[#f9fafb] p-8 text-center">
              <p className="text-sm text-slate-500">No categories available</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Overview;
