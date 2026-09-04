import type {
  SpecialNote,
  MenuItemCommission,
  MenuItemStock,
  PhysicalMenuRecord,
  MenuScheduleItem,
  VirtualOutlet,
} from "@/types/posMenu";

const initialSpecialNotes: SpecialNote[] = [
  { id: "sn-1", name: "Percel", createdAt: "7 Jun 2024", available: true },
  { id: "sn-2", name: "Non Spice", createdAt: "7 Jun 2024", available: true },
  { id: "sn-3", name: "Spice", createdAt: "7 Jun 2024", available: true },
  { id: "sn-4", name: "More Spice", createdAt: "7 Jun 2024", available: true },
  { id: "sn-5", name: "2/4", createdAt: "7 Jun 2024", available: true },
  { id: "sn-6", name: "2/3", createdAt: "7 Jun 2024", available: true },
  { id: "sn-7", name: "1/2", createdAt: "7 Jun 2024", available: true },
  { id: "sn-8", name: "Extra Dip & Cutlery", createdAt: "12 Aug 2024", available: true },
  { id: "sn-9", name: "No Onion No Garlic", createdAt: "15 Sep 2024", available: true },
  { id: "sn-10", name: "Jain Preparation", createdAt: "20 Sep 2024", available: true },
];

const initialCommissions: MenuItemCommission[] = [
  {
    id: "mc-1",
    name: "Magic Moments Jamun 180 Ml",
    category: "Vodka",
    price: 260,
    commissionType: "Not Configured",
    commissionValue: null,
  },
  {
    id: "mc-2",
    name: "Chicken Patiyala",
    category: "Non-Veg Main Course",
    price: 280,
    commissionType: "Not Configured",
    commissionValue: null,
  },
  {
    id: "mc-3",
    name: "Magic Moments Jamun 375 Ml",
    category: "Vodka",
    price: 530,
    commissionType: "Not Configured",
    commissionValue: null,
  },
  {
    id: "mc-4",
    name: "Magic Moments Jamun 750 Ml",
    category: "Vodka",
    price: 1010,
    commissionType: "Not Configured",
    commissionValue: null,
  },
  {
    id: "mc-5",
    name: "Royal Green 375 Ml",
    category: "Indian Whisky",
    price: 530,
    commissionType: "Not Configured",
    commissionValue: null,
  },
  {
    id: "mc-6",
    name: "Butter Chicken Boneless",
    category: "Non-Veg Main Course",
    price: 360,
    commissionType: "Percentage",
    commissionValue: 5,
  },
  {
    id: "mc-7",
    name: "Paneer Butter Masala",
    category: "Veg Main Course",
    price: 240,
    commissionType: "Fixed Amount",
    commissionValue: 20,
  },
  {
    id: "mc-8",
    name: "Dal Makhani Handi",
    category: "Veg Main Course",
    price: 220,
    commissionType: "Not Configured",
    commissionValue: null,
  },
  {
    id: "mc-9",
    name: "Tandoori Murgh (Full)",
    category: "Tandoori Starters",
    price: 450,
    commissionType: "Percentage",
    commissionValue: 7.5,
  },
  {
    id: "mc-10",
    name: "Classic Virgin Mojito",
    category: "Mocktails",
    price: 160,
    commissionType: "Not Configured",
    commissionValue: null,
  },
];

