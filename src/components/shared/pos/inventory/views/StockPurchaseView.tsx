import { useState } from "react";
import {
  Plus,
  QrCode,
  Download,
  Search,
  Filter,
  Trash2,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  X,
} from "lucide-react";
import {
  useStockPurchases,
  useInventoryVendors,
  useDeletePurchase,
} from "@/hooks/queries/usePosInventory";
import { CreatePurchaseModal } from "../modals/CreatePurchaseModal";
import { toast } from "sonner";

export function StockPurchaseView() {
  const { data: purchases } = useStockPurchases();
  const { data: vendors } = useInventoryVendors();
  const deleteMutation = useDeletePurchase();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [startDate, setStartDate] = useState("2026-08-26");
  const [endDate, setEndDate] = useState("2026-09-02");
  const [vendorFilter, setVendorFilter] = useState("All");
  const [invoiceFilter, setInvoiceFilter] = useState("");

  const filteredPurchases = (purchases ?? []).filter((p) => {
    if (vendorFilter !== "All" && p.vendorName !== vendorFilter) return false;
    if (invoiceFilter && !p.invoiceNo.toLowerCase().includes(invoiceFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleClear = () => {
    setVendorFilter("All");
    setInvoiceFilter("");
    toast.info("Filters cleared");
  };

  return (
    <div className="space-y-4">
      {/* 1. Header & Actions matching Screenshot 1 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Purchase List</h2>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create New
          </button>

          <button
            type="button"
            onClick={() => toast.info("Barcode scanner activated for invoices")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <QrCode className="h-4 w-4 text-slate-500" />
            Scan & Purchase
          </button>

          <button
            type="button"
            onClick={() => toast.success("Exporting purchase ledger...")}
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => toast.info("Table column preferences")}
            className="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Columns view"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Filter Bar matching Screenshot 1 */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-36">
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="w-36">
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="min-w-[160px]">
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">
              From
            </label>
            <select
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none cursor-pointer"
            >
              <option value="All">All</option>
              {vendors?.map((v) => (
                <option key={v.id} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>

          <div className="min-w-[150px]">
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">
              Invoice No.
            </label>
            <input
              type="text"
              placeholder="Search invoice..."
              value={invoiceFilter}
              onChange={(e) => setInvoiceFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => toast.info("Advanced purchase filters")}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            More Filters
          </button>

          <button
            type="button"
            onClick={() => toast.info(`Found ${filteredPurchases.length} purchases`)}
            className="rounded-lg border border-teal-600 bg-white px-5 py-1.5 text-[12.5px] font-semibold text-teal-600 hover:bg-teal-50 transition cursor-pointer"
          >
            Search
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* 3. Empty State or Purchases Data Table from Screenshot 1 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs min-h-[380px] flex flex-col justify-center">
        {filteredPurchases.length === 0 ? (
          /* Empty State Illustration exactly matching Screenshot 1 */
          <div className="text-center py-12">
            <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center">
              <div className="h-14 w-12 rounded-lg border-2 border-slate-300 bg-slate-50 p-2 shadow-2xs">
                <div className="h-1 w-full rounded bg-slate-200 mb-1.5" />
                <div className="h-1 w-3/4 rounded bg-slate-200 mb-1.5" />
                <div className="h-1 w-1/2 rounded bg-slate-200" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-slate-200">
                <Search className="h-4 w-4 text-slate-500" />
              </div>
            </div>
            <h4 className="text-[15px] font-semibold text-slate-800">No Purchase Found</h4>
            <p className="text-[12.5px] text-slate-400 mt-1">
              Start by recording incoming inventory stock or supplier bills.
            </p>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-teal-700 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create Stock Purchase
            </button>
          </div>
        ) : (
          /* Purchases Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Invoice No</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Invoice Date</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Tax</th>
                  <th className="px-4 py-3">Total Amount</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPurchases.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-bold text-slate-900 font-mono">{item.invoiceNo}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{item.vendorName}</td>
                    <td className="px-4 py-3 text-slate-600">{item.invoiceDate}</td>
                    <td className="px-4 py-3 text-slate-600">{item.itemCount} SKUs</td>
                    <td className="px-4 py-3 font-mono text-slate-600">₹{item.taxAmount}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      ₹{item.totalAmount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          item.paymentStatus === "Paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400">
                        <button
                          type="button"
                          onClick={() => toast.info(`Viewing details of ${item.invoiceNo}`)}
                          className="p-1 hover:text-teal-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteMutation.mutate(item.id);
                            toast.success(`Deleted purchase ${item.invoiceNo}`);
                          }}
                          className="p-1 hover:text-red-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreatePurchaseModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
