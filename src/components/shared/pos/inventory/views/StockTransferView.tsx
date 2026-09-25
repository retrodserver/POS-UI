import { useState, useMemo } from "react";
import { Plus, Search, ArrowLeftRight, Calendar, CheckCircle2, Clock } from "lucide-react";
import {
  DataTableHeader,
  type DataTableColumn,
} from "@/components/common/DataTableHeader";
import { toast } from "sonner";

export function StockTransferView() {
  const [search, setSearch] = useState("");

  const transfers = [
    {
      id: "TR-2026-081",
      date: "02 Sep 2026",
      from: "Central Store",
      to: "Bar Section",
      items: "Sprite (24), Soda (48), Lime (5kg)",
      status: "Completed",
      by: "Rajesh S.",
    },
    {
      id: "TR-2026-080",
      date: "01 Sep 2026",
      from: "Cold Storage",
      to: "Main Kitchen",
      items: "Chicken Breast (15kg), Paneer (10kg)",
      status: "Completed",
      by: "Chef Vikram",
    },
    {
      id: "TR-2026-079",
      date: "01 Sep 2026",
      from: "Dry Store",
      to: "Pastry Bakery",
      items: "Refined Flour (25kg), Butter (10kg)",
      status: "Completed",
      by: "Sunita M.",
    },
    {
      id: "TR-2026-078",
      date: "31 Aug 2026",
      from: "Central Store",
      to: "Banquet Bar",
      items: "Whiskey, Rum, Tonic Waters",
      status: "In Transit",
      by: "Karan D.",
    },
  ];

  const transferColumns: DataTableColumn<any>[] = useMemo(
    () => [
      {
        id: "id",
        label: "Transfer Voucher",
        sortable: true,
        filterable: true,
        defaultWidth: 150,
        getValue: (r) => r.id,
      },
      {
        id: "date",
        label: "Date",
        sortable: true,
        defaultWidth: 120,
        getValue: (r) => r.date,
      },
      {
        id: "from",
        label: "Source Location",
        sortable: true,
        filterable: true,
        defaultWidth: 160,
        getValue: (r) => r.from,
      },
      {
        id: "to",
        label: "Destination",
        sortable: true,
        filterable: true,
        defaultWidth: 160,
        getValue: (r) => r.to,
      },
      {
        id: "items",
        label: "Items Transferred",
        sortable: false,
        defaultWidth: 240,
        getValue: (r) => r.items,
      },
      {
        id: "by",
        label: "Created By",
        sortable: true,
        filterable: true,
        defaultWidth: 130,
        getValue: (r) => r.by,
      },
      {
        id: "status",
        label: "Status",
        sortable: true,
        filterable: true,
        align: "center",
        defaultWidth: 120,
        getValue: (r) => r.status,
      },
    ],
    [],
  );

  const filtered = transfers.filter(
    (t) =>
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.from.toLowerCase().includes(search.toLowerCase()) ||
      t.to.toLowerCase().includes(search.toLowerCase()) ||
      t.items.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Stock Transfer</h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Internal material requisition and transfers between kitchen outlets, bars, and stores.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.success("Opening New Stock Transfer modal...")}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create Stock Transfer
        </button>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search transfer id, location, items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>
          <span className="text-[12px] text-slate-500">{filtered.length} transfer vouchers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <DataTableHeader
              columns={transferColumns}
              data={filtered}
              themeVariant="primary"
            />
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-4 py-3 font-mono font-bold text-teal-600">{t.id}</td>
                  <td className="px-4 py-3 text-slate-600 text-[12.5px]">{t.date}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{t.from}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{t.to}</td>
                  <td className="px-4 py-3 text-slate-600 text-[12.5px] max-w-xs truncate">
                    {t.items}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-[12px]">{t.by}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        t.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {t.status === "Completed" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

