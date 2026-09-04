import { useState } from "react";
import { Plus, ShieldCheck, Edit2 } from "lucide-react";
import { toast } from "sonner";

export function AdminGroupManagementView() {
  const [groups, setGroups] = useState([
    { id: "ag-1", name: "Restaurant Owners / Partners", count: 2, permissions: "Full POS, Management, Audits, Financial Reports, Settings" },
    { id: "ag-2", name: "General Store Managers", count: 1, permissions: "Inventory, Cash Desk Closing, Recipe Modification, Staff Rosters" },
  ]);

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
            Admin Group Management
          </h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Role hierarchy and permission matrices for executive and back-office management.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Create New Admin Group")}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-teal-700 transition cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" /> Add Admin Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((g) => (
          <div key={g.id} className="rounded-2xl border border-slate-300 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[14px] text-slate-900">{g.name}</h3>
                  <div className="text-[12px] text-slate-500">{g.count} Assigned Admins</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => toast.info(`Edit ${g.name}`)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-700 transition cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Permissions
              </div>
              <p className="text-[12.5px] text-slate-600 mt-0.5 font-medium">{g.permissions}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
