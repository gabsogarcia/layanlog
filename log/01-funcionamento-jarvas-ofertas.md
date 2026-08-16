# Funcionamento da extensão JARVAS-OFERTAS

## Objetivo desta análise

Este documento descreve como a extensão em `ferramentas-internas/JARVAS-OFERTAS/extension` percorre páginas, preenche campos e escolhe automaticamente itens clicáveis. O foco é identificar os padrões que podem ser reaproveitados, com adaptações, em uma futura automação do fluxo de CT-e do Layan/Bsoft TMS.

## Visão geral

A extensão é uma extensão Chrome Manifest V3, escrita em JavaScript puro. Ela combina quatro camadas:

1. `popup.js` ou o painel JARVAS inicia um trabalho.
2. `service-worker.js` cria e acompanha a aba, injeta o minerador e coordena persistência/capturas.
3. `miner.js` roda dentro da página, identifica conteúdo e controles, preenche campos e clica para avançar.
4. `network-hook.js` observa respostas de `fetch`/XHR para localizar checkout, VSL e mídia que não aparecem claramente no DOM.

O `manifest.json` concede acesso amplo (`<all_urls>`) e permissões para abas, injeção de scripts, armazenamento, requisições e downloads. Isso viabiliza operar em funis compostos por vários domínios, mas aumenta o impacto de qualquer erro e exige escopo e validações rigorosos.

## Sequência de execução

### Início independente

O popup lê a aba ativa e envia `START_STANDALONE` ao service worker. O worker cria um objeto de trabalho em memória, associa-o à aba e injeta `miner.js` quando o carregamento termina.

### Início pelo painel JARVAS

`bridge.js` só reconhece páginas que tenham `<meta name="jarvas-panel" content="ofertas">`. Ele traduz mensagens entre o painel (`window.postMessage`) e o service worker (`chrome.runtime.sendMessage`). Ao receber `START_MINING`, o worker abre uma nova aba para o funil, registra IDs do painel e da aba minerada e inicia a injeção.

### Injeção e continuidade entre páginas

Antes do minerador, o worker substitui `window.open` para navegar na mesma aba. Links com `target` também são convertidos para `_self` por `miner.js`. Quando a aba termina uma navegação, `chrome.tabs.onUpdated` reinjeta o minerador. A trava `window.__jarvasMinerRunning` evita duas execuções simultâneas no mesmo documento.

## Como a extensão decide o que clicar

O núcleo está em `miner.js`.

### Universo de candidatos

`SELECTORS.clickableOptions` reúne:

- `button` e elementos com `role="button"`;
- inputs de submit/button;
- links sem navegação normal (`href="#"` ou `javascript:`);
- elementos com `onclick`;
- classes contendo termos como `option`, `btn`, `choice`, `answer` e `select`.

Para CTAs primários, o conjunto é mais simples: botões, elementos com papel de botão, submits e links.

### Filtro de visibilidade

Um candidato só é usado se:

- não estiver dentro da interface da própria extensão;
- tiver dimensões positivas;
- não estiver oculto por `display`, `visibility` ou `pointer-events`;
- não estiver desabilitado por propriedade ou `aria-disabled`.

### Priorização por palavras

`primaryAction()` procura textos normalizados contendo palavras como “continuar”, “avançar”, “seguinte”, “próximo”, “confirmar”, “começar”, “comprar”, “start” e “next”. Correspondência exata recebe prioridade, depois texto que começa/termina com o termo e, por último, ocorrência parcial.

### Fallback geométrico e semântico

Se não houver CTA reconhecido, `genericAction()` pontua os controles restantes. Links e elementos no topo/canto esquerdo recebem penalidade; controles largos, com texto útil ou classes ligadas a resposta/opção recebem preferência. Em telas com mais de um controle, o primeiro é ignorado como heurística contra botões de retorno.

### Proteção contra voltar

`isBackwardAction()` rejeita controles cujo texto, rótulo, classe, ID ou ação indiquem “voltar”, “back”, “previous” etc.; também detecta chamadas a `history.back()` e ícones pequenos sem texto no canto superior esquerdo.

### Clique e verificação de avanço

Antes do clique, o elemento é centralizado com `scrollIntoView`, a interface mostra um cursor visual e a etapa atual é persistida. Após `element.click()`, o minerador compara a impressão digital da tela a cada 500 ms, por até 10 segundos. Se nada mudar, o elemento entra em um `WeakSet` de ações rejeitadas e o minerador continua procurando mais abaixo.

Essa verificação pós-condição é o padrão mais importante para reaproveitar: clicar não é considerado sucesso; a automação precisa provar que o estado esperado apareceu.

## Como a extensão reconhece mudanças de tela

Cada etapa é extraída com:

- URL, título e headline;
- textos e botões visíveis;
- imagens e imagens de fundo;
- HTML do contêiner principal, limitado a 750.000 caracteres;
- campos e valores atuais;
- timestamp e tempo desde a etapa anterior.

