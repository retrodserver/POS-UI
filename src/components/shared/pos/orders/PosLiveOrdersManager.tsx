import { useState, useMemo } from "react";
import {
  RefreshCw,
  Utensils,
  ShoppingBag,
  Truck,
  ChefHat,
  Clock,
  X,
  CreditCard,
  Plus,
  BarChart3,
  LayoutGrid,
  ListOrdered,
  Eye,
  CheckCircle2,
  Timer,
  Filter,
  Check,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useLiveOrders } from "@/hooks/queries/usePosOrders";

interface LiveTimelineOrder {
  id: string;
  orderNumber: string;
  type: "dine_in" | "pickup" | "delivery";
  typeLabel: string;
  source: string;
  customerName: string;
  tableOrRoom?: string;
  itemsSummary: string;
  amountFormatted: string;
  startTime: string;
  elapsedMinutes: number;
  estDurationMinutes: number;
  currentStage: "placed" | "prepared" | "settled";
  stageLabel: string;
}

const MOCK_TIMELINE_ORDERS: LiveTimelineOrder[] = [
  {
    id: "live-ord-1",
    orderNumber: "ORD-10521",
    type: "dine_in",
    typeLabel: "Dine In",
    source: "Table T-04 (AC)",
    customerName: "Rahul Sharma",
    tableOrRoom: "T-04",
    itemsSummary: "Paneer Butter Masala, Butter Naan (3), Dal Makhani",
    amountFormatted: "₹ 1,120.00",
    startTime: "16:10",
    elapsedMinutes: 28,
    estDurationMinutes: 40,
    currentStage: "prepared",
    stageLabel: "Prepared by Chef",
  },
  {
    id: "live-ord-2",
    orderNumber: "ORD-10522",
    type: "dine_in",
    typeLabel: "Dine In",
    source: "Table T-12 (Garden)",
    customerName: "Ananya Roy",
    tableOrRoom: "T-12",
    itemsSummary: "Carlsberg Elephant (2), Crispy Corn, Veg Hakka Noodles",
    amountFormatted: "₹ 640.00",
    startTime: "16:22",
    elapsedMinutes: 16,
    estDurationMinutes: 35,
    currentStage: "placed",
    stageLabel: "Placed (In Kitchen)",
  },
  {
    id: "live-ord-3",
    orderNumber: "ORD-10523",
    type: "delivery",
    typeLabel: "Zomato Delivery",
    source: "Zomato #9201",
    customerName: "Sameer Verma",
    itemsSummary: "Chicken Tikka (6 pcs), Roomali Roti (4), Biryani",
    amountFormatted: "₹ 890.00",
    startTime: "16:02",
    elapsedMinutes: 36,
    estDurationMinutes: 45,
    currentStage: "prepared",
    stageLabel: "Prepared by Chef",
  },
  {
    id: "live-ord-4",
    orderNumber: "ORD-10524",
    type: "pickup",
    typeLabel: "Takeaway",
    source: "Takeaway Counter",
    customerName: "Karan Patel",
    itemsSummary: "Cold Coffee (2), Club Sandwich",
    amountFormatted: "₹ 380.00",
    startTime: "16:30",
    elapsedMinutes: 8,
    estDurationMinutes: 20,
    currentStage: "placed",
    stageLabel: "Placed (In Kitchen)",
  },
  {
    id: "live-ord-5",
    orderNumber: "ORD-10525",
    type: "dine_in",
    typeLabel: "Dine In",
    source: "Table T-08 (Family)",
    customerName: "Dr. Alok Verma",
    tableOrRoom: "T-08",
    itemsSummary: "Tandoori Platter, Mojito (2), Gulab Jamun",
    amountFormatted: "₹ 1,450.00",
    startTime: "16:34",
    elapsedMinutes: 4,
    estDurationMinutes: 30,
    currentStage: "placed",
    stageLabel: "Placed (In Kitchen)",
  },
];

