import { useState } from "react";
import {
  Send,
  MessageSquare,
  CheckCheck,
  Smartphone,
  Sparkles,
  Users,
  Clock,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import type { WhatsAppTemplate, WhatsAppBroadcastRecord } from "@/types/posMarketing";

type WhatsAppBroadcastViewProps = {
  templates: WhatsAppTemplate[];
  broadcastHistory: WhatsAppBroadcastRecord[];
  onOpenSendModal: (template?: WhatsAppTemplate) => void;
};

export function WhatsAppBroadcastView({
  templates,
  broadcastHistory,
  onOpenSendModal,
}: WhatsAppBroadcastViewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate>(templates[0]);

  return (
    <div className="space-y-5">
      {/* Workspace Grid: Templates List (Left) + Phone Simulator Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Template Cards (7 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              <span>Approved Meta WhatsApp Templates ({templates.length})</span>
            </h3>
            <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Meta Cloud API Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.map((tmpl) => {
              const isSelected = selectedTemplate.id === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between shadow-2xs ${
                    isSelected
                      ? "bg-emerald-50/40 border-emerald-500 ring-2 ring-emerald-500/50"
                      : "bg-white border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <span className="text-[10.5px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                        {tmpl.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {tmpl.lastUsed ? `Used ${tmpl.lastUsed}` : "New"}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900">{tmpl.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-3 mt-1 leading-relaxed">
                      {tmpl.bodyText.replace("{{customer_name}}", "Vikram")}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10.5px] text-slate-500 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {tmpl.targetAudience}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenSendModal(tmpl);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-2xs transition cursor-pointer"
                    >
                      <Send className="h-3 w-3" />
                      <span>Broadcast</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Smartphone Mockup (5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 flex justify-center">
          <div className="w-full max-w-[320px] bg-slate-900 rounded-3xl p-3 shadow-xl border-4 border-slate-800 flex flex-col">
            {/* Phone Top Notch */}
            <div className="flex items-center justify-between px-3 py-1 text-[10px] text-slate-400">
              <span>04:30</span>
              <div className="h-3.5 w-16 bg-slate-800 rounded-full mx-auto" />
              <span>5G · 100%</span>
            </div>

            {/* WhatsApp App Header */}
            <div className="bg-[#075E54] text-white p-2.5 rounded-t-2xl flex items-center gap-2 mt-1">
              <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center text-teal-900 font-bold text-xs">
                R
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs truncate">Retrod Restaurant & Bar</div>
                <div className="text-[9.5px] text-emerald-200">Verified Official Business</div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="bg-[#EFEAE2] flex-1 p-3 rounded-b-2xl min-h-[340px] flex flex-col justify-end space-y-2">
              {/* WhatsApp Message Bubble */}
              <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-xs text-xs space-y-2 text-slate-800">
                <p className="leading-relaxed text-[11.5px]">
                  {selectedTemplate.bodyText
                    .replace("{{customer_name}}", "Vikram")
                    .replace("{{favorite_dish}}", "Butter Chicken")}
                </p>

                <div className="flex items-center justify-end gap-1 text-[9.5px] text-slate-400">
                  <span>04:30 PM</span>
                  <CheckCheck className="h-3 w-3 text-blue-500" />
                </div>
              </div>

              {/* Action Button inside WhatsApp */}
              {selectedTemplate.ctaText && (
                <div className="bg-white rounded-xl shadow-xs text-center py-2 text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  <span>{selectedTemplate.ctaText}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Delivery History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h4 className="font-bold text-xs text-slate-900">
            Recent Broadcast Dispatches & Open Rates
          </h4>
          <span className="text-[11px] text-slate-500">Live Webhook Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-600 font-semibold">
                <th className="p-3">Campaign</th>
                <th className="p-3">Audience Segment</th>
                <th className="p-3">Sent Count</th>
                <th className="p-3">Delivered</th>
                <th className="p-3">Read Rate</th>
                <th className="p-3">Replies</th>
                <th className="p-3">Sent Time</th>
              </tr>
            </thead>
            <tbody>
              {broadcastHistory.map((bc) => {
                const readPercent = Math.round((bc.readCount / bc.deliveredCount) * 100);
                return (
                  <tr key={bc.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">{bc.campaignTitle}</td>
                    <td className="p-3 text-slate-600">{bc.audienceName}</td>
                    <td className="p-3 font-mono">{bc.recipientCount}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCheck className="h-3 w-3" />
                        {bc.deliveredCount}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-600 rounded-full"
                            style={{ width: `${readPercent}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800">{readPercent}%</span>
                      </div>
                    </td>
                    <td className="p-3 font-bold text-teal-800">{bc.repliedCount}</td>
                    <td className="p-3 text-slate-500">{bc.sentAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
