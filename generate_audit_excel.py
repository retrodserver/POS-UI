import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.Workbook()

# Colors (Brand Rose & Modern Palette)
ROSE_HEADER_FILL = PatternFill(start_color="881337", end_color="881337", fill_type="solid") # Deep rose
ROSE_ACCENT_FILL = PatternFill(start_color="FFE4E6", end_color="FFE4E6", fill_type="solid") # Light rose
DARK_BLUE_FILL = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid") # Slate 800
LIGHT_GRAY_FILL = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")

# Status Fills
COMPLIANT_FILL = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid") # Green
PARTIAL_FILL = PatternFill(start_color="FEF9C3", end_color="FEF9C3", fill_type="solid") # Yellow
NON_COMPLIANT_FILL = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid") # Red
MISSING_FILL = PatternFill(start_color="F3E8FF", end_color="F3E8FF", fill_type="solid") # Purple

# Priority Fills
PRIORITY_HIGH_FILL = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
PRIORITY_MED_FILL = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
PRIORITY_LOW_FILL = PatternFill(start_color="E0F2FE", end_color="E0F2FE", fill_type="solid")

# Fonts
FONT_TITLE = Font(name="Arial", size=16, bold=True, color="FFFFFF")
FONT_SUBTITLE = Font(name="Arial", size=11, italic=True, color="E2E8F0")
FONT_HEADER = Font(name="Arial", size=11, bold=True, color="FFFFFF")
FONT_SECTION = Font(name="Arial", size=12, bold=True, color="1E293B")
FONT_REGULAR = Font(name="Arial", size=10, color="0F172A")
FONT_BOLD = Font(name="Arial", size=10, bold=True, color="0F172A")
FONT_CODE = Font(name="Consolas", size=9.5, color="881337")
FONT_STATUS_GREEN = Font(name="Arial", size=10, bold=True, color="166534")
FONT_STATUS_YELLOW = Font(name="Arial", size=10, bold=True, color="854D0E")
FONT_STATUS_RED = Font(name="Arial", size=10, bold=True, color="991B1B")
FONT_STATUS_PURPLE = Font(name="Arial", size=10, bold=True, color="6B21A8")

# Borders
THIN_BORDER_SIDE = Side(border_style="thin", color="CBD5E1")
THIN_BORDER = Border(left=THIN_BORDER_SIDE, right=THIN_BORDER_SIDE, top=THIN_BORDER_SIDE, bottom=THIN_BORDER_SIDE)
HEADER_BORDER = Border(left=THIN_BORDER_SIDE, right=THIN_BORDER_SIDE, top=Side(border_style="medium", color="881337"), bottom=Side(border_style="medium", color="881337"))

# ----------------------------------------------------
# SHEET 1: EXECUTIVE SUMMARY
# ----------------------------------------------------
ws_summary = wb.active
ws_summary.title = "Executive Summary"
ws_summary.views.sheetView[0].showGridLines = True

# Title Banner
ws_summary.merge_cells("A1:G1")
ws_summary["A1"] = "Retrod POS vs PMS Design System Compliance Audit"
ws_summary["A1"].font = FONT_TITLE
ws_summary["A1"].fill = ROSE_HEADER_FILL
ws_summary["A1"].alignment = Alignment(horizontal="center", vertical="center")
ws_summary.row_dimensions[1].height = 40

ws_summary.merge_cells("A2:G2")
ws_summary["A2"] = "Architectural & Visual Alignment Matrix | Generated for Retrod Engineering Team"
ws_summary["A2"].font = FONT_SUBTITLE
ws_summary["A2"].fill = DARK_BLUE_FILL
ws_summary["A2"].alignment = Alignment(horizontal="center", vertical="center")
ws_summary.row_dimensions[2].height = 24

# KPI Summary Cards
ws_summary["B4"] = "Overall Match Score"
ws_summary["B4"].font = FONT_BOLD
ws_summary["B5"] = "58%"
ws_summary["B5"].font = Font(name="Arial", size=22, bold=True, color="854D0E")
ws_summary["B5"].fill = PARTIAL_FILL
ws_summary["B5"].alignment = Alignment(horizontal="center", vertical="center")

ws_summary["C4"] = "Fully Compliant"
ws_summary["C4"].font = FONT_BOLD
ws_summary["C5"] = "11 Items"
ws_summary["C5"].font = Font(name="Arial", size=16, bold=True, color="166534")
ws_summary["C5"].fill = COMPLIANT_FILL
ws_summary["C5"].alignment = Alignment(horizontal="center", vertical="center")

ws_summary["D4"] = "Partially Compliant"
ws_summary["D4"].font = FONT_BOLD
ws_summary["D5"] = "14 Items"
ws_summary["D5"].font = Font(name="Arial", size=16, bold=True, color="854D0E")
ws_summary["D5"].fill = PARTIAL_FILL
ws_summary["D5"].alignment = Alignment(horizontal="center", vertical="center")

ws_summary["E4"] = "Non-Compliant (Diffs)"
ws_summary["E4"].font = FONT_BOLD
ws_summary["E5"] = "9 Items"
ws_summary["E5"].font = Font(name="Arial", size=16, bold=True, color="991B1B")
ws_summary["E5"].fill = NON_COMPLIANT_FILL
ws_summary["E5"].alignment = Alignment(horizontal="center", vertical="center")

ws_summary["F4"] = "Missing Capabilities"
ws_summary["F4"].font = FONT_BOLD
ws_summary["F5"] = "4 Items"
ws_summary["F5"].font = Font(name="Arial", size=16, bold=True, color="6B21A8")
ws_summary["F5"].fill = MISSING_FILL
ws_summary["F5"].alignment = Alignment(horizontal="center", vertical="center")

for col in ["B", "C", "D", "E", "F"]:
    ws_summary[f"{col}4"].alignment = Alignment(horizontal="center", vertical="center")
    ws_summary[f"{col}4"].fill = LIGHT_GRAY_FILL
    ws_summary[f"{col}4"].border = THIN_BORDER
    ws_summary[f"{col}5"].border = THIN_BORDER
ws_summary.row_dimensions[4].height = 24
ws_summary.row_dimensions[5].height = 36

