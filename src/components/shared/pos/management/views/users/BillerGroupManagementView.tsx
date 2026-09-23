import { useState } from "react";
import { Plus, Users, Shield, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function BillerGroupManagementView() {
  const [groups, setGroups] = useState([
    {
      id: "bg-1",
      name: "Main Counter Cashiers",
      count: 2,
      permissions: "Billing, KOT, Settlement, Due Collection",
    },
    {
      id: "bg-2",
      name: "Floor Captains",
      count: 8,
      permissions: "Table Transfer, KOT Punch, Discount Request",
    },
    {
      id: "bg-3",
      name: "Order Acceptance Dispatchers",
      count: 1,
      permissions: "Aggregator Food Delivery Accept/Reject",
    },
  ]);

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
            Biller Group Management
          </h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Define role groups and granular permission templates for counter staff and service
            stewards.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Create New Biller Group")}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-teal-700 transition cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" /> Add Biller Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((g) => (
          <div
            key={g.id}
            className="rounded-2xl border border-slate-300 bg-white p-5 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[14px] text-slate-900">{g.name}</h3>
                  <div className="text-[12px] text-slate-500">{g.count} Assigned Users</div>
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
