import { validateField } from './validation.mjs';

export const TARGET_FIELDS = ['nome','cpf','cnhFoto','cnhNumero','placa','crlvFoto'];
export const STATUSES = ['coletando','completo','com_conflito','erro_ao_inserir'];
const now = () => new Date().toISOString();

export function emptyCadastro(id, motoristaId) {
  return { id, motoristaId, campos: {}, historicoBruto: [], conflitos: [], status: 'coletando', criadoEm: now(), atualizadoEm: now() };
}

export async function ensureCadastro(store, id, motoristaId) {
  const current = await store.get(id); if (current) return current;
  const doc = emptyCadastro(id, motoristaId); await store.set(id, doc); return doc;
}

export async function processInput({ store, cadastroId, motoristaId, input, classifier }) {
  const started = Date.now();
  let doc = await ensureCadastro(store, cadastroId, motoristaId);
  const raw = { recebidoEm: now(), tipo: input.kind, valor: input.value, origem: input.source ?? null, resultado: null, erro: null };
  try {
    const extracted = await classifier(input);
    raw.resultado = extracted;
    if (extracted.campo_identificado === 'nao_identificado') { raw.motivo = 'conteúdo sem campo cadastral'; await store.append(cadastroId, 'historicoBruto', raw); return { doc: await store.get(cadastroId), extracted, latencyMs: Date.now()-started }; }
    const field = extracted.campo_identificado;
    const check = validateField(field, extracted.valor_extraido);
    if (!check.ok) { raw.validacao = { ok: false, motivo: check.reason }; await store.append(cadastroId, 'historicoBruto', raw); return { doc: await store.get(cadastroId), extracted, latencyMs: Date.now()-started }; }
    const current = doc.campos?.[field];
    if (current && current.valor !== check.value) {
      const conflict = { campo: field, valorAnterior: current.valor, preenchidoAnteriorEm: current.preenchidoEm, novoValor: check.value, recebidoEm: raw.recebidoEm, origem: input.source ?? null };
      await store.append(cadastroId, 'conflitos', conflict);
      raw.validacao = { ok: true }; raw.conflito = true;
      await store.append(cadastroId, 'historicoBruto', raw); await store.set(cadastroId, { status: 'com_conflito', atualizadoEm: now() });
      return { doc: await store.get(cadastroId), extracted, conflict, latencyMs: Date.now()-started };
    }
    raw.validacao = { ok: true }; await store.append(cadastroId, 'historicoBruto', raw);
    await store.set(cadastroId, { campos: { ...(doc.campos ?? {}), [field]: { valor: check.value, preenchidoEm: raw.recebidoEm, origem: input.source ?? input.value, confianca: extracted.confianca_textual } }, atualizadoEm: now() });
    doc = await store.get(cadastroId);
    const complete = TARGET_FIELDS.every(name => doc.campos?.[name]);
    await store.set(cadastroId, { status: complete ? 'completo' : (doc.status === 'com_conflito' ? 'com_conflito' : 'coletando') });
    return { doc: await store.get(cadastroId), extracted, latencyMs: Date.now()-started };
  } catch (error) {
    raw.erro = { mensagem: error.message, tipo: error.name }; await store.append(cadastroId, 'historicoBruto', raw); await store.set(cadastroId, { status: 'erro_ao_inserir', atualizadoEm: now() });
    return { doc: await store.get(cadastroId), erro: error, latencyMs: Date.now()-started };
  }
}