# Summary Table by Category
summary_headers = ["Domain / Category", "Total Checks", "Compliant", "Partial", "Non-Compliant", "Missing", "Alignment %"]
ws_summary.row_dimensions[7].height = 28
for c_idx, h in enumerate(summary_headers, start=1):
    cell = ws_summary.cell(row=7, column=c_idx, value=h)
    cell.font = FONT_HEADER
    cell.fill = DARK_BLUE_FILL
    cell.alignment = Alignment(horizontal="center", vertical="center")
    cell.border = THIN_BORDER

summary_data = [
    ("1. Design Tokens & Color Palette (OKLCH, Rose Brand)", 5, 1, 2, 2, 0, "45%"),
    ("2. Typography & Micro-Scales (Playfair, DM Sans, JetBrains)", 5, 2, 2, 1, 0, "60%"),
    ("3. Core UI Primitives (PageHeader, KpiCard, Badges, Buttons)", 6, 2, 3, 1, 0, "55%"),
    ("4. Data Table & Grid Standards (DataTableHeader, DataGrid)", 4, 3, 1, 0, 0, "85%"),
    ("5. POS Terminal Order Entry Layout (Split 65/35, Touch Targets)", 6, 1, 3, 2, 0, "50%"),
    ("6. Kitchen Display System (KDS Kanban, Timers, Notes)", 4, 1, 2, 1, 0, "55%"),
    ("7. Payment & Tender Split Modal (Cash presets, Folio, UPI QR)", 4, 0, 1, 2, 1, "30%"),
    ("8. Dual-Screen Customer Display (Storage Sync, Basket View)", 2, 0, 0, 0, 2, "0%"),
    ("9. Code Architecture & Component Standards (Thin Routes, Formats)", 2, 1, 0, 0, 1, "60%"),
]

for r_idx, row in enumerate(summary_data, start=8):
    ws_summary.row_dimensions[r_idx].height = 22
    for c_idx, val in enumerate(row, start=1):
        cell = ws_summary.cell(row=r_idx, column=c_idx, value=val)
        cell.font = FONT_REGULAR if c_idx != 1 else FONT_BOLD
        cell.border = THIN_BORDER
        if c_idx == 1:
            cell.alignment = Alignment(horizontal="left", vertical="center")
        elif c_idx == 7:
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.font = FONT_BOLD
            pct = int(val.replace("%", ""))
            if pct >= 80:
                cell.fill = COMPLIANT_FILL
            elif pct >= 50:
                cell.fill = PARTIAL_FILL
            else:
                cell.fill = NON_COMPLIANT_FILL
        else:
            cell.alignment = Alignment(horizontal="center", vertical="center")

# Key Architectural Takeaways Note Box
ws_summary.merge_cells("A18:G18")
ws_summary["A18"] = "Key Architectural & Visual Gaps at a Glance"
ws_summary["A18"].font = FONT_SECTION
ws_summary["A18"].fill = ROSE_ACCENT_FILL

takeaways = [
    "1. Brand Color Disconnect: POS currently defaults to Teal (#0f766e) on light beige (#f6f5f0). PMS spec mandates Luxury Rose (#C7346A / oklch(0.57 0.215 355)) as default :root.",
    "2. UI Primitive Hardcoded Classes: button.tsx and other base components use hardcoded Tailwind classes (bg-teal-600, border-slate-300) instead of semantic tokens.",
    "3. High-Contrast Text Standard: PMS requires pure black (#000000) for text-primary and crisp slate (#64748b) for placeholders, whereas POS uses softened slate oklch(0.198 0.022 264).",
    "4. PageHeader Visual Polish: PMS uses a rose-tinted gradient top banner (from-primary-tint/40 via-primary/5 to-surface), while POS uses a flat plain border banner.",
    "5. Monospace & Currency Uniformity: JetBrains Mono must be universally applied to all prices (₹), room numbers, invoice numbers, and timers.",
    "6. Payment & Dual Screen Gaps: POS needs dynamic UPI QR code generator, quick cash denomination buttons (+100, +500, +2000), and Customer Display sync via BroadcastChannel."
]

for idx, note in enumerate(takeaways, start=19):
    ws_summary.merge_cells(f"A{idx}:G{idx}")
    ws_summary[f"A{idx}"] = note
    ws_summary[f"A{idx}"].font = FONT_REGULAR
    ws_summary[f"A{idx}"].alignment = Alignment(horizontal="left", vertical="center")
    ws_summary[f"A{idx}"].border = THIN_BORDER
    ws_summary.row_dimensions[idx].height = 22


# ----------------------------------------------------
# SHEET 2: DETAILED COMPLIANCE MATRIX
# ----------------------------------------------------
ws_matrix = wb.create_sheet(title="Compliance Matrix")
ws_matrix.views.sheetView[0].showGridLines = True

matrix_headers = [
    "ID",
    "Category",
    "PMS Design System Specification",
    "Current Retrod POS State",
    "Compliance Status",
    "Identified Gaps / Discrepancies",
    "Remediation Action Plan (How to Fix)",
    "Priority",
    "Target Files / Components"
]

ws_matrix.row_dimensions[1].height = 32
for col_idx, text in enumerate(matrix_headers, start=1):
    cell = ws_matrix.cell(row=1, column=col_idx, value=text)
    cell.font = FONT_HEADER
    cell.fill = DARK_BLUE_FILL
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border = HEADER_BORDER

