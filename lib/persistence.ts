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
