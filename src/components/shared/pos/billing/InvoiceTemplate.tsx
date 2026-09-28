import React from "react";
import { cn } from "@/lib/utils";
import type { PaymentEntry } from "./PaymentModal";

export interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  variant?: string;
  notes?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  orderId: string;
  outletName?: string;
  outletAddress?: string;
  gstin?: string;
  fssai?: string;
  phone?: string;
  orderType: string;
  tableOrRoom: string;
  captainName?: string;
  guestName?: string;
  guestPhone?: string;
  pax?: number;
  items: InvoiceItem[];
  subtotal: number;
  discount?: number;
  discountReason?: string;
  cgst?: number;
  sgst?: number;
  serviceCharge?: number;
  grandTotal: number;
  payments?: PaymentEntry[];
  cashTendered?: number;
  changeDue?: number;
  createdAt?: string;
}

export function InvoiceTemplate({
  invoice,
  width = "80mm",
  className,
}: {
  invoice: InvoiceData;
  width?: "80mm" | "58mm";
  className?: string;
}) {
  const is80mm = width === "80mm";
  const maxWidth = is80mm ? "max-w-[80mm] w-[80mm]" : "max-w-[58mm] w-[58mm]";

  return (
    <div
      className={cn(
        "bg-white text-black p-4 font-mono text-[11px] leading-tight border border-slate-300 shadow-sm mx-auto",
        maxWidth,
        className,
      )}
      id="printable-thermal-invoice"
    >
      {/* 1. Header Branding */}
      <div className="text-center border-b border-dashed border-black pb-2.5 space-y-0.5">
        <h1 className="font-bold text-sm tracking-wider uppercase">
          {invoice.outletName || "RETROD LUXURY POS"}
        </h1>
        <p className="text-[10px] text-slate-700">
          {invoice.outletAddress || "Luxury Hotel & Resort, F&B Division"}
        </p>
        <p className="text-[9.5px] text-slate-700">
          GSTIN: {invoice.gstin || "27AABCR8841M1ZU"} · FSSAI: {invoice.fssai || "11521008000492"}
        </p>
        {invoice.phone && <p className="text-[9.5px] text-slate-700">Tel: {invoice.phone}</p>}
        <div className="font-bold text-[11.5px] pt-1 uppercase tracking-widest">
          TAX INVOICE / CASH BILL
        </div>
      </div>

      {/* 2. Metadata: Bill No, Table/Room, Captain, Date */}
      <div className="border-b border-dashed border-black py-2 space-y-0.5 text-[10px]">
        <div className="flex justify-between">
          <span>
            Bill No: <strong>{invoice.invoiceNumber}</strong>
          </span>
          <span>Order: #{invoice.orderId.slice(-6)}</span>
        </div>
        <div className="flex justify-between">
          <span>
            {invoice.tableOrRoom.startsWith("Table") || invoice.tableOrRoom.startsWith("T-")
              ? `Table: ${invoice.tableOrRoom}`
              : invoice.tableOrRoom.startsWith("Room") || invoice.tableOrRoom.startsWith("R-")
                ? `Room: ${invoice.tableOrRoom}`
                : `Type: ${invoice.orderType}`}
          </span>
          <span>Date: {invoice.createdAt || new Date().toLocaleDateString("en-IN")}</span>
        </div>
        <div className="flex justify-between">
          <span>Server: {invoice.captainName || "Captain"}</span>
          <span>Time: {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        {invoice.guestName && (
          <div className="truncate">
            Guest: <strong>{invoice.guestName}</strong>
            {invoice.guestPhone ? ` (${invoice.guestPhone})` : ""}
          </div>
        )}
      </div>

      {/* 3. Itemized Products Table */}
      <div className="border-b border-dashed border-black py-2">
        <div className="flex justify-between font-bold border-b border-black pb-1 mb-1 text-[9.5px] uppercase">
          <span className="w-1/2">Item Description</span>
          <span className="w-1/6 text-center">Qty</span>
          <span className="w-1/6 text-right">Rate</span>
          <span className="w-1/6 text-right">Amt</span>
        </div>

        <div className="space-y-1 text-[10.5px]">
          {invoice.items.map((item, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between font-bold">
                <span className="w-1/2 truncate">{item.name}</span>
                <span className="w-1/6 text-center">{item.quantity}</span>
                <span className="w-1/6 text-right font-mono">{item.unitPrice.toFixed(2)}</span>
                <span className="w-1/6 text-right font-mono">
                  {(item.quantity * item.unitPrice).toFixed(2)}
                </span>
              </div>
              {item.variant && (
                <div className="text-[9px] text-slate-600 pl-2">
                  Variant: {item.variant}
                </div>
              )}
              {item.notes && (
                <div className="text-[9px] text-slate-600 pl-2 italic">
                  Note: {item.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Financial Calculations & Taxes */}
      <div className="border-b border-dashed border-black py-2 space-y-1 text-[10.5px]">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-bold font-mono">₹{invoice.subtotal.toFixed(2)}</span>
        </div>

        {invoice.discount && invoice.discount > 0 ? (
          <div className="flex justify-between text-slate-800">
            <span>Discount {invoice.discountReason ? `(${invoice.discountReason})` : ""}:</span>
            <span className="font-bold font-mono">-₹{invoice.discount.toFixed(2)}</span>
          </div>
        ) : null}

        {invoice.cgst ? (
          <div className="flex justify-between text-[10px]">
            <span>CGST (2.5%):</span>
            <span className="font-mono">₹{invoice.cgst.toFixed(2)}</span>
          </div>
        ) : null}

        {invoice.sgst ? (
          <div className="flex justify-between text-[10px]">
            <span>SGST (2.5%):</span>
            <span className="font-mono">₹{invoice.sgst.toFixed(2)}</span>
          </div>
        ) : null}

        {invoice.serviceCharge ? (
          <div className="flex justify-between text-[10px]">
            <span>Service Charge (5%):</span>
            <span className="font-mono">₹{invoice.serviceCharge.toFixed(2)}</span>
          </div>
        ) : null}

        <div className="pt-1 border-t border-black flex justify-between font-black text-[13px]">
          <span>GRAND TOTAL:</span>
          <span className="font-mono text-base">₹{invoice.grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* 5. Tenders & Settlement Breakdown */}
      <div className="border-b border-dashed border-black py-2 space-y-0.5 text-[10px]">
        <div className="font-bold uppercase text-[9.5px]">Payment Breakdown:</div>
        {invoice.payments && invoice.payments.length > 0 ? (
          invoice.payments.map((p, idx) => (
            <div key={idx} className="flex justify-between">
              <span>
                {p.method}
                {p.referenceNumber ? ` (${p.referenceNumber})` : ""}
                {p.roomNumber ? ` (Room ${p.roomNumber})` : ""}:
              </span>
              <span className="font-mono font-bold">₹{p.amount.toFixed(2)}</span>
            </div>
          ))
        ) : (
          <div className="flex justify-between">
            <span>Paid via Cash / Card:</span>
            <span className="font-mono font-bold">₹{invoice.grandTotal.toFixed(2)}</span>
          </div>
        )}

        {invoice.cashTendered && invoice.cashTendered > invoice.grandTotal ? (
          <>
            <div className="flex justify-between pt-0.5">
              <span>Cash Tendered:</span>
              <span className="font-mono font-bold">₹{invoice.cashTendered.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Change Returned:</span>
              <span className="font-mono">₹{(invoice.cashTendered - invoice.grandTotal).toFixed(2)}</span>
            </div>
          </>
        ) : null}
      </div>

      {/* 6. Signature / Footer */}
      <div className="pt-3 text-center space-y-1 text-[9.5px]">
        {invoice.orderType === "Room Service" || invoice.payments?.some((p) => p.method === "Room Charge") ? (
          <div className="pt-4 pb-2 border-b border-dashed border-black text-left">
            <div className="h-6" />
            <div className="text-[9px] text-center border-t border-black pt-0.5">
              Guest Room Folio Signature
            </div>
          </div>
        ) : null}

        <p className="font-bold">THANK YOU FOR DINING WITH US!</p>
        <p className="text-[9px] text-slate-600">Please visit again soon.</p>
        <p className="text-[8px] text-slate-500 pt-1">
          Powered by Retrod Hospitality Engine
        </p>
      </div>
    </div>
  );
}

export default InvoiceTemplate;
