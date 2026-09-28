import { useState, useMemo } from "react";
import {
  Receipt,
  Download,
  Plus,
  Search,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
  DataTableHeader,
  DataTableFooter,
  type DataTableColumn,
} from "@/components/common";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export interface ServicePaymentRecord {
  id: string;
  invoiceNo: string;
  serviceName: string;
  category: "POS Subscription" | "SMS Pack" | "Hardware & Add-on" | "Cloud Backup" | "Payment Gateway Fee";
  billingCycle: "Annual" | "Monthly" | "One-time" | "Usage-based";
  invoiceDate: string;
  amount: number;
  taxAmount: number;
  totalPaid: number;
  paymentMethod: "UPI" | "Credit Card" | "Net Banking" | "Auto-Debit";
  txnRef: string;
  status: "Paid" | "Processing" | "Refunded";
  downloadUrl?: string;
}

const INITIAL_SERVICE_PAYMENTS: ServicePaymentRecord[] = [
  {
    id: "sp-1",
    invoiceNo: "INV-RET-2026-0841",
    serviceName: "Retrod POS Enterprise Plan (Multi-Terminal & KOT)",
    category: "POS Subscription",
    billingCycle: "Annual",
    invoiceDate: "01 Oct 2025",
    amount: 24000.0,
    taxAmount: 4320.0,
    totalPaid: 28320.0,
    paymentMethod: "Credit Card",
    txnRef: "CC-AUTOPAY-984210",
    status: "Paid",
  },
  {
    id: "sp-2",
    invoiceNo: "INV-RET-2026-0912",
    serviceName: "Customer Notification & OTP SMS Pack (50,000 SMS)",
    category: "SMS Pack",
    billingCycle: "One-time",
    invoiceDate: "15 Aug 2026",
    amount: 4500.0,
    taxAmount: 810.0,
    totalPaid: 5310.0,
    paymentMethod: "UPI",
    txnRef: "UPI/2608159821/phonepe",
    status: "Paid",
  },
  {
    id: "sp-3",
    invoiceNo: "INV-RET-2026-0925",
    serviceName: "Kitchen Display System (KDS) Terminal License #2 & #3",
    category: "Hardware & Add-on",
    billingCycle: "Annual",
    invoiceDate: "01 Sep 2026",
    amount: 7200.0,
    taxAmount: 1296.0,
    totalPaid: 8496.0,
    paymentMethod: "Net Banking",
    txnRef: "HDFC0921849102",
    status: "Paid",
  },
  {
    id: "sp-4",
    invoiceNo: "INV-RET-2026-0933",
    serviceName: "Real-time Multi-Branch Cloud Backup & Offline Sync",
    category: "Cloud Backup",
    billingCycle: "Annual",
    invoiceDate: "05 Sep 2026",
    amount: 3600.0,
    taxAmount: 648.0,
    totalPaid: 4248.0,
    paymentMethod: "Auto-Debit",
    txnRef: "ACH-RET-982104",
    status: "Paid",
  },
];

const SERVICE_CATEGORIES = [
  "POS Subscription",
  "SMS Pack",
  "Hardware & Add-on",
  "Cloud Backup",
  "Payment Gateway Fee",
];

const PAYMENT_METHODS = ["UPI", "Credit Card", "Net Banking", "Auto-Debit"];

