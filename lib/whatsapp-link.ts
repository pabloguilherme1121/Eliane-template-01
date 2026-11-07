/** Link oficial para consulta, sem inserir dados sensíveis em logs. */
export function buildWhatsAppUrl(number: string, message: string): string {
  if (!/^\d{10,15}$/.test(number)) {
    throw new Error("Número de atendimento inválido");
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
