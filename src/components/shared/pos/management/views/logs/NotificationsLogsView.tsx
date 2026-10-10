import { useState, useMemo } from "react";
import {
  Bell,
  MessageSquare,
  Smartphone,
  Mail,
  CheckCheck,
  Clock,
  AlertCircle,
  Filter,
} from "lucide-react";
import { PosDataGrid, type PosDataGridColumn } from "@/components/ui/data-grid/PosDataGrid";

interface NotificationLogEntry {
  id: string;
  msgId: string;
  timestamp: string;
  channel: "WhatsApp" | "SMS" | "Push Notification" | "Email";
  recipient: string;
  templateType: "Bill E-Receipt" | "Order Confirmation" | "OTP Verification" | "KOT Kitchen Alert" | "Customer Feedback";
  orderRef?: string;
  status: "Delivered" | "Read" | "Pending" | "Failed";
  gatewayResponse: string;
}

const INITIAL_LOGS: NotificationLogEntry[] = [
  {
    id: "notif-001",
    msgId: "WA-904128",
    timestamp: "2026-10-09 09:35:12",
    channel: "WhatsApp",
    recipient: "+91 98765 43210 (Rahul K.)",
    templateType: "Bill E-Receipt",
    orderRef: "#RET-9041",
    status: "Read",
    gatewayResponse: "Delivered & Read (Meta Cloud API)",
  },
  {
    id: "notif-002",
    msgId: "SMS-110291",
    timestamp: "2026-10-09 09:35:10",
    channel: "SMS",
    recipient: "+91 98765 43210 (Rahul K.)",
    templateType: "Bill E-Receipt",
    orderRef: "#RET-9041",
    status: "Delivered",
    gatewayResponse: "Delivered by Airtel DLT route",
  },
  {
    id: "notif-003",
    msgId: "PSH-339180",
    timestamp: "2026-10-09 09:20:00",
    channel: "Push Notification",
    recipient: "Captain Tab #2 (Ramesh)",
    templateType: "KOT Kitchen Alert",
    orderRef: "#KOT-882",
    status: "Delivered",
    gatewayResponse: "Firebase FCM Broadcast Success",
  },
  {
    id: "notif-004",
    msgId: "WA-904127",
    timestamp: "2026-10-09 09:10:45",
    channel: "WhatsApp",
    recipient: "+91 91234 56789 (Meera S.)",
    templateType: "Order Confirmation",
    orderRef: "#RET-9040",
    status: "Delivered",
    gatewayResponse: "Delivered (Meta Cloud API)",
  },
  {
    id: "notif-005",
    msgId: "SMS-110290",
    timestamp: "2026-10-09 08:50:22",
    channel: "SMS",
    recipient: "+91 99887 76655 (Aman)",
    templateType: "OTP Verification",
    status: "Delivered",
    gatewayResponse: "Delivered via DLT FastRoute",
  },
  {
    id: "notif-006",
    msgId: "WA-904126",
    timestamp: "2026-10-08 22:30:10",
    channel: "WhatsApp",
    recipient: "+91 94000 11223 (Guest)",
    templateType: "Customer Feedback",
    orderRef: "#RET-9038",
    status: "Failed",
    gatewayResponse: "Error 131026: Customer opted out of marketing/service messages",
  },
  {
    id: "notif-007",
    msgId: "EML-55210",
    timestamp: "2026-10-08 21:00:00",
    channel: "Email",
    recipient: "finance@retrod-hospitality.com",
    templateType: "Bill E-Receipt",
    orderRef: "#RET-CORP-441",
    status: "Delivered",
    gatewayResponse: "SMTP 250 OK: Queued for delivery",
  },
];

