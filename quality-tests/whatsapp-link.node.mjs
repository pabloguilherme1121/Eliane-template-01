import assert from "node:assert/strict";
import test from "node:test";
import { buildWhatsAppUrl } from "../lib/whatsapp-link.ts";

test("mensagem de consulta preserva acentos, caracteres reservados e quebras de linha", () => {
  const message = "Olá! Vestido tamanho 40 & entrega?\nPreço: R$ 189,90";
  const url = new URL(buildWhatsAppUrl("5561991245746", message));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/5561991245746");
  assert.equal(url.searchParams.get("text"), message);
});

test("impede gerar URLs para números inválidos", () => {
  for (const number of ["", "abc", "55 61 99124 5746", "123", "1".repeat(16)]) {
    assert.throws(() => buildWhatsAppUrl(number, "Oi"), /número de atendimento inválido/i);
  }
});
