/** Grid de duas colunas, com respiro lateral de 18px e intervalo de 12px. */
export function catalogCardWidth(screenWidth: number) {
  const width = Number.isFinite(screenWidth) ? Math.max(240, screenWidth) : 320;
  return Math.min(220, (width - 36 - 12) / 2);
}
