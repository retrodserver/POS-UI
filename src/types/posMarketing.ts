export type MarketingTabKey = "campaigns" | "whatsapp" | "loyalty" | "reviews" | "segments";

export type MarketingChannel =
  | "meta_ads"
  | "google_local"
  | "whatsapp"
  | "sms"
  | "in_store_display";

export type MarketingCampaign = {
  id: string;
  name: string;
  channel: MarketingChannel;
  objective:
    | "Brand Awareness"
    | "Weekend Footfall"
    | "Dine-In Bookings"
    | "Online Orders"
    | "Menu Launch";
  status: "Active" | "Scheduled" | "Paused" | "Completed";
  budget: number;
  spent: number;
  reach: number;
  clicks: number;
  conversions: number;
  revenueGenerated: number;
  startDate: string;
  endDate: string;
  tags: string[];
};

export type WhatsAppTemplate = {
  id: string;
  title: string;
  category: "Marketing" | "Utility" | "Special Offer" | "Festival";
  bodyText: string;
  ctaText?: string;
  ctaType?: "url" | "quick_reply" | "phone";
  targetAudience: string;
  approvedStatus: "Approved" | "In Review";
  lastUsed?: string;
};

export type WhatsAppBroadcastRecord = {
  id: string;
  campaignTitle: string;
  templateName: string;
  audienceName: string;
  recipientCount: number;
  deliveredCount: number;
  readCount: number;
  repliedCount: number;
  sentAt: string;
  status: "Delivered" | "Sending" | "Scheduled";
};

export type LoyaltyTier = {
  id: string;
  name: "Silver" | "Gold" | "Platinum VIP";
  minPoints: number;
  earnMultiplier: string; // e.g. "1.5x Points"
  benefits: string[];
  memberCount: number;
  color: string;
  badgeBg: string;
};

export type PromoVoucher = {
  id: string;
  code: string;
  title: string;
  discountType: "percentage" | "flat_amount";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validUntil: string;
  totalIssued: number;
  totalRedeemed: number;
  status: "Active" | "Expired" | "Draft";
};

export type CustomerReview = {
  id: string;
  platform: "google" | "zomato" | "tripadvisor";
  customerName: string;
  rating: number; // 1 - 5
  reviewDate: string;
  comment: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  dishMentioned?: string;
  replyStatus: "Replied" | "Pending";
  replyText?: string;
  aiSuggestedReply: string;
};

export type CustomerSegment = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  avgSpend: number;
  frequency: string;
  criteria: string;
  automatedFlow: string;
  growthRate: string;
};
