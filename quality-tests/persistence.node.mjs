import assert from "node:assert/strict";
import test from "node:test";
import { createLatestWriteQueue, readStoredSelection } from "../lib/persistence.ts";

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
