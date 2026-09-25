import { useState, useMemo, useRef } from "react";
import {
  Printer,
  Sparkles,
  Download,
  Eye,
  Sliders,
  Check,
  RotateCcw,
  Store,
  Layers,
  FileText,
  Plus,
  Trash2,
  Crown,
  Coffee,
  Moon,
  Columns,
  BookOpen,
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Palette,
  Image as ImageIcon,
} from "lucide-react";
import type { MenuItem, MenuItemType } from "@/types/posMenu";
import {
  useMenuItems,
  usePhysicalMenus,
  useDeletePhysicalMenu,
  useAddPhysicalMenu,
} from "@/hooks/queries/usePosMenu";
import { useOutletContext } from "@/context/PosOutletContext";
import { AddPhysicalMenuModal } from "../modals/AddPhysicalMenuModal";
import { toast } from "sonner";

export type MenuTemplateId = "royal" | "modern" | "rustic" | "lounge" | "diner" | "visual";

interface TemplateConfig {
  id: MenuTemplateId;
  name: string;
  subtitle: string;
  badge: string;
  icon: typeof Crown;
  previewBg: string;
  textColor: string;
  accentColor: string;
}

const TEMPLATES: TemplateConfig[] = [
  {
    id: "royal",
    name: "Classic Fine Dining",
    subtitle: "Ornate gold borders & serif elegance",
    badge: "Heritage / Luxury",
    icon: Crown,
    previewBg: "bg-amber-100/90 border-amber-300",
    textColor: "text-amber-950",
    accentColor: "#b45309",
  },
  {
    id: "modern",
    name: "Modern Minimalist Bistro",
    subtitle: "Clean grid, teal accents & dietary dots",
    badge: "Urban / Contemporary",
    icon: Sparkles,
    previewBg: "bg-orange-100/80 border-teal-300",
    textColor: "text-slate-900",
    accentColor: "#0f766e",
  },
  {
    id: "visual",
    name: "Photo Gourmet Catalog",
    subtitle: "Appetizing dish thumbnails & full photo showcase",
    badge: "Illustrated / Visual",
    icon: ImageIcon,
    previewBg: "bg-orange-100/90 border-orange-300",
    textColor: "text-orange-950",
    accentColor: "#ea580c",
  },
  {
    id: "rustic",
    name: "Vintage Craft & Café",
    subtitle: "Artisanal paper tone with stamped headers",
    badge: "Cozy / Vintage",
    icon: Coffee,
    previewBg: "bg-amber-100/70 border-amber-600/40",
    textColor: "text-[#4a2e18]",
    accentColor: "#78350f",
  },
  {
    id: "lounge",
    name: "Midnight Royale Lounge",
    subtitle: "Deep obsidian dark with glowing gold fonts",
    badge: "Bar & Night Club",
    icon: Moon,
    previewBg: "bg-orange-200/80 border-slate-700",
    textColor: "text-amber-200",
    accentColor: "#d97706",
  },
  {
    id: "diner",
    name: "Two-Column Trattoria",
    subtitle: "Magazine dual-column with boxed categories",
    badge: "Family / Diner",
    icon: Columns,
    previewBg: "bg-orange-100/80 border-slate-300",
    textColor: "text-slate-900",
    accentColor: "#2563eb",
  },
];