const initialStockItems: MenuItemStock[] = [
  {
    id: "st-1",
    code: "BEV-001",
    name: "Magic Moments Jamun 180 Ml",
    onlineDisplayName: "Magic Moments Jamun (180ml)",
    category: "Vodka",
    price: 260,
    channel: "Online",
    platform: "Zomato",
    status: "In Stock",
    updatedAt: "10 mins ago",
  },
  {
    id: "st-2",
    code: "FD-102",
    name: "Chicken Patiyala",
    onlineDisplayName: "Chef's Special Chicken Patiala",
    category: "Non-Veg Main Course",
    price: 280,
    channel: "Online",
    platform: "Zomato",
    status: "In Stock",
    updatedAt: "1 hour ago",
  },
  {
    id: "st-3",
    code: "FD-104",
    name: "Butter Chicken Boneless",
    onlineDisplayName: "Rich Butter Chicken Boneless Gravy",
    category: "Non-Veg Main Course",
    price: 360,
    channel: "Online",
    platform: "Swiggy",
    status: "In Stock",
    updatedAt: "Yesterday",
  },
  {
    id: "st-4",
    code: "BEV-004",
    name: "Royal Green 375 Ml",
    onlineDisplayName: "Royal Green Select Whisky 375ml",
    category: "Indian Whisky",
    price: 530,
    channel: "Offline",
    platform: "All",
    status: "In Stock",
    updatedAt: "2 days ago",
  },
  {
    id: "st-5",
    code: "FD-108",
    name: "Mutton Rogan Josh",
    onlineDisplayName: "Kashmiri Mutton Rogan Josh",
    category: "Non-Veg Main Course",
    price: 480,
    channel: "Online",
    platform: "Zomato",
    status: "Out of Stock",
    nextAvailableTime: "Tomorrow 11:00 AM",
    updatedAt: "30 mins ago",
  },
  {
    id: "st-6",
    code: "FD-201",
    name: "Paneer Tikka Roll",
    onlineDisplayName: "Charcoal Grilled Paneer Roll",
    category: "Veg Starters",
    price: 190,
    channel: "DineIn QR",
    platform: "All",
    status: "In Stock",
    updatedAt: "Just now",
  },
];

const initialSchedules: MenuScheduleItem[] = [
  {
    id: "sch-1",
    title: "Base Menu",
    type: "Base Menu",
    activeRulesCount: 4,
    timingSummary: "All Days · 11:00 AM - 11:30 PM",
    status: "Active",
  },
  {
    id: "sch-2",
    title: "Home Delivery",
    type: "Home Delivery",
    activeRulesCount: 2,
    timingSummary: "Mon-Sun · 11:30 AM - 11:00 PM",
    status: "Active",
  },
  {
    id: "sch-3",
    title: "Parcel",
    type: "Parcel",
    activeRulesCount: 1,
    timingSummary: "All Day · Takeaway Counter",
    status: "Active",
  },
  {
    id: "sch-4",
    title: "Dine In",
    type: "Dine In",
    activeRulesCount: 3,
    timingSummary: "Lunch (12-4 PM) & Dinner (7-11:30 PM)",
    status: "Active",
  },
  {
    id: "sch-5",
    title: "Zomato",
    type: "Zomato",
    activeRulesCount: 2,
    timingSummary: "Aggregator Sync · Live",
    status: "Active",
  },
];

const initialVirtualOutlets: VirtualOutlet[] = [
  {
    id: "vo-1",
    name: "Highway Inn - Cloud Kitchen (BIRYANI EXPRESS)",
    code: "HI-CK01",
    cuisine: "Biryani, Kebabs & Mughlai",
    status: "Active",
    menuCount: 42,
  },
];

const initialPhysicalMenus: PhysicalMenuRecord[] = [];

