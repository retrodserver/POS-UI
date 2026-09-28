import { useState, useMemo } from "react";
import { Monitor, Tablet, Tv, Plus, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PosDataGrid, type PosDataGridColumn } from "@/components/ui/data-grid";

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

  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const columns: PosDataGridColumn<DeviceItem>[] = useMemo(
    () => [
      {
        id: "name",
        label: "Device Name & Hardware Model",
        sortable: true,
        filterable: true,
        defaultWidth: 260,
        getValue: (r) => r.name,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200 shrink-0">
              {row.type === "Desktop" ? (
                <Monitor className="h-4 w-4" />
              ) : row.type === "Tablet" ? (
                <Tablet className="h-4 w-4" />
              ) : (
                <Tv className="h-4 w-4" />
              )}
            </div>
            <div className="font-bold text-[13.5px] text-slate-900">{row.name}</div>
          </div>
        ),
      },
      {
        id: "type",
        label: "Type",
        sortable: true,
        filterable: true,
        defaultWidth: 140,
        getValue: (r) => r.type,
        cell: ({ row }) => <span className="font-semibold text-slate-700">{row.type}</span>,
      },
      {
        id: "ip",
        label: "IP Address",
        sortable: true,
        filterable: true,
        defaultWidth: 160,
        getValue: (r) => r.ip,
        cell: ({ row }) => <span className="font-mono text-[12.5px] text-slate-600">{row.ip}</span>,
      },
      {
        id: "status",
        label: "Status",
        sortable: true,
        filterable: true,
        align: "center",
        defaultWidth: 130,
        getValue: (r) => r.status,
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {row.status}
          </span>
        ),
      },
      {
        id: "pairedDate",
        label: "Paired Date",
        sortable: true,
        defaultWidth: 140,
        getValue: (r) => r.pairedDate,
        cell: ({ row }) => <span className="text-slate-500 font-mono text-[12px]">{row.pairedDate}</span>,
      },
      {
        id: "actions",
        label: "Actions",
        sortable: false,
        filterable: false,
        align: "right",
        defaultWidth: 120,
        cell: ({ row }) => (
          <div className="inline-flex items-center gap-1.5 text-slate-400">
            <button
              type="button"
              onClick={() => toast.success(`Pinging device at ${row.ip}...`)}
              className="p-1.5 rounded-lg hover:text-teal-600 hover:bg-slate-100 transition cursor-pointer"
              title="Ping Device"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setDevices((prev) => prev.filter((d) => d.id !== row.id));
                toast.success(`Unpaired device ${row.name}`);
              }}
              className="p-1.5 rounded-lg hover:text-red-600 hover:bg-slate-100 transition cursor-pointer"
              title="Unpair Device"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

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

      <PosDataGrid
        data={devices}
        columns={columns}
        keyField="id"
        selectable
        selectedRowIds={selectedIds}
        onSelectionChange={(ids: any) => setSelectedIds(ids as string[])}
        storageKey="pos-device-mapping"
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        themeVariant="primary"
        itemName="paired devices"
      />
    </div>
  );
}