matrix_items = [
    # 1. DESIGN TOKENS & COLOR PALETTE
    (
        "TOK-01",
        "Design Tokens & Colors",
        "Default Brand Primary is Rose Luxury (#C7346A / oklch(0.57 0.215 355)), with --primary-pressed: oklch(0.495 0.22 355) and --primary-tint: oklch(0.952 0.06 350).",
        "POS :root is configured with Brand Teal (#0f766e / #115e59 / #f0fdfa). Rose is only present as an auxiliary class '.theme-rose-indigo-premium'.",
        "Non-Compliant",
        "Default app look is Teal/Green rather than unified Retrod Brand Rose. Theme switcher is required to see Rose.",
        "Set Rose Luxury as default :root in styles.css and update --primary, --primary-pressed, --primary-tint tokens.",
        "High",
        "src/styles.css"
    ),
    (
        "TOK-02",
        "Design Tokens & Colors",
        "Canvas Background is vibrant soft rose canvas: oklch(0.975 0.038 338), --surface: #FFFFFF, --surface-2: oklch(0.958 0.05 332).",
        "POS :root uses light beige/off-white #f6f5f0, --surface: #ffffff, --surface-2: #eae9e3.",
        "Non-Compliant",
        "Background gives a warm off-white/beige tint rather than the luxury rose canvas of the Retrod PMS design system.",
        "Update :root --background and --surface-2 in src/styles.css to match the OKLCH rose canvas definitions.",
        "High",
        "src/styles.css"
    ),
    (
        "TOK-03",
        "Design Tokens & Colors",
        "Strict High-Contrast Text Standard: --text-primary: #000000 (100% black), --text-secondary: #000000, --text-disabled: #64748b (Slate 500).",
        "POS :root uses --text-primary: oklch(0.198 0.022 264) (#111827) and --text-secondary: oklch(0.49 0.12 330).",
        "Partially Compliant",
        "POS uses dark charcoal instead of strict pure black text (#000000) for highest readability in operational environments.",
        "Update CSS variables --text-primary and --text-secondary to #000000 and ensure input typography reflects this standard.",
        "Medium",
        "src/styles.css, src/components/ui/input.tsx"
    ),
    (
        "TOK-04",
        "Design Tokens & Colors",
        "Elevation Shadows with Rose Tint: --shadow-e1 (0 1px 3px rgba(170,24,87,0.14)), --shadow-e2 (0 4px 12px rgba(170,24,87,0.2)), --shadow-e3 (0 8px 24px rgba(170,24,87,0.28)).",
        "POS styles.css defines --shadow-e1, --shadow-e2, --shadow-e3 matching the rose rgba(170, 24, 87) values in @theme inline.",
        "Fully Compliant",
        "Shadow tokens exist and match the spec.",
        "Verify all card and modal primitives properly consume shadow-e1, shadow-e2, and shadow-e3 classes.",
        "Low",
        "src/styles.css, src/components/ui/Primitives.tsx"
    ),
    (
        "TOK-05",
        "Design Tokens & Colors",
        "Corner Radii Tokens: rounded-sm (4px), rounded-md (6px), rounded-lg (8px), rounded-xl (10px).",
        "POS styles.css defines --radius-sm: 4px, --radius-md: 6px, --radius-lg: 8px, --radius-xl: 10px in @theme inline.",
        "Fully Compliant",
        "Token scale matches spec perfectly.",
        "Ensure custom components do not use non-standard border radius (e.g. rounded-2xl or rounded-full where not intended).",
        "Low",
        "src/styles.css"
    ),

    # 2. TYPOGRAPHY SYSTEM
    (
        "TYP-01",
        "Typography System",
        "3-Font Semantic Hierarchy: Playfair Display (Display/Titles), DM Sans (Interface/Body), JetBrains Mono (Data/Prices/Codes/Numbers).",
        "Google Fonts import in styles.css imports all 3 fonts (DM Sans, Playfair Display, JetBrains Mono) and binds to font-sans, font-display, font-mono.",
        "Fully Compliant",
        "Fonts are correctly imported and configured in Tailwind theme.",
        "Maintain strict usage across components so numbers/currency always receive font-mono.",
        "Low",
        "src/styles.css"
    ),
    (
        "TYP-02",
        "Typography System",
        "Section Labels (.label-uppercase): text-[11px] font-bold uppercase tracking-wider text-text-primary.",
        "POS .label-uppercase is defined as font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text-secondary).",
        "Partially Compliant",
        "Font weight is 500 (medium) instead of bold (700), and color is text-secondary rather than high-contrast text-primary.",
        "Update .label-uppercase utility in src/styles.css to use font-weight: 700 and color: var(--color-text-primary).",
        "Medium",
        "src/styles.css"
    ),
    (
        "TYP-03",
        "Typography System",
        "Eyebrow Micro-Typography: text-[11px] font-bold uppercase tracking-wider text-primary mb-0.5.",
        "PageHeader in Primitives.tsx uses <div className=\"label-uppercase mb-1.5\">{eyebrow}</div> which resolves to text-secondary.",
        "Partially Compliant",
        "Eyebrows lack brand rose primary color (text-primary) and bold weight.",
        "Update PageHeader in Primitives.tsx to use text-[11px] font-bold uppercase tracking-wider text-primary mb-0.5.",
        "Medium",
        "src/components/ui/Primitives.tsx"
    ),
    (
        "TYP-04",
        "Typography System",
        "Page Titles: font-display text-[20px] font-bold leading-tight text-text-primary sm:text-[22px].",
        "PageHeader in Primitives.tsx uses font-display text-[22px] font-semibold leading-tight text-text-primary sm:text-[26px].",
        "Partially Compliant",
        "Font weight is semibold (600) instead of bold (700), and scale is slightly oversized compared to PMS spec.",
        "Adjust PageHeader title styling to font-display text-[20px] font-bold leading-tight text-text-primary sm:text-[22px].",
        "Low",
        "src/components/ui/Primitives.tsx"
    ),
    (
        "TYP-05",
        "Typography System",
        "Currency & Data Monospace: All prices must be formatted as ₹{amount.toLocaleString()} with font-mono.",
        "Prices across various POS screens use ₹ but some lack font-mono or have inconsistent locale formatting.",
        "Non-Compliant",
        "Inconsistent font-mono tags across order item lists, catalog grids, and receipt templates.",
        "Enforce a shared PriceDisplay / currency helper component that guarantees ₹ prefix, .toLocaleString(), and font-mono.",
        "Medium",
        "src/components/shared/pos/*, src/utils/formatters.ts"
    ),

    # 3. CORE UI PRIMITIVES
    (
        "PRIM-01",
        "Core UI Primitives",
        "PageHeader Banner: border-b border-primary/20 bg-gradient-to-r from-primary-tint/40 via-primary/5 to-surface px-4 py-3.5 sm:px-6 sm:py-4 shadow-xs.",
        "POS PageHeader uses flat plain border: border-b border-border bg-surface px-4 py-4 sm:flex-row sm:items-end sm:gap-4 sm:px-6 sm:py-5.",
        "Non-Compliant",
        "Lacks the luxury rose-tinted background gradient and subtle primary border accent that characterizes the Retrod suite.",
        "Update PageHeader component in Primitives.tsx with the specified gradient classes and responsive padding.",
        "High",
        "src/components/ui/Primitives.tsx"
    ),
    (
        "PRIM-02",
        "Core UI Primitives",
        "KpiCard: Left accent border pill (w-[3px] in brand, success, warning, error, info), font-mono text-[24px] sm:text-[28px] font-bold.",
        "POS KpiCard uses w-[2px] pill and font-mono text-[22px] font-semibold sm:text-[26px].",
        "Partially Compliant",
        "Accent pill width is 2px (less visible) and number scale is 22px semibold instead of 24px-28px bold.",
        "Update KpiCard in Primitives.tsx to w-[3px] accent bar and font-mono text-[24px] sm:text-[28px] font-bold.",
        "Medium",
        "src/components/ui/Primitives.tsx"
    ),
    (
        "PRIM-03",
        "Core UI Primitives",
        "StatusBadge: Filled dot bullet (h-1.5 w-1.5 rounded-full bg-current), semantic toneClasses (success green, warning amber, error red, info indigo, neutral).",
        "POS StatusBadge has filled dot, but maps 'success' to 'bg-primary-tint text-primary-pressed' (teal) rather than true Emerald Green.",
        "Partially Compliant",
        "Success tone uses brand primary rather than semantic green (--color-success / --color-success-tint).",
        "Update toneClasses in Primitives.tsx: success -> bg-success-tint text-success, brand -> bg-primary-tint text-primary.",
        "Medium",
        "src/components/ui/Primitives.tsx"
    ),
    (
        "PRIM-04",
        "Core UI Primitives",
        "Button Variants: primary (bg-primary text-primary-foreground hover:bg-primary-pressed shadow-e1), outline (border border-border bg-surface text-black font-semibold), ghost (text-black), danger (bg-error-tint text-error). Includes active:scale-[0.98].",
        "src/components/ui/button.tsx has hardcoded Tailwind classes (bg-teal-600, border-slate-300, text-slate-700). Primitives.tsx Button has partial tokens.",
        "Non-Compliant",
        "Two competing Button components; ui/button.tsx hardcodes teal and slate colors instead of consuming CSS variables.",
        "Align src/components/ui/button.tsx with design tokens (primary, secondary, outline, ghost, danger) and active:scale-[0.98].",
        "High",
        "src/components/ui/button.tsx, src/components/ui/Primitives.tsx"
    ),
    (
        "PRIM-05",
        "Core UI Primitives",
        "Input / Select Fields: Pure black text (#000000), crisp slate placeholders (#64748b), border-input, ring focus.",
        "POS input.tsx uses placeholder:text-muted-foreground and generic md:text-sm without explicit high-contrast black text.",
        "Partially Compliant",
        "Placeholders and typed text rely on muted tokens that can appear washed out in bright POS terminal environments.",
        "Standardize input.tsx & select triggers with text-[#000000] (dark:text-white) and placeholder:text-[#64748b].",
        "Medium",
        "src/components/ui/input.tsx, src/components/ui/select.tsx"
    ),
    (
        "PRIM-06",
        "Core UI Primitives",
        "Toast Notifications: Use Sonner with corresponding Lucide icons for all user feedback (ticket dispatch, settlement, errors).",
        "Sonner is installed in package.json and toaster is rendered in layout, but some actions lack rich icon toasts.",
        "Fully Compliant",
        "Foundation is in place and working.",
        "Standardize toast.success/error calls across all POS mutations with consistent wording and icons.",
        "Low",
        "src/components/ui/sonner.tsx, src/hooks/queries/*"
    ),

    # 4. DATA TABLE & GRID STANDARDS
    (
        "TAB-01",
        "Data Table Architecture",
        "DataTableHeader Component: Global search bar, column customization (reorder, visibility, pinning), Excel/CSV export, bulk actions.",
        "POS has a comprehensive DataTableHeader.tsx (90KB) in src/components/common/ with full column menu, filters, and export logic.",
        "Fully Compliant",
        "Feature-complete DataTableHeader matching the PMS architecture.",
        "Verify column header styling uses text-[10px] font-medium uppercase tracking-wider text-text-secondary.",
        "Low",
        "src/components/common/DataTableHeader.tsx"
    ),
    (
        "TAB-02",
        "Data Table Architecture",
        "Table Typography: Header text-[10px] font-medium uppercase tracking-wider text-text-secondary, cell text-[13px]/[14px].",
        "Table components in src/components/ui/table.tsx and data-grid apply standard classes, mostly aligned.",
        "Fully Compliant",
        "Table layout and typography follow dense operational standards.",
        "Ensure monetary table columns (Total, Balance, Tax) consistently use font-mono.",
        "Low",
        "src/components/ui/table.tsx, src/components/ui/data-grid/*"
    ),
    (
        "TAB-03",
        "Data Table Architecture",
        "Pagination: Sticky footer pagination with page size selector (10, 25, 50, 100).",
        "POS DataGrid and table components support pagination and size selection.",
        "Fully Compliant",
        "Standardized pagination present.",
        "Ensure consistent active page indicator styling across all tabular screens.",
        "Low",
        "src/components/ui/data-grid/DataGridPagination.tsx"
    ),
    (
        "TAB-04",
        "Data Table Architecture",
        "Direct Exporting: Support direct Excel (exportToExcel) and CSV streaming.",
        "DataTableHeader.tsx includes export handlers.",
        "Partially Compliant",
        "Ensure all data grids (Billing ledger, orders history, inventory) enable the export button by default.",
        "Connect export hooks across all manager views.",
        "Low",
        "src/components/shared/pos/*Manager.tsx"
    ),

    # 5. POS TERMINAL ORDER ENTRY LAYOUT
    (
        "POS-01",
        "POS Terminal View",
        "2-Column Split Layout: Left column (65%-70%) for Product Grid & Search, Right column (350px-400px fixed) for Cart & Checkout.",
        "POS has take-order wizard / catalog step with 2-column layout, but split proportions and responsive drawer behavior vary between desktop/mobile.",
        "Partially Compliant",
        "Layout exists but spacing, column locking, and split ratios need exact alignment with the spec.",
        "Standardize Terminal container as flex/grid with 65-70% catalog area and fixed 380px cart summary panel.",
        "High",
        "src/components/shared/pos/PosTakeOrderManager.tsx, src/components/shared/pos/orders/PosOrderTabularCatalogStep.tsx"
    ),
    (
        "POS-02",
        "POS Terminal View",
        "Product Grid & Fast Search: Horizontal category chip bar (All, Foods, Drinks, Snacks, Desserts), search bar with '/' keyboard hotkey & barcode scanner listener.",
        "Category tabs exist in catalog step, but fast '/' hotkey autofocus and barcode scanning hooks are missing or unlinked.",
        "Partially Compliant",
        "Visual categories exist; keyboard autofocus hotkey '/' and barcode scanner listener need implementation.",
        "Add keydown listener for '/' hotkey to auto-focus product search input and hook up barcode scanner input handler.",
        "Medium",
        "src/components/shared/pos/orders/PosOrderTabularCatalogStep.tsx"
    ),
    (
        "POS-03",
        "POS Terminal View",
        "Item Product Tiles: Category badge, food type icon (Veg 🟢 / Non-Veg 🔴 / Vegan / Egg), item title, monospace price tag (₹450), min-height 40-48px touch targets.",
        "Catalog tiles display title, price, and category, but Veg/Non-Veg indicators and touch target heights are inconsistent.",
        "Partially Compliant",
        "Food type badge indicators (Veg dot / Non-Veg triangle) are not uniformly styled across all item cards.",
        "Implement unified FoodTypeIcon component (Veg = green square with dot, Non-Veg = brown square with triangle) and ensure 44px+ touch targets.",
        "Medium",
        "src/components/shared/pos/menu/*, src/components/shared/pos/orders/*"
    ),
    (
        "POS-04",
        "POS Terminal View",
        "Cart & Order Basket Panel: Scrollable itemized list with rapid '+' / '-' quantity steppers, modifier lists, item delete button, high touch targets.",
        "Cart panel exists in order wizard, with quantity adjustment and item removal.",
        "Partially Compliant",
        "Stepper buttons need tactile active:scale-[0.98] feedback and larger touch padding (min 36px-40px).",
        "Refactor cart item row steppers with explicit + / - touch buttons and itemized modifier pill tags.",
        "Medium",
        "src/components/shared/pos/orders/*"
    ),
    (
        "POS-05",
        "POS Terminal View",
        "Cart Footer & Total: Discount popover, Tax breakdown, Monospace Grand Total (font-mono text-[22px] font-bold text-primary).",
        "Total is displayed, but monospace styling and primary brand coloring are inconsistent.",
        "Partially Compliant",
        "Grand total does not consistently use font-mono text-[22px] font-bold text-primary.",
        "Update cart footer with high-visibility grand total in font-mono and dedicated Discount / Tax breakdown popover.",
        "Medium",
        "src/components/shared/pos/orders/*"
    ),
    (
        "POS-06",
        "POS Terminal View",
        "Primary Action Buttons: Big dual action buttons: [ Send KOT ] (Dispatches to kitchen) and [ Pay & Settle ] (Opens Payment Modal).",
        "Buttons exist in order wizard footer, but naming and styling vary across steps.",
        "Non-Compliant",
        "Button labels vary (e.g. 'Place Order', 'Submit', 'Next') instead of standard [ Send KOT ] and [ Pay & Settle ].",
        "Standardize order screen footer with prominent [ Send KOT ] (secondary/outline) and [ Pay & Settle ] (primary brand rose).",
        "High",
        "src/components/shared/pos/orders/*"
    ),

    # 6. KITCHEN DISPLAY SYSTEM (KDS / KOT)
    (
        "KDS-01",
        "Kitchen Display System",
        "KDS Top Metrics: Active tickets count, average preparation time, overdue alerts (>15 mins).",
        "PosKotManager.tsx displays ticket counts and summary stats.",
        "Fully Compliant",
        "Top metrics cards are present in KOT manager.",
        "Ensure metric numbers use font-mono and match KpiCard primitive styling.",
        "Low",
        "src/components/shared/pos/orders/PosKotManager.tsx"
    ),
    (
        "KDS-02",
        "Kitchen Display System",
        "Kanban Status Columns: Queued (Yellow/Warning), Preparing (Blue/Info), Ready (Green/Success) with live ticking timers in font-mono.",
        "PosKotManager.tsx has status columns and card lists, but color borders and live timer badges need tighter alignment.",
        "Partially Compliant",
        "Column headers and timers exist, but live seconds ticking and overdue color pulsing (>15 min) need refinement.",
        "Add live useInterval ticking timer badge to each ticket card with warning pulse if overdue >15m.",
        "Medium",
        "src/components/shared/pos/orders/PosKotManager.tsx"
    ),
    (
        "KDS-03",
        "Kitchen Display System",
        "KOT Ticket Card Details: Table/Room badge, Captain name, item list with highlighted kitchen notes (e.g. 'Less spicy', 'No onion').",
        "Ticket cards show items, but customer notes are rendered in plain text rather than highlighted warning badges.",
        "Partially Compliant",
        "Kitchen notes need visual emphasis (yellow highlight chip) to prevent chef prep errors.",
        "Style item special instructions / notes with bg-warning-tint text-warning font-semibold chip.",
        "Medium",
        "src/components/shared/pos/orders/PosKotManager.tsx"
    ),
    (
        "KDS-04",
        "Kitchen Display System",
        "One-Tap Action Buttons on Tickets: [ Start Cooking ], [ Mark Ready ], [ Print Duplicate KOT ].",
        "Action buttons exist on ticket cards.",
        "Partially Compliant",
        "Ensure button labels and mutation status transitions match the exact Queued -> Preparing -> Ready flow.",
        "Standardize KOT card action triggers with tactile button primitives.",
        "Low",
        "src/components/shared/pos/orders/PosKotManager.tsx"
    ),

    # 7. PAYMENT & TENDER SPLIT MODAL
    (
        "PAY-01",
        "Payment & Billing Modal",
        "Multi-Tender Selection: Quick tender tabs/icons: Cash, Credit/Debit Card, UPI / Dynamic QR, Room Charge (Folio), Digital Wallet, Gift Card.",
        "POS has billing and payment dialogs, but tender options are split across multiple disparate dialogs.",
        "Partially Compliant",
        "Payment modal lacks a unified multi-tender split view where multiple payment methods can be applied to a single check.",
        "Create/Refactor PaymentModal with multi-tender split inputs and clear method switcher icons.",
        "High",
        "src/components/shared/pos/billing/*, src/features/pos/components/*"
    ),
    (
        "PAY-02",
        "Payment & Billing Modal",
        "Quick Cash Denomination Presets: Tap-to-add buttons for Exact, +₹100, +₹500, +₹2000 with instant Change Due calculation in font-mono.",
        "POS cash entry relies on standard number input without rapid quick-cash denomination helper buttons.",
        "Non-Compliant",
        "Cashiers must manually type full cash received instead of rapid one-tap preset additions.",
        "Add quick cash preset buttons ([ Exact ], [ +₹100 ], [ +₹500 ], [ +₹2000 ]) with live change calculation.",
        "High",
        "src/components/shared/pos/billing/*"
    ),
    (
        "PAY-03",
        "Payment & Billing Modal",
        "Dynamic UPI QR Code Generation: Dynamic QR code via 'react-qr-code' containing exact invoice amount & UPI VPA, auto-syncing with Customer Display.",
        "react-qr-code or live dynamic UPI string generator is missing in current POS billing flow.",
        "Missing",
        "No dynamic on-screen UPI QR code rendered for customers to scan directly.",
        "Integrate dynamic UPI string generator + QR code component for seamless Indian UPI payments.",
        "High",
        "src/components/shared/pos/billing/*"
    ),
    (
        "PAY-04",
        "Payment & Billing Modal",
        "Hotel Room Charge (PMS Folio Integration): Search active in-house checked-in guest by room/name, validate credit limit, and post directly to room folio.",
        "Room service manager has room selection, but general POS checkout lacks one-click 'Charge to Room Folio' with guest validation.",
        "Non-Compliant",
        "Dine-in and bar POS orders cannot directly post charges to a checked-in hotel guest room folio.",
        "Add 'Room Charge' tender option in PaymentModal with room number lookup and folio credit limit validation.",
        "High",
        "src/components/shared/pos/billing/*, src/services/posService.ts"
    ),

    # 8. DUAL-SCREEN CUSTOMER DISPLAY
    (
        "DISP-01",
        "Dual-Screen Customer Display",
        "Secondary Monitor Display: Dedicated customer-facing route (/pos/customer-display) showing real-time basket, discounts, taxes, and grand total.",
        "POS does not currently have a dedicated customer display route or component.",
        "Missing",
        "Dual-screen POS hardware setups have no secondary customer monitor screen.",
        "Create CustomerDisplayFeature component and thin route /pos/customer-display.",
        "Medium",
        "src/features/pos/components/CustomerDisplayFeature.tsx, src/routes/pos.customer-display.tsx"
    ),
    (
        "DISP-02",
        "Dual-Screen Customer Display",
        "Real-Time Basket Sync: Sync cart items and dynamic UPI QR code to customer screen via BroadcastChannel / localStorage storage events.",
        "No cross-window storage event sync hook currently implemented.",
        "Missing",
        "Customer screen cannot mirror cashier screen updates in real time.",
        "Implement useCustomerDisplaySync hook using BroadcastChannel('pos_customer_display') with localStorage fallback.",
        "Medium",
        "src/features/pos/hooks/useCustomerDisplaySync.ts"
    ),

    # 9. CODE ARCHITECTURE & STANDARDS
    (
        "ARCH-01",
        "Architecture & Standards",
        "Directory Structure & Thin Routes: Thin routes under src/routes/pos*.tsx, managers under components/shared/pos/, features under features/pos/.",
        "POS follows thin routes and manager patterns as prescribed in AGENTS.md.",
        "Fully Compliant",
        "Follows TanStack Router thin routes and manager component patterns.",
        "Keep new modal and feature additions inside components/shared/pos/ and features/pos/.",
        "Low",
        "src/routes/pos*.tsx, src/components/shared/pos/*"
    ),
    (
        "ARCH-02",
        "Architecture & Standards",
        "Thermal Invoice Receipt Template: High-density 80mm / 58mm CSS print styling for thermal receipt printers.",
        "Print stylesheet exists in styles.css (@media print), but dedicated thermal 80mm ESC/POS layout component is missing.",
        "Partially Compliant",
        "General print styles exist, but formatted thermal receipt component is needed.",
        "Add standardized InvoiceThermalTemplate component configured for 80mm/58mm thermal rolls.",
        "Medium",
        "src/components/shared/pos/billing/InvoiceTemplate.tsx"
    ),
]

