import { useState } from "react";
import { Users, TrendingUp, Sparkles, Zap, ArrowRight, Filter, CheckCircle2 } from "lucide-react";
import type { CustomerSegment } from "@/types/posMarketing";
import { toast } from "sonner";

type CustomerSegmentsViewProps = {
  segments: CustomerSegment[];
  onTriggerSegmentCampaign: (segment: CustomerSegment) => void;
};

export function CustomerSegmentsView({
  segments,
  onTriggerSegmentCampaign,
}: CustomerSegmentsViewProps) {
  return (
    <div className="space-y-4">
      {/* Intro Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-teal-700" />
            <span>AI Dynamic Customer Cohorts & Automated Triggers</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Segments update automatically every midnight based on POS order history, recency &
            spend.
          </p>
        </div>

        <span className="text-xs font-bold text-teal-900 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
          4 Smart Workflows Active
        </span>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {segments.map((seg) => (
          <div
            key={seg.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between hover:border-teal-400 transition"
          >
            <div>
              {/* Card Top */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="font-bold text-sm text-slate-900">{seg.name}</span>
                <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {seg.growthRate}
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">{seg.description}</p>

              {/* Criteria tag */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 mt-3 text-xs space-y-1">
                <div className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                  Rule Criteria:
                </div>
                <div className="font-mono text-slate-800 font-semibold text-[11px]">
                  {seg.criteria}
                </div>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center text-xs">
                <div>
                  <span className="text-[10.5px] text-slate-500 block">Members</span>
                  <strong className="font-bold text-slate-900">{seg.memberCount}</strong>
                </div>
                <div>
                  <span className="text-[10.5px] text-slate-500 block">Avg. Ticket</span>
                  <strong className="font-bold text-teal-800">
                    ₹{seg.avgSpend.toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span className="text-[10.5px] text-slate-500 block">Visit Frequency</span>
                  <strong className="font-bold text-slate-800">{seg.frequency}</strong>
                </div>
              </div>
            </div>

            {/* Automated Workflow Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 bg-teal-50/50 -mx-4 -mb-4 p-3 rounded-b-2xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-teal-950 font-medium">
                <Zap className="h-3.5 w-3.5 text-teal-700 shrink-0" />
                <span className="truncate">{seg.automatedFlow}</span>
              </div>

              <button
                type="button"
                onClick={() => onTriggerSegmentCampaign(seg)}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold transition shadow-2xs cursor-pointer active:scale-95"
              >
                <span>Launch Blast</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
