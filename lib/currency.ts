/** Interpreta preços BRL com centavos sem transformar "12.34" em 1234. */
export function parseBRLPrice(input: string): number | null {
  let clean = input.replace(/R\$|[\s\u00a0]/g, "").trim();
  if (!clean || !/^[\d,.]+$/.test(clean)) return null;
  const comma = clean.lastIndexOf(",");
  const dot = clean.lastIndexOf(".");
  if (comma >= 0 && dot >= 0) {
    const separator = comma > dot ? "," : ".";
    const thousands = separator === "," ? "." : ",";
    clean = clean.split(thousands).join("").replace(separator, ".");
  } else if (comma >= 0 || dot >= 0) {
    const sep = comma >= 0 ? "," : ".";
    const parts = clean.split(sep);
    if (parts.length > 2) {
      if (parts.slice(1).every((part) => /^\d{3}$/.test(part))) clean = parts.join("");
      else return null;
    } else if (parts[1]?.length === 3) {
      clean = parts.join("");
    } else {
      clean = parts.join(".");
    }
  }
  if (!/^\d+(?:\.\d{1,2})?$/.test(clean)) return null;
  const result = Number(clean);
  return Number.isFinite(result) && result > 0 && result <= 10000000 ? Math.round(result * 100) / 100 : null;
}
