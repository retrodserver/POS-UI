import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

os.makedirs('docs/assets', exist_ok=True)

# -------------------------------------------------------------
# 1. Generate Diagram 1: 5-Phase Implementation Pipeline
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(12, 4.5), dpi=300)
ax.set_xlim(0, 15)
ax.set_ylim(0, 5.5)
ax.axis('off')

phases = [
    {
        "num": "PHASE 1",
        "title": "UI/UX & Components\n(CURRENT STAGE)",
        "items": ["• Responsive UI screens", "• Design system & primitives", "• Interactive dialogs & state", "• Realistic mock workflows"],
        "color": "#2563EB", # Blue
        "highlight": True
    },
    {
        "num": "PHASE 2",
        "title": "Client State & Logic",
        "items": ["• Fast cart computations", "• Dynamic tax & discounts", "• KOT timer & kitchen state", "• Split billing calculations"],
        "color": "#0D9488", # Teal
        "highlight": False
    },
    {
        "num": "PHASE 3",
        "title": "API & Service Wiring",
        "items": ["• Backend DTO contracts", "• Centralized httpClient", "• TanStack Query hooks", "• Optimistic mutations"],
        "color": "#7C3AED", # Purple
        "highlight": False
    },
    {
        "num": "PHASE 4",
        "title": "Real-Time & Hardware",
        "items": ["• WebSocket Live KOT/Orders", "• ESC/POS thermal printing", "• Aggregator webhook sync", "• Barcode / Drawer triggers"],
        "color": "#D97706", # Amber
        "highlight": False
    },
    {
        "num": "PHASE 5",
        "title": "Testing & Rollout",
        "items": ["• Granular RBAC hardening", "• Shift Z-Report audits", "• Performance stress tests", "• Production deployment"],
        "color": "#059669", # Emerald
        "highlight": False
    }
]

card_w = 2.6
card_h = 4.6
spacing = 0.4
start_x = 0.3

for i, p in enumerate(phases):
    x = start_x + i * (card_w + spacing)
    y = 0.4
    
    # Outer card
    rect = patches.FancyBboxPatch(
        (x, y), card_w, card_h,
        boxstyle="round,pad=0.08,rounding_size=0.15",
        facecolor="#F8FAFC" if not p["highlight"] else "#EFF6FF",
        edgecolor=p["color"],
        linewidth=2.5 if p["highlight"] else 1.5
    )
    ax.add_patch(rect)
    
    # Header badge
    badge = patches.FancyBboxPatch(
        (x + 0.15, y + card_h - 0.75), card_w - 0.3, 0.6,
        boxstyle="round,pad=0.05,rounding_size=0.1",
        facecolor=p["color"],
        edgecolor="none"
    )
    ax.add_patch(badge)
    
    # Phase number text
    ax.text(x + card_w/2, y + card_h - 0.45, p["num"], 
            color="white", fontsize=9.5, fontweight="bold", ha="center", va="center")
    
    # Title
    ax.text(x + card_w/2, y + card_h - 1.35, p["title"], 
            color="#0F172A", fontsize=9, fontweight="bold", ha="center", va="center")
    
    # Divider line
    ax.plot([x + 0.2, x + card_w - 0.2], [y + card_h - 1.85, y + card_h - 1.85], 
            color=p["color"], alpha=0.4, linewidth=1)
    
    # Bullet points
    item_y = y + card_h - 2.2
    for item in p["items"]:
        ax.text(x + 0.2, item_y, item, color="#334155", fontsize=7.5, ha="left", va="top")
        item_y -= 0.55
        
    # Connecting Arrow
    if i < len(phases) - 1:
        arrow_x = x + card_w + 0.05
        ax.annotate('', xy=(arrow_x + spacing - 0.1, y + card_h/2), xytext=(arrow_x, y + card_h/2),
                    arrowprops=dict(arrowstyle="->", color="#94A3B8", lw=2, mutation_scale=15))

plt.tight_layout()
fig.savefig("docs/assets/diagram_phases.png", dpi=300, bbox_inches="tight")
plt.close(fig)

# -------------------------------------------------------------
# 2. Generate Diagram 2: Retrod POS Modular Ecosystem
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(12, 6.2), dpi=300)
ax.set_xlim(0, 15)
ax.set_ylim(0, 8.5)
ax.axis('off')

