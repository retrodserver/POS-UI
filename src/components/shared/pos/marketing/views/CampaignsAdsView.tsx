import { useState } from "react";
import {
  Megaphone,
  Plus,
  Play,
  Pause,
  TrendingUp,
  Eye,
  MousePointer,
  Sparkles,
  ExternalLink,
  Calendar,
  DollarSign,
  Tag,
  CheckCircle2,
} from "lucide-react";
import type { MarketingCampaign } from "@/types/posMarketing";

type CampaignsAdsViewProps = {
  campaigns: MarketingCampaign[];
  onToggleCampaignStatus: (id: string) => void;
  onOpenCreateModal: () => void;
};

export function CampaignsAdsView({
  campaigns,
  onToggleCampaignStatus,
  onOpenCreateModal,
}: CampaignsAdsViewProps) {
  const [filterChannel, setFilterChannel] = useState<string>("All");

  const channels = ["All", "meta_ads", "google_local", "whatsapp", "in_store_display"];

  const filteredCampaigns =
    filterChannel === "All" ? campaigns : campaigns.filter((c) => c.channel === filterChannel);

  const getChannelBadge = (ch: string) => {
    switch (ch) {
      case "meta_ads":
        return { label: "Meta (Insta & FB)", bg: "bg-blue-50 text-blue-800 border-blue-200" };
      case "google_local":
        return {
          label: "Google Local Maps",
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        };
      case "whatsapp":
        return { label: "WhatsApp Broadcast", bg: "bg-green-50 text-green-800 border-green-200" };
      case "in_store_display":
        return { label: "In-Store Smart TV", bg: "bg-purple-50 text-purple-800 border-purple-200" };
      default:
        return { label: "SMS Blast", bg: "bg-slate-50 text-slate-800 border-slate-200" };
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter and Overview Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {channels.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilterChannel(c)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                filterChannel === c
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {c === "All"
                ? "All Channels"
                : c === "meta_ads"
                  ? "Meta Ads"
                  : c === "google_local"
                    ? "Google Local"
                    : c === "whatsapp"
                      ? "WhatsApp"
                      : "In-Store TV"}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-900">{filteredCampaigns.length}</strong> active &
          scheduled campaigns
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCampaigns.map((camp) => {
          const chBadge = getChannelBadge(camp.channel);
          const percentSpent = camp.budget > 0 ? Math.round((camp.spent / camp.budget) * 100) : 0;
          const isActive = camp.status === "Active";

          return (
            <div
              key={camp.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${chBadge.bg}`}
                  >
                    {chBadge.label}
                  </span>

                  <button
                    type="button"
                    onClick={() => onToggleCampaignStatus(camp.id)}
                    className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                      isActive
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Pause className="h-3 w-3" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" />
                        <span>Paused</span>
                      </>
                    )}
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">{camp.name}</h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  <span>
                    {camp.startDate} - {camp.endDate}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {camp.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Performance Metrics Box */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                {/* Budget & Spend Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">
                      Spent:{" "}
                      <strong className="text-slate-800">₹{camp.spent.toLocaleString()}</strong>
                    </span>
                    <span className="text-slate-500">
                      Budget:{" "}
                      <strong className="text-slate-800">₹{camp.budget.toLocaleString()}</strong>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all duration-300"
                      style={{ width: `${percentSpent}%` }}
                    />
                  </div>
                </div>

                {/* 3 Metric Tiles: Reach, Clicks, Revenue */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-2 text-center text-xs">
                  <div>
                    <span className="text-[10.5px] text-slate-500 block">Impressions</span>
                    <strong className="font-bold text-slate-900">
                      {(camp.reach / 1000).toFixed(1)}k
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-500 block">Conversions</span>
                    <strong className="font-bold text-slate-900">{camp.conversions}</strong>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-500 block">Attributed Rev.</span>
                    <strong className="font-bold text-emerald-700">
                      ₹{(camp.revenueGenerated / 1000).toFixed(0)}k
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
