import httpClient from "@/utils/httpClient";
import { formatINR } from "./posDashboardService";
import type {
  LiveOrderSummaryApiDto,
  AllOrdersApiResponse,
  OnlineOrdersApiResponse,
  KotApiResponse,
} from "@/types/posOrdersApi";
import type {
  LiveOrderSummaryData,
  AllOrdersData,
  OnlineOrdersData,
  KotData,
} from "@/types/posOrders";

// ==========================================
// 1. LIVE ORDERS MOCK & SERVICE
// ==========================================
const MOCK_LIVE_ORDERS: LiveOrderSummaryApiDto = {
  runningOrders: {
    totalOrders: 2,
    totalAmount: 1760.0,
    dineIn: { count: 2, amount: 1760.0 },
    pickUp: { count: 0, amount: 0.0 },
    delivery: { count: 0, amount: 0.0 },
  },
  pendingOrders: {
    totalOrders: 0,
    totalAmount: 0.0,
    inPreparation: { count: 0, amount: 0.0 },
    waitingForPickup: { count: 0, amount: 0.0 },
    outForDelivery: { count: 0, amount: 0.0 },
  },
  runningTables: [
    {
      id: "tbl-g41",
      tableNumber: "G41",
      section: "Garden",
      capacity: 4,
      occupancy: 3,
      orderNumber: "ORD-10519",
      amount: 1760.0,
      elapsedMinutes: 24,
      status: "running",
    },
    {
      id: "tbl-b23",
      tableNumber: "B23",
      section: "Bar Lounge",
      capacity: 2,
      occupancy: 2,
      orderNumber: "ORD-10520",
      amount: 1130.0,
      elapsedMinutes: 12,
      status: "running",
    },
    {
      id: "tbl-a12",
      tableNumber: "A12",
      section: "AC Hall",
      capacity: 6,
      occupancy: 4,
      orderNumber: "ORD-10521",
      amount: 2840.0,
      elapsedMinutes: 45,
      status: "billed",
    },
  ],
};

export function mapLiveOrdersDto(dto: LiveOrderSummaryApiDto): LiveOrderSummaryData {
  return {
    runningOrders: {
      totalOrders: dto.runningOrders.totalOrders,
      totalAmount: dto.runningOrders.totalAmount,
      totalAmountFormatted: formatINR(dto.runningOrders.totalAmount),
      dineIn: {
        count: dto.runningOrders.dineIn.count,
        amountFormatted: formatINR(dto.runningOrders.dineIn.amount),
      },
      pickUp: {
        count: dto.runningOrders.pickUp.count,
        amountFormatted: formatINR(dto.runningOrders.pickUp.amount),
      },
      delivery: {
        count: dto.runningOrders.delivery.count,
        amountFormatted: formatINR(dto.runningOrders.delivery.amount),
      },
    },
    pendingOrders: {
      totalOrders: dto.pendingOrders.totalOrders,
      totalAmount: dto.pendingOrders.totalAmount,
      totalAmountFormatted: formatINR(dto.pendingOrders.totalAmount),
      inPreparation: {
        count: dto.pendingOrders.inPreparation.count,
        amountFormatted: formatINR(dto.pendingOrders.inPreparation.amount),
      },
      waitingForPickup: {
        count: dto.pendingOrders.waitingForPickup.count,
        amountFormatted: formatINR(dto.pendingOrders.waitingForPickup.amount),
      },
      outForDelivery: {
        count: dto.pendingOrders.outForDelivery.count,
        amountFormatted: formatINR(dto.pendingOrders.outForDelivery.amount),
      },
    },
    runningTables: dto.runningTables.map((t) => ({
      ...t,
      amountFormatted: formatINR(t.amount),
    })),
  };
}

export function getInitialLiveOrdersData(): LiveOrderSummaryData {
  return mapLiveOrdersDto(MOCK_LIVE_ORDERS);
}

export async function getLiveOrdersSummary(): Promise<LiveOrderSummaryData> {
  if (typeof window === "undefined") return getInitialLiveOrdersData();
  try {
    const res = await httpClient.get<LiveOrderSummaryApiDto>("/api/pos/orders/live");
    if (res.data) return mapLiveOrdersDto(res.data);
    return getInitialLiveOrdersData();
  } catch {
    return getInitialLiveOrdersData();
  }
}