export function NotificationsLogsView() {
  const [logs] = useState<NotificationLogEntry[]>(INITIAL_LOGS);
  const [channelFilter, setChannelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (channelFilter !== "All" && log.channel !== channelFilter) return false;
      if (statusFilter !== "All" && log.status !== statusFilter) return false;
      return true;
    });
  }, [logs, channelFilter, statusFilter]);

  const columns: PosDataGridColumn<NotificationLogEntry>[] = [
    {
      id: "msgId",
      header: "Dispatch ID",
      accessorKey: "msgId",
      sortable: true,
      defaultWidth: 140,
      render: (_, r) => (
        <span className="font-mono text-[12px] font-bold text-slate-800">{r.msgId}</span>
      ),
    },
    {
      id: "timestamp",
      header: "Timestamp",
      accessorKey: "timestamp",
      sortable: true,
      defaultWidth: 155,
      render: (_, r) => (
        <span className="font-mono text-[12px] text-slate-600 font-medium">{r.timestamp}</span>
      ),
    },
    {
      id: "channel",
      header: "Channel",
      accessorKey: "channel",
      sortable: true,
      defaultWidth: 160,
      render: (_, r) => {
        let icon = <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />;
        let style = "bg-emerald-50 text-emerald-800 border-emerald-200";
        if (r.channel === "SMS") {
          icon = <Smartphone className="h-3.5 w-3.5 text-blue-600" />;
          style = "bg-blue-50 text-blue-800 border-blue-200";
        }
        if (r.channel === "Push Notification") {
          icon = <Bell className="h-3.5 w-3.5 text-indigo-600" />;
          style = "bg-indigo-50 text-indigo-800 border-indigo-200";
        }
        if (r.channel === "Email") {
          icon = <Mail className="h-3.5 w-3.5 text-purple-600" />;
          style = "bg-purple-50 text-purple-800 border-purple-200";
        }
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-bold border ${style}`}>
            {icon}
            {r.channel}
          </span>
        );
      },
    },
    {
      id: "recipient",
      header: "Recipient / Destination",
      accessorKey: "recipient",
      defaultWidth: 220,
      render: (_, r) => (
        <div className="font-semibold text-[12px] text-slate-900 truncate">{r.recipient}</div>
      ),
    },
    {
      id: "templateType",
      header: "Template & Order",
      accessorKey: "templateType",
      sortable: true,
      defaultWidth: 190,
      render: (_, r) => (
        <div>
          <div className="font-medium text-[12px] text-slate-800">{r.templateType}</div>
          {r.orderRef && (
            <span className="font-mono text-[11px] text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
              {r.orderRef}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "status",
      header: "Delivery Status",
      accessorKey: "status",
      sortable: true,
      defaultWidth: 140,
      render: (_, r) => {
        let style = "bg-slate-100 text-slate-700 border-slate-200";
        if (r.status === "Read") style = "bg-teal-50 text-teal-800 border-teal-200 font-bold";
        if (r.status === "Delivered") style = "bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold";
        if (r.status === "Pending") style = "bg-amber-50 text-amber-800 border-amber-200";
        if (r.status === "Failed") style = "bg-rose-50 text-rose-800 border-rose-200 font-bold";
        return (
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] border ${style}`}>
            {r.status === "Read" || r.status === "Delivered" ? (
              <CheckCheck className="h-3 w-3" />
            ) : r.status === "Failed" ? (
              <AlertCircle className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            {r.status}
          </span>
        );
      },
    },
    {
      id: "gatewayResponse",
      header: "Gateway Response",
      accessorKey: "gatewayResponse",
      defaultWidth: 250,
      render: (_, r) => (
        <span className="text-[11.5px] text-slate-500 font-mono truncate block" title={r.gatewayResponse}>
          {r.gatewayResponse}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5 w-full">
      {/* Header */}
      <div>
        <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Bell className="h-5 w-5 text-teal-600" />
          Notification Dispatch Logs
        </h2>
        <p className="text-[12.5px] text-slate-500">
          Delivery tracking for digital bill receipts, WhatsApp confirmations, customer OTPs, and kitchen alert notifications.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Sent Today</span>
            <Bell className="h-4 w-4 text-teal-600" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">482 Messages</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Across all gateways</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Delivery Rate</span>
            <CheckCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-emerald-600">98.4%</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold">Healthy gateway SLA</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>WhatsApp Receipts</span>
            <MessageSquare className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">320 Sent</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">84% Read by customers</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Failed Dispatches</span>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-rose-600">3 Failed</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Customer opted out</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
        <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-700">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          Filters:
        </div>

        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="All">All Channels</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="SMS">SMS</option>
          <option value="Push Notification">Push Notification</option>
          <option value="Email">Email</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="All">All Statuses</option>
          <option value="Delivered">Delivered</option>
          <option value="Read">Read</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Main Grid */}
      <PosDataGrid
        data={filteredLogs}
        columns={columns}
        keyField="id"
        pageSize={10}
        showToolbar
        searchPlaceholder="Search recipients, message IDs, or orders..."
      />
    </div>
  );
}