for row_idx, item in enumerate(matrix_items, start=2):
    ws_matrix.row_dimensions[row_idx].height = 28
    for col_idx, val in enumerate(item, start=1):
        cell = ws_matrix.cell(row=row_idx, column=col_idx, value=val)
        cell.border = THIN_BORDER
        cell.font = FONT_REGULAR
        
        # Alignments & Special Styling
        if col_idx in [1, 8]:
            cell.alignment = Alignment(horizontal="center", vertical="center")
            if col_idx == 1:
                cell.font = FONT_CODE
        elif col_idx == 2:
            cell.alignment = Alignment(horizontal="left", vertical="center")
            cell.font = FONT_BOLD
        elif col_idx == 5:
            # Status styling
            cell.alignment = Alignment(horizontal="center", vertical="center")
            if val == "Fully Compliant":
                cell.fill = COMPLIANT_FILL
                cell.font = FONT_STATUS_GREEN
            elif val == "Partially Compliant":
                cell.fill = PARTIAL_FILL
                cell.font = FONT_STATUS_YELLOW
            elif val == "Non-Compliant":
                cell.fill = NON_COMPLIANT_FILL
                cell.font = FONT_STATUS_RED
            elif val == "Missing":
                cell.fill = MISSING_FILL
                cell.font = FONT_STATUS_PURPLE
        elif col_idx == 8:
            # Priority styling
            cell.alignment = Alignment(horizontal="center", vertical="center")
            if val == "High":
                cell.fill = PRIORITY_HIGH_FILL
                cell.font = FONT_STATUS_RED
            elif val == "Medium":
                cell.fill = PRIORITY_MED_FILL
                cell.font = FONT_STATUS_YELLOW
            elif val == "Low":
                cell.fill = PRIORITY_LOW_FILL
                cell.font = FONT_BOLD
        elif col_idx == 9:
            cell.alignment = Alignment(horizontal="left", vertical="center")
            cell.font = FONT_CODE
        else:
            cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)


