export type MenuTabKey =
  | "menu_management"
  | "upload_item_images"
  | "item_on_off"
  | "special_note_list"
  | "menucommission_list"
  | "menu_scheduling"
  | "physical_menu";

export type SpecialNote = {
  id: string;
  name: string;
  createdAt: string;
  available: boolean;
};

export type MenuItemCommission = {
  id: string;
  name: string;
  category: string;
  price: number;
  commissionType: "Not Configured" | "Percentage" | "Fixed Amount";
  commissionValue: number | null;
  addonCount?: number;
};

export type MenuItemStock = {
  id: string;
  code: string;
  name: string;
  onlineDisplayName: string;
  category: string;
  price: number;
  channel: "Online" | "Offline" | "DineIn QR";
  platform: "All" | "Zomato" | "Swiggy" | "Direct";
  status: "In Stock" | "Out of Stock";
  nextAvailableTime?: string;
  updatedAt: string;
};

export type PhysicalMenuRecord = {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  fileSize: string;
  url?: string;
};

export type MenuScheduleItem = {
  id: string;
  title: string;
  type: "Base Menu" | "Home Delivery" | "Parcel" | "Dine In" | "Zomato" | "Swiggy";
  activeRulesCount: number;
  timingSummary: string;
  status: "Active" | "Scheduled" | "Paused";
};

export type VirtualOutlet = {
  id: string;
  name: string;
  code: string;
  cuisine: string;
  status: "Active" | "Draft";
  menuCount: number;
};

export type ScheduleMenuItem = {
  id: string;
  name: string;
  category: string;
  shortCode: number;
  indicators: string;
  onlineDisplayName: string;
  price: number;
  description?: string;
  isVeg: boolean;
  available: boolean;
};

export type ScheduleCategoryItem = {
  id: string;
  name: string;
  parentCategory?: string;
  onlineDisplayName?: string;
  rank: number;
  status: "Active" | "Inactive";
  createdAt: string;
  modifiedAt: string;
  imageUploaded: boolean;
};

export type ScheduleVariantItem = {
  id: string;
  name: string;
  onlineDisplayName?: string;
  departmentName: string;
  status: "Active" | "Inactive";
  createdAt: string;
  modifiedAt: string;
};

export type ScheduleTableItem = {
  id: string;
  tableNo: string;
  noOfPersons?: number;
  extraInfo?: string;
  areaName: string;
  status: boolean;
  discountPct?: number;
};

export type ScheduleTaxItem = {
  id: string;
  title: string;
  onlineDisplayName?: string;
  taxType: "Forward Tax" | "Backward Tax";
  type: "Percentage" | "Fixed Amount";
  amount: number;
  status: "Active" | "Inactive";
  createdAt: string;
};

export type ScheduleDiscountItem = {
  id: string;
  title: string;
  discountType: "Percentage" | "Fixed Amount";
  value: number;
  minBillAmount?: number;
  status: "Active" | "Inactive";
  createdAt: string;
};


