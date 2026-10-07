/**
 * Utility functions for exporting data to styled Excel spreadsheets (.xls / .xlsx)
 * with luxury Retrod brand styling, colored headers, alternating row colors,
 * clean grid borders, and generous auto-fitted column widths preventing '####' clipping.
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
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: any): string {
  if (unsafe === null || unsafe === undefined) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Strips HTML tags and excessive whitespace
 */
function cleanValue(val: any): string {
  if (val === null || val === undefined) return "";
  return String(val)
    .replace(/<[^>]*>?/gm, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/**
 * Determines if a value is purely numeric
 */
function isNumeric(val: any): boolean {
  if (typeof val === "number") return !isNaN(val);
  if (typeof val !== "string") return false;
  const cleaned = val.replace(/^[₹$€£\s,]+/, "").replace(/,/g, "").trim();
  return cleaned !== "" && !isNaN(Number(cleaned));
}

/**
 * Converts string number to raw float for Excel calculation
 */
function extractNumeric(val: any): number {
  if (typeof val === "number") return val;
  const cleaned = String(val).replace(/^[₹$€£\s,]+/, "").replace(/,/g, "").trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Checks if a column name or value represents a currency / monetary amount
 */
function isCurrencyColumn(colName: string, sampleVal?: any): boolean {
  const nameLower = colName.toLowerCase();
  const keywords = ["price", "amount", "cost", "total", "rate", "sale", "tax", "gst", "discount", "net", "gross", "bill", "due", "revenue", "charge", "₹", "inr"];
  const matchesName = keywords.some((kw) => nameLower.includes(kw));
  const hasCurrencySymbol = sampleVal ? String(sampleVal).includes("₹") || String(sampleVal).includes("$") : false;
  return matchesName || hasCurrencySymbol;
}

/**
 * Checks if a column represents a date / timestamp
 */
function isDateColumn(colName: string): boolean {
  const nameLower = colName.toLowerCase();
  return nameLower.includes("date") || nameLower.includes("time") || nameLower.includes("created") || nameLower.includes("updated") || nameLower.includes("period");
}

/**
 * Generates rich XML Spreadsheet 2003 document with generous column widths,
 * luxury teal headers (#0F766E), gold/teal accents, alternating rows, and borders.
 */
function generateXmlSpreadsheet(options: ExportToExcelOptions): string {
  const columns = options.columns || [];
  const rows = options.rows || [];
  const sheetName = escapeXml((options.sheetName || "Report").replace(/[/\\?*:[\]]/g, "_").substring(0, 31));
  const title = options.title || options.filename || "Report Export";
  const dateRange = options.dateRange;
  const subtitle = options.subtitle;
  const propertyName = options.propertyName || "RETROD LUXURY POS";
  const summaryFooter = options.summaryFooter;

  const totalCols = Math.max(columns.length, 1);

  // 1. Calculate Optimal Spacious Column Widths
  const colWidths: number[] = [];
  for (let c = 0; c < columns.length; c++) {
    const colName = columns[c];
    let maxChars = colName.length;

    for (let r = 0; r < rows.length; r++) {
      const cellVal = rows[r][c];
      if (cellVal !== undefined && cellVal !== null) {
        const strLen = cleanValue(cellVal).length;
        if (strLen > maxChars) {
          maxChars = strLen;
        }
      }
    }

    if (summaryFooter && summaryFooter[c] !== undefined && summaryFooter[c] !== null) {
      const strLen = cleanValue(summaryFooter[c]).length;
      if (strLen > maxChars) maxChars = strLen;
    }

    // Determine baseline minimum width based on column nature
    let minWidth = 110;
    if (isDateColumn(colName)) {
      minWidth = 135; // Ample width for full date & time without '####'
    } else if (isCurrencyColumn(colName)) {
      minWidth = 135; // Ample width for large rupee values (e.g. ₹ 1,50,000)
    } else if (colName.toLowerCase().includes("outlet") || colName.toLowerCase().includes("item") || colName.toLowerCase().includes("name") || colName.toLowerCase().includes("customer")) {
      minWidth = 180; // Ample width for store names, dish titles, descriptions
    } else if (colName.toLowerCase().includes("status") || colName.toLowerCase().includes("type") || colName.toLowerCase().includes("mode")) {
      minWidth = 120;
    }

    // Formula: character count * 8.5 pt + 35pt safety padding, bounded by minWidth
    const calculatedWidth = Math.max(minWidth, Math.min(320, Math.round(maxChars * 8.5 + 40)));
    colWidths.push(calculatedWidth);
  }

  // 2. Build XML Styles & Table Rows
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Author>Retrod PMS &amp; POS</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <!-- Main Title Banner -->
  <Style ss:ID="HeaderTitle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#0F766E"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F766E"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F766E"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F766E"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="14" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#115E59" ss:Pattern="Solid"/>
  </Style>
  <!-- Subtitle Meta Bar -->
  <Style ss:ID="MetaSubtitle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Italic="1" ss:Color="#0F766E" ss:Bold="1"/>
   <Interior ss:Color="#F0FDFA" ss:Pattern="Solid"/>
  </Style>
  <!-- Column Header Row (Teal Luxury) -->
  <Style ss:ID="ColHeader">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#0F766E"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0D9488"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0D9488"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0D9488"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#0F766E" ss:Pattern="Solid"/>
  </Style>
  <!-- Standard Text Cell -->
  <Style ss:ID="DataText">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
   <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="DataTextAlt">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
  </Style>
  <!-- Number / Numeric Cell -->
  <Style ss:ID="DataNumber">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
   <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="#,##0"/>
  </Style>
  <Style ss:ID="DataNumberAlt">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="#,##0"/>
  </Style>
  <!-- Currency Cell -->
  <Style ss:ID="DataCurrency">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#0F766E" ss:Bold="1"/>
   <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="₹ #,##0.00"/>
  </Style>
  <Style ss:ID="DataCurrencyAlt">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#0F766E" ss:Bold="1"/>
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="₹ #,##0.00"/>
  </Style>
  <!-- Date Cell -->
  <Style ss:ID="DataDate">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
   <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="DataDateAlt">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
  </Style>
  <!-- Summary Totals Footer -->
  <Style ss:ID="SummaryTotal">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#0F766E"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#0F766E"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0D9488"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0D9488"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#0F766E"/>
   <Interior ss:Color="#CCFBF1" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="₹ #,##0.00"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${sheetName}">
  <Table ss:DefaultRowHeight="20">
`;

  // Write Column Width tags
  colWidths.forEach((w) => {
    xml += `   <Column ss:Width="${w}" ss:AutoFitWidth="0"/>\n`;
  });

  // Row 1: Header Title Banner
  const mergeAcross = totalCols > 1 ? ` ss:MergeAcross="${totalCols - 1}"` : "";
  xml += `   <Row ss:Height="36">\n`;
  xml += `    <Cell${mergeAcross} ss:StyleID="HeaderTitle"><Data ss:Type="String">${escapeXml(title.toUpperCase())}</Data></Cell>\n`;
  xml += `   </Row>\n`;

  // Row 2: Subtitle Meta
  const metaText = [
    propertyName ? `Hotel: ${propertyName}` : "",
    dateRange ? `Period: ${dateRange}` : "",
    subtitle || "",
    `Exported: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}`
  ].filter(Boolean).join(" | ");

  xml += `   <Row ss:Height="22">\n`;
  xml += `    <Cell${mergeAcross} ss:StyleID="MetaSubtitle"><Data ss:Type="String">${escapeXml(metaText)}</Data></Cell>\n`;
  xml += `   </Row>\n`;

  // Row 3: Spacer Row
  xml += `   <Row ss:Height="8"/>\n`;

  // Row 4: Column Headers
  xml += `   <Row ss:Height="28">\n`;
  columns.forEach((col) => {
    xml += `    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">${escapeXml(col)}</Data></Cell>\n`;
  });
  xml += `   </Row>\n`;

  // Row 5+: Data Rows
  rows.forEach((row, rIdx) => {
    const isAlt = rIdx % 2 === 1;
    xml += `   <Row ss:Height="22">\n`;
    columns.forEach((col, cIdx) => {
      const cellVal = row[cIdx];
      const cleaned = cleanValue(cellVal);
      const isCurr = isCurrencyColumn(col, cellVal);
      const isDate = isDateColumn(col);
      const isNum = isNumeric(cleaned);

      if (isCurr && isNum) {
        const style = isAlt ? "DataCurrencyAlt" : "DataCurrency";
        xml += `    <Cell ss:StyleID="${style}"><Data ss:Type="Number">${extractNumeric(cleaned)}</Data></Cell>\n`;
      } else if (isDate) {
        const style = isAlt ? "DataDateAlt" : "DataDate";
        xml += `    <Cell ss:StyleID="${style}"><Data ss:Type="String">${escapeXml(cleaned)}</Data></Cell>\n`;
      } else if (isNum && !isDate && !col.toLowerCase().includes("phone") && !col.toLowerCase().includes("id") && !col.toLowerCase().includes("code")) {
        const style = isAlt ? "DataNumberAlt" : "DataNumber";
        xml += `    <Cell ss:StyleID="${style}"><Data ss:Type="Number">${extractNumeric(cleaned)}</Data></Cell>\n`;
      } else {
        const style = isAlt ? "DataTextAlt" : "DataText";
        xml += `    <Cell ss:StyleID="${style}"><Data ss:Type="String">${escapeXml(cleaned)}</Data></Cell>\n`;
      }
    });
    xml += `   </Row>\n`;
  });

  // Summary Footer (if present)
  if (summaryFooter && summaryFooter.length > 0) {
    xml += `   <Row ss:Height="26">\n`;
    columns.forEach((col, cIdx) => {
      const fVal = summaryFooter[cIdx];
      const cleaned = cleanValue(fVal);
      const isNum = isNumeric(cleaned);
      if (isNum) {
        xml += `    <Cell ss:StyleID="SummaryTotal"><Data ss:Type="Number">${extractNumeric(cleaned)}</Data></Cell>\n`;
      } else {
        xml += `    <Cell ss:StyleID="SummaryTotal"><Data ss:Type="String">${escapeXml(cleaned)}</Data></Cell>\n`;
      }
    });
    xml += `   </Row>\n`;
  }

  xml += `  </Table>
  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
   <Selected/>
   <DoNotDisplayGridlines/>
   <Panes>
    <Pane>
     <Number>3</Number>
     <ActiveRow>4</ActiveRow>
    </Pane>
   </Panes>
   <ProtectObjects>False</ProtectObjects>
   <ProtectScenarios>False</ProtectScenarios>
  </WorksheetOptions>
 </Worksheet>
</Workbook>`;

  return xml;
}

