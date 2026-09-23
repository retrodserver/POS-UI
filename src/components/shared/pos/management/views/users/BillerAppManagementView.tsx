import { useState } from "react";
import { Plus, RefreshCw, Eye, Edit2, Copy, Trash2, CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";

interface StaffUser {
  id: string;
  name: string;
  username: string;
  userCode: string;
  status: boolean;
}

export function BillerAppManagementView() {
  const [activeTab, setActiveTab] = useState<
    "biller" | "captain" | "delivery_boy" | "waiter" | "order_acceptance"
  >("biller");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 1. Biller Users (Screenshot 1)
  const [billerUsers, setBillerUsers] = useState<StaffUser[]>([
    { id: "b-1", name: "Kailash", username: "kailash", userCode: "-", status: true },
    { id: "b-2", name: "biller", username: "biller", userCode: "-", status: true },
  ]);

  // 2. Captain Users (Screenshot 2)
  const [captainUsers, setCaptainUsers] = useState<StaffUser[]>([
    { id: "c-1", name: "sanjiv", username: "sanjiv1", userCode: "9892", status: true },
    { id: "c-2", name: "RAMESH", username: "RAMESH", userCode: "2536", status: true },
    { id: "c-3", name: "SURYA", username: "SURYA", userCode: "1111", status: true },
    { id: "c-4", name: "PAPI", username: "PAPI", userCode: "1536", status: true },
    { id: "c-5", name: "papu", username: "papu", userCode: "1122", status: true },
    { id: "c-6", name: "PUJA", username: "SONI", userCode: "2255", status: true },
    { id: "c-7", name: "SOUMYA", username: "SOUMYA", userCode: "5588", status: true },
    { id: "c-8", name: "SUJIT", username: "SUJIT", userCode: "5242", status: false },
  ]);

  // 3. Delivery Boy Users
  const [deliveryUsers, setDeliveryUsers] = useState<StaffUser[]>([
    { id: "d-1", name: "Raju", username: "raju_delivery", userCode: "4011", status: true },
    { id: "d-2", name: "Mohan", username: "mohan_del", userCode: "4022", status: true },
  ]);

  // 4. Waiter Users
  const [waiterUsers, setWaiterUsers] = useState<StaffUser[]>([
    { id: "w-1", name: "Sunil", username: "sunil_waiter", userCode: "3001", status: true },
    { id: "w-2", name: "Amit", username: "amit_steward", userCode: "3002", status: true },
  ]);

  // 5. Order Acceptance App (Screenshot 3)
  const [orderAcceptanceUsers, setOrderAcceptanceUsers] = useState<StaffUser[]>([
    { id: "oa-1", name: "orderapp", username: "orderapp", userCode: "-", status: true },
  ]);

  const tabs = [
    { id: "biller", label: "Biller" },
    { id: "captain", label: "Captain" },
    { id: "delivery_boy", label: "Delivery Boy" },
    { id: "waiter", label: "Waiter" },
    { id: "order_acceptance", label: "Order Acceptance App" },
  ] as const;

  const currentList =
    activeTab === "biller"
      ? billerUsers
      : activeTab === "captain"
        ? captainUsers
        : activeTab === "delivery_boy"
          ? deliveryUsers
          : activeTab === "waiter"
            ? waiterUsers
            : orderAcceptanceUsers;

  const titleText =
    activeTab === "biller"
      ? "Biller"
      : activeTab === "captain"
        ? "Captain"
        : activeTab === "delivery_boy"
          ? "Delivery Boy"
          : activeTab === "waiter"
            ? "Waiter"
            : "Order Acceptance App";

  const toggleSelectAll = () => {
    if (selectedIds.length === currentList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentList.map((u) => u.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleStatus = (id: string) => {
    const updater = (list: StaffUser[]) =>
      list.map((u) => (u.id === id ? { ...u, status: !u.status } : u));

    if (activeTab === "biller") setBillerUsers(updater);
    else if (activeTab === "captain") setCaptainUsers(updater);
    else if (activeTab === "delivery_boy") setDeliveryUsers(updater);
    else if (activeTab === "waiter") setWaiterUsers(updater);
    else setOrderAcceptanceUsers(updater);

    toast.success("User access status updated");
  };

  return (
    <div className="space-y-4">
      {/* 1. Dynamic Header matching Screenshots 1, 2, 3 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">{titleText}</h2>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Order Acceptance specific badges (Screenshot 3) */}
          {activeTab === "order_acceptance" && (
            <>
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                App Activated
              </div>
              <button
                type="button"
                onClick={() => toast.info("Downloading Order Acceptance APK...")}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                Download App
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => toast.success("Sync code generated and dispatched via SMS")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
            Sync Code
          </button>

          <button
            type="button"
            onClick={() => toast.info(`Create new ${titleText} profile`)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create
          </button>
        </div>
      </div>

      {/* 2. Tab Navigation Bar matching Screenshots 1, 2, 3 */}
      <div className="border-b border-slate-200 flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedIds([]);
            }}
            className={`px-4 py-2.5 text-[13px] font-medium transition cursor-pointer border-b-2 ${
              activeTab === tab.id
                ? "border-teal-600 text-teal-600 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Data Table matching Screenshots 1, 2, 3 */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11.5px] font-semibold text-slate-600">
                <th className="w-10 px-4 py-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === currentList.length && currentList.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 cursor-pointer"
                  />
                </th>
                <th className="px-5 py-3.5 font-semibold text-slate-700">Biller Name</th>
                <th className="px-5 py-3.5 font-semibold text-slate-700">User Name</th>
                <th className="px-5 py-3.5 font-semibold text-slate-700">User Code</th>
                <th className="px-5 py-3.5 font-semibold text-slate-700 text-center">Status</th>
                <th className="px-5 py-3.5 text-right font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentList.map((user) => (
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
                  <td className="px-5 py-3.5 font-mono text-[12.5px] text-slate-600">
                    {user.username}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[12.5px] text-slate-700">
                    {user.userCode}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {/* Blue switch toggle */}
                    <button
                      type="button"
                      onClick={() => toggleStatus(user.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        user.status ? "bg-teal-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          user.status ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => toast.info(`View details for ${user.name}`)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.info(`Edit credentials for ${user.name}`)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.success(`Copied login credentials for ${user.name}`)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer"
                        title="Copy Credentials"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.error(`Deleted user ${user.name}`)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/50 text-[12px] text-slate-500">
          Showing 1 to {currentList.length} of {currentList.length} records
        </div>
      </div>
    </div>
  );
}
