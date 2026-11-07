import assert from "node:assert/strict";
import test from "node:test";
import { createLatestWriteQueue, readStoredSelection } from "../lib/persistence.ts";
import { parsePersistedSelection } from "../lib/cart-logic.ts";

test("gravações concorrentes são serializadas e a seleção mais recente prevalece", async () => {
  const writes = [];
  let releaseFirst;
  let active = 0;
  let maxActive = 0;
  const save = createLatestWriteQueue(async (snapshot) => {
    active += 1;
    maxActive = Math.max(maxActive, active);
    writes.push(snapshot);
    if (snapshot === "primeiro") await new Promise((resolve) => { releaseFirst = resolve; });
    active -= 1;
  });
  const first = save("primeiro");
  await Promise.resolve();
  const intermediate = save("intermediário");
  const last = save("mais-recente");
  assert.deepEqual(writes, ["primeiro"]);
  releaseFirst();
  await Promise.all([first, intermediate, last]);
  assert.deepEqual(writes, ["primeiro", "mais-recente"]);
  assert.equal(maxActive, 1);
});

test("novas mudanças continuam sendo persistidas após esvaziar a fila", async () => {
  const writes = [];
  const save = createLatestWriteQueue(async (value) => { writes.push(value); });
  await save("primeiro");
  await save("segundo");
  assert.deepEqual(writes, ["primeiro", "segundo"]);
});

test("uma falha de escrita é relatada e não bloqueia a seleção seguinte", async () => {
  const writes = [];
  const errors = [];
  const save = createLatestWriteQueue(async (value) => {
    writes.push(value);
    if (value === "falha") throw new Error("sem espaço");
  }, (error) => { errors.push(error); });
  const failed = save("falha");
  await Promise.resolve();
  const success = save("recuperado");
  await Promise.all([failed, success]);
  assert.deepEqual(writes, ["falha", "recuperado"]);
  assert.equal(errors.length, 1);
  assert.match(String(errors[0]), /sem espaço/);
});

test("falha ao ler armazenamento impede interpretar o vazio como seleção carregada", async () => {
  const state = await readStoredSelection(async () => { throw new Error("armazenamento indisponível"); }, () => ({ cart: [], favorites: [] }));
  assert.deepEqual(state, { ok: false });
});

test("leitura bem-sucedida mantém o conteúdo original e valida a seleção", async () => {
  const state = await readStoredSelection(async () => '{"favorites":["vestido-viva"]}', (raw) => JSON.parse(raw));
  assert.deepEqual(state, { ok: true, selection: { favorites: ["vestido-viva"] } });
});

test("uma falha ao interpretar dados é tratada como leitura não confiável", async () => {
  const state = await readStoredSelection(async () => "{json", (raw) => JSON.parse(raw));
  assert.deepEqual(state, { ok: false });
});

test("dados salvos corrompidos ou em estrutura incorreta não são restaurados nem sobrescritos", async () => {
  const catalog = [{ id: "vestido-viva", price: 189.9, sizes: ["38", "40"] }];
  for (const raw of ['{json', '', 'null', '[]', '{"cart":"incorreto","favorites":[]}', '{"cart":[],"favorites":null}', 'x'.repeat(200_001)]) {
    const result = await readStoredSelection(async () => raw, (saved) => parsePersistedSelection(saved, catalog));
    assert.deepEqual(result, { ok: false }, "falha em " + raw.slice(0, 30));
  }
});

test("primeiro acesso sem dados continua válido; dados antigos válidos são normalizados", () => {
  const catalog = [{ id: "vestido-viva", price: 189.9, sizes: ["38", "40"] }];
  assert.deepEqual(parsePersistedSelection(null, catalog), { favorites: [], cart: [] });
  const input = JSON.stringify({ favorites: ["vestido-viva", "removido"], cart: [{ productId: "vestido-viva", size: "38", quantity: 2 }] });
  assert.deepEqual(parsePersistedSelection(input, catalog), { favorites: ["vestido-viva"], cart: [{ productId: "vestido-viva", size: "38", quantity: 2 }] });
});

test("estrutura válida com itens descartados é saneada, sem apagar toda a seleção", () => {
  const catalog = [{ id: "vestido-viva", price: 189.9, sizes: ["38", "40"] }];
  const input = JSON.stringify({ favorites: ["vestido-viva"], cart: [
    { productId: "vestido-viva", size: "99", quantity: 2 },
    { productId: "vestido-viva", size: "38", quantity: 3 }
  ] });
  assert.deepEqual(parsePersistedSelection(input, catalog), { favorites: ["vestido-viva"], cart: [{ productId: "vestido-viva", size: "38", quantity: 3 }] });
});

test("aviso de gravação é liberado após escrita posterior bem-sucedida", async () => {
  let warning = false;
  const attempts = [];
  const save = createLatestWriteQueue(
    async (snapshot) => {
      attempts.push(snapshot);
      if (snapshot === "falha") throw new Error("armazenamento lotado");
    },
    () => { warning = true; },
    () => { warning = false; }
  );
  await save("falha");
  assert.equal(warning, true);
  await save("nova seleção");
  assert.equal(warning, false);
  assert.deepEqual(attempts, ["falha", "nova seleção"]);
});