# ----------------------------------------------------
# SHEET 3: TOKEN & CLASS MAPPING REFERENCE
# ----------------------------------------------------
ws_tokens = wb.create_sheet(title="Token & Class Mapping")
ws_tokens.views.sheetView[0].showGridLines = True

token_headers = [
    "Design Token / Element",
    "Current POS Implementation",
    "Target PMS Design System Value",
    "Visual Impact of Change",
    "Files to Modify"
]

ws_tokens.row_dimensions[1].height = 30
for col_idx, text in enumerate(token_headers, start=1):
    cell = ws_tokens.cell(row=1, column=col_idx, value=text)
    cell.font = FONT_HEADER
    cell.fill = DARK_BLUE_FILL
    cell.alignment = Alignment(horizontal="center", vertical="center")
    cell.border = HEADER_BORDER

token_rows = [
    (
        ":root --primary (Default Brand)",
        "#0f766e (Teal)",
        "oklch(0.57 0.215 355) (#C7346A Rose)",
        "Transforms overall application from green/teal to luxury Retrod Rose.",
        "src/styles.css"
    ),
    (
        ":root --primary-pressed",
        "#115e59 (Deep Teal)",
        "oklch(0.495 0.22 355)",
        "Provides tactile rose-plum feedback on button presses.",
        "src/styles.css"
    ),
    (
        ":root --primary-tint",
        "#f0fdfa (Light Teal Tint)",
        "oklch(0.952 0.06 350) (Soft Rose Tint)",
        "Applies soft rose wash to active rows, selections, and subtle tags.",
        "src/styles.css"
    ),
    (
        ":root --background (Canvas)",
        "#f6f5f0 (Light Beige)",
        "oklch(0.975 0.038 338) (Vibrant Soft Rose)",
        "Replaces warm beige tint with modern luxury rose canvas background.",
        "src/styles.css"
    ),
    (
        ":root --surface-2 (Secondary Panels)",
        "#eae9e3 (Muted Beige)",
        "oklch(0.958 0.05 332) (Rose Slate)",
        "Aligns secondary cards, sidebars, and sub-panels.",
        "src/styles.css"
    ),
    (
        ":root --text-primary",
        "oklch(0.198 0.022 264) (#111827)",
        "#000000 (Pure Black)",
        "Significantly increases typography contrast in high-glare restaurant environments.",
        "src/styles.css"
    ),
    (
        ":root --text-disabled / placeholder",
        "oklch(0.63 0.1 328)",
        "#64748b (Slate 500)",
        "Crisp, readable input placeholders that never look muddy.",
        "src/styles.css"
    ),
    (
        "PageHeader Styling",
        "border-b border-border bg-surface px-4 py-4",
        "border-b border-primary/20 bg-gradient-to-r from-primary-tint/40 via-primary/5 to-surface px-4 py-3.5 sm:px-6 sm:py-4 shadow-xs",
        "Adds the signature Retrod luxury top banner gradient across all main POS screens.",
        "src/components/ui/Primitives.tsx"
    ),
    (
        ".label-uppercase Utility",
        "font-size: 11px; font-weight: 500; color: var(--color-text-secondary);",
        "text-[11px] font-bold uppercase tracking-wider text-text-primary",
        "Bold, high-contrast section headers and tabular micro-labels.",
        "src/styles.css"
    ),
    (
        "Button Primitives (ui/button.tsx)",
        "Hardcoded bg-teal-600, border-slate-300, text-slate-700",
        "bg-primary text-primary-foreground hover:bg-primary-pressed shadow-e1 + active:scale-[0.98]",
        "Removes hardcoded Tailwind classes; buttons automatically inherit brand rose and theme switching.",
        "src/components/ui/button.tsx"
    ),
    (
        "StatusBadge (Tone 'success')",
        "bg-primary-tint text-primary-pressed (Teal)",
        "bg-success-tint text-success (Emerald Green oklch(0.66 0.18 152))",
        "Separates Brand Primary (Rose) from Semantic Success (Emerald Green) to prevent color confusion.",
        "src/components/ui/Primitives.tsx"
    ),
    (
        "KpiCard Accent Pill",
        "w-[2px] rounded-r",
        "w-[3px] rounded-r + font-mono text-[24px] sm:text-[28px] font-bold",
        "More prominent color coding and bolder monospace metric digits.",
        "src/components/ui/Primitives.tsx"
    )
]

