/** Escapes de exportação para impedir fórmulas em CSV e HTML injetado no relatório. */
export function escapeSpreadsheetValue(value: string | number): string {
  const text = String(value);
  // Excel/Sheets podem interpretar texto iniciado por =, +, -, @, tab ou quebra de linha como fórmula.
  return /^[\s\uFEFF]*[=+\-@]/.test(text) || /^[\r\n\t]/.test(text) ? `'${text}` : text;
}

export function escapeReportHtml(value: string | number): string {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
