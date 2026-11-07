/** Regras puras do painel DEMONSTRATIVO. Dados do armazenamento não são confiáveis. */
export const orderStatuses = ["Recebido", "Em separação", "Em trânsito", "Enviado", "Entregue"] as const;
export type DemoOrder = { id: string; date: string; status: string; total: number; items: string };
export type AdminSection = "overview" | "products" | "orders" | "reports";
export type AdminSettings = { category: string; status: string; section: AdminSection };

const isObject = (input: unknown): input is Record<string, unknown> =>
  typeof input === "object" && input !== null && !Array.isArray(input);
const sections: readonly AdminSection[] = ["overview", "products", "orders", "reports"];
const validPrice = (input: unknown): input is number =>
  typeof input === "number" && Number.isFinite(input) && input >= 0 && input <= 1_000_000;
const roundMoney = (input: number) => Math.round((input + Number.EPSILON) * 100) / 100;

export function normalizeAdminProducts<T extends { id: string; price: number }>(
  raw: unknown, catalog: readonly T[],
): Array<T & { active: boolean }> {
  const entries = Array.isArray(raw) ? raw : [];
  const saved = new Map<string, Record<string, unknown>>();
  for (const entry of entries.slice(0, 250)) {
    if (isObject(entry) && typeof entry.id === "string" && !saved.has(entry.id)) saved.set(entry.id, entry);
  }
  return catalog.map((product) => {
    const persisted = saved.get(product.id);
    return {
      ...product,
      price: persisted && validPrice(persisted.price) && persisted.price > 0 ? roundMoney(persisted.price) : product.price,
      active: typeof persisted?.active === "boolean" ? persisted.active : true,
    };
  });
}

export function normalizeAdminOrders(raw: unknown, fallback: readonly DemoOrder[]): DemoOrder[] {
  if (!Array.isArray(raw)) return fallback.map((order) => ({ ...order }));
  const ids = new Set<string>();
  const output: DemoOrder[] = [];
  for (const candidate of raw.slice(0, 200)) {
    if (!isObject(candidate)) continue;
    const { id, date, status, total, items } = candidate;
    if (typeof id !== "string" || !/^EF-\d{3,9}$/.test(id) || ids.has(id) ||
        typeof date !== "string" || date.length === 0 || date.length > 80 ||
        typeof status !== "string" || !orderStatuses.includes(status as typeof orderStatuses[number]) ||
        typeof items !== "string" || items.length === 0 || items.length > 120 ||
        !validPrice(total)) continue;
    ids.add(id);
    output.push({ id, date, status, items, total: roundMoney(total) });
  }
  return output.length === 0 && raw.length > 0 ? fallback.map((order) => ({ ...order })) : output;
}

export function normalizeAdminSettings(raw: unknown, allowedCategories: readonly string[]): AdminSettings {
  const entry = isObject(raw) ? raw : {};
  return {
    category: typeof entry.category === "string" && allowedCategories.includes(entry.category) ? entry.category : "Todos",
    status: typeof entry.status === "string" && (entry.status === "Todos" || orderStatuses.includes(entry.status as typeof orderStatuses[number])) ? entry.status : "Todos",
    section: typeof entry.section === "string" && sections.includes(entry.section as AdminSection) ? entry.section as AdminSection : "overview",
  };
}

export function nextDemoOrderId(orders: readonly Pick<DemoOrder, "id">[]): string {
  let maximum = 2481;
  for (const { id } of orders) {
    if (!/^EF-\d{3,9}$/.test(id)) continue;
    const value = Number(id.slice(3));
    if (Number.isSafeInteger(value)) maximum = Math.max(maximum, value);
  }
  return `EF-${maximum + 1}`;
}

export function summarizeDemo(
  orders: readonly DemoOrder[], products: readonly { category: string; active: boolean }[],
) {
  const totalCents = orders.reduce((sum, order) => sum + (validPrice(order.total) ? Math.round(order.total * 100) : 0), 0);
  const statusCounts = orderStatuses.map((status) => ({ status, count: orders.filter((order) => order.status === status).length }));
  const categoryMap = new Map<string, number>();
  for (const product of products) {
    if (product.active) categoryMap.set(product.category, (categoryMap.get(product.category) ?? 0) + 1);
  }
  const categoryCounts = [...categoryMap].map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
  return {
    total: totalCents / 100,
    pending: orders.filter((order) => order.status !== "Entregue").length,
    statusCounts,
    categoryCounts,
    activeProducts: products.filter((product) => product.active).length,
  };
}
