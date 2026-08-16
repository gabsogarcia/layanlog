# Prompt para projetar a automação de CT-e

Copie o prompt abaixo para o agente de desenvolvimento quando for iniciar a implementação.

---

Você é um engenheiro sênior de automação web, extensões Chrome Manifest V3 e sistemas fiscais brasileiros. Analise integralmente estes dois documentos:

1. `ferramentas-internas/layanlog/log/01-funcionamento-jarvas-ofertas.md`
2. `ferramentas-internas/layanlog/log/02-processo-emissao-cte-layan.md`

Também inspecione o código existente em `ferramentas-internas/JARVAS-OFERTAS/extension`, especialmente `manifest.json`, `miner.js`, `service-worker.js`, `bridge.js`, `popup.js` e `network-hook.js`.

## Objetivo

Projetar uma nova automação para o fluxo de criação de CT-e no Layan/Bsoft TMS. O operador deve selecionar previamente os parâmetros de negócio necessários e a ferramenta deve preencher o formulário de forma automática, orientada a estados e com validações fortes.

O sistema deve poder criar um CT-e de homologação quando explicitamente autorizado, mas o MVP deve parar antes de qualquer transmissão, autorização, contingência, averbação, cancelamento ou execução de operação perante a SEFAZ.

## O que você deve entregar

### 1. Comparação arquitetural

Explique, em uma tabela, o que pode ser reaproveitado da JARVAS-OFERTAS e o que deve ser substituído:

- service worker e orquestração;
- content script;
- popup/painel;
- máquina de estados;
- preenchimento de inputs e selects;
- widgets de pesquisa assíncrona;
- tratamento de máscaras monetárias;
- persistência e retomada;
- identificação de sucesso;
- tratamento de alertas nativos;
- limites de segurança.

Deixe claro por que as heurísticas de mineração — como clicar no primeiro elemento genérico, escolher a primeira opção de um select e forçar elementos ocultos — não são aceitáveis para um fluxo fiscal.

### 2. Fluxo determinístico

Modele uma máquina de estados completa, com pré-condição, ação, pós-condição, timeout, retry máximo e condição de parada para cada estado:

`LOGIN → LISTA_CTE → MENU_ADICIONAR → PREENCHIMENTO_MANUAL → DADOS_BASICOS → ENVOLVIDOS → MERCADORIAS → COMPOSICAO_FRETE → VALIDACAO → SALVAR_HOMOLOGACAO → CONFIRMAR_REGISTRO → PARAR_ANTES_SEFAZ`

Inclua os estados de recuperação para:

- sessão expirada;
- resultado de pesquisa vazio;
- múltiplos endereços para a mesma empresa;
- alerta nativo com campo obrigatório ausente;
- select que ainda não carregou opções;
- máscara que alterou o valor digitado;
- navegação inesperada;
- service worker reiniciado.

### 3. Contrato de dados

Defina um schema de entrada versionado para o CT-e, incluindo:

- ambiente (`homologacao` ou `producao`);
- agência e talão;
- remetente, destinatário, recebedor e expedidor;
- pagador do frete;
- CFOP da operação;
- documentos/mercadorias múltiplos;
- quantidade, peso, espécie, NCM e valores;
- regra de frete e valor do frete;
- motorista, veículo e vínculos opcionais;
- observações;
- política de transmissão (`sempre_bloquear` no MVP).

Para cada campo, informe tipo, obrigatoriedade, validação, origem (usuário, cadastro ou sistema) e seletor observado no documento do Layan. Trate explicitamente a duplicidade entre `dados_cfops_id` e `dados_merc_nCFOP[1]`.

### 4. Estratégia de seletores

Priorize nesta ordem:

1. `name`, `id` e rótulo semântico estável;
2. relação entre label e controle;
3. texto exato de opção;
4. atributos de acessibilidade;
5. seletor estrutural restrito ao bloco correto.

