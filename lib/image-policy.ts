/** Evita URLs injetadas e chamadas para as imagens que não vieram no pacote. */
export function canRequestCatalogImage(input: unknown): boolean {
  if (typeof input !== 'string') return false;
  const uri = input.trim();
  if (!uri || uri.startsWith('/manus-storage/')) return false;
  if (uri.startsWith('/')) return !uri.startsWith('//') && !/[?#]/.test(uri) && !uri.includes('..');
  try {
    const parsed = new URL(uri);
    return parsed.protocol === 'https:' && !!parsed.hostname;
  } catch {
    return false;
  }
}
