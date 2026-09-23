import { useState } from "react";
import {
  Star,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Send,
  ThumbsUp,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import type { CustomerReview } from "@/types/posMarketing";
import { toast } from "sonner";

type ReputationReviewsViewProps = {
  reviews: CustomerReview[];
  onReplyToReview: (id: string, replyText: string) => void;
};

export function ReputationReviewsView({ reviews, onReplyToReview }: ReputationReviewsViewProps) {
  const [selectedReviewForAi, setSelectedReviewForAi] = useState<CustomerReview | null>(null);
  const [replyText, setReplyText] = useState("");
  const [aiTone, setAiTone] = useState<"warm" | "concierge" | "apology">("warm");

  const handleOpenAiReplyModal = (rev: CustomerReview) => {
    setSelectedReviewForAi(rev);
    setReplyText(rev.aiSuggestedReply);
  };

  const handleChangeTone = (tone: "warm" | "concierge" | "apology") => {
    setAiTone(tone);
    if (!selectedReviewForAi) return;

    if (tone === "warm") {
      setReplyText(
        `Dear ${selectedReviewForAi.customerName}, thank you so much for your wonderful review! We're thrilled that you enjoyed dining at Retrod and loved our dishes. Looking forward to welcoming you back soon!`,
      );
    } else if (tone === "concierge") {
      setReplyText(
        `Greetings ${selectedReviewForAi.customerName}. We appreciate you taking the time to share your feedback with us. Our culinary team strives to deliver exemplary dining experiences, and we are delighted we met your expectations.`,
      );
    } else {
      setReplyText(
        `Dear ${selectedReviewForAi.customerName}, thank you for your candid feedback. We apologize for any shortcomings experienced during your visit. Please reach out to our General Manager at gm@retrodpos.com so we can host you for a flawless meal.`,
      );
    }
  };

  const handleSendReply = () => {
    if (!selectedReviewForAi || !replyText.trim()) return;
    onReplyToReview(selectedReviewForAi.id, replyText);
    toast.success(
      `Published reply to ${selectedReviewForAi.customerName}'s review on ${selectedReviewForAi.platform}`,
    );
    setSelectedReviewForAi(null);
  };

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case "google":
        return { label: "Google Maps", bg: "bg-blue-50 text-blue-800 border-blue-200" };
      case "zomato":
        return { label: "Zomato Dining", bg: "bg-rose-50 text-rose-800 border-rose-200" };
      default:
        return { label: "TripAdvisor", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" };
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Review Sentiment & Platforms Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Aggregate Rating */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center text-amber-900">
            <span className="text-2xl font-black">4.8</span>
            <div className="flex items-center text-amber-500">
              <Star className="h-3 w-3 fill-amber-400" />
              <Star className="h-3 w-3 fill-amber-400" />
              <Star className="h-3 w-3 fill-amber-400" />
              <Star className="h-3 w-3 fill-amber-400" />
              <Star className="h-3 w-3 fill-amber-400" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Aggregate Rating</h4>
            <p className="text-xs text-slate-500 mt-0.5">Based on 1,240 verified guest reviews</p>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-1">
              <ThumbsUp className="h-3 w-3" />
              <span>96% Positive Sentiment</span>
            </div>
          </div>
        </div>

        {/* Platform Scores */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
          <h4 className="text-xs font-bold text-slate-900">Connected Review Channels</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Google Maps Reviews:</span>
              <span className="font-bold text-slate-900">4.8 ★ (820 rev)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Zomato Gold Dining:</span>
              <span className="font-bold text-slate-900">4.7 ★ (310 rev)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">TripAdvisor Travelers:</span>
              <span className="font-bold text-slate-900">4.9 ★ (110 rev)</span>
            </div>
          </div>
        </div>

        {/* AI Responder Banner */}
        <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Review Auto-Assistant</span>
            </div>
            <p className="text-[11.5px] text-slate-300 mt-1 leading-relaxed">
              Generate polite, customized replies in 1-click tailored to dish compliments &
              feedback.
            </p>
          </div>
          <div className="text-[11px] text-teal-200 font-medium">3 Pending Responses</div>
        </div>
      </div>

      {/* 2. Review Cards Feed */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Recent Guest Feedback Feed</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => {
            const badge = getPlatformBadge(rev.platform);
            const isReplied = rev.replyStatus === "Replied";

            return (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{rev.customerName}</span>
                        <span
                          className={`text-[10.5px] font-bold px-2 py-0.2 rounded-full border ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-400">· {rev.reviewDate}</span>
                      </div>
                    </div>

                    {/* Sentiment tag */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rev.sentiment === "Positive"
                          ? "bg-emerald-50 text-emerald-800"
                          : rev.sentiment === "Neutral"
                            ? "bg-slate-100 text-slate-800"
                            : "bg-rose-50 text-rose-800"
                      }`}
                    >
                      {rev.sentiment}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-slate-700 mt-2.5 leading-relaxed">"{rev.comment}"</p>

                  {rev.dishMentioned && (
                    <div className="text-[10.5px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded mt-2 inline-block font-semibold">
                      Dish Mentioned: {rev.dishMentioned}
                    </div>
                  )}
                </div>

                {/* Reply section */}
                <div className="pt-3 border-t border-slate-100">
                  {isReplied && rev.replyText ? (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                      <div className="font-bold text-[11px] text-slate-800 flex items-center gap-1 mb-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Manager Reply:</span>
                      </div>
                      <p className="text-slate-600 text-[11.5px] leading-relaxed">
                        {rev.replyText}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 bg-teal-50/70 p-2 rounded-xl border border-teal-200">
                      <div className="text-[11px] text-teal-900 font-medium">
                        AI suggestion ready for review
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenAiReplyModal(rev)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>Review & Reply</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Reply Modal */}
      {selectedReviewForAi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-teal-300" />
                <h3 className="text-sm font-bold">AI Review Responder Assistant</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReviewForAi(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800">
                  {selectedReviewForAi.customerName} ({selectedReviewForAi.rating} ★):
                </span>
                <p className="text-slate-600 mt-1">"{selectedReviewForAi.comment}"</p>
              </div>

              {/* Tone Switcher */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Choose Reply Tone:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleChangeTone("warm")}
                    className={`py-1 px-2 rounded-lg font-bold border transition cursor-pointer ${
                      aiTone === "warm"
                        ? "bg-teal-700 text-white border-teal-700"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Warm & Grateful
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChangeTone("concierge")}
                    className={`py-1 px-2 rounded-lg font-bold border transition cursor-pointer ${
                      aiTone === "concierge"
                        ? "bg-teal-700 text-white border-teal-700"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Professional
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChangeTone("apology")}
                    className={`py-1 px-2 rounded-lg font-bold border transition cursor-pointer ${
                      aiTone === "apology"
                        ? "bg-teal-700 text-white border-teal-700"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Apologetic
                  </button>
                </div>
              </div>

              {/* Editable Text Area */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Response Text:</label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1.5 focus:ring-teal-600"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedReviewForAi(null)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendReply}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold cursor-pointer shadow-xs"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Publish Response</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
