export function createFirestoreStore(db) {
  return {
    async get(id) { const snap = await db.collection('cadastros').doc(id).get(); return snap.exists ? snap.data() : null; },
    async set(id, data) { await db.collection('cadastros').doc(id).set(data, { merge: true }); },
    async append(id, path, value) {
      const { FieldValue } = await import('firebase-admin/firestore');
      await db.collection('cadastros').doc(id).set({ [path]: FieldValue.arrayUnion(value) }, { merge: true });
    }
  };
}

export function createMemoryStore() {
  const docs = new Map();
  const clone = value => structuredClone(value);
  return {
    docs,
    async get(id) { return clone(docs.get(id) ?? null); },
    async set(id, data) { docs.set(id, { ...(docs.get(id) ?? {}), ...clone(data) }); },
    async append(id, path, value) {
      const doc = docs.get(id) ?? {}; doc[path] = [...(doc[path] ?? []), clone(value)]; docs.set(id, doc);
    }
  };
}