// ==========================================
// 2. ALL ORDERS MOCK & SERVICE
// ==========================================
const MOCK_ALL_ORDERS: AllOrdersApiResponse = {
  success: true,
  grandTotal: 643388.0,
  salesTrend: [
    { dateLabel: "18th Aug", amount: 22870 },
    { dateLabel: "19th Aug", amount: 72606 },
    { dateLabel: "20th Aug", amount: 27242 },
    { dateLabel: "21st Aug", amount: 72093 },
    { dateLabel: "22nd Aug", amount: 59975 },
    { dateLabel: "23rd Aug", amount: 37226 },
    { dateLabel: "24th Aug", amount: 20496 },
    { dateLabel: "25th Aug", amount: 28031 },
    { dateLabel: "26th Aug", amount: 51155 },
    { dateLabel: "27th Aug", amount: 61031 },
    { dateLabel: "28th Aug", amount: 71860 },
    { dateLabel: "29th Aug", amount: 54227 },
    { dateLabel: "30th Aug", amount: 52984 },
    { dateLabel: "31st Aug", amount: 28726 },
    { dateLabel: "1st Sep", amount: 18420 },
  ],
  totalCount: 678,
  page: 1,
  pageSize: 10,
  records: [
    {
      id: "ord-10519",
      orderNo: "10519",
      orderType: "dine_in",
      orderTypeDisplay: "Dine In (G41) (Garden)",
      customerName: "Rahul Mehta",
      customerPhone: "9876543210",
      assignTo: "Sunil (Captain)",
      itemsSummary: "Bp Reserve 180, Budweiser Magnum (650 Ml), Carlsberg Elephant 650 Ml",
      myAmount: 2890.0,
      taxAmount: 0.0,
      discountAmount: 0.0,
      grandTotal: 2890.0,
      paymentMode: "Cash",
      status: "Printed",
      createdAt: "31 Aug 2026 22:16:49",
      isOnlineOrder: false,
    },
    {
      id: "ord-10518",
      orderNo: "10518",
      orderType: "dine_in",
      orderTypeDisplay: "Dine In (B23) (Bar)",
      customerName: "Vikram Malhotra",
      customerPhone: "9811223344",
      assignTo: "Amit",
      itemsSummary: "Butter Chicken (Half), Garlic Naan (2), Tandoori Roti (4), Carlsberg Elephant",
      myAmount: 1850.0,
      taxAmount: 92.5,
      discountAmount: 0.0,
      grandTotal: 1942.5,
      paymentMode: "Card",
      status: "Settled",
      createdAt: "31 Aug 2026 21:45:12",
    },
    {
      id: "ord-10517",
      orderNo: "10517",
      orderType: "online",
      orderTypeDisplay: "Zomato #4829",
      customerName: "Pooja Sharma",
      customerPhone: "9899887766",
      assignTo: "Online Desk",
      itemsSummary: "Paneer Butter Masala, Jeera Rice, Dal Makhani",
      myAmount: 780.0,
      taxAmount: 39.0,
      discountAmount: 50.0,
      grandTotal: 769.0,
      paymentMode: "UPI",
      status: "Completed",
      createdAt: "31 Aug 2026 21:12:00",
      isOnlineOrder: true,
    },
    {
      id: "ord-10516",
      orderNo: "10516",
      orderType: "room_service",
      orderTypeDisplay: "Room 204 (Deluxe)",
      customerName: "Aman Singhal",
      customerPhone: "9712345678",
      assignTo: "Ramesh",
      itemsSummary: "Club Sandwich, French Fries, Cold Coffee (2)",
      myAmount: 640.0,
      taxAmount: 32.0,
      discountAmount: 0.0,
      grandTotal: 672.0,
      paymentMode: "Due",
      status: "Settled",
      createdAt: "31 Aug 2026 20:30:22",
    },
    {
      id: "ord-10515",
      orderNo: "10515",
      orderType: "dine_in",
      orderTypeDisplay: "Dine In (AC-04)",
      customerName: "Deepak Grover",
      customerPhone: "9988776655",
      assignTo: "Sunil",
      itemsSummary: "Mutton Rogan Josh, Butter Naan (3), Sweet Lassi (2)",
      myAmount: 1420.0,
      taxAmount: 71.0,
      discountAmount: 100.0,
      grandTotal: 1391.0,
      paymentMode: "Split",
      status: "Settled",
      createdAt: "31 Aug 2026 20:05:14",
      isSplitBill: true,
    },
  ],
};

export function mapAllOrdersDto(dto: AllOrdersApiResponse): AllOrdersData {
  return {
    grandTotalAmount: dto.grandTotal,
    grandTotalFormatted: formatINR(dto.grandTotal),
    salesTrend: dto.salesTrend.map((st) => ({
      dateLabel: st.dateLabel,
      amount: st.amount,
      formattedAmount: formatINR(st.amount),
    })),
    records: dto.records.map((r) => ({
      ...r,
      myAmountFormatted: formatINR(r.myAmount),
      taxAmountFormatted: formatINR(r.taxAmount),
      discountAmountFormatted: r.discountAmount > 0 ? `(${formatINR(r.discountAmount)})` : "(0.00)",
      grandTotalFormatted: formatINR(r.grandTotal),
    })),
    totalCount: dto.totalCount,
    page: dto.page,
    pageSize: dto.pageSize,
  };
}