# Root header
root_rect = patches.FancyBboxPatch((4.5, 7.2), 6.0, 1.0,
                                   boxstyle="round,pad=0.08,rounding_size=0.15",
                                   facecolor="#0F172A", edgecolor="#38BDF8", linewidth=2)
ax.add_patch(root_rect)
ax.text(7.5, 7.7, "RETROD POS — FULL SYSTEM ARCHITECTURE", 
        color="#F8FAFC", fontsize=11, fontweight="bold", ha="center", va="center")

columns = [
    {
        "title": "1. OPERATIONS & ORDERING",
        "color": "#2563EB",
        "bg": "#EFF6FF",
        "x": 0.5,
        "items": [
            ("Live Dashboard", "/pos", "Live sales, leakage, shift float"),
            ("Live Orders Desk", "/pos/orders", "Active tables & order status"),
            ("All Orders Audit", "/pos/orders/all", "Full search & receipt history"),
            ("Online Orders", "/pos/orders/online", "Swiggy / Zomato order flow"),
            ("Kitchen Display (KOT)", "/pos/kot", "Live kitchen tickets & timers"),
            ("Due Settlement", "/pos/settlement", "Split bill & corporate ledger")
        ]
    },
    {
        "title": "2. CATALOG & INVENTORY",
        "color": "#0D9488",
        "bg": "#F0FDFA",
        "x": 5.4,
        "items": [
            ("Fast POS Billing", "/pos/billing", "Sub-10s touch checkout grid"),
            ("Menu Management", "/pos/menu", "Categories, variants, 86'ing"),
            ("Stock & Inventory", "/pos/inventory", "Raw materials & low alerts"),
            ("Recipe / BOM", "/pos/inventory", "Automatic stock deduction"),
            ("Purchase Orders & GRN", "/pos/inventory", "Vendor POs & invoice intake"),
            ("Wastage Logs", "/pos/inventory", "Spoilage & loss audit trail")
        ]
    },
    {
        "title": "3. ANALYTICS & ADMIN",
        "color": "#7C3AED",
        "bg": "#F5F3FF",
        "x": 10.3,
        "items": [
            ("Reports & Analytics", "/pos/reports", "Shift Z-Reports, GST & margins"),
            ("CRM & Khata Ledger", "/pos/crm", "Profiles, loyalty & balance"),
            ("Marketing Automation", "/pos/marketing", "SMS, WhatsApp & campaigns"),
            ("Aggregator Hub", "/pos/aggregators", "Delivery rider & cloud sync"),
            ("Staff & RBAC Settings", "/pos/management", "Roles, permissions & audit"),
            ("Hardware & Printers", "/pos/management", "Thermal ESC/POS & routing")
        ]
    }
]

for col in columns:
    # Column box
    col_rect = patches.FancyBboxPatch((col["x"], 0.4), 4.2, 6.3,
                                      boxstyle="round,pad=0.08,rounding_size=0.15",
                                      facecolor=col["bg"], edgecolor=col["color"], linewidth=1.8)
    ax.add_patch(col_rect)
    
    # Column Header
    header_rect = patches.FancyBboxPatch((col["x"] + 0.15, 6.0), 3.9, 0.55,
                                         boxstyle="round,pad=0.05,rounding_size=0.1",
                                         facecolor=col["color"], edgecolor="none")
    ax.add_patch(header_rect)
    ax.text(col["x"] + 2.1, 6.27, col["title"], color="white", fontsize=9, fontweight="bold", ha="center", va="center")
    
    # Items
    item_y = 5.25
    for title, route, desc in col["items"]:
        item_box = patches.FancyBboxPatch((col["x"] + 0.2, item_y - 0.15), 3.8, 0.72,
                                          boxstyle="round,pad=0.05,rounding_size=0.08",
                                          facecolor="white", edgecolor="#CBD5E1", linewidth=1)
        ax.add_patch(item_box)
        
        ax.text(col["x"] + 0.35, item_y + 0.38, title, color="#0F172A", fontsize=8, fontweight="bold", ha="left")
        ax.text(col["x"] + 3.85, item_y + 0.38, route, color=col["color"], fontsize=7, fontweight="bold", ha="right")
        ax.text(col["x"] + 0.35, item_y + 0.08, desc, color="#64748B", fontsize=6.8, ha="left")
        
        item_y -= 0.88

