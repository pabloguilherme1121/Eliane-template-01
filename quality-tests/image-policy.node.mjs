import assert from 'node:assert/strict';
import test from 'node:test';
import { canRequestCatalogImage } from '../lib/image-policy.ts';

test('não dispara requisições para caminhos Manus que não foram enviados com a loja', () => {
 assert.equal(canRequestCatalogImage('/manus-storage/async-images/not-in-zip/image.webp'),false);
 assert.equal(canRequestCatalogImage('  /manus-storage/async-images/a/b.webp '),false);
 assert.equal(canRequestCatalogImage(''),false);
 assert.equal(canRequestCatalogImage('   '),false);
});

test('aceita imagens locais publicadas e fontes HTTPS válidas',()=>{
 assert.equal(canRequestCatalogImage('/catalogo/vestido-viva.webp'),true);
 assert.equal(canRequestCatalogImage('https://cdn.exemplo.com/vestido.webp'),true);
 assert.equal(canRequestCatalogImage('javascript:alert(1)'),false);
 assert.equal(canRequestCatalogImage('data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='),false);
 assert.equal(canRequestCatalogImage('http://site-inseguro.com/foto.jpg'),false);
});
