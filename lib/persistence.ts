import { MAX_STORED_CHARS, restoreSelection, type CatalogItem } from "./cart-logic";

/**
 * Distingue ausência legítima de dados de armazenamento corrompido.
 * restoreSelection continua responsável por sanear itens e quantidades válidos.
 * Em caso de formato inesperado lançamos erro para não salvar estado vazio
 * sobre o conteúdo anterior.
 */
export function parsePersistedSelection(
  raw: string | null,
  catalog: readonly CatalogItem[],
): ReturnType<typeof restoreSelection> {
  if (raw === null) return { favorites: [], cart: [] };
  if (!raw.length || raw.length > MAX_STORED_CHARS) throw new Error("Seleção local inválida ou muito grande");

  const data: unknown = JSON.parse(raw);
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Formato de seleção local inválido");
  }
  const selection = data as Record<string, unknown>;
  if (!Array.isArray(selection.favorites) || !Array.isArray(selection.cart)) {
    throw new Error("Campos da seleção local inválidos");
  }
  return restoreSelection(raw, catalog);
}

/**
 * Guarda apenas o estado mais recente quando o usuário altera favoritos ou
 * quantidades rapidamente. Gravações nunca executam em paralelo.
 */
export function createLatestWriteQueue(
  write: (snapshot: string) => Promise<void>,
  onError: (error: unknown) => void = () => {},
): (snapshot: string) => Promise<void> {
  let pending: string | undefined;
  let running: Promise<void> | null = null;

  return (snapshot: string): Promise<void> => {
    pending = snapshot;
    if (running === null) {
      running = Promise.resolve().then(async () => {
        try {
          while (pending !== undefined) {
            const next = pending;
            pending = undefined;
            try {
              await write(next);
            } catch (error) {
              onError(error);
            }
          }
        } finally {
          running = null;
        }
      });
    }
    return running;
  };
}

/**
 * Se o armazenamento falhar na leitura, não sobrescrevemos a seleção existente
 * com um estado vazio. O app pode continuar em modo de sessão não persistida.
 */
export async function readStoredSelection<T>(
  read: () => Promise<string | null>,
  parse: (raw: string | null) => T,
): Promise<{ ok: true; selection: T } | { ok: false }> {
  try {
    return { ok: true, selection: parse(await read()) };
  } catch {
    return { ok: false };
  }
}
