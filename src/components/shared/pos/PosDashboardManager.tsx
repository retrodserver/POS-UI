import { useState } from "react";
import { usePosDashboard } from "@/hooks/queries/usePosDashboard";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardKpiCards } from "./dashboard/DashboardKpiCards";
import { OrderTypesDonutChart } from "./dashboard/OrderTypesDonutChart";
import { LiveOrdersWidget } from "./dashboard/LiveOrdersWidget";
import { PaymentSummaryCard } from "./dashboard/PaymentSummaryCard";
import { TableStatusCard } from "./dashboard/TableStatusCard";
import { TopSellingItemsCard } from "./dashboard/TopSellingItemsCard";
import { AttentionNeededCard } from "./dashboard/AttentionNeededCard";
import { OperationalMetricsStrip } from "./dashboard/OperationalMetricsStrip";
import type { DashboardFilterParams } from "@/types/posDashboard";

/**
 * POS Dashboard Manager
 * Orchestrates real backend data fetching via TanStack Query and coordinates all visual panels.
 */
export function PosDashboardManager() {
  const [filters, setFilters] = useState<DashboardFilterParams>({
    dateRange: "today",
  });

  const { data } = usePosDashboard(filters);

  const handleDateChange = (range: "today" | "yesterday" | "this_week" | "this_month") => {
    setFilters((prev) => ({ ...prev, dateRange: range }));
  };

  if (!data) return null;

  return (
    <div className="space-y-2.5">
      {/* 1. Header & Controls */}
      <DashboardHeader
        dateLabel={data.dateLabel}
        isMockData={data.isMockData}
        onDateChange={handleDateChange}
      />

      {/* 2. Top KPI Cards (5 Cards) */}
      <DashboardKpiCards stats={data.stats} />

      {/* 3. Row 2 (3 Columns): Live Orders, Order Types Donut, Table Status */}
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
        <LiveOrdersWidget orders={data.liveOrders} />
        <OrderTypesDonutChart
          orderTypes={data.orderTypes}
          totalCount={data.totalOrderTypesCount}
        />
        <TableStatusCard tables={data.tables} />
      </div>

      {/* 4. Row 3 (3 Columns): Payment Summary, Top Selling Items, Attention Needed */}
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
        <PaymentSummaryCard paymentSummary={data.paymentSummary} />
        <TopSellingItemsCard items={data.topSellingItems} />
        <AttentionNeededCard alerts={data.attentionAlerts} />
      </div>

      {/* 5. Row 4: Bottom Operations Summary Strip */}
      <OperationalMetricsStrip operations={data.operations} />
    </div>
  );
}

export default PosDashboardManager;
