import { saveAs } from "file-saver";

export function exportToCSV(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => {
        const val = String(row[h] ?? "");
        return val.includes(",") || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${filename}.csv`);
}

export async function exportToExcel(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return;
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Data");

  const headers = Object.keys(rows[0]);
  sheet.addRow(headers);

  // Style header row
  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8E8E8" } };
  });

  rows.forEach((row) => sheet.addRow(headers.map((h) => row[h])));

  // Auto-width columns
  headers.forEach((_, i) => {
    const col = sheet.getColumn(i + 1);
    col.width = Math.max(12, ...rows.map((r) => String(r[headers[i]] ?? "").length + 2));
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, `${filename}.xlsx`);
}
