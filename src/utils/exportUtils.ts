import * as XLSX from "xlsx";
import { toast } from "sonner";

/**
 * Clean and robust Excel Export Engine for Retrod POS
 * Uses SheetJS to generate genuine .xlsx files with generous auto-calculated
 * column widths, title & metadata banners, and properly aligned numbers/currency.
 */

export interface ExportToExcelOptions {
  filename?: string;
  sheetName?: string;
  title?: string;
  subtitle?: string;
  dateRange?: string;
  propertyName?: string;
  columns?: string[];
  rows?: (string | number | boolean | null | undefined)[][];
  summaryFooter?: (string | number | boolean | null | undefined)[];
  secondarySummary?: {
    title?: string;
    columns: string[];
    rows: (string | number | boolean | null | undefined)[][];
  };
}

export interface ExportExtraOptions {
  sheetName?: string;
  title?: string;
  subtitle?: string;
  dateRange?: string;
  propertyName?: string;
  summaryFooter?: (string | number | boolean | null | undefined)[] | Record<string, any>;
}

/**
 * Clean HTML tags, excess spaces, and sanitize cell values
 */
export function cleanExportCell(val: any): string | number {
  if (val === null || val === undefined) return "";
  if (typeof val === "number") return isNaN(val) ? "" : val;
  if (typeof val === "boolean") return val ? "Yes" : "No";

  const str = String(val)
    .replace(/<[^>]*>?/gm, "")
    .replace(/&nbsp;/g, " ")
    .trim();

  // If string is pure numeric (digits, decimals, negative) without currency symbols
  if (/^-?\d+(\.\d+)?$/.test(str)) {
    const num = parseFloat(str);
    if (!isNaN(num)) return num;
  }

  return str;
}

/**
 * Check if a column represents monetary/currency data
 */
function isCurrencyColumn(colName: string): boolean {
  const name = colName.toLowerCase();
  return ["amount", "price", "total", "cost", "sale", "tax", "gst", "discount", "net", "gross", "due", "paid", "bill", "revenue", "₹", "inr"].some(
    (kw) => name.includes(kw)
  );
}

/**
 * Check if a column represents dates/time
 */
function isDateColumn(colName: string): boolean {
  const name = colName.toLowerCase();
  return ["date", "time", "created", "updated", "period", "expiry", "at", "timestamp"].some((kw) => name.includes(kw));
}

/**
 * Universal Excel export function supporting:
 * 1. Options object: exportToExcel({ filename, title, columns, rows, ... })
 * 2. Array of objects: exportToExcel(data, filename, options)
 */
