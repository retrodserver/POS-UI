import { useState } from "react";
import { toast } from "sonner";
import { X, Check, Megaphone, Send, TicketPercent, Plus } from "lucide-react";
import type {
  MarketingTabKey,
  MarketingCampaign,
  WhatsAppTemplate,
  WhatsAppBroadcastRecord,
  PromoVoucher,
  CustomerReview,
  CustomerSegment,
} from "@/types/posMarketing";
import {
  MOCK_CAMPAIGNS,
  MOCK_WHATSAPP_TEMPLATES,
  MOCK_BROADCAST_HISTORY,
  MOCK_LOYALTY_TIERS,
  MOCK_PROMO_VOUCHERS,
  MOCK_REVIEWS,
  MOCK_SEGMENTS,
} from "./mockMarketingData";
import { MarketingHeader } from "./MarketingHeader";
import { CampaignsAdsView } from "./views/CampaignsAdsView";
import { WhatsAppBroadcastView } from "./views/WhatsAppBroadcastView";
import { LoyaltyCouponsView } from "./views/LoyaltyCouponsView";
import { ReputationReviewsView } from "./views/ReputationReviewsView";
import { CustomerSegmentsView } from "./views/CustomerSegmentsView";

export function PosMarketingManager() {
  const [activeTab, setActiveTab] = useState<MarketingTabKey>("campaigns");

  // State
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(MOCK_CAMPAIGNS);
  const [templates] = useState<WhatsAppTemplate[]>(MOCK_WHATSAPP_TEMPLATES);
  const [broadcastHistory, setBroadcastHistory] =
    useState<WhatsAppBroadcastRecord[]>(MOCK_BROADCAST_HISTORY);
  const [loyaltyTiers] = useState(MOCK_LOYALTY_TIERS);
  const [promoVouchers, setPromoVouchers] = useState<PromoVoucher[]>(MOCK_PROMO_VOUCHERS);
  const [reviews, setReviews] = useState<CustomerReview[]>(MOCK_REVIEWS);
  const [segments] = useState<CustomerSegment[]>(MOCK_SEGMENTS);

  // Modals state
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [isSendWhatsAppModalOpen, setIsSendWhatsAppModalOpen] = useState(false);
  const [selectedTemplateForBroadcast, setSelectedTemplateForBroadcast] =
    useState<WhatsAppTemplate | null>(null);
  const [isNewPromoModalOpen, setIsNewPromoModalOpen] = useState(false);

  // New Campaign Form state
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignChannel, setNewCampaignChannel] =
    useState<MarketingCampaign["channel"]>("meta_ads");
  const [newCampaignBudget, setNewCampaignBudget] = useState(10000);

  // New Promo Form state
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoTitle, setNewPromoTitle] = useState("");
  const [newPromoDiscountValue, setNewPromoDiscountValue] = useState(15);
  const [newPromoMinOrder, setNewPromoMinOrder] = useState(1000);

  // Handlers
  const handleToggleCampaignStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === "Active" ? "Paused" : "Active" } : c,
      ),
    );
    toast.success("Updated campaign status");
  };

  const handleCreateCampaign = () => {
    if (!newCampaignName.trim()) return;
    const newCamp: MarketingCampaign = {
      id: `cmp-${Date.now()}`,
      name: newCampaignName,
      channel: newCampaignChannel,
      objective: "Dine-In Bookings",
      status: "Active",
      budget: newCampaignBudget,
      spent: 0,
      reach: 12000,
      clicks: 450,
      conversions: 24,
      revenueGenerated: 18000,
      startDate: "Today",
      endDate: "30 Sep 2026",
      tags: ["New", "Growth"],
    };
    setCampaigns((prev) => [newCamp, ...prev]);
    setIsNewCampaignModalOpen(false);
    setNewCampaignName("");
    toast.success(`Created campaign: ${newCamp.name}`);
  };

  const handleSendWhatsAppBroadcast = () => {
    const tmpl = selectedTemplateForBroadcast || templates[0];
    const newRecord: WhatsAppBroadcastRecord = {
      id: `bc-${Date.now()}`,
      campaignTitle: tmpl.title,
      templateName: tmpl.title,
      audienceName: tmpl.targetAudience,
      recipientCount: 420,
      deliveredCount: 418,
      readCount: 340,
      repliedCount: 52,
      sentAt: "Just now",
      status: "Delivered",
    };
    setBroadcastHistory((prev) => [newRecord, ...prev]);
    setIsSendWhatsAppModalOpen(false);
    toast.success(`Broadcast successfully sent to 420 recipients via WhatsApp Cloud API`);
  };

  const handleCreatePromo = () => {
    if (!newPromoCode.trim() || !newPromoTitle.trim()) return;
    const newVoucher: PromoVoucher = {
      id: `vch-${Date.now()}`,
      code: newPromoCode.toUpperCase().trim(),
      title: newPromoTitle,
      discountType: "percentage",
      discountValue: newPromoDiscountValue,
      minOrderValue: newPromoMinOrder,
      maxDiscount: 500,
      validUntil: "31 Dec 2026",
      totalIssued: 500,
      totalRedeemed: 0,
      status: "Active",
    };
    setPromoVouchers((prev) => [newVoucher, ...prev]);
    setIsNewPromoModalOpen(false);
    setNewPromoCode("");
    setNewPromoTitle("");
    toast.success(`Created promo code ${newVoucher.code}`);
  };

  const handleReplyToReview = (id: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, replyStatus: "Replied", replyText } : r)),
    );
  };

  return (
    <div className="space-y-4 min-h-[calc(100vh-5.5rem)] pb-6">
      {/* 1. Header & Navigation */}
      <MarketingHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewCampaignModal={() => setIsNewCampaignModalOpen(true)}
        onOpenSendWhatsAppModal={() => {
          setSelectedTemplateForBroadcast(templates[0]);
          setIsSendWhatsAppModalOpen(true);
        }}
        onOpenNewPromoModal={() => setIsNewPromoModalOpen(true)}
      />

      {/* 2. Active Tab Content */}
      <div className="pt-2">
        {activeTab === "campaigns" && (
          <CampaignsAdsView
            campaigns={campaigns}
            onToggleCampaignStatus={handleToggleCampaignStatus}
            onOpenCreateModal={() => setIsNewCampaignModalOpen(true)}
          />
        )}

        {activeTab === "whatsapp" && (
          <WhatsAppBroadcastView
            templates={templates}
            broadcastHistory={broadcastHistory}
            onOpenSendModal={(tmpl) => {
              setSelectedTemplateForBroadcast(tmpl || templates[0]);
              setIsSendWhatsAppModalOpen(true);
            }}
          />
        )}

        {activeTab === "loyalty" && (
          <LoyaltyCouponsView
            loyaltyTiers={loyaltyTiers}
            promoVouchers={promoVouchers}
            onOpenNewVoucherModal={() => setIsNewPromoModalOpen(true)}
          />
        )}

        {activeTab === "reviews" && (
          <ReputationReviewsView reviews={reviews} onReplyToReview={handleReplyToReview} />
        )}

        {activeTab === "segments" && (
          <CustomerSegmentsView
            segments={segments}
            onTriggerSegmentCampaign={(seg) => {
              setSelectedTemplateForBroadcast(templates[0]);
              setIsSendWhatsAppModalOpen(true);
            }}
          />
        )}
      </div>

      {/* --- Modals --- */}

      {/* 1. Create Campaign Modal */}
      {isNewCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Create Marketing Campaign</h3>
              <button
                type="button"
                onClick={() => setIsNewCampaignModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Campaign Name</label>
                <input
                  type="text"
                  placeholder="e.g. Weekend Biryani Festival Meta Ads..."
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Ad Channel</label>
                <select
                  value={newCampaignChannel}
                  onChange={(e) =>
                    setNewCampaignChannel(e.target.value as MarketingCampaign["channel"])
                  }
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="meta_ads">Meta Ads (Instagram & Facebook)</option>
                  <option value="google_local">Google Local Search & Maps</option>
                  <option value="whatsapp">WhatsApp Cloud Broadcast</option>
                  <option value="in_store_display">In-Store Smart TV Displays</option>
                  <option value="sms">SMS Text Blast</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Budget (₹)</label>
                <input
                  type="number"
                  value={newCampaignBudget}
                  onChange={(e) => setNewCampaignBudget(Number(e.target.value))}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsNewCampaignModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCampaign}
                disabled={!newCampaignName.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition disabled:opacity-40 cursor-pointer shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Launch Campaign</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Send WhatsApp Broadcast Modal */}
      {isSendWhatsAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-200 bg-emerald-50 text-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-emerald-700" />
                <h3 className="text-sm font-bold">Dispatch WhatsApp Broadcast</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSendWhatsAppModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-900">
                  Template: {selectedTemplateForBroadcast?.title || templates[0].title}
                </span>
                <p className="text-slate-700 leading-relaxed">
                  "{selectedTemplateForBroadcast?.bodyText || templates[0].bodyText}"
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Target Audience Segment
                </label>
                <select className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white">
                  <option>Platinum VIP Diners (380 contacts)</option>
                  <option>Gold & Silver Diners (1,100 contacts)</option>
                  <option>Weekend Diners (520 contacts)</option>
                  <option>30-Day Lapsed Guests (410 contacts)</option>
                  <option>All Registered Guests (1,480 contacts)</option>
                </select>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11.5px] text-slate-600">
                Estimated Delivery: <strong className="text-slate-900">98.5%</strong> · Est. Cost:{" "}
                <strong className="text-emerald-700">₹0.38 / msg (Official WhatsApp API)</strong>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsSendWhatsAppModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendWhatsAppBroadcast}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send Broadcast Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Create Promo Code Modal */}
      {isNewPromoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Create New Promo Voucher</h3>
              <button
                type="button"
                onClick={() => setIsNewPromoModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Promo Code (Uppercase)
                </label>
                <input
                  type="text"
                  placeholder="e.g. MONSOON25"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                  className="w-full text-xs font-mono font-bold p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-600 uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Offer Title</label>
                <input
                  type="text"
                  placeholder="e.g. 15% Off on Monsoon Dining"
                  value={newPromoTitle}
                  onChange={(e) => setNewPromoTitle(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Discount %</label>
                  <input
                    type="number"
                    value={newPromoDiscountValue}
                    onChange={(e) => setNewPromoDiscountValue(Number(e.target.value))}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Min. Bill (₹)</label>
                  <input
                    type="number"
                    value={newPromoMinOrder}
                    onChange={(e) => setNewPromoMinOrder(Number(e.target.value))}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsNewPromoModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreatePromo}
                disabled={!newPromoCode.trim() || !newPromoTitle.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition disabled:opacity-40 cursor-pointer shadow-xs"
              >
                <TicketPercent className="h-3.5 w-3.5" />
                <span>Save Promo Code</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
