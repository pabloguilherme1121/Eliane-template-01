/** Regras puras de sacola. Nunca confiar em dados restaurados de armazenamento local. */
export type CartLine = { productId: string; size: string; quantity: number };
export type CatalogItem = { id: string; name?: string; price: number; sizes: readonly string[] };
export const MAX_LINE_QUANTITY = 20; // Limite técnico da demo, não representa estoque real.
export const MAX_CART_LINES = 100;
export const MAX_STORED_CHARS = 200_000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
const validQuantity = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0;
const clampQuantity = (value: number) => Math.min(MAX_LINE_QUANTITY, value);

export function restoreSelection(raw: string | null, catalog: readonly CatalogItem[]): { favorites: string[]; cart: CartLine[] } {
  if (!raw || raw.length > MAX_STORED_CHARS) return { favorites: [], cart: [] };
  try {
    const data: unknown = JSON.parse(raw);
    if (!isRecord(data)) return { favorites: [], cart: [] };
    const byId = new Map(catalog.map((item) => [item.id, item]));
    const favorites = Array.isArray(data.favorites)
      ? [...new Set(data.favorites.filter((id): id is string => typeof id === "string" && byId.has(id))) ]
      : [];
    const cart: CartLine[] = [];
    const indexes = new Map<string, number>();
    if (Array.isArray(data.cart)) {
      for (const entry of data.cart) {
        if (!isRecord(entry) || typeof entry.productId !== "string" || typeof entry.size !== "string") continue;
        const product = byId.get(entry.productId);
        if (!product || !product.sizes.includes(entry.size) || !validQuantity(entry.quantity)) continue;
        const key = JSON.stringify([entry.productId, entry.size]);
        const index = indexes.get(key);
        if (index !== undefined) cart[index] = { ...cart[index], quantity: clampQuantity(cart[index].quantity + entry.quantity) };
        else if (cart.length < MAX_CART_LINES) {
          indexes.set(key, cart.length);
          cart.push({ productId: entry.productId, size: entry.size, quantity: clampQuantity(entry.quantity) });
        }
      }
    }
    return { favorites, cart };
  } catch {
    return { favorites: [], cart: [] };
  }
}

export function addCartLine(cart: readonly CartLine[], product: CatalogItem, size: string): CartLine[] {
  if (!product.sizes.includes(size)) return [...cart];
  const existing = cart.find((line) => line.productId === product.id && line.size === size);
  if (!existing) return cart.length >= MAX_CART_LINES ? [...cart] : [...cart, { productId: product.id, size, quantity: 1 }];
  return cart.map((line) => line === existing ? { ...line, quantity: clampQuantity(line.quantity + 1) } : line);
}

export function setCartLineQuantity(cart: readonly CartLine[], productId: string, size: string, quantity: number): CartLine[] {
  if (!Number.isSafeInteger(quantity)) return [...cart];
  if (quantity <= 0) return cart.filter((line) => !(line.productId === productId && line.size === size));
  return cart.map((line) => line.productId === productId && line.size === size
    ? { ...line, quantity: clampQuantity(quantity) }
    : line);
}

export function calculateSubtotal(cart: readonly CartLine[], catalog: readonly CatalogItem[]): number {
  const byId = new Map(catalog.map((product) => [product.id, product]));
  const cents = cart.reduce((sum, line) => {
    const item = byId.get(line.productId);
    if (!item || !item.sizes.includes(line.size) || !validQuantity(line.quantity) || !Number.isFinite(item.price) || item.price < 0) return sum;
    return sum + Math.round(item.price * 100) * clampQuantity(line.quantity);
  }, 0);
  return cents / 100;
}

export function buildOrderMessage(cart: readonly CartLine[], catalog: readonly CatalogItem[]): string {
  const byId = new Map(catalog.map((product) => [product.id, product]));
  const lines = cart.flatMap((line) => {
    const item = byId.get(line.productId);
    if (!item || !item.sizes.includes(line.size) || !validQuantity(line.quantity)) return [];
    const itemTotal = (Math.round(item.price * 100) * clampQuantity(line.quantity)) / 100;
    const price = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(itemTotal);
    return [`• ${clampQuantity(line.quantity)}x ${item.name ?? item.id} (tam. ${line.size}) — ${price}`];
  });
  const total = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(calculateSubtotal(cart, catalog));
  return `Olá! Vim pelo catálogo Eliane Fashion e gostaria de confirmar a disponibilidade e entrega destes itens:\n${lines.join("\n")}\nSubtotal: ${total}. O frete e a forma de pagamento serão confirmados no atendimento.`;
}
