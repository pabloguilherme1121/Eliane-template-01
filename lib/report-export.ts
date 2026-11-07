import { Platform } from "react-native";
import { formatBRL } from "@/lib/catalog";
import { escapeReportHtml, escapeSpreadsheetValue } from "@/lib/export-sanitize";

type ExportOrder = { id: string; date: string; status: string; total: number; items: string };

const escapeCsv = (value: string | number) => `"${escapeSpreadsheetValue(value).replace(/"/g, '""')}"`;
const reportRows = (orders: ExportOrder[]) => orders.map((order) => [order.id, order.date, order.status, order.items, formatBRL(order.total)]);

export function exportSalesCsv(orders: ExportOrder[]) {
  const rows = [["Pedido", "Data", "Status", "Itens", "Total"], ...reportRows(orders)];
  const csv = `\uFEFF${rows.map((row) => row.map(escapeCsv).join(";")).join("\n")}`;
  if (Platform.OS === "web" && typeof document !== "undefined") {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `eliane-fashion-vendas-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  }
  return false;
}

export function exportSalesPdf(orders: ExportOrder[]) {
  if (Platform.OS !== "web" || typeof window === "undefined") return false;
  const total = orders.reduce((sum, order) => sum + order.total, 0);
  const rows = reportRows(orders).map((row) => `<tr>${row.map((cell) => `<td>${escapeReportHtml(cell)}</td>`).join("")}</tr>`).join("");
  const report = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Relatório de vendas · Eliane Fashion</title><style>body{font-family:Arial,sans-serif;color:#282625;padding:32px}h1{font-family:Georgia,serif;color:#913D50}p{color:#685D5A}table{border-collapse:collapse;width:100%;margin-top:24px}th,td{border-bottom:1px solid #E6D9D1;padding:10px;text-align:left;font-size:12px}th{background:#F4E8E7;color:#913D50}strong{font-size:18px}</style></head><body><h1>Eliane Fashion</h1><p>Relatório demonstrativo · ${new Date().toLocaleDateString("pt-BR")}</p><p><strong>${orders.length}</strong> pedidos de exemplo · <strong>${formatBRL(total)}</strong> em valores simulados</p><table><thead><tr><th>Pedido</th><th>Data</th><th>Status</th><th>Itens</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table><script>window.onload=function(){window.print()}</script></body></html>`;
  const popup = window.open("", "_blank", "width=900,height=700");
  if (!popup) return false;
  popup.opener = null;
  popup.document.write(report);
  popup.document.close();
  return true;
}