export function ServicePaymentHistoryView() {
  const [payments, setPayments] = useState<ServicePaymentRecord[]>(INITIAL_SERVICE_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ colId: string; direction: "asc" | "desc" } | null>(null);

  // Add / Log Service Payment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formServiceName, setFormServiceName] = useState("");
  const [formCategory, setFormCategory] = useState<any>("");
  const [formBillingCycle, setFormBillingCycle] = useState<any>("Annual");
  const [formInvoiceNo, setFormInvoiceNo] = useState("");
  const [formInvoiceDate, setFormInvoiceDate] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formTaxAmount, setFormTaxAmount] = useState("");
  const [formPaymentMethod, setFormPaymentMethod] = useState<any>("");
  const [formTxnRef, setFormTxnRef] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) => setTouched((p) => ({ ...p, [field]: true }));

  // Validation
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!formServiceName.trim()) errs.serviceName = "Service / Plan name is required.";
    if (!formCategory) errs.category = "Please select category.";
    if (!formInvoiceNo.trim()) errs.invoiceNo = "Invoice number is required.";
    if (!formInvoiceDate.trim()) errs.invoiceDate = "Invoice date is required.";
    if (!formAmount.trim()) {
      errs.amount = "Base amount is required.";
    } else if (isNaN(Number(formAmount)) || Number(formAmount) <= 0) {
      errs.amount = "Enter a valid positive number.";
    }
    if (!formPaymentMethod) errs.paymentMethod = "Please select a payment method.";
    if (!formTxnRef.trim()) errs.txnRef = "Transaction reference / UTR is required.";
    return errs;
  }, [formServiceName, formCategory, formInvoiceNo, formInvoiceDate, formAmount, formPaymentMethod, formTxnRef]);

  const isFormValid = Object.keys(errors).length === 0;

  const openAddModal = () => {
    setFormServiceName("");
    setFormCategory("");
    setFormBillingCycle("Annual");
    setFormInvoiceNo(`INV-RET-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormInvoiceDate(new Date().toISOString().split("T")[0]);
    setFormAmount("");
    setFormTaxAmount("");
    setFormPaymentMethod("");
    setFormTxnRef("");
    setTouched({});
    setIsModalOpen(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      serviceName: true,
      category: true,
      invoiceNo: true,
      invoiceDate: true,
      amount: true,
      paymentMethod: true,
      txnRef: true,
    });

    if (!isFormValid) {
      toast.error("Please fill all mandatory fields marked with red star (*)");
      return;
    }

    const base = parseFloat(formAmount);
    const tax = formTaxAmount.trim() ? parseFloat(formTaxAmount) : parseFloat((base * 0.18).toFixed(2));
    const total = base + tax;

    const newPayment: ServicePaymentRecord = {
      id: `sp-${Date.now()}`,
      invoiceNo: formInvoiceNo.trim().toUpperCase(),
      serviceName: formServiceName.trim(),
      category: formCategory,
      billingCycle: formBillingCycle,
      invoiceDate: formInvoiceDate.trim(),
      amount: base,
      taxAmount: tax,
      totalPaid: total,
      paymentMethod: formPaymentMethod,
      txnRef: formTxnRef.trim(),
      status: "Paid",
    };

    setPayments((prev) => [newPayment, ...prev]);
    toast.success("Service payment invoice logged successfully");
    setIsModalOpen(false);
  };

  // KPIs
  const totalPaidSum = payments.reduce((acc, p) => acc + p.totalPaid, 0);

  // Filtered & Sorted
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
      if (statusFilter !== "All" && p.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          p.serviceName.toLowerCase().includes(q) ||
          p.invoiceNo.toLowerCase().includes(q) ||
          p.txnRef.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [payments, searchQuery, categoryFilter, statusFilter]);

  const sortedPayments = useMemo(() => {
    if (!sortConfig) return filteredPayments;
    return [...filteredPayments].sort((a, b) => {
      const field = sortConfig.colId as keyof ServicePaymentRecord;
      const aVal = a[field] ?? "";
      const bVal = b[field] ?? "";
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredPayments, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedPayments.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const paginatedPayments = useMemo(() => {
    const start = (validPage - 1) * pageSize;
    return sortedPayments.slice(start, start + pageSize);
  }, [sortedPayments, validPage, pageSize]);

  const toggleSelectAll = () => {
    if (selectedIds.length === sortedPayments.length && sortedPayments.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedPayments.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const columns: DataTableColumn<ServicePaymentRecord>[] = [
    {
      id: "invoiceNo",
      label: "Invoice No.",
      sortable: true,
      defaultWidth: 170,
      getValue: (r) => r.invoiceNo,
    },
    {
      id: "serviceName",
      label: "Service / Module",
      sortable: true,
      defaultWidth: 260,
      getValue: (r) => r.serviceName,
    },
    {
      id: "category",
      label: "Category",
      sortable: true,
      filterable: true,
      defaultWidth: 160,
      getValue: (r) => r.category,
    },
    {
      id: "invoiceDate",
      label: "Invoice Date",
      sortable: true,
      defaultWidth: 120,
      getValue: (r) => r.invoiceDate,
    },
    {
      id: "amount",
      label: "Net (₹)",
      sortable: true,
      align: "right",
      defaultWidth: 110,
      getValue: (r) => `₹${r.amount.toLocaleString("en-IN")}`,
    },
    {
      id: "taxAmount",
      label: "GST (18%)",
      sortable: true,
      align: "right",
      defaultWidth: 110,
      getValue: (r) => `₹${r.taxAmount.toLocaleString("en-IN")}`,
    },
    {
      id: "totalPaid",
      label: "Total Paid (₹)",
      sortable: true,
      align: "right",
      defaultWidth: 130,
      getValue: (r) => `₹${r.totalPaid.toLocaleString("en-IN")}`,
    },
    {
      id: "paymentMethod",
      label: "Payment Mode",
      sortable: true,
      defaultWidth: 130,
      getValue: (r) => r.paymentMethod,
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      filterable: true,
      align: "center",
      defaultWidth: 110,
      getValue: (r) => r.status,
    },
    {
      id: "actions",
      label: "Action",
      sortable: false,
      filterable: false,
      align: "right",
      defaultWidth: 100,
    },
  ];

  return (
    <div className="w-full space-y-5 pb-12">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Service Payment History</h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Software licenses, POS subscription invoices, SMS packages, and add-on module renewals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toast.success("Exporting service invoice statement...")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" /> Export Statement
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-teal-700 active:scale-[0.98] transition cursor-pointer shadow-xs"
          >
            <Plus className="h-4 w-4" /> Log Service Invoice
          </button>
        </div>
      </div>

      {/* 2. KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <span className="text-[11.5px] font-medium text-slate-500 block">Total Software & Service Spend</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-[20px] font-bold font-mono text-slate-900">
              ₹{totalPaidSum.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11.5px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded">All Clear</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <span className="text-[11.5px] font-medium text-slate-500 block">Active Subscription Plan</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-[16px] font-bold text-slate-800">Retrod Enterprise POS</span>
            <span className="text-[11.5px] text-emerald-600 font-bold">Renews 1 Oct 2026</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <span className="text-[11.5px] font-medium text-slate-500 block">SMS Credits Balance</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-[20px] font-bold font-mono text-slate-900">38,420 SMS</span>
            <span className="text-[11.5px] text-slate-400">OTP & Bill Sync Active</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1 flex-1 min-w-[220px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Search Invoice / Module</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search invoice number, plan, or transaction ref..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1 min-w-[160px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Category</label>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {SERVICE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.info(`Found ${filteredPayments.length} matching invoices`)}
              className="rounded-lg bg-teal-600 px-5 py-1.5 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("All");
                setStatusFilter("All");
                setCurrentPage(1);
                toast.info("Showing all service payment invoices");
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              Show All
            </button>
          </div>
        </div>
      </div>

      {/* 4. Full Width Table with DataTableHeader & DataTableFooter */}
      <div className="rounded-2xl border border-slate-300 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12.5px] border-collapse">
            <DataTableHeader
              columns={columns}
              data={sortedPayments}
              selectable
              isAllSelected={selectedIds.length === sortedPayments.length && sortedPayments.length > 0}
              isSomeSelected={selectedIds.length > 0 && selectedIds.length < sortedPayments.length}
              onToggleSelectAll={toggleSelectAll}
              sortConfig={sortConfig}
              onSortChange={setSortConfig}
              themeVariant="primary"
            />
            <tbody className="divide-y divide-slate-100">
              {paginatedPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="w-12 px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p.id)}
                      onChange={() => toggleSelect(p.id)}
                      className="rounded border-slate-300 cursor-pointer text-teal-600 focus:ring-teal-500"
                    />
                  </td>
                  <td className="px-3.5 py-3">
                    <span className="font-mono font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      {p.invoiceNo}
                    </span>
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="font-semibold text-slate-900">{p.serviceName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Ref: {p.txnRef}</div>
                  </td>
                  <td className="px-3.5 py-3">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-3.5 py-3 font-mono text-[12px] text-slate-600">{p.invoiceDate}</td>
                  <td className="px-3.5 py-3 text-right font-mono text-slate-700">₹{p.amount.toLocaleString("en-IN")}</td>
                  <td className="px-3.5 py-3 text-right font-mono text-slate-500">₹{p.taxAmount.toLocaleString("en-IN")}</td>
                  <td className="px-3.5 py-3 text-right">
                    <div className="font-bold font-mono text-teal-700">
                      ₹{p.totalPaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-3.5 py-3 text-slate-700 font-medium">{p.paymentMethod}</td>
                  <td className="px-3.5 py-3 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      {p.status}
                    </span>
                  </td>
                  <td className="px-3.5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => toast.success(`Downloading tax invoice ${p.invoiceNo}.pdf...`)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer inline-flex items-center gap-1 text-[12px]"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DataTableFooter
          totalCount={sortedPayments.length}
          currentPage={validPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          }}
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          itemName="service invoices"
          onExport={(fmt) => toast.success(`Exporting service invoices as ${fmt.toUpperCase()}...`)}
        />
      </div>

      {/* 5. Log Service Invoice Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-teal-700 shadow-2xs">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-[16px] font-bold tracking-tight text-slate-900">
                  Log Service Invoice / Add-on Payment
                </DialogTitle>
                <DialogDescription className="text-[12px] text-slate-500 mt-0.5">
                  Record POS add-ons, SMS packs, and cloud synchronization billing.
                </DialogDescription>
              </div>
            </div>
          </div>

          <form onSubmit={handleSavePayment} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Service Name */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-slate-700">
                Service / Plan Name <span className="text-rose-500 font-bold ml-0.5">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Retrod POS Enterprise Subscription"
                value={formServiceName}
                onBlur={() => markTouched("serviceName")}
                onChange={(e) => {
                  setFormServiceName(e.target.value);
                  markTouched("serviceName");
                }}
                className={`w-full rounded-xl border px-3.5 py-2 text-[13px] text-slate-800 focus:outline-none transition shadow-2xs ${
                  touched.serviceName && errors.serviceName
                    ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                    : "border-slate-300 bg-white focus:border-teal-500"
                }`}
              />
              {touched.serviceName && errors.serviceName && (
                <div className="flex items-center gap-1 text-[11.5px] font-medium text-rose-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.serviceName}</span>
                </div>
              )}
            </div>

            {/* Category & Billing Cycle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-700">
                  Category <span className="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <select
                  value={formCategory}
                  onBlur={() => markTouched("category")}
                  onChange={(e) => {
                    setFormCategory(e.target.value);
                    markTouched("category");
                  }}
                  className={`w-full rounded-xl border bg-white px-3 py-2 text-[13px] text-slate-800 focus:outline-none cursor-pointer shadow-2xs ${
                    touched.category && errors.category ? "border-rose-400 bg-rose-50/20" : "border-slate-300 focus:border-teal-500"
                  }`}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {SERVICE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {touched.category && errors.category && (
                  <div className="flex items-center gap-1 text-[11.5px] font-medium text-rose-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.category}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-700">Billing Cycle</label>
                <select
                  value={formBillingCycle}
                  onChange={(e) => setFormBillingCycle(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none cursor-pointer shadow-2xs"
                >
                  <option value="Annual">Annual</option>
                  <option value="Monthly">Monthly</option>
                  <option value="One-time">One-time</option>
                  <option value="Usage-based">Usage-based</option>
                </select>
              </div>
            </div>

            {/* Invoice No & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-700">
                  Invoice Number <span className="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. INV-RET-2026-9812"
                  value={formInvoiceNo}
                  onBlur={() => markTouched("invoiceNo")}
                  onChange={(e) => {
                    setFormInvoiceNo(e.target.value);
                    markTouched("invoiceNo");
                  }}
                  className={`w-full font-mono rounded-xl border px-3.5 py-2 text-[13px] text-slate-800 focus:outline-none transition shadow-2xs ${
                    touched.invoiceNo && errors.invoiceNo
                      ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                      : "border-slate-300 bg-white focus:border-teal-500"
                  }`}
                />
                {touched.invoiceNo && errors.invoiceNo && (
                  <div className="flex items-center gap-1 text-[11.5px] font-medium text-rose-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.invoiceNo}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-700">
                  Invoice Date <span className="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  type="date"
                  value={formInvoiceDate}
                  onBlur={() => markTouched("invoiceDate")}
                  onChange={(e) => {
                    setFormInvoiceDate(e.target.value);
                    markTouched("invoiceDate");
                  }}
                  className={`w-full rounded-xl border px-3.5 py-2 text-[13px] text-slate-800 focus:outline-none transition shadow-2xs ${
                    touched.invoiceDate && errors.invoiceDate
                      ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                      : "border-slate-300 bg-white focus:border-teal-500"
                  }`}
                />
                {touched.invoiceDate && errors.invoiceDate && (
                  <div className="flex items-center gap-1 text-[11.5px] font-medium text-rose-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.invoiceDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Base Amount & Tax */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-700">
                  Net Amount (₹) <span className="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formAmount}
                  onBlur={() => markTouched("amount")}
                  onChange={(e) => {
                    setFormAmount(e.target.value);
                    markTouched("amount");
                  }}
                  className={`w-full font-mono rounded-xl border px-3.5 py-2 text-[13px] text-slate-800 focus:outline-none transition shadow-2xs ${
                    touched.amount && errors.amount
                      ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                      : "border-slate-300 bg-white focus:border-teal-500"
                  }`}
                />
                {touched.amount && errors.amount && (
                  <div className="flex items-center gap-1 text-[11.5px] font-medium text-rose-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.amount}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-700">GST (18% / Custom)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Calculated automatically if empty"
                  value={formTaxAmount}
                  onChange={(e) => setFormTaxAmount(e.target.value)}
                  className="w-full font-mono rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            {/* Payment Method & UTR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-700">
                  Payment Method <span className="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <select
                  value={formPaymentMethod}
                  onBlur={() => markTouched("paymentMethod")}
                  onChange={(e) => {
                    setFormPaymentMethod(e.target.value);
                    markTouched("paymentMethod");
                  }}
                  className={`w-full rounded-xl border bg-white px-3 py-2 text-[13px] text-slate-800 focus:outline-none cursor-pointer shadow-2xs ${
                    touched.paymentMethod && errors.paymentMethod
                      ? "border-rose-400 bg-rose-50/20"
                      : "border-slate-300 focus:border-teal-500"
                  }`}
                >
                  <option value="" disabled>
                    Select Method
                  </option>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                {touched.paymentMethod && errors.paymentMethod && (
                  <div className="flex items-center gap-1 text-[11.5px] font-medium text-rose-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.paymentMethod}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-700">
                  Transaction Ref / UTR <span className="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. HDFC98210491"
                  value={formTxnRef}
                  onBlur={() => markTouched("txnRef")}
                  onChange={(e) => {
                    setFormTxnRef(e.target.value);
                    markTouched("txnRef");
                  }}
                  className={`w-full font-mono rounded-xl border px-3.5 py-2 text-[13px] text-slate-800 focus:outline-none transition shadow-2xs ${
                    touched.txnRef && errors.txnRef
                      ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                      : "border-slate-300 bg-white focus:border-teal-500"
                  }`}
                />
                {touched.txnRef && errors.txnRef && (
                  <div className="flex items-center gap-1 text-[11.5px] font-medium text-rose-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.txnRef}</span>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="pt-3 gap-2 sm:gap-0 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11.5px] text-slate-400">
                {!isFormValid ? (
                  <span className="text-amber-600 font-medium">Fill mandatory fields (*) to enable</span>
                ) : (
                  <span className="text-emerald-600 font-medium">Ready to save</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`rounded-xl px-5 py-2.5 text-[13px] font-semibold transition ${
                    isFormValid
                      ? "bg-teal-600 text-white hover:bg-teal-700 active:scale-[0.98] cursor-pointer shadow-sm shadow-teal-600/20"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
                  }`}
                >
                  Save Service Invoice
                </button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
