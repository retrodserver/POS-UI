import { useState } from "react";
import { FolderX, Plus, FileText, Download, Printer, Trash2, Eye } from "lucide-react";
import { usePhysicalMenus, useDeletePhysicalMenu } from "@/hooks/queries/usePosMenu";
import { AddPhysicalMenuModal } from "../modals/AddPhysicalMenuModal";
import { toast } from "sonner";

export function PhysicalMenuView({ onBack }: { onBack?: () => void }) {
  const { data: physicalMenus } = usePhysicalMenus();
  const deleteMutation = useDeletePhysicalMenu();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleDelete = (id: string, name: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success(`Removed physical menu "${name}"`);
      },
    });
  };

  const handlePrint = (name: string) => {
    toast.info(`Sending "${name}" to counter receipt/document printer...`);
  };

  const handleDownload = (name: string) => {
    toast.success(`Downloading PDF for "${name}"`);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header and Action Buttons matching Petpooja Screenshot 7 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-slate-500">Menu</span>
          <span className="text-[13px] text-slate-400">›</span>
          <span className="text-[14px] font-bold text-slate-900">Physical Menu</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add File
          </button>
        </div>
      </div>

      {/* 2. Subtitle from Screenshot 7 */}
      <div className="text-[13px] font-medium text-slate-800">
        Here Are All The Menus That You Have Uploaded
      </div>

      {/* 3. Main Content Area */}
      <div className="rounded-2xl border border-slate-300 bg-white p-8 shadow-xs min-h-[420px] flex flex-col justify-center">
        {(!physicalMenus || physicalMenus.length === 0) ? (
          /* Empty state matching Petpooja Screenshot 7 */
          <div className="text-center py-12">
            <div className="relative inline-block mb-3">
              <div className="flex h-20 w-24 items-center justify-center rounded-xl bg-slate-100 text-slate-500 mx-auto shadow-2xs">
                <FileText className="h-10 w-10 stroke-[1.2]" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-600 text-white shadow-xs text-[11px] font-bold">
                ✕
              </div>
            </div>
            <h4 className="text-[15px] font-medium text-slate-700">No Record Found</h4>
            <p className="text-[12.5px] text-slate-400 mt-1 max-w-sm mx-auto">
              Upload printable dine-in menus, beverage booklets, or takeaway cards to store digital copies.
            </p>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[13px] font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Upload First Menu File
            </button>
          </div>
        ) : (
          /* Uploaded Menus List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {physicalMenus.map((file) => (
              <div
                key={file.id}
                className="group rounded-xl border border-slate-300 bg-slate-50/50 p-4 shadow-2xs hover:shadow-md hover:bg-white transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10.5px] font-semibold text-teal-800 border border-teal-200">
                      {file.type}
                    </span>
                  </div>
                  <h4 className="text-[14px] font-bold text-slate-900 line-clamp-1">{file.name}</h4>
                  <div className="mt-1 flex items-center gap-2 text-[11.5px] text-slate-500">
                    <span>Uploaded {file.uploadedAt}</span>
                    <span>•</span>
                    <span>{file.fileSize}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-slate-500">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDownload(file.name)}
                      className="p-1.5 hover:text-teal-700 hover:bg-teal-50 rounded-md transition"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePrint(file.name)}
                      className="p-1.5 hover:text-slate-800 hover:bg-slate-100 rounded-md transition"
                      title="Print Menu"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(file.id, file.name)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                    title="Delete Menu"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Physical Menu Modal */}
      <AddPhysicalMenuModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
