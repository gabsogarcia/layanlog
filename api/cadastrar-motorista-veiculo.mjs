import { getAdminFirestore } from '../src/firebase-admin.mjs';
import { createFirestoreStore } from '../src/firestore.mjs';
import { cadastrarMotoristaNoLayan, cadastrarVeiculoNoLayan } from '../src/layan-driver.mjs';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://cadastromotora.pages.dev');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method === 'GET') {
    const id = req.query?.id;
    if (!id) return res.status(400).json({ ok: false, erro: 'Informe id' });
    const doc = await createFirestoreStore(getAdminFirestore()).get(id);
    return doc ? res.status(200).json(doc) : res.status(404).json({ ok: false, erro: 'Cadastro não encontrado' });
  }
  if (req.method !== 'POST') return res.status(405).json({ ok: false, erro: 'Método não permitido' });
  const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  if (payload?.modoMock === true) {
    return res.status(200).json({ ok: true, modoMock: true, cadastroId: 'mock-cloudflare', etapas: [
      { etapa: 'firestore', status: 'concluida', mensagem: 'Gravando no Firestore (simulação)' },
      { etapa: 'motorista', status: 'concluida', mensagem: 'Motorista cadastrado no Layan (simulação)', resultado: { sucesso: true, layanMotoristaId: 'MOCK-MOTORISTA' } },
      { etapa: 'veiculo', status: 'concluida', mensagem: 'Veículo cadastrado no Layan (simulação)', resultado: { sucesso: true, layanVeiculoId: 'MOCK-VEICULO' } },
      { etapa: 'concluido', status: 'concluida', mensagem: 'Concluído — nenhum dado real foi gravado' }
    ] });
  }
  const id = `web-${Date.now()}`;
  const store = createFirestoreStore(getAdminFirestore());
  const etapas = [{ etapa: 'firestore', status: 'concluida', mensagem: 'Gravando no Firestore' }];
  await store.set(id, { id, payload, status: 'processando', etapas, criadoEm: new Date().toISOString() });
  const processar = async () => {
  const motorista = await cadastrarMotoristaNoLayan(payload.motorista, { timeoutMs: 10000 });
  etapas.push({ etapa: 'motorista', status: motorista.sucesso ? 'concluida' : 'falhou', resultado: motorista });
  if (!motorista.sucesso) { await store.set(id, { status: 'falha_motorista', etapas, atualizadoEm: new Date().toISOString() }); return { ok: false, cadastroId: id, etapas }; }
  const veiculo = await cadastrarVeiculoNoLayan({ ...payload.veiculo, proprietarioNome: payload.motorista.nome, motoristaNome: payload.motorista.nome }, { timeoutMs: 10000 });
  etapas.push({ etapa: 'veiculo', status: veiculo.sucesso ? 'concluida' : 'falhou', resultado: veiculo });
  const status = veiculo.sucesso ? 'concluido' : 'falha_veiculo';
  await store.set(id, { status, layanMotoristaId: motorista.layanMotoristaId, layanVeiculoId: veiculo.layanVeiculoId ?? null, etapas, atualizadoEm: new Date().toISOString() });
  return { ok: veiculo.sucesso, cadastroId: id, etapas };
  };
  if (payload?.assíncrono === true || payload?.assincrono === true) {
    // O pedido fica persistido antes da resposta; o cliente consulta GET?id=...
    processar().catch(async error => { await store.set(id, { status: 'erro_ao_processar', erro: error.message, atualizadoEm: new Date().toISOString() }); });
    return res.status(202).json({ ok: true, assíncrono: true, cadastroId: id, status: 'processando' });
  }
  const result = await processar();
  return res.status(result.ok ? 200 : 422).json(result);
}
