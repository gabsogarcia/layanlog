import { createMemoryStore } from '../src/firestore.mjs';
import { processInput } from '../src/core.mjs';

const store = createMemoryStore();
const cpf = '52998224725';
const classifier = async input => {
  if (input.kind === 'image') return { campo_identificado: 'cnhFoto', valor_extraido: input.value, confianca_textual: 'media', observacao: 'imagem de teste' };
  if (/^oi|boa tarde/i.test(input.value)) return { campo_identificado: 'nao_identificado', valor_extraido: null, confianca_textual: 'alta', observacao: null };
  if (/73381276620/.test(input.value)) return { campo_identificado: 'cpf', valor_extraido: '73381276620', confianca_textual: 'alta', observacao: null };
  if (/52998224725/.test(input.value)) return { campo_identificado: 'cpf', valor_extraido: cpf, confianca_textual: 'alta', observacao: null };
  if (/52998224724/.test(input.value)) return { campo_identificado: 'cpf', valor_extraido: '52998224724', confianca_textual: 'alta', observacao: null };
  if (/ABC1D23/.test(input.value)) return { campo_identificado: 'placa', valor_extraido: 'ABC1D23', confianca_textual: 'alta', observacao: null };
  return { campo_identificado: 'nao_identificado', valor_extraido: null, confianca_textual: 'baixa', observacao: null };
};
const steps = [
  { label: 'cumprimento', input: { kind: 'text', value: 'oi, boa tarde', source: 'teste-1' } },
  { label: 'CPF válido', input: { kind: 'text', value: `Meu CPF é ${cpf}`, source: 'teste-2' } },
  { label: 'placa Mercosul', input: { kind: 'text', value: 'ABC1D23', source: 'teste-3' } },
  { label: 'conflito de CPF', input: { kind: 'text', value: 'CPF alternativo 73381276620', source: 'teste-4' } },
  { label: 'foto CNH', input: { kind: 'image', value: 'https://example.com/cnh-ficticia.png', source: 'teste-5' } },
  { label: 'CPF inválido', input: { kind: 'text', value: 'CPF 52998224724', source: 'teste-6' } }
];
for (const [index, step] of steps.entries()) {
  const before = await store.get('teste-telefone');
  const result = await processInput({ store, cadastroId: 'teste-telefone', motoristaId: 'telefoneTeste:+5500000000000', input: step.input, classifier });
  const after = await store.get('teste-telefone');
  console.log(`\n[${index + 1}] ${step.label}`);
  console.log('ANTES', JSON.stringify(before));
  console.log('DEPOIS', JSON.stringify(after));
  console.log('EVENTO', JSON.stringify({ extracted: result.extracted, conflito: result.conflict, erro: result.erro?.message, latencyMs: result.latencyMs }));
}
