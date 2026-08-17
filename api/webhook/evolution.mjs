import { getAdminFirestore } from '../../src/firebase-admin.mjs';
import { createFirestoreStore } from '../../src/firestore.mjs';
import { processInput } from '../../src/core.mjs';
import { classifyWithKie } from '../../src/luna.mjs';

const senderOf = event => event?.data?.key?.remoteJid?.split('@')[0] ?? event?.data?.key?.participant?.split('@')[0] ?? event?.key?.remoteJid?.split('@')[0] ?? null;
const instanceOf = event => event?.instance ?? event?.data?.instance ?? event?.data?.instanceName ?? null;
const messageOf = event => event?.data?.message ?? event?.message ?? {};
const textOf = event => { const m = messageOf(event); return m.conversation ?? m.extendedTextMessage?.text ?? event?.data?.body ?? null; };

async function mediaValue(event) {
  const direct = event?.data?.base64 ?? event?.base64;
  if (direct) return direct.startsWith('data:') ? direct : `data:image/jpeg;base64,${direct}`;
  const base = (process.env.EVOLUTION_API_URL || '').replace(/\/$/, ''); const key = process.env.EVOLUTION_API_KEY; const instance = instanceOf(event);
  if (!base || !key || !instance) throw new Error('EVOLUTION_API_URL, EVOLUTION_API_KEY ou instance ausente');
  const m = messageOf(event); const response = await fetch(`${base}/chat/getBase64FromMediaMessage/${encodeURIComponent(instance)}`, { method: 'POST', headers: { apikey: key, 'content-type': 'application/json' }, body: JSON.stringify({ message: { key: event?.data?.key ?? event?.key, message: m } }) });
  if (!response.ok) throw new Error(`Evolution mídia HTTP ${response.status}`); const body = await response.json(); const value = body.base64 ?? body.data?.base64;
  if (!value) throw new Error('Evolution não retornou base64 da mídia'); return value.startsWith('data:') ? value : `data:image/jpeg;base64,${value}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, erro: 'Método não permitido' });
  const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
  if (event.event && event.event !== 'MESSAGES_UPSERT') return res.status(202).json({ ok: true, ignorado: event.event });
  const sender = senderOf(event); if (!sender) return res.status(400).json({ ok: false, erro: 'remetente ausente' });
  const store = createFirestoreStore(getAdminFirestore()); const cadastroId = `whatsapp:${sender}`;
  res.status(202).json({ ok: true, recebido: true, cadastroId });
  try {
    const message = messageOf(event); const text = textOf(event); const hasMedia = Boolean(message.imageMessage || message.documentMessage || event?.data?.base64 || event?.base64);
    if (!text && !hasMedia) { await store.append(cadastroId, 'historicoBruto', { recebidoEm: new Date().toISOString(), tipo: 'unknown', valor: event, origem: 'evolution:MESSAGES_UPSERT', motivo: 'mensagem sem texto ou mídia' }); return; }
    const input = text ? { kind: 'text', value: text, source: 'evolution:MESSAGES_UPSERT' } : { kind: 'image', value: await mediaValue(event), source: 'evolution:MESSAGES_UPSERT' };
    await processInput({ store, cadastroId, motoristaId: sender, input, classifier: classifyWithKie });
  } catch (error) { console.error('[vercel-evolution-webhook]', error); await store.append(cadastroId, 'historicoBruto', { recebidoEm: new Date().toISOString(), tipo: 'erro_webhook', valor: null, origem: 'evolution:MESSAGES_UPSERT', erro: { mensagem: error.message } }); await store.set(cadastroId, { status: 'erro_ao_inserir', atualizadoEm: new Date().toISOString() }); }
}
