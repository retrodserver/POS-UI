import { useState } from "react";
import { Plus, ChevronDown, Search, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface SubOrderTypeItem {
  id: string;
  name: string;
  type: "Default Order Type" | "Area" | "Third Party Integration";
  orderType: string;
  status: "Active" | "Inactive";
  created: string;
}

export function SubOrderTypeListView() {
  const [searchName, setSearchName] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Exact data rows matching Screenshot 2
  const [items, setItems] = useState<SubOrderTypeItem[]>([
    {
      id: "1",
      name: "Delivery",
      type: "Default Order Type",
      orderType: "Delivery",
      status: "Active",
      created: "24 May 2024",
    },
    {
      id: "2",
      name: "Pick Up",
      type: "Default Order Type",
      orderType: "Pick Up",
      status: "Active",
      created: "24 May 2024",
    },
    {
      id: "3",
      name: "Dine In",
      type: "Default Order Type",
      orderType: "Dine In",
      status: "Active",
      created: "24 May 2024",
    },
    {
      id: "4",
      name: "Bar Counter",
      type: "Area",
      orderType: "Dine In",
      status: "Active",
      created: "6 Jun 2024",
    },
    {
      id: "5",
      name: "Dining",
      type: "Area",
      orderType: "Dine In",
      status: "Active",
      created: "6 Jun 2024",
    },
    {
      id: "6",
      name: "Garden",
      type: "Area",
      orderType: "Dine In",
      status: "Active",
      created: "6 Jun 2024",
    },
    {
      id: "7",
      name: "BANQUET",
      type: "Area",
      orderType: "Dine In",
      status: "Active",
      created: "13 Sep 2024",
    },
    {
      id: "8",
      name: "Zomato",
      type: "Third Party Integration",
      orderType: "Delivery, Pick Up",
      status: "Active",
      created: "5 Oct 2024",
    },
  ]);

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchName.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* 1. Header Bar matching Screenshot 2 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Sub Order Type</h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toast.info("Opening Add Sub Order Type dialog")}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Sub Order Type
          </button>

          <button
            type="button"
            onClick={() => toast.info("Sub Order Type Actions")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Action <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Filter Bar matching Screenshot 2 */}
      <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3 max-w-xl">
          <div className="space-y-1 flex-1 min-w-[200px]">
            <label className="text-[11.5px] font-semibold text-slate-600">
              Sub Order Type Name
            </label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search name"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.info(`Found ${filteredItems.length} matching types`)}
              className="rounded-lg bg-teal-600 px-5 py-1.5 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchName("");
                toast.info("Showing all order types");
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              Show All
            </button>
          </div>
        </div>
      </div>

      {/* 3. Table matching Screenshot 2 */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11.5px] font-semibold text-slate-600">
                <th className="w-10 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === items.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Type</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Order Type</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Created</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="rounded border-slate-300 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                  <td className="px-4 py-3 text-slate-600">{item.type}</td>
                  <td className="px-4 py-3 text-slate-600">{item.orderType}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[12px]">{item.created}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1.5 text-slate-400">
                      <button
                        type="button"
                        onClick={() => toast.info(`Editing ${item.name}`)}
                        className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setItems((prev) => prev.filter((i) => i.id !== item.id));
                          toast.success(`Removed ${item.name}`);
                        }}
                        className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-red-600 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
