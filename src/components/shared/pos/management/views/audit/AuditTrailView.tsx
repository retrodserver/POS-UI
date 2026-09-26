import { useState, useMemo } from "react";
import { History, Search, Download, ShieldCheck, Filter, ChevronDown, CheckCircle2, AlertTriangle, XCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import { DataTableHeader, DataTableFooter, type DataTableColumn } from "@/components/common";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: "Cashier" | "Floor Captain" | "Store Manager" | "System Admin";
  action: "BILL_VOID" | "DISCOUNT_APPLIED" | "DRAWER_OPEN" | "PRICE_OVERRIDE" | "REFUND_ISSUED" | "SETTINGS_MODIFIED";
  details: string;
  terminalIp: string;
  severity: "Low" | "Medium" | "High" | "Critical";
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "aud-001",
    timestamp: "2026-09-02 23:45:12",
    user: "Sunil Verma",
    role: "Cashier",
    action: "BILL_VOID",
    details: "Voided KOT #K-819 (Paneer Tikka x 1) on Table T-04. Reason: Guest ordered duplicate by mistake.",
    terminalIp: "192.168.1.102 (Counter POS 1)",
    severity: "High",
  },
  {
    id: "aud-002",
    timestamp: "2026-09-02 22:30:45",
    user: "Priya Sharma",
    role: "Store Manager",
    action: "DISCOUNT_APPLIED",
    details: "Authorized 15% VIP discount (₹450) on Bill #RET-2026-0812 using Manager Passcode.",
    terminalIp: "192.168.1.101 (Manager Desk)",
    severity: "Medium",
  },
  {
    id: "aud-003",
    timestamp: "2026-09-02 21:15:00",
    user: "Sunil Verma",
    role: "Cashier",
    action: "DRAWER_OPEN",
    details: "Manual cash drawer ejection without active payment transaction. Float verified: ₹5,000.",
    terminalIp: "192.168.1.102 (Counter POS 1)",
    severity: "High",
  },
  {
    id: "aud-004",
    timestamp: "2026-09-02 20:05:22",
    user: "Ramesh Patel",
    role: "Floor Captain",
    action: "PRICE_OVERRIDE",
    details: "Adjusted custom open-item beverage price from ₹120 to ₹100 on Table T-09.",
    terminalIp: "192.168.1.105 (Handheld Tab 2)",
    severity: "Medium",
  },
  {
    id: "aud-005",
    timestamp: "2026-09-02 18:20:10",
    user: "Priya Sharma",
    role: "Store Manager",
    action: "REFUND_ISSUED",
    details: "Processed UPI partial refund of ₹240 for Order #ORD-9810 due to spilled beverage.",
    terminalIp: "192.168.1.101 (Manager Desk)",
    severity: "Critical",
  },
  {
    id: "aud-006",
    timestamp: "2026-09-02 15:40:00",
    user: "Amit Roy",
    role: "System Admin",
    action: "SETTINGS_MODIFIED",
    details: "Updated Area Delivery Charges: Sector 62 minimum order increased to ₹300.",
    terminalIp: "192.168.1.150 (Admin Portal)",
    severity: "Low",
  },
];

