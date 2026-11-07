/** Busca do catálogo tolerante a caixa, acentos e múltiplos espaços. */
export function normalizeCatalogSearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ');
}
export function matchesCatalogQuery(
  item: {name:string; category:string; color:string; description?:string}, query: string,
):boolean {
  const needle = normalizeCatalogSearch(query);
  if (!needle) return true;
  const haystack=normalizeCatalogSearch(`${item.name} ${item.category} ${item.color} ${item.description ?? ''}`);
  return haystack.includes(needle);
}