export function exportToExcel(
  arg1: ExportToExcelOptions | Record<string, any>[],
  arg2?: string,
  arg3?: string | ExportExtraOptions
): void {
  try {
    let defaultPropName = "";
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("retrod:active-property") : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        defaultPropName = parsed?.name || "";
      }
    } catch {}

    let opts: ExportToExcelOptions;

    if (Array.isArray(arg1)) {
      const data = arg1;
      const filename = (arg2 || "POS_Report").replace(/\.(csv|xlsx|xls)$/i, "");
      const extra: ExportExtraOptions = typeof arg3 === "string" ? { sheetName: arg3 } : arg3 || {};

      if (data.length === 0) {
        opts = {
          filename,
          sheetName: extra.sheetName || filename.substring(0, 31),
          title: extra.title || filename.replace(/_/g, " "),
          subtitle: extra.subtitle,
          dateRange: extra.dateRange,
          propertyName: extra.propertyName || defaultPropName,
          columns: ["Data"],
          rows: [["No records to export"]],
        };
      } else {
        const rawKeys = Object.keys(data[0]);
        const columns = rawKeys.map((k) =>
          k
            .replace(/([A-Z])/g, " $1")
            .replace(/[_-]/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
            .trim()
        );

        const rows = data.map((item) => rawKeys.map((k) => item[k]));

        let summaryFooter: (string | number | boolean | null | undefined)[] | undefined = undefined;
        if (extra.summaryFooter) {
          if (Array.isArray(extra.summaryFooter)) {
            summaryFooter = extra.summaryFooter;
          } else {
            const footerObj = extra.summaryFooter as Record<string, any>;
            summaryFooter = rawKeys.map((k, idx) => {
              if (idx === 0) return footerObj["Total"] ?? "Total";
              return footerObj[k] ?? "";
            });
          }
        }

        opts = {
          filename,
          sheetName: extra.sheetName || filename.substring(0, 31),
          title: extra.title || filename.replace(/_/g, " "),
          subtitle: extra.subtitle,
          dateRange: extra.dateRange,
          propertyName: extra.propertyName || defaultPropName,
          columns,
          rows,
          summaryFooter,
        };
      }
    } else {
      opts = {
        ...arg1,
        propertyName: arg1.propertyName || defaultPropName,
      };
    }

    const filename = (opts.filename || "POS_Export").replace(/\.(csv|xlsx|xls)$/i, "");
    const columns = opts.columns && opts.columns.length > 0 ? opts.columns : ["Data"];
    const rows = opts.rows || [];

    const aoa: (string | number)[][] = [];

    // 1. Hotel / Brand Header
    if (opts.propertyName) {
      aoa.push([cleanExportCell(opts.propertyName)]);
    }

    // 2. Title Header
    const titleText = opts.title || filename.replace(/[_]/g, " ").toUpperCase();
    aoa.push([cleanExportCell(titleText.toUpperCase())]);

    // 3. Metadata Bar (Date range, filters, generated timestamp)
    const metaParts: string[] = [];
    if (opts.dateRange) metaParts.push(`Period: ${opts.dateRange}`);
    if (opts.subtitle) metaParts.push(opts.subtitle);
    metaParts.push(
      `Generated: ${new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`
    );
    aoa.push([metaParts.join(" | ")]);

    // 4. Spacer row
    aoa.push([]);

    // 5. Column Headers
    const headerRowIndex = aoa.length;
    const cleanHeaders = columns.map((c) => String(cleanExportCell(c)));
    aoa.push(cleanHeaders);

    // 6. Data Rows
    for (const row of rows) {
      aoa.push(row.map(cleanExportCell));
    }

    // 7. Summary Footer (Totals)
    if (opts.summaryFooter && opts.summaryFooter.length > 0) {
      aoa.push(opts.summaryFooter.map(cleanExportCell));
    }

    // 8. Secondary Summary (if present)
    if (opts.secondarySummary && opts.secondarySummary.columns.length > 0) {
      aoa.push([]); // spacer row
      if (opts.secondarySummary.title) {
        aoa.push([cleanExportCell(opts.secondarySummary.title)]);
      }
      aoa.push(opts.secondarySummary.columns.map((c) => String(cleanExportCell(c))));
      for (const sRow of opts.secondarySummary.rows) {
        aoa.push(sRow.map(cleanExportCell));
      }
    }

    // Create Worksheet from Array of Arrays
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Calculate Generous Column Widths (wch) to prevent any '####' cutoff
    const maxCols = Math.max(cleanHeaders.length, ...aoa.map((r) => r.length));
    const colWidths: { wch: number }[] = [];

    for (let c = 0; c < maxCols; c++) {
      const colName = cleanHeaders[c] || `Col_${c}`;
      let maxCharLen = colName.length;

      for (let rIdx = headerRowIndex; rIdx < aoa.length; rIdx++) {
        const cellVal = aoa[rIdx][c];
        if (cellVal !== undefined && cellVal !== null) {
          const len = String(cellVal).length;
          if (len > maxCharLen) {
            maxCharLen = len;
          }
        }
      }

      // Minimum safe width based on column nature
      let minWch = 14;
      if (isCurrencyColumn(colName)) {
        minWch = 18; // Ample width for large rupee values (e.g. ₹ 1,50,000.00)
      } else if (isDateColumn(colName)) {
        minWch = 20; // Ample width for full date & time (e.g. 2026-09-02 14:30)
      } else if (
        colName.toLowerCase().includes("outlet") ||
        colName.toLowerCase().includes("item") ||
        colName.toLowerCase().includes("name") ||
        colName.toLowerCase().includes("customer") ||
        colName.toLowerCase().includes("description")
      ) {
        minWch = 26; // Ample width for outlet names and dish titles
      }

      const calculatedWidth = Math.max(minWch, maxCharLen + 5);
      colWidths.push({ wch: calculatedWidth });
    }

    ws["!cols"] = colWidths;

    // Create Workbook and save as native .xlsx
    const wb = XLSX.utils.book_new();
    const validSheetName = (opts.sheetName || "POS Data").replace(/[/\\?*:[\]]/g, "_").substring(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, validSheetName);

    const sanitizedFilename = filename.replace(/[/\\?%*:|"<>]/g, "_");
    const finalFilename = sanitizedFilename.toLowerCase().endsWith(".xlsx")
      ? sanitizedFilename
      : `${sanitizedFilename}.xlsx`;

    XLSX.writeFile(wb, finalFilename);
    toast.success(`Exported ${rows.length} rows to ${finalFilename}`);
  } catch (error) {
    console.error("Failed to export Excel file:", error);
    toast.error("Failed to export Excel spreadsheet. Please try again.");
  }
}

/**
 * Standard table export helper
 */
export function exportTableData(options: ExportToExcelOptions): void {
  exportToExcel(options);
}

/**
 * Fallback wrapper
 */
export function exportToCsv(data: Record<string, any>[], filename = "Export") {
  exportToExcel(data, filename);
}
