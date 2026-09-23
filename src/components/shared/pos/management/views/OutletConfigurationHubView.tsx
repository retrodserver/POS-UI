import { useState } from "react";
import {
  Building2,
  PhoneCall,
  Clock,
  CreditCard,
  FileSpreadsheet,
  LayoutGrid,
  Monitor,
  Image,
  Calculator,
  Share2,
  Printer,
  Users,
  Copy,
  Search,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

export function OutletConfigurationHubView() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopyConfig = () => {
    toast.success("Outlet configuration copied to clipboard!");
  };

  const outletInfoCards = [
    {
      title: "Outlet Details",
      desc: "Configure email id, address, Logo of an Outlet.",
      icon: Building2,
      bgColor: "bg-teal-50 text-teal-700 border border-teal-200",
      to: "/pos/management/configuration/outlet",
    },
    {
      title: "Contact Details",
      desc: "Configure contact details of your's and your staff details to reach by Petpooja team.",
      icon: PhoneCall,
      bgColor: "bg-teal-50 text-teal-700 border border-teal-200",
      to: "/pos/management/configuration/outlet",
    },
    {
      title: "Outlet Timings",
      desc: "Configure Closing hours, lunch & dinner timings, timing information to display on various places.",
      icon: Clock,
      bgColor: "bg-teal-50 text-teal-700 border border-teal-200",
      to: "/pos/management/configuration/outlet",
    },
    {
      title: "Payment",
      desc: "Configure Currency and Payment Types available.",
      icon: CreditCard,
      bgColor: "bg-teal-50 text-teal-700 border border-teal-200",
      to: "/pos/management/configuration/outlet",
    },
    {
      title: "Invoice Sequence",
      desc: "Configure multiple invoice sequence",
      icon: FileSpreadsheet,
      bgColor: "bg-teal-50 text-teal-700 border border-teal-200",
      to: "/pos/management/configuration/outlet",
    },
    {
      title: "Floor Plan",
      desc: "create your own floor plan using tables",
      icon: LayoutGrid,
      bgColor: "bg-teal-50 text-teal-700 border border-teal-200",
      to: "/pos/management/configuration/floor-plan",
    },
  ];

  const billingScreenCards = [
    {
      title: "Display",
      desc: "Configure the billing screen display, look & values.",
      icon: Monitor,
      bgColor: "bg-teal-50 text-teal-700 border border-teal-200",
      to: "/pos/management/configuration/outlet",
    },
    {
      title: "Set Your Print Logo",
      desc: "Logo to print at your desktop point of sale.",
      icon: Image,
      bgColor: "bg-teal-50 text-teal-700 border border-teal-200",
      to: "/pos/management/configuration/outlet",
    },
    {
      title: "Calculations",
      desc: "Configure how invoice gets calculate.",
      icon: Calculator,
      bgColor: "bg-teal-50 text-teal-700 border border-teal-200",
      to: "/pos/management/configuration/outlet",
    },
    {
      title: "Connected Services",
      desc: "Configure how different services gets connects.",
      icon: Share2,
      bgColor: "bg-teal-50 text-teal-700 border border-teal-200",
      to: "/pos/management/configuration/outlet",
    },
    {
      title: "Print",
      desc: "Configure the print settings of the Bill and KOT.",
      icon: Printer,
      bgColor: "bg-teal-50 text-teal-700 border border-teal-200",
      to: "/pos/management/configuration/outlet",
    },
    {
      title: "Customer",
      desc: "Configure the billing screen and It's component.",
      icon: Users,
      bgColor: "bg-teal-50 text-teal-700 border border-teal-200",
      to: "/pos/management/configuration/outlet",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Bar matching Screenshot 1 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
            Outlet Configuration
          </h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Below are the configuration to manage your outlet information.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-700 border border-slate-200">
            • Restaurant: ID - <span className="font-mono font-bold text-teal-700">330067</span>
          </div>

          <div className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-700 border border-slate-200">
            • Desktop Version : <span className="font-mono font-bold text-teal-700">126.0.1</span>
          </div>

          <button
            type="button"
            onClick={handleCopyConfig}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            <Copy className="h-3.5 w-3.5 text-slate-500" />
            Copy Config
          </button>

          <button
            type="button"
            onClick={() => toast.info("Search configuration modules")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            Search <Search className="h-3.5 w-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* 2. Group 1: Outlet Information matching Screenshot 1 */}
      <div className="space-y-3">
        <h3 className="text-[14.5px] font-bold text-slate-900">Outlet Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {outletInfoCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.to}
                className="rounded-2xl border border-slate-300 bg-white p-5 shadow-xs hover:shadow-sm hover:border-teal-400 transition flex items-start gap-4 cursor-pointer group"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.bgColor}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-[14px] font-bold text-slate-900 group-hover:text-teal-700 transition">
                    {card.title}
                  </h4>
                  <p className="text-[12px] text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Group 2: Billing Screen matching Screenshot 1 */}
      <div className="space-y-3">
        <h3 className="text-[14.5px] font-bold text-slate-900">Billing Screen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {billingScreenCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.to}
                className="rounded-2xl border border-slate-300 bg-white p-5 shadow-xs hover:shadow-sm hover:border-teal-400 transition flex items-start gap-4 cursor-pointer group"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.bgColor}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-[14px] font-bold text-slate-900 group-hover:text-teal-700 transition">
                    {card.title}
                  </h4>
                  <p className="text-[12px] text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
