import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ChevronDown,
  Calendar,
  Layers,
  PieChart,
  RefreshCw,
  Package,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ArrowDownRight,
  Plus,
  ArrowRightLeft,
  Trash2,
  Search,
  Filter,
  ShoppingCart,
  Zap,
  Activity,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  Download,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useStockItems } from "@/hooks/queries/usePosInventory";
import { CreatePurchaseModal } from "@/components/shared/pos/inventory/modals/CreatePurchaseModal";

type StockLocation = "all" | "kitchen" | "bar" | "cold_storage" | "dry_store";

interface LiveStockMovement {
  id: string;
  type: "sale" | "purchase" | "transfer" | "wastage" | "adjustment";
  item: string;
  qty: string;
  location: string;
  user: string;
  time: string;
  amount?: string;
  deltaType: "increase" | "decrease" | "neutral";
}

interface LowStockRadarItem {
  id: string;
  name: string;
  category: "Beverages" | "Dairy" | "Groceries" | "Meat & Poultry" | "Appetizers";
  currentStock: number;
  minThreshold: number;
  unit: string;
  daysRemaining: number;
  totalDays: number;
  percent: number;
  valuation: number;
  supplier: string;
  status: "critical" | "low" | "optimal";
}

export function InventoryDashboardView() {
  const navigate = useNavigate();
  const { data: stockItems, refetch: refetchStock } = useStockItems();

  // Navigation & Modal States
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<StockLocation>("all");
  const [selectedMonth, setSelectedMonth] = useState("September");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOldDashboard, setIsOldDashboard] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedDayDetail, setSelectedDayDetail] = useState<number | null>(null);

  // Real-time live status
  const [lastSyncedTime, setLastSyncedTime] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(15); // 15s default
  const [liveBannerDismissed, setLiveBannerDismissed] = useState(false);

  // Live Movements stream state (with simulated live ticks)
  const [movements, setMovements] = useState<LiveStockMovement[]>([
    {
      id: "mov-1",
      type: "sale",
      item: "Paneer Chilli Dry",
      qty: "-2 Portions",
      location: "Main Kitchen",
      user: "Biller (Counter 1)",
      time: "Just now",
      amount: "₹ 520",
      deltaType: "decrease",
    },
    {
      id: "mov-2",
      type: "sale",
      item: "Sprite (330ml Can)",
      qty: "-1 Can",
      location: "Bar Storage",
      user: "Captain Rajesh",
      time: "2m ago",
      amount: "₹ 60",
      deltaType: "decrease",
    },
    {
      id: "mov-3",
      type: "purchase",
      item: "Basmati Biryani Rice",
      qty: "+50 Kg",
      location: "Dry Goods Store",
      user: "Metro Cash & Carry",
      time: "14m ago",
      amount: "₹ 4,250",
      deltaType: "increase",
    },
    {
      id: "mov-4",
      type: "transfer",
      item: "Cooking Oil Sunflower",
      qty: "5 Litres",
      location: "Dry Store ➔ Kitchen",
      user: "Store Keeper",
      time: "26m ago",
      deltaType: "neutral",
    },
    {
      id: "mov-5",
      type: "wastage",
      item: "Tomatoes Fresh Farm",
      qty: "-0.8 Kg",
      location: "Cold Storage",
      user: "Chef Anand",
      time: "42m ago",
      amount: "₹ 35",
      deltaType: "decrease",
    },
  ]);

  // Low stock radar items
  const lowStockRadar: LowStockRadarItem[] = [
    {
      id: "ls-1",
      name: "Chicken Breast Boneless",
      category: "Meat & Poultry",
      currentStock: 1.4,
      minThreshold: 8.0,
      unit: "Kg",
      daysRemaining: 1,
      totalDays: 7,
      percent: 17,
      valuation: 420,
      supplier: "Supreme Poultry",
      status: "critical",
    },
    {
      id: "ls-2",
      name: "Amul Butter Salted",
      category: "Dairy",
      currentStock: 3,
      minThreshold: 12,
      unit: "Packets (500g)",
      daysRemaining: 2,
      totalDays: 10,
      percent: 25,
      valuation: 840,
      supplier: "Royal Dairy Suppliers",
      status: "critical",
    },
    {
      id: "ls-3",
      name: "7 Up (330ml Can)",
      category: "Beverages",
      currentStock: 6,
      minThreshold: 24,
      unit: "Cans",
      daysRemaining: 4,
      totalDays: 14,
      percent: 25,
      valuation: 360,
      supplier: "Classic Spirits",
      status: "low",
    },
    {
      id: "ls-4",
      name: "Sprite (330ml Can)",
      category: "Beverages",
      currentStock: 8,
      minThreshold: 24,
      unit: "Cans",
      daysRemaining: 5,
      totalDays: 14,
      percent: 33,
      valuation: 480,
      supplier: "Classic Spirits",
      status: "low",
    },
    {
      id: "ls-5",
      name: "Paneer Fresh Malai",
      category: "Dairy",
      currentStock: 2.5,
      minThreshold: 6.0,
      unit: "Kg",
      daysRemaining: 2,
      totalDays: 6,
      percent: 41,
      valuation: 875,
      supplier: "Royal Dairy Suppliers",
      status: "low",
    },
    {
      id: "ls-6",
      name: "Garlic (Peeled)",
      category: "Groceries",
      currentStock: 3.2,
      minThreshold: 5.0,
      unit: "Kg",
      daysRemaining: 6,
      totalDays: 10,
      percent: 64,
      valuation: 480,
      supplier: "Fresh Farm Greens",
      status: "optimal",
    },
  ];

  // Category breakdown metrics
  const categoryBreakdown = [
    { label: "Groceries", percentage: 40, valuation: "₹ 1,13,800", count: 48, color: "#38bdf8", stroke: "text-sky-400" },
    { label: "Dairy", percentage: 24, valuation: "₹ 68,280", count: 22, color: "#facc15", stroke: "text-yellow-400" },
    { label: "Beverages", percentage: 18, valuation: "₹ 51,210", count: 34, color: "#34d399", stroke: "text-emerald-400" },
    { label: "Appetizers & Meat", percentage: 12, valuation: "₹ 34,140", count: 26, color: "#fb923c", stroke: "text-orange-400" },
    { label: "Others & Spices", percentage: 6, valuation: "₹ 17,070", count: 12, color: "#c084fc", stroke: "text-purple-400" },
  ];

  // Month days setup: 30 days for September
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const currentDay = 26; // Simulated 26th September
  const missedDays = [4, 18]; // Day 4 and 18 missed
  const completedDays = Array.from({ length: 25 }, (_, i) => i + 1).filter(
    (d) => !missedDays.includes(d) && d < currentDay
  );

  // Live timer tick for seconds ago
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.floor((new Date().getTime() - lastSyncedTime.getTime()) / 1000);
      setSecondsAgo(diff);
    }, 1000);
    return () => clearInterval(timer);
  }, [lastSyncedTime]);

  // Live auto-refresh interval simulation
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;
    const interval = setInterval(() => {
      handleManualRefresh(true);
    }, autoRefreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefreshInterval]);

  const handleManualRefresh = (silent = false) => {
    setIsRefreshing(true);
    refetchStock();
    setTimeout(() => {
      setLastSyncedTime(new Date());
      setSecondsAgo(0);
      setIsRefreshing(false);
      if (!silent) {
        toast.success("Inventory stock reconciled with live POS orders");
      }
    }, 500);
  };

  const handleQuickReorder = (item: LowStockRadarItem) => {
    toast.success(`Purchase order generated for ${item.name} (${item.supplier})`, {
      description: `Qty: 10 ${item.unit} · Estimated Cost: ₹ ${(item.valuation * 2.5).toFixed(0)}`,
      action: {
        label: "View PO",
        onClick: () => navigate({ to: "/pos/inventory/purchase" }),
      },
    });
  };

  const handleReorderAllCritical = () => {
    const criticalItems = lowStockRadar.filter((i) => i.status === "critical");
    toast.success(`Batch Purchase Reorder Created for ${criticalItems.length} critical items!`, {
      description: `Dispatched to suppliers via Email/SMS alert.`,
    });
  };

  const filteredRadarItems = useMemo(() => {
    return lowStockRadar.filter((item) => {
      const matchesCategory =
        selectedCategoryFilter === "All" || item.category === selectedCategoryFilter;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [lowStockRadar, selectedCategoryFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Real-Time Top Control & Live Status Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white p-4 shadow-2xs">
        {/* Left: Live indicator + Outlet location selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Real-time pulsing badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-3 py-1 text-teal-800 text-[12px] font-bold shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600" />
            </span>
            <span>LIVE SYNC</span>
            <span className="text-teal-600/70 font-normal">
              {secondsAgo === 0 ? "Just now" : `${secondsAgo}s ago`}
            </span>
          </div>

          {/* Location filter pills */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setSelectedLocation("all")}
              className={`rounded-lg px-2.5 py-1 text-[11.5px] font-bold transition cursor-pointer ${
                selectedLocation === "all"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Storage
            </button>
            <button
              type="button"
              onClick={() => setSelectedLocation("kitchen")}
              className={`rounded-lg px-2.5 py-1 text-[11.5px] font-bold transition cursor-pointer ${
                selectedLocation === "kitchen"
                  ? "bg-white text-teal-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Main Kitchen
            </button>
            <button
              type="button"
              onClick={() => setSelectedLocation("bar")}
              className={`rounded-lg px-2.5 py-1 text-[11.5px] font-bold transition cursor-pointer ${
                selectedLocation === "bar"
                  ? "bg-white text-teal-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Bar Counter
            </button>
            <button
              type="button"
              onClick={() => setSelectedLocation("cold_storage")}
              className={`rounded-lg px-2.5 py-1 text-[11.5px] font-bold transition cursor-pointer ${
                selectedLocation === "cold_storage"
                  ? "bg-white text-teal-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Cold Storage
            </button>
          </div>
        </div>

        {/* Right: Auto-refresh mode + Speed actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Refresh Interval Selector */}
          <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
            <span className="hidden sm:inline">Auto-Sync:</span>
            <select
              value={autoRefreshInterval}
              onChange={(e) => {
                const val = Number(e.target.value);
                setAutoRefreshInterval(val);
                toast.info(val > 0 ? `Auto-sync set to ${val} seconds` : "Auto-sync paused");
              }}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11.5px] font-semibold text-slate-700 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
            >
              <option value={5}>5s (High Frequency)</option>
              <option value={15}>15s (Optimal)</option>
              <option value={30}>30s (Balanced)</option>
              <option value={0}>Manual Only</option>
            </select>
          </div>

          {/* Manual Sync Button */}
          <button
            type="button"
            onClick={() => handleManualRefresh(false)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer disabled:opacity-60"
            title="Force immediate inventory recalculation"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-teal-600 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Sync Now</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Quick Action: New Purchase / GRN */}
          <button
            type="button"
            onClick={() => setIsPurchaseModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-1.5 text-[12px] font-bold text-white shadow-2xs hover:bg-teal-700 active:scale-98 transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Receive Stock (GRN)</span>
          </button>

          {/* Stock Count shortcut */}
          <button
            type="button"
            onClick={() => navigate({ to: "/pos/inventory/closing-stock" })}
            className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50/60 px-3 py-1.5 text-[12px] font-bold text-teal-800 hover:bg-teal-100 transition cursor-pointer shadow-2xs"
          >
            <Zap className="h-3.5 w-3.5 text-teal-600" />
            <span>Stock Count</span>
          </button>
        </div>
      </div>

      {/* 2. Real-Time Emergency Alert Ticker (Dismissible) */}
      {!liveBannerDismissed && (
        <div className="relative flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-50/90 via-amber-50/50 to-orange-50/70 px-4 py-2.5 text-amber-950 shadow-2xs animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
              <Flame className="h-4 w-4" />
            </div>
            <div className="text-[12.5px]">
              <strong className="font-bold text-amber-900">Real-Time Stock Warning:</strong>{" "}
              <span>
                <strong>Chicken Breast</strong> (1.4 kg left) and <strong>Amul Butter</strong> (3 pkts left) are below safe buffer.
              </span>
              <span className="hidden md:inline ml-1 text-amber-800/80 text-[12px]">
                Estimated 1.5 days run-time before kitchen stockout.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReorderAllCritical}
              className="rounded-lg bg-amber-600 px-2.5 py-1 text-[11.5px] font-bold text-white shadow-2xs hover:bg-amber-700 active:scale-98 transition cursor-pointer"
            >
              1-Click Reorder Critical
            </button>
            <button
              type="button"
              onClick={() => setLiveBannerDismissed(true)}
              className="p-1 text-amber-700 hover:text-amber-900 rounded-md transition cursor-pointer"
              title="Dismiss warning"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Hero 4-Stat Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Stock Valuation */}
        <Link
          to="/pos/inventory/available-stock"
          className="group relative overflow-hidden rounded-2xl border border-slate-300 bg-white p-5 shadow-2xs hover:border-teal-400 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Stock Valuation
              </span>
              <div className="text-[28px] font-extrabold text-slate-900 tracking-tight">
                ₹ 2,84,500
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80 group-hover:bg-teal-600 group-hover:text-white transition duration-200">
              <Package className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[12px]">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" /> +3.4% this week
            </span>
            <span className="font-semibold text-slate-500">142 SKUs Active</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex justify-between">
            <span>Kitchen: ₹1.92L</span>
            <span>Bar: ₹92.3k</span>
          </div>
        </Link>

        {/* Card 2: Today's Real-Time Depletion / Consumption */}
        <Link
          to="/pos/inventory/reports"
          className="group relative overflow-hidden rounded-2xl border border-slate-300 bg-white p-5 shadow-2xs hover:border-blue-400 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Today's Consumption
              </span>
              <div className="text-[28px] font-extrabold text-slate-900 tracking-tight">
                ₹ 19,840
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 group-hover:bg-blue-600 group-hover:text-white transition duration-200">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[12px]">
            <span className="font-bold text-slate-700">184 Portions Served</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Normal Pace
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Top Burn: Appetizers & Dairy
          </div>
        </Link>

        {/* Card 3: Spoilage & Wastage Index */}
        <Link
          to="/pos/inventory/wastage"
          className="group relative overflow-hidden rounded-2xl border border-slate-300 bg-white p-5 shadow-2xs hover:border-rose-400 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Wastage & Spoilage
              </span>
              <div className="text-[28px] font-extrabold text-emerald-600 tracking-tight">
                1.8%
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 group-hover:bg-emerald-600 group-hover:text-white transition duration-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[12px]">
            <span className="font-semibold text-slate-600">₹ 1,420 logged today</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Target &lt; 3.0%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Prep Loss: 70% · Expired: 30%
          </div>
        </Link>

        {/* Card 4: Stock Health & Reorder Radar */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-300 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Stock Health Index
              </span>
              <div className="text-[28px] font-extrabold text-slate-900 tracking-tight">
                92% <span className="text-[14px] font-bold text-slate-500">Optimal</span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-bold text-rose-600">2 Critical</span>
              <span className="font-bold text-amber-600">3 Low Stock</span>
              <span className="font-bold text-emerald-600">137 Healthy</span>
            </div>
            <button
              type="button"
              onClick={handleReorderAllCritical}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-1.5 text-[11.5px] font-bold text-slate-700 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition cursor-pointer shadow-2xs"
            >
              Order All Low Items
            </button>
          </div>
        </div>
      </div>

      {/* 4. Main 2-Column Core Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Critical Stock Radar (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Critical Stock Radar Section */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-rose-500" />
                  <h3 className="text-[16px] font-bold text-slate-900 tracking-tight">
                    Real-Time Low Stock Radar
                  </h3>
                </div>
                <p className="text-[12.5px] text-slate-500 mt-0.5">
                  Items requiring immediate purchase order or kitchen batching.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {["All", "Meat & Poultry", "Dairy", "Beverages", "Groceries"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11.5px] font-bold transition cursor-pointer ${
                      selectedCategoryFilter === cat
                        ? "bg-teal-600 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search raw materials, dairy, spirits, or suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-[12.5px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:outline-none transition shadow-2xs"
              />
            </div>

            {/* Radar Table / List */}
            <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
              {filteredRadarItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-[13px]">
                  No low stock items matching your criteria.
                </div>
              ) : (
                filteredRadarItems.map((item) => {
                  const isCritical = item.status === "critical";
                  const isLow = item.status === "low";

                  return (
                    <div
                      key={item.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-slate-50/90 transition"
                    >
                      {/* Left info */}
                      <div className="space-y-1.5 min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[13.5px] text-slate-900 group-hover:text-teal-700 transition">
                            {item.name}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider ${
                              isCritical
                                ? "bg-rose-100 text-rose-700 border border-rose-200"
                                : isLow
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {isCritical ? "Critical" : isLow ? "Low Buffer" : "Optimal"}
                          </span>
                        </div>
                        <div className="text-[11.5px] text-slate-500 flex items-center gap-2">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>Supplier: <strong className="text-slate-700 font-semibold">{item.supplier}</strong></span>
                        </div>
                      </div>

                      {/* Middle Progress bar & Days remaining */}
                      <div className="sm:w-48 space-y-1.5">
                        <div className="flex items-center justify-between text-[11.5px]">
                          <span className="font-bold text-slate-800">
                            {item.currentStock} {item.unit}
                          </span>
                          <span className="font-medium text-slate-500">
                            {item.daysRemaining} {item.daysRemaining === 1 ? "day" : "days"} left
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCritical ? "bg-rose-500" : isLow ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(100, Math.max(8, item.percent))}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-400 text-right">
                          Min threshold: {item.minThreshold} {item.unit}
                        </div>
                      </div>

                      {/* Right Action Button */}
                      <div className="flex items-center gap-2 sm:justify-end">
                        <button
                          type="button"
                          onClick={() => handleQuickReorder(item)}
                          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-[11.5px] font-bold text-white shadow-2xs hover:bg-teal-700 active:scale-98 transition cursor-pointer"
                        >
                          <ShoppingCart className="h-3 w-3" />
                          <span>Reorder</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Real-Time Live Stock Movement Feed */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-teal-600" />
                <h3 className="text-[16px] font-bold text-slate-900 tracking-tight">
                  Real-Time Stock Movement Feed
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-600 animate-ping" />
                Live Stream
              </span>
            </div>

            <div className="space-y-3">
              {movements.map((mov) => {
                let badgeClass = "bg-blue-50 text-blue-700 border-blue-200";
                let badgeLabel = "POS SALE";
                if (mov.type === "purchase") {
                  badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
                  badgeLabel = "GRN RECEIVED";
                } else if (mov.type === "transfer") {
                  badgeClass = "bg-purple-50 text-purple-700 border-purple-200";
                  badgeLabel = "TRANSFER";
                } else if (mov.type === "wastage") {
                  badgeClass = "bg-rose-50 text-rose-700 border-rose-200";
                  badgeLabel = "WASTAGE";
                }

                return (
                  <div
                    key={mov.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${badgeClass}`}
                      >
                        {badgeLabel}
                      </span>
                      <div>
                        <div className="text-[13px] font-bold text-slate-900">{mov.item}</div>
                        <div className="text-[11px] text-slate-500">
                          {mov.location} · By {mov.user}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div
                          className={`text-[13px] font-extrabold font-mono ${
                            mov.deltaType === "increase"
                              ? "text-emerald-600"
                              : mov.deltaType === "decrease"
                              ? "text-rose-600"
                              : "text-slate-700"
                          }`}
                        >
                          {mov.qty}
                        </div>
                        {mov.amount && (
                          <div className="text-[11px] font-medium text-slate-400">{mov.amount}</div>
                        )}
                      </div>
                      <div className="text-[11px] font-medium text-slate-400 min-w-[50px]">
                        {mov.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Daily Closing Heatmap & Donut Insights (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Daily Stock Closing Tracker Card */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-2xs space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-[16px] font-bold text-slate-900 tracking-tight">
                  Daily Closing Compliance
                </h3>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Monthly physical inventory closing compliance calendar.
                </p>
              </div>

              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="appearance-none rounded-lg border border-slate-300 bg-white pl-2.5 pr-7 py-1 text-[11.5px] font-bold text-slate-700 shadow-2xs focus:outline-none cursor-pointer"
                >
                  <option value="September">Sep 2026</option>
                  <option value="August">Aug 2026</option>
                  <option value="July">Jul 2026</option>
                </select>
                <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Compliance Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
                <div className="text-[24px] font-black text-slate-900">86%</div>
                <div className="text-[11.5px] font-semibold text-slate-600">Compliance Rate</div>
                <div className="text-[10px] text-emerald-600 font-bold mt-1">23 of 25 Days Closed</div>
              </div>

              <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3.5">
                <div className="text-[24px] font-black text-rose-600">2 Days</div>
                <div className="text-[11.5px] font-semibold text-rose-800">Missed Closings</div>
                <div className="text-[10px] text-rose-600 font-bold mt-1">Sep 4, Sep 18</div>
              </div>
            </div>

            {/* 30-Day Heatmap Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11.5px] font-bold text-slate-700">
                <span>September 2026 Calendar Grid</span>
                <span className="text-[10.5px] text-slate-400">Day 1 to 30</span>
              </div>

              <div className="grid grid-cols-6 gap-1.5">
                {daysInMonth.map((day) => {
                  const isDone = completedDays.includes(day);
                  const isMissed = missedDays.includes(day);
                  const isToday = day === currentDay;
                  const isFuture = day > currentDay;

                  let cellClass = "bg-slate-100 text-slate-400 border border-transparent";
                  if (isDone) {
                    cellClass = "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-100";
                  } else if (isMissed) {
                    cellClass = "bg-rose-50 text-rose-700 border border-rose-300 font-bold hover:bg-rose-100";
                  } else if (isToday) {
                    cellClass = "bg-teal-500 text-white font-black shadow-xs ring-2 ring-teal-300 animate-pulse";
                  } else if (isFuture) {
                    cellClass = "bg-slate-50 text-slate-300 border border-slate-100";
                  }

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        setSelectedDayDetail(day);
                        if (isDone) toast.success(`Day ${day} Sep: Closing recorded by Night Shift Manager.`);
                        if (isMissed) toast.error(`Day ${day} Sep: Closing was missed. Please perform back-dated reconciliation.`);
                        if (isToday) navigate({ to: "/pos/inventory/closing-stock" });
                      }}
                      className={`flex h-9 w-full items-center justify-center rounded-lg text-[12px] transition cursor-pointer select-none ${cellClass}`}
                      title={`Day ${day}: ${isDone ? "Closed" : isMissed ? "Missed" : isToday ? "Today (Pending)" : "Upcoming"}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2 text-[10.5px] text-slate-500 border-t border-slate-100">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Done</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Missed</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-teal-500" /> Today</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-300" /> Upcoming</span>
              </div>
            </div>

            {/* Action button */}
            <button
              type="button"
              onClick={() => navigate({ to: "/pos/inventory/closing-stock" })}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-[13px] font-bold text-white shadow-2xs hover:bg-teal-700 active:scale-98 transition cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Perform Today's Closing Count</span>
            </button>
          </div>

          {/* Stock Valuation & Donut Insights Card */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-teal-600" />
                <h3 className="text-[16px] font-bold text-slate-900 tracking-tight">
                  Valuation by Category
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-500">100% Tracked</span>
            </div>

            {/* Interactive Donut Visualization */}
            <div className="flex items-center justify-center py-2">
              <div className="relative flex h-36 w-36 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                  {/* Track */}
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f1f5f9" strokeWidth="4.5" />
                  {/* Slices */}
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#38bdf8" strokeWidth="4.5" strokeDasharray="40 60" strokeDashoffset="0" />
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#facc15" strokeWidth="4.5" strokeDasharray="24 76" strokeDashoffset="-40" />
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#34d399" strokeWidth="4.5" strokeDasharray="18 82" strokeDashoffset="-64" />
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#fb923c" strokeWidth="4.5" strokeDasharray="12 88" strokeDashoffset="-82" />
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#c084fc" strokeWidth="4.5" strokeDasharray="6 94" strokeDashoffset="-94" />
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Total
                  </span>
                  <span className="text-[14px] font-black text-slate-900">₹ 2.84L</span>
                </div>
              </div>
            </div>

            {/* Category breakdown rows */}
            <div className="space-y-2 pt-2">
              {categoryBreakdown.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50 transition cursor-pointer text-[12px]"
                  onClick={() => {
                    setSelectedCategoryFilter(item.label.split(" ")[0]);
                    toast.info(`Filtered view to ${item.label}`);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-800">{item.label}</span>
                    <span className="text-[11px] text-slate-400">({item.count} items)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.valuation}</span>
                    <span className="text-[11px] text-slate-500 font-mono">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Purchase (GRN) Modal */}
      <CreatePurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </div>
  );
}
