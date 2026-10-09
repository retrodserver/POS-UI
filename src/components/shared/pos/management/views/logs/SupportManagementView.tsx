import { useState, useMemo } from "react";
import {
  LifeBuoy,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  PhoneCall,
  ExternalLink,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { PosDataGrid, type PosDataGridColumn } from "@/components/ui/data-grid/PosDataGrid";

interface SupportTicket {
  id: string;
  ticketNumber: string;
  timestamp: string;
  customerName: string;
  contact: string;
  orderRef?: string;
  category: "Billing Dispute" | "Delivery Delay" | "Food Quality" | "Hardware / Printer" | "Aggregator Integration";
  priority: "Urgent" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  assignedTo: string;
  summary: string;
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "tkt-001",
    ticketNumber: "RET-SUP-1082",
    timestamp: "2026-10-09 09:12:44",
    customerName: "Rahul Kapoor",
    contact: "+91 98765 43210",
    orderRef: "#RET-9041",
    category: "Billing Dispute",
    priority: "High",
    status: "Open",
    assignedTo: "Ayush Mishra",
    summary: "Customer charged twice for UPI payment; second charge pending refund.",
  },
  {
    id: "tkt-002",
    ticketNumber: "RET-SUP-1081",
    timestamp: "2026-10-09 08:45:00",
    customerName: "Counter Staff (Sunil)",
    contact: "Internal POS Terminal 1",
    category: "Hardware / Printer",
    priority: "Urgent",
    status: "In Progress",
    assignedTo: "IT Support Desk",
    summary: "KOT Thermal Printer Paper jam on station 2; paper feeder sensor reset required.",
  },
  {
    id: "tkt-003",
    ticketNumber: "RET-SUP-1080",
    timestamp: "2026-10-08 22:10:15",
    customerName: "Ananya Roy",
    contact: "+91 98112 34567",
    orderRef: "#ZOM-4491",
    category: "Delivery Delay",
    priority: "Medium",
    status: "Resolved",
    assignedTo: "Ramesh Patel",
    summary: "Rider delayed pickup by 35 mins; compensation coupon issued to customer.",
  },
  {
    id: "tkt-004",
    ticketNumber: "RET-SUP-1079",
    timestamp: "2026-10-08 19:30:20",
    customerName: "Vikram Malhotra",
    contact: "+91 99201 88321",
    orderRef: "#RET-8992",
    category: "Food Quality",
    priority: "High",
    status: "Resolved",
    assignedTo: "Chef Vikas / Store Mgr",
    summary: "Feedback on soup temperature; complimentary dessert offered on next dine-in.",
  },
  {
    id: "tkt-005",
    ticketNumber: "RET-SUP-1078",
    timestamp: "2026-10-08 15:10:00",
    customerName: "Swiggy Merchant Ops",
    contact: "merchant-ops@swiggy.in",
    category: "Aggregator Integration",
    priority: "Low",
    status: "Resolved",
    assignedTo: "IT Support Desk",
    summary: "Webhook sync delay cleared; orders back on normal realtime pipeline.",
  },
];