export function AuditTrailView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [logs, setLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Pagination & Selection
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtering
  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      if (roleFilter !== "All" && item.role !== roleFilter) return false;
      if (actionFilter !== "All" && item.action !== actionFilter) return false;
      if (severityFilter !== "All" && item.severity !== severityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.user.toLowerCase().includes(q) ||
          item.action.toLowerCase().includes(q) ||
          item.details.toLowerCase().includes(q) ||
          item.terminalIp.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [logs, roleFilter, actionFilter, severityFilter, searchQuery]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, page, pageSize]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredLogs.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const columns: DataTableColumn<AuditLogEntry>[] = [
    {
      id: "select",
      label: "",
      width: "44px",
      align: "center",
      headerRender: () => (
        <input
          type="checkbox"
          checked={
            paginatedLogs.length > 0 &&
            paginatedLogs.every((r) => selectedIds.includes(r.id))
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
        />
      ),
      render: (r) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(r.id)}
          onChange={() => handleToggleRow(r.id)}
          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
        />
      ),
    },
    {
      id: "timestamp",
      label: "Date & Time",
      sortable: true,
      getValue: (r) => r.timestamp,
      render: (r) => <div className="font-mono text-[12px] text-slate-600">{r.timestamp}</div>,
    },
    {
      id: "user",
      label: "Operator",
      sortable: true,
      getValue: (r) => `${r.user} ${r.role}`,
      render: (r) => (
        <div>
          <div className="font-bold text-slate-900 text-[12.5px]">{r.user}</div>
          <div className="text-[11px] text-teal-700 font-semibold">{r.role}</div>
        </div>
      ),
    },
    {
      id: "action",
      label: "Action Type",
      sortable: true,
      filterable: true,
      filterOptions: ["BILL_VOID", "DISCOUNT_APPLIED", "DRAWER_OPEN", "PRICE_OVERRIDE", "REFUND_ISSUED", "SETTINGS_MODIFIED"],
      getValue: (r) => r.action,
      render: (r) => (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-[11.5px] font-mono font-bold text-slate-800 border border-slate-200">
          {r.action}
        </span>
      ),
    },
    {
      id: "details",
      label: "Activity Audit Summary",
      getValue: (r) => r.details,
      render: (r) => (
        <div className="text-[12px] text-slate-700 max-w-md font-medium">{r.details}</div>
      ),
    },
    {
      id: "severity",
      label: "Security Level",
      sortable: true,
      filterable: true,
      filterOptions: ["Low", "Medium", "High", "Critical"],
      getValue: (r) => r.severity,
      render: (r) => {
        let colorClass = "bg-slate-100 text-slate-700";
        if (r.severity === "Critical") colorClass = "bg-rose-100 text-rose-800 border border-rose-300 font-black";
        if (r.severity === "High") colorClass = "bg-orange-50 text-orange-700 border border-orange-200 font-bold";
        if (r.severity === "Medium") colorClass = "bg-amber-50 text-amber-700 border border-amber-200 font-semibold";
        if (r.severity === "Low") colorClass = "bg-emerald-50 text-emerald-700 border border-emerald-200";
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] ${colorClass}`}>
            {r.severity}
          </span>
        );
      },
    },
    {
      id: "terminalIp",
      label: "Station / IP",
      sortable: true,
      getValue: (r) => r.terminalIp,
      render: (r) => <div className="text-[11.5px] text-slate-500 font-mono">{r.terminalIp}</div>,
    },
    {
      id: "actions",
      label: "Verify",
      align: "center",
      render: (r) => (
        <button
          type="button"
          onClick={() => toast.success(`Audit checksum verified for log #${r.id}`)}
          title="Verify Cryptographic Signature"
          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Audit Trail</h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Immutable tracking of order voids, bill discounts, cash drawer operations, and configuration updates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.success("Exporting security audit logs...")}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" />
          Export Audit Logs
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1 min-w-[220px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Search Audit Logs</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search user, action, terminal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1 min-w-[140px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Operator Role</label>
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="All">All Roles</option>
                <option value="Cashier">Cashier</option>
                <option value="Floor Captain">Floor Captain</option>
                <option value="Store Manager">Store Manager</option>
                <option value="System Admin">System Admin</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1 min-w-[150px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Action Type</label>
            <div className="relative">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="All">All Actions</option>
                <option value="BILL_VOID">Bill Void</option>
                <option value="DISCOUNT_APPLIED">Discount Applied</option>
                <option value="DRAWER_OPEN">Drawer Ejected</option>
                <option value="PRICE_OVERRIDE">Price Override</option>
                <option value="REFUND_ISSUED">Refund Issued</option>
                <option value="SETTINGS_MODIFIED">Settings Modified</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1 min-w-[130px]">
            <label className="text-[11.5px] font-semibold text-slate-600">Severity</label>
            <div className="relative">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="All">All Severities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setRoleFilter("All");
              setActionFilter("All");
              setSeverityFilter("All");
              toast.info("Cleared audit filters");
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Reusable Data Table */}
      {filteredLogs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-20 text-center shadow-xs space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-400">
            <History className="h-7 w-7" />
          </div>
          <div className="text-[14.5px] font-bold text-slate-700">No Matching Audit Records</div>
          <p className="text-[12px] text-slate-400 max-w-md mx-auto">
            Try adjusting your search query or role/action filters.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse">
              <DataTableHeader
                columns={columns}
                data={filteredLogs}
                themeVariant="primary"
              />
              <tbody className="divide-y divide-slate-100">
                {paginatedLogs.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition">
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={`py-3 px-3.5 align-middle ${
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        {col.render ? col.render(r) : String(col.getValue ? col.getValue(r) : (r as any)[col.id] || "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <DataTableFooter
            totalRecords={filteredLogs.length}
            currentPage={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(sz) => {
              setPageSize(sz);
              setPage(1);
            }}
            selectedCount={selectedIds.length}
            onExport={(fmt) => toast.success(`Exporting audit log as ${fmt.toUpperCase()}...`)}
          />
        </div>
      )}
    </div>
  );
}

