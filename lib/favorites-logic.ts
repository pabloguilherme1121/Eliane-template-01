/** Alterna favoritos sem mutar a seleção anterior e informa o resultado real do toque. */
export function toggleFavoriteSelection(
  current: readonly string[],
  productId: string,
): { favorites: string[]; added: boolean } {
  const exists = current.includes(productId);
  return {
    favorites: exists ? current.filter((id) => id !== productId) : [...current, productId],
    added: !exists,
  };
}
