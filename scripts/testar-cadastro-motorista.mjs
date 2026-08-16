import { getAdminFirestore } from '../src/firebase-admin.mjs';
import { createFirestoreStore } from '../src/firestore.mjs';
import { cadastrarMotoristaNoLayan } from '../src/layan-driver.mjs';

const store = createFirestoreStore(getAdminFirestore());
const cases = [
  { id: `driver-valido-${Date.now()}`, label: 'válido', cpf: '31415926590', nome: 'MOTORISTA HEADLESS TESTE', sobrenome: 'VALIDO', cep: '01001-000', estado: 'SP', cidadeId: '3550308', cidade: 'São Paulo', bairro: 'SÉ', logradouro: 'PRAÇA DA SÉ', numero: '1' },
  { id: `driver-duplicado-${Date.now()}`, label: 'CPF duplicado', cpf: '73381276620', nome: 'MOTORISTA DUPLICADO TESTE', sobrenome: 'DUPLICADO', cep: '01001-000', estado: 'SP', cidadeId: '3550308', cidade: 'São Paulo', bairro: 'SÉ', logradouro: 'PRAÇA DA SÉ', numero: '2' },
  { id: `driver-nome-vazio-${Date.now()}`, label: 'nome vazio', cpf: '79859835039', nome: '', sobrenome: 'SEM NOME', cep: '01001-000', estado: 'SP', cidadeId: '3550308', cidade: 'São Paulo', bairro: 'SÉ', logradouro: 'PRAÇA DA SÉ', numero: '3' }
];
const started = Date.now();
for (const item of cases) {
  await store.set(item.id, { id: item.id, payload: item, status: 'aguardando_layan', criadoEm: new Date().toISOString() });
  const result = await cadastrarMotoristaNoLayan(item);
  await store.set(item.id, result.sucesso ? { status: 'cadastrado', layanMotoristaId: result.layanMotoristaId, resultadoLayan: result, atualizadoEm: new Date().toISOString() } : { status: 'atencao_manual', falhaLayan: result, atualizadoEm: new Date().toISOString() });
  console.log(JSON.stringify({ caso: item.label, cadastroId: item.id, resultado: result }));
}
console.log(JSON.stringify({ tempoTotalMs: Date.now() - started, cadastroIds: cases.map(x => x.id) }));
