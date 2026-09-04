import { useState } from "react";
import { Upload, Edit2, Save, X, Phone, Mail, Globe, MapPin } from "lucide-react";
import { toast } from "sonner";

export function EmailTemplateSettingsView() {
  const [headerColor, setHeaderColor] = useState("#C52031");
  const [address, setAddress] = useState(
    "3rd Floor, Tower-A, Gopal Palace, Nehrunagar, Ambawadi, Ahmedabad, Gujarat - 380015."
  );
  const [contactNo, setContactNo] = useState("07969 223344");
  const [emailId, setEmailId] = useState("support@petpooja.com");
  const [website, setWebsite] = useState("https://petpooja.com/");

  const handleSave = () => {
    toast.success("Email template settings saved successfully!");
  };

  return (
    <div className="space-y-4">
      {/* 1. Top Header Bar matching Screenshot 5 */}
      <div>
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Email Settings</h2>
        <p className="text-[12px] text-slate-500 mt-0.5">
          [This email template configured would be utilised in emails sent for Ebill and Gift card service only.]
        </p>
      </div>

      {/* 2. Split Editor and Live Preview matching Screenshot 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editor Form */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
          {/* Add Logo */}
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-bold text-slate-800">Add Logo</label>
            <div className="rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/30 p-6 text-center hover:bg-sky-50/50 transition cursor-pointer flex flex-col items-center justify-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                <Upload className="h-6 w-6" />
              </div>
            </div>
            <div className="text-[11px] text-slate-500">
              Note: Please upload file in JPEG/PNG/JPG format. Maximum file size: 500 KB
            </div>
          </div>

          {/* Header Color */}
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-bold text-slate-800">Header Color</label>
            <div className="flex items-center gap-3">
              <div
                className="h-9 w-12 rounded-lg border border-slate-200 shadow-2xs"
                style={{ backgroundColor: headerColor }}
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={headerColor}
                  onChange={(e) => setHeaderColor(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-mono text-slate-800 focus:border-teal-500 focus:outline-none"
                />
                <Edit2 className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Outlet Address */}
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-bold text-slate-800">Outlet Address</label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none"
            />
            <div className="text-[11px] text-teal-600">Note: Must be under 750 characters.</div>
          </div>

          {/* Outlet Contact No */}
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-bold text-slate-800">Outlet Contact No.</label>
            <input
              type="text"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>

          {/* Outlet Email Id */}
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-bold text-slate-800">Outlet Email Id</label>
            <input
              type="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Right Column: Live Email Mockup matching Screenshot 5 */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between">
          {/* Email Template Preview Box */}
          <div className="p-6 space-y-6">
            {/* Template Header Banner */}
            <div
              className="rounded-xl p-6 text-white flex items-center justify-between shadow-xs transition-colors"
              style={{ backgroundColor: headerColor }}
            >
              <div className="font-display font-black text-[22px] tracking-wide">
                PETP<span className="font-sans font-normal">⚬⚬</span>JA
              </div>
              <div className="text-[11px] opacity-80 uppercase tracking-wider font-semibold">
                Official E-Receipt
              </div>
            </div>

            {/* Template Body */}
            <div className="space-y-3 text-[13px] text-slate-700 leading-relaxed px-2 py-4">
              <p>Hello,</p>
              <p>Greetings of the day.</p>
              <p className="font-medium text-slate-800">
                Payment of Rs. 560 has been done successfully at Android Live from the gift card 1234567890.
              </p>
              <p className="font-bold text-slate-900">Remaining balance: Rs. 9082</p>
            </div>

            {/* Template Footer matching Screenshot 5 */}
            <div className="rounded-xl bg-[#1e293b] p-5 text-white text-[11.5px] space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span>{address}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-slate-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{contactNo}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{emailId}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                  <span>{website}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons matching Screenshot 5 */}
          <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => toast.info("Changes cancelled")}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-teal-600 px-6 py-2 text-[12.5px] font-bold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