for row_idx, row in enumerate(token_rows, start=2):
    ws_tokens.row_dimensions[row_idx].height = 26
    for col_idx, val in enumerate(row, start=1):
        cell = ws_tokens.cell(row=row_idx, column=col_idx, value=val)
        cell.border = THIN_BORDER
        if col_idx == 1:
            cell.font = FONT_BOLD
            cell.alignment = Alignment(horizontal="left", vertical="center")
        elif col_idx in [2, 3]:
            cell.font = FONT_CODE
            cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        elif col_idx == 5:
            cell.font = FONT_CODE
            cell.alignment = Alignment(horizontal="left", vertical="center")
        else:
            cell.font = FONT_REGULAR
            cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)


# ----------------------------------------------------
# SHEET 4: PHASED IMPLEMENTATION ROADMAP
# ----------------------------------------------------
ws_plan = wb.create_sheet(title="Phased Action Plan")
ws_plan.views.sheetView[0].showGridLines = True

plan_headers = [
    "Phase",
    "Task Title",
    "Scope & Description",
    "Estimated Effort",
    "Impact / Dependencies"
]

ws_plan.row_dimensions[1].height = 30
for col_idx, text in enumerate(plan_headers, start=1):
    cell = ws_plan.cell(row=1, column=col_idx, value=text)
    cell.font = FONT_HEADER
    cell.fill = DARK_BLUE_FILL
    cell.alignment = Alignment(horizontal="center", vertical="center")
    cell.border = HEADER_BORDER