# Connect root to columns
ax.plot([7.5, 7.5], [7.2, 6.9], color="#38BDF8", lw=2)
ax.plot([2.6, 12.4], [6.9, 6.9], color="#38BDF8", lw=2)
ax.plot([2.6, 2.6], [6.9, 6.6], color="#38BDF8", lw=2)
ax.plot([7.5, 7.5], [6.9, 6.6], color="#38BDF8", lw=2)
ax.plot([12.4, 12.4], [6.9, 6.6], color="#38BDF8", lw=2)

plt.tight_layout()
fig.savefig("docs/assets/diagram_ecosystem.png", dpi=300, bbox_inches="tight")
plt.close(fig)

# -------------------------------------------------------------
# 3. Generate Diagram 3: Technical Layered Architecture
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(11, 4.5), dpi=300)
ax.set_xlim(0, 14)
ax.set_ylim(0, 5)
ax.axis('off')

layers = [
    {"name": "Thin Route Layer", "desc": "routes/pos.*.tsx\n• Clean URL mappings\n• TanStack router loaders", "color": "#3B82F6", "x": 0.5},
    {"name": "Manager & UI Panels", "desc": "components/shared/pos/*\n• PosOrdersListManager\n• Reusable PosPanel & StatTiles", "color": "#10B981", "x": 3.3},
    {"name": "State & Query Hooks", "desc": "hooks/queries/*\n• TanStack Query caching\n• Optimistic UI mutations", "color": "#8B5CF6", "x": 6.1},
    {"name": "Domain Services", "desc": "services/*Service.ts\n• DTO → UI View Model mapping\n• Standardized API methods", "color": "#F59E0B", "x": 8.9},
    {"name": "HTTP Client & Backend", "desc": "utils/httpClient.ts\n• Centralized Axios instance\n• Auth token injection & retry", "color": "#EF4444", "x": 11.7}
]

for i, layer in enumerate(layers):
    box = patches.FancyBboxPatch((layer["x"], 0.5), 2.4, 3.8,
                                 boxstyle="round,pad=0.08,rounding_size=0.15",
                                 facecolor="#F8FAFC", edgecolor=layer["color"], linewidth=2)
    ax.add_patch(box)
    
    # Title badge
    badge = patches.FancyBboxPatch((layer["x"] + 0.1, 3.5), 2.2, 0.65,
                                  boxstyle="round,pad=0.05,rounding_size=0.1",
                                  facecolor=layer["color"], edgecolor="none")
    ax.add_patch(badge)
    ax.text(layer["x"] + 1.2, 3.82, layer["name"], color="white", fontsize=8.2, fontweight="bold", ha="center", va="center")
    
    # Description text
    ax.text(layer["x"] + 0.2, 3.1, layer["desc"], color="#1E293B", fontsize=7.5, ha="left", va="top", linespacing=1.4)
    
    # Connecting arrows
    if i < len(layers) - 1:
        ax.annotate('', xy=(layer["x"] + 2.4 + 0.35, 2.4), xytext=(layer["x"] + 2.4 + 0.05, 2.4),
                    arrowprops=dict(arrowstyle="->", color="#64748B", lw=2, mutation_scale=14))

plt.tight_layout()
fig.savefig("docs/assets/diagram_architecture.png", dpi=300, bbox_inches="tight")
plt.close(fig)

print("Generated all architectural and roadmap diagrams successfully!")

# -------------------------------------------------------------
# 4. Generate Microsoft Word Document (.docx)
# -------------------------------------------------------------
doc = Document()

# Page setup: Margins 0.75 inch
for section in doc.sections:
    section.top_margin = Inches(0.75)
    section.bottom_margin = Inches(0.75)
    section.left_margin = Inches(0.75)
    section.right_margin = Inches(0.75)