Não use coordenadas, índices de ícones, classes visuais frágeis ou “primeiro botão disponível”. Para cada seletor, proponha um fallback seguro e uma verificação de unicidade.

### 5. Pesquisa e seleção de cadastros

Descreva um helper genérico para widgets `pesquisa_*` + `dados_*`:

1. preencher o campo de pesquisa;
2. disparar a busca da forma esperada pelo componente;
3. aguardar opções;
4. comparar documento, razão social, UF, município, endereço e inscrição estadual;
5. selecionar somente se houver correspondência inequívoca;
6. interromper e pedir seleção humana se houver ambiguidade.

### 6. Validação pós-ação

Cada interação deve ter uma pós-condição observável. Exemplos:

- agência selecionada carregou talões;
- talão é exatamente `CT-e HOMOLOGAÇÃO`;
- pesquisa selecionou um `option` final, não apenas texto no input;
- totais de mercadoria foram recalculados;
- CFOP da operação e da mercadoria estão preenchidos;
- alerta nativo foi tratado;
- após salvar, a URL contém `inserido=<id>`;
- aparece `Conhecimento inserido com sucesso.`;
- o registro não tem status/chave SEFAZ;
- a automação parou antes de `Executar`.

### 7. Segurança fiscal

Projete bloqueios explícitos para qualquer texto/ação que contenha:

`Enviar para a SEFAZ`, `Executar`, `Enviar em Contingência`, `Averbar Carga`, `Cancelar CT-e`, `Carta de Correção`, `Emitir GNRE` e equivalentes.

O bloqueio deve existir no content script, no service worker e na interface. Não confie somente em esconder o botão. Explique como exigir confirmação humana específica se no futuro houver uma solicitação de transmissão.

### 8. Persistência e auditoria

Projete um registro de auditoria sem senha contendo:

- versão do schema;
- timestamp;
- estado atual;
- URL e título observados;
- ação realizada;
- pós-condição obtida;
- erros e tentativas;
- ID interno criado;
- confirmação de que a SEFAZ não foi acionada.

Mostre como retomar após reinício do service worker sem duplicar o CT-e. Inclua uma estratégia de idempotência e detecção de registro já criado.

### 9. Plano de implementação

Divida em fases pequenas e testáveis:

1. leitor de estado e login;
2. navegação até inclusão manual;
3. preenchimento de Dados Básicos;
4. helper de cadastros;
5. mercadorias e CFOP;
6. composição do frete;
7. validações e alertas;
8. salvamento apenas em homologação;
9. auditoria e retomada;
10. testes de regressão;
11. módulo de transmissão separado e desabilitado no MVP.

Para cada fase, liste arquivos, funções, testes e critérios de aceite.

### 10. Testes obrigatórios

Inclua testes para:

- sessão expirada;
- agência sem talão;
- talão de produção selecionado por engano;
- CNPJ sem cadastro;
- múltiplos endereços;
- CFOP ausente na mercadoria;
- valores monetários com máscara;
- múltiplas mercadorias;
- alerta nativo;
- recarregamento da página;
- reinício do service worker;
- botão SEFAZ pré-selecionado após salvar;
- tentativa de clicar em `Executar` bloqueada.

## Regras de resposta

- Não implemente ainda; primeiro entregue a análise e o plano.
- Não invente endpoints ou APIs internas que não estejam evidenciados.
- Diferencie fatos observados, inferências e hipóteses.
- Não inclua senhas, tokens ou dados pessoais reais no código, logs ou exemplos.
- Se um campo não puder ser identificado com segurança, marque-o como `REQUER CONFIRMAÇÃO`.
- Prefira uma automação determinística, auditável e orientada a estados à generalização heurística da JARVAS.
- O resultado deve ser suficientemente concreto para outro agente implementar sem repetir a investigação manual.

Formato final esperado: resumo executivo, tabela de reaproveitamento, máquina de estados, schema, mapa de seletores, regras de segurança, plano por fases, matriz de testes e riscos em aberto.

---

