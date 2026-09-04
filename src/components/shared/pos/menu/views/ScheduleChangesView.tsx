import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ScheduleItemsTab } from "./schedule/ScheduleItemsTab";
import { ScheduleCategoriesTab } from "./schedule/ScheduleCategoriesTab";
import { ScheduleVariantsTab } from "./schedule/ScheduleVariantsTab";
import { ScheduleAddonsTab } from "./schedule/ScheduleAddonsTab";
import { ScheduleTablesTab } from "./schedule/ScheduleTablesTab";
import { ScheduleTaxesTab } from "./schedule/ScheduleTaxesTab";
import { ScheduleDiscountsTab } from "./schedule/ScheduleDiscountsTab";

export function ScheduleChangesView() {
  const [activeSubTab, setActiveSubTab] = useState<
    "Items" | "Categories" | "Variants" | "Addons" | "Tables/Areas" | "Taxes" | "Discounts"
  >("Items");

  const subTabs = [
    { id: "Items", label: "Items" },
    { id: "Categories", label: "Categories" },
    { id: "Variants", label: "Variants" },
    { id: "Addons", label: "Addons" },
    { id: "Tables/Areas", label: "Tables/Areas" },
    { id: "Taxes", label: "Taxes" },
    { id: "Discounts", label: "Discounts" },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Top Petpooja Sub-Nav Bar across all 7 Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-white px-2 py-1 rounded-xl shadow-2xs">
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-lg transition cursor-pointer ${
                isActive
                  ? "bg-teal-50 text-teal-700 font-bold border border-teal-200/80 shadow-2xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
              }`}
            >
              <span>{tab.label}</span>
              {tab.id === "Items" && <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
            </button>
          );
        })}
      </div>

      {/* Dynamic Sub-tab Views */}
      {activeSubTab === "Items" && <ScheduleItemsTab />}
      {activeSubTab === "Categories" && <ScheduleCategoriesTab />}
      {activeSubTab === "Variants" && <ScheduleVariantsTab />}
      {activeSubTab === "Addons" && <ScheduleAddonsTab />}
      {activeSubTab === "Tables/Areas" && <ScheduleTablesTab />}
      {activeSubTab === "Taxes" && <ScheduleTaxesTab />}
      {activeSubTab === "Discounts" && <ScheduleDiscountsTab />}
    </div>
  );
}