export function PhysicalMenuView({ onBack }: { onBack?: () => void }) {
  const { activeOutlet } = useOutletContext();
  const { data: menuItems, isLoading } = useMenuItems(activeOutlet.id);
  const { data: physicalMenus } = usePhysicalMenus();
  const addMenuMutation = useAddPhysicalMenu();
  const deleteMenuMutation = useDeletePhysicalMenu();

  // Active Main Tab: "designer" (Live Generator) vs "files" (Uploaded PDF Records)
  const [activeMainTab, setActiveMainTab] = useState<"designer" | "files">("designer");

  // Template Selection
  const [selectedTemplate, setSelectedTemplate] = useState<MenuTemplateId>("royal");

  // Customization Options
  const [restaurantName, setRestaurantName] = useState(activeOutlet.name);
  const [tagline, setTagline] = useState(
    activeOutlet.type === "Primary Outlet"
      ? "Authentic Multi-Cuisine Dining & Cocktail Lounge"
      : `${activeOutlet.cuisine} • Freshly Prepared Everyday`,
  );
  const [phoneContact, setPhoneContact] = useState(activeOutlet.contact || "+91 98765 43210");
  const [addressLine, setAddressLine] = useState(
    activeOutlet.address || "Sector 4, Main Express Highway",
  );
  const [footerNote, setFooterNote] = useState(
    "All prices in Indian Rupees (INR). Govt taxes applicable. Please inform your server of any dietary allergies.",
  );

  // Layout & Visibility Toggles
  const [showDescriptions, setShowDescriptions] = useState(true);
  const [showDietaryBadges, setShowDietaryBadges] = useState(true);
  const [showItemCodes, setShowItemCodes] = useState(false);
  const [showPrices, setShowPrices] = useState(true);
  const [showPricesWithCurrency, setShowPricesWithCurrency] = useState(true);
  const [onlyActiveItems, setOnlyActiveItems] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Upload Modal for external PDF files
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Sync outlet name when active outlet switches
  useMemo(() => {
    setRestaurantName(activeOutlet.name);
    setTagline(
      activeOutlet.type === "Primary Outlet"
        ? "Authentic Multi-Cuisine Dining & Cocktail Lounge"
        : `${activeOutlet.cuisine} • Freshly Prepared Everyday`,
    );
    setPhoneContact(activeOutlet.contact);
    setAddressLine(activeOutlet.address);
  }, [activeOutlet]);

  // Derived Category List
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    menuItems?.forEach((i) => i.category && set.add(i.category));
    return Array.from(set);
  }, [menuItems]);

  // Grouped Menu Items by Category
  const categorizedItems = useMemo(() => {
    if (!menuItems) return {};
    const filtered = menuItems.filter((item) => {
      if (onlyActiveItems && item.status !== "Active") return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) {
        return false;
      }
      return true;
    });

    const groups: Record<string, MenuItem[]> = {};
    filtered.forEach((item) => {
      const cat = item.category || "Chef Specials";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [menuItems, onlyActiveItems, selectedCategories]);

  const toggleCategorySelection = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handlePrint = () => {
    toast.info("Preparing print layout...");
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleSaveSnapshot = () => {
    const templateName = TEMPLATES.find((t) => t.id === selectedTemplate)?.name || "Menu";
    addMenuMutation.mutate(
      {
        name: `${activeOutlet.name} - ${templateName} Menu (Auto-Generated)`,
        type: "Generated Dine-In Menu",
        fileSize: "1.4 MB",
      },
      {
        onSuccess: () => {
          toast.success("Saved printed menu snapshot to physical records!");
          setActiveMainTab("files");
        },
      },
    );
  };

  const handleDeleteFile = (id: string, name: string) => {
    deleteMenuMutation.mutate(id, {
      onSuccess: () => toast.success(`Deleted "${name}"`),
    });
  };

  const renderDietaryIcon = (type: MenuItemType) => {
    if (!showDietaryBadges) return null;
    switch (type) {
      case "Veg":
        return (
          <span
            title="Vegetarian"
            className="inline-flex items-center justify-center h-3.5 w-3.5 rounded-xs border border-emerald-600 bg-white shrink-0 ml-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          </span>
        );
      case "Non-Veg":
        return (
          <span
            title="Non-Vegetarian"
            className="inline-flex items-center justify-center h-3.5 w-3.5 rounded-xs border border-red-600 bg-white shrink-0 ml-1.5"
          >
            <span className="h-0 w-0 border-x-[2.5px] border-x-transparent border-b-[5px] border-b-red-600" />
          </span>
        );
      case "Egg":
        return (
          <span
            title="Egg"
            className="inline-flex items-center justify-center h-3.5 w-3.5 rounded-xs border border-amber-600 bg-white shrink-0 ml-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Main Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs no-print">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMainTab("designer")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition cursor-pointer ${
              activeMainTab === "designer"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Live Menu Generator & Print Studio
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab("files")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition cursor-pointer ${
              activeMainTab === "files"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileText className="h-4 w-4" />
            Saved / Uploaded Files ({physicalMenus?.length || 0})
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {activeMainTab === "designer" ? (
            <>
              <button
                type="button"
                onClick={handleSaveSnapshot}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Save Snapshot
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 px-5 py-2 text-[13px] font-bold text-white shadow-2xs transition cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                Print Physical Menu
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2 text-[13px] font-bold text-white shadow-2xs transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Upload PDF File
            </button>
          )}
        </div>
      </div>

      {activeMainTab === "designer" ? (
        <div className="space-y-6">
          {/* 2. Template Selector (5 Distinct Templates) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3 no-print">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14.5px] font-bold text-slate-900 flex items-center gap-2">
                  <Palette className="h-4.5 w-4.5 text-teal-600" />
                  Select Physical Menu Design Template
                </h3>
                <p className="text-[12px] text-slate-500">
                  Choose from 5 curated restaurant menu layouts. All items from "{activeOutlet.name}
                  " are automatically formatted.
                </p>
              </div>
              <span className="text-[11.5px] font-bold text-teal-700 uppercase tracking-wider">
                {TEMPLATES.length} Styles Available
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
              {TEMPLATES.map((tmpl) => {
                const Icon = tmpl.icon;
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(tmpl.id);
                      toast.success(`Switched to "${tmpl.name}" layout`);
                    }}
                    className={`relative rounded-xl border-2 p-3 text-left transition cursor-pointer flex flex-col justify-between min-h-[112px] ${
                      isSelected
                        ? "border-orange-500 bg-gradient-to-br from-orange-100 via-amber-100/90 to-orange-100 ring-3 ring-orange-400/35 shadow-sm text-orange-950"
                        : "border-orange-200/80 bg-gradient-to-br from-orange-50/90 via-amber-50/70 to-orange-50/50 hover:border-orange-400 hover:bg-orange-100/60 shadow-2xs hover:shadow-xs text-orange-950"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div
                          className={`p-1.5 rounded-lg border border-orange-200/80 ${tmpl.previewBg}`}
                        >
                          <Icon className="h-4 w-4" style={{ color: tmpl.accentColor }} />
                        </div>
                        {isSelected ? (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white text-[10px] font-bold shadow-xs">
                            ✓
                          </span>
                        ) : (
                          <span className="rounded bg-orange-200/70 border border-orange-300/60 px-1.5 py-0.2 text-[9px] font-bold text-orange-900">
                            {tmpl.badge.split("/")[0].trim()}
                          </span>
                        )}
                      </div>

                      <div className="text-[12.5px] font-bold text-orange-950 leading-tight">
                        {tmpl.name}
                      </div>
                      <div className="text-[10.5px] text-orange-900/80 mt-0.5 line-clamp-2">
                        {tmpl.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Designer Controls & Customizer Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Customization Controls (4 Cols) */}
            <div className="lg:col-span-4 space-y-4 no-print">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-[13.5px] font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-teal-600" />
                    Menu Customizer
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategories([]);
                      setShowDescriptions(true);
                      setShowDietaryBadges(true);
                      setShowItemCodes(false);
                      setShowPrices(true);
                      setZoomLevel(100);
                      toast.info("Reset customization settings");
                    }}
                    className="text-[11.5px] font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                </div>

                {/* Header Info */}
                <div className="space-y-2.5">
                  <div className="text-[11.5px] font-bold uppercase tracking-wider text-slate-400">
                    Header Details
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Restaurant Title
                    </label>
                    <input
                      type="text"
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] font-semibold text-slate-800 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Tagline / Specialty
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12px] text-slate-700 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={phoneContact}
                        onChange={(e) => setPhoneContact(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[11.5px] text-slate-700 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[11.5px] text-slate-700 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Display Toggles */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-[11.5px] font-bold uppercase tracking-wider text-slate-400">
                    Content Elements
                  </div>

                  <label className="flex items-center justify-between py-1 text-[12.5px] text-slate-700 cursor-pointer">
                    <span>Show Dish Descriptions</span>
                    <input
                      type="checkbox"
                      checked={showDescriptions}
                      onChange={(e) => setShowDescriptions(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                    />
                  </label>

                  <label className="flex items-center justify-between py-1 text-[12.5px] text-slate-700 cursor-pointer">
                    <span>Show Veg / Non-Veg Icons</span>
                    <input
                      type="checkbox"
                      checked={showDietaryBadges}
                      onChange={(e) => setShowDietaryBadges(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                    />
                  </label>

                  <label className="flex items-center justify-between py-1 text-[12.5px] text-slate-700 cursor-pointer">
                    <span>Show SKU / Item Codes</span>
                    <input
                      type="checkbox"
                      checked={showItemCodes}
                      onChange={(e) => setShowItemCodes(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                    />
                  </label>

                  <label className="flex items-center justify-between py-1 text-[12.5px] text-slate-700 cursor-pointer">
                    <span>Show Prices (₹)</span>
                    <input
                      type="checkbox"
                      checked={showPrices}
                      onChange={(e) => setShowPrices(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                    />
                  </label>

                  <label className="flex items-center justify-between py-1 text-[12.5px] text-slate-700 cursor-pointer">
                    <span>Only Active Dishes</span>
                    <input
                      type="checkbox"
                      checked={onlyActiveItems}
                      onChange={(e) => setOnlyActiveItems(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                    />
                  </label>
                </div>

                {/* Filter Categories for Print */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11.5px] font-bold uppercase tracking-wider text-slate-400">
                      Included Categories
                    </span>
                    {selectedCategories.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedCategories([])}
                        className="text-[11px] text-teal-700 font-semibold cursor-pointer"
                      >
                        Select All
                      </button>
                    )}
                  </div>

                  <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                    {allCategories.map((cat) => {
                      const isIncluded =
                        selectedCategories.length === 0 || selectedCategories.includes(cat);
                      return (
                        <label
                          key={cat}
                          className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-slate-50 text-[12px] text-slate-700 cursor-pointer"
                        >
                          <span className="truncate">{cat}</span>
                          <input
                            type="checkbox"
                            checked={isIncluded}
                            onChange={() => toggleCategorySelection(cat)}
                            className="rounded text-teal-600 focus:ring-teal-500 h-3.5 w-3.5"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Notes */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="block text-[11px] font-semibold text-slate-600">
                    Footer Note / Tax Disclaimer
                  </label>
                  <textarea
                    rows={2}
                    value={footerNote}
                    onChange={(e) => setFooterNote(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[11.5px] text-slate-700 focus:outline-hidden resize-none"
                  />
                </div>

                {/* Zoom Controller */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-slate-600">Preview Zoom:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                      className="rounded p-1 text-slate-500 hover:bg-slate-100 cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </button>
                    <span className="font-mono font-bold text-slate-800 w-10 text-center">
                      {zoomLevel}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                      className="rounded p-1 text-slate-500 hover:bg-slate-100 cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live A4 Print Sheet Preview (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col items-center">
              {/* Paper Sheet Preview Frame */}
              <div
                id="printable-menu-area"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: "top center",
                }}
                className={`w-full max-w-[780px] min-h-[860px] rounded-2xl shadow-xl transition-all p-5 sm:p-7 relative ${
                  selectedTemplate === "royal"
                    ? "bg-[#fffdf7] text-[#2c1d11] border-6 border-double border-[#b45309]/50"
                    : selectedTemplate === "modern"
                      ? "bg-white text-slate-900 border border-slate-300"
                      : selectedTemplate === "visual"
                        ? "bg-[#fffaf5] text-stone-900 border-2 border-orange-200/90 shadow-xl"
                        : selectedTemplate === "rustic"
                          ? "bg-[#fbf6ee] text-[#3d2410] border-4 border-dashed border-[#854d0e]/40"
                          : selectedTemplate === "lounge"
                            ? "bg-[#090d16] text-[#fef3c7] border-2 border-[#d97706]/60 shadow-2xl"
                            : "bg-white text-slate-900 border border-slate-300"
                }`}
              >
                {/* 1. Menu Header */}
                <div className="text-center pb-3.5 border-b border-current/20 space-y-0.5">
                  {selectedTemplate === "royal" && (
                    <div className="flex justify-center text-[#b45309] mb-0.5">
                      <Crown className="h-5 w-5" />
                    </div>
                  )}
                  {selectedTemplate === "visual" && (
                    <div className="flex justify-center text-orange-600 mb-0.5">
                      <Sparkles className="h-4.5 w-4.5" />
                    </div>
                  )}

                  <h1
                    className={`text-[22px] sm:text-[26px] font-extrabold tracking-tight uppercase ${
                      selectedTemplate === "royal"
                        ? "font-serif text-[#78350f]"
                        : selectedTemplate === "lounge"
                          ? "text-[#fbbf24] tracking-widest font-serif"
                          : selectedTemplate === "rustic"
                            ? "font-serif text-[#78350f]"
                            : selectedTemplate === "visual"
                              ? "text-orange-950 tracking-tight"
                              : "font-sans text-slate-900"
                    }`}
                  >
                    {restaurantName}
                  </h1>

                  {tagline && (
                    <p
                      className={`text-[12px] sm:text-[12.5px] italic opacity-85 ${
                        selectedTemplate === "lounge"
                          ? "text-amber-200/90"
                          : selectedTemplate === "visual"
                            ? "text-orange-900/80"
                            : ""
                      }`}
                    >
                      ~ {tagline} ~
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-2.5 text-[10.5px] opacity-70 pt-0.5">
                    {addressLine && <span>{addressLine}</span>}
                    {addressLine && phoneContact && <span>•</span>}
                    {phoneContact && <span>Reservations: {phoneContact}</span>}
                  </div>
                </div>

                {/* 2. Categorized Menu Items Layout */}
                <div
                  className={`mt-3.5 gap-x-6 gap-y-3.5 ${
                    selectedTemplate === "diner" || selectedTemplate === "visual"
                      ? "grid grid-cols-1 md:grid-cols-2"
                      : "grid grid-cols-1"
                  }`}
                >
                  {Object.keys(categorizedItems).length === 0 ? (
                    <div className="py-16 text-center opacity-60 col-span-full">
                      <Utensils className="h-7 w-7 mx-auto mb-1.5" />
                      <p className="text-[13px]">No menu items selected for printing.</p>
                    </div>
                  ) : (
                    Object.entries(categorizedItems).map(([category, items]) => (
                      <div
                        key={category}
                        className={`space-y-1.5 ${
                          selectedTemplate === "diner"
                            ? "p-2.5 sm:p-3 rounded-lg border border-slate-200 bg-slate-50/50"
                            : selectedTemplate === "visual"
                              ? "p-2.5 sm:p-3 rounded-xl border border-orange-200/70 bg-white/80 shadow-2xs"
                              : ""
                        }`}
                      >
                        {/* Category Banner / Heading */}
                        <div
                          className={`flex items-center gap-2 pb-1 ${
                            selectedTemplate === "royal"
                              ? "border-b border-[#b45309]/30 text-center justify-center"
                              : selectedTemplate === "modern"
                                ? "border-b-2 border-teal-600"
                                : selectedTemplate === "visual"
                                  ? "border-b-2 border-orange-500 text-orange-950"
                                  : selectedTemplate === "lounge"
                                    ? "border-b border-amber-500/40 text-[#f59e0b]"
                                    : selectedTemplate === "rustic"
                                      ? "border-b-2 border-dashed border-[#854d0e]/40"
                                      : "border-b border-slate-300"
                          }`}
                        >
                          <h2
                            className={`text-[14px] sm:text-[15px] font-bold uppercase tracking-wider ${
                              selectedTemplate === "royal"
                                ? "font-serif text-[#92400e]"
                                : selectedTemplate === "modern"
                                  ? "text-teal-800"
                                  : selectedTemplate === "visual"
                                    ? "text-orange-900 font-extrabold"
                                    : selectedTemplate === "lounge"
                                      ? "font-serif text-[#fbbf24]"
                                      : selectedTemplate === "rustic"
                                        ? "font-serif text-[#78350f]"
                                        : "text-slate-800"
                            }`}
                          >
                            {category}
                          </h2>
                          <span className="text-[10px] opacity-60">({items.length})</span>
                        </div>

                        {/* Items in Category */}
                        <div className="space-y-1.5 pt-0.5">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className={`transition ${
                                selectedTemplate === "visual"
                                  ? "flex items-start gap-2.5 p-1.5 rounded-lg bg-orange-50/40 border border-orange-100/80"
                                  : "space-y-0"
                              }`}
                            >
                              {/* If Visual Showcase Template: Display Dish Thumbnail */}
                              {selectedTemplate === "visual" && (
                                <div className="h-13 w-13 sm:h-14 sm:w-14 rounded-lg overflow-hidden shrink-0 border border-orange-200/80 bg-orange-50 flex items-center justify-center">
                                  {item.images && item.images.length > 0 && item.images[0] ? (
                                    <img
                                      src={item.images[0].url}
                                      alt={item.name}
                                      className="h-full w-full object-cover"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center justify-center text-orange-400">
                                      <ImageIcon className="h-4 w-4" />
                                      <span className="text-[8px] font-bold uppercase tracking-tighter mt-0.5">
                                        Food
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Item Details */}
                              <div className="flex-1 min-w-0">
                                {/* Item Header Line: Name + Dotted Leader + Price */}
                                <div className="flex items-baseline justify-between gap-1.5">
                                  <div className="flex items-center gap-1 min-w-0">
                                    <span
                                      className={`text-[12.5px] sm:text-[13px] font-bold truncate ${
                                        selectedTemplate === "royal"
                                          ? "font-serif"
                                          : selectedTemplate === "lounge"
                                            ? "text-amber-100"
                                            : selectedTemplate === "visual"
                                              ? "text-stone-900"
                                              : "text-slate-900"
                                      }`}
                                    >
                                      {item.name}
                                    </span>

                                    {renderDietaryIcon(item.itemType)}

                                    {showItemCodes && (
                                      <span className="font-mono text-[9px] opacity-60 ml-0.5 shrink-0">
                                        [{item.code}]
                                      </span>
                                    )}
                                  </div>

                                  {showPrices && (
                                    <div className="flex items-baseline gap-1 shrink-0 font-bold text-[12.5px] sm:text-[13px]">
                                      {selectedTemplate === "royal" && (
                                        <span className="hidden sm:inline-block border-b border-dotted border-current/30 flex-1 w-6" />
                                      )}
                                      <span
                                        className={
                                          selectedTemplate === "visual"
                                            ? "text-orange-700 font-extrabold"
                                            : ""
                                        }
                                      >
                                        {showPricesWithCurrency ? "₹" : ""}
                                        {item.price}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Description Line */}
                                {showDescriptions && item.description && (
                                  <p
                                    className={`text-[10.5px] sm:text-[11px] leading-tight opacity-75 mt-0.5 ${
                                      selectedTemplate === "royal" ? "italic" : ""
                                    } ${selectedTemplate === "visual" ? "line-clamp-2 text-stone-600" : ""}`}
                                  >
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* 3. Menu Footer Disclaimer */}
                {footerNote && (
                  <div className="mt-4 pt-2.5 border-t border-current/20 text-center text-[10.5px] opacity-70 leading-tight">
                    <p>{footerNote}</p>
                    <p className="mt-0.5 text-[9.5px] opacity-60">
                      Retrod POS Live Menu • Printed for {activeOutlet.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 4. Files List View (Saved / Uploaded Records) */
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-[15px] font-bold text-slate-900">
                Printed Menu Archives & Digital Files
              </h3>
              <p className="text-[12px] text-slate-500">
                Uploaded PDFs, brochures, and generated menu snapshots.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-bold text-white hover:bg-teal-700 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Upload PDF
            </button>
          </div>

          {!physicalMenus || physicalMenus.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-2" />
              <h4 className="text-[14px] font-bold text-slate-700">No Saved Menu Records</h4>
              <p className="text-[12px] text-slate-400 mt-1 max-w-sm mx-auto">
                Generate a live menu from the Live Generator tab or upload a PDF document.
              </p>
              <button
                type="button"
                onClick={() => setActiveMainTab("designer")}
                className="mt-4 rounded-lg bg-teal-50 px-4 py-2 text-[12.5px] font-bold text-teal-700 border border-teal-200 hover:bg-teal-100 transition cursor-pointer"
              >
                Go To Live Menu Generator
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {physicalMenus.map((file) => (
                <div
                  key={file.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:bg-white hover:shadow-xs transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10.5px] font-bold text-teal-800 border border-teal-200">
                        {file.type}
                      </span>
                    </div>
                    <h4
                      className="text-[13.5px] font-bold text-slate-900 line-clamp-1"
                      title={file.name}
                    >
                      {file.name}
                    </h4>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{file.uploadedAt}</span>
                      <span>•</span>
                      <span>{file.fileSize}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="flex items-center gap-1 text-[11.5px] font-bold text-teal-700 hover:underline cursor-pointer"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Print Menu
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(file.id, file.name)}
                      className="rounded p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload File Modal */}
      <AddPhysicalMenuModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}

function Utensils(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
      <path d="M15 2v18" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}
