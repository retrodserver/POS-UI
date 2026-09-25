import type {
  SpecialNote,
  MenuItemCommission,
  MenuItem,
  MenuItemImage,
  PhysicalMenuRecord,
  MenuScheduleItem,
  VirtualOutlet,
  ScheduleMenuItem,
  ScheduleCategoryItem,
  ScheduleVariantItem,
  ScheduleTableItem,
} from "@/types/posMenu";

const SAMPLE_IMAGES: Record<string, MenuItemImage[]> = {
  butter_chicken: [
    {
      id: "img-bc-1",
      url: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80",
      name: "butter_chicken_plate.jpg",
      isPrimary: true,
      size: "1.2 MB",
      type: "image/jpeg",
      uploadedAt: "Today, 10:30 AM",
    },
    {
      id: "img-bc-2",
      url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80",
      name: "butter_chicken_curry_bowl.jpg",
      isPrimary: false,
      size: "940 KB",
      type: "image/jpeg",
      uploadedAt: "Yesterday",
    },
  ],
  paneer_tikka: [
    {
      id: "img-pt-1",
      url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80",
      name: "paneer_tikka_skewers.jpg",
      isPrimary: true,
      size: "820 KB",
      type: "image/jpeg",
      uploadedAt: "Today, 09:15 AM",
    },
  ],
  dal_makhani: [
    {
      id: "img-dm-1",
      url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
      name: "dal_makhani_handi.jpg",
      isPrimary: true,
      size: "1.1 MB",
      type: "image/jpeg",
      uploadedAt: "3 days ago",
    },
  ],
  biryani: [
    {
      id: "img-by-1",
      url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
      name: "dum_biryani_pot.jpg",
      isPrimary: true,
      size: "1.4 MB",
      type: "image/jpeg",
      uploadedAt: "2 days ago",
    },
    {
      id: "img-by-2",
      url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80",
      name: "biryani_serving_dish.jpg",
      isPrimary: false,
      size: "880 KB",
      type: "image/jpeg",
      uploadedAt: "3 days ago",
    },
  ],
  burger: [
    {
      id: "img-bg-1",
      url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      name: "smash_burger_deluxe.jpg",
      isPrimary: true,
      size: "1.3 MB",
      type: "image/jpeg",
      uploadedAt: "Yesterday",
    },
  ],
  mojito: [
    {
      id: "img-mj-1",
      url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
      name: "mint_virgin_mojito.jpg",
      isPrimary: true,
      size: "650 KB",
      type: "image/jpeg",
      uploadedAt: "4 days ago",
    },
  ],
};

