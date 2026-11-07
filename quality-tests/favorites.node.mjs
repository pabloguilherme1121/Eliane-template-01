import assert from "node:assert/strict";
import test from "node:test";
import { toggleFavoriteSelection } from "../lib/favorites-logic.ts";

test("toques rápidos alternam favorito conforme o estado mais atual", () => {
  let favorites = [];
  let result = toggleFavoriteSelection(favorites, "vestido-viva");
  favorites = result.favorites;
  assert.deepEqual(favorites, ["vestido-viva"]);
  assert.equal(result.added, true);

  result = toggleFavoriteSelection(favorites, "vestido-viva");
  favorites = result.favorites;
  assert.deepEqual(favorites, []);
  assert.equal(result.added, false);

  result = toggleFavoriteSelection(favorites, "vestido-viva");
  assert.deepEqual(result.favorites, ["vestido-viva"]);
  assert.equal(result.added, true);
});

test("alternar uma peça não altera a seleção das demais nem muta o array anterior", () => {
  const previous = ["vestido-viva", "moletom-leve"];
  const result = toggleFavoriteSelection(previous, "vestido-viva");
  assert.deepEqual(result.favorites, ["moletom-leve"]);
  assert.deepEqual(previous, ["vestido-viva", "moletom-leve"]);
  assert.equal(result.added, false);
});
