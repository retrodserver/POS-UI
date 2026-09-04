import type {
  StockPurchaseRecord,
  PurchaseOrderRecord,
  PurchaseReturnRecord,
  InventoryVendor,
  StockItem,
} from "@/types/posInventory";

const initialVendors: InventoryVendor[] = [
  { id: "v-1", name: "Metro Cash & Carry", phone: "+91 98200 12345", category: "Groceries & Dry Goods" },
  { id: "v-2", name: "Royal Dairy Suppliers", phone: "+91 98200 54321", category: "Dairy & Milk" },
  { id: "v-3", name: "Fresh Farm Greens & Veggies", phone: "+91 98300 11223", category: "Fresh Produce" },
  { id: "v-4", name: "Classic Spirits & Beverages", phone: "+91 98400 99887", category: "Beverages & Liquor" },
  { id: "v-5", name: "Supreme Poultry & Meat", phone: "+91 98500 44556", category: "Meat & Poultry" },
];

const initialStock: StockItem[] = [
  { id: "st-1", rawMaterial: "Garlic Chann Dry", category: "Appetizers", unit: "Dish", availableStock: 0, closingStock: 0 },
  { id: "st-2", rawMaterial: "Veg Manchuria Dry", category: "Appetizers", unit: "Dish", availableStock: 0, closingStock: 0 },
  { id: "st-3", rawMaterial: "Veg Manchuria Gravy", category: "Appetizers", unit: "Dish", availableStock: 0, closingStock: 0 },
  { id: "st-4", rawMaterial: "Paneer Chilli Dry", category: "Appetizers", unit: "Dish", availableStock: 0, closingStock: 0 },
  { id: "st-5", rawMaterial: "Chicken Crispy", category: "Non-Veg Appetizers", unit: "Dish", availableStock: 0, closingStock: 0 },
  { id: "st-6", rawMaterial: "Chicken 65", category: "Non-Veg Appetizers", unit: "Dish", availableStock: 0, closingStock: 0 },
  { id: "st-7", rawMaterial: "Basmati Biryani Rice", category: "Groceries", unit: "Kg", availableStock: 12, closingStock: 12 },
  { id: "st-8", rawMaterial: "Amul Butter Salted", category: "Dairy", unit: "Packets", availableStock: 8, closingStock: 8 },
  { id: "st-9", rawMaterial: "Cooking Oil Sunflower", category: "Groceries", unit: "Litres", availableStock: 15, closingStock: 15 },
];

let purchasesStore: StockPurchaseRecord[] = [];
let purchaseOrdersStore: PurchaseOrderRecord[] = [];
let purchaseReturnsStore: PurchaseReturnRecord[] = [];
let vendorsStore: InventoryVendor[] = [...initialVendors];
let stockStore: StockItem[] = [...initialStock];


export const posInventoryService = {
  // Vendors
  getVendors: async (): Promise<InventoryVendor[]> => [...vendorsStore],

  // Stock Purchase
  getPurchases: async (): Promise<StockPurchaseRecord[]> => [...purchasesStore],
  createPurchase: async (
    data: Omit<StockPurchaseRecord, "id">
  ): Promise<StockPurchaseRecord> => {
    const newPurchase: StockPurchaseRecord = {
      ...data,
      id: `pur-${Date.now()}`,
    };
    purchasesStore = [newPurchase, ...purchasesStore];
    return newPurchase;
  },
  deletePurchase: async (id: string): Promise<boolean> => {
    purchasesStore = purchasesStore.filter((p) => p.id !== id);
    return true;
  },

  // Purchase Order
  getPurchaseOrders: async (): Promise<PurchaseOrderRecord[]> => [...purchaseOrdersStore],
  createPurchaseOrder: async (
    data: Omit<PurchaseOrderRecord, "id">
  ): Promise<PurchaseOrderRecord> => {
    const newPO: PurchaseOrderRecord = {
      ...data,
      id: `po-${Date.now()}`,
    };
    purchaseOrdersStore = [newPO, ...purchaseOrdersStore];
    return newPO;
  },
  deletePurchaseOrder: async (id: string): Promise<boolean> => {
    purchaseOrdersStore = purchaseOrdersStore.filter((p) => p.id !== id);
    return true;
  },

  // Purchase Return
  getPurchaseReturns: async (): Promise<PurchaseReturnRecord[]> => [...purchaseReturnsStore],
  createPurchaseReturn: async (
    data: Omit<PurchaseReturnRecord, "id">
  ): Promise<PurchaseReturnRecord> => {
    const newReturn: PurchaseReturnRecord = {
      ...data,
      id: `pr-${Date.now()}`,
    };
    purchaseReturnsStore = [newReturn, ...purchaseReturnsStore];
    return newReturn;
  },
  deletePurchaseReturn: async (id: string): Promise<boolean> => {
    purchaseReturnsStore = purchaseReturnsStore.filter((p) => p.id !== id);
    return true;
  },

  // Stock Management (Available & Closing Stock)
  getStockItems: async (): Promise<StockItem[]> => [...stockStore],
  updateStockItem: async (id: string, newStock: number, notes?: string): Promise<StockItem | undefined> => {
    stockStore = stockStore.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          newStock,
          variance: newStock - item.closingStock,
          notes: notes !== undefined ? notes : item.notes,
        };
      }
      return item;
    });
    return stockStore.find((i) => i.id === id);
  },
  saveClosingStock: async (entries: { id: string; newStock: number; notes?: string }[]): Promise<boolean> => {
    entries.forEach((e) => {
      stockStore = stockStore.map((item) => {
        if (item.id === e.id) {
          return {
            ...item,
            closingStock: e.newStock,
            availableStock: e.newStock,
            newStock: undefined,
            variance: 0,
            notes: e.notes || item.notes,
          };
        }
        return item;
      });
    });
    return true;
  },
};

