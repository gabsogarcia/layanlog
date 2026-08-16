# Layanlog — Parte 1: Firestore + Luna

Este módulo implementa somente o núcleo de extração e persistência. Não há WhatsApp/Evolution API, cadastro no Layan ou painel.

## Como rodar o teste isolado

```bash
npm install
npm run test:core
```

## Firestore real

O adaptador Admin usa `GOOGLE_APPLICATION_CREDENTIALS` apontando para uma
service account local. O JSON nunca deve ser copiado para este diretório ou
versionado. Para testar e inspecionar:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/caminho/layanlog-service-account.json"
export KIE_API_KEY="sua-chave-kie"
npm run test:firestore
npm run inspect:firestore
```

`historicoBruto` e `conflitos` permanecem como arrays no documento nesta
primeira versão, pois o fluxo atual é pequeno e isso mantém a leitura do
cadastro atômica e simples no console. Se o histórico crescer muito, a
migração para subcoleções deve ser feita antes do painel.

### Padrão para buscas assíncronas do Layan

Campos legados de busca (CEP, grupo, categoria, cidade e similares) devem
ser preenchidos com digitação real (`pressSequentially`) e, em seguida, com
eventos `input`, `change` e `blur`, antes de `Enter`. O driver deve aguardar
a opção retornada no `<select>` associado. Para nomes de cidade, a seleção
deve preferir correspondência exata normalizada antes de uma parcial. Para
pessoas e empresas, nunca escolher apenas por nome: a futura automação deve
desambiguar por CPF/CNPJ e parar quando houver múltiplos candidatos.

As opções de cidades retornam no formato `UF - Cidade`. A busca por
`São Paulo` retornou `AM - São Paulo de Olivença`, `RN - São Paulo do
Potengi`, `RS - São Paulo das Missões` e `SP - São Paulo`; a normalização
remove o prefixo de UF antes de preferir a correspondência exata.

O teste usa `createMemoryStore`, portanto não grava no Firestore real. Cada passo imprime o documento antes/depois.

## Firestore real

A coleção é `cadastros/{cadastroId}`: um documento por cadastro em andamento. O identificador atual do teste é `telefoneTeste:+5500000000000`; depois pode ser substituído pelo identificador da conversa.

Campos do documento:

- `motoristaId`: identificador da conversa/motorista;
- `campos`: mapa extensível. Cada entrada guarda `valor`, `preenchidoEm`, `origem` e `confianca`;
- `historicoBruto`: todos os inputs na ordem, incluindo saudações, erros de API e falhas de validação;
- `conflitos`: valores antigo/novo, timestamps e origem, sem sobrescrita automática;
- `status`: `coletando`, `completo`, `com_conflito` ou `erro_ao_inserir`;
- `criadoEm` e `atualizadoEm`.

`TARGET_FIELDS` é uma lista explícita, mas o mapa `campos` não é rígido: novos campos podem ser adicionados sem alterar o documento.

Para conectar Firebase Admin, inicialize o SDK na aplicação e passe `createFirestoreStore(db)` para `processInput`. A chave Kie só é lida de `KIE_API_KEY`.

## Prompt enviado ao Luna

Está em `src/luna.mjs`, na constante `LUNA_PROMPT`. A resposta exigida é JSON com `campo_identificado`, `valor_extraido`, `confianca_textual` e `observacao`.

## Validação

CPF usa os dois dígitos verificadores reais. Placas aceitas antes da conversão para o formato do Layan:

- antigo: `/^[A-Z]{3}\d{4}$/` (`ABC1234`);
- Mercosul: `/^[A-Z]{3}\d[A-Z]\d{2}$/` (`ABC1D23`).

CNH e CRLV são armazenados sem validação forte nesta parte. Erros do Kie, JSON inválido e timeout viram evento no histórico e status `erro_ao_inserir`.

## Limitações

O teste usa um classificador Luna simulado para ser determinístico e não depender de chave externa. A chamada real está implementada em `classifyWithKie`, mas a latência real só pode ser medida com `KIE_API_KEY` configurada. Imagens são tratadas como URL de origem; o teste não envia documentos reais.
