import { useState } from "react";
import { Bell, Clock, Plus, CheckCircle2, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export function ReportNotificationView() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("23:30");

  const handleSave = () => {
    toast.success("Report notifications preferences saved successfully!");
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
            Report Notification
          </h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Configure automated daily sales & closing summaries sent directly via Email and
            WhatsApp.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
        >
          Save Settings
        </button>
      </div>

      <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-xs space-y-6">
        <div className="space-y-4">
          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-slate-900">
                  Automated Daily Day-End Email Summary
                </div>
                <div className="text-[12px] text-slate-500">
                  Send high-level sales revenue, payment modes, and expense breakdown to store
                  owners at day close.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
            />
          </label>

          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-slate-900">
                  WhatsApp Business Summary Broadcast
                </div>
                <div className="text-[12px] text-slate-500">
                  Instant message notification sent to registered management numbers after cashier
                  settlement.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={whatsappAlerts}
              onChange={(e) => setWhatsappAlerts(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
            />
          </label>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-2 max-w-xs">
          <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-700">
            <Clock className="h-4 w-4 text-slate-400" />
            <span>Daily Scheduled Trigger Time</span>
          </div>
          <input
            type="time"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
