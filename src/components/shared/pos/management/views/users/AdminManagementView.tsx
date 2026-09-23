import { useState } from "react";
import { Plus, Eye, Edit2, Trash2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PosDataGrid } from "@/components/ui/data-grid";
import type { DataGridColumn } from "@/components/ui/data-grid/types";

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
  const [admins, setAdmins] = useState<AdminUser[]>([
    {
      id: "adm-1",
      name: "Tofan",
      email: "raotofan53@gmail.com",
      type: "Restaurant User",
      outlet: "HIGHWAY INN BAR & RESTAURANT",
      status: "Active",
      createdDate: "20 Jun 2026",
    },
    {
      id: "adm-2",
      name: "Kailash",
      email: "restobar019@gmail.com",
      type: "Restaurant User",
      outlet: "HIGHWAY INN BAR & RESTAURANT",
      status: "Active",
      createdDate: "12 Oct 2026",
    },
    {
      id: "adm-3",
      name: "Amitabh Verma",
      email: "amitabh@retrodpos.com",
      type: "Franchise Owner",
      outlet: "All Outlets",
      status: "Active",
      createdDate: "05 Jan 2026",
    },
  ]);

  const columns: DataGridColumn<AdminUser>[] = [
    {
      id: "name",
      header: "Admin User",
      sortable: true,
      filterable: true,
      width: 180,
      render: (val: any) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
            {val.charAt(0)}
          </div>
          <span className="font-semibold text-foreground">{val}</span>
        </div>
      ),
    },
    {
      id: "email",
      header: "Email Address",
      sortable: true,
      filterable: true,
      width: 220,
      render: (val: any) => <span className="font-mono text-xs text-muted-foreground">{val}</span>,
    },
    {
      id: "type",
      header: "Role / Access Level",
      sortable: true,
      filterable: true,
      width: 170,
      render: (val: any) => (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary">
          <ShieldCheck className="h-3 w-3" />
          <span>{val}</span>
        </span>
      ),
    },
    {
      id: "outlet",
      header: "Outlet Assignment",
      sortable: true,
      filterable: true,
      width: 220,
      render: (val: any) => <span className="text-xs text-foreground font-medium">{val}</span>,
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      align: "center",
      width: 120,
      render: (val: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            val === "Active"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-slate-100 text-muted-foreground dark:bg-surface-2"
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      id: "createdDate",
      header: "Created Date",
      sortable: true,
      width: 140,
      render: (val: any) => <span className="text-muted-foreground text-xs">{val}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      width: 120,
      render: (_: any, row: AdminUser) => (
        <div className="flex items-center justify-end gap-1 text-muted-foreground">
          <button
            type="button"
            onClick={() => toast.info(`Viewing profile for ${row.name}`)}
            className="p-1 hover:text-primary hover:bg-surface-2 rounded transition cursor-pointer"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => toast.info(`Editing ${row.name}`)}
            className="p-1 hover:text-primary hover:bg-surface-2 rounded transition cursor-pointer"
            title="Edit User"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setAdmins((prev) => prev.filter((a) => a.id !== row.id));
              toast.success(`Removed admin user ${row.name}`);
            }}
            className="p-1 hover:text-red-500 hover:bg-surface-2 rounded transition cursor-pointer"
            title="Delete User"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground tracking-tight">Admin & User Access Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure franchise manager accounts, biler logins, and access permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Add Franchise Owner / Restaurant User Dialog")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 shadow-xs transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Admin User</span>
        </button>
      </div>

      {/* 2. Interactive Data Grid */}
      <PosDataGrid
        data={admins}
        columns={columns}
        keyField="id"
        title="Admin User Accounts"
        subtitle="Manage user credentials and role hierarchies"
        showToolbar
        selectable
        storageKey="pos-admin-management"
        themeVariant="primary"
        pageSize={10}
      />
    </div>
  );
}
