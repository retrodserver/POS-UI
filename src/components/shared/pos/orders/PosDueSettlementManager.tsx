import { useState, useMemo } from "react";
import {
  CreditCard,
  Search,
  ChevronDown,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Check,
  X,
  IndianRupee,
  Filter,
  DollarSign,
  ArrowRight,
  Receipt,
  Calendar,
} from "lucide-react";

interface DueBill {
  id: string;
  billNo: string;
  orderType: string;
  tableOrRoom: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  daysOverdue: number;
  status: "Pending" | "Partial" | "Settled";
  settlementMode?: "Cash" | "Card" | "UPI" | "Room Charge";
  agingBucket: "0-15" | "16-30" | "30+";
}

const MOCK_DUE_BILLS: DueBill[] = [
  {
    id: "due-1",
    billNo: "BILL-8901",
    orderType: "Room Service",
    tableOrRoom: "Room 302",
    customerName: "Siddharth Malhotra",
    customerPhone: "9876543210",
    totalAmount: 4850,
    paidAmount: 2000,
    dueAmount: 2850,
    dueDate: "28 Aug 2026",
    daysOverdue: 7,
    status: "Partial",
    agingBucket: "0-15",
  },
  {
    id: "due-2",
    billNo: "BILL-8904",
    orderType: "Dine In (Corporate)",
    tableOrRoom: "Table T-15",
    customerName: "Deloitte India Pvt Ltd",
    customerPhone: "9811223344",
    totalAmount: 14200,
    paidAmount: 0,
    dueAmount: 14200,
    dueDate: "15 Aug 2026",
    daysOverdue: 20,
    status: "Pending",
    agingBucket: "16-30",
  },
  {
    id: "due-3",
    billNo: "BILL-8910",
    orderType: "Takeaway Credit",
    tableOrRoom: "VIP Counter",
    customerName: "Vikram Singhania",
    customerPhone: "9988776655",
    totalAmount: 3200,
    paidAmount: 0,
    dueAmount: 3200,
    dueDate: "2 Aug 2026",
    daysOverdue: 33,
    status: "Pending",
    agingBucket: "30+",
  },
  {
    id: "due-4",
    billNo: "BILL-8915",
    orderType: "Room Service",
    tableOrRoom: "Room 408",
    customerName: "Meera Deshmukh",
    customerPhone: "9712345678",
    totalAmount: 1950,
    paidAmount: 1950,
    dueAmount: 0,
    dueDate: "1 Sep 2026",
    daysOverdue: 0,
    status: "Settled",
    settlementMode: "UPI",
    agingBucket: "0-15",
  },
  {
    id: "due-5",
    billNo: "BILL-8922",
    orderType: "Event Catering",
    tableOrRoom: "Banquet Hall A",
    customerName: "Infosys Bangalore",
    customerPhone: "9845012345",
    totalAmount: 45000,
    paidAmount: 25000,
    dueAmount: 20000,
    dueDate: "18 Aug 2026",
    daysOverdue: 17,
    status: "Partial",
    agingBucket: "16-30",
  },
];

