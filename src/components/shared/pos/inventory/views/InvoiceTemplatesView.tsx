import { useState } from "react";
import { CheckCircle2, Check, Eye, Printer, Download } from "lucide-react";
import { toast } from "sonner";

export function InvoiceTemplatesView() {
  const [activeTab, setActiveTab] = useState<"purchase" | "po" | "sales" | "transfer">("purchase");
  const [selectedTemplate, setSelectedTemplate] = useState("standard");

  const tabs = [
    { id: "purchase", label: "Purchase" },
    { id: "po", label: "Purchase Order" },
    { id: "sales", label: "Sales" },
    { id: "transfer", label: "Transfer" },
  ] as const;

  const templates = [
    { id: "standard", label: "Standard Template", isDefault: true },
    { id: "template_1", label: "Template 1", isDefault: false },
    { id: "template_2", label: "Template 2", isDefault: false },
    { id: "template_3", label: "Template 3", isDefault: false },
    { id: "template_4", label: "Template 4", isDefault: false },
    { id: "template_5", label: "Template 5", isDefault: false },
  ];

  const handleSelect = (id: string, name: string) => {
    setSelectedTemplate(id);
    toast.success(`${name} selected as active invoice template for ${activeTab.toUpperCase()}.`);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Bar matching Screenshot 5 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Invoice Management</h2>
      </div>

      {/* 2. Top Tabs matching Screenshot 5 */}
      <div className="flex border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 text-[13px] font-semibold transition cursor-pointer ${
              activeTab === tab.id
                ? "border-b-2 border-cyan-500 text-cyan-700 font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Invoice Templates Gallery matching Screenshot 5 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-2">
        {templates.map((tpl) => {
          const isSelected = selectedTemplate === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => handleSelect(tpl.id, tpl.label)}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Card preview representation */}
              <div
                className={`relative w-full aspect-2/3 rounded-2xl border bg-white p-3 shadow-2xs transition duration-200 flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? "border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/10"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                {/* Active Checkmark badge top-right */}
                {isSelected && (
                  <div className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                )}

                {/* Simulated Invoice Document Skeleton */}
                <div className="space-y-2 opacity-80 pointer-events-none select-none">
                  {/* Header */}
                  <div className="border-b border-slate-100 pb-2 space-y-1">
                    <div className="h-2 w-16 bg-slate-300 rounded-sm" />
                    <div className="h-1.5 w-24 bg-slate-200 rounded-sm" />
                    <div className="h-1.5 w-20 bg-slate-100 rounded-sm" />
                  </div>

                  {/* Customer / Vendor info */}
                  <div className="grid grid-cols-2 gap-1 py-1">
                    <div className="h-1.5 w-12 bg-slate-200 rounded-sm" />
                    <div className="h-1.5 w-12 bg-slate-200 rounded-sm ml-auto" />
                  </div>

                  {/* Table header */}
                  <div className="h-2 w-full bg-slate-100 rounded-xs" />

                  {/* Table rows */}
                  <div className="space-y-1 py-1">
                    <div className="flex justify-between">
                      <div className="h-1.5 w-14 bg-slate-200 rounded-xs" />
                      <div className="h-1.5 w-6 bg-slate-200 rounded-xs" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-1.5 w-16 bg-slate-100 rounded-xs" />
                      <div className="h-1.5 w-6 bg-slate-100 rounded-xs" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-1.5 w-12 bg-slate-100 rounded-xs" />
                      <div className="h-1.5 w-6 bg-slate-100 rounded-xs" />
                    </div>
                  </div>

                  {/* Total summary block */}
                  <div className="border-t border-slate-100 pt-2 space-y-1">
                    <div className="flex justify-between">
                      <div className="h-1.5 w-8 bg-slate-200 rounded-xs" />
                      <div className="h-1.5 w-8 bg-slate-300 rounded-xs" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-2 w-10 bg-slate-300 rounded-xs font-bold" />
                      <div className="h-2 w-10 bg-slate-400 rounded-xs" />
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="text-[10px] text-center font-bold text-slate-400 group-hover:text-teal-600 transition">
                  Click to choose
                </div>
              </div>

              {/* Title & Selected Label below */}
              <div className="text-center mt-2.5">
                <div className="text-[12.5px] font-semibold text-slate-800">{tpl.label}</div>
                {isSelected && (
                  <div className="text-[11.5px] font-bold text-emerald-600 mt-0.5">
                    Selected
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
