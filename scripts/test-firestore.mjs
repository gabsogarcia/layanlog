import { getAdminFirestore } from '../src/firebase-admin.mjs';
import { createFirestoreStore } from '../src/firestore.mjs';
import { processInput } from '../src/core.mjs';
import { classifyWithKie } from '../src/luna.mjs';

const store = createFirestoreStore(getAdminFirestore());
const id = `teste-real-${Date.now()}`;
const steps = [
  ['cumprimento', { kind: 'text', value: 'oi, boa tarde', source: 'firestore-1' }],
  ['CPF válido', { kind: 'text', value: 'Meu CPF é 52998224725', source: 'firestore-2' }],
  ['placa Mercosul', { kind: 'text', value: 'ABC1D23', source: 'firestore-3' }],
  ['conflito de CPF', { kind: 'text', value: 'CPF alternativo 73381276620', source: 'firestore-4' }],
  ['CPF inválido', { kind: 'text', value: 'CPF 52998224724', source: 'firestore-5' }]
];
for (const [label, input] of steps) {
  const result = await processInput({ store, cadastroId: id, motoristaId: 'telefoneTeste:+5500000000000', input, classifier: x => classifyWithKie(x) });
  const doc = await store.get(id);
  console.log(JSON.stringify({ label, latencyMs: result.latencyMs, extracted: result.extracted, conflict: result.conflict ?? null, error: result.erro?.message ?? null, fields: Object.fromEntries(Object.entries(doc.campos).map(([k, v]) => [k, v.valor])), historyCount: doc.historicoBruto.length, conflictCount: doc.conflitos.length, status: doc.status }));
}
console.log(JSON.stringify({ cadastroId: id, document: await store.get(id) }, null, 2));
