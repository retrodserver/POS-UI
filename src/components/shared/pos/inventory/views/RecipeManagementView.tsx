import { useState, useMemo } from "react";
import {
  Sparkles,
  Plus,
  ChevronDown,
  FileText,
  Copy,
  Edit2,
  Trash2,
  Files,
  ChevronRight,
  Search,
} from "lucide-react";
import {
  DataTableHeader,
  DataTableFooter,
  type DataTableColumn,
} from "@/components/common/DataTableHeader";
import { toast } from "sonner";

interface RecipeRow {
  id: string;
  name: string;
  category: string;
}

export function RecipeManagementView() {
  const [autoConsumption, setAutoConsumption] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState("all");
  const [selectedItem, setSelectedItem] = useState("Select Item");
  const [selectedCategory, setSelectedCategory] = useState("Select Category");
  const [recipeStatus, setRecipeStatus] = useState("Created Recipes");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const recipeColumns: DataTableColumn<RecipeRow>[] = useMemo(
    () => [
      {
        id: "name",
        label: "Name",
        sortable: true,
        filterable: true,
        defaultWidth: 260,
        getValue: (r) => r.name,
      },
      {
        id: "category",
        label: "Category",
        sortable: true,
        filterable: true,
        defaultWidth: 200,
        getValue: (r) => r.category,
      },
      {
        id: "actions",
        label: "Action",
        sortable: false,
        filterable: false,
        align: "right",
        defaultWidth: 120,
      },
    ],
    [],
  );

  const [recipes, setRecipes] = useState<RecipeRow[]>([
    { id: "RCP-1", name: "Veg Manchuria Dry", category: "Veg Starters" },
    { id: "RCP-2", name: "Veg Manchuria Gravy", category: "Veg Main Course" },
    { id: "RCP-3", name: "Garlic Chann Dry", category: "Veg Starters" },
  ]);

  const categoryCards = [
    { id: "all", label: "All categories", count: "548 Items" },
    { id: "indian_whisky", label: "Indian Whisky", count: "67 Items" },
    { id: "scotch_whisky", label: "Scotch Whisky", count: "56 Items" },
    { id: "south_indian", label: "South Indian", count: "55 Items" },
    { id: "non_veg_starters", label: "Non-Veg Starters", count: "54 Items" },
  ];

  const filtered = recipes;

  return (
    <div className="space-y-4">
      {/* 1. AI Suggestion Banner matching Screenshot 2 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-200 bg-linear-to-r from-blue-50 via-sky-50 to-indigo-50 p-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-[13.5px] font-bold text-blue-950">
              Get AI-Powered Recipe Suggestions!
            </h4>
            <p className="text-[12px] text-teal-700/90">
              Based On The Items You've Added To Your Menu, We'll Create Personalized Recipes Just
              For You.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Analyzing menu items for automated recipe creation...")}
          className="rounded-xl border border-teal-300 bg-white px-4 py-2 text-[12.5px] font-bold text-teal-700 shadow-2xs hover:bg-teal-50 transition cursor-pointer"
        >
          Explore Recipes
        </button>
      </div>

      {/* 2. Header Bar matching Screenshot 2 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Recipe Management</h2>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => toast.info("Create Recipe Wizard opened")}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-[12.5px] font-semibold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create New
          </button>

          <button
            type="button"
            onClick={() => toast.info("Recipe actions menu")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            More Actions <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => toast.success("Exporting recipes...")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5 text-slate-500" />
            Files <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {/* Auto Consumption Toggle matching Screenshot 2 */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <button
              type="button"
              onClick={() => {
                setAutoConsumption(!autoConsumption);
                toast.success(
                  !autoConsumption
                    ? "Auto consumption enabled (raw materials will deduct on KOT billing)"
                    : "Auto consumption disabled",
                );
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoConsumption ? "bg-teal-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                  autoConsumption ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-[12.5px] font-semibold text-slate-700">Auto Consumption</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar matching Screenshot 2 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[150px]">
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] font-medium text-slate-700 focus:border-teal-500 focus:outline-none cursor-pointer"
            >
              <option value="Select Item">Select Item</option>
              <option value="Veg Manchuria Dry">Veg Manchuria Dry</option>
              <option value="Veg Manchuria Gravy">Veg Manchuria Gravy</option>
              <option value="Garlic Chann Dry">Garlic Chann Dry</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative min-w-[150px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] font-medium text-slate-700 focus:border-teal-500 focus:outline-none cursor-pointer"
            >
              <option value="Select Category">Select Category</option>
              <option value="Veg Starters">Veg Starters</option>
              <option value="Veg Main Course">Veg Main Course</option>
              <option value="Non-Veg Starters">Non-Veg Starters</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative min-w-[160px]">
            <select
              value={recipeStatus}
              onChange={(e) => setRecipeStatus(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-[12.5px] font-medium text-slate-700 focus:border-teal-500 focus:outline-none cursor-pointer"
            >
              <option value="Created Recipes">Created Recipes</option>
              <option value="Missing Recipes">Missing Recipes</option>
              <option value="All Items">All Items</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.info("Filter applied")}
              className="rounded-lg border border-teal-500 bg-white px-5 py-1.5 text-[12.5px] font-semibold text-teal-600 hover:bg-teal-50 transition cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedItem("Select Item");
                setSelectedCategory("Select Category");
                toast.info("Cleared filters");
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* 4. Horizontal Category Filter Cards matching Screenshot 2 */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {categoryCards.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCategoryTab(c.id)}
            className={`flex flex-col items-center justify-center rounded-xl px-5 py-2.5 min-w-[140px] border transition cursor-pointer ${
              activeCategoryTab === c.id
                ? "border-teal-500 bg-white shadow-2xs font-bold text-teal-600"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <div className="text-[13px] font-semibold">{c.label}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{c.count}</div>
          </button>
        ))}
        <button
          type="button"
          onClick={() => toast.info("More categories")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* 5. Recipes Table matching Screenshot 2 */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <DataTableHeader
              columns={recipeColumns}
              data={filtered}
              selectable
              themeVariant="primary"
            />
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 text-center">
                    <input type="checkbox" className="rounded border-slate-300 cursor-pointer" />
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{item.name}</td>
                  <td className="px-4 py-3 text-slate-600 text-[12.5px]">{item.category}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1 text-slate-400">
                      <button
                        type="button"
                        onClick={() => toast.info(`Viewing ingredients breakdown for ${item.name}`)}
                        className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                        title="View Ingredients"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.info(`Editing recipe for ${item.name}`)}
                        className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                        title="Edit Recipe"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.info(`Delete recipe for ${item.name}`)}
                        className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-rose-600 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.success(`Recipe for ${item.name} cloned`)}
                        className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                        title="Duplicate"
                      >
                        <Files className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Unified DataTableFooter */}
        <DataTableFooter
          currentPage={currentPage}
          totalCount={filtered.length}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          onPageChange={setCurrentPage}
          itemName="recipes"
        />
      </div>
    </div>
  );
}
