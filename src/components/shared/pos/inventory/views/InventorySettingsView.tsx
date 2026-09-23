import { useState } from "react";
import {
  Search,
  Copy,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  RotateCw,
  FileText,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";

export function InventorySettingsView() {
  const [activeSection, setActiveSection] = useState<
    | "consumption_production"
    | "purchase_order"
    | "stock_purchase"
    | "sales_transfer"
    | "both_sales_purchases"
    | "closing_settings"
    | "other_settings"
    | "ledger_settings"
    | "batchwise_settings"
    | "configuration_logs"
  >("consumption_production");

  const [searchQuery, setSearchQuery] = useState("");

  // 1. Consumption and production
  const [notifyKitchenBelowPar, setNotifyKitchenBelowPar] = useState<"Yes" | "No">("No");
  const [reverseConsumptionCancelled, setReverseConsumptionCancelled] = useState<"Yes" | "No">(
    "Yes",
  );
  const [captureAvgPriceConverted, setCaptureAvgPriceConverted] = useState<"Yes" | "No">("Yes");
  const [restrictNegativeStockProduction, setRestrictNegativeStockProduction] = useState<
    "Yes" | "No"
  >("No");
  const [addRmGroupsMultipleRecipes, setAddRmGroupsMultipleRecipes] = useState<"Yes" | "No">("No");
  const [enableMultipleConversionRm, setEnableMultipleConversionRm] = useState<"Yes" | "No">("No");

  // 2. Purchase Order
  const [displayTaxInPO, setDisplayTaxInPO] = useState<"Yes" | "No">("No");
  const [deliverToOption, setDeliverToOption] = useState("Select options");
  const [configureShipToBill, setConfigureShipToBill] = useState<"Yes" | "No">("No");
  const [allowPOWhenStockNegative, setAllowPOWhenStockNegative] = useState<"Yes" | "No">("Yes");
  const [enableIncompleteRejectPO, setEnableIncompleteRejectPO] = useState<"Yes" | "No">("No");
  const [addPurchaseWithoutTransferApproval, setAddPurchaseWithoutTransferApproval] = useState<
    "Yes" | "No"
  >("No");

  // 3. Stock Purchase
  const [purchaseInvoiceLabel, setPurchaseInvoiceLabel] = useState("Invoice");
  const [avgPurchasePriceDays, setAvgPurchasePriceDays] = useState<
    "15" | "30" | "45" | "60" | "75" | "90" | "Till Now"
  >("90");
  const [allowEditDeletePurchase, setAllowEditDeletePurchase] = useState<"Yes" | "No">("Yes");
  const [allowBackdatedPurchases, setAllowBackdatedPurchases] = useState<"Yes" | "No">("Yes");
  const [allowedDaysBackdatedPurchase, setAllowedDaysBackdatedPurchase] = useState("60");
  const [allowRateCardsPurchaseReturn, setAllowRateCardsPurchaseReturn] = useState<"Yes" | "No">(
    "No",
  );

  // 4. Sales and Transfer
  const [salesInvoiceLabel, setSalesInvoiceLabel] = useState("TAX INVOICE");
  const [allowBackdatedSalesTransfer, setAllowBackdatedSalesTransfer] = useState<"Yes" | "No">(
    "Yes",
  );
  const [allowedDaysBackdatedSales, setAllowedDaysBackdatedSales] = useState("60");
  const [displayAvgPriceInternalTransfer, setDisplayAvgPriceInternalTransfer] = useState<
    "Yes" | "No"
  >("No");
  const [useProformaInvoiceOption, setUseProformaInvoiceOption] = useState<"Yes" | "No">("No");

  // 5. Settings applying to both sales and purchases
  const [useBarcodeInSalesTransferPurchase, setUseBarcodeInSalesTransferPurchase] = useState<
    "Yes" | "No"
  >("No");
  const [invoiceRoundOffType, setInvoiceRoundOffType] = useState<
    "Normal" | "None" | "Round off up" | "Round off down"
  >("None");
  const [displayCurrentStockInModules, setDisplayCurrentStockInModules] = useState<"Yes" | "No">(
    "Yes",
  );
  const [lockPricesInModules, setLockPricesInModules] = useState<"Yes" | "No">("No");
  const [activateCessTax, setActivateCessTax] = useState<"Yes" | "No">("No");

  // 6. Closing Related Settings (Screenshot 1)
  const [outletClosingTime, setOutletClosingTime] = useState("01:30");
  const [backdatedManualAdjDays, setBackdatedManualAdjDays] = useState("30");
  const [freezeClosingStock, setFreezeClosingStock] = useState<"Yes" | "No">("No");

  // 7. Other Settings (Screenshot 2)
  const [restaurantMapping, setRestaurantMapping] = useState("");
  const [outletOwnershipType, setOutletOwnershipType] = useState(
    "COFO - Company Owned Franchisee Operated",
  );
  const [preferCompleteSalesWastageNegative, setPreferCompleteSalesWastageNegative] = useState<
    "Yes" | "No"
  >("Yes");
  const [allowRateCardsOther, setAllowRateCardsOther] = useState<"Yes" | "No">("No");
  const [allowAddWastageFromPreviousDates, setAllowAddWastageFromPreviousDates] = useState<
    "Yes" | "No"
  >("Yes");

  // 8. Ledger Settings (Screenshot 3)
  const [invoiceNumMandatorySalesReturn, setInvoiceNumMandatorySalesReturn] = useState<
    "Yes" | "No"
  >("No");
  const [enableAutoPurchaseReturnEntry, setEnableAutoPurchaseReturnEntry] = useState<"Yes" | "No">(
    "No",
  );

  // 9. Batchwise Settings (Screenshot 4)
  const [useFifoLifoMethod, setUseFifoLifoMethod] = useState<"Yes" | "No">("No");
  const [includeBatchCodeInModules, setIncludeBatchCodeInModules] = useState<"Yes" | "No">("No");

  // 10. Configuration Logs (Screenshot 5)
  const [logFromDate, setLogFromDate] = useState("2026-08-27");
  const [logToDate, setLogToDate] = useState("2026-09-02");
  const [logs, setLogs] = useState<any[]>([]);

  // Sections list for left navigation rail
  const sections = [
    { id: "consumption_production", label: "Consumption and production" },
    { id: "purchase_order", label: "Purchase Order" },
    { id: "stock_purchase", label: "Stock Purchase" },
    { id: "sales_transfer", label: "Sales and Transfer" },
    { id: "both_sales_purchases", label: "Settings applying to both sales and purchases." },
    { id: "closing_settings", label: "Closing Related Settings" },
    { id: "other_settings", label: "Other Settings" },
    { id: "ledger_settings", label: "Ledger Settings" },
    { id: "batchwise_settings", label: "Batchwise Settings" },
    { id: "configuration_logs", label: "Configuration Logs" },
  ] as const;

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleCopySettings = () => {
    toast.info("Settings configuration copied to clipboard.");
  };

  return (
    <div className="flex flex-col lg:flex-row items-start gap-4 pb-12">
      {/* LEFT NAVIGATION RAIL matching Screenshot */}
      <div className="w-full lg:w-[280px] shrink-0 rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center gap-2.5 p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <Sliders className="h-4 w-4" />
          </div>
          <span className="text-[14px] font-bold text-slate-900">Stock Settings</span>
        </div>

        <div className="divide-y divide-slate-100 text-[13px]">
          {sections.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`w-full text-left px-4 py-3 font-medium transition cursor-pointer flex items-center justify-between ${
                activeSection === sec.id
                  ? "border-l-4 border-teal-600 bg-teal-50/40 text-slate-900 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="leading-snug">{sec.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT MAIN CONFIGURATION PANEL */}
      <div className="flex-1 w-full rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between overflow-hidden min-h-[580px]">
        {/* Top Header inside right panel matching Screenshot */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/30">
          <h3 className="text-[15px] font-bold text-slate-900">
            {sections.find((s) => s.id === activeSection)?.label}
          </h3>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopySettings}
              className="rounded-lg border border-teal-600 bg-white px-3.5 py-1.5 text-[12px] font-semibold text-teal-600 hover:bg-teal-50 transition cursor-pointer"
            >
              Copy Settings
            </button>

            <div className="relative min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search for setting here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-1 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* SECTION 1: Consumption and production */}
          {activeSection === "consumption_production" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-900">
                  <span>
                    Send Notification to kitchen when raw material reaches below at par stock level?
                  </span>
                  <span className="text-slate-400 cursor-help" title="Kitchen par notification">
                    ⓘ
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="notifyKitchen"
                      checked={notifyKitchenBelowPar === "Yes"}
                      onChange={() => setNotifyKitchenBelowPar("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="notifyKitchen"
                      checked={notifyKitchenBelowPar === "No"}
                      onChange={() => setNotifyKitchenBelowPar("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Reverse consumption as a result of an online order cancellation?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="reverseConsumption"
                      checked={reverseConsumptionCancelled === "Yes"}
                      onChange={() => setReverseConsumptionCancelled("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="reverseConsumption"
                      checked={reverseConsumptionCancelled === "No"}
                      onChange={() => setReverseConsumptionCancelled("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-[12px] text-amber-900 mt-2">
                  <Lightbulb className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>If an order is marked "Food ready," consumption cannot be reversed.</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-900">
                  <span>
                    Want to capture average purchase price for converted products based on raw
                    materials used in production?
                  </span>
                  <span
                    className="text-slate-400 cursor-help"
                    title="Average purchase price capture"
                  >
                    ⓘ
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="captureAvgPrice"
                      checked={captureAvgPriceConverted === "Yes"}
                      onChange={() => setCaptureAvgPriceConverted("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="captureAvgPrice"
                      checked={captureAvgPriceConverted === "No"}
                      onChange={() => setCaptureAvgPriceConverted("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  If the stock of utilised raw materials is negative at the time of production,
                  should it be restricted?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="restrictNegativeProd"
                      checked={restrictNegativeStockProduction === "Yes"}
                      onChange={() => setRestrictNegativeStockProduction("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="restrictNegativeProd"
                      checked={restrictNegativeStockProduction === "No"}
                      onChange={() => setRestrictNegativeStockProduction("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Wants to add raw material groups and multiple recipes?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="addRmGroups"
                      checked={addRmGroupsMultipleRecipes === "Yes"}
                      onChange={() => setAddRmGroupsMultipleRecipes("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="addRmGroups"
                      checked={addRmGroupsMultipleRecipes === "No"}
                      onChange={() => setAddRmGroupsMultipleRecipes("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Wants to enable multiple conversion at raw material level?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="enableMultiConv"
                      checked={enableMultipleConversionRm === "Yes"}
                      onChange={() => setEnableMultipleConversionRm("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="enableMultiConv"
                      checked={enableMultipleConversionRm === "No"}
                      onChange={() => setEnableMultipleConversionRm("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Purchase Order */}
          {activeSection === "purchase_order" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-900">
                  <span>Want to display Tax in Purchase Order?</span>
                  <span className="text-slate-400 cursor-help" title="Display tax">
                    ⓘ
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="displayTaxPO"
                      checked={displayTaxInPO === "Yes"}
                      onChange={() => setDisplayTaxInPO("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="displayTaxPO"
                      checked={displayTaxInPO === "No"}
                      onChange={() => setDisplayTaxInPO("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="space-y-1.5 max-w-md">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-900">
                  <span>In add Purchase Order "Deliver To"</span>
                  <span className="text-slate-400 cursor-help" title="Deliver to options">
                    ⓘ
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={deliverToOption}
                    onChange={(e) => setDeliverToOption(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-2 text-[12.5px] text-slate-700 focus:border-teal-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Select options">Select options</option>
                    <option value="Main Restaurant Kitchen">Main Restaurant Kitchen</option>
                    <option value="Central Warehouse">Central Warehouse</option>
                    <option value="Bar Section">Bar Section</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Want to configure ship to bill?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="shipToBill"
                      checked={configureShipToBill === "Yes"}
                      onChange={() => setConfigureShipToBill("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="shipToBill"
                      checked={configureShipToBill === "No"}
                      onChange={() => setConfigureShipToBill("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Allow the user to raise a Purchase Order when the stock at the kitchen/restaurant
                  level is negative?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="allowPONegative"
                      checked={allowPOWhenStockNegative === "Yes"}
                      onChange={() => setAllowPOWhenStockNegative("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="allowPONegative"
                      checked={allowPOWhenStockNegative === "No"}
                      onChange={() => setAllowPOWhenStockNegative("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-[12px] text-amber-900 mt-2">
                  <Lightbulb className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    Before issuing a PO, ensure that the kitchen and restaurant have adequate stock.
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Want to enable incomplete or reject purchase order set up?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="incompletePO"
                      checked={enableIncompleteRejectPO === "Yes"}
                      onChange={() => setEnableIncompleteRejectPO("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="incompletePO"
                      checked={enableIncompleteRejectPO === "No"}
                      onChange={() => setEnableIncompleteRejectPO("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Do you want to add a purchase from a PO without it being approved by the
                  restaurant or kitchen in their internal transfer module?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="addPurchaseWithoutApproval"
                      checked={addPurchaseWithoutTransferApproval === "Yes"}
                      onChange={() => setAddPurchaseWithoutTransferApproval("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="addPurchaseWithoutApproval"
                      checked={addPurchaseWithoutTransferApproval === "No"}
                      onChange={() => setAddPurchaseWithoutTransferApproval("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Stock Purchase */}
          {activeSection === "stock_purchase" && (
            <div className="space-y-6">
              <div className="space-y-1.5 max-w-md">
                <div className="text-[13px] font-semibold text-slate-900">
                  Label for a Purchase invoice <span className="text-red-500">*</span>
                </div>
                <input
                  type="text"
                  value={purchaseInvoiceLabel}
                  onChange={(e) => setPurchaseInvoiceLabel(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Choose how many days you want to use to obtain the latest average purchase price.
                </div>
                <div className="flex flex-wrap items-center gap-5">
                  {(["15", "30", "45", "60", "75", "90", "Till Now"] as const).map((days) => (
                    <label
                      key={days}
                      className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="avgDays"
                        checked={avgPurchasePriceDays === days}
                        onChange={() => setAvgPurchasePriceDays(days)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                      {days}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Allow user to edit or delete purchase once entries are completed?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="allowEditPurchase"
                      checked={allowEditDeletePurchase === "Yes"}
                      onChange={() => setAllowEditDeletePurchase("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="allowEditPurchase"
                      checked={allowEditDeletePurchase === "No"}
                      onChange={() => setAllowEditDeletePurchase("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-900">
                  <span>Would you like to allow user to add purchase from previous dates?</span>
                  <span className="text-slate-400 cursor-help" title="Backdated purchases">
                    ⓘ
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="allowBackdated"
                      checked={allowBackdatedPurchases === "Yes"}
                      onChange={() => setAllowBackdatedPurchases("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="allowBackdated"
                      checked={allowBackdatedPurchases === "No"}
                      onChange={() => setAllowBackdatedPurchases("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>

              {allowBackdatedPurchases === "Yes" && (
                <div className="space-y-1.5 max-w-xs">
                  <div className="text-[13px] font-semibold text-slate-900">
                    How many days are allowed for backdated purchases?
                  </div>
                  <input
                    type="number"
                    value={allowedDaysBackdatedPurchase}
                    onChange={(e) => setAllowedDaysBackdatedPurchase(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-mono text-slate-800 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Do you want to allow for rate cards in purchase return?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="rateCardsReturn"
                      checked={allowRateCardsPurchaseReturn === "Yes"}
                      onChange={() => setAllowRateCardsPurchaseReturn("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="rateCardsReturn"
                      checked={allowRateCardsPurchaseReturn === "No"}
                      onChange={() => setAllowRateCardsPurchaseReturn("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: Sales and Transfer */}
          {activeSection === "sales_transfer" && (
            <div className="space-y-6">
              <div className="space-y-1.5 max-w-md">
                <div className="text-[13px] font-semibold text-slate-900">
                  Label for a sales invoice <span className="text-red-500">*</span>
                </div>
                <input
                  type="text"
                  value={salesInvoiceLabel}
                  onChange={(e) => setSalesInvoiceLabel(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-900">
                  <span>
                    Would you like to allow user to add sales or transfer from previous dates?
                  </span>
                  <span className="text-slate-400 cursor-help" title="Backdated sales">
                    ⓘ
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="backdatedSales"
                      checked={allowBackdatedSalesTransfer === "Yes"}
                      onChange={() => setAllowBackdatedSalesTransfer("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="backdatedSales"
                      checked={allowBackdatedSalesTransfer === "No"}
                      onChange={() => setAllowBackdatedSalesTransfer("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>

              {allowBackdatedSalesTransfer === "Yes" && (
                <div className="space-y-1.5 max-w-xs">
                  <div className="text-[13px] font-semibold text-slate-900">
                    How many days are allowed for backdated sales or transfer?
                  </div>
                  <input
                    type="number"
                    value={allowedDaysBackdatedSales}
                    onChange={(e) => setAllowedDaysBackdatedSales(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-mono text-slate-800 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Want to display average purchase(without tax) price as internal transfer/sale/sale
                  return price?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="avgPriceInternalTransfer"
                      checked={displayAvgPriceInternalTransfer === "Yes"}
                      onChange={() => setDisplayAvgPriceInternalTransfer("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="avgPriceInternalTransfer"
                      checked={displayAvgPriceInternalTransfer === "No"}
                      onChange={() => setDisplayAvgPriceInternalTransfer("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-[12px] text-amber-900 mt-2">
                  <Lightbulb className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    To maintain the average purchase price, include the correct raw material
                    purchase price when adding the purchases.
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Do you want to use the proforma invoice option?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="proformaInvoice"
                      checked={useProformaInvoiceOption === "Yes"}
                      onChange={() => setUseProformaInvoiceOption("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="proformaInvoice"
                      checked={useProformaInvoiceOption === "No"}
                      onChange={() => setUseProformaInvoiceOption("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: Settings applying to both sales and purchases */}
          {activeSection === "both_sales_purchases" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Do you want to use a barcode in sales, transfers, or purchases?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="barcodeUsage"
                      checked={useBarcodeInSalesTransferPurchase === "Yes"}
                      onChange={() => setUseBarcodeInSalesTransferPurchase("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="barcodeUsage"
                      checked={useBarcodeInSalesTransferPurchase === "No"}
                      onChange={() => setUseBarcodeInSalesTransferPurchase("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-[12px] text-amber-900 mt-2">
                  <Lightbulb className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    Before you enable this option, generate barcodes.{" "}
                    <button
                      type="button"
                      onClick={() => toast.info("Opening Barcode Generator")}
                      className="font-bold underline text-amber-950 hover:text-teal-700 cursor-pointer"
                    >
                      Click Here.
                    </button>
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Want to round off or set the invoice total amount as a round figure?
                </div>
                <div className="flex flex-wrap items-center gap-5">
                  {(["Normal", "None", "Round off up", "Round off down"] as const).map((rType) => (
                    <label
                      key={rType}
                      className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="roundOff"
                        checked={invoiceRoundOffType === rType}
                        onChange={() => setInvoiceRoundOffType(rType)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                      {rType}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Do you want the current stock of sellers and restaurants to be displayed in the
                  Purchase and Consumption modules?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="displayCurrentStock"
                      checked={displayCurrentStockInModules === "Yes"}
                      onChange={() => setDisplayCurrentStockInModules("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="displayCurrentStock"
                      checked={displayCurrentStockInModules === "No"}
                      onChange={() => setDisplayCurrentStockInModules("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Do you want to lock prices in Purchase and Consumption modules?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="lockPrices"
                      checked={lockPricesInModules === "Yes"}
                      onChange={() => setLockPricesInModules("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="lockPrices"
                      checked={lockPricesInModules === "No"}
                      onChange={() => setLockPricesInModules("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Would you like to activate cess tax on invoices?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="cessTax"
                      checked={activateCessTax === "Yes"}
                      onChange={() => setActivateCessTax("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="cessTax"
                      checked={activateCessTax === "No"}
                      onChange={() => setActivateCessTax("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: Closing Related Settings (Screenshot 1) */}
          {activeSection === "closing_settings" && (
            <div className="space-y-6">
              {/* Question 1: Daily closing time */}
              <div className="space-y-1.5 max-w-md">
                <div className="text-[13px] font-semibold text-slate-900">
                  For inventory, Please provide your daily outlet closing time.[Time zone =
                  Asia/Calcutta]
                </div>
                <div className="relative">
                  <select
                    value={outletClosingTime}
                    onChange={(e) => setOutletClosingTime(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-2 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none cursor-pointer"
                  >
                    <option value="00:00">00:00</option>
                    <option value="00:30">00:30</option>
                    <option value="01:00">01:00</option>
                    <option value="01:30">01:30</option>
                    <option value="02:00">02:00</option>
                    <option value="02:30">02:30</option>
                    <option value="03:00">03:00</option>
                    <option value="23:00">23:00</option>
                    <option value="23:30">23:30</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>

                {/* Yellow Alert Box matching Screenshot 1 */}
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-[12px] text-amber-900 mt-2">
                  <Lightbulb className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    If the drop-down is disabled, it indicates that you have already changed the
                    closing time; please try to change it after 10:00 am.
                  </span>
                </div>

                {/* Blue Note matching Screenshot 1 */}
                <div className="text-[12px] text-teal-600 pt-1">
                  Note: If the timing in the above configuration is blank then your restaurant
                  closes at 00:00 a.m. and your timezone is Asia/Calcutta.
                </div>
              </div>

              {/* Question 2: Backdated manual adjustments */}
              <div className="space-y-1.5 max-w-xs">
                <div className="text-[13px] font-semibold text-slate-900">
                  How many days are allowed for backdated manual adjustments?
                </div>
                <input
                  type="number"
                  value={backdatedManualAdjDays}
                  onChange={(e) => setBackdatedManualAdjDays(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-mono text-slate-800 focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Question 3: Freeze closing stock */}
              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Do you want to freeze the closing stock? Once the closing stock is frozen, it
                  remains unchanged.
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="freezeClosing"
                      checked={freezeClosingStock === "Yes"}
                      onChange={() => setFreezeClosingStock("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="freezeClosing"
                      checked={freezeClosingStock === "No"}
                      onChange={() => setFreezeClosingStock("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: Other Settings (Screenshot 2) */}
          {activeSection === "other_settings" && (
            <div className="space-y-6">
              {/* Question 1: Restaurant or kitchen mapping */}
              <div className="space-y-1.5 max-w-md">
                <div className="text-[13px] font-semibold text-slate-900">
                  Restaurant or kitchen mapping
                </div>
                <div className="relative">
                  <select
                    value={restaurantMapping}
                    onChange={(e) => setRestaurantMapping(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-2 text-[13px] text-slate-700 focus:border-teal-500 focus:outline-none cursor-pointer"
                  >
                    <option value="">Select mapping (empty for all)</option>
                    <option value="Main Restaurant">Main Restaurant</option>
                    <option value="Bar Section">Bar Section</option>
                    <option value="Pantry">Pantry</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
                <div className="text-[12px] text-teal-600 pt-0.5">
                  Note: For all restaurants, please make it empty.
                </div>
              </div>

              {/* Question 2: Type of outlet (Ownership) */}
              <div className="space-y-1.5 max-w-md">
                <div className="text-[13px] font-semibold text-slate-900">
                  Type of outlet (Ownership)
                </div>
                <div className="relative">
                  <select
                    value={outletOwnershipType}
                    onChange={(e) => setOutletOwnershipType(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-2 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="COFO - Company Owned Franchisee Operated">
                      COFO - Company Owned Franchisee Operated
                    </option>
                    <option value="COCO - Company Owned Company Operated">
                      COCO - Company Owned Company Operated
                    </option>
                    <option value="FOFO - Franchisee Owned Franchisee Operated">
                      FOFO - Franchisee Owned Franchisee Operated
                    </option>
                    <option value="FOCO - Franchisee Owned Company Operated">
                      FOCO - Franchisee Owned Company Operated
                    </option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Question 3: Complete sales, wastage or transfer on negative stock */}
              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  If raw material stock is negative, would you prefer that a user complete
                  sales,wastage or a transfer?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="preferCompleteNegative"
                      checked={preferCompleteSalesWastageNegative === "Yes"}
                      onChange={() => setPreferCompleteSalesWastageNegative("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="preferCompleteNegative"
                      checked={preferCompleteSalesWastageNegative === "No"}
                      onChange={() => setPreferCompleteSalesWastageNegative("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* Question 4: Rate cards */}
              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Do you want to allow for rate cards?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="allowRateCards"
                      checked={allowRateCardsOther === "Yes"}
                      onChange={() => setAllowRateCardsOther("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="allowRateCards"
                      checked={allowRateCardsOther === "No"}
                      onChange={() => setAllowRateCardsOther("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-[12px] text-amber-900 mt-2">
                  <Lightbulb className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>Maintain separate rates for COCO and FOFO locations.</span>
                </div>
              </div>

              {/* Question 5: Wastage stock from previous dates */}
              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Would you like to allow user to add wastage stock from previous dates?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="addWastageBackdated"
                      checked={allowAddWastageFromPreviousDates === "Yes"}
                      onChange={() => setAllowAddWastageFromPreviousDates("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="addWastageBackdated"
                      checked={allowAddWastageFromPreviousDates === "No"}
                      onChange={() => setAllowAddWastageFromPreviousDates("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: Ledger Settings (Screenshot 3) */}
          {activeSection === "ledger_settings" && (
            <div className="space-y-6">
              {/* Question 1: Invoice number mandatory */}
              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Is an invoice number mandatory for both sales return and purchase return?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="invoiceNumMandatory"
                      checked={invoiceNumMandatorySalesReturn === "Yes"}
                      onChange={() => setInvoiceNumMandatorySalesReturn("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="invoiceNumMandatory"
                      checked={invoiceNumMandatorySalesReturn === "No"}
                      onChange={() => setInvoiceNumMandatorySalesReturn("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* Question 2: Automatic purchase return entry */}
              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Do you want to enable automatic purchase return entry at the time of purchase?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="autoPurchaseReturn"
                      checked={enableAutoPurchaseReturnEntry === "Yes"}
                      onChange={() => setEnableAutoPurchaseReturnEntry("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="autoPurchaseReturn"
                      checked={enableAutoPurchaseReturnEntry === "No"}
                      onChange={() => setEnableAutoPurchaseReturnEntry("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>

                {/* Yellow Alert Box matching Screenshot 3 */}
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-[12px] text-amber-900 mt-2">
                  <Lightbulb className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    If this setting is enabled, it is required to enter the invoice number in the
                    purchase to ensure consistency in the purchase return.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 9: Batchwise Settings (Screenshot 4) */}
          {activeSection === "batchwise_settings" && (
            <div className="space-y-6">
              {/* Question 1: FIFO or LIFO */}
              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Would you like to use the FIFO or LIFO calculating method?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="fifoLifo"
                      checked={useFifoLifoMethod === "Yes"}
                      onChange={() => setUseFifoLifoMethod("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="fifoLifo"
                      checked={useFifoLifoMethod === "No"}
                      onChange={() => setUseFifoLifoMethod("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* Question 2: Include batch code */}
              <div className="space-y-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  Would you like to include the batch code in all relevant inventory modules?
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="batchCode"
                      checked={includeBatchCodeInModules === "Yes"}
                      onChange={() => setIncludeBatchCodeInModules("Yes")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="batchCode"
                      checked={includeBatchCodeInModules === "No"}
                      onChange={() => setIncludeBatchCodeInModules("No")}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 10: Configuration Logs (Screenshot 5) */}
          {activeSection === "configuration_logs" && (
            <div className="space-y-6">
              {/* Filter Bar matching Screenshot 5 */}
              <div className="flex flex-wrap items-end gap-3">
                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-slate-600">From Date</label>
                  <input
                    type="date"
                    value={logFromDate}
                    onChange={(e) => setLogFromDate(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-slate-600">To Date</label>
                  <input
                    type="date"
                    value={logToDate}
                    onChange={(e) => setLogToDate(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => toast.info("Searching configuration logs...")}
                  className="rounded-lg border border-teal-500 bg-white px-5 py-1.5 text-[12.5px] font-semibold text-teal-600 shadow-2xs hover:bg-teal-50 transition cursor-pointer"
                >
                  Search
                </button>

                <button
                  type="button"
                  onClick={() => toast.info("Reloading audit log")}
                  className="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  title="Reload"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
              </div>

              {/* Empty state illustration matching Screenshot 5 */}
              {logs.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-xs space-y-3">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                    <FileText className="h-10 w-10" />
                  </div>
                  <div className="text-[15px] font-bold text-slate-700">Record Not Found</div>
                  <p className="text-[12.5px] text-slate-400 max-w-sm mx-auto">
                    No configuration changes recorded in this date range.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-[12.5px]">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <tr>
                        <th className="px-4 py-2.5">Date & Time</th>
                        <th className="px-4 py-2.5">Section</th>
                        <th className="px-4 py-2.5">Setting</th>
                        <th className="px-4 py-2.5">Previous Value</th>
                        <th className="px-4 py-2.5">New Value</th>
                        <th className="px-4 py-2.5">Changed By</th>
                      </tr>
                    </thead>
                    <tbody>{/* Logs rows */}</tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* BOTTOM SAVE BAR matching Screenshot */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-teal-600 px-8 py-2 text-[13px] font-bold text-white shadow-md hover:bg-teal-700 transition cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
