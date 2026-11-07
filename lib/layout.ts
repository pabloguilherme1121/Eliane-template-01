/** Grid de duas colunas, com respiro lateral de 18px e intervalo de 12px. */
export function catalogCardWidth(screenWidth: number) {
  const width = Number.isFinite(screenWidth) ? Math.max(240, screenWidth) : 320;
  return Math.min(220, (width - 36 - 12) / 2);
}


/** A mesma grade é usada no catálogo e nos favoritos, respeitando o contêiner de até 1000px. */
export function productGridLayout(screenWidth: number): { columns: number; cardWidth: number } {
  const viewport = Number.isFinite(screenWidth) ? Math.max(280, screenWidth) : 320;
  const columns = viewport >= 960 ? 4 : viewport >= 640 ? 3 : 2;
  const available = Math.min(viewport, 1000) - 36;
  const cardWidth = Math.floor(Math.min(220, (available - 12 * (columns - 1)) / columns));
  return { columns, cardWidth };
}

/** Reduz o recorte principal em celulares sem aumentar indefinidamente no desktop. */
export function productDetailImageHeight(screenWidth: number): number {
  const viewport = Number.isFinite(screenWidth) ? Math.max(280, screenWidth) : 320;
  return Math.max(280, Math.min(520, Math.round((Math.min(viewport, 760) - 36) * 1.05)));
}