export function getInitialAllOrdersData(): AllOrdersData {
  return mapAllOrdersDto(MOCK_ALL_ORDERS);
}

export async function getAllOrders(filters?: Record<string, any>): Promise<AllOrdersData> {
  if (typeof window === "undefined") return getInitialAllOrdersData();
  try {
    const res = await httpClient.get<AllOrdersApiResponse>("/api/pos/orders/all", { params: filters });
    if (res.data && res.data.success) return mapAllOrdersDto(res.data);
    return getInitialAllOrdersData();
  } catch {
    return getInitialAllOrdersData();
  }
}

// ==========================================
// 3. ONLINE ORDERS MOCK & SERVICE
// ==========================================
const MOCK_ONLINE_ORDERS: OnlineOrdersApiResponse = {
  success: true,
  totalCount: 4,
  records: [
    {
      id: "on-1",
      orderNo: "ZOM-48291",
      platform: "zomato",
      outletName: "Main Restaurant",
      orderType: "Zomato Delivery",
      riderName: "Suresh Kumar",
      riderPhone: "+91 98765 11223",
      customerName: "Pooja Sharma",
      customerPhone: "+91 98998 87766",
      otp: "4821",
      dateTime: "01 Sep 2026 13:20",
      totalAmount: 769.0,
      status: "in_kitchen",
      statusDisplay: "In Kitchen (Prep)",
      placedMinutesAgo: 8,
      items: [
        { name: "Paneer Butter Masala", quantity: 1, price: 340 },
        { name: "Butter Naan", quantity: 3, price: 180 },
        { name: "Dal Makhani", quantity: 1, price: 249 },
      ],
    },
    {
      id: "on-2",
      orderNo: "SWIG-91823",
      platform: "swiggy",
      outletName: "Main Restaurant",
      orderType: "Swiggy Delivery",
      riderName: "Amit Singh",
      riderPhone: "+91 97112 33445",
      customerName: "Karan Johar",
      customerPhone: "+91 98110 99887",
      otp: "9102",
      dateTime: "01 Sep 2026 13:12",
      totalAmount: 1120.0,
      status: "food_ready",
      statusDisplay: "Food Ready (Waiting Rider)",
      placedMinutesAgo: 16,
      items: [
        { name: "Chicken Tikka Biryani", quantity: 2, price: 780 },
        { name: "Cold Coffee", quantity: 2, price: 340 },
      ],
    },
    {
      id: "on-3",
      orderNo: "ZOM-48288",
      platform: "zomato",
      outletName: "Main Restaurant",
      orderType: "Zomato Delivery",
      customerName: "Rohan Verma",
      customerPhone: "+91 99881 12233",
      otp: "3319",
      dateTime: "01 Sep 2026 12:45",
      totalAmount: 540.0,
      status: "delivered",
      statusDisplay: "Delivered",
      placedMinutesAgo: 45,
      items: [
        { name: "Veg Hakka Noodles", quantity: 1, price: 260 },
        { name: "Chilli Paneer Dry", quantity: 1, price: 280 },
      ],
    },
    {
      id: "on-4",
      orderNo: "WEB-1002",
      platform: "direct_web",
      outletName: "Main Restaurant",
      orderType: "Direct Pickup",
      customerName: "Ananya Roy",
      customerPhone: "+91 98123 45670",
      otp: "1002",
      dateTime: "01 Sep 2026 13:05",
      totalAmount: 890.0,
      status: "out_for_delivery",
      statusDisplay: "Picked Up",
      placedMinutesAgo: 22,
      items: [
        { name: "Margherita Pizza (Large)", quantity: 1, price: 550 },
        { name: "Garlic Breadsticks", quantity: 1, price: 190 },
        { name: "Coke Can", quantity: 2, price: 150 },
      ],
    },
  ],
};

export function mapOnlineOrdersDto(dto: OnlineOrdersApiResponse): OnlineOrdersData {
  return {
    totalCount: dto.totalCount,
    records: dto.records.map((r) => ({
      id: r.id,
      orderNo: r.orderNo,
      platform: r.platform,
      outletName: r.outletName,
      orderType: r.orderType,
      riderDetails: r.riderName ? `${r.riderName} (${r.riderPhone})` : "Assigning rider...",
      customerName: r.customerName,
      customerPhone: r.customerPhone,
      otp: r.otp,
      dateTime: r.dateTime,
      totalAmountFormatted: formatINR(r.totalAmount),
      status: r.status,
      statusDisplay: r.statusDisplay,
      items: r.items.map((it) => ({
        name: it.name,
        quantity: it.quantity,
        priceFormatted: formatINR(it.price),
      })),
    })),
  };
}

