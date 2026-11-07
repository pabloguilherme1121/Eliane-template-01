import assert from 'node:assert/strict';
import test from 'node:test';
import { catalogCardWidth } from '../lib/layout.ts';
import { parseBRLPrice } from '../lib/currency.ts';

test('cards do catálogo cabem em telas de 280 a 1440 px', () => {
  for (const screenWidth of [280, 320, 360, 390, 768, 1024, 1440]) {
    const cardWidth = catalogCardWidth(screenWidth);
    assert.ok(cardWidth > 90, `card muito estreito a ${screenWidth}px`);
    assert.ok(cardWidth * 2 + 12 + 36 <= screenWidth, `overflow a ${screenWidth}px`);
  }
});

test('preço em reais interpreta decimal de ponto e vírgula sem perder centavos', () => {
  assert.equal(parseBRLPrice('12.34'), 12.34);
  assert.equal(parseBRLPrice('12,34'), 12.34);
  assert.equal(parseBRLPrice('1.234,56'), 1234.56);
  assert.equal(parseBRLPrice('1,234.56'), 1234.56);
  assert.equal(parseBRLPrice('R$ 189,90'), 189.90);
});

test('preço rejeita números inválidos e valores não positivos', () => {
  for (const input of ['abc', '', '0', '-3,00', 'NaN', '12,3456', 'R$ Infinity']) assert.equal(parseBRLPrice(input), null);
});