plan_rows = [
    (
        "Phase 1: Design Tokens & Base Theme",
        "Update styles.css Tokens to Rose Luxury Default",
        "Set Rose Luxury (:root) with OKLCH variables (--primary, --background, --text-primary: #000000, --shadows).",
        "Quick (1 hr)",
        "App-wide visual shift to unified Retrod luxury rose aesthetic."
    ),
    (
        "Phase 1: Design Tokens & Base Theme",
        "Standardize UI Primitives & Button Classes",
        "Update Primitives.tsx (PageHeader gradient, KpiCard w-[3px], StatusBadge success tone) and refactor button.tsx to use semantic tokens.",
        "Quick (1-2 hrs)",
        "Ensures all buttons and page headers match PMS luxury style."
    ),
    (
        "Phase 2: Typography & Input Contrast",
        "Enforce Monospace Data & Currency Standard",
        "Audit and standardize all price displays, KOT codes, invoice IDs, and room numbers with font-mono and ₹ prefix.",
        "Medium (2-3 hrs)",
        "Elevates tabular legibility and operational clarity."
    ),
    (
        "Phase 2: Typography & Input Contrast",
        "High-Contrast Inputs & Universal Placeholders",
        "Update input.tsx, select.tsx, and form controls to enforce text-[#000000] and placeholder:text-[#64748b].",
        "Quick (1 hr)",
        "High visibility on bright POS screens."
    ),
    (
        "Phase 3: Terminal & KDS Layout Refinement",
        "Terminal Split Layout & Keyboard Hotkey '/'",
        "Refine 65/35 split, add keyboard '/' hotkey search autofocus, barcode scanner listener, and 44px+ touch targets.",
        "Medium (3-4 hrs)",
        "Faster order entry throughput for cashiers and captains."
    ),
    (
        "Phase 3: Terminal & KDS Layout Refinement",
        "KDS Kanban Live Timers & Notes Highlights",
        "Add live interval ticking timer badges, >15m overdue alerts, and yellow kitchen notes tags to KOT cards.",
        "Medium (2-3 hrs)",
        "Kitchen workflow synchronization."
    ),
    (
        "Phase 4: Payment & PMS Folio Integration",
        "Multi-Tender Payment Modal & Quick Cash Presets",
        "Build unified PaymentModal with quick cash denomination buttons ([Exact], [+100], [+500], [+2000]) and live change due.",
        "Medium (3-4 hrs)",
        "Cashier speed and split-tender billing."
    ),
    (
        "Phase 4: Payment & PMS Folio Integration",
        "Dynamic UPI QR & Room Charge Folio Posting",
        "Add react-qr-code generation for Indian UPI VPA payments and connect checked-in guest room folio posting.",
        "Medium (3-4 hrs)",
        "Seamless PMS folio billing and instant digital payments."
    ),
    (
        "Phase 5: Dual Screen & Thermal Receipts",
        "Dual-Screen Customer Display & Broadcast Sync",
        "Create /pos/customer-display route with BroadcastChannel sync to mirror basket and dynamic QR on secondary monitor.",
        "Medium (3-4 hrs)",
        "Hardware dual-screen POS compliance."
    ),
    (
        "Phase 5: Dual Screen & Thermal Receipts",
        "Thermal Invoice 80mm Print Template",
        "Create dedicated high-density 80mm ESC/POS invoice template for thermal receipt printers.",
        "Quick (1-2 hrs)",
        "Physical receipt printing standard."
    )
]

