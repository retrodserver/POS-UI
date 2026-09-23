/**
 * Utility functions for exporting data to Excel (.csv / .xlsx / HTML-Excel format)
 */

export interface ExportToExcelOptions {
  filename?: string;
  sheetName?: string;
  title?: string;
  columns?: string[];
  rows?: (string | number | boolean | null | undefined)[][];
}

/**
 * Escapes CSV values to safely handle commas, double quotes, and newlines
 */
function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Triggers a client-side file download for a given Blob
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Universal export function supporting multiple signatures:
 * 1. exportToExcel(options: ExportToExcelOptions)
 * 2. exportToExcel(data: Record<string, any>[], filename?: string, options?: { sheetName?: string; title?: string })
 */
export function exportToExcel(
  arg1: ExportToExcelOptions | Record<string, any>[],
  arg2?: string,
  arg3?: { sheetName?: string; title?: string }
) {
  if (Array.isArray(arg1)) {
    const data = arg1;
    if (!data || data.length === 0) return;

    const filename = (arg2 || "Export").replace(/\.(csv|xlsx|xls)$/i, "");
    const title = arg3?.title;
    
    // Extract column keys from object
    const keys = Object.keys(data[0]);
    const headers = keys.map((k) =>
      k
        .replace(/([A-Z])/g, " $1")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim()
    );

    const rows = data.map((item) => keys.map((k) => item[k]));

    exportToExcel({
      filename,
      sheetName: arg3?.sheetName || filename.substring(0, 31),
      title: title || `${filename} Export`,
      columns: headers,
      rows,
    });
    return;
  }

  const options = arg1;
  const filename = (options.filename || "Export").replace(/\.(csv|xlsx|xls)$/i, "");
  const columns = options.columns || [];
  const rows = options.rows || [];

  // Generate CSV content with UTF-8 BOM so Excel opens with proper unicode/special characters
  const lines: string[] = [];

  if (options.title) {
    lines.push(escapeCsvValue(options.title));
    lines.push(""); // empty row after title
  }

  if (columns.length > 0) {
    lines.push(columns.map(escapeCsvValue).join(","));
  }

  rows.forEach((row) => {
    lines.push(row.map(escapeCsvValue).join(","));
  });

  const csvContent = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${filename}.csv`);
}

export function exportToCsv(data: Record<string, any>[], filename = "Export") {
  exportToExcel(data, filename);
}