export function PosDueSettlementManager() {
  const [agingFilter, setAgingFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRange, setSelectedRange] = useState("This Month");
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);

  // Settlement Modal State
  const [selectedBill, setSelectedBill] = useState<DueBill | null>(null);
  const [settlementMode, setSettlementMode] = useState<"Cash" | "Card" | "UPI" | "Room Charge">("UPI");
  const [settlementAmount, setSettlementAmount] = useState<string>("");

  const [records, setRecords] = useState<DueBill[]>(MOCK_DUE_BILLS);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const totalOpenDues = useMemo(() => {
    return records.reduce((acc, curr) => acc + (curr.status !== "Settled" ? curr.dueAmount : 0), 0);
  }, [records]);

  const totalSettledToday = useMemo(() => {
    return records.reduce((acc, curr) => acc + (curr.status === "Settled" ? curr.totalAmount : 0), 0);
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (agingFilter !== "all" && r.agingBucket !== agingFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNo = r.billNo.toLowerCase().includes(q);
        const matchCustomer = r.customerName.toLowerCase().includes(q);
        const matchRoom = r.tableOrRoom.toLowerCase().includes(q);
        const matchPhone = r.customerPhone.includes(q);
        if (!matchNo && !matchCustomer && !matchRoom && !matchPhone) return false;
      }

      return true;
    });
  }, [records, agingFilter, statusFilter, searchQuery]);

  const totalRecords = filteredRecords.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + pageSize);

  const handleOpenSettleModal = (bill: DueBill) => {
    setSelectedBill(bill);
    setSettlementAmount(bill.dueAmount.toString());
    setSettlementMode("UPI");
  };

  const handleConfirmSettlement = () => {
    if (!selectedBill) return;
    const settleAmt = parseFloat(settlementAmount) || 0;

    setRecords((prev) =>
      prev.map((b) => {
        if (b.id !== selectedBill.id) return b;
        const newPaid = b.paidAmount + settleAmt;
        const newDue = Math.max(0, b.totalAmount - newPaid);
        const newStatus: DueBill["status"] = newDue === 0 ? "Settled" : "Partial";

        return {
          ...b,
          paidAmount: newPaid,
          dueAmount: newDue,
          status: newStatus,
          settlementMode: newDue === 0 ? settlementMode : b.settlementMode,
        };
      })
    );

    setSelectedBill(null);
    setSettlementAmount("");
  };

  const handleExportCSV = () => {
    const headers = ["Bill No", "Order Type", "Table/Room", "Customer", "Phone", "Total Amount", "Paid Amount", "Due Amount", "Due Date", "Days Overdue", "Status"];
    const rows = filteredRecords.map((r) => [
      r.billNo,
      `"${r.orderType}"`,
      `"${r.tableOrRoom}"`,
      `"${r.customerName}"`,
      r.customerPhone,
      r.totalAmount,
      r.paidAmount,
      r.dueAmount,
      r.dueDate,
      r.daysOverdue,
      r.status,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Due_Settlement_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dateRanges = ["Today", "Yesterday", "This Week", "This Month", "Last 90 Days"];

  return (
    <div className="space-y-2.5 pb-8">
      {/* 1. TOP HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-slate-300 bg-white p-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-teal-50 border border-teal-300 text-teal-700">
            <CreditCard className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-bold text-slate-900 leading-tight">Due Payment Settlement</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.2 text-[10.5px] font-bold text-teal-800 border border-teal-300">
                Accounts Receivable
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Collect outstanding guest credit, corporate ledgers & room bills</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRangeDropdown(!showRangeDropdown)}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 text-[11.5px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
            >
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <span>{selectedRange}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showRangeDropdown && (
              <div className="absolute right-0 mt-1.5 w-48 rounded-lg border border-slate-300 bg-white p-1 shadow-lg z-30 animate-in fade-in">
                {dateRanges.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setSelectedRange(r);
                      setShowRangeDropdown(false);
                    }}
                    className={`flex w-full items-center rounded-md px-3 py-1.5 text-left text-[12px] transition cursor-pointer ${
                      selectedRange === r ? "bg-teal-50 text-teal-800 font-bold" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-teal-700" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. KPI METRICS (3 Cards in Slate+Teal) */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-300 bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Open Dues</span>
            <AlertCircle className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-0.5 text-[20px] font-black text-slate-900">
            ₹ {totalOpenDues.toLocaleString("en-IN")}.00
          </div>
          <div className="text-[10.5px] font-medium text-slate-500">
            {records.filter((r) => r.status !== "Settled").length} Outstanding Accounts
          </div>
        </div>

        <div className="rounded-xl border border-slate-300 bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Collected Today</span>
            <CheckCircle2 className="h-4 w-4 text-teal-700" />
          </div>
          <div className="mt-0.5 text-[20px] font-black text-teal-700">
            ₹ {totalSettledToday.toLocaleString("en-IN")}.00
          </div>
          <div className="text-[10.5px] font-medium text-teal-700">
            {records.filter((r) => r.status === "Settled").length} Bills Fully Cleared
          </div>
        </div>

        <div className="rounded-xl border border-slate-300 bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Credit Folios</span>
            <Receipt className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-0.5 text-[20px] font-black text-slate-900">
            {records.length} Bills Tracked
          </div>
          <div className="text-[10.5px] font-medium text-slate-500">
            Across Rooms & Dining Guests
          </div>
        </div>
      </div>

      {/* 3. AGING BUCKETS & FILTER BAR */}
      <div className="rounded-xl border border-slate-300 bg-white p-3 shadow-2xs space-y-2.5">
        {/* Aging Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11.5px] font-bold text-slate-700 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3 text-slate-500" /> Aging:
            </span>
            {[
              { key: "all", label: "All Dues" },
              { key: "0-15", label: "0-15 Days (Current)" },
              { key: "16-30", label: "16-30 Days" },
              { key: "30+", label: "30+ Days (Overdue)" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setAgingFilter(tab.key);
                  setCurrentPage(1);
                }}
                className={`rounded-lg px-3 py-1 text-[11.5px] font-bold transition cursor-pointer border ${
                  agingFilter === tab.key
                    ? "bg-teal-700 text-white border-teal-700 shadow-2xs"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-[12px] font-semibold text-slate-600">
            Showing <span className="font-bold text-slate-900">{totalRecords}</span> entries
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Bill #, Customer Name, Phone, or Room..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8.5 w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 text-[12px] font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-hidden shadow-2xs"
            />
          </div>

          <div className="relative min-w-[150px]">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8.5 w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 text-[12px] font-medium text-slate-700 focus:border-teal-500 focus:outline-hidden cursor-pointer shadow-2xs"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Settled">Settled</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {(searchQuery || statusFilter !== "all" || agingFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setAgingFilter("all");
                setCurrentPage(1);
              }}
              className="h-8.5 rounded-lg border border-slate-300 bg-slate-50 px-3 text-[11.5px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition shadow-2xs"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 4. STRUCTURED DUE SETTLEMENT TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-100/90 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                <th className="py-2.5 px-3">Bill & Location</th>
                <th className="py-2.5 px-3">Debtor / Customer</th>
                <th className="py-2.5 px-3 text-right">Total Bill</th>
                <th className="py-2.5 px-3 text-right">Paid Amount</th>
                <th className="py-2.5 px-3 text-right">Balance Due</th>
                <th className="py-2.5 px-3 text-center">Aging & Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No due payment records found matching filters.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50/70 transition">
                    {/* Bill & Location */}
                    <td className="py-3 px-3 align-top">
                      <div className="font-mono text-[13px] font-black text-slate-900">
                        {bill.billNo}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-700 mt-0.5">
                        {bill.tableOrRoom}
                      </div>
                      <div className="text-[10.5px] text-slate-400">
                        Due: {bill.dueDate}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-3 align-top">
                      <div className="font-bold text-slate-900 text-[12.5px]">
                        {bill.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Ph: {bill.customerPhone}
                      </div>
                      <div className="text-[10.5px] text-slate-500">
                        {bill.orderType}
                      </div>
                    </td>

                    {/* Total Bill */}
                    <td className="py-3 px-3 align-top text-right">
                      <div className="font-bold text-slate-900 text-[12.5px]">
                        ₹ {bill.totalAmount.toLocaleString("en-IN")}.00
                      </div>
                    </td>

                    {/* Paid */}
                    <td className="py-3 px-3 align-top text-right">
                      <div className="font-medium text-slate-600 text-[12px]">
                        ₹ {bill.paidAmount.toLocaleString("en-IN")}.00
                      </div>
                    </td>

                    {/* Balance Due */}
                    <td className="py-3 px-3 align-top text-right">
                      <div className="font-black text-[14px] text-teal-800">
                        ₹ {bill.dueAmount.toLocaleString("en-IN")}.00
                      </div>
                      {bill.status === "Settled" && bill.settlementMode && (
                        <div className="text-[10.5px] text-teal-700 font-semibold">
                          Via {bill.settlementMode}
                        </div>
                      )}
                    </td>

                    {/* Aging & Status */}
                    <td className="py-3 px-3 align-top text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-bold border ${
                            bill.status === "Settled"
                              ? "bg-slate-100 text-slate-700 border-slate-300"
                              : "bg-teal-50 text-teal-800 border-teal-300"
                          }`}
                        >
                          {bill.status}
                        </span>

                        <span className="text-[10.5px] font-semibold text-slate-500">
                          {bill.daysOverdue > 0 ? `${bill.daysOverdue}d overdue` : "Settled"}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 align-top text-right">
                      {bill.status !== "Settled" ? (
                        <button
                          type="button"
                          onClick={() => handleOpenSettleModal(bill)}
                          className="flex h-7.5 items-center gap-1.5 rounded-lg bg-teal-700 px-3 text-[11.5px] font-bold text-white hover:bg-teal-800 active:scale-98 transition cursor-pointer shadow-2xs ml-auto"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          <span>Settle Bill</span>
                        </button>
                      ) : (
                        <span className="inline-flex h-7.5 items-center gap-1 rounded-lg bg-slate-100 border border-slate-300 px-2.5 text-[11px] font-bold text-slate-600">
                          <Check className="h-3.5 w-3.5 text-teal-700" />
                          <span>Paid</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Snug Pagination Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-3 py-2 text-[11.5px] text-slate-600">
          <div>
            Showing <strong className="text-slate-800">{totalRecords > 0 ? startIndex + 1 : 0}</strong> to{" "}
            <strong className="text-slate-800">{Math.min(startIndex + pageSize, totalRecords)}</strong> of{" "}
            <strong className="text-slate-800">{totalRecords}</strong> entries
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={validPage <= 1}
              onClick={() => setCurrentPage(1)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              First
            </button>
            <button
              type="button"
              disabled={validPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              Prev
            </button>
            <span className="px-2 font-bold text-teal-800">
              Page {validPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={validPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              Next
            </button>
            <button
              type="button"
              disabled={validPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              Last
            </button>
          </div>
        </div>
      </div>

      {/* QUICK SETTLEMENT MODAL */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-xl bg-white p-4.5 shadow-2xl space-y-3 border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <h3 className="text-[15px] font-black text-slate-900">Settle Outstanding Due</h3>
                <p className="text-[11px] text-slate-500">{selectedBill.billNo} · {selectedBill.customerName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBill(null)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Bill Summary Strip */}
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-2.5 border border-slate-300 text-center">
              <div>
                <div className="text-[10.5px] font-bold text-slate-500 uppercase">Total Bill</div>
                <div className="text-[13px] font-bold text-slate-800 mt-0.5">₹{selectedBill.totalAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10.5px] font-bold text-slate-500 uppercase">Paid So Far</div>
                <div className="text-[13px] font-bold text-slate-600 mt-0.5">₹{selectedBill.paidAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10.5px] font-bold text-teal-800 uppercase">Balance Due</div>
                <div className="text-[14px] font-black text-teal-800 mt-0.5">₹{selectedBill.dueAmount.toLocaleString()}</div>
              </div>
            </div>

            {/* Settlement Mode Selection */}
            <div className="space-y-1">
              <label className="block text-[11.5px] font-bold text-slate-700">Payment Collection Mode</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["UPI", "Cash", "Card", "Room Charge"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSettlementMode(mode)}
                    className={`rounded-lg py-1.5 text-[11.5px] font-bold transition cursor-pointer border ${
                      settlementMode === mode
                        ? "bg-teal-700 text-white border-teal-700 shadow-2xs"
                        : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-1">
              <label className="block text-[11.5px] font-bold text-slate-700">Collection Amount (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="number"
                  value={settlementAmount}
                  onChange={(e) => setSettlementAmount(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 text-[13.5px] font-bold text-slate-900 focus:border-teal-500 focus:outline-hidden shadow-2xs"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleConfirmSettlement}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-teal-700 py-2 text-[12px] font-bold text-white hover:bg-teal-800 active:scale-98 transition cursor-pointer shadow-2xs"
              >
                <Check className="h-4 w-4" />
                <span>Confirm Settlement</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedBill(null)}
                className="rounded-lg border border-slate-300 bg-white py-2 text-[12px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PosDueSettlementManager;
