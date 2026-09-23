import { useState } from "react";
import { X, Store } from "lucide-react";
import { useAddVirtualOutlet } from "@/hooks/queries/usePosMenu";
import { toast } from "sonner";

export function AddVirtualOutletModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const addMutation = useAddVirtualOutlet();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a virtual outlet name");
      return;
    }

    addMutation.mutate(
      { name: name.trim(), cuisine: cuisine.trim() || "Multi-Cuisine" },
      {
        onSuccess: () => {
          toast.success(`Virtual outlet "${name}" added successfully`);
          setName("");
          setCuisine("");
          onClose();
        },
        onError: () => {
          toast.error("Failed to add virtual outlet");
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-slate-800">Add Virtual Outlet</h2>
              <p className="text-[11.5px] text-slate-500">
                Create independent menu for cloud brand
              </p>
            </div>
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
              Outlet / Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Highway Inn - Burger Lab"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
              Cuisine / Concept
            </label>
            <input
              type="text"
              placeholder="e.g. Fast Food, Biryani, Mughlai"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="rounded-lg bg-teal-50 p-3 border border-blue-100 text-[12px] text-teal-800">
            A virtual outlet allows you to run separate online brand menus, different prices, and
            packaging charges from the same kitchen.
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
              {addMutation.isPending ? "Creating..." : "Add Outlet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
