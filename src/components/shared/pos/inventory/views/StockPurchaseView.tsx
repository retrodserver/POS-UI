import { useState, useMemo } from "react";
import {
  Plus,
  QrCode,
  Download,
  Trash2,
  Eye,
} from "lucide-react";
import {
  useStockPurchases,
  useInventoryVendors,
  useDeletePurchase,
} from "@/hooks/queries/usePosInventory";
import { CreatePurchaseModal } from "../modals/CreatePurchaseModal";
import { PosDataGrid } from "@/components/ui/data-grid";
import type { DataGridColumn } from "@/components/ui/data-grid/types";
import { toast } from "sonner";

export function StockPurchaseView() {
  const { data: purchases = [], isLoading } = useStockPurchases();
  const { data: vendors = [] } = useInventoryVendors();
  const deleteMutation = useDeletePurchase();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [startDate, setStartDate] = useState("2026-08-26");
  const [endDate, setEndDate] = useState("2026-09-02");
  const [vendorFilter, setVendorFilter] = useState("All");

  const filteredPurchases = useMemo(() => {
    return (purchases ?? []).filter((p) => {
      if (vendorFilter !== "All" && p.vendorName !== vendorFilter) return false;
      return true;
    });
  }, [purchases, vendorFilter]);

  const purchaseColumns: DataGridColumn<any>[] = [
    {
      id: "invoiceNo",
      header: "Invoice No",
      sortable: true,
      filterable: true,
      width: 150,
      render: (val: any) => <span className="font-mono font-bold text-primary">{val}</span>,
    },
    {
      id: "vendorName",
      header: "Vendor / Supplier",
      sortable: true,
      filterable: true,
      width: 200,
      render: (val: any) => <span className="font-semibold text-foreground">{val}</span>,
    },
    {
      id: "invoiceDate",
      header: "Invoice Date",
      sortable: true,
      width: 130,
      render: (val: any) => <span className="text-muted-foreground text-xs">{val}</span>,
    },
    {
      id: "itemCount",
      header: "Items",
      sortable: true,
      align: "center",
      width: 110,
      render: (val: any) => <span className="font-semibold">{val} SKUs</span>,
    },
    {
      id: "taxAmount",
      header: "Tax Amount",
      sortable: true,
      align: "right",
      width: 130,
      render: (val: any) => <span className="font-mono text-muted-foreground">₹{val}</span>,
    },
    {
      id: "totalAmount",
      header: "Total Amount",
      sortable: true,
      align: "right",
      width: 140,
      render: (val: any) => <span className="font-mono font-bold text-foreground">₹{val}</span>,
    },
    {
      id: "paymentStatus",
      header: "Payment",
      sortable: true,
      filterable: true,
      align: "center",
      width: 130,
      render: (val: any) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            val === "Paid"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      align: "center",
      width: 130,
      render: (val: any) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">
          {val}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      width: 100,
      render: (_: any, item: any) => (
        <div className="flex items-center justify-end gap-1 text-muted-foreground">
          <button
            type="button"
            onClick={() => toast.info(`Viewing details of ${item.invoiceNo}`)}
            className="p-1 hover:text-primary hover:bg-surface-2 rounded transition cursor-pointer"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              deleteMutation.mutate(item.id);
              toast.success(`Deleted purchase ${item.invoiceNo}`);
            }}
            className="p-1 hover:text-red-500 hover:bg-surface-2 rounded transition cursor-pointer"
            title="Delete Purchase"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground tracking-tight">Stock Purchase List</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Record supplier bills, GRN entries, tax invoices, and incoming stock items.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:opacity-90 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create New</span>
          </button>

          <button
            type="button"
            onClick={() => toast.info("Barcode scanner activated for invoices")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-2 transition cursor-pointer"
          >
            <QrCode className="h-4 w-4 text-muted-foreground" />
            <span>Scan & Purchase</span>
          </button>
        </div>
      </div>

      {/* 2. Top Filter Controls */}
      <div className="rounded-xl border border-border bg-surface p-3.5 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-36">
            <label className="block text-[11.5px] font-semibold text-muted-foreground mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="w-36">
            <label className="block text-[11.5px] font-semibold text-muted-foreground mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="min-w-[160px]">
            <label className="block text-[11.5px] font-semibold text-muted-foreground mb-1">
              Vendor
            </label>
            <select
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="All">All Vendors</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setVendorFilter("All");
              toast.info("Date & vendor filters reset");
            }}
            className="rounded-lg border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-2 transition cursor-pointer"
          >
            Reset Dates
          </button>
        </div>
      </div>

      {/* 3. Interactive Data Grid */}
      <PosDataGrid
        data={filteredPurchases}
        columns={purchaseColumns}
        keyField="id"
        title="Purchase Bills"
        subtitle="Manage invoice receipts and procurement details"
        showToolbar
        selectable
        loading={isLoading}
        storageKey="pos-stock-purchase-list"
        themeVariant="primary"
        pageSize={10}
      />

      <CreatePurchaseModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