export function getInitialOnlineOrdersData(): OnlineOrdersData {
  return mapOnlineOrdersDto(MOCK_ONLINE_ORDERS);
}

export async function getOnlineOrders(filters?: Record<string, any>): Promise<OnlineOrdersData> {
  if (typeof window === "undefined") return getInitialOnlineOrdersData();
  try {
    const res = await httpClient.get<OnlineOrdersApiResponse>("/api/pos/orders/online", { params: filters });
    if (res.data && res.data.success) return mapOnlineOrdersDto(res.data);
    return getInitialOnlineOrdersData();
  } catch {
    return getInitialOnlineOrdersData();
  }
}

// ==========================================
// 4. KOT (KITCHEN ORDER TICKETS) MOCK & SERVICE
// ==========================================
const MOCK_KOT_RECORDS: KotApiResponse = {
  success: true,
  totalCount: 6,
  records: [
    {
      id: "kot-6",
      kotId: 6,
      orderType: "Dine In(B23)",
      customerName: "--",
      customerPhone: "--",
      itemCount: 1,
      itemsText: "Chicken Biryani",
      status: "Not Prepared",
      billPrintDate: null,
      completeDuration: null,
      createdAt: "1 Sep 2026 13:18:49",
      isModified: false,
    },
    {
      id: "kot-5",
      kotId: 5,
      orderType: "Dine In(B23)",
      customerName: "--",
      customerPhone: "--",
      itemCount: 1,
      itemsText: "Carlsberg Elephant 650 Ml",
      status: "Not Prepared",
      billPrintDate: null,
      completeDuration: null,
      createdAt: "1 Sep 2026 13:14:11",
      isModified: false,
    },
    {
      id: "kot-4",
      kotId: 4,
      orderType: "Dine In(B24)",
      customerName: "--",
      customerPhone: "--",
      itemCount: 2,
      itemsText: "Fried Fish (Rohu), Kingfisher Strong",
      status: "Not Prepared",
      billPrintDate: null,
      completeDuration: null,
      createdAt: "1 Sep 2026 13:12:21",
      isModified: false,
    },
    {
      id: "kot-3",
      kotId: 3,
      orderType: "Dine In(B23)",
      customerName: "--",
      customerPhone: "--",
      itemCount: 1,
      itemsText: "Green Salad",
      status: "Not Prepared",
      billPrintDate: null,
      completeDuration: null,
      createdAt: "1 Sep 2026 12:59:47",
      isModified: false,
    },
    {
      id: "kot-2",
      kotId: 2,
      orderType: "Dine In(B23)",
      customerName: "--",
      customerPhone: "--",
      itemCount: 1,
      itemsText: "Fry Papad",
      status: "Not Prepared",
      billPrintDate: null,
      completeDuration: null,
      createdAt: "1 Sep 2026 12:48:33",
      isModified: false,
    },
    {
      id: "kot-1",
      kotId: 1,
      orderType: "Dine In(B23)",
      customerName: "--",
      customerPhone: "--",
      itemCount: 2,
      itemsText: "Carlsberg Elephant 650 Ml, Tandoori Chicken (Half)",
      status: "Not Prepared",
      billPrintDate: null,
      completeDuration: null,
      createdAt: "1 Sep 2026 12:42:22",
      isModified: true,
    },
  ],
};

export function mapKotDto(dto: KotApiResponse): KotData {
  return {
    totalCount: dto.totalCount,
    records: dto.records.map((r) => ({
      id: r.id,
      kotId: r.kotId,
      orderType: r.orderType,
      customerName: r.customerName || "--",
      customerPhone: r.customerPhone || "--",
      itemCount: r.itemCount,
      itemsText: r.itemsText,
      status: r.status,
      billPrintDate: r.billPrintDate || "--",
      completeDuration: r.completeDuration || "--",
      createdAt: r.createdAt,
      isModified: r.isModified,
    })),
  };
}

export function getInitialKotData(): KotData {
  return mapKotDto(MOCK_KOT_RECORDS);
}

export async function getKotOrders(filters?: Record<string, any>): Promise<KotData> {
  if (typeof window === "undefined") return getInitialKotData();
  try {
    const res = await httpClient.get<KotApiResponse>("/api/pos/kot", { params: filters });
    if (res.data && res.data.success) return mapKotDto(res.data);
    return getInitialKotData();
  } catch {
    return getInitialKotData();
  }
}