const initialMenuItems: MenuItem[] = [
  // Primary Outlet (Highway Inn Main)
  {
    id: "itm-1",
    outletId: "outlet-primary",
    code: "FD-104",
    name: "Butter Chicken Boneless",
    onlineDisplayName: "Rich Butter Chicken Boneless Gravy (500g)",
    category: "Non-Veg Main Course",
    itemType: "Non-Veg",
    price: 380,
    taxRate: 5,
    status: "Active",
    description:
      "Tender boneless chicken roasted in tandoor and simmered in a silky tomato, cashew and butter gravy.",
    images: SAMPLE_IMAGES.butter_chicken,
    baseMenu: true,
    zomato: true,
    swiggy: true,
    direct: true,
    updatedAt: "10 mins ago",
  },
  {
    id: "itm-2",
    outletId: "outlet-primary",
    code: "FD-201",
    name: "Paneer Butter Masala",
    onlineDisplayName: "Paneer Butter Masala Classic",
    category: "Veg Main Course",
    itemType: "Veg",
    price: 280,
    taxRate: 5,
    status: "Active",
    description:
      "Cottage cheese cubes tossed in rich tomato-cream sauce with fenugreek and butter.",
    images: SAMPLE_IMAGES.paneer_tikka,
    baseMenu: true,
    zomato: true,
    swiggy: true,
    direct: true,
    updatedAt: "1 hour ago",
  },
  {
    id: "itm-3",
    outletId: "outlet-primary",
    code: "FD-202",
    name: "Dal Makhani Handi",
    onlineDisplayName: "Slow Cooked Dal Makhani Handi",
    category: "Veg Main Course",
    itemType: "Veg",
    price: 240,
    taxRate: 5,
    status: "Active",
    description:
      "Black lentils slow-cooked overnight with churned butter and fresh cream in a clay handi.",
    images: SAMPLE_IMAGES.dal_makhani,
    baseMenu: true,
    zomato: true,
    swiggy: false,
    direct: true,
    updatedAt: "Yesterday",
  },
  {
    id: "itm-4",
    outletId: "outlet-primary",
    code: "FD-108",
    name: "Tandoori Murgh (Full)",
    onlineDisplayName: "Authentic Charcoal Tandoori Chicken",
    category: "Non-Veg Starters",
    itemType: "Non-Veg",
    price: 460,
    taxRate: 5,
    status: "Active",
    description:
      "Whole chicken marinated with Kashmiri chili, yogurt, roasted spices, and char-grilled in tandoor.",
    images: SAMPLE_IMAGES.butter_chicken,
    baseMenu: true,
    zomato: false,
    swiggy: false,
    direct: true,
    nextAvailableTime: "Tomorrow 11:00 AM",
    updatedAt: "2 hours ago",
  },
  {
    id: "itm-5",
    outletId: "outlet-primary",
    code: "FD-203",
    name: "Paneer Tikka Charcoal Grilled",
    onlineDisplayName: "Paneer Tikka Charcoal Grilled (8 Pcs)",
    category: "Veg Starters",
    itemType: "Veg",
    price: 260,
    taxRate: 5,
    status: "Active",
    description:
      "Fresh cottage cheese skewers marinated in mustard oil, ajwain and hung curd with capsicum and onion.",
    images: SAMPLE_IMAGES.paneer_tikka,
    baseMenu: true,
    zomato: true,
    swiggy: true,
    direct: true,
    updatedAt: "Just now",
  },
  {
    id: "itm-6",
    outletId: "outlet-primary",
    code: "FD-301",
    name: "Butter Naan",
    onlineDisplayName: "Tandoori Butter Naan",
    category: "Bread",
    itemType: "Veg",
    price: 60,
    taxRate: 5,
    status: "Active",
    description:
      "Crispy and soft refined flour bread baked in clay oven and generously brushed with melted butter.",
    images: [],
    baseMenu: true,
    zomato: true,
    swiggy: true,
    direct: true,
    updatedAt: "Today",
  },
  {
    id: "itm-7",
    outletId: "outlet-primary",
    code: "FD-302",
    name: "Garlic Butter Naan",
    onlineDisplayName: "Clay Baked Garlic Butter Naan",
    category: "Bread",
    itemType: "Veg",
    price: 75,
    taxRate: 5,
    status: "Active",
    description:
      "Hand-stretched leavened flatbread topped with minced garlic, fresh coriander and butter.",
    images: [],
    baseMenu: true,
    zomato: true,
    swiggy: true,
    direct: true,
    updatedAt: "Today",
  },
  {
    id: "itm-8",
    outletId: "outlet-primary",
    code: "FD-102",
    name: "Egg Curry Masala (2 Eggs)",
    onlineDisplayName: "Dhabha Style Egg Curry with Steamed Rice",
    category: "Egg Specialties",
    itemType: "Egg",
    price: 210,
    taxRate: 5,
    status: "Active",
    description:
      "Boiled eggs fried golden and simmered in a robust onion-tomato and whole spice gravy.",
    images: [],
    baseMenu: true,
    zomato: true,
    swiggy: true,
    direct: true,
    updatedAt: "2 days ago",
  },
  {
    id: "itm-9",
    outletId: "outlet-primary",
    code: "BEV-001",
    name: "Magic Moments Jamun 180 Ml",
    onlineDisplayName: "Magic Moments Jamun (180ml)",
    category: "Vodka",
    itemType: "Veg",
    price: 260,
    taxRate: 18,
    status: "Active",
    description: "Smooth grain vodka infused with Indian black plum flavors.",
    images: [],
    baseMenu: true,
    zomato: false,
    swiggy: false,
    direct: false,
    updatedAt: "3 days ago",
  },
  {
    id: "itm-10",
    outletId: "outlet-primary",
    code: "BEV-004",
    name: "Royal Green 375 Ml",
    onlineDisplayName: "Royal Green Select Whisky 375ml",
    category: "Indian Whisky",
    itemType: "Veg",
    price: 530,
    taxRate: 18,
    status: "Active",
    description: "Fine blended malt whisky with smoky notes.",
    images: [],
    baseMenu: true,
    zomato: false,
    swiggy: false,
    direct: false,
    updatedAt: "4 days ago",
  },
  {
    id: "itm-11",
    outletId: "outlet-primary",
    code: "BEV-102",
    name: "Classic Virgin Mojito",
    onlineDisplayName: "Mint Lime Virgin Mojito (300ml)",
    category: "Mocktails",
    itemType: "Veg",
    price: 160,
    taxRate: 12,
    status: "Active",
    description:
      "Refreshing cooler with muddled fresh mint leaves, lemon juice, sugar cane syrup, and sparkling soda.",
    images: SAMPLE_IMAGES.mojito,
    baseMenu: true,
    zomato: true,
    swiggy: true,
    direct: true,
    updatedAt: "Yesterday",
  },
  {
    id: "itm-12",
    outletId: "outlet-primary",
    code: "FD-401",
    name: "Veg Manchow Soup",
    onlineDisplayName: "Spicy Veg Manchow Soup with Crispy Noodles",
    category: "Veg Soup",
    itemType: "Veg",
    price: 140,
    taxRate: 5,
    status: "Active",
    description:
      "Dark spicy broth loaded with garlic, ginger, chopped vegetables and topped with crispy fried noodles.",
    images: [],
    baseMenu: true,
    zomato: true,
    swiggy: true,
    direct: true,
    updatedAt: "3 days ago",
  },
  {
    id: "itm-13",
    outletId: "outlet-primary",
    code: "FD-402",
    name: "Chicken Manchow Soup",
    onlineDisplayName: "Chicken Manchow Soup Hot & Spicy",
    category: "Non-Veg Soup",
    itemType: "Non-Veg",
    price: 160,
    taxRate: 5,
    status: "Active",
    description:
      "Savory chicken broth with shredded chicken, egg drops, chili garlic and fried noodles.",
    images: [],
    baseMenu: true,
    zomato: true,
    swiggy: true,
    direct: true,
    updatedAt: "3 days ago",
  },
  {
    id: "itm-14",
    outletId: "outlet-primary",
    code: "FD-501",
    name: "Gulab Jamun with Rabri",
    onlineDisplayName: "Hot Gulab Jamun (2 Pcs) with Chilled Shahi Rabri",
    category: "Desserts",
    itemType: "Veg",
    price: 150,
    taxRate: 5,
    status: "Active",
    description:
      "Warm mawa dumplings soaked in cardamom sugar syrup served with thick saffron rabri.",
    images: [],
    baseMenu: true,
    zomato: true,
    swiggy: true,
    direct: true,
    updatedAt: "Yesterday",
  },

  // Virtual Outlet 1: Highway Inn - Cloud Kitchen (BIRYANI EXPRESS)
  {
    id: "itm-be-1",
    outletId: "vo-1",
    code: "BE-101",
    name: "Hyderabadi Chicken Dum Biryani",
    onlineDisplayName: "Hyderabadi Chicken Dum Biryani (Serves 1-2 with Raita & Salan)",
    category: "Biryani & Rice",
    itemType: "Non-Veg",
    price: 340,
    taxRate: 5,
    status: "Active",
    description:
      "Long grain Basmati rice dum-cooked with tender marinated chicken, saffron, brown onions and fresh mint.",
    images: SAMPLE_IMAGES.biryani,
    baseMenu: true,
    zomato: true,
    swiggy: true,
    direct: true,
    updatedAt: "Just now",
  },
  {
    id: "itm-be-2",
    outletId: "vo-1",
    code: "BE-102",
    name: "Mutton Dum Biryani Special",
    onlineDisplayName: "Royal Awadhi Mutton Dum Biryani (Pot Serves 2)",
    category: "Biryani & Rice",
    itemType: "Non-Veg",
    price: 490,
    taxRate: 5,
    status: "Active",
    description:
      "Succulent spring mutton pieces cooked in aromatic spices and slow dum with aged basmati rice.",
    images: SAMPLE_IMAGES.biryani,
    baseMenu: true,
    zomato: true,
    swiggy: true,
    direct: true,
    updatedAt: "10 mins ago",
  },
  {
    id: "itm-be-3",
    outletId: "vo-1",
    code: "BE-103",
    name: "Paneer Subz Dum Biryani",
    onlineDisplayName: "Paneer & Garden Veggie Dum Biryani Handi",
    category: "Biryani & Rice",
    itemType: "Veg",
    price: 290,
    taxRate: 5,
    status: "Active",
    description:
      "Fresh malai paneer, seasonal vegetables and aromatic basmati rice layered with herbs and saffron.",
    images: SAMPLE_IMAGES.biryani,
    baseMenu: true,
    zomato: true,
    swiggy: true,
    direct: true,
    updatedAt: "Yesterday",
  },
  {
    id: "itm-be-4",
    outletId: "vo-1",
    code: "BE-201",
    name: "Murgh Malai Tikka (6 Pcs)",
    onlineDisplayName: "Melt In Mouth Murgh Malai Tikka",
    category: "Tandoori Kebabs",
    itemType: "Non-Veg",
    price: 320,
    taxRate: 5,
    status: "Active",
    description:
      "Creamy boneless chicken morsels marinated in cheese, cream, cardamom and white pepper.",
    images: SAMPLE_IMAGES.butter_chicken,
    baseMenu: true,
    zomato: true,
    swiggy: true,
    direct: true,
    updatedAt: "3 days ago",
  },

  // Virtual Outlet 2: Highway Inn - Burger Lab
  {
    id: "itm-bl-1",
    outletId: "vo-2",
    code: "BL-101",
    name: "Double Smashed Cheeseburger",
    onlineDisplayName: "Double Smash Angus Cheeseburger with Secret Sauce",
    category: "Burgers",
    itemType: "Non-Veg",
    price: 280,
    taxRate: 5,
    status: "Active",
    description:
      "Two seasoned smash patties, double cheddar cheese, pickled gherkins and smoked secret sauce on brioche bun.",
    images: SAMPLE_IMAGES.burger,
    baseMenu: true,
    zomato: true,
    swiggy: true,
    direct: true,
    updatedAt: "Today",
  },
  {
    id: "itm-bl-2",
    outletId: "vo-2",
    code: "BL-102",
    name: "Crispy Peri Peri Chicken Burger",
    onlineDisplayName: "Firecracker Crispy Peri Peri Fried Chicken Burger",
    category: "Burgers",
    itemType: "Non-Veg",
    price: 250,
    taxRate: 5,
    status: "Active",
    description:
      "Buttermilk fried chicken thigh tossed in fiery peri-peri seasoning with crunchy lettuce and herb mayo.",
    images: SAMPLE_IMAGES.burger,
    baseMenu: true,
    zomato: true,
    swiggy: true,
    direct: true,
    updatedAt: "Yesterday",
  },
  {
    id: "itm-bl-3",
    outletId: "vo-2",
    code: "BL-201",
    name: "Truffle Parmesan Loaded Fries",
    onlineDisplayName: "Golden Truffle Parmesan Crinkle Fries",
    category: "Sides & Shakes",
    itemType: "Veg",
    price: 190,
    taxRate: 5,
    status: "Active",
    description:
      "Crispy crinkle-cut fries tossed in aromatic white truffle oil, shaved parmesan and fresh parsley.",
    images: [],
    baseMenu: true,
    zomato: true,
    swiggy: true,
    direct: true,
    updatedAt: "2 days ago",
  },
];

