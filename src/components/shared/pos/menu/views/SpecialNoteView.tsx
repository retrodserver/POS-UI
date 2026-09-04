import { useState } from "react";
import { Plus, Upload, ChevronDown, Copy, Edit2, Trash2, CheckSquare, Square } from "lucide-react";
import {
  useSpecialNotes,
  useToggleSpecialNote,
  useDeleteSpecialNote,
  useAddSpecialNote,
} from "@/hooks/queries/usePosMenu";
import { AddSpecialNoteModal } from "../modals/AddSpecialNoteModal";
import { toast } from "sonner";

export function SpecialNoteView({ onBack }: { onBack?: () => void }) {
  const { data: specialNotes, isFetching } = useSpecialNotes();
  const toggleMutation = useToggleSpecialNote();
  const deleteMutation = useDeleteSpecialNote();
  const addMutation = useAddSpecialNote();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter
  const filteredNotes = (specialNotes ?? []).filter((note) =>
    note.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNotes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotes.map((n) => n.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDuplicate = (noteName: string) => {
    addMutation.mutate(
      { name: `${noteName} (Copy)`, available: true },
      {
        onSuccess: () => {
          toast.success(`Duplicated "${noteName}"`);
        },
      }
    );
  };

  const handleDelete = (id: string, name: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success(`Deleted special note "${name}"`);
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. Header & Actions from Petpooja Screenshot 4 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-slate-500">Menu</span>
          <span className="text-[13px] text-slate-400">›</span>
          <span className="text-[14px] font-bold text-slate-900">Special Note</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Special Note
          </button>
          <button
            type="button"
            onClick={() => toast.info("Import notes CSV/Excel dialog opened")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5 text-slate-500" />
            Import
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Action <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Filter Bar from Screenshot 4 */}
      <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[240px] max-w-sm">
            <label className="block text-[12px] font-medium text-slate-600 mb-1">
              Special Note Name
            </label>
            <input
              type="text"
              placeholder="Search by note name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-1.5 text-[13px] text-slate-800 focus:border-teal-500 focus:outline-hidden"
            />
          </div>
          <button
            type="button"
            onClick={() => toast.info(`Found ${filteredNotes.length} matching notes`)}
            className="rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-medium text-white hover:bg-teal-700 transition cursor-pointer shadow-xs"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              toast.info("Showing all special notes");
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Show All
          </button>
        </div>
      </div>

      {/* 3. Data Table from Screenshot 4 */}
      <div className="rounded-xl border border-slate-300 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="w-12 px-4 py-3">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {selectedIds.length > 0 && selectedIds.length === filteredNotes.length ? (
                      <CheckSquare className="h-4 w-4 text-teal-600" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3">Special Note</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Available</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNotes.map((note) => {
                const isSelected = selectedIds.includes(note.id);
                return (
                  <tr
                    key={note.id}
                    className={`transition hover:bg-slate-50/80 ${
                      isSelected ? "bg-teal-50/40" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(note.id)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-teal-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{note.name}</td>
                    <td className="px-4 py-3 text-slate-500">{note.createdAt}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleMutation.mutate(note.id)}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer ${
                          note.available
                            ? "bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                        title="Click to toggle availability"
                      >
                        {note.available ? "Yes" : "No"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-400">
                        <button
                          type="button"
                          onClick={() => handleDuplicate(note.name)}
                          className="p-1 hover:text-teal-600 hover:bg-slate-100 rounded transition"
                          title="Duplicate Special Note"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            toast.info(`Editing "${note.name}"`);
                            setIsAddModalOpen(true);
                          }}
                          className="p-1 hover:text-teal-600 hover:bg-slate-100 rounded transition"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(note.id, note.name)}
                          className="p-1 hover:text-red-600 hover:bg-slate-100 rounded transition"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination / Record count footer from Screenshot 4 */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex items-center justify-between text-[12.5px] text-slate-500">
          <span>
            Showing 1 to {filteredNotes.length} of {filteredNotes.length} records
          </span>
          {selectedIds.length > 0 && (
            <span className="text-teal-700 font-medium">
              {selectedIds.length} notes selected
            </span>
          )}
        </div>
      </div>

      {/* Add Special Note Modal */}
      <AddSpecialNoteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