const initialScheduleItems: ScheduleMenuItem[] = [
  { id: "smi-1", name: "Lemon Coriander Soup", shortCode: 39, indicators: "v+ | O | D", onlineDisplayName: "Lemon Coriander Soup", price: 140, isVeg: true, available: true, category: "Veg Soup" },
  { id: "smi-2", name: "Manchow Soup", shortCode: 40, indicators: "v+ | O | D", onlineDisplayName: "Manchow Soup", price: 140, isVeg: true, available: true, category: "Veg Soup" },
  { id: "smi-3", name: "Hot & Sour Soup", shortCode: 41, indicators: "v+ | O | D", onlineDisplayName: "Hot & Sour Soup", price: 140, isVeg: true, available: true, category: "Veg Soup" },
  { id: "smi-4", name: "Sweet Corn Soup", shortCode: 42, indicators: "v+ | O | D", onlineDisplayName: "Sweet Corn Soup", price: 140, isVeg: true, available: true, category: "Veg Soup" },
  { id: "smi-5", name: "Burnt Garlic Soup", shortCode: 43, indicators: "v+ | O | D", onlineDisplayName: "Burnt Garlic Soup", price: 140, isVeg: true, available: true, category: "Veg Soup" },
  { id: "smi-6", name: "Clear Soup", shortCode: 44, indicators: "v+ | O | D", onlineDisplayName: "Clear Soup", price: 140, isVeg: true, available: true, category: "Veg Soup" },
  { id: "smi-7", name: "Cream Of Mushroom Soup", shortCode: 45, indicators: "v+ | O | D", onlineDisplayName: "Cream Of Mushroom", price: 140, isVeg: true, available: true, category: "Veg Soup" },
  { id: "smi-8", name: "Chicken Manchow Soup", shortCode: 46, indicators: "nv | O | D", onlineDisplayName: "Chicken Manchow Soup", price: 160, isVeg: false, available: true, category: "Non-Veg Soup" },
  { id: "smi-9", name: "Chicken Sweet Corn Soup", shortCode: 47, indicators: "nv | O | D", onlineDisplayName: "Chicken Sweet Corn Soup", price: 160, isVeg: false, available: true, category: "Non-Veg Soup" },
  { id: "smi-10", name: "Paneer Tikka", shortCode: 50, indicators: "v+ | O | D", onlineDisplayName: "Paneer Tikka Classic", price: 240, isVeg: true, available: true, category: "Veg Starters" },
  { id: "smi-11", name: "Chicken Tikka", shortCode: 51, indicators: "nv | O | D", onlineDisplayName: "Tandoori Chicken Tikka", price: 290, isVeg: false, available: true, category: "Non-Veg Starters" },
  { id: "smi-12", name: "Butter Chicken Boneless", shortCode: 60, indicators: "nv | O | D", onlineDisplayName: "Butter Chicken Gravy", price: 380, isVeg: false, available: true, category: "Non-Veg Main Course" },
  { id: "smi-13", name: "Dal Makhani Handi", shortCode: 61, indicators: "v+ | O | D", onlineDisplayName: "Dal Makhani", price: 260, isVeg: true, available: true, category: "Veg Main Course" },
  { id: "smi-14", name: "Butter Naan", shortCode: 70, indicators: "v+ | O | D", onlineDisplayName: "Butter Naan", price: 60, isVeg: true, available: true, category: "Bread" },
];

const initialScheduleCategories: ScheduleCategoryItem[] = [
  { id: "scat-1", name: "Veg Soup", parentCategory: "Soup & Starters", onlineDisplayName: "Veg Soups", rank: 1, status: "Active", createdAt: "7 Jun 2024", modifiedAt: "5 Oct 2024", imageUploaded: true },
  { id: "scat-2", name: "Non-Veg Soup", parentCategory: "Soup & Starters", onlineDisplayName: "Non-Veg Soups", rank: 2, status: "Active", createdAt: "7 Jun 2024", modifiedAt: "5 Oct 2024", imageUploaded: true },
  { id: "scat-3", name: "Veg Starters", parentCategory: "Soup & Starters", onlineDisplayName: "Veg Appetizers", rank: 3, status: "Active", createdAt: "7 Jun 2024", modifiedAt: "5 Oct 2024", imageUploaded: true },
  { id: "scat-4", name: "Non-Veg Starters", parentCategory: "Soup & Starters", onlineDisplayName: "Non-Veg Appetizers", rank: 4, status: "Active", createdAt: "7 Jun 2024", modifiedAt: "5 Oct 2024", imageUploaded: true },
  { id: "scat-5", name: "Veg Main Course", onlineDisplayName: "Veg Mains", rank: 5, status: "Active", createdAt: "7 Jun 2024", modifiedAt: "5 Oct 2024", imageUploaded: false },
  { id: "scat-6", name: "Non-Veg Main Course", onlineDisplayName: "Non-Veg Mains", rank: 6, status: "Active", createdAt: "7 Jun 2024", modifiedAt: "5 Oct 2024", imageUploaded: false },
  { id: "scat-7", name: "Bread", onlineDisplayName: "Breads & Rotis", rank: 7, status: "Active", createdAt: "7 Jun 2024", modifiedAt: "5 Oct 2024", imageUploaded: false },
];

