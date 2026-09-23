import React, { createContext, useContext, useState, useEffect } from "react";
import type { PosOutlet } from "@/types/posMenu";
import { toast } from "sonner";

const STORAGE_KEY_OUTLETS = "retrod_pos_outlets_catalog";
const STORAGE_KEY_ACTIVE_ID = "retrod_pos_active_outlet_id";

export const INITIAL_OUTLETS: PosOutlet[] = [
  {
    id: "outlet-primary",
    name: "HIGHWAY INN BAR & RESTAURANT",
    code: "HI-MAIN",
    type: "Primary Outlet",
    cuisine: "Multi-Cuisine & Bar",
    description: "Main flagship dining, bar lounge, banquet, and room service counter.",
    address: "National Highway 48, Mumbai - Pune Expressway, Sector 4",
    contact: "+91 98765 43210",
    orderTypes: ["Dine-In", "Takeaway", "Room Service", "Aggregators"],
    status: "Active",
    menuCount: 660,
  },
  {
    id: "vo-1",
    name: "Highway Inn - Cloud Kitchen (BIRYANI EXPRESS)",
    code: "HI-CK01",
    type: "Virtual Outlet",
    cuisine: "Biryani, Kebabs & Mughlai",
    description:
      "Specialized express delivery cloud kitchen for Dum Biryanis and Tandoori appetizers.",
    address: "Kitchen Bay 2, Highway Inn Compound, Sector 4",
    contact: "+91 98765 43211",
    orderTypes: ["Online Delivery", "Takeaway"],
    status: "Active",
    menuCount: 42,
  },
  {
    id: "vo-2",
    name: "Highway Inn - Burger Lab",
    code: "HI-BL02",
    type: "Virtual Outlet",
    cuisine: "Gourmet Burgers & Shakes",
    description:
      "Artisanal smash burgers, crispy sides, and loaded milkshakes for online ordering.",
    address: "Kitchen Bay 3, Highway Inn Compound, Sector 4",
    contact: "+91 98765 43212",
    orderTypes: ["Online Delivery"],
    status: "Active",
    menuCount: 28,
  },
];

type PosOutletContextType = {
  activeOutlet: PosOutlet;
  outlets: PosOutlet[];
  setActiveOutlet: (outletId: string) => void;
  createVirtualOutlet: (
    data: Omit<PosOutlet, "id" | "type" | "menuCount"> & { menuCount?: number },
  ) => PosOutlet;
  updateOutlet: (id: string, data: Partial<PosOutlet>) => void;
  toggleOutletStatus: (id: string) => void;
  deleteVirtualOutlet: (id: string) => void;
};

const PosOutletContext = createContext<PosOutletContextType | undefined>(undefined);

export function PosOutletProvider({ children }: { children: React.ReactNode }) {
  const [outlets, setOutlets] = useState<PosOutlet[]>(() => {
    if (typeof window === "undefined") return INITIAL_OUTLETS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_OUTLETS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_OUTLETS;
  });

  const [activeOutletId, setActiveOutletId] = useState<string>(() => {
    if (typeof window === "undefined") return "outlet-primary";
    try {
      const storedId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (storedId) return storedId;
    } catch {
      // ignore
    }
    return "outlet-primary";
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_OUTLETS, JSON.stringify(outlets));
    } catch {
      // ignore
    }
  }, [outlets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeOutletId);
    } catch {
      // ignore
    }
  }, [activeOutletId]);

  const activeOutlet =
    outlets.find((o) => o.id === activeOutletId) || outlets[0] || INITIAL_OUTLETS[0];

  const handleSetActiveOutlet = (outletId: string) => {
    const target = outlets.find((o) => o.id === outletId);
    if (!target) return;
    setActiveOutletId(outletId);
    toast.info(`Switched outlet context to ${target.name}`);
  };

  const createVirtualOutlet = (
    data: Omit<PosOutlet, "id" | "type" | "menuCount"> & { menuCount?: number },
  ) => {
    const newId = `vo-${Date.now()}`;
    const newOutlet: PosOutlet = {
      ...data,
      id: newId,
      type: "Virtual Outlet",
      menuCount: data.menuCount ?? 0,
      code: data.code || `HI-VO${Math.floor(100 + Math.random() * 900)}`,
      status: data.status || "Active",
    };

    setOutlets((prev) => [...prev, newOutlet]);
    toast.success(`Virtual outlet "${newOutlet.name}" created successfully!`);
    return newOutlet;
  };

  const updateOutlet = (id: string, data: Partial<PosOutlet>) => {
    setOutlets((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));
    toast.success("Outlet details updated");
  };

  const toggleOutletStatus = (id: string) => {
    setOutlets((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const next = o.status === "Active" ? "Inactive" : "Active";
          toast.info(`${o.name} is now ${next}`);
          return { ...o, status: next };
        }
        return o;
      }),
    );
  };

  const deleteVirtualOutlet = (id: string) => {
    const target = outlets.find((o) => o.id === id);
    if (target?.type === "Primary Outlet") {
      toast.error("Primary outlet cannot be deleted");
      return;
    }
    setOutlets((prev) => prev.filter((o) => o.id !== id));
    if (activeOutletId === id) {
      setActiveOutletId("outlet-primary");
    }
    toast.success(`Virtual outlet "${target?.name}" removed`);
  };

  return (
    <PosOutletContext.Provider
      value={{
        activeOutlet,
        outlets,
        setActiveOutlet: handleSetActiveOutlet,
        createVirtualOutlet,
        updateOutlet,
        toggleOutletStatus,
        deleteVirtualOutlet,
      }}
    >
      {children}
    </PosOutletContext.Provider>
  );
}

export function useOutletContext() {
  const ctx = useContext(PosOutletContext);
  if (!ctx) {
    throw new Error("useOutletContext must be used within a PosOutletProvider");
  }
  return ctx;
}
