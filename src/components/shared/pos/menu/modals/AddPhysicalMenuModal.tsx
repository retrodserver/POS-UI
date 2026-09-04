import { useState, useRef } from "react";
import { X, Upload, FileText, CheckCircle2 } from "lucide-react";
import { useAddPhysicalMenu } from "@/hooks/queries/usePosMenu";
import { toast } from "sonner";

export function AddPhysicalMenuModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [menuType, setMenuType] = useState("Dine-in A4 Menu");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string>("2.4 MB");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMutation = useAddPhysicalMenu();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeMB} MB`);
      if (!name) {
        setName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a menu document title");
      return;
    }

    addMutation.mutate(
      {
        name: name.trim(),
        type: menuType,
        fileSize: selectedFileName ? fileSize : "1.8 MB",
      },
      {
        onSuccess: () => {
          toast.success(`Physical menu "${name}" uploaded successfully`);
          setName("");
          setSelectedFileName(null);
          onClose();
        },
        onError: () => {
          toast.error("Failed to upload physical menu file");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <div>
            <h2 className="text-[16px] font-semibold text-slate-800">Upload Physical Menu</h2>
            <p className="text-[11.5px] text-slate-500">Upload PDF or printable image menus</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
              Menu Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Main Dining Menu 2024 (English)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
              Menu Format / Type
            </label>
            <select
              value={menuType}
              onChange={(e) => setMenuType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13.5px] text-slate-900 focus:border-teal-500 focus:outline-none cursor-pointer"
            >
              <option value="Dine-in A4 Menu">Dine-in A4 Menu</option>
              <option value="Bar & Beverage Book">Bar & Beverage Book</option>
              <option value="Dessert & Special Booklet">Dessert & Special Booklet</option>
              <option value="Takeaway Pamphlet">Takeaway Pamphlet</option>
            </select>
          </div>

          {/* File Picker */}
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
              Upload PDF or Image File
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-6 text-center cursor-pointer transition bg-slate-50/50 hover:bg-teal-50/20"
            >
              <Upload className="h-7 w-7 text-slate-400 mx-auto mb-2" />
              {selectedFileName ? (
                <div className="flex items-center justify-center gap-2 text-[13px] font-medium text-teal-700">
                  <FileText className="h-4 w-4" />
                  <span className="truncate max-w-[200px]">{selectedFileName}</span>
                  <span className="text-[11px] text-slate-500">({fileSize})</span>
                </div>
              ) : (
                <>
                  <div className="text-[13px] font-medium text-slate-700">
                    Click to browse or drop file here
                  </div>
                  <div className="text-[11.5px] text-slate-400 mt-0.5">
                    Supports PDF, JPG, PNG up to 25MB
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="rounded-lg bg-teal-600 px-5 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-teal-700 transition cursor-pointer disabled:opacity-50"
            >
              {addMutation.isPending ? "Uploading..." : "Add File"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
