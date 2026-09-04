import { useState } from "react";
import { Plus, Search, ChevronDown, FileText, X, Phone, Building, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useVendors } from "@/hooks/queries/usePosInventory";

export function SupplierManagementView() {
  const { data: vendors } = useVendors();

  const [nameQuery, setNameQuery] = useState("");
  const [companyQuery, setCompanyQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newVendor, setNewVendor] = useState({
    name: "",
    company: "",
    phone: "",
    category: "Groceries & Spices",
    gstin: "",
  });

  const [localVendors, setLocalVendors] = useState([
    { id: "VEND-01", name: "Ramesh Sharma", company: "Metro Fresh Farm Supplies", phone: "+91 98201 11223", category: "Vegetables & Fruits", gstin: "27AABCM1234F1Z5", balance: "₹ 12,400" },
    { id: "VEND-02", name: "Sunil Kapoor", company: "Amrit Dairy Foods Pvt Ltd", phone: "+91 98450 33445", category: "Dairy & Cheese", gstin: "27AADCA5566G1Z2", balance: "₹ 0" },
    { id: "VEND-03", name: "Pooja Malhotra", company: "Apex Beverage Distributors", phone: "+91 98110 77889", category: "Beverages & Syrups", gstin: "27AABCA9988H1Z8", balance: "₹ 5,850" },
  ]);

  const filtered = localVendors.filter((v) => {
    if (nameQuery && !v.name.toLowerCase().includes(nameQuery.toLowerCase())) return false;
    if (companyQuery && !v.company.toLowerCase().includes(companyQuery.toLowerCase())) return false;
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.name || !newVendor.company) {
      toast.error("Please provide supplier name and company.");
      return;
    }

    const created = {
      id: `VEND-0${localVendors.length + 4}`,
      name: newVendor.name,
      company: newVendor.company,
      phone: newVendor.phone || "+91 98000 00000",
      category: newVendor.category,
      gstin: newVendor.gstin || "27AAAAA0000A1Z5",
      balance: "₹ 0",
    };

    setLocalVendors([created, ...localVendors]);
    setIsCreateOpen(false);
    setNewVendor({ name: "", company: "", phone: "", category: "Groceries & Spices", gstin: "" });
    toast.success(`Supplier '${created.company}' added successfully.`);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Bar matching Screenshot 3 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
          Supplier/Third Party Management
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create New
          </button>

          <button
            type="button"
            onClick={() => toast.info("Supplier bulk action menu")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Action <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => toast.success("Exporting supplier records...")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5 text-slate-500" />
            Files <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Filter Bar matching Screenshot 3 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1 min-w-[150px] flex-1 max-w-xs">
            <label className="text-[11.5px] font-semibold text-slate-600">Name</label>
            <input
              type="text"
              placeholder=""
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1 min-w-[150px] flex-1 max-w-xs">
            <label className="text-[11.5px] font-semibold text-slate-600">Company</label>
            <input
              type="text"
              placeholder=""
              value={companyQuery}
              onChange={(e) => setCompanyQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.info(`Found ${filtered.length} suppliers`)}
              className="rounded-lg border border-teal-500 bg-white px-5 py-1.5 text-[12.5px] font-semibold text-teal-600 shadow-2xs hover:bg-teal-50 transition cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setNameQuery("");
                setCompanyQuery("");
                toast.info("Cleared filters");
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* 3. Empty State matching Screenshot 3 or Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-xs space-y-3">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300">
            <FileText className="h-10 w-10" />
          </div>
          <div className="text-[15px] font-bold text-slate-700">
            Supplier/Third Party Management Record Not Found
          </div>
          <p className="text-[12.5px] text-slate-400 max-w-sm mx-auto">
            No supplier records match your search parameters.
          </p>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-teal-700 shadow-2xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Supplier
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-slate-800">Approved Suppliers</h3>
            <span className="text-[12px] text-slate-500">{filtered.length} suppliers active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Supplier ID</th>
                  <th className="px-4 py-3">Contact Person</th>
                  <th className="px-4 py-3">Company Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">GSTIN</th>
                  <th className="px-4 py-3 text-right">Outstanding Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3 font-mono font-bold text-teal-600">{v.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{v.name}</td>
                    <td className="px-4 py-3 text-slate-800">{v.company}</td>
                    <td className="px-4 py-3 text-slate-600">{v.category}</td>
                    <td className="px-4 py-3 font-mono text-slate-600 text-[12px]">{v.phone}</td>
                    <td className="px-4 py-3 font-mono text-slate-500 text-[11.5px]">{v.gstin}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 text-right">{v.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Supplier Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-[16px] font-bold text-slate-900">Add Supplier / Third Party</h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-slate-700">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metro Fresh Farm Supplies"
                  value={newVendor.company}
                  onChange={(e) => setNewVendor({ ...newVendor, company: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-slate-700">Contact Person Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-slate-700">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98..."
                    value={newVendor.phone}
                    onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-slate-700">Category</label>
                  <select
                    value={newVendor.category}
                    onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] focus:outline-none focus:border-teal-500"
                  >
                    <option value="Vegetables & Fruits">Vegetables & Fruits</option>
                    <option value="Dairy & Cheese">Dairy & Cheese</option>
                    <option value="Beverages & Syrups">Beverages & Syrups</option>
                    <option value="Meat & Poultry">Meat & Poultry</option>
                    <option value="Groceries & Spices">Groceries & Spices</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-slate-700">GSTIN Number</label>
                <input
                  type="text"
                  placeholder="e.g. 27AABCM1234F1Z5"
                  value={newVendor.gstin}
                  onChange={(e) => setNewVendor({ ...newVendor, gstin: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
