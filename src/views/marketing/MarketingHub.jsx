import { useState } from "react";
import { Image as ImageIcon, BellRing } from "lucide-react";
import { cn } from "@/lib/utils";
import BannersList from "./banners/BannersList";
import PopupsList from "./popups/PopupsList";

const MarketingHub = () => {
  const [activeTab, setActiveTab] = useState("banners");

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Marketing CMS
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage promotional hero banners and announcement popup modals
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("banners")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                activeTab === "banners"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <ImageIcon className="h-3.5 w-3.5 text-emerald-600" />
              <span>Hero Banners</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("popups")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                activeTab === "popups"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <BellRing className="h-3.5 w-3.5 text-purple-600" />
              <span>Announcement Popups</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        {activeTab === "banners" && <BannersList />}
        {activeTab === "popups" && <PopupsList />}
      </div>
    </div>
  );
};

export default MarketingHub;
