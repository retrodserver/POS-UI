export type StockPurchaseRecord = {
  id: string;
  invoiceNo: string;
  vendorName: string;
  purchaseDate: string;
  invoiceDate: string;
  totalAmount: number;
  taxAmount: number;
  itemCount: number;
  status: "Completed" | "Draft" | "Pending";
  paymentStatus: "Paid" | "Unpaid" | "Partial";
  notes?: string;
};

export type PurchaseOrderRecord = {
  id: string;
  poNumber: string;
  vendorName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  itemCount: number;
  estimatedAmount: number;
  status: "Sent" | "Approved" | "Received" | "Cancelled" | "Draft";
  notes?: string;
};

export type PurchaseReturnRecord = {
  id: string;
  debitNoteNo: string;
  vendorName: string;
  returnDate: string;
  reason: "Damaged / Expired" | "Wrong Item" | "Excess Quantity" | "Quality Issue";
  itemCount: number;
  returnAmount: number;
  status: "Issued" | "Approved" | "Settled";
  notes?: string;
};

export type InventoryVendor = {
  id: string;
  name: string;
  phone: string;
  category: string;
};

export type StockItem = {
  id: string;
  rawMaterial: string;
  category: string;
  unit: string;
  availableStock: number;
  closingStock: number;
  newStock?: number;
  variance?: number;
  notes?: string;
};
