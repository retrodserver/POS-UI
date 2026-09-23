import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Store, Sliders, Receipt, Printer, Settings as SettingsIcon } from "lucide-react";
import { OutletsManagementView } from "@/components/shared/pos/settings/OutletsManagementView";
import { PosPanel } from "@/components/shared/pos/PosPanel";

export const Route = createFileRoute("/pos/settings")({
  head: () => ({ meta: [{ title: "Settings — Retrod POS" }] }),
  component: PosSettingsPage,
});

function PosSettingsPage() {
  const [activeTab, setActiveTab] = useState<"outlets" | "system" | "billing" | "printers">(
    "outlets",
  );

  const tabs = [
    { id: "outlets" as const, label: "Outlets & Virtual Outlets", icon: Store },
    { id: "system" as const, label: "POS System Settings", icon: SettingsIcon },
    { id: "billing" as const, label: "Receipt & Invoice Setup", icon: Receipt },
    { id: "printers" as const, label: "Printers & Terminals", icon: Printer },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">
            Settings & Outlet Configuration
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Configure restaurant identity, virtual cloud kitchen brands, receipts, and terminal
            preferences.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-bold border-b-2 transition cursor-pointer shrink-0 ${
                isActive
                  ? "border-teal-600 text-teal-700 bg-teal-50/40 rounded-t-lg"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "outlets" && <OutletsManagementView />}

      {activeTab === "system" && (
        <div className="space-y-4">
          <PosPanel
            title="POS System & Terminal Preferences"
            hint="Terminal display mode, dark/light theme defaults, and auto-settlement."
          >
            <div className="p-4 space-y-4 text-[13px] text-slate-600">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <div className="font-bold text-slate-900">Auto Accept Online Orders</div>
                  <div className="text-[12px] text-slate-400">
                    Automatically accept inbound Swiggy and Zomato KOTs
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-teal-600 h-4 w-4" />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <div className="font-bold text-slate-900">Audio Chime on Inbound Order</div>
                  <div className="text-[12px] text-slate-400">
                    Play notification audio tone for new kitchen tickets
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-teal-600 h-4 w-4" />
              </div>
            </div>
          </PosPanel>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="space-y-4">
          <PosPanel
            title="Receipt & Invoice Template"
            hint="GST numbers, FSSAI license, footer thank you message, and QR payment codes."
          >
            <div className="p-4 space-y-3 text-[13px] text-slate-600">
              <p>
                Configure thermal printer receipt header, tax breakup format, and round-off logic.
              </p>
            </div>
          </PosPanel>
        </div>
      )}

      {activeTab === "printers" && (
        <div className="space-y-4">
          <PosPanel
            title="Hardware & KOT Printer Routing"
            hint="LAN thermal printers, USB kitchen receipt printers, and cash drawer triggers."
          >
            <div className="p-4 space-y-3 text-[13px] text-slate-600">
              <p>
                Manage Bar printer (192.168.1.201) and Kitchen printer (192.168.1.202) network maps.
              </p>
            </div>
          </PosPanel>
        </div>
      )}
    </div>
  );
}