A impressão digital (`screenFingerprint`) combina headline, textos, opções e URLs de imagens. Números voláteis, como percentuais e contadores em segundos, são normalizados. Se a impressão mudar, há uma nova etapa; se não mudar depois de um clique, a ação é tratada como ineficaz.

## Preenchimento automático

`fillForms()` percorre inputs de texto, email, telefone, número, data e textareas visíveis e vazios. O valor é escolhido por pistas em `name`, `type` e `placeholder`:

- email recebe um email fictício;
- telefone recebe um número fictício;
- dia/ano recebem partes de uma data fictícia;
- outros campos recebem um nome fictício.

Depois de atribuir `input.value`, a extensão dispara eventos `input` e `change` com propagação. Em selects vazios, escolhe a primeira opção habilitada com valor e dispara `change`.

Limitação importante: alterar `value` diretamente e emitir eventos funciona em formulários simples, mas pode falhar em componentes React/Vue controlados, máscaras, autocomplete assíncrono e widgets customizados. Uma automação do Layan deve preferir interação semelhante à humana (`focus`, digitação, seleção visível) e confirmar o valor aceito pelo componente.

## Conteúdo oculto e rolagem

O minerador tenta revelar CTAs ocultos por estilos, timers ou classes conhecidas. No modo `smart`, limita-se a elementos ligados a CTA/checkout/oferta; no modo `brute`, pode forçar visibilidade em toda a página. Um `MutationObserver` reaplica a lógica durante mudanças no DOM. Se nenhum botão for encontrado, percorre a página em saltos de aproximadamente 65% da altura da janela.

Esse comportamento é adequado para exploração de funis, mas não deve ser copiado literalmente para um sistema fiscal: revelar controles ocultos ou clicar genericamente pode ultrapassar validações e acionar operações indevidas.

## Persistência, rede e finalização

Antes de navegar, `PROGRESS` envia as etapas ao worker, com até três tentativas. O worker mescla etapas por URL, headline e primeiros textos. Ele também:

- captura screenshots quando a aba está ativa;
- baixa e envia imagens;
- detecta playlists `.m3u8` via `webRequest`;
- detecta checkout por domínio/padrão de URL e por eventos da UTMify;
- gera JSON, Markdown, timeline, manifesto e cópias da página final;
- no modo integrado, envia artefatos ao endpoint R2 configurado;
- no modo local, grava o resultado em `chrome.storage.local` e abre `result.html`.

O estado dos trabalhos (`jobs`) fica em memória no service worker. Se o worker for reiniciado, um trabalho em andamento pode ser perdido.

## O que reaproveitar para a automação do Layan

Reaproveitar como princípios:

- separar orquestração, interação na página e persistência;
- localizar por texto/rótulo/estrutura, nunca por coordenadas fixas;
- esperar carregamento e estado visível após cada ação;
- registrar tela, URL, ação, resultado e erro em cada passo;
- manter uma máquina de estados explícita e idempotente;
- preservar o progresso antes de avançar;
- usar dados de teste apenas em ambiente/fluxo autorizado;
- interromper antes de “Salvar”, “Emitir”, “Transmitir”, “Autorizar” ou qualquer ação fiscal final.

Não reaproveitar diretamente:

- clicar no primeiro controle genérico disponível;
- forçar a exibição de elementos ocultos;
- escolher a primeira opção de todo select;
- depender só de palavras amplas como “continuar”;
- alterar `value` por JavaScript sem validar máscaras e componentes;
- usar `<all_urls>` se a nova extensão puder ser restrita ao domínio do Layan;
- guardar credenciais no código, logs ou `chrome.storage.local` sem proteção apropriada.

## Arquitetura recomendada para a futura ferramenta

Para o CT-e, a automação deve ser determinística e orientada a estados, por exemplo:

1. `lista_cte`
2. `modal_adicionar`
3. `selecao_preenchimento_manual`
4. `dados_basicos`
5. `dados_frete`
6. `revisao_pronta`
7. parada obrigatória antes de salvar/emitir/transmitir

Cada estado deve declarar:

- URL ou modal esperado;
- campos obrigatórios e seus seletores/rótulos;
- validações de entrada;
- ação permitida;
- evidência de sucesso;
- estratégia de retry limitada;
- condição de parada segura.

## Riscos técnicos observados

- Seletores baseados em classes parciais podem gerar falsos positivos.
- O fallback que ignora o primeiro controle assume um layout de quiz e não é generalizável.
- O clique programático pode não reproduzir todos os eventos de usuário confiável.
- O service worker pode perder o mapa de trabalhos ao ser suspenso/reiniciado.
- Permissões amplas aumentam a superfície de acesso a dados.
- Uploads e capturas podem incluir dados pessoais presentes na página.
- Ausência de um limite semântico forte antes de compras/emissões exige barreiras específicas na nova ferramenta.

## Arquivos consultados

- `extension/manifest.json`
- `extension/miner.js`
- `extension/service-worker.js`
- `extension/bridge.js`
- `extension/network-hook.js`
- `extension/popup.js`
- `extension/result.js`
- `extension/README.md`

