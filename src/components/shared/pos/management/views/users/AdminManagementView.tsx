import { useState } from "react";
import { Plus, ChevronDown, Search, Eye, Edit2, Copy, Trash2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  type: string;
  outlet: string;
  status: "Active" | "Inactive";
  createdDate: string;
}

export function AdminManagementView() {
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Exact records matching Screenshot 4
  const [admins, setAdmins] = useState<AdminUser[]>([
    {
      id: "adm-1",
      name: "Tofan",
      email: "raotofan53@gmail.com",
      type: "Restaurant User",
      outlet: "HIGHWAY INN BAR & RESTAURANT",
      status: "Active",
      createdDate: "20 Jun 2024",
    },
    {
      id: "adm-2",
      name: "Kailash",
      email: "restobar019@gmail.com",
      type: "Restaurant User",
      outlet: "HIGHWAY INN BAR & RESTAURANT",
      status: "Active",
      createdDate: "12 Oct 2024",
    },
  ]);

  const filteredAdmins = admins.filter((a) => {
    const matchName = a.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchEmail = a.email.toLowerCase().includes(emailFilter.toLowerCase());
    const matchType = typeFilter === "All" || a.type === typeFilter;
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchName && matchEmail && matchType && matchStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAdmins.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAdmins.map((a) => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {/* 1. Header matching Screenshot 4 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Admin Management</h2>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => toast.info("Add Franchise Owner / Restaurant User Dialog")}
            className="rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
          >
            Add Franchise Owner /Restaurant User
          </button>

          <button
            type="button"
            onClick={() => toast.info("Bulk Admin Actions")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            Action <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Filter Bar matching Screenshot 4 */}
      <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1 min-w-[150px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Name</label>
            <input
              type="text"
              placeholder="Search name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1 min-w-[180px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Email</label>
            <input
              type="email"
              placeholder="Search email"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1 min-w-[130px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Select Type</label>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-hidden cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Restaurant User">Restaurant User</option>
                <option value="Franchise Owner">Franchise Owner</option>
                <option value="Store Manager">Store Manager</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1 min-w-[120px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Select Status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-hidden cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="All">All</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.info(`Found ${filteredAdmins.length} admin accounts`)}
              className="rounded-lg bg-teal-600 px-5 py-1.5 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setNameFilter("");
                setEmailFilter("");
                setTypeFilter("All");
                setStatusFilter("Active");
                toast.info("Showing all admin accounts");
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              Show All
            </button>
          </div>
        </div>
      </div>

      {/* 3. Table matching Screenshot 4 */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11.5px] font-semibold text-slate-600">
                <th className="w-10 px-4 py-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredAdmins.length && filteredAdmins.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 cursor-pointer"
                  />
                </th>
                <th className="px-5 py-3.5 font-semibold text-slate-700">Name</th>
                <th className="px-5 py-3.5 font-semibold text-slate-700">Email</th>
                <th className="px-5 py-3.5 font-semibold text-slate-700">Type</th>
                <th className="px-5 py-3.5 font-semibold text-slate-700">Restaurant/Kitchen(S)</th>
                <th className="px-5 py-3.5 font-semibold text-slate-700">Status</th>
                <th className="px-5 py-3.5 font-semibold text-slate-700">Created Date</th>
                <th className="px-5 py-3.5 text-right font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAdmins.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      className="rounded border-slate-300 cursor-pointer"
                    />
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">{user.name}</td>
                  <td className="px-5 py-3.5 font-mono text-[12px] text-slate-600">{user.email}</td>
                  <td className="px-5 py-3.5 text-slate-700">{user.type}</td>
                  <td className="px-5 py-3.5 text-[12px] text-slate-600 font-medium">
                    {user.outlet}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[12px] text-slate-500">
                    {user.createdDate}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => toast.info(`View admin profile: ${user.name}`)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer"
                        title="View Profile"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.info(`Edit admin permissions: ${user.name}`)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer"
                        title="Edit Permissions"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.success(`Copied access link for ${user.name}`)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer"
                        title="Copy Credentials"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/50 text-[12px] text-slate-500">
          Showing 1 to {filteredAdmins.length} of {filteredAdmins.length} records
        </div>
      </div>
    </div>
  );
}