export function SupportManagementView() {
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (statusFilter !== "All" && t.status !== statusFilter) return false;
      if (priorityFilter !== "All" && t.priority !== priorityFilter) return false;
      return true;
    });
  }, [tickets, statusFilter, priorityFilter]);

  const handleResolve = (id: string, ticketNumber: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Resolved" as const } : t))
    );
    toast.success(`Ticket ${ticketNumber} marked as Resolved`);
  };

  const columns: PosDataGridColumn<SupportTicket>[] = [
    {
      id: "ticketNumber",
      header: "Ticket ID",
      accessorKey: "ticketNumber",
      sortable: true,
      defaultWidth: 140,
      render: (_, r) => (
        <span className="font-mono text-[12px] font-bold text-teal-700">{r.ticketNumber}</span>
      ),
    },
    {
      id: "timestamp",
      header: "Raised At",
      accessorKey: "timestamp",
      sortable: true,
      defaultWidth: 155,
      render: (_, r) => (
        <span className="font-mono text-[12px] text-slate-600 font-medium">{r.timestamp}</span>
      ),
    },
    {
      id: "customerName",
      header: "Requester / Contact",
      accessorKey: "customerName",
      sortable: true,
      defaultWidth: 190,
      render: (_, r) => (
        <div>
          <div className="font-bold text-[12.5px] text-slate-900">{r.customerName}</div>
          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
            <PhoneCall className="h-2.5 w-2.5" /> {r.contact}
          </div>
        </div>
      ),
    },
    {
      id: "category",
      header: "Category & Order",
      accessorKey: "category",
      sortable: true,
      defaultWidth: 190,
      render: (_, r) => (
        <div>
          <div className="text-[12px] font-semibold text-slate-800">{r.category}</div>
          {r.orderRef && (
            <span className="text-[11px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
              Ref: {r.orderRef}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "priority",
      header: "Priority",
      accessorKey: "priority",
      sortable: true,
      defaultWidth: 110,
      render: (_, r) => {
        let style = "bg-slate-100 text-slate-700";
        if (r.priority === "Urgent") style = "bg-rose-100 text-rose-800 border-rose-300 font-extrabold";
        if (r.priority === "High") style = "bg-orange-100 text-orange-800 border-orange-200 font-bold";
        if (r.priority === "Medium") style = "bg-amber-50 text-amber-800 border-amber-200";
        if (r.priority === "Low") style = "bg-slate-100 text-slate-700";
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] border ${style}`}>
            {r.priority}
          </span>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      sortable: true,
      defaultWidth: 125,
      render: (_, r) => {
        let style = "bg-slate-100 text-slate-700 border-slate-200";
        if (r.status === "Open") style = "bg-rose-50 text-rose-700 border-rose-200 font-bold";
        if (r.status === "In Progress") style = "bg-blue-50 text-blue-700 border-blue-200 font-bold";
        if (r.status === "Resolved") style = "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold";
        return (
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] border ${style}`}>
            {r.status === "Resolved" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            {r.status}
          </span>
        );
      },
    },
    {
      id: "summary",
      header: "Summary Notes",
      accessorKey: "summary",
      defaultWidth: 260,
      render: (_, r) => (
        <div className="text-[12px] text-slate-700 font-medium truncate max-w-sm" title={r.summary}>
          {r.summary}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Action",
      defaultWidth: 120,
      render: (_, r) => (
        <div className="flex items-center gap-1.5">
          {r.status !== "Resolved" ? (
            <button
              type="button"
              onClick={() => handleResolve(r.id, r.ticketNumber)}
              className="rounded-md bg-teal-50 border border-teal-200 px-2 py-1 text-[11px] font-bold text-teal-700 hover:bg-teal-100 transition cursor-pointer"
            >
              Resolve
            </button>
          ) : (
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Closed
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-teal-600" />
            Support Management
          </h2>
          <p className="text-[12.5px] text-slate-500">
            Handle customer disputes, kitchen escalations, hardware glitches, and integration support tickets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Create New Support Ticket form opened")}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-[12.5px] font-bold text-white hover:bg-teal-700 transition cursor-pointer shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Support Ticket
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Open Tickets</span>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-rose-600">1 Urgent</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Requires immediate response</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>In Progress</span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-blue-600">1 Ticket</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Hardware station printer</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Resolved Recently</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-emerald-600">3 Tickets</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">100% SLA met on delivery queries</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[12px] font-semibold">
            <span>Avg Resolution Time</span>
            <Clock className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-[22px] font-black text-slate-900">18 Mins</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold">Within store SLA target</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
        <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-700">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          Filters:
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="All">All Priorities</option>
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Main Grid */}
      <PosDataGrid
        data={filteredTickets}
        columns={columns}
        keyField="id"
        pageSize={10}
        showToolbar
        searchPlaceholder="Search tickets, customers, order numbers, or agents..."
      />
    </div>
  );
}