/**
 * Universal export function supporting:
 * 1. exportToExcel(options: ExportToExcelOptions)
 * 2. exportToExcel(data: Record<string, any>[], filename?: string, options?: ExportExtraOptions)
 */
export function exportToExcel(
  arg1: ExportToExcelOptions | Record<string, any>[],
  arg2?: string,
  arg3?: string | ExportExtraOptions
): void {
  let defaultPropName = "";
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("retrod:active-property") : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      defaultPropName = parsed?.name || "";
    }
  } catch {}

  let options: ExportToExcelOptions;

  if (Array.isArray(arg1)) {
    const data = arg1;
    if (!data || data.length === 0) return;

    const filename = (arg2 || "Export").replace(/\.(csv|xlsx|xls)$/i, "");
    const extra: ExportExtraOptions =
      typeof arg3 === "string" ? { sheetName: arg3 } : arg3 || {};

    const rawKeys = Object.keys(data[0]);
    const headers = rawKeys.map((k) =>
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

    options = {
      filename,
      sheetName: extra.sheetName || filename.substring(0, 31),
      title: extra.title || filename.replace(/_/g, " "),
      subtitle: extra.subtitle,
      dateRange: extra.dateRange,
      propertyName: extra.propertyName || defaultPropName,
      columns: headers,
      rows,
      summaryFooter,
    };
  } else {
    options = {
      ...arg1,
      propertyName: arg1.propertyName || defaultPropName,
    };
  }

  const filename = (options.filename || "Report").replace(/\.(csv|xlsx|xls)$/i, "");
  const xmlContent = generateXmlSpreadsheet(options);
  
  // Download as .xls (XML Spreadsheet 2003) which Excel opens with full colors & wide columns
  const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
  downloadBlob(blob, `${filename}.xls`);
}

/**
 * Standard table export helper matching PMS pattern
 */
export function exportTableData(options: ExportToExcelOptions): void {
  exportToExcel(options);
}

/**
 * CSV fallback wrapper
 */
export function exportToCsv(data: Record<string, any>[], filename = "Export") {
  exportToExcel(data, filename);
}
