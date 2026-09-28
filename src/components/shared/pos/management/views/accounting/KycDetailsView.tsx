import { useState } from "react";
import {
  ShieldCheck,
  Building2,
  FileText,
  CheckCircle2,
  Upload,
  Download,
  Eye,
  Copy,
  Check,
  ExternalLink,
  Plus,
  RefreshCw,
  UtensilsCrossed,
  Wine,
  Flame,
  UserCheck,
  Calendar,
  AlertCircle,
  FileCheck2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface KycDocument {
  id: string;
  name: string;
  category: "Food Safety" | "Excise & Bar" | "Tax & Corporate" | "Municipal & Fire" | "Identity Proof";
  docNumber: string;
  issuingAuthority: string;
  issuedOn: string;
  validTill: string;
  status: "Verified" | "Expiring Soon" | "Pending Review";
  fileName: string;
  fileSize: string;
}

const INITIAL_DOCUMENTS: KycDocument[] = [
  {
    id: "doc-1",
    name: "FSSAI Food Business License",
    category: "Food Safety",
    docNumber: "12023999000142",
    issuingAuthority: "Food Safety and Standards Authority of India",
    issuedOn: "25 Dec 2022",
    validTill: "24 Dec 2027",
    status: "Verified",
    fileName: "FSSAI_License_HighwayInn.pdf",
    fileSize: "1.4 MB",
  },
  {
    id: "doc-2",
    name: "Bar & Restaurant Liquor License (FL-4)",
    category: "Excise & Bar",
    docNumber: "EXC-OD-ANG-8921",
    issuingAuthority: "State Excise Department, Odisha",
    issuedOn: "01 Apr 2024",
    validTill: "31 Mar 2027",
    status: "Verified",
    fileName: "Excise_Liquor_License_2026_27.pdf",
    fileSize: "2.1 MB",
  },
  {
    id: "doc-3",
    name: "Business PAN Card",
    category: "Tax & Corporate",
    docNumber: "AAACH1234F",
    issuingAuthority: "Income Tax Department, Govt of India",
    issuedOn: "14 May 2021",
    validTill: "Permanent",
    status: "Verified",
    fileName: "PAN_Highway_Inn_PvtLtd.pdf",
    fileSize: "840 KB",
  },
  {
    id: "doc-4",
    name: "GSTIN Registration Certificate",
    category: "Tax & Corporate",
    docNumber: "21AAAAA0000A1Z5",
    issuingAuthority: "Goods and Services Tax Network",
    issuedOn: "18 Jun 2021",
    validTill: "Active",
    status: "Verified",
    fileName: "GST_REG_06_Certificate.pdf",
    fileSize: "1.2 MB",
  },
  {
    id: "doc-5",
    name: "Eating House & Health Trade License",
    category: "Municipal & Fire",
    docNumber: "MOH-EHL-2026-4821",
    issuingAuthority: "Municipal Corporation / Health Dept",
    issuedOn: "01 Apr 2025",
    validTill: "31 Mar 2027",
    status: "Verified",
    fileName: "Health_Trade_License_2026.pdf",
    fileSize: "1.1 MB",
  },
  {
    id: "doc-6",
    name: "Fire Safety Compliance NOC",
    category: "Municipal & Fire",
    docNumber: "FS-NOC-2026-991",
    issuingAuthority: "State Fire and Emergency Services",
    issuedOn: "10 Feb 2025",
    validTill: "09 Feb 2027",
    status: "Verified",
    fileName: "Fire_Safety_NOC_2026.pdf",
    fileSize: "1.8 MB",
  },
];

export function KycDetailsView() {
  const [documents, setDocuments] = useState<KycDocument[]>(INITIAL_DOCUMENTS);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Upload Document Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [docType, setDocType] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [validTill, setValidTill] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  // View Document Preview Modal State
  const [viewingDoc, setViewingDoc] = useState<KycDocument | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!docType) errs.docType = "Please select document type.";
    if (!docNumber.trim()) errs.docNumber = "Document / License number is required.";
    if (!issuingAuthority.trim()) errs.issuingAuthority = "Issuing authority is required.";
    if (!validTill.trim()) errs.validTill = "Validity / Expiry date is required.";
    if (!selectedFile) errs.file = "Please upload a valid PDF or image document.";

    setUploadErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please fill all mandatory fields marked with red star (*)");
      return;
    }

    const newDoc: KycDocument = {
      id: `doc-${Date.now()}`,
      name: docType,
      category:
        docType.includes("FSSAI")
          ? "Food Safety"
          : docType.includes("Liquor") || docType.includes("Bar")
          ? "Excise & Bar"
          : docType.includes("PAN") || docType.includes("GST")
          ? "Tax & Corporate"
          : "Municipal & Fire",
      docNumber: docNumber.trim().toUpperCase(),
      issuingAuthority: issuingAuthority.trim(),
      issuedOn: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      validTill: validTill.trim(),
      status: "Verified",
      fileName: selectedFile ? selectedFile.name : `${docType.replace(/\s+/g, "_")}.pdf`,
      fileSize: selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB` : "1.2 MB",
    };

    setDocuments((prev) => [newDoc, ...prev]);
    toast.success(`${docType} uploaded and submitted for merchant compliance`);
    setIsUploadOpen(false);

    // Reset Form
    setDocType("");
    setDocNumber("");
    setIssuingAuthority("");
    setValidTill("");
    setSelectedFile(null);
    setUploadErrors({});
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">KYC & Compliance</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" /> 100% Verified Merchant
            </span>
          </div>
          <p className="text-[13px] text-slate-500 mt-1">
            Statutory business licenses, food safety certifications, and merchant identity verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => toast.success("Downloading consolidated Compliance Pack PDF...")}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" /> Export Compliance Pack
          </button>

          <button
            type="button"
            onClick={() => {
              setDocType("");
              setDocNumber("");
              setIssuingAuthority("");
              setValidTill("");
              setSelectedFile(null);
              setUploadErrors({});
              setIsUploadOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-teal-700 active:scale-[0.98] transition cursor-pointer shadow-sm shadow-teal-600/20"
          >
            <Plus className="h-4 w-4" /> Upload Document
          </button>
        </div>
      </div>

      {/* 2. Main KYC Status Overview Banner */}
      <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-white p-5 text-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/25">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[16px] font-bold text-slate-900">
                  HIGHWAY INN BAR & RESTAURANT PVT. LTD.
                </h3>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100/70 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                  Level-3 Enterprise KYC
                </span>
              </div>
              <p className="text-[12.5px] text-slate-600 leading-relaxed">
                All statutory documentation including Business PAN, FSSAI Food License (#12023999000142),
                State Excise Bar License, and Municipal Health NOC are authenticated and compliant.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center shrink-0 border-t md:border-t-0 md:border-l border-slate-200/80 pt-3 md:pt-0 md:pl-5 text-right">
            <div>
              <div className="text-[11px] font-medium text-slate-400">KYC Verification Ref</div>
              <div className="font-mono text-[13px] font-bold text-slate-800">KYC-2026-RET-8941</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Next Audit: Jan 2027</div>
            </div>
            <button
              type="button"
              onClick={() => toast.info("Re-verification check initialized with registrar")}
              className="p-2 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-white/80 transition cursor-pointer"
              title="Refresh Verification Status"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Core Statutory License Cards */}
      <div className="space-y-3">
        <div className="text-[13px] font-bold text-slate-900 tracking-tight px-0.5">
          Hospitality Operating Licenses & Clearances
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: FSSAI License */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition space-y-3.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                  <UtensilsCrossed className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-bold text-slate-900">FSSAI Food License</h4>
                  <span className="text-[11px] text-slate-400 font-medium">Food Safety & Hygiene</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" /> Active
              </span>
            </div>

            <div className="space-y-2 bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-[12px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[11.5px]">License No.</span>
                <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
                  <span>12023999000142</span>
                  <button
                    type="button"
                    onClick={() => handleCopy("12023999000142", "fssai")}
                    className="p-0.5 text-slate-400 hover:text-teal-600 cursor-pointer"
                  >
                    {copiedField === "fssai" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-[11.5px]">
                <span className="text-slate-400">Valid Till</span>
                <span className="font-semibold text-slate-700">24 Dec 2027</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5 text-[11.5px]">
              <span className="text-slate-400 truncate max-w-[170px]">FBO - Restaurant & Dining</span>
              <button
                type="button"
                onClick={() => setViewingDoc(documents[0])}
                className="text-teal-600 hover:text-teal-700 font-semibold cursor-pointer inline-flex items-center gap-1"
              >
                View Certificate <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Card 2: Bar & Liquor License */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition space-y-3.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                  <Wine className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-bold text-slate-900">Bar & Liquor License</h4>
                  <span className="text-[11px] text-slate-400 font-medium">Excise FL-4 Category</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" /> Active
              </span>
            </div>

            <div className="space-y-2 bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-[12px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[11.5px]">Excise Reg No.</span>
                <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
                  <span>EXC-OD-ANG-8921</span>
                  <button
                    type="button"
                    onClick={() => handleCopy("EXC-OD-ANG-8921", "excise")}
                    className="p-0.5 text-slate-400 hover:text-teal-600 cursor-pointer"
                  >
                    {copiedField === "excise" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-[11.5px]">
                <span className="text-slate-400">Valid Till</span>
                <span className="font-semibold text-slate-700">31 Mar 2027</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5 text-[11.5px]">
              <span className="text-slate-400 truncate max-w-[170px]">State Excise Dept, Odisha</span>
              <button
                type="button"
                onClick={() => setViewingDoc(documents[1])}
                className="text-teal-600 hover:text-teal-700 font-semibold cursor-pointer inline-flex items-center gap-1"
              >
                View License <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Card 3: Fire Safety & Health NOC */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition space-y-3.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                  <Flame className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-bold text-slate-900">Fire & Municipal NOC</h4>
                  <span className="text-[11px] text-slate-400 font-medium">Public Safety Clearance</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" /> Certified
              </span>
            </div>

            <div className="space-y-2 bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-[12px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[11.5px]">NOC Ref No.</span>
                <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
                  <span>FS-NOC-2026-991</span>
                  <button
                    type="button"
                    onClick={() => handleCopy("FS-NOC-2026-991", "fire")}
                    className="p-0.5 text-slate-400 hover:text-teal-600 cursor-pointer"
                  >
                    {copiedField === "fire" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-[11.5px]">
                <span className="text-slate-400">Valid Till</span>
                <span className="font-semibold text-slate-700">09 Feb 2027</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5 text-[11.5px]">
              <span className="text-slate-400 truncate max-w-[170px]">State Fire & Emergency</span>
              <button
                type="button"
                onClick={() => setViewingDoc(documents[5])}
                className="text-teal-600 hover:text-teal-700 font-semibold cursor-pointer inline-flex items-center gap-1"
              >
                View NOC <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Business Entity Identification & Authorized Signatory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Business Entity Profile */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4.5 w-4.5 text-teal-700" />
              <h3 className="text-[14px] font-bold text-slate-900">Business Entity Identification</h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Tax Verified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[12.5px]">
            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[11px] block">Business PAN</span>
              <div className="flex items-center justify-between mt-0.5">
                <span className="font-mono font-bold text-slate-800">AAACH1234F</span>
                <button
                  type="button"
                  onClick={() => handleCopy("AAACH1234F", "pan")}
                  className="p-0.5 text-slate-400 hover:text-teal-600 cursor-pointer"
                >
                  {copiedField === "pan" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>

            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[11px] block">GSTIN</span>
              <div className="flex items-center justify-between mt-0.5">
                <span className="font-mono font-bold text-slate-800">21AAAAA0000A1Z5</span>
                <button
                  type="button"
                  onClick={() => handleCopy("21AAAAA0000A1Z5", "gst")}
                  className="p-0.5 text-slate-400 hover:text-teal-600 cursor-pointer"
                >
                  {copiedField === "gst" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>

            <div className="col-span-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[11px] block">Corporate CIN / Reg No.</span>
              <span className="font-mono font-semibold text-slate-800">U55101OR2024PTC048291</span>
            </div>

            <div className="col-span-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[11px] block">Registered Invoice Address</span>
              <span className="text-slate-700 leading-snug block mt-0.5">
                Plot No 1977 Khata No 304/102, Karadagadia, Angul, Odisha — 759132
              </span>
            </div>
          </div>
        </div>

        {/* Authorized Signatory / Director KYC */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4.5 w-4.5 text-teal-700" />
              <h3 className="text-[14px] font-bold text-slate-900">Authorized Signatory Details</h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Biometric e-KYC Done
            </span>
          </div>

          <div className="space-y-3 text-[12.5px]">
            <div className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-800 font-bold text-[13px]">
                AM
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">Ayush Mishra</div>
                <div className="text-[11.5px] text-slate-500">Managing Director / Primary Merchant Admin</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[11px] block">Aadhaar (Masked)</span>
                <span className="font-mono font-bold text-slate-800">XXXX-XXXX-9821</span>
              </div>

              <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[11px] block">Director PAN</span>
                <span className="font-mono font-bold text-slate-800">XXXXX4819M</span>
              </div>
            </div>

            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-[12px]">
              <div>
                <span className="text-slate-400 text-[11px] block">Official Contact</span>
                <span className="text-slate-700 font-medium">ayush.mishra@highwayinn.com</span>
              </div>
              <span className="text-slate-500 font-mono text-[11.5px]">+91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Document Vault Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <div className="text-[13px] font-bold text-slate-900 tracking-tight">
            Compliance Document Repository ({documents.length})
          </div>
          <span className="text-[11.5px] text-slate-400">All certificates verified against central repositories</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11.5px] font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="px-4 py-3">Document Name</th>
                  <th className="px-3.5 py-3">Category</th>
                  <th className="px-3.5 py-3">License / Ref No.</th>
                  <th className="px-3.5 py-3">Issuing Authority</th>
                  <th className="px-3.5 py-3">Validity</th>
                  <th className="px-3.5 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-4 w-4 text-teal-600 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-900">{doc.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {doc.fileName} • {doc.fileSize}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3.5 py-3">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-3.5 py-3">
                      <span className="font-mono font-medium text-slate-800">{doc.docNumber}</span>
                    </td>
                    <td className="px-3.5 py-3 text-slate-600 text-[12px]">{doc.issuingAuthority}</td>
                    <td className="px-3.5 py-3">
                      <div className="text-slate-800 font-medium">{doc.validTill}</div>
                      <div className="text-[11px] text-slate-400">Issued {doc.issuedOn}</div>
                    </td>
                    <td className="px-3.5 py-3 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1 text-slate-400">
                        <button
                          type="button"
                          onClick={() => setViewingDoc(doc)}
                          className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-teal-600 transition cursor-pointer"
                          title="Preview Document"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toast.success(`Downloading ${doc.fileName}...`)}
                          className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
                          title="Download Certificate"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. Upload Document Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-teal-700 shadow-2xs">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-[16px] font-bold tracking-tight text-slate-900">
                  Upload Compliance Document
                </DialogTitle>
                <DialogDescription className="text-[12px] text-slate-500 mt-0.5">
                  Submit authentic statutory licenses for merchant KYC verification.
                </DialogDescription>
              </div>
            </div>
          </div>

          <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Document Type */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-slate-700">
                Document / License Type <span className="text-rose-500 font-bold ml-0.5">*</span>
              </label>
              <select
                value={docType}
                onChange={(e) => {
                  setDocType(e.target.value);
                  if (uploadErrors.docType) {
                    setUploadErrors((prev) => {
                      const next = { ...prev };
                      delete next.docType;
                      return next;
                    });
                  }
                }}
                className={`w-full rounded-xl border bg-white px-3 py-2 text-[13px] text-slate-800 focus:outline-none cursor-pointer shadow-2xs ${
                  uploadErrors.docType
                    ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                    : "border-slate-300 focus:border-teal-500"
                }`}
              >
                <option value="" disabled>
                  Select Document Type
                </option>
                <option value="FSSAI Food Business License">FSSAI Food Business License</option>
                <option value="Bar & Restaurant Liquor License">Bar & Restaurant Liquor License</option>
                <option value="Eating House / Municipal Health Trade License">
                  Eating House / Municipal Health Trade License
                </option>
                <option value="Fire Safety NOC">Fire Safety NOC</option>
                <option value="Pollution Control Board Clearance">Pollution Control Board Clearance</option>
                <option value="Business PAN Card">Business PAN Card</option>
                <option value="GSTIN Registration Certificate">GSTIN Registration Certificate</option>
                <option value="Authorized Signatory Identity Proof">Authorized Signatory Identity Proof</option>
                <option value="Other Statutory License">Other Statutory License</option>
              </select>
              {uploadErrors.docType && (
                <div className="flex items-center gap-1 text-[11.5px] font-medium text-rose-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{uploadErrors.docType}</span>
                </div>
              )}
            </div>

            {/* License / Document Number */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-slate-700">
                Document / License Number <span className="text-rose-500 font-bold ml-0.5">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 12023999000142 or EXC-OD-ANG-8921"
                value={docNumber}
                onChange={(e) => {
                  setDocNumber(e.target.value);
                  if (uploadErrors.docNumber) {
                    setUploadErrors((prev) => {
                      const next = { ...prev };
                      delete next.docNumber;
                      return next;
                    });
                  }
                }}
                className={`w-full font-mono rounded-xl border px-3.5 py-2 text-[13px] text-slate-800 focus:outline-none transition shadow-2xs ${
                  uploadErrors.docNumber
                    ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                    : "border-slate-300 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                }`}
              />
              {uploadErrors.docNumber && (
                <div className="flex items-center gap-1 text-[11.5px] font-medium text-rose-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{uploadErrors.docNumber}</span>
                </div>
              )}
            </div>

            {/* Issuing Authority & Expiry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-700">
                  Issuing Authority <span className="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. FSSAI / State Excise"
                  value={issuingAuthority}
                  onChange={(e) => {
                    setIssuingAuthority(e.target.value);
                    if (uploadErrors.issuingAuthority) {
                      setUploadErrors((prev) => {
                        const next = { ...prev };
                        delete next.issuingAuthority;
                        return next;
                      });
                    }
                  }}
                  className={`w-full rounded-xl border px-3.5 py-2 text-[13px] text-slate-800 focus:outline-none transition shadow-2xs ${
                    uploadErrors.issuingAuthority
                      ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                      : "border-slate-300 bg-white focus:border-teal-500"
                  }`}
                />
                {uploadErrors.issuingAuthority && (
                  <div className="flex items-center gap-1 text-[11.5px] font-medium text-rose-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{uploadErrors.issuingAuthority}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-700">
                  Valid Till / Expiry <span className="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24 Dec 2027 or Permanent"
                  value={validTill}
                  onChange={(e) => {
                    setValidTill(e.target.value);
                    if (uploadErrors.validTill) {
                      setUploadErrors((prev) => {
                        const next = { ...prev };
                        delete next.validTill;
                        return next;
                      });
                    }
                  }}
                  className={`w-full rounded-xl border px-3.5 py-2 text-[13px] text-slate-800 focus:outline-none transition shadow-2xs ${
                    uploadErrors.validTill
                      ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                      : "border-slate-300 bg-white focus:border-teal-500"
                  }`}
                />
                {uploadErrors.validTill && (
                  <div className="flex items-center gap-1 text-[11.5px] font-medium text-rose-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{uploadErrors.validTill}</span>
                  </div>
                )}
              </div>
            </div>

            {/* File Upload Box */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-slate-700 flex items-center justify-between">
                <span>
                  Upload Document File (PDF / JPG / PNG) <span className="text-rose-500 font-bold ml-0.5">*</span>
                </span>
                <span className="text-[11px] text-slate-400">Max 10 MB</span>
              </label>

              <div
                className={`relative rounded-xl border-2 border-dashed p-4 text-center transition cursor-pointer hover:bg-slate-50 ${
                  uploadErrors.file ? "border-rose-400 bg-rose-50/20" : "border-slate-300 bg-slate-50/50"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                      if (uploadErrors.file) {
                        setUploadErrors((prev) => {
                          const next = { ...prev };
                          delete next.file;
                          return next;
                        });
                      }
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="space-y-1">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-teal-600 shadow-2xs border border-slate-200">
                    <Upload className="h-4.5 w-4.5" />
                  </div>
                  {selectedFile ? (
                    <div className="text-[12.5px] font-semibold text-teal-800">
                      {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ) : (
                    <>
                      <div className="text-[12.5px] font-medium text-slate-700">
                        Click or drag document to upload
                      </div>
                      <p className="text-[11px] text-slate-400">
                        High resolution scanned PDF, PNG, or JPG formats
                      </p>
                    </>
                  )}
                </div>
              </div>
              {uploadErrors.file && (
                <div className="flex items-center gap-1 text-[11.5px] font-medium text-rose-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{uploadErrors.file}</span>
                </div>
              )}
            </div>

            <DialogFooter className="pt-3 gap-2 sm:gap-0 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-teal-600 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-teal-700 active:scale-[0.98] transition cursor-pointer shadow-sm shadow-teal-600/20"
              >
                Submit for Verification
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 7. View Document Preview Modal */}
      {viewingDoc && (
        <Dialog open={!!viewingDoc} onOpenChange={() => setViewingDoc(null)}>
          <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-4.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-teal-700 shadow-2xs">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-[15px] font-bold text-slate-900">
                    {viewingDoc.name}
                  </DialogTitle>
                  <DialogDescription className="text-[11.5px] text-slate-500">
                    Authenticated statutory compliance certificate
                  </DialogDescription>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Document Certificate Card Preview */}
              <div className="rounded-xl border-2 border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 space-y-4 shadow-inner text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-[13.5px]">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" /> Government Authenticated
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">License Number</div>
                  <div className="font-mono text-[16px] font-bold text-slate-900 tracking-wider">
                    {viewingDoc.docNumber}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left bg-white p-3 rounded-lg border border-slate-200/80 text-[11.5px]">
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">Authority</span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {viewingDoc.issuingAuthority}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">Valid Until</span>
                    <span className="font-semibold text-slate-800">{viewingDoc.validTill}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-100">
                    <span className="text-slate-400 block text-[10.5px]">Beneficiary Name</span>
                    <span className="font-semibold text-slate-800">HIGHWAY INN BAR & RESTAURANT</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                  <Lock className="h-3 w-3 text-slate-400" /> Digital SHA-256 Checksum Verified
                </div>
              </div>

              <div className="flex items-center justify-between text-[12px] text-slate-500 pt-1">
                <span>File: {viewingDoc.fileName}</span>
                <span>{viewingDoc.fileSize}</span>
              </div>
            </div>

            <DialogFooter className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Close Preview
              </button>

              <button
                type="button"
                onClick={() => {
                  toast.success(`Downloading ${viewingDoc.fileName}...`);
                  setViewingDoc(null);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-teal-700 transition cursor-pointer shadow-sm shadow-teal-600/20"
              >
                <Download className="h-3.5 w-3.5" /> Download Copy
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
