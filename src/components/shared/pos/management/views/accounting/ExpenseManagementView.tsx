import { useState } from "react";
import {
  Plus,
  Download,
  ChevronDown,
  Search,
  ArrowUpDown,
  TrendingDown,
  Edit2,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

interface MasterItem {
  id: string;
  title: string;
  status: boolean;
  createdDate: string;
}

interface ListingItem {
  id: string;
  title: string;
  totalReported: number;
}

export function ExpenseManagementView() {
  const [activeTab, setActiveTab] = useState<
    | "expense_listing"
    | "expense_master"
    | "withdrawal_listing"
    | "withdrawal_master"
    | "cash_topup_listing"
    | "cash_topup_master"
  >("expense_listing");

  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-09-02");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const tabs = [
    { id: "expense_listing", label: "Expense Listing" },
    { id: "expense_master", label: "Expense Master" },
    { id: "withdrawal_listing", label: "Withdrawal Listing" },
    { id: "withdrawal_master", label: "Withdrawal Master" },
    { id: "cash_topup_listing", label: "Cash Top-Up Listing" },
    { id: "cash_topup_master", label: "Cash Top-Up Master" },
  ] as const;

  // 1. Expense Listing Data
  const expenseListing: ListingItem[] = [
    { id: "1", title: "Advance Salary", totalReported: 0.0 },
    { id: "2", title: "Advertisement", totalReported: 0.0 },
    { id: "3", title: "Delivery Boy", totalReported: 0.0 },
    { id: "4", title: "Electricity", totalReported: 0.0 },
    { id: "5", title: "Gas", totalReported: 0.0 },
    { id: "6", title: "Groceries", totalReported: 0.0 },
    { id: "7", title: "Internet", totalReported: 0.0 },
    { id: "8", title: "Maintenance", totalReported: 0.0 },
    { id: "9", title: "Milk", totalReported: 0.0 },
    { id: "10", title: "Packaging", totalReported: 0.0 },
    { id: "11", title: "Stationery", totalReported: 0.0 },
    { id: "12", title: "Repairs & Plumbing", totalReported: 0.0 },
    { id: "13", title: "Staff Food", totalReported: 0.0 },
    { id: "14", title: "Cleaning Supplies", totalReported: 0.0 },
    { id: "15", title: "Diesel for Generator", totalReported: 0.0 },
  ];

  // 2. Expense Master Data (Screenshot 1)
  const [expenseMaster, setExpenseMaster] = useState<MasterItem[]>([
    { id: "em-1", title: "Petty Cash Settlement", status: true, createdDate: "24 May 2024" },
    { id: "em-2", title: "Other", status: true, createdDate: "24 May 2024" },
    { id: "em-3", title: "Advertisement", status: true, createdDate: "24 May 2024" },
    { id: "em-4", title: "Maintenance", status: true, createdDate: "24 May 2024" },
    { id: "em-5", title: "Water", status: true, createdDate: "24 May 2024" },
    { id: "em-6", title: "Internet", status: true, createdDate: "24 May 2024" },
    { id: "em-7", title: "Rent", status: true, createdDate: "24 May 2024" },
    { id: "em-8", title: "Gas", status: true, createdDate: "24 May 2024" },
  ]);

  // 3. Withdrawal Listing Data (Screenshot 2)
  const withdrawalListing: ListingItem[] = [
    { id: "w-1", title: "Cheque Given", totalReported: 0.0 },
    { id: "w-2", title: "In Bank", totalReported: 0.0 },
    { id: "w-3", title: "To Owner", totalReported: 0.0 },
    { id: "w-4", title: "To Supplier", totalReported: 0.0 },
  ];

  // 4. Withdrawal Master Data (Screenshot 3)
  const [withdrawalMaster, setWithdrawalMaster] = useState<MasterItem[]>([
    { id: "wm-1", title: "To Supplier", status: true, createdDate: "24 May 2024" },
    { id: "wm-2", title: "To Owner", status: true, createdDate: "24 May 2024" },
    { id: "wm-3", title: "Cheque Given", status: true, createdDate: "24 May 2024" },
    { id: "wm-4", title: "In Bank", status: true, createdDate: "24 May 2024" },
  ]);

  // 5. Cash Top-Up Listing Data (Screenshot 4)
  const cashTopupListing: ListingItem[] = [
    { id: "ct-1", title: "From Manager", totalReported: 0.0 },
    { id: "ct-2", title: "From Owner", totalReported: 0.0 },
  ];

  // 6. Cash Top-Up Master Data (Screenshot 5)
  const [cashTopupMaster, setCashTopupMaster] = useState<MasterItem[]>([
    { id: "ctm-1", title: "From Manager", status: true, createdDate: "24 May 2024" },
    { id: "ctm-2", title: "From Owner", status: true, createdDate: "24 May 2024" },
  ]);

  const toggleSelectAll = (totalCount: number, allIds: string[]) => {
    if (selectedIds.length === totalCount) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allIds);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Compute page header title based on active section
  const pageTitle =
    activeTab === "expense_listing" || activeTab === "expense_master"
      ? "Expense Management"
      : activeTab === "withdrawal_listing" || activeTab === "withdrawal_master"
      ? "Withdrawal Management"
      : "Cash Top-Up Management";

  return (
    <div className="space-y-4">
      {/* 1. Header Bar with dynamic titles and actions matching Screenshots 1-5 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">{pageTitle}</h2>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Actions for Listing tabs */}
          {(activeTab === "expense_listing" ||
            activeTab === "withdrawal_listing" ||
            activeTab === "cash_topup_listing") && (
            <div className="rounded-full bg-slate-100 px-3.5 py-1 text-[12px] font-semibold text-slate-700 border border-slate-200">
              • Grand Total : <span className="font-mono font-bold text-slate-900">₹ 0.00</span>
            </div>
          )}

          {activeTab === "expense_listing" && (
            <>
              <button
                type="button"
                onClick={() => toast.info("Top 10 Expenses")}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
              >
                <TrendingDown className="h-3.5 w-3.5 text-teal-600" />
                Top 10 Expenses <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => toast.info("Add Expense Modal")}
                className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Expense
              </button>
            </>
          )}

          {activeTab === "expense_master" && (
            <>
              <button
                type="button"
                onClick={() => toast.info("Add Expense Master Modal")}
                className="rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
              >
                Add Expense Master
              </button>
              <button
                type="button"
                onClick={() => toast.info("Import Expense Master")}
                className="rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
              >
                Import Expense Master
              </button>
              <button
                type="button"
                onClick={() => toast.info("Expense Master Actions")}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
              >
                Action <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
            </>
          )}

          {activeTab === "withdrawal_listing" && (
            <>
              <button
                type="button"
                onClick={() => toast.info("Top 10 Withdrawal")}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
              >
                <TrendingDown className="h-3.5 w-3.5 text-teal-600" />
                Top 10 Withdrawal <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => toast.info("Add Withdrawal Modal")}
                className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Withdrawal
              </button>
            </>
          )}

          {activeTab === "withdrawal_master" && (
            <>
              <button
                type="button"
                onClick={() => toast.info("Add Withdrawal Master Modal")}
                className="rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
              >
                Add Withdrawal Master
              </button>
              <button
                type="button"
                onClick={() => toast.info("Import Withdrawal Master")}
                className="rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
              >
                Import Withdrawal Master
              </button>
              <button
                type="button"
                onClick={() => toast.info("Withdrawal Master Actions")}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
              >
                Action <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
            </>
          )}

          {activeTab === "cash_topup_listing" && (
            <button
              type="button"
              onClick={() => toast.info("Add Cash Top-Up Modal")}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Add Cash Top-Up
            </button>
          )}

          {activeTab === "cash_topup_master" && (
            <>
              <button
                type="button"
                onClick={() => toast.info("Add Cash Top-Up Master Modal")}
                className="rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
              >
                Add Cash Top-Up Master
              </button>
              <button
                type="button"
                onClick={() => toast.info("Import Cash Top-Up Master")}
                className="rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
              >
                Import Cash Top-Up Master
              </button>
              <button
                type="button"
                onClick={() => toast.info("Cash Top-Up Master Actions")}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
              >
                Action <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => toast.success("Exporting report to Excel...")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export Excel <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Tab Navigation Bar */}
      <div className="border-b border-slate-200 flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedIds([]);
            }}
            className={`px-4 py-2.5 text-[13px] font-medium transition cursor-pointer border-b-2 ${
              activeTab === tab.id
                ? "border-teal-600 text-teal-600 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Filter Bar for Listing Tabs */}
      {(activeTab === "expense_listing" ||
        activeTab === "withdrawal_listing" ||
        activeTab === "cash_topup_listing") && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex flex-wrap items-end gap-3 max-w-4xl">
            <div className="space-y-1">
              <label className="text-[11.5px] font-semibold text-slate-600">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11.5px] font-semibold text-slate-600">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              />
            </div>

            <div className="space-y-1 flex-1 min-w-[200px]">
              <label className="text-[11.5px] font-semibold text-slate-600">Title</label>
              <input
                type="text"
                placeholder="Search category title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toast.info("Filtered records")}
                className="rounded-lg border border-teal-500 bg-white px-5 py-1.5 text-[12.5px] font-semibold text-teal-600 shadow-2xs hover:bg-teal-50 transition cursor-pointer"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  toast.info("Showing all records");
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
              >
                Show All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Special Chart for Cash Top-Up Listing (Screenshot 4) */}
      {activeTab === "cash_topup_listing" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h4 className="text-[13.5px] font-bold text-slate-900">Top 10 Cash Top-Up</h4>
          <div className="h-44 flex flex-col justify-between pt-4 pb-2 px-6">
            <div className="flex-1 relative flex items-center justify-around border-b border-slate-200">
              <div className="flex flex-col items-center">
                <div className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] shadow-sm text-center mb-1">
                  <div className="text-slate-500 font-medium">From Owner</div>
                  <div className="font-bold text-slate-800">• : 0</div>
                </div>
                <div className="h-2 w-2 rounded-full bg-teal-600" />
              </div>
              <div className="flex flex-col items-center opacity-60">
                <div className="text-[11px] font-bold text-slate-500 mb-1">0</div>
                <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              </div>
            </div>
            <div className="flex justify-around text-[11px] font-medium text-slate-600 pt-2">
              <span>From Owner</span>
              <span>From Manager</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Table Rendering for Listing Tabs (Expense Listing, Withdrawal Listing, Cash Top-Up Listing) */}
      {(activeTab === "expense_listing" ||
        activeTab === "withdrawal_listing" ||
        activeTab === "cash_topup_listing") && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11.5px] font-semibold text-slate-600">
                  <th className="px-5 py-3.5 flex items-center gap-1 cursor-pointer">
                    <span>Title</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </th>
                  <th className="px-5 py-3.5">
                    {activeTab === "expense_listing"
                      ? "Total Expense Reported (₹)"
                      : activeTab === "withdrawal_listing"
                      ? "Total Withdrawal Reported (₹)"
                      : "Total Cash Top-Up Reported (₹)"}
                  </th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(activeTab === "expense_listing"
                  ? expenseListing
                  : activeTab === "withdrawal_listing"
                  ? withdrawalListing
                  : cashTopupListing
                )
                  .filter((item) =>
                    item.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-5 py-3.5 font-medium text-slate-800">{item.title}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-700">
                        {item.totalReported.toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => toast.info(`Viewing entries for ${item.title}`)}
                          className="text-[12px] font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-3.5 bg-slate-50/50 flex items-center justify-between text-[12px] text-slate-500">
            <div>
              Showing 1 to{" "}
              {activeTab === "expense_listing"
                ? expenseListing.length
                : activeTab === "withdrawal_listing"
                ? withdrawalListing.length
                : cashTopupListing.length}{" "}
              records
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="h-7 w-7 rounded-md border border-teal-500 bg-teal-50 text-teal-600 font-bold flex items-center justify-center cursor-pointer"
              >
                1
              </button>
              {activeTab === "expense_listing" && (
                <>
                  <button
                    type="button"
                    className="h-7 w-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center cursor-pointer"
                  >
                    2
                  </button>
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center cursor-pointer"
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center cursor-pointer"
                  >
                    Last
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Table Rendering for Master Tabs (Expense Master, Withdrawal Master, Cash Top-Up Master - Screenshots 1, 3, 5) */}
      {(activeTab === "expense_master" ||
        activeTab === "withdrawal_master" ||
        activeTab === "cash_topup_master") && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11.5px] font-semibold text-slate-600">
                  <th className="w-10 px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length ===
                        (activeTab === "expense_master"
                          ? expenseMaster.length
                          : activeTab === "withdrawal_master"
                          ? withdrawalMaster.length
                          : cashTopupMaster.length)
                      }
                      onChange={() => {
                        const itemsList =
                          activeTab === "expense_master"
                            ? expenseMaster
                            : activeTab === "withdrawal_master"
                            ? withdrawalMaster
                            : cashTopupMaster;
                        toggleSelectAll(
                          itemsList.length,
                          itemsList.map((i) => i.id)
                        );
                      }}
                      className="rounded border-slate-300 cursor-pointer"
                    />
                  </th>
                  <th className="px-5 py-3.5 font-semibold text-slate-700">Title</th>
                  <th className="px-5 py-3.5 font-semibold text-slate-700 text-center">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-slate-700">Created Date</th>
                  <th className="px-5 py-3.5 text-right font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(activeTab === "expense_master"
                  ? expenseMaster
                  : activeTab === "withdrawal_master"
                  ? withdrawalMaster
                  : cashTopupMaster
                ).map((mItem) => (
                  <tr key={mItem.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(mItem.id)}
                        onChange={() => toggleSelect(mItem.id)}
                        className="rounded border-slate-300 cursor-pointer"
                      />
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{mItem.title}</td>
                    <td className="px-5 py-3.5 text-center">
                      {/* Blue Toggle Switch matching Screenshot 1, 3, 5 */}
                      <button
                        type="button"
                        onClick={() => {
                          const updateFn = (list: MasterItem[]) =>
                            list.map((it) =>
                              it.id === mItem.id ? { ...it, status: !it.status } : it
                            );
                          if (activeTab === "expense_master") setExpenseMaster(updateFn);
                          else if (activeTab === "withdrawal_master") setWithdrawalMaster(updateFn);
                          else setCashTopupMaster(updateFn);
                          toast.success(`Updated status for ${mItem.title}`);
                        }}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          mItem.status ? "bg-teal-600" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            mItem.status ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[12px] text-slate-500">
                      {mItem.createdDate}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => toast.info(`Editing ${mItem.title}`)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer"
                        title="Edit Master"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-3.5 bg-slate-50/50 flex items-center justify-between text-[12px] text-slate-500">
            <div>
              Showing 1 to{" "}
              {activeTab === "expense_master"
                ? expenseMaster.length
                : activeTab === "withdrawal_master"
                ? withdrawalMaster.length
                : cashTopupMaster.length}{" "}
              records
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="h-7 w-7 rounded-md border border-teal-500 bg-teal-50 text-teal-600 font-bold flex items-center justify-center cursor-pointer"
              >
                1
              </button>
              {activeTab === "expense_master" && (
                <>
                  <button
                    type="button"
                    className="h-7 w-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center cursor-pointer"
                  >
                    2
                  </button>
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center cursor-pointer"
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center cursor-pointer"
                  >
                    Last
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