# Styling Helpers
def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def add_heading_1(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(15)
    run.font.bold = True
    run.font.color.rgb = RGBColor(15, 23, 42) # Slate 900
    
    # Bottom accent line using paragraph border
    pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="12" w:space="4" w:color="2563EB"/></w:pBdr>')
    p._p.get_or_add_pPr().append(pBdr)
    return p

def add_heading_2(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(12)
    run.font.bold = True
    run.font.color.rgb = RGBColor(37, 99, 235) # Blue 600
    return p

def add_body_p(text, bold_prefix=None, italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = 'Calibri'
        r_pre.font.size = Pt(10)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(15, 23, 42)
    run = p.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(10)
    run.font.italic = italic
    run.font.color.rgb = RGBColor(51, 65, 85)
    return p

def add_bullet_p(bold_title, description):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    r1 = p.add_run(bold_title + ": ")
    r1.font.name = 'Calibri'
    r1.font.size = Pt(9.5)
    r1.font.bold = True
    r1.font.color.rgb = RGBColor(15, 23, 42)
    
    r2 = p.add_run(description)
    r2.font.name = 'Calibri'
    r2.font.size = Pt(9.5)
    r2.font.color.rgb = RGBColor(51, 65, 85)
    return p

def add_callout(text, title="NOTE / ARCHITECTURE DIRECTIVE:"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    set_cell_background(cell, "F0F7FF") # Light blue tint
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    # Left border only (accent)
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:left w:val="single" w:sz="24" w:space="0" w:color="2563EB"/><w:top w:val="none"/><w:right w:val="none"/><w:bottom w:val="none"/></w:tcBorders>')
    tcPr.append(tcBorders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    r_t = p.add_run(f"{title} ")
    r_t.font.name = 'Calibri'
    r_t.font.size = Pt(9.5)
    r_t.font.bold = True
    r_t.font.color.rgb = RGBColor(37, 99, 235)
    
    r_c = p.add_run(text)
    r_c.font.name = 'Calibri'
    r_c.font.size = Pt(9.5)
    r_c.font.color.rgb = RGBColor(30, 41, 59)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

# ----------------- COVER / HEADER TITLE BLOCK -----------------
title_tbl = doc.add_table(rows=1, cols=1)
title_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
t_cell = title_tbl.cell(0, 0)
set_cell_background(t_cell, "0F172A") # Deep Slate 900
set_cell_margins(t_cell, top=240, bottom=240, left=260, right=260)

tp = t_cell.paragraphs[0]
tp.alignment = WD_ALIGN_PARAGRAPH.CENTER
tr1 = tp.add_run("RETROD POINT OF SALE (POS)\n")
tr1.font.name = 'Calibri'
tr1.font.size = Pt(18)
tr1.font.bold = True
tr1.font.color.rgb = RGBColor(248, 250, 252)

tr2 = tp.add_run("Complete Implementation Roadmap & Architecture Blueprint")
tr2.font.name = 'Calibri'
tr2.font.size = Pt(13)
tr2.font.color.rgb = RGBColor(56, 189, 248) # Sky blue accent

# Metadata strip table
meta_tbl = doc.add_table(rows=1, cols=4)
meta_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
meta_items = [
    ("DOCUMENT VERSION", "1.0 (Production Blueprint)"),
    ("CURRENT STAGE", "Phase 1: UI Implementation"),
    ("STACK ARCHITECTURE", "Vite · React · TS · Tailwind"),
    ("TARGET PLATFORM", "Retrod Web & POS Terminal")
]
for i, (k, v) in enumerate(meta_items):
    c = meta_tbl.cell(0, i)
    set_cell_background(c, "F1F5F9")
    set_cell_margins(c, top=80, bottom=80, left=100, right=100)
    p = c.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    rk = p.add_run(k + "\n")
    rk.font.name = 'Calibri'
    rk.font.size = Pt(7.5)
    rk.font.bold = True
    rk.font.color.rgb = RGBColor(100, 116, 139)
    rv = p.add_run(v)
    rv.font.name = 'Calibri'
    rv.font.size = Pt(8.5)
    rv.font.bold = True
    rv.font.color.rgb = RGBColor(15, 23, 42)

doc.add_paragraph().paragraph_format.space_after = Pt(4)

# ----------------- SECTION 1: METHODOLOGY & PHASES -----------------
add_heading_1("1. POS Implementation Methodology & 5-Phase Pipeline")

add_body_p("This roadmap establishes the technical and operational blueprint for building the complete Retrod POS application. To ensure high speed of execution, rapid feedback loops, and clean separation between UI components and backend services, our engineering workflow executes through five dedicated phases.")

# Insert Diagram 1
doc.add_picture("docs/assets/diagram_phases.png", width=Inches(6.8))
doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER

add_callout(
    "We are actively in Phase 1 (UI Implementation). The deliverable for this stage is the full completion of all 10 module screens, interactive modals, responsive order cards, and domain-agnostic UI primitives with realistic local state before connecting live REST endpoints.",
    title="CURRENT SPRINT FOCUS:"
)

# ----------------- SECTION 2: COMPLETE POS MODULE ECOSYSTEM -----------------
add_heading_1("2. Complete Scope Breakdown: What We Are Including in POS")

add_body_p("The Retrod POS system is organized into three major functional operational domains encompassing 10 specialized pillars:")

# Insert Diagram 2
doc.add_picture("docs/assets/diagram_ecosystem.png", width=Inches(6.8))
doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER

add_heading_2("Detailed Operational Pillars & Features Included")

pillars_data = [
    ("Pillar 1: Executive Dashboard (/pos)", [
        ("Real-time Sales Statistics", "Live cards for Total Sales, Unpaid orders, Cash/Card/UPI splits, Complementary discounts."),
        ("Dynamic Sales Graphs", "Hourly sales velocity, Dine-in vs Takeaway vs Delivery volume breakdown."),
        ("Leakage & Risk Indicators", "High-visibility alerts tracking bill voids, cancelled KOT items, and unauthorized discounts."),
        ("Shift Cash Float Manager", "Register opening cash, midday cash-in top-ups, expense payouts, and closing variance."),
        ("Aggregator Live Status", "Health ping, pending orders, and volume summary for Swiggy, Zomato, and Direct Web.")
    ]),
    ("Pillar 2: Daily Operations & Order Hub (/pos/orders, /pos/kot, /pos/settlement)", [
        ("Live Orders Desk (/pos/orders)", "Interactive table and takeaway card grid, status tracking (Kitchen, Ready, Billed), quick action drawer."),
        ("Order History Audit (/pos/orders/all)", "Comprehensive searchable ledger of all past orders with biller, date, and mode filters."),
        ("Online Order Stream (/pos/orders/online)", "Dedicated channel queue for Zomato/Swiggy with 1-click Accept, Food Ready, and Rider Handover triggers."),
        ("Kitchen Order Ticket - KOT (/pos/kot)", "Real-time kitchen display system (KDS) with live timers, overdue warnings, and item strike-off."),
        ("Due Settlement (/pos/settlement)", "Customer credit ledger reconciliation, corporate billing, split-payments, and partial receipts.")
    ]),
    ("Pillar 3: Fast POS Billing Terminal (/pos/billing)", [
        ("Sub-10s Touch Catalog Grid", "Visual categories, search bar, dietary badges (Veg/Non-Veg), variant selection modal."),
        ("Interactive Cart Workspace", "Quantity multipliers, special cooking notes, item-level discounts, customer tagging."),
        ("Multi-Mode Checkout Box", "Instant Cash buttons, Dynamic UPI QR code generation, Card machine swipe, Split Tender."),
        ("Thermal Invoice Dispatch", "Standard 80mm/58mm thermal receipt generation with SMS/WhatsApp e-bill dispatch.")
    ]),
    ("Pillar 4: Menu & Catalog Management (/pos/menu)", [
        ("Category & Item Master", "Multi-tier hierarchy, pricing slabs, tax rules (GST/VAT), barcode and SKU bindings."),
        ("Variants & Modifiers", "Configurable add-on groups (Extra Cheese, Size choices, Spice levels) with pricing rules."),
        ("Channel 86'ing (Item On/Off)", "One-click toggle to disable sold-out items across POS, QR menus, Swiggy, and Zomato simultaneously."),
        ("Promotions & Discounts", "Percentage and flat discounts, happy hour rules, coupon codes, and manager override safeguards.")
    ]),
    ("Pillar 5: Inventory & Supply Chain (/pos/inventory)", [
        ("Raw Material Tracking", "Stock in hand, units of measure, reorder threshold alerts, and valuation metrics."),
        ("Recipe Bill of Materials (BOM)", "Automatic deduction of raw material stock upon punching food items on the POS."),
        ("Purchase Orders & GRN", "Vendor PO creation, goods received note verification against supplier invoices."),
        ("Wastage & Spoilage Audits", "Physical stock variance counts and loss registration with mandatory reason codes.")
    ]),
    ("Pillar 6: CRM & Customer Khata (/pos/crm)", [
        ("Customer Profile Directory", "Comprehensive spend history, favorite dishes, visit frequency, and average order value (AOV)."),
        ("Loyalty Program Engine", "Configurable points accrual on billing and instant redemption during checkout."),
        ("Credit / Khata Ledger", "Corporate and VIP customer credit limits, outstanding balances, and payment collection logging.")
    ]),
    ("Pillar 7: Marketing Automation (/pos/marketing)", [
        ("Targeted WhatsApp & SMS", "Automated birthday/anniversary greetings and win-back offers for inactive diners."),
        ("Post-Dining Feedback", "Digital QR/SMS star ratings and feedback collection with instant escalation for negative reviews.")
    ]),
    ("Pillar 8: Reports & Business Intelligence (/pos/reports)", [
        ("Shift & EOD Z-Reports", "End-of-day register closure reports, cash expected vs physical count variance summary."),
        ("Item & Category Analytics", "Menu engineering matrix (Star items, Plowhorses, Puzzles, Dogs) and hourly sales trends."),
        ("Tax & Compliance Reports", "GST/VAT breakdown, cancelled invoice registry, discount audit reports.")
    ]),
    ("Pillar 9: Aggregator & Delivery Center (/pos/aggregators)", [
        ("Multi-Brand Cloud Kitchen Console", "Single-screen management of multiple virtual brands operating from one kitchen."),
        ("Rider Dispatch Coordination", "Delivery partner assignment, pickup timers, and dispatch verification.")
    ]),
    ("Pillar 10: Store Management & RBAC (/pos/management)", [
        ("Role-Based Access Control", "Granular permission matrix for Owner, Store Manager, Cashier, Waiter, and Kitchen staff."),
        ("Printer & Hardware Setup", "IP/Bluetooth thermal printer routing (e.g., Bar orders to Bar printer, Kitchen to KOT printer).")
    ])
]

for title, items in pillars_data:
    add_heading_2(title)
    for bold_k, desc in items:
        add_bullet_p(bold_k, desc)

# ----------------- SECTION 3: TECHNICAL ARCHITECTURE -----------------
add_heading_1("3. Frontend Technical Architecture & Standards")

add_body_p("The frontend strictly adheres to the clean architecture defined in AGENTS.md, enforcing modularity, reusable primitives, and type safety:")

# Insert Diagram 3
doc.add_picture("docs/assets/diagram_architecture.png", width=Inches(6.8))
doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER

add_callout(
    "1. Routes stay thin: routes/pos.*.tsx contain no direct axios calls or deep JSX.\n"
    "2. Components never call httpClient directly: UI consumes custom TanStack Query hooks.\n"
    "3. One HTTP Client: utils/httpClient.ts handles JWT injection, baseURL configuration, and retry logic.\n"
    "4. Domain-agnostic UI: components/ui and components/form maintain zero business logic for clean reuse.",
    title="CORE ENGINEERING RULES:"
)

# ----------------- SECTION 4: SCREEN IMPLEMENTATION MATRIX -----------------
add_heading_1("4. Phase 1 Screen Deliverables & Execution Matrix")

add_body_p("The table below details all POS screens, their manager components, routes, and current development status:")

# Status Table
table = doc.add_table(rows=1, cols=4)
table.alignment = WD_TABLE_ALIGNMENT.CENTER
headers = ["Module & Route", "Screen Manager Component", "Status", "Key Capabilities & Specs"]

hdr_cells = table.rows[0].cells
for i, h in enumerate(headers):
    set_cell_background(hdr_cells[i], "0F172A")
    set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
    p = hdr_cells[i].paragraphs[0]
    r = p.add_run(h)
    r.font.name = 'Calibri'
    r.font.size = Pt(8.5)
    r.font.bold = True
    r.font.color.rgb = RGBColor(255, 255, 255)

screen_matrix = [
    ("/pos (Dashboard)", "PosDashboardManager.tsx", "COMPLETE", "Sales strip, graph, leakage monitor, cash float, online health"),
    ("/pos/orders (Live)", "PosOrdersListManager.tsx", "IN PROGRESS", "Live table grid, status filters, action drawer, table bill"),
    ("/pos/orders/all", "PosAllOrdersManager.tsx", "IN PROGRESS", "Complete searchable history, date picker, invoice receipt modal"),
    ("/pos/orders/online", "PosOnlineOrdersManager.tsx", "IN PROGRESS", "Swiggy/Zomato live queue, countdown timer, accept/ready triggers"),
    ("/pos/kot (Kitchen)", "PosKotManager.tsx", "IN PROGRESS", "KDS cards, urgency color badges, item strike-off, reprint"),
    ("/pos/settlement", "PosSettlementManager.tsx", "IN PROGRESS", "Due payment ledger, split bill modal, credit khata tracking"),
    ("/pos/billing (Fast POS)", "PosBillingManager.tsx", "NEXT UP", "Sub-10s touch catalog, interactive cart, multi-payment checkout"),
    ("/pos/menu", "PosMenuManager.tsx", "NEXT UP", "Category hierarchy, item drawer, variants & 86'ing toggles"),
    ("/pos/inventory", "PosInventoryManager.tsx", "NEXT UP", "Raw material stock table, low alerts, PO forms, wastage logs"),
    ("/pos/reports", "PosReportsManager.tsx", "NEXT UP", "Sidebar nav, EOD Z-reports, sales charts, GST & CSV export"),
    ("/pos/management", "PosManagementManager.tsx", "NEXT UP", "Staff RBAC permissions matrix, printer hardware routing"),
    ("/pos/crm", "PosCrmManager.tsx", "NEXT UP", "Customer directory, visit metrics, loyalty points redemption"),
    ("/pos/marketing", "PosMarketingManager.tsx", "NEXT UP", "SMS/WhatsApp campaign builder, automated birthday triggers"),
    ("/pos/aggregators", "PosAggregatorsManager.tsx", "NEXT UP", "Multi-brand console, live platform status, commission logs")
]

for row_idx, (route, comp, status, caps) in enumerate(screen_matrix):
    row = table.add_row()
    bg = "FFFFFF" if row_idx % 2 == 0 else "F8FAFC"
    
    vals = [route, comp, status, caps]
    for c_idx, cell in enumerate(row.cells):
        set_cell_background(cell, bg)
        set_cell_margins(cell, top=70, bottom=70, left=100, right=100)
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        
        run = p.add_run(vals[c_idx])
        run.font.name = 'Calibri'
        run.font.size = Pt(8)
        
        if c_idx == 2:
            run.font.bold = True
            if status == "COMPLETE":
                run.font.color.rgb = RGBColor(16, 185, 129) # Green
            elif status == "IN PROGRESS":
                run.font.color.rgb = RGBColor(37, 99, 235) # Blue
            else:
                run.font.color.rgb = RGBColor(100, 116, 139) # Gray
        elif c_idx == 0 or c_idx == 1:
            run.font.bold = True
            run.font.color.rgb = RGBColor(15, 23, 42)
        else:
            run.font.color.rgb = RGBColor(51, 65, 85)

doc.add_paragraph().paragraph_format.space_after = Pt(6)

# ----------------- SECTION 5: MILESTONE TIMELINE -----------------
add_heading_1("5. High-Level Milestone & Rollout Timeline")

add_body_p("The execution plan is sequenced into focused delivery milestones to guarantee predictable rollout:")

milestones = [
    ("Sprint 1 (Weeks 1-2): Core UI Foundation & Operations Hub", "Deliver complete UI screens for Dashboard, Live Orders, Online Orders, KOT Screen, Settlement, and Fast Billing with interactive mock state."),
    ("Sprint 2 (Weeks 3-4): Catalog, Inventory & Admin UI Hubs", "Deliver complete UI screens for Menu Management, Inventory & BOM, Reports & Analytics, CRM, Marketing, and System Management."),
    ("Sprint 3 (Weeks 5-6): State Management & Order Engine Logic", "Implement full client-side cart calculation engine (GST/VAT, service charges, discounts), KOT state timers, and split-payment calculators."),
    ("Sprint 4 (Weeks 7-8): Backend API Integration & Services", "Connect all UI Managers to live REST APIs via TanStack Query and Axios httpClient with optimistic cache updates and error handling."),
    ("Sprint 5 (Weeks 9-10): Hardware Integrations, Real-time Sync & Hardening", "Implement WebSocket live KOT/Order feeds, ESC/POS thermal printing, RBAC permission testing, Z-Report audits, and final production rollout.")
]

for m_title, m_desc in milestones:
    add_bullet_p(m_title, m_desc)

# Save Document
output_path = "docs/Retrod_POS_Implementation_Roadmap.docx"
doc.save(output_path)
print(f"Microsoft Word document successfully created at {output_path}!")
