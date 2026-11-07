import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { products } from "../lib/catalog.ts";

const outputDirectory = resolve(process.argv[2] ?? "dist-web-check");
const expectedPages = ["index.html", ...products.map(({ id }) => `product/${id}.html`)];

for (const page of expectedPages) {
  assert.ok(existsSync(resolve(outputDirectory, page)), `Página estática não gerada: ${page}`);
}
console.log(`Export verificado: ${expectedPages.length} páginas essenciais encontradas.`);
