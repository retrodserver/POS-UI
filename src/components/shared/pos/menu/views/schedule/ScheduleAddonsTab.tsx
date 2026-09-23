import { useState } from "react";
import { Plus, ChevronDown, Download, Upload, Search, Layers, X } from "lucide-react";
import { toast } from "sonner";

export function ScheduleAddonsTab() {
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [addonNameFilter, setAddonNameFilter] = useState("");
  const [deptSelect, setDeptSelect] = useState("All");

  const [addonGroups, setAddonGroups] = useState<
    Array<{
      id: string;
      name: string;
      dept: string;
      minSelect: number;
      maxSelect: number;
      itemsCount: number;
    }>
  >([]);

  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDept, setNewGroupDept] = useState("Kitchen");

  const handleAddGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      toast.error("Please enter an addon group name");
      return;
    }

    const newGroup = {
      id: `ag-${Date.now()}`,
      name: newGroupName.trim(),
      dept: newGroupDept,
      minSelect: 0,
      maxSelect: 3,
      itemsCount: 4,
    };
    setAddonGroups([newGroup, ...addonGroups]);
    toast.success(`Created addon group "${newGroupName}"`);
    setNewGroupName("");
    setIsAddingGroup(false);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header and Actions from Screenshot 4 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-slate-500">Menu</span>
          <span className="text-[13px] text-slate-400">›</span>
          <span className="text-[14px] font-bold text-slate-900">Addon Management</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddingGroup(true)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add New Addon Group
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Action <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
          <button
            type="button"
            onClick={() => toast.success("Exporting addons Excel sheet...")}
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export Excel
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5 text-slate-500" />
            Import Excel <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Filter Bar from Screenshot 4 */}
      <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 items-end">
          <div className="lg:col-span-2">
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">
              Department Name
            </label>
            <input
              type="text"
              placeholder="Department..."
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">
              Addon Item Name
            </label>
            <input
              type="text"
              placeholder="Addon item..."
              value={addonNameFilter}
              onChange={(e) => setAddonNameFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11.5px] font-medium text-slate-600 mb-1">
              Search By Department
            </label>
            <select
              value={deptSelect}
              onChange={(e) => setDeptSelect(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Bar">Bar</option>
            </select>
          </div>

          <div className="flex items-center gap-2 lg:col-span-2">
            <button
              type="button"
              onClick={() => toast.info("Filter applied")}
              className="flex-1 rounded-lg bg-teal-600 px-3 py-1.5 text-[12.5px] font-medium text-white hover:bg-teal-700 transition cursor-pointer shadow-xs"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setDepartmentFilter("");
                setAddonNameFilter("");
                setDeptSelect("All");
                toast.info("Showing all addons");
              }}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Show All
            </button>
            <button
              type="button"
              onClick={() => toast.info("Rank update saved")}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Update Rank
            </button>
            <button
              type="button"
              onClick={() => toast.info("Assign Addons drawer opened")}
              className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-[12.5px] font-semibold text-teal-700 hover:bg-teal-100 transition cursor-pointer"
            >
              Assign Addons
            </button>
          </div>
        </div>
      </div>

      {/* 3. Addon Groups List or Empty State from Screenshot 4 */}
      <div className="rounded-2xl border border-slate-300 bg-white p-8 shadow-xs min-h-[380px] flex flex-col justify-center">
        {addonGroups.length === 0 ? (
          /* Empty State matching Screenshot 4 */
          <div className="text-center py-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600 mx-auto mb-3 border border-teal-200">
              <Search className="h-7 w-7" />
            </div>
            <h4 className="text-[15px] font-semibold text-slate-800">No Record Found</h4>
            <p className="text-[12.5px] text-slate-400 mt-1 max-w-sm mx-auto">
              We could not find what you searched for. Try searching again or create a new addon
              group.
            </p>
            <button
              type="button"
              onClick={() => setIsAddingGroup(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[13px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add First Addon Group
            </button>
          </div>
        ) : (
          /* Addon groups listing */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addonGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-xl border border-slate-300 bg-slate-50/50 p-4 shadow-2xs hover:bg-white transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-[14px]">{group.name}</span>
                  <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-800 border border-teal-200">
                    {group.dept}
                  </span>
                </div>
                <div className="text-[12px] text-slate-500">
                  {group.itemsCount} modifiers · Min {group.minSelect}, Max {group.maxSelect}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => toast.info(`Configuring items for ${group.name}`)}
                    className="text-[12px] font-semibold text-teal-700 hover:underline cursor-pointer"
                  >
                    Edit Modifiers →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Addon Group Modal */}
      {isAddingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <h3 className="text-[16px] font-bold text-slate-900">Add New Addon Group</h3>
              <button
                type="button"
                onClick={() => setIsAddingGroup(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddGroupSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Choice of Cheese, Extra Toppings..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-[13.5px] focus:outline-hidden focus:border-teal-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Department
                </label>
                <select
                  value={newGroupDept}
                  onChange={(e) => setNewGroupDept(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13.5px] focus:outline-hidden focus:border-teal-500 cursor-pointer"
                >
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bar">Bar</option>
                  <option value="Dessert Counter">Dessert Counter</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddingGroup(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-5 py-2 text-[13px] font-semibold text-white hover:bg-teal-700 shadow-xs cursor-pointer"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
