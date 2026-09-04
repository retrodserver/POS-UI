import { useState } from "react";
import {
  Plus,
  Percent,
  ChevronDown,
  Edit2,
  Copy,
  QrCode,
  CheckSquare,
  Square,
  X,
} from "lucide-react";
import {
  useScheduleTables,
  useToggleScheduleTable,
  useAddScheduleTable,
} from "@/hooks/queries/usePosMenu";
import { toast } from "sonner";

export function ScheduleTablesTab() {
  const { data: tables } = useScheduleTables();
  const toggleMutation = useToggleScheduleTable();
  const addMutation = useAddScheduleTable();

  const [activeSubTab, setActiveSubTab] = useState<"Tables" | "Areas">("Tables");
  const [tableNoFilter, setTableNoFilter] = useState("");
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // New Table Modal
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [newTableNo, setNewTableNo] = useState("");
  const [newAreaName, setNewAreaName] = useState("Garden");
  const [newCapacity, setNewCapacity] = useState("4");

  const areas = ["All", ...Array.from(new Set(tables?.map((t) => t.areaName) ?? []))];

  const filteredTables = (tables ?? []).filter((t) => {
    if (tableNoFilter && !t.tableNo.toLowerCase().includes(tableNoFilter.toLowerCase())) {
      return false;
    }
    if (selectedArea !== "All" && t.areaName !== selectedArea) {
      return false;
    }
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTables.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTables.map((t) => t.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggle = (id: string, tableNo: string, current: boolean) => {
    toggleMutation.mutate(id, {
      onSuccess: () => {
        toast.success(`Table ${tableNo} is now ${!current ? "Enabled" : "Disabled"}`);
      },
    });
  };

  const handleAddTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNo.trim()) {
      toast.error("Please enter a table number/code");
      return;
    }

    addMutation.mutate(
      {
        tableNo: newTableNo.trim(),
        areaName: newAreaName,
        noOfPersons: parseInt(newCapacity) || 4,
      },
      {
        onSuccess: () => {
          toast.success(`Table ${newTableNo} added to ${newAreaName}`);
          setNewTableNo("");
          setIsAddTableOpen(false);
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* 1. Header and Actions from Screenshot 5 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-slate-500">Menu</span>
          <span className="text-[13px] text-slate-400">›</span>
          <span className="text-[14px] font-bold text-slate-900">Table Configuration</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddTableOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add New Table
          </button>
          <button
            type="button"
            onClick={() => toast.info("Area discount rule modal opened")}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
          >
            <Percent className="h-3.5 w-3.5" />
            Add Discount
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Action <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Export/Import <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Sub-tabs: Tables | Areas from Screenshot 5 */}
      <div className="flex border-b border-slate-200">
        {(["Tables", "Areas"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveSubTab(tab)}
            className={`border-b-2 px-6 py-2 text-[13px] font-bold transition cursor-pointer ${
              activeSubTab === tab
                ? "border-teal-600 text-teal-600 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Filter Bar from Screenshot 5 */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px] max-w-xs">
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">
              Table No
            </label>
            <input
              type="text"
              placeholder="Search table number..."
              value={tableNoFilter}
              onChange={(e) => setTableNoFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-1.5 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="min-w-[180px]">
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">
              Select Area
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none cursor-pointer"
            >
              {areas.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => toast.info(`Found ${filteredTables.length} tables`)}
            className="rounded-lg border border-teal-600 bg-white px-4 py-1.5 text-[12.5px] font-medium text-teal-600 hover:bg-teal-50 transition cursor-pointer"
          >
            Search
          </button>

          <button
            type="button"
            onClick={() => {
              setTableNoFilter("");
              setSelectedArea("All");
              toast.info("Showing all tables");
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Show All
          </button>
        </div>
      </div>

      {/* 4. Table Configuration Data Table from Screenshot 5 */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="w-12 px-4 py-3">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {selectedIds.length > 0 && selectedIds.length === filteredTables.length ? (
                      <CheckSquare className="h-4 w-4 text-teal-600" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3">Table No</th>
                <th className="px-4 py-3">No. Of Persons</th>
                <th className="px-4 py-3">Extra Information</th>
                <th className="px-4 py-3">Area Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Discount (%)</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTables.map((tab) => {
                const isSelected = selectedIds.includes(tab.id);
                return (
                  <tr
                    key={tab.id}
                    className={`transition hover:bg-slate-50/80 ${
                      isSelected ? "bg-teal-50/40" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(tab.id)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-teal-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-3 font-bold text-slate-900">{tab.tableNo}</td>
                    <td className="px-4 py-3 text-slate-600">{tab.noOfPersons ?? 4}</td>
                    <td className="px-4 py-3 text-slate-400 text-[12px]">{tab.extraInfo ?? "—"}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{tab.areaName}</td>

                    {/* Status Toggle Switch from Screenshot 5 */}
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggle(tab.id, tab.tableNo, tab.status)}
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition cursor-pointer ${
                          tab.status ? "bg-teal-600" : "bg-slate-300"
                        }`}
                        title="Toggle table active"
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            tab.status ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </td>

                    <td className="px-4 py-3 text-slate-600 font-mono">
                      {tab.discountPct ? `${tab.discountPct}%` : "—"}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400">
                        <button
                          type="button"
                          onClick={() => toast.success(`Duplicated table ${tab.tableNo}`)}
                          className="p-1 hover:text-teal-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Duplicate Table"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toast.info(`Editing table ${tab.tableNo}`)}
                          className="p-1 hover:text-teal-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Edit Table"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toast.info(`Dine-in QR generated for ${tab.tableNo}`)}
                          className="p-1 hover:text-teal-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Table QR Code"
                        >
                          <QrCode className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Bar matching Petpooja Screenshot 5 */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-slate-500">
          <div>
            Showing 1 to {Math.min(15, filteredTables.length)} of 47 records
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => {
                  setCurrentPage(page);
                  toast.info(`Page ${page}`);
                }}
                className={`h-7 w-7 rounded-md text-[12px] font-medium transition cursor-pointer ${
                  currentPage === page
                    ? "bg-teal-600 text-white font-bold"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setCurrentPage((p) => Math.min(4, p + 1));
                toast.info("Next page");
              }}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Next
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentPage(4);
                toast.info("Last page");
              }}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Last
            </button>
          </div>
        </div>
      </div>

      {/* Add Table Modal */}
      {isAddTableOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <h3 className="text-[16px] font-bold text-slate-900">Add New Table</h3>
              <button
                type="button"
                onClick={() => setIsAddTableOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddTableSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Table Number / Identifier <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. T-12, G51, ROOF-1"
                  value={newTableNo}
                  onChange={(e) => setNewTableNo(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-teal-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Dining Area
                </label>
                <select
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13.5px] focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="Garden">Garden</option>
                  <option value="BANQUET">BANQUET</option>
                  <option value="AC Family">AC Family</option>
                  <option value="Rooftop">Rooftop</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Capacity (No. of Persons)
                </label>
                <input
                  type="number"
                  min="1"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddTableOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-5 py-2 text-[13px] font-semibold text-white hover:bg-teal-700 shadow-xs cursor-pointer"
                >
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
