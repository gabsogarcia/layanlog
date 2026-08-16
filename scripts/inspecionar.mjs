import { getAdminFirestore } from '../src/firebase-admin.mjs';

const snap = await getAdminFirestore().collection('cadastros').get();
if (snap.empty) { console.log('Nenhum cadastro encontrado.'); process.exit(0); }
for (const doc of snap.docs) {
  const data = doc.data();
  console.log(JSON.stringify({ id: doc.id, motoristaId: data.motoristaId, status: data.status, campos: data.campos, historico: data.historicoBruto?.length ?? 0, conflitos: data.conflitos?.length ?? 0, atualizadoEm: data.atualizadoEm }, null, 2));
}
