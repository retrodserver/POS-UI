import {
  Megaphone,
  Plus,
  Send,
  Sparkles,
  CheckCircle2,
  Share2,
  TicketPercent,
  TrendingUp,
  MessageSquare,
  Award,
  Star,
} from "lucide-react";
import type { MarketingTabKey } from "@/types/posMarketing";

type MarketingHeaderProps = {
  activeTab: MarketingTabKey;
  setActiveTab: (tab: MarketingTabKey) => void;
  onOpenNewCampaignModal: () => void;
  onOpenSendWhatsAppModal: () => void;
  onOpenNewPromoModal: () => void;
};

export function MarketingHeader({
  activeTab,
  setActiveTab,
  onOpenNewCampaignModal,
  onOpenSendWhatsAppModal,
  onOpenNewPromoModal,
}: MarketingHeaderProps) {
  const tabs: { id: MarketingTabKey; label: string; hint: string; icon: React.ElementType }[] = [
    { id: "campaigns", label: "Campaigns & Ads", hint: "§5.1", icon: Megaphone },
    { id: "whatsapp", label: "WhatsApp & SMS", hint: "§5.2", icon: Send },
    { id: "loyalty", label: "Loyalty & Coupons", hint: "§5.3", icon: TicketPercent },
    { id: "reviews", label: "Reputation & Reviews", hint: "§5.4", icon: Star },
    { id: "segments", label: "Customer Segments", hint: "§5.5", icon: TrendingUp },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Main Title & Channel Health Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/70">
              SRS §5 Marketing Suite
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Automations Live
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-950 tracking-tight mt-1">
            Marketing Automation & Customer Growth
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Drive weekend footfall, retain VIP diners, automate WhatsApp campaigns and manage
            reviews.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenSendWhatsAppModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewPromoModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            <TicketPercent className="h-3.5 w-3.5" />
            <span>New Promo Code</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewCampaignModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500">Active Campaigns</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-lg font-bold text-slate-900">4 Active</span>
            <span className="text-[10.5px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
              Meta & Google
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500">WhatsApp Broadcasts</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-lg font-bold text-slate-900">34.2K</span>
            <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              98% Deliv.
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500">Loyalty Club Members</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-lg font-bold text-slate-900">1,480</span>
            <span className="text-[10.5px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
              220 VIPs
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500">Reputation Rating</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-lg font-bold text-slate-900 flex items-center gap-1">
              4.8 <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
            </span>
            <span className="text-[10.5px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
              1,240 Rev.
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500">Direct Attributed Rev.</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-lg font-bold text-emerald-800">₹3.84L</span>
            <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              4.2x ROI
            </span>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs Rail */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
                isActive
                  ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-slate-500"}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isActive ? "bg-teal-800/80 text-teal-100" : "bg-slate-100 text-slate-500"
                }`}
              >
                {tab.hint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
