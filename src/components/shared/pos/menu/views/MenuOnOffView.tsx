import { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  RefreshCw,
  Info,
  Layers,
  Sparkles,
  Zap,
  Check,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  Clock,
  LayoutGrid,
  Image as ImageIcon,
  CheckSquare,
  Square,
  Store,
} from "lucide-react";
import type { MenuItem } from "@/types/posMenu";
import {
  useMenuItems,
  useToggleItemPlatform,
  useBulkUpdatePlatformAvailability,
} from "@/hooks/queries/usePosMenu";
import { useOutletContext } from "@/context/PosOutletContext";
import { BulkAvailabilityModal } from "../modals/BulkAvailabilityModal";
import { toast } from "sonner";
import { PosDataGrid } from "@/components/ui/data-grid";

export function MenuOnOffView({ onBack }: { onBack?: () => void }) {
  const { activeOutlet } = useOutletContext();
  const { data: menuItems, isLoading, refetch, isFetching } = useMenuItems(activeOutlet.id);
  const togglePlatformMutation = useToggleItemPlatform();
  const bulkUpdateMutation = useBulkUpdatePlatformAvailability();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState<"All" | "Zomato" | "Swiggy" | "Direct">(
    "All",
  );
  const [availabilityFilter, setAvailabilityFilter] = useState<"All" | "Online" | "Offline">("All");

  // Multi-select bulk state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<"enable" | "disable">("enable");

  // Category options
  const categories = useMemo(() => {
    const set = new Set<string>();
    menuItems?.forEach((i) => i.category && set.add(i.category));
    return ["All", ...Array.from(set)];
  }, [menuItems]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter((item) => {
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchCode = item.code.toLowerCase().includes(query);
        const matchOnline = item.onlineDisplayName?.toLowerCase().includes(query);
        if (!matchName && !matchCode && !matchOnline) return false;
      }
      // Category
      if (categoryFilter !== "All" && item.category !== categoryFilter) {
        return false;
      }
      // Platform filter
      if (platformFilter === "Zomato" && !item.zomato) return false;
      if (platformFilter === "Swiggy" && !item.swiggy) return false;
      if (platformFilter === "Direct" && !item.direct) return false;

      // Availability filter
      const isOnlineAny = item.zomato || item.swiggy || item.direct;
      if (availabilityFilter === "Online" && !isOnlineAny) return false;
      if (availabilityFilter === "Offline" && isOnlineAny) return false;

      return true;
    });
  }, [menuItems, searchTerm, categoryFilter, platformFilter, availabilityFilter]);

  // Toggle single platform
  const handleTogglePlatform = (
    id: string,
    platform: "zomato" | "swiggy" | "direct" | "baseMenu",
    itemName: string,
    currentVal: boolean,
  ) => {
    togglePlatformMutation.mutate(
      { id, platform },
      {
        onSuccess: () => {
          const platformLabel =
            platform === "zomato"
              ? "Zomato"
              : platform === "swiggy"
                ? "Swiggy"
                : platform === "direct"
                  ? "Direct QR"
                  : "Base POS Menu";
          const nextState = !currentVal ? "Enabled (Live)" : "Disabled (Off)";
          toast.success(`"${itemName}" is now ${nextState} on ${platformLabel}`);
        },
      },
    );
  };

  // Toggle all online platforms for a single item
  const handleToggleAllOnline = (item: MenuItem) => {
    const isCurrentlyOnline = item.zomato || item.swiggy || item.direct;
    const nextVal = !isCurrentlyOnline;
    bulkUpdateMutation.mutate(
      {
        ids: [item.id],
        updates: { zomato: nextVal, swiggy: nextVal, direct: nextVal },
      },
      {
        onSuccess: () => {
          toast.success(
            `"${item.name}" is now ${nextVal ? "Turned ON" : "Turned OFF"} across all online channels`,
          );
        },
      },
    );
  };

  // Bulk Select / Deselect
  const isAllSelected = filteredItems.length > 0 && selectedIds.length === filteredItems.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((i) => i.id));
    }
  };

  const handleToggleRowSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleOpenBulkModal = (action: "enable" | "disable") => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one item first");
      return;
    }
    setBulkActionType(action);
    setIsBulkModalOpen(true);
  };

  const handleConfirmBulkAction = (platforms: {
    zomato: boolean;
    swiggy: boolean;
    direct: boolean;
  }) => {
    const updates: { zomato?: boolean; swiggy?: boolean; direct?: boolean } = {};
    const val = bulkActionType === "enable";

    if (platforms.zomato) updates.zomato = val;
    if (platforms.swiggy) updates.swiggy = val;
    if (platforms.direct) updates.direct = val;

    bulkUpdateMutation.mutate(
      { ids: selectedIds, updates },
      {
        onSuccess: () => {
          toast.success(
            `Successfully ${val ? "enabled" : "disabled"} ${selectedIds.length} items on selected channels`,
          );
          setSelectedIds([]);
          setIsBulkModalOpen(false);
        },
        onError: () => {
          toast.error("Failed to perform bulk update");
        },
      },
    );
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All");
    setPlatformFilter("All");
    setAvailabilityFilter("All");
    setSelectedIds([]);
    toast.info("Filters reset");
  };

  return (
    <div className="space-y-3">
      {/* Filter & Bulk Action Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-center">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search dishes by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-[12.5px] text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by Category"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[12.5px] font-medium text-slate-800 focus:border-teal-500 focus:outline-hidden cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>

          {/* Platform Filter */}
          <div>
            <select
              value={platformFilter}
              onChange={(e) =>
                setPlatformFilter(e.target.value as "All" | "Zomato" | "Swiggy" | "Direct")
              }
              aria-label="Filter by Platform"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[12.5px] font-medium text-slate-800 focus:border-teal-500 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Online Channels</option>
              <option value="Zomato">🔴 Live on Zomato</option>
              <option value="Swiggy">🟠 Live on Swiggy</option>
              <option value="Direct">🟢 Live on Direct QR</option>
            </select>
          </div>

          {/* Availability Status */}
          <div>
            <select
              value={availabilityFilter}
              onChange={(e) =>
                setAvailabilityFilter(e.target.value as "All" | "Online" | "Offline")
              }
              aria-label="Filter by Availability"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[12.5px] font-medium text-slate-800 focus:border-teal-500 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Availability</option>
              <option value="Online">Online Active (Any)</option>
              <option value="Offline">Offline / Disabled</option>
            </select>
          </div>
        </div>

        {/* Bulk Selection Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-[12px] font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              {isAllSelected ? (
                <CheckSquare className="h-4 w-4 text-teal-600" />
              ) : (
                <Square className="h-4 w-4 text-slate-400" />
              )}
              {isAllSelected ? "Deselect All" : "Select All Visible"}
            </button>

            {selectedIds.length > 0 && (
              <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11.5px] font-bold text-teal-800">
                {selectedIds.length} item(s) selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenBulkModal("enable")}
              disabled={selectedIds.length === 0}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-[12px] font-bold text-white shadow-2xs transition cursor-pointer disabled:opacity-40"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Bulk Enable Online
            </button>

            <button
              type="button"
              onClick={() => handleOpenBulkModal("disable")}
              disabled={selectedIds.length === 0}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-3.5 py-1.5 text-[12px] font-bold text-white shadow-2xs transition cursor-pointer disabled:opacity-40"
            >
              <XCircle className="h-3.5 w-3.5" />
              Bulk Disable Online
            </button>

            <button
              type="button"
              onClick={() => {
                refetch();
                toast.success("Refreshed online availability");
              }}
              className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin text-teal-600" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Availability Matrix PosDataGrid */}
      <PosDataGrid<MenuItem>
        data={filteredItems}
        isLoading={isLoading}
        selectedRowIds={selectedIds}
        onSelectionChange={setSelectedIds}
        enableSelection={true}
        enablePagination={true}
        pageSize={10}
        pageSizeOptions={[10, 25, 50, 100]}
        emptyMessage="No items match current availability filters"
        columns={[
          {
            id: "name",
            header: "Item & Category",
            accessorKey: "name",
            enableSorting: true,
            enableFiltering: true,
            minWidth: 260,
            cell: ({ row }) => {
              const primaryImg = row.images?.find((i) => i.isPrimary) || row.images?.[0];
              return (
                <div className="flex items-center gap-3 py-1">
                  <div className="relative h-9 w-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {primaryImg ? (
                      <img
                        src={primaryImg.url}
                        alt={row.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <ImageIcon className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          row.itemType === "Veg"
                            ? "bg-emerald-500"
                            : row.itemType === "Non-Veg"
                              ? "bg-red-500"
                              : "bg-amber-500"
                        }`}
                      />
                      <span className="font-bold text-slate-900 truncate">{row.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-mono bg-slate-100 px-1 rounded">{row.code}</span>
                      <span>•</span>
                      <span>{row.category}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">₹{row.price}</span>
                    </div>
                  </div>
                </div>
              );
            },
          },
          {
            id: "baseMenu",
            header: "Base Menu (POS)",
            align: "center",
            cell: () => (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                <Check className="h-3 w-3 stroke-[3]" />
                Active on Counter
              </span>
            ),
          },
          {
            id: "zomato",
            header: "Zomato",
            align: "center",
            enableSorting: true,
            enableFiltering: true,
            filterValueAccessor: (row) => (row.zomato ? "Live on Zomato" : "Off"),
            cell: ({ row }) => (
              <div className="inline-flex flex-col items-center gap-0.5 py-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={row.zomato}
                    onChange={() =>
                      handleTogglePlatform(row.id, "zomato", row.name, row.zomato)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                </label>
                <span
                  className={`text-[9.5px] font-bold ${
                    row.zomato ? "text-red-700" : "text-slate-400"
                  }`}
                >
                  {row.zomato ? "Zomato Live" : "Off"}
                </span>
              </div>
            ),
          },
          {
            id: "swiggy",
            header: "Swiggy",
            align: "center",
            enableSorting: true,
            enableFiltering: true,
            filterValueAccessor: (row) => (row.swiggy ? "Live on Swiggy" : "Off"),
            cell: ({ row }) => (
              <div className="inline-flex flex-col items-center gap-0.5 py-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={row.swiggy}
                    onChange={() =>
                      handleTogglePlatform(row.id, "swiggy", row.name, row.swiggy)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
                <span
                  className={`text-[9.5px] font-bold ${
                    row.swiggy ? "text-orange-700" : "text-slate-400"
                  }`}
                >
                  {row.swiggy ? "Swiggy Live" : "Off"}
                </span>
              </div>
            ),
          },
          {
            id: "direct",
            header: "Direct QR",
            align: "center",
            enableSorting: true,
            enableFiltering: true,
            filterValueAccessor: (row) => (row.direct ? "Live on Direct QR" : "Off"),
            cell: ({ row }) => (
              <div className="inline-flex flex-col items-center gap-0.5 py-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={row.direct}
                    onChange={() =>
                      handleTogglePlatform(row.id, "direct", row.name, row.direct)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
                <span
                  className={`text-[9.5px] font-bold ${
                    row.direct ? "text-teal-700" : "text-slate-400"
                  }`}
                >
                  {row.direct ? "Direct Live" : "Off"}
                </span>
              </div>
            ),
          },
          {
            id: "status",
            header: "Overall Online",
            align: "center",
            enableSorting: true,
            enableFiltering: true,
            filterValueAccessor: (row) => {
              const isAllOnline = row.zomato && row.swiggy && row.direct;
              const isNoneOnline = !row.zomato && !row.swiggy && !row.direct;
              return isAllOnline ? "All Live" : isNoneOnline ? "Turned Off" : "Partially Live";
            },
            cell: ({ row }) => {
              const isAllOnline = row.zomato && row.swiggy && row.direct;
              const isNoneOnline = !row.zomato && !row.swiggy && !row.direct;
              return isAllOnline ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  All Channels Live
                </span>
              ) : isNoneOnline ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-700 border border-red-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Turned Off Online
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Partially Live
                </span>
              );
            },
          },
          {
            id: "actions",
            header: "Quick Action",
            align: "right",
            cell: ({ row }) => {
              const isNoneOnline = !row.zomato && !row.swiggy && !row.direct;
              return (
                <button
                  type="button"
                  onClick={() => handleToggleAllOnline(row)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer border ${
                    isNoneOnline
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {isNoneOnline ? "Turn ON All" : "Turn OFF All"}
                </button>
              );
            },
          },
        ]}
      />

      {/* Bulk Availability Modal */}
      <BulkAvailabilityModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedItemIds={selectedIds}
        items={menuItems || []}
        actionType={bulkActionType}
        onConfirm={handleConfirmBulkAction}
      />
    </div>
  );
}