export function PosLiveOrdersManager() {
  const [activeTab, setActiveTab] = useState<
    "gantt_timeline" | "running_orders" | "running_tables"
  >("gantt_timeline");
  const [timelineFilter, setTimelineFilter] = useState<"all" | "dine_in" | "pickup" | "delivery">(
    "all",
  );
  const [stageFilter, setStageFilter] = useState<string>("all");
  const { data, refetch, isFetching } = useLiveOrders();

  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [selectedBreakdownTitle, setSelectedBreakdownTitle] = useState<string | null>(null);
  const [selectedTimelineOrder, setSelectedTimelineOrder] = useState<LiveTimelineOrder | null>(
    null,
  );

  const running = data?.runningOrders ?? {
    totalOrders: 2,
    totalAmountFormatted: "₹ 1,760.00",
    dineIn: { count: 2, amountFormatted: "₹ 1,760.00" },
    pickUp: { count: 0, amountFormatted: "₹ 0.00" },
    delivery: { count: 0, amountFormatted: "₹ 0.00" },
  };

  const pending = data?.pendingOrders ?? {
    totalOrders: 3,
    totalAmountFormatted: "₹ 1,270.00",
    inPreparation: { count: 2, amountFormatted: "₹ 1,020.00" },
    waitingForPickup: { count: 0, amountFormatted: "₹ 0.00" },
    outForDelivery: { count: 1, amountFormatted: "₹ 890.00" },
  };

  const [timelineOrders, setTimelineOrders] = useState<LiveTimelineOrder[]>(MOCK_TIMELINE_ORDERS);

  const handleAdvanceStage = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTimelineOrders((prev) =>
      prev
        .map((ord) => {
          if (ord.id !== id) return ord;
          if (ord.currentStage === "placed") {
            return {
              ...ord,
              currentStage: "prepared" as const,
              stageLabel: "Prepared by Chef",
              elapsedMinutes: 1,
            };
          }
          if (ord.currentStage === "prepared") {
            // Stage 3 Settle & Done -> order completes and goes to Order History
            return null;
          }
          return ord;
        })
        .filter(Boolean) as LiveTimelineOrder[],
    );
  };

  const STAGES_CONFIG = [
    {
      key: "placed",
      title: "1. Placed (In KOT)",
      short: "Placed",
      desc: "Order taken & sent to kitchen",
    },
    {
      key: "prepared",
      title: "2. Prepared",
      short: "Prepared",
      desc: "Chef 1-click Prepared · Sent to billing",
    },
    {
      key: "settled",
      title: "3. Settle & Done",
      short: "Settled",
      desc: "Frontdesk payment settled & archived",
    },
  ] as const;

  const getStageIndex = (stage: LiveTimelineOrder["currentStage"]) => {
    switch (stage) {
      case "placed":
        return 0;
      case "prepared":
        return 1;
      case "settled":
        return 2;
      default:
        return 0;
    }
  };

  const filteredTimelineOrders = useMemo(() => {
    return timelineOrders.filter((ord) => {
      if (timelineFilter !== "all" && ord.type !== timelineFilter) return false;
      if (stageFilter !== "all" && ord.currentStage !== stageFilter) return false;
      return true;
    });
  }, [timelineOrders, timelineFilter, stageFilter]);


  return (
    <div className="space-y-2.5">
      {/* 1. TOP HEADER & VIEW SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-slate-300 bg-white p-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-teal-50 border border-teal-300 text-teal-700">
            <Timer className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-bold text-slate-900 leading-tight">Current Orders</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.2 text-[10.5px] font-bold text-teal-700 border border-teal-300">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-600 animate-pulse" />
                Live Feed
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Real-time status tracking, Gantt lifecycle timelines & floor tables
            </p>
          </div>
        </div>

        {/* View Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-300 bg-slate-100 p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab("gantt_timeline")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-[12px] font-bold transition cursor-pointer ${
                activeTab === "gantt_timeline"
                  ? "bg-white text-teal-800 shadow-2xs border border-slate-300"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Gantt Timeline</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("running_orders")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-[12px] font-bold transition cursor-pointer ${
                activeTab === "running_orders"
                  ? "bg-white text-teal-800 shadow-2xs border border-slate-300"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ListOrdered className="h-3.5 w-3.5" />
              <span>Summary</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("running_tables")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-[12px] font-bold transition cursor-pointer ${
                activeTab === "running_tables"
                  ? "bg-white text-teal-800 shadow-2xs border border-slate-300"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Tables ({data?.runningTables.length ?? 3})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-[12px] font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
          >
            <RefreshCw
              className={`h-3 w-3 text-slate-500 ${isFetching ? "animate-spin text-teal-600" : ""}`}
            />
            <span>{isFetching ? "Syncing..." : "Sync"}</span>
          </button>
        </div>
      </div>

      {/* 2. KPI METRIC STRIP — Clean Slate & Teal Theme */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-300 bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Orders</span>
            <span className="h-2 w-2 rounded-full bg-teal-600" />
          </div>
          <div className="mt-0.5 text-[20px] font-black text-slate-900">
            {running.totalOrders + pending.totalOrders}
          </div>
          <div className="flex items-center gap-1 text-[10.5px] text-slate-500">
            <span className="font-bold text-teal-700">{running.totalOrders} Running</span>
            <span>·</span>
            <span>{pending.totalOrders} Pending</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-300 bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Live Revenue</span>
            <span className="h-2 w-2 rounded-full bg-teal-600" />
          </div>
          <div className="mt-0.5 text-[20px] font-black text-slate-900">
            {running.totalAmountFormatted}
          </div>
          <div className="text-[10.5px] text-teal-700 font-medium">Synced in POS billing</div>
        </div>

        <div className="rounded-xl border border-slate-300 bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Kitchen</span>
            <ChefHat className="h-3.5 w-3.5 text-slate-600" />
          </div>
          <div className="mt-0.5 text-[20px] font-black text-slate-900">
            {pending.inPreparation.count + 2}
          </div>
          <div className="text-[10.5px] text-slate-500">Avg prep time: 18m</div>
        </div>

        <div className="rounded-xl border border-slate-300 bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Tables</span>
            <Utensils className="h-3.5 w-3.5 text-slate-600" />
          </div>
          <div className="mt-0.5 text-[20px] font-black text-slate-900">
            {data?.runningTables.length ?? 3} / 16
          </div>
          <div className="text-[10.5px] text-teal-700 font-medium">19% Floor Occupancy</div>
        </div>
      </div>

      {/* VIEW 1: GANTT CHART & ORDER STATUS TIMELINE */}
      {activeTab === "gantt_timeline" && (
        <div className="space-y-2.5">
          {/* Timeline Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-300 bg-white p-2.5 shadow-2xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11.5px] font-bold text-slate-700 flex items-center gap-1 mr-1">
                <Filter className="h-3 w-3" /> Type:
              </span>
              {(["all", "dine_in", "pickup", "delivery"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTimelineFilter(type)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-bold capitalize transition cursor-pointer border ${
                    timelineFilter === type
                      ? "bg-teal-700 text-white border-teal-700 shadow-2xs"
                      : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {type.replace("_", " ")}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11.5px] font-bold text-slate-700">Stage:</span>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="h-7.5 rounded-md border border-slate-300 bg-slate-50 px-2 text-[11.5px] font-medium text-slate-700 focus:border-teal-500 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Stages</option>
                <option value="placed">1. Placed (In KOT)</option>
                <option value="prepared">2. Prepared by Chef</option>
                <option value="settled">3. Settle & Done</option>
              </select>
            </div>
          </div>

          {/* TIMELINE CONTAINER: CLEAR PROCESS STEPPER WITH DISTINCT STOPS */}
          <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xs">
            {/* Table Header / Subtitle & Legend */}
            <div className="border-b border-slate-300 bg-slate-50 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-[13.5px] font-bold text-slate-900">
                    Live Order Process Stage Timeline
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Step-by-step progress tracker with stage checkpoints & fast action
                  </p>
                </div>
                {/* 2-3 Color Legend */}
                <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-700 text-white text-[9px] font-bold">
                      ✓
                    </span>
                    <span>Completed</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-teal-700 bg-teal-50 text-teal-800 text-[8px] font-bold">
                      ●
                    </span>
                    <span className="text-teal-800 font-bold">In Progress</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-400 text-[9px]">
                      ○
                    </span>
                    <span className="text-slate-500">Upcoming</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline Rows */}
            <div className="divide-y divide-slate-200">
              {filteredTimelineOrders.map((ord) => {
                const stageIdx = getStageIndex(ord.currentStage);

                return (
                  <div
                    key={ord.id}
                    className="grid grid-cols-1 lg:grid-cols-12 items-center p-3.5 hover:bg-slate-50/70 transition gap-4"
                  >
                    {/* Left 4 Cols: Order Details */}
                    <div className="lg:col-span-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[13px] font-extrabold text-slate-900">
                          {ord.orderNumber}
                        </span>
                        <span className="rounded px-2 py-0.5 text-[10.5px] font-bold border border-slate-300 bg-slate-100 text-slate-700">
                          {ord.typeLabel}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          at {ord.startTime}
                        </span>
                      </div>

                      <div className="text-[12px] font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="text-teal-900 font-bold">{ord.source}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-600 font-normal">{ord.customerName}</span>
                      </div>

                      <div className="text-[11px] text-slate-500 truncate max-w-sm">
                        {ord.itemsSummary}
                      </div>

                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[13px] font-black text-slate-900">
                          {ord.amountFormatted}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>Total Elapsed: {ord.elapsedMinutes}m</span>
                        </span>
                      </div>
                    </div>

                    {/* Right 8 Cols: 4-Stop Process Stepper & Action Bump */}
                    <div className="lg:col-span-8 flex flex-col justify-center space-y-3">
                      {/* Stepper with stops and connecting lines */}
                      <div className="relative flex items-center justify-between">
                        {STAGES_CONFIG.map((stage, idx) => {
                          const isCompleted = idx < stageIdx;
                          const isActive = idx === stageIdx;
                          const isUpcoming = idx > stageIdx;

                          return (
                            <div
                              key={stage.key}
                              className="relative z-10 flex flex-1 flex-col items-center"
                            >
                              {/* Stop Node */}
                              <div className="flex items-center justify-center">
                                {isCompleted ? (
                                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-700 text-white shadow-2xs">
                                    <Check className="h-4 w-4 stroke-[3]" />
                                  </div>
                                ) : isActive ? (
                                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-teal-700 bg-teal-50 text-teal-900 shadow-xs ring-4 ring-teal-500/20 animate-pulse">
                                    <span className="h-2.5 w-2.5 rounded-full bg-teal-700" />
                                  </div>
                                ) : (
                                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-400 text-[11px] font-bold">
                                    {idx + 1}
                                  </div>
                                )}
                              </div>

                              {/* Stop Label & Badge */}
                              <div className="mt-1.5 text-center">
                                <div
                                  className={`text-[11.5px] font-bold leading-tight ${
                                    isActive
                                      ? "text-teal-900 font-extrabold"
                                      : isCompleted
                                        ? "text-slate-800"
                                        : "text-slate-400"
                                  }`}
                                >
                                  {stage.title}
                                </div>
                                <div className="mt-0.5 text-[10px]">
                                  {isCompleted ? (
                                    <span className="font-semibold text-teal-700">✓ Done</span>
                                  ) : isActive ? (
                                    <span className="inline-flex items-center rounded-full bg-teal-50 px-1.5 py-0.2 font-bold text-teal-800 border border-teal-300">
                                      Active · {ord.elapsedMinutes}m
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 font-medium">Pending</span>
                                  )}
                                </div>
                              </div>

                              {/* Connecting Line to next stop */}
                              {idx < STAGES_CONFIG.length - 1 && (
                                <div
                                  className={`absolute left-1/2 top-3.5 -z-10 h-1 w-full -translate-y-1/2 ${
                                    idx < stageIdx
                                      ? "bg-teal-700"
                                      : idx === stageIdx
                                        ? "bg-slate-200"
                                        : "bg-slate-200"
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Action Bump & Modal trigger */}
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setSelectedTimelineOrder(ord)}
                          className="flex h-7.5 items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                        >
                          <Eye className="h-3 w-3 text-slate-500" />
                          <span>View Details</span>
                        </button>

                        {ord.currentStage !== "settled" ? (
                          <button
                            type="button"
                            onClick={(e) => handleAdvanceStage(ord.id, e)}
                            className="flex h-7.5 items-center gap-1.5 rounded-lg bg-teal-700 px-3 text-[11.5px] font-bold text-white hover:bg-teal-800 active:scale-98 transition cursor-pointer shadow-2xs"
                          >
                            <span>Advance to {STAGES_CONFIG[stageIdx + 1]?.short ?? "Next"}</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <span className="inline-flex h-7.5 items-center gap-1 rounded-lg bg-slate-100 border border-slate-300 px-3 text-[11px] font-bold text-slate-700">
                            <Check className="h-3.5 w-3.5 text-teal-700" />
                            <span>Order Fulfilled</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SUMMARY BREAKDOWN VIEW */}
      {activeTab === "running_orders" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Card 1: Running Orders */}
          <div className="rounded-xl border border-slate-300 bg-white p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13.5px] font-bold text-slate-900">
                <div className="flex h-6.5 w-6.5 items-center justify-center rounded-md bg-teal-50 border border-teal-300 text-teal-700">
                  <Utensils className="h-3.5 w-3.5" />
                </div>
                <span>Running Orders</span>
              </div>
              <span className="rounded px-2 py-0.2 text-[10.5px] font-bold text-teal-700 border border-teal-300 bg-teal-50">
                Active in POS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 rounded-lg bg-slate-50 p-2.5 border border-slate-300 text-center">
              <div className="border-r border-slate-200 pr-2">
                <div className="text-[11px] font-semibold text-slate-500">Total Orders</div>
                <div className="mt-0.5 text-[18px] font-extrabold text-slate-900">
                  {running.totalOrders}
                </div>
              </div>
              <div className="pl-2">
                <div className="text-[11px] font-semibold text-slate-500">Total Amount</div>
                <div className="mt-0.5 text-[18px] font-extrabold text-teal-700">
                  {running.totalAmountFormatted}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-0.5">
              <div
                onClick={() => setSelectedBreakdownTitle("Live Dine-in Orders (2 Active)")}
                className="flex items-center justify-between p-2 rounded-lg border border-slate-300 bg-white hover:border-teal-500 hover:shadow-2xs cursor-pointer transition"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 border border-slate-300 text-slate-700">
                    <Utensils className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-[12.5px] font-bold text-slate-900">Dine in</div>
                    <div className="text-[11px] text-slate-500">{running.dineIn.count} orders</div>
                  </div>
                </div>
                <div className="text-[13px] font-black text-slate-900">
                  {running.dineIn.amountFormatted}
                </div>
              </div>

              <div
                onClick={() => setSelectedBreakdownTitle("Live Pick-up Orders (0 Active)")}
                className="flex items-center justify-between p-2 rounded-lg border border-slate-300 bg-white hover:border-teal-500 hover:shadow-2xs cursor-pointer transition"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 border border-slate-300 text-slate-700">
                    <ShoppingBag className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-[12.5px] font-bold text-slate-900">Pick up</div>
                    <div className="text-[11px] text-slate-500">{running.pickUp.count} orders</div>
                  </div>
                </div>
                <div className="text-[13px] font-black text-slate-900">
                  {running.pickUp.amountFormatted}
                </div>
              </div>

              <div
                onClick={() => setSelectedBreakdownTitle("Live Delivery Orders (0 Active)")}
                className="flex items-center justify-between p-2 rounded-lg border border-slate-300 bg-white hover:border-teal-500 hover:shadow-2xs cursor-pointer transition"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 border border-slate-300 text-slate-700">
                    <Truck className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-[12.5px] font-bold text-slate-900">Delivery</div>
                    <div className="text-[11px] text-slate-500">
                      {running.delivery.count} orders
                    </div>
                  </div>
                </div>
                <div className="text-[13px] font-black text-slate-900">
                  {running.delivery.amountFormatted}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Pending Orders */}
          <div className="rounded-xl border border-slate-300 bg-white p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13.5px] font-bold text-slate-900">
                <div className="flex h-6.5 w-6.5 items-center justify-center rounded-md bg-slate-100 border border-slate-300 text-slate-700">
                  <ChefHat className="h-3.5 w-3.5" />
                </div>
                <span>Pending Orders</span>
              </div>
              <span className="rounded px-2 py-0.2 text-[10.5px] font-bold text-slate-700 border border-slate-300 bg-slate-100">
                In Queue
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 rounded-lg bg-slate-50 p-2.5 border border-slate-300 text-center">
              <div className="border-r border-slate-200 pr-2">
                <div className="text-[11px] font-semibold text-slate-500">Total Pending</div>
                <div className="mt-0.5 text-[18px] font-extrabold text-slate-900">
                  {pending.totalOrders}
                </div>
              </div>
              <div className="pl-2">
                <div className="text-[11px] font-semibold text-slate-500">Queue Value</div>
                <div className="mt-0.5 text-[18px] font-extrabold text-slate-900">
                  {pending.totalAmountFormatted}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-0.5">
              <div
                onClick={() => setSelectedBreakdownTitle("Orders in Preparation")}
                className="flex items-center justify-between p-2 rounded-lg border border-slate-300 bg-white hover:border-teal-500 hover:shadow-2xs cursor-pointer transition"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 border border-slate-300 text-slate-700">
                    <ChefHat className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-[12.5px] font-bold text-slate-900">In Preparation</div>
                    <div className="text-[11px] text-slate-500">
                      {pending.inPreparation.count} tickets
                    </div>
                  </div>
                </div>
                <div className="text-[13px] font-black text-slate-900">
                  {pending.inPreparation.amountFormatted}
                </div>
              </div>

              <div
                onClick={() => setSelectedBreakdownTitle("Orders Waiting For Pickup")}
                className="flex items-center justify-between p-2 rounded-lg border border-slate-300 bg-white hover:border-teal-500 hover:shadow-2xs cursor-pointer transition"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 border border-slate-300 text-slate-700">
                    <ShoppingBag className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-[12.5px] font-bold text-slate-900">Waiting For Pickup</div>
                    <div className="text-[11px] text-slate-500">
                      {pending.waitingForPickup.count} packed
                    </div>
                  </div>
                </div>
                <div className="text-[13px] font-black text-slate-900">
                  {pending.waitingForPickup.amountFormatted}
                </div>
              </div>

              <div
                onClick={() => setSelectedBreakdownTitle("Orders Out For Delivery")}
                className="flex items-center justify-between p-2 rounded-lg border border-slate-300 bg-white hover:border-teal-500 hover:shadow-2xs cursor-pointer transition"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 border border-slate-300 text-slate-700">
                    <Truck className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-[12.5px] font-bold text-slate-900">Out For Delivery</div>
                    <div className="text-[11px] text-slate-500">
                      {pending.outForDelivery.count} with riders
                    </div>
                  </div>
                </div>
                <div className="text-[13px] font-black text-slate-900">
                  {pending.outForDelivery.amountFormatted}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: FLOOR TABLES GRID */}
      {activeTab === "running_tables" && (
        <div className="rounded-xl border border-slate-300 bg-white p-3.5 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-[13.5px] font-bold text-slate-900">Active Dining Floor Grid</h2>
              <p className="text-[11px] text-slate-500">
                Real-time table occupancies, elapsed dining duration, and quick settle
              </p>
            </div>
            <span className="rounded border border-slate-300 bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-700">
              {data?.runningTables.length ?? 3} Active Tables
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 pt-1">
            {(data?.runningTables ?? []).map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTable(t)}
                className="rounded-xl border border-slate-300 bg-white p-3 shadow-2xs hover:border-teal-500 hover:shadow-xs transition cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-teal-700 font-bold text-[12px] text-white">
                      {t.tableNumber}
                    </div>
                    <div>
                      <div className="text-[12.5px] font-bold text-slate-900">
                        Table {t.tableNumber}
                      </div>
                      <div className="text-[10.5px] text-slate-500">{t.section}</div>
                    </div>
                  </div>
                  <span className="rounded px-1.5 py-0.2 text-[10px] font-bold border border-slate-300 bg-slate-100 text-slate-700">
                    {t.status === "billed" ? "Billed" : "Dining"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-1.5 text-[11.5px]">
                  <span className="text-slate-500 font-mono">{t.orderNumber}</span>
                  <span className="font-black text-slate-900 text-[13px]">{t.amountFormatted}</span>
                </div>

                <div className="flex items-center justify-between text-[10.5px] text-slate-500 bg-slate-50 rounded-md p-1.5 border border-slate-200">
                  <span>
                    Guests: <strong className="text-slate-800">{t.occupancy}</strong> / {t.capacity}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-slate-700">
                    <Clock className="h-3 w-3 text-slate-500" /> {t.elapsedMinutes}m
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: TIMELINE ORDER DETAILS */}
      {selectedTimelineOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-xl bg-white p-4.5 shadow-2xl space-y-3 border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-teal-700 font-bold text-white text-[12px]">
                  {selectedTimelineOrder.tableOrRoom ?? "POS"}
                </div>
                <div>
                  <h3 className="text-[14.5px] font-bold text-slate-900">
                    {selectedTimelineOrder.orderNumber}
                  </h3>
                  <p className="text-[11px] text-slate-500">{selectedTimelineOrder.source}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTimelineOrder(null)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-800">
                  {selectedTimelineOrder.customerName}
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500">Stage:</span>
                <span className="font-bold text-teal-800 capitalize">
                  {selectedTimelineOrder.stageLabel}
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500">Elapsed Time:</span>
                <span className="font-bold text-slate-800">
                  {selectedTimelineOrder.elapsedMinutes}m (Est:{" "}
                  {selectedTimelineOrder.estDurationMinutes}m)
                </span>
              </div>
              <div className="py-0.5">
                <span className="text-slate-500 block mb-1 font-semibold">Items:</span>
                <div className="rounded-lg bg-slate-50 p-2 text-slate-800 font-medium text-[11.5px] border border-slate-200">
                  {selectedTimelineOrder.itemsSummary}
                </div>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span className="text-slate-500 font-bold">Total Bill:</span>
                <span className="font-black text-[15px] text-teal-800">
                  {selectedTimelineOrder.amountFormatted}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  handleAdvanceStage(selectedTimelineOrder.id);
                  setSelectedTimelineOrder(null);
                }}
                className="flex items-center justify-center gap-1 rounded-lg bg-teal-700 py-2 text-[11.5px] font-bold text-white hover:bg-teal-800 cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Advance Stage</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTimelineOrder(null)}
                className="flex items-center justify-center rounded-lg border border-slate-300 py-2 text-[11.5px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SELECTED TABLE DETAILS MODAL */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-xl bg-white p-4.5 shadow-2xl space-y-3 border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-teal-700 font-bold text-white text-[13px]">
                  {selectedTable.tableNumber}
                </div>
                <div>
                  <h3 className="text-[14.5px] font-bold text-slate-900">
                    Table {selectedTable.tableNumber} ({selectedTable.section})
                  </h3>
                  <p className="text-[11px] text-slate-500">{selectedTable.orderNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTable(null)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-[12px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Seating Occupancy:</span>
                <span className="font-semibold text-slate-800">
                  {selectedTable.occupancy} of {selectedTable.capacity} Seats
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration on Table:</span>
                <span className="font-semibold text-slate-800">
                  {selectedTable.elapsedMinutes} minutes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Running Total:</span>
                <span className="font-black text-[15px] text-teal-800">
                  {selectedTable.amountFormatted}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  alert(`Generating bill for Table ${selectedTable.tableNumber}...`);
                  setSelectedTable(null);
                }}
                className="flex items-center justify-center gap-1 rounded-lg bg-teal-700 py-2 text-[11.5px] font-bold text-white hover:bg-teal-800 cursor-pointer"
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span>Settle / Bill</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Add items to Table ${selectedTable.tableNumber}`);
                  setSelectedTable(null);
                }}
                className="flex items-center justify-center gap-1 rounded-lg border border-slate-300 py-2 text-[11.5px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Items</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BREAKDOWN CATEGORY MODAL */}
      {selectedBreakdownTitle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-xl bg-white p-4 shadow-2xl space-y-2.5 border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-[13.5px] font-bold text-slate-900">{selectedBreakdownTitle}</h3>
              <button
                type="button"
                onClick={() => setSelectedBreakdownTitle(null)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Current orders in this category are synchronized with the floor management station and
              POS terminal.
            </p>
            <div className="flex justify-end pt-1.5">
              <button
                type="button"
                onClick={() => setSelectedBreakdownTitle(null)}
                className="rounded-lg bg-slate-900 px-3.5 py-1 text-[11.5px] font-bold text-white hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PosLiveOrdersManager;