const initialSpecialNotes: SpecialNote[] = [
  { id: "sn-1", name: "Parcel", createdAt: "7 Jun 2024", available: true },
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
    price: 380,
    commissionType: "Percentage",
    commissionValue: 5,
  },
  {
    id: "mc-7",
    name: "Paneer Butter Masala",
    category: "Veg Main Course",
    price: 280,
    commissionType: "Fixed Amount",
    commissionValue: 20,
  },
  {
    id: "mc-8",
    name: "Dal Makhani Handi",
    category: "Veg Main Course",
    price: 240,
    commissionType: "Not Configured",
    commissionValue: null,
  },
  {
    id: "mc-9",
    name: "Tandoori Murgh (Full)",
    category: "Non-Veg Starters",
    price: 460,
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

const initialPhysicalMenus: PhysicalMenuRecord[] = [];

const initialScheduleItems: ScheduleMenuItem[] = [
  {
    id: "smi-1",
    name: "Lemon Coriander Soup",
    shortCode: 39,
    indicators: "v+ | O | D",
    onlineDisplayName: "Lemon Coriander Soup",
    price: 140,
    isVeg: true,
    available: true,
    category: "Veg Soup",
  },
  {
    id: "smi-2",
    name: "Manchow Soup",
    shortCode: 40,
    indicators: "v+ | O | D",
    onlineDisplayName: "Manchow Soup",
    price: 140,
    isVeg: true,
    available: true,
    category: "Veg Soup",
  },
  {
    id: "smi-3",
    name: "Hot & Sour Soup",
    shortCode: 41,
    indicators: "v+ | O | D",
    onlineDisplayName: "Hot & Sour Soup",
    price: 140,
    isVeg: true,
    available: true,
    category: "Veg Soup",
  },
  {
    id: "smi-4",
    name: "Sweet Corn Soup",
    shortCode: 42,
    indicators: "v+ | O | D",
    onlineDisplayName: "Sweet Corn Soup",
    price: 140,
    isVeg: true,
    available: true,
    category: "Veg Soup",
  },
  {
    id: "smi-5",
    name: "Paneer Tikka",
    shortCode: 50,
    indicators: "v+ | O | D",
    onlineDisplayName: "Paneer Tikka Classic",
    price: 240,
    isVeg: true,
    available: true,
    category: "Veg Starters",
  },
  {
    id: "smi-6",
    name: "Chicken Tikka",
    shortCode: 51,
    indicators: "nv | O | D",
    onlineDisplayName: "Tandoori Chicken Tikka",
    price: 290,
    isVeg: false,
    available: true,
    category: "Non-Veg Starters",
  },
  {
    id: "smi-7",
    name: "Butter Chicken Boneless",
    shortCode: 60,
    indicators: "nv | O | D",
    onlineDisplayName: "Butter Chicken Gravy",
    price: 380,
    isVeg: false,
    available: true,
    category: "Non-Veg Main Course",
  },
  {
    id: "smi-8",
    name: "Dal Makhani Handi",
    shortCode: 61,
    indicators: "v+ | O | D",
    onlineDisplayName: "Dal Makhani",
    price: 240,
    isVeg: true,
    available: true,
    category: "Veg Main Course",
  },
  {
    id: "smi-9",
    name: "Butter Naan",
    shortCode: 70,
    indicators: "v+ | O | D",
    onlineDisplayName: "Butter Naan",
    price: 60,
    isVeg: true,
    available: true,
    category: "Bread",
  },
];

const initialScheduleCategories: ScheduleCategoryItem[] = [
  {
    id: "scat-1",
    name: "Veg Soup",
    parentCategory: "Soup & Starters",
    onlineDisplayName: "Veg Soups",
    rank: 1,
    status: "Active",
    createdAt: "7 Jun 2024",
    modifiedAt: "5 Oct 2024",
    imageUploaded: true,
  },
  {
    id: "scat-2",
    name: "Non-Veg Soup",
    parentCategory: "Soup & Starters",
    onlineDisplayName: "Non-Veg Soups",
    rank: 2,
    status: "Active",
    createdAt: "7 Jun 2024",
    modifiedAt: "5 Oct 2024",
    imageUploaded: true,
  },
  {
    id: "scat-3",
    name: "Veg Starters",
    parentCategory: "Soup & Starters",
    onlineDisplayName: "Veg Appetizers",
    rank: 3,
    status: "Active",
    createdAt: "7 Jun 2024",
    modifiedAt: "5 Oct 2024",
    imageUploaded: true,
  },
  {
    id: "scat-4",
    name: "Non-Veg Starters",
    parentCategory: "Soup & Starters",
    onlineDisplayName: "Non-Veg Appetizers",
    rank: 4,
    status: "Active",
    createdAt: "7 Jun 2024",
    modifiedAt: "5 Oct 2024",
    imageUploaded: true,
  },
  {
    id: "scat-5",
    name: "Veg Main Course",
    onlineDisplayName: "Veg Mains",
    rank: 5,
    status: "Active",
    createdAt: "7 Jun 2024",
    modifiedAt: "5 Oct 2024",
    imageUploaded: false,
  },
  {
    id: "scat-6",
    name: "Non-Veg Main Course",
    onlineDisplayName: "Non-Veg Mains",
    rank: 6,
    status: "Active",
    createdAt: "7 Jun 2024",
    modifiedAt: "5 Oct 2024",
    imageUploaded: false,
  },
  {
    id: "scat-7",
    name: "Bread",
    onlineDisplayName: "Breads & Rotis",
    rank: 7,
    status: "Active",
    createdAt: "7 Jun 2024",
    modifiedAt: "5 Oct 2024",
    imageUploaded: false,
  },
  {
    id: "scat-8",
    name: "Egg Specialties",
    onlineDisplayName: "Egg Dishes",
    rank: 8,
    status: "Active",
    createdAt: "10 Jun 2024",
    modifiedAt: "5 Oct 2024",
    imageUploaded: false,
  },
  {
    id: "scat-9",
    name: "Mocktails",
    onlineDisplayName: "Beverages & Mocktails",
    rank: 9,
    status: "Active",
    createdAt: "12 Jun 2024",
    modifiedAt: "5 Oct 2024",
    imageUploaded: true,
  },
  {
    id: "scat-10",
    name: "Desserts",
    onlineDisplayName: "Mithai & Desserts",
    rank: 10,
    status: "Active",
    createdAt: "15 Jun 2024",
    modifiedAt: "5 Oct 2024",
    imageUploaded: false,
  },
];

const initialScheduleVariants: ScheduleVariantItem[] = [
  {
    id: "svar-1",
    name: "Veg",
    onlineDisplayName: "Veg",
    departmentName: "HB",
    status: "Active",
    createdAt: "1 Jun 2024",
    modifiedAt: "1 Jun 2024",
  },
  {
    id: "svar-2",
    name: "Non Veg",
    onlineDisplayName: "Non Veg",
    departmentName: "HB",
    status: "Active",
    createdAt: "1 Jun 2024",
    modifiedAt: "1 Jun 2024",
  },
  {
    id: "svar-3",
    name: "180 Ml",
    onlineDisplayName: "Quarter (180ml)",
    departmentName: "Quantity",
    status: "Active",
    createdAt: "2 Jun 2024",
    modifiedAt: "2 Jun 2024",
  },
  {
    id: "svar-4",
    name: "750 Ml",
    onlineDisplayName: "Full Bottle (750ml)",
    departmentName: "Quantity",
    status: "Active",
    createdAt: "2 Jun 2024",
    modifiedAt: "7 Jun 2024",
  },
];

const initialScheduleTables: ScheduleTableItem[] = [
  { id: "stab-1", tableNo: "BANQUET", areaName: "BANQUET", noOfPersons: 50, status: true },
  { id: "stab-2", tableNo: "G50", areaName: "Garden", noOfPersons: 4, status: true },
  { id: "stab-3", tableNo: "G49", areaName: "Garden", noOfPersons: 6, status: true },
  { id: "stab-4", tableNo: "T-01", areaName: "AC Family", noOfPersons: 4, status: true },
  { id: "stab-5", tableNo: "T-02", areaName: "AC Family", noOfPersons: 4, status: true },
];

// In-memory runtime store
let menuItemsStore: MenuItem[] = [...initialMenuItems];
let specialNotesStore: SpecialNote[] = [...initialSpecialNotes];
let commissionsStore: MenuItemCommission[] = [...initialCommissions];
let schedulesStore: MenuScheduleItem[] = [...initialSchedules];
let physicalMenusStore: PhysicalMenuRecord[] = [...initialPhysicalMenus];
let scheduleItemsStore: ScheduleMenuItem[] = [...initialScheduleItems];
let scheduleCategoriesStore: ScheduleCategoryItem[] = [...initialScheduleCategories];
let scheduleVariantsStore: ScheduleVariantItem[] = [...initialScheduleVariants];
let scheduleTablesStore: ScheduleTableItem[] = [...initialScheduleTables];

export const posMenuService = {
  // 1. Menu Items CRUD & Filtering by Outlet
  getMenuItems: async (outletId?: string) => {
    if (!outletId) return [...menuItemsStore];
    return menuItemsStore.filter((item) => item.outletId === outletId);
  },

  getMenuItemById: async (id: string) => {
    return menuItemsStore.find((i) => i.id === id) || null;
  },

  addMenuItem: async (item: Omit<MenuItem, "id" | "updatedAt">) => {
    const newItem: MenuItem = {
      ...item,
      id: `itm-${Date.now()}`,
      updatedAt: "Just now",
      images: item.images || [],
    };
    menuItemsStore = [newItem, ...menuItemsStore];
    return newItem;
  },

  updateMenuItem: async (id: string, data: Partial<MenuItem>) => {
    menuItemsStore = menuItemsStore.map((item) =>
      item.id === id ? { ...item, ...data, updatedAt: "Just now" } : item,
    );
    return menuItemsStore.find((i) => i.id === id);
  },

  deleteMenuItem: async (id: string) => {
    menuItemsStore = menuItemsStore.filter((i) => i.id !== id);
    return true;
  },

  // 2. Channel & Platform Availability
  toggleItemPlatform: async (id: string, platform: "zomato" | "swiggy" | "direct" | "baseMenu") => {
    menuItemsStore = menuItemsStore.map((item) => {
      if (item.id === id) {
        const nextVal = !item[platform];
        return {
          ...item,
          [platform]: nextVal,
          updatedAt: "Just now",
        };
      }
      return item;
    });
    return menuItemsStore.find((i) => i.id === id);
  },

  bulkUpdatePlatformAvailability: async (
    ids: string[],
    updates: {
      zomato?: boolean;
      swiggy?: boolean;
      direct?: boolean;
      baseMenu?: boolean;
    },
  ) => {
    const idSet = new Set(ids);
    menuItemsStore = menuItemsStore.map((item) => {
      if (idSet.has(item.id)) {
        return {
          ...item,
          ...updates,
          updatedAt: "Just now",
        };
      }
      return item;
    });
    return true;
  },

  // Backward compatibility alias for stock items
  getStockItems: async (outletId?: string) => {
    if (!outletId) return [...menuItemsStore];
    return menuItemsStore.filter((item) => item.outletId === outletId);
  },

  toggleStockStatus: async (id: string) => {
    menuItemsStore = menuItemsStore.map((item) => {
      if (item.id === id) {
        const nextStatus = item.status === "Active" ? "Inactive" : "Active";
        return {
          ...item,
          status: nextStatus,
          updatedAt: "Just now",
          nextAvailableTime: nextStatus === "Inactive" ? "Tomorrow 10:00 AM" : undefined,
        };
      }
      return item;
    });
    return menuItemsStore.find((i) => i.id === id);
  },

  // 3. Multi-Image Management per Item
  addItemImages: async (itemId: string, newImages: MenuItemImage[]) => {
    menuItemsStore = menuItemsStore.map((item) => {
      if (item.id === itemId) {
        const hasExistingPrimary = item.images.some((img) => img.isPrimary);
        const processed = newImages.map((img, idx) => ({
          ...img,
          isPrimary: !hasExistingPrimary && idx === 0 ? true : img.isPrimary,
        }));
        return {
          ...item,
          images: [...item.images, ...processed],
          updatedAt: "Just now",
        };
      }
      return item;
    });
    return menuItemsStore.find((i) => i.id === itemId);
  },

  removeItemImage: async (itemId: string, imageId: string) => {
    menuItemsStore = menuItemsStore.map((item) => {
      if (item.id === itemId) {
        const filtered = item.images.filter((img) => img.id !== imageId);
        // If we removed the primary image and there are remaining images, set the first as primary
        const hasPrimary = filtered.some((img) => img.isPrimary);
        if (!hasPrimary && filtered.length > 0) {
          filtered[0].isPrimary = true;
        }
        return {
          ...item,
          images: filtered,
          updatedAt: "Just now",
        };
      }
      return item;
    });
    return menuItemsStore.find((i) => i.id === itemId);
  },

  setPrimaryImage: async (itemId: string, imageId: string) => {
    menuItemsStore = menuItemsStore.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          images: item.images.map((img) => ({
            ...img,
            isPrimary: img.id === imageId,
          })),
          updatedAt: "Just now",
        };
      }
      return item;
    });
    return menuItemsStore.find((i) => i.id === itemId);
  },

  // 4. Special Notes
  getSpecialNotes: async () => [...specialNotesStore],
  addSpecialNote: async (name: string, available = true) => {
    const newNote: SpecialNote = {
      id: `sn-${Date.now()}`,
      name,
      createdAt: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      available,
    };
    specialNotesStore = [newNote, ...specialNotesStore];
    return newNote;
  },
  toggleSpecialNote: async (id: string) => {
    specialNotesStore = specialNotesStore.map((note) =>
      note.id === id ? { ...note, available: !note.available } : note,
    );
    return specialNotesStore.find((n) => n.id === id);
  },
  deleteSpecialNote: async (id: string) => {
    specialNotesStore = specialNotesStore.filter((n) => n.id !== id);
    return true;
  },

  // 5. Item Commissions
  getCommissions: async () => [...commissionsStore],
  updateCommission: async (
    id: string,
    commissionType: "Not Configured" | "Percentage" | "Fixed Amount",
    commissionValue: number | null,
  ) => {
    commissionsStore = commissionsStore.map((item) =>
      item.id === id ? { ...item, commissionType, commissionValue } : item,
    );
    return commissionsStore.find((i) => i.id === id);
  },

  // 6. Schedules
  getSchedules: async () => [...schedulesStore],

  // 7. Physical Menu
  getPhysicalMenus: async () => [...physicalMenusStore],
  addPhysicalMenu: async (name: string, type: string, fileSize: string) => {
    const newFile: PhysicalMenuRecord = {
      id: `pm-${Date.now()}`,
      name,
      type,
      uploadedAt: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
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

  // 8. Schedule Details Sub-Views
  getScheduleItems: async () => [...scheduleItemsStore],
  toggleScheduleItem: async (id: string) => {
    scheduleItemsStore = scheduleItemsStore.map((item) =>
      item.id === id ? { ...item, available: !item.available } : item,
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
      createdAt: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      modifiedAt: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
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
      createdAt: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      modifiedAt: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
    scheduleVariantsStore = [...scheduleVariantsStore, newVar];
    return newVar;
  },

  getScheduleTables: async () => [...scheduleTablesStore],
  toggleScheduleTable: async (id: string) => {
    scheduleTablesStore = scheduleTablesStore.map((table) =>
      table.id === id ? { ...table, status: !table.status } : table,
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

  // 9. Sync POS
  syncPos: async () => {
    await new Promise((res) => setTimeout(res, 800));
    return {
      success: true,
      lastSync: "Just now",
      totalItemsSynced: menuItemsStore.length,
      categoriesSynced: scheduleCategoriesStore.length,
    };
  },

  // 10. Virtual Outlets
  getVirtualOutlets: async (): Promise<VirtualOutlet[]> => {
    return [...virtualOutletsStore];
  },

  addVirtualOutlet: async (outlet: { name: string; cuisine?: string }): Promise<VirtualOutlet> => {
    const newVo: VirtualOutlet = {
      id: `vo-${Date.now()}`,
      name: outlet.name,
      code: `VO-${Math.floor(100 + Math.random() * 900)}`,
      type: "Virtual Outlet",
      cuisine: outlet.cuisine || "Multi-Cuisine",
      description: "Cloud kitchen virtual brand",
      address: "Main Outlet Kitchen",
      contact: "+91 98765 00000",
      orderTypes: ["Delivery", "Takeaway"],
      status: "Active",
      menuCount: 0,
    };
    virtualOutletsStore = [...virtualOutletsStore, newVo];
    return newVo;
  },
};

let virtualOutletsStore: VirtualOutlet[] = [
  {
    id: "vo-1",
    name: "Biryani Blues (Cloud)",
    code: "BB-01",
    type: "Virtual Outlet",
    cuisine: "Hyderabadi / Biryani",
    description: "Cloud kitchen virtual outlet for biryani specials",
    address: "Central Kitchen, Block B",
    contact: "+91 98765 43210",
    orderTypes: ["Delivery", "Takeaway"],
    status: "Active",
    menuCount: 24,
  },
  {
    id: "vo-2",
    name: "Burger Bae (Cloud)",
    code: "BB-02",
    type: "Virtual Outlet",
    cuisine: "American / Fast Food",
    description: "Virtual burger brand",
    address: "Central Kitchen, Block B",
    contact: "+91 98765 43211",
    orderTypes: ["Delivery"],
    status: "Active",
    menuCount: 18,
  },
];
