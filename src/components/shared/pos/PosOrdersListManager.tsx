import React from "react";
import { PageHeader, StatusBadge, Button } from "@/components/ui/Primitives";
import { PosStatTile } from "@/components/shared/pos/PosStatTile";
import { PosDataGrid } from "@/components/ui/data-grid";
import type { DataGridColumn } from "@/components/ui/data-grid/types";

interface OrderRow {
  id: string;
  channel: string;
  party: string;
  amount: string;
  status: string;
  itemsCount?: number;
  time?: string;
}

const DEMO_ROWS: OrderRow[] = [
  { id: "ORD-441", channel: "Dine in", party: "T-12", amount: "₹4,860", status: "Open", itemsCount: 4, time: "10 mins ago" },
  { id: "ORD-440", channel: "Delivery", party: "Swiggy", amount: "₹1,240", status: "Preparing", itemsCount: 2, time: "18 mins ago" },
  { id: "ORD-439", channel: "Pick up", party: "Counter", amount: "₹680", status: "Ready", itemsCount: 1, time: "25 mins ago" },
  { id: "ORD-438", channel: "Dine in", party: "T-04", amount: "₹3,200", status: "Open", itemsCount: 3, time: "30 mins ago" },
  { id: "ORD-437", channel: "Delivery", party: "Zomato", amount: "₹890", status: "Preparing", itemsCount: 2, time: "35 mins ago" },
  { id: "ORD-436", channel: "Dine in", party: "T-08", amount: "₹5,420", status: "Ready", itemsCount: 6, time: "42 mins ago" },
  { id: "ORD-435", channel: "Takeaway", party: "Walk-in", amount: "₹450", status: "Open", itemsCount: 1, time: "50 mins ago" },
];

const COLUMNS: DataGridColumn<OrderRow>[] = [
  {
    id: "id",
    header: "Order #",
    sortable: true,
    filterable: true,
    width: 140,
    render: (val: any) => <span className="font-mono font-bold text-primary">{val}</span>,
  },
  {
    id: "channel",
    header: "Channel / Type",
    sortable: true,
    filterable: true,
    width: 150,
    render: (val: any) => (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-surface-2 text-foreground">
        {val}
      </span>
    ),
  },
  {
    id: "party",
    header: "Table / Platform",
    sortable: true,
    filterable: true,
    width: 160,
  },
  {
    id: "itemsCount",
    header: "Items",
    sortable: true,
    align: "center",
    width: 100,
    render: (val: any) => <span className="font-semibold">{val || 1} item(s)</span>,
  },
  {
    id: "time",
    header: "Time",
    sortable: true,
    width: 130,
    render: (val: any) => <span className="text-muted-foreground text-xs">{val || "--"}</span>,
  },
  {
    id: "amount",
    header: "Amount",
    sortable: true,
    align: "right",
    width: 130,
    render: (val: any) => <span className="font-mono font-bold text-foreground">{val}</span>,
  },
  {
    id: "status",
    header: "Status",
    sortable: true,
    filterable: true,
    align: "center",
    width: 140,
    render: (val: any) => (
      <StatusBadge
        tone={
          val === "Preparing"
            ? "warning"
            : val === "Open"
            ? "info"
            : "success"
        }
      >
        {val}
      </StatusBadge>
    ),
  },
];

/** Shared list shell for Live / All / Online order screens. */
export function PosOrdersListManager({
  title,
  description,
  filterHint,
}: {
  title: string;
  description: string;
  filterHint: string;
}) {
  return (
    <div>
      <PageHeader
        eyebrow="Daily operation"
        title={title}
        description={description}
        actions={
          <Button size="sm" variant="outline">
            Refresh
          </Button>
        }
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <PosStatTile label="Open" value={8} tone="info" />
          <PosStatTile label="Preparing" value={5} tone="warning" />
          <PosStatTile label="Ready" value={3} tone="success" />
          <PosStatTile label="Closed today" value={142} />
        </div>

        <PosDataGrid
          data={DEMO_ROWS}
          columns={COLUMNS}
          keyField="id"
          title={title}
          subtitle={filterHint}
          showToolbar
          selectable
          storageKey={`pos-orders-${title.toLowerCase().replace(/\s+/g, "-")}`}
          themeVariant="primary"
          pageSize={10}
        />
      </div>
    </div>
  );
}