const initialScheduleVariants: ScheduleVariantItem[] = [
  { id: "svar-1", name: "Veg", onlineDisplayName: "Veg", departmentName: "HB", status: "Active", createdAt: "1 Jun 2024", modifiedAt: "1 Jun 2024" },
  { id: "svar-2", name: "Non Veg", onlineDisplayName: "Non Veg", departmentName: "HB", status: "Active", createdAt: "1 Jun 2024", modifiedAt: "1 Jun 2024" },
  { id: "svar-3", name: "180 Ml", onlineDisplayName: "Quarter (180ml)", departmentName: "Quantity", status: "Active", createdAt: "2 Jun 2024", modifiedAt: "2 Jun 2024" },
  { id: "svar-4", name: "750 Ml", onlineDisplayName: "Full Bottle (750ml)", departmentName: "Quantity", status: "Active", createdAt: "2 Jun 2024", modifiedAt: "7 Jun 2024" },
  { id: "svar-5", name: "500 Ml", onlineDisplayName: "Pint (500ml)", departmentName: "Quantity", status: "Active", createdAt: "2 Jun 2024", modifiedAt: "7 Jun 2024" },
  { id: "svar-6", name: "650 Ml", onlineDisplayName: "Large Bottle (650ml)", departmentName: "Quantity", status: "Active", createdAt: "2 Jun 2024", modifiedAt: "7 Jun 2024" },
];

const initialScheduleTables: ScheduleTableItem[] = [
  { id: "stab-1", tableNo: "BANQUET", areaName: "BANQUET", noOfPersons: 50, status: true },
  { id: "stab-2", tableNo: "G50", areaName: "Garden", noOfPersons: 4, status: true },
  { id: "stab-3", tableNo: "G49", areaName: "Garden", noOfPersons: 6, status: true },
  { id: "stab-4", tableNo: "G48", areaName: "Garden", noOfPersons: 4, status: true },
  { id: "stab-5", tableNo: "G47", areaName: "Garden", noOfPersons: 4, status: true },
  { id: "stab-6", tableNo: "T-01", areaName: "AC Family", noOfPersons: 4, status: true },
  { id: "stab-7", tableNo: "T-02", areaName: "AC Family", noOfPersons: 4, status: true },
  { id: "stab-8", tableNo: "T-03", areaName: "AC Family", noOfPersons: 8, status: true },
];

// In-memory state
let specialNotesStore = [...initialSpecialNotes];
let commissionsStore = [...initialCommissions];
let stockItemsStore = [...initialStockItems];
let schedulesStore = [...initialSchedules];
let virtualOutletsStore = [...initialVirtualOutlets];
let physicalMenusStore = [...initialPhysicalMenus];
let scheduleItemsStore = [...initialScheduleItems];
let scheduleCategoriesStore = [...initialScheduleCategories];
let scheduleVariantsStore = [...initialScheduleVariants];
let scheduleTablesStore = [...initialScheduleTables];

