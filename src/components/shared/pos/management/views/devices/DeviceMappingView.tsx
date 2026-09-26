import { useState, useMemo } from "react";
import { Monitor, Smartphone, Tablet, Tv, Plus, CheckCircle2, Trash2, Edit2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  DataTableHeader,
  DataTableFooter,
  type DataTableColumn,
} from "@/components/common";

interface DeviceItem {
  id: string;
  name: string;
  type: "Desktop" | "Tablet" | "Display";
  ip: string;
  status: "Online" | "Offline";
  pairedDate: string;
}

export function DeviceMappingView() {
  const [devices, setDevices] = useState<DeviceItem[]>([
    {
      id: "dev-1",
      name: "Billing Terminal 1 (Windows POS)",
      type: "Desktop",
      ip: "192.168.1.101",
      status: "Online",
      pairedDate: "12 May 2026",
    },
    {
      id: "dev-2",
      name: "Captain Tablet 1 (Samsung Tab A9)",
      type: "Tablet",
      ip: "192.168.1.115",
      status: "Online",
      pairedDate: "18 May 2026",
    },
    {
      id: "dev-3",
      name: "Captain Tablet 2 (iPad 9th Gen)",
      type: "Tablet",
      ip: "192.168.1.118",
      status: "Online",
      pairedDate: "20 May 2026",
    },
    {
      id: "dev-4",
      name: "Kitchen Display System (KDS Screen)",
      type: "Display",
      ip: "192.168.1.130",
      status: "Online",
      pairedDate: "01 Jun 2026",
    },
    {
      id: "dev-5",
      name: "Bar Counter KDS Screen",
      type: "Display",
      ip: "192.168.1.132",
      status: "Online",
      pairedDate: "14 Jun 2026",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ colId: string; direction: "asc" | "desc" } | null>(null);

  const columns: DataTableColumn<DeviceItem>[] = useMemo(
    () => [
      {
        id: "name",
        label: "Device Name & Hardware Model",
        sortable: true,
        filterable: true,
        defaultWidth: 260,
        getValue: (r) => r.name,
      },
      {
        id: "type",
        label: "Type",
        sortable: true,
        filterable: true,
        defaultWidth: 140,
        getValue: (r) => r.type,
      },
      {
        id: "ip",
        label: "IP Address",
        sortable: true,
        filterable: true,
        defaultWidth: 160,
        getValue: (r) => r.ip,
      },
      {
        id: "status",
        label: "Status",
        sortable: true,
        filterable: true,
        align: "center",
        defaultWidth: 130,
        getValue: (r) => r.status,
      },
      {
        id: "pairedDate",
        label: "Paired Date",
        sortable: true,
        defaultWidth: 140,
        getValue: (r) => r.pairedDate,
      },
      {
        id: "actions",
        label: "Actions",
        sortable: false,
        filterable: false,
        align: "right",
        defaultWidth: 120,
      },
    ],
    [],
  );

  const sortedDevices = useMemo(() => {
    if (!sortConfig) return devices;
    return [...devices].sort((a, b) => {
      const field = sortConfig.colId as keyof DeviceItem;
      const aVal = a[field];
      const bVal = b[field];
      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [devices, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedDevices.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const paginatedDevices = sortedDevices.slice((validPage - 1) * pageSize, validPage * pageSize);

  const toggleSelectAll = () => {
    if (selectedIds.length === sortedDevices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedDevices.map((d) => d.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Device Mapping</h2>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Authorized POS hardware, Captain Android/iOS tablets, and kitchen display screen
            bindings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Pair New Device via OTP")}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-teal-700 transition cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" /> Pair Device
        </button>
      </div>

      <div className="rounded-2xl border border-slate-300 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <DataTableHeader
              columns={columns}
              data={sortedDevices}
              selectable
              isAllSelected={selectedIds.length === sortedDevices.length && sortedDevices.length > 0}
              isSomeSelected={selectedIds.length > 0 && selectedIds.length < sortedDevices.length}
              onToggleSelectAll={toggleSelectAll}
              sortConfig={sortConfig}
              onSortChange={setSortConfig}
              themeVariant="primary"
            />
            <tbody className="divide-y divide-slate-100">
              {paginatedDevices.map((dev) => (
                <tr key={dev.id} className="hover:bg-slate-50/50 transition">
                  <td className="w-12 px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(dev.id)}
                      onChange={() => toggleSelect(dev.id)}
                      className="rounded border-slate-300 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200 shrink-0">
                        {dev.type === "Desktop" ? (
                          <Monitor className="h-4 w-4" />
                        ) : dev.type === "Tablet" ? (
                          <Tablet className="h-4 w-4" />
                        ) : (
                          <Tv className="h-4 w-4" />
                        )}
                      </div>
                      <div className="font-bold text-[13.5px] text-slate-900">{dev.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{dev.type}</td>
                  <td className="px-4 py-3 font-mono text-[12.5px] text-slate-600">{dev.ip}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {dev.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[12px]">{dev.pairedDate}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1.5 text-slate-400">
                      <button
                        type="button"
                        onClick={() => toast.success(`Pinging device at ${dev.ip}...`)}
                        className="p-1.5 rounded-lg hover:text-teal-600 hover:bg-slate-100 transition cursor-pointer"
                        title="Ping Device"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDevices((prev) => prev.filter((d) => d.id !== dev.id));
                          toast.success(`Unpaired device ${dev.name}`);
                        }}
                        className="p-1.5 rounded-lg hover:text-red-600 hover:bg-slate-100 transition cursor-pointer"
                        title="Unpair Device"
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

        <DataTableFooter
          currentPage={validPage}
          totalCount={sortedDevices.length}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          onPageChange={setCurrentPage}
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          itemName="paired devices"
        />
      </div>
    </div>
  );
}