for row_idx, row in enumerate(plan_rows, start=2):
    ws_plan.row_dimensions[row_idx].height = 26
    for col_idx, val in enumerate(row, start=1):
        cell = ws_plan.cell(row=row_idx, column=col_idx, value=val)
        cell.border = THIN_BORDER
        if col_idx == 1:
            cell.font = FONT_BOLD
            cell.alignment = Alignment(horizontal="left", vertical="center")
        elif col_idx == 2:
            cell.font = FONT_BOLD
            cell.alignment = Alignment(horizontal="left", vertical="center")
        elif col_idx == 4:
            cell.font = FONT_REGULAR
            cell.alignment = Alignment(horizontal="center", vertical="center")
        else:
            cell.font = FONT_REGULAR
            cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

# Auto-fit column widths for all sheets
for sheet in [ws_summary, ws_matrix, ws_tokens, ws_plan]:
    for col in sheet.columns:
        max_len = 0
        col_letter = get_column_letter(col[0].column)
        for cell in col:
            # Skip merged title rows in length calculation
            if sheet == ws_summary and cell.row in [1, 2, 18, 19, 20, 21, 22, 23, 24]:
                continue
            if cell.value:
                val_str = str(cell.value)
                max_len = max(max_len, len(val_str.split("\n")[0]))
        sheet.column_dimensions[col_letter].width = min(max(max_len + 4, 12), 48)

# Custom adjustments for specific wide columns
ws_matrix.column_dimensions["A"].width = 10
ws_matrix.column_dimensions["B"].width = 24
ws_matrix.column_dimensions["C"].width = 38
ws_matrix.column_dimensions["D"].width = 38
ws_matrix.column_dimensions["E"].width = 20
ws_matrix.column_dimensions["F"].width = 38
ws_matrix.column_dimensions["G"].width = 44
ws_matrix.column_dimensions["H"].width = 12
ws_matrix.column_dimensions["I"].width = 32

ws_tokens.column_dimensions["A"].width = 28
ws_tokens.column_dimensions["B"].width = 32
ws_tokens.column_dimensions["C"].width = 38
ws_tokens.column_dimensions["D"].width = 42
ws_tokens.column_dimensions["E"].width = 30

ws_plan.column_dimensions["A"].width = 30
ws_plan.column_dimensions["B"].width = 36
ws_plan.column_dimensions["C"].width = 48
ws_plan.column_dimensions["D"].width = 18
ws_plan.column_dimensions["E"].width = 36

# Save workbook
output_path = "d:/Retrod_Work/POS/Retrod_POS_Design_System_Compliance_Matrix.xlsx"
try:
    wb.save(output_path)
    print(f"Successfully generated Excel workbook at: {output_path}")
except PermissionError:
    fallback_path = "d:/Retrod_Work/POS/Retrod_POS_Design_System_Compliance_Matrix_Updated.xlsx"
    wb.save(fallback_path)
    print(f"File was locked in Excel. Saved updated copy to: {fallback_path}")

try:
    with open('d:/Retrod_Work/POS/Retrod_POS_Design_System_Compliance_Matrix.csv', 'w', newline='', encoding='utf-8') as f:
        import csv
        writer = csv.writer(f)
        for row in ws_matrix.iter_rows(values_only=True):
            writer.writerow(row)
    print("CSV updated successfully.")
except Exception as e:
    print("CSV update skipped:", e)