export const posMenuService = {
  getSpecialNotes: async () => [...specialNotesStore],
  addSpecialNote: async (name: string, available = true) => {
    const newNote: SpecialNote = {
      id: `sn-${Date.now()}`,
      name,
      createdAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      available,
    };
    specialNotesStore = [newNote, ...specialNotesStore];
    return newNote;
  },
  toggleSpecialNote: async (id: string) => {
    specialNotesStore = specialNotesStore.map((note) =>
      note.id === id ? { ...note, available: !note.available } : note
    );
    return specialNotesStore.find((n) => n.id === id);
  },
  deleteSpecialNote: async (id: string) => {
    specialNotesStore = specialNotesStore.filter((n) => n.id !== id);
    return true;
  },

  getCommissions: async () => [...commissionsStore],
  updateCommission: async (
    id: string,
    commissionType: "Not Configured" | "Percentage" | "Fixed Amount",
    commissionValue: number | null
  ) => {
    commissionsStore = commissionsStore.map((item) =>
      item.id === id ? { ...item, commissionType, commissionValue } : item
    );
    return commissionsStore.find((i) => i.id === id);
  },

  getStockItems: async () => [...stockItemsStore],
  toggleStockStatus: async (id: string) => {
    stockItemsStore = stockItemsStore.map((item) => {
      if (item.id === id) {
        const nextStatus = item.status === "In Stock" ? "Out of Stock" : "In Stock";
        return {
          ...item,
          status: nextStatus,
          updatedAt: "Just now",
          nextAvailableTime: nextStatus === "Out of Stock" ? "Tomorrow 10:00 AM" : undefined,
        };
      }
      return item;
    });
    return stockItemsStore.find((i) => i.id === id);
  },

  getSchedules: async () => [...schedulesStore],

  getVirtualOutlets: async () => [...virtualOutletsStore],
  addVirtualOutlet: async (name: string, cuisine: string) => {
    const newOutlet: VirtualOutlet = {
      id: `vo-${Date.now()}`,
      name,
      code: `HI-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      cuisine,
      status: "Active",
      menuCount: 15,
    };
    virtualOutletsStore = [newOutlet, ...virtualOutletsStore];
    return newOutlet;
  },

  getPhysicalMenus: async () => [...physicalMenusStore],
  addPhysicalMenu: async (name: string, type: string, fileSize: string) => {
    const newFile: PhysicalMenuRecord = {
      id: `pm-${Date.now()}`,
      name,
      type,
      uploadedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      fileSize,
      url: "#",
    };
    physicalMenusStore = [newFile, ...physicalMenusStore];
    return newFile;
  },
  deletePhysicalMenu: async (id: string) => {
    physicalMenusStore = physicalMenusStore.filter((f) => f.id !== id);
    return true;
  },

  getScheduleItems: async () => [...scheduleItemsStore],
  toggleScheduleItem: async (id: string) => {
    scheduleItemsStore = scheduleItemsStore.map((item) =>
      item.id === id ? { ...item, available: !item.available } : item
    );
    return scheduleItemsStore.find((i) => i.id === id);
  },
  addScheduleItem: async (item: Omit<ScheduleMenuItem, "id">) => {
    const newItem: ScheduleMenuItem = {
      ...item,
      id: `smi-${Date.now()}`,
    };
    scheduleItemsStore = [newItem, ...scheduleItemsStore];
    return newItem;
  },

  getScheduleCategories: async () => [...scheduleCategoriesStore],
  addScheduleCategory: async (name: string, parentCategory?: string) => {
    const newCat: ScheduleCategoryItem = {
      id: `scat-${Date.now()}`,
      name,
      parentCategory,
      rank: scheduleCategoriesStore.length + 1,
      status: "Active",
      createdAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      modifiedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      imageUploaded: false,
    };
    scheduleCategoriesStore = [...scheduleCategoriesStore, newCat];
    return newCat;
  },

  getScheduleVariants: async () => [...scheduleVariantsStore],
  addScheduleVariant: async (name: string, departmentName: string) => {
    const newVar: ScheduleVariantItem = {
      id: `svar-${Date.now()}`,
      name,
      departmentName,
      status: "Active",
      createdAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      modifiedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    };
    scheduleVariantsStore = [...scheduleVariantsStore, newVar];
    return newVar;
  },

  getScheduleTables: async () => [...scheduleTablesStore],
  toggleScheduleTable: async (id: string) => {
    scheduleTablesStore = scheduleTablesStore.map((table) =>
      table.id === id ? { ...table, status: !table.status } : table
    );
    return scheduleTablesStore.find((t) => t.id === id);
  },
  addScheduleTable: async (tableNo: string, areaName: string, noOfPersons?: number) => {
    const newTab: ScheduleTableItem = {
      id: `stab-${Date.now()}`,
      tableNo,
      areaName,
      noOfPersons: noOfPersons || 4,
      status: true,
    };
    scheduleTablesStore = [...scheduleTablesStore, newTab];
    return newTab;
  },

  syncPos: async () => {
    await new Promise((res) => setTimeout(res, 900));
    return {
      success: true,
      lastSync: "Just now",
      totalItemsSynced: 660,
      categoriesSynced: 24,
    };
  },
};

