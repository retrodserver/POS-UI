import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  Download,
  FileText,
  Filter,
  CheckCircle2,
  X,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  DataTableHeader,
  type DataTableColumn,
} from "@/components/common/DataTableHeader";
import { toast } from "sonner";

interface ProductionMasterRecord {
  id: string;
  name: string;
  category: string;
  outputUnit: string;
  expectedYield: number;
  rawMaterialsCount: number;
  ingredientsSummary: string;
  standardCost: number;
}

export function ProductionMasterView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const masterColumns: DataTableColumn<ProductionMasterRecord>[] = useMemo(
    () => [
      {
        id: "id",
        label: "Recipe ID",
        sortable: true,
        filterable: true,
        defaultWidth: 130,
        getValue: (r) => r.id,
      },
      {
        id: "name",
        label: "Production Item",
        sortable: true,
        filterable: true,
        defaultWidth: 200,
        getValue: (r) => r.name,
      },
      {
        id: "category",
        label: "Category",
        sortable: true,
        filterable: true,
        defaultWidth: 150,
        getValue: (r) => r.category,
      },
      {
        id: "expectedYield",
        label: "Expected Batch Yield",
        sortable: true,
        align: "right",
        defaultWidth: 160,
        getValue: (r) => `${r.expectedYield} ${r.outputUnit}`,
      },
      {
        id: "ingredientsSummary",
        label: "Input Raw Materials",
        sortable: false,
        defaultWidth: 240,
        getValue: (r) => r.ingredientsSummary,
      },
      {
        id: "standardCost",
        label: "Standard Cost",
        sortable: true,
        align: "right",
        defaultWidth: 140,
        getValue: (r) => `₹ ${r.standardCost}`,
      },
      {
        id: "actions",
        label: "Actions",
        sortable: false,
        filterable: false,
        align: "right",
        defaultWidth: 110,
      },
    ],
    [],
  );

  // Demo production master conversion recipes
  const [records, setRecords] = useState<ProductionMasterRecord[]>([
    {
      id: "PRD-REC-01",
      name: "Makhani Gravy Base",
      category: "Gravies & Sauces",
      outputUnit: "Liter (L)",
      expectedYield: 25,
      rawMaterialsCount: 6,
      ingredientsSummary: "Tomatoes (15kg), Butter (3kg), Cream (2L), Spices (500g)",
      standardCost: 1850,
    },
    {
      id: "PRD-REC-02",
      name: "Pizza Dough Balls (250g)",
      category: "Bakery & Dough",
      outputUnit: "Pieces (pcs)",
      expectedYield: 40,
      rawMaterialsCount: 4,
      ingredientsSummary: "Flour (10kg), Yeast (100g), Olive Oil (500ml), Salt",
      standardCost: 520,
    },
    {
      id: "PRD-REC-03",
      name: "Tandoori Chicken Marination",
      category: "Meat Marinations",
      outputUnit: "Kilogram (kg)",
      expectedYield: 15,
      rawMaterialsCount: 5,
      ingredientsSummary: "Chicken Breast (15kg), Yogurt (2kg), Mustard Oil, Red Chili",
      standardCost: 3100,
    },
  ]);

  const [newRecipe, setNewRecipe] = useState({
    name: "",
    category: "Gravies & Sauces",
    outputUnit: "Liter (L)",
    expectedYield: "",
    ingredients: "",
    standardCost: "",
  });

  const categories = [
    "All",
    "Gravies & Sauces",
    "Bakery & Dough",
    "Meat Marinations",
    "Dessert Bases",
  ];

  const filteredRecords = records.filter((r) => {
    if (selectedCategory !== "All" && r.category !== selectedCategory) return false;
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipe.name || !newRecipe.expectedYield) {
      toast.error("Please fill in production item name and yield.");
      return;
    }

    const created: ProductionMasterRecord = {
      id: `PRD-REC-0${records.length + 4}`,
      name: newRecipe.name,
      category: newRecipe.category,
      outputUnit: newRecipe.outputUnit,
      expectedYield: parseFloat(newRecipe.expectedYield) || 1,
      rawMaterialsCount: 3,
      ingredientsSummary: newRecipe.ingredients || "Standard raw materials",
      standardCost: parseFloat(newRecipe.standardCost) || 0,
    };

    setRecords([created, ...records]);
    setIsCreateOpen(false);
    setNewRecipe({
      name: "",
      category: "Gravies & Sauces",
      outputUnit: "Liter (L)",
      expectedYield: "",
      ingredients: "",
      standardCost: "",
    });
    toast.success(`Production Recipe '${created.name}' created successfully.`);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Bar matching Screenshot 1 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Preparation Setup</h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create New
          </button>

          <button
            type="button"
            onClick={() => toast.info("Bulk production actions menu")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Action <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => toast.success("Exporting production recipes...")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5 text-slate-500" />
            Files <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Filter Bar matching Screenshot 1 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1 min-w-[200px] flex-1 max-w-xs">
            <label className="text-[11.5px] font-semibold text-slate-600">Search Production</label>
            <input
              type="text"
              placeholder=""
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1 min-w-[150px]">
            <div className="flex items-center gap-1 text-[11.5px] font-semibold text-slate-600">
              <span>Category</span>
              <span className="text-slate-400 cursor-help" title="Filter by production category">
                ⓘ
              </span>
            </div>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] font-medium text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                toast.info(`Filtered: ${filteredRecords.length} production recipes found`)
              }
              className="rounded-lg border border-teal-500 bg-white px-5 py-1.5 text-[12.5px] font-semibold text-teal-600 shadow-2xs hover:bg-teal-50 transition cursor-pointer"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                toast.info("Cleared filters");
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* 3. Production Conversion Recipes Table with Always-Present Header */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-slate-800">
            Raw Material Conversion Recipes
          </h3>
          <span className="text-[12px] text-slate-500">{filteredRecords.length} recipes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <DataTableHeader
              columns={masterColumns}
              data={filteredRecords}
              themeVariant="primary"
            />
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={masterColumns.length} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                        <FileText className="h-8 w-8" />
                      </div>
                      <div className="text-[14.5px] font-bold text-slate-700">
                        Convert Raw Material Management Record Not Found
                      </div>
                      <p className="text-[12px] text-slate-400 max-w-sm mx-auto">
                        No conversion recipes match your search criteria. You can create a new conversion recipe.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-teal-700 shadow-2xs cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        Create Production Recipe
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3 font-mono font-bold text-teal-600">{r.id}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{r.name}</td>
                    <td className="px-4 py-3 text-slate-600">{r.category}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-800">
                      {r.expectedYield} {r.outputUnit}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-[12px] max-w-sm truncate">
                      {r.ingredientsSummary}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      ₹ {r.standardCost}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => toast.success(`Starting batch conversion for ${r.name}...`)}
                        className="rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-600 px-3 py-1 text-[11.5px] font-semibold text-slate-700 transition cursor-pointer"
                      >
                        Run Batch
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-[16px] font-bold text-slate-900">Create Production Recipe</h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-slate-700">
                  Produced Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Makhani Gravy Base"
                  value={newRecipe.name}
                  onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-slate-700">Category</label>
                  <select
                    value={newRecipe.category}
                    onChange={(e) => setNewRecipe({ ...newRecipe, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] focus:outline-none focus:border-teal-500"
                  >
                    <option value="Gravies & Sauces">Gravies & Sauces</option>
                    <option value="Bakery & Dough">Bakery & Dough</option>
                    <option value="Meat Marinations">Meat Marinations</option>
                    <option value="Dessert Bases">Dessert Bases</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-slate-700">Output Unit</label>
                  <select
                    value={newRecipe.outputUnit}
                    onChange={(e) => setNewRecipe({ ...newRecipe, outputUnit: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] focus:outline-none focus:border-teal-500"
                  >
                    <option value="Liter (L)">Liter (L)</option>
                    <option value="Kilogram (kg)">Kilogram (kg)</option>
                    <option value="Pieces (pcs)">Pieces (pcs)</option>
                    <option value="Portion">Portion</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-slate-700">
                    Expected Yield *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="25"
                    value={newRecipe.expectedYield}
                    onChange={(e) => setNewRecipe({ ...newRecipe, expectedYield: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-slate-700">
                    Standard Cost (₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="1850"
                    value={newRecipe.standardCost}
                    onChange={(e) => setNewRecipe({ ...newRecipe, standardCost: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-slate-700">
                  Raw Materials Required
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Tomatoes (15kg), Butter (3kg), Spices (500g)"
                  value={newRecipe.ingredients}
                  onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
                >
                  Save Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
