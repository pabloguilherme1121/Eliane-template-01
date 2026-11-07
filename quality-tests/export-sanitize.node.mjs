import assert from 'node:assert/strict';
import test from 'node:test';
import { escapeReportHtml, escapeSpreadsheetValue } from '../lib/export-sanitize.ts';

test('relatório HTML neutraliza marcação de campos locais', () => {
  assert.equal(escapeReportHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
  assert.equal(escapeReportHtml('C&A "Moda"'), 'C&amp;A &quot;Moda&quot;');
});

test('CSV impede fórmulas iniciadas por =, +, - e @', () => {
  for (const value of ['=HYPERLINK("https://evil.example")', '+SUM(A1)', '-cmd', '@SUM(A1)', '  =SUM(A1)']) {
    const escaped = escapeSpreadsheetValue(value);
    assert.ok(escaped.startsWith("'"), `célula insegura: ${value}`);
  }
  assert.equal(escapeSpreadsheetValue('Pedido EF-1'), 'Pedido EF-1');
});
