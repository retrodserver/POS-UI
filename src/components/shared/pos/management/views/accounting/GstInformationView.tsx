import { useState } from "react";
import { ChevronDown, Save, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function GstInformationView() {
  const [hasGst, setHasGst] = useState<"Yes" | "No">("No");
  const [gstNumber, setGstNumber] = useState("");
  const [registeredName, setRegisteredName] = useState("HIGHWAY INN BAR & RESTAURANT");
  const [registeredAddress, setRegisteredAddress] = useState(
    "PLOT NO 1977 KHATA NO 304/102, KARADAGADIA, Angul, Angul, Odisha, 759132",
  );
  const [state, setState] = useState("Odisha");
  const [city, setCity] = useState("Angul");
  const [vatNumber, setVatNumber] = useState("");
  const [pan, setPan] = useState("");
  const [cin, setCin] = useState("");
  const [location, setLocation] = useState("Angul");
  const [zipCode, setZipCode] = useState("759132");

  const handleSave = () => {
    toast.success("GST and business tax details saved successfully!");
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* 1. Header matching Screenshot 4 */}
      <div>
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
          Update GST Information
        </h2>
      </div>

      {/* 2. Main Form Card matching Screenshot 4 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        {/* Do you have GST No? */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-slate-900">Do you have GST No?</label>
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="hasGst"
                checked={hasGst === "Yes"}
                onChange={() => setHasGst("Yes")}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              Yes
            </label>
            <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="hasGst"
                checked={hasGst === "No"}
                onChange={() => setHasGst("No")}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              No
            </label>
          </div>
        </div>

        {hasGst === "Yes" && (
          <div className="space-y-1.5 max-w-md">
            <label className="text-[12.5px] font-semibold text-slate-800">GSTIN Number *</label>
            <input
              type="text"
              placeholder="e.g. 21AAAAA0000A1Z5"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] font-mono text-slate-800 focus:border-teal-500 focus:outline-none uppercase"
            />
          </div>
        )}

        {/* Registered Name For Invoice */}
        <div className="space-y-1.5">
          <label className="text-[12.5px] font-semibold text-slate-800">
            Registered Name For Invoice
          </label>
          <input
            type="text"
            value={registeredName}
            onChange={(e) => setRegisteredName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none"
          />
        </div>

        {/* Registered Address For Invoice */}
        <div className="space-y-1.5">
          <label className="text-[12.5px] font-semibold text-slate-800">
            Registered Address For Invoice
          </label>
          <textarea
            rows={3}
            value={registeredAddress}
            onChange={(e) => setRegisteredAddress(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none"
          />
        </div>

        {/* State & City Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-semibold text-slate-800">State</label>
            <div className="relative">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-2 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="Odisha">Odisha</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Delhi">Delhi</option>
                <option value="Gujarat">Gujarat</option>
                <option value="West Bengal">West Bengal</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12.5px] font-semibold text-slate-800">City</label>
            <div className="relative">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-2 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="Angul">Angul</option>
                <option value="Bhubaneswar">Bhubaneswar</option>
                <option value="Cuttack">Cuttack</option>
                <option value="Rourkela">Rourkela</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* VAT, PAN, CIN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-semibold text-slate-800">
              Vat Number (If Any)
            </label>
            <input
              type="text"
              value={vatNumber}
              onChange={(e) => setVatNumber(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12.5px] font-semibold text-slate-800">PAN</label>
            <input
              type="text"
              value={pan}
              onChange={(e) => setPan(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none uppercase"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12.5px] font-semibold text-slate-800">CIN</label>
            <input
              type="text"
              value={cin}
              onChange={(e) => setCin(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Location & Zip Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-semibold text-slate-800">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12.5px] font-semibold text-slate-800">Zip Code</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* 3. Bottom Action Bar matching Screenshot 4 */}
        <div className="border-t border-slate-100 pt-4 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={() => toast.info("Cancelled changes")}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-teal-600 px-6 py-2 text-[12.5px] font-bold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
