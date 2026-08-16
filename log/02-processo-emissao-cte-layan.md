# Processo de criação de CT-e no Layan/Bsoft TMS

## Objetivo e escopo

Este documento registra o fluxo real observado em 16/08/2026 para criar manualmente um CT-e no Layan/Bsoft TMS. O teste foi feito com um talão de homologação, dados fictícios de carga e cadastros empresariais já existentes na conta.

O processo foi concluído somente até a criação do conhecimento dentro do Layan. Nenhuma ação de envio, autorização ou contingência da SEFAZ foi executada.

## Resultado do teste

- Registro interno criado: `1747`
- Número do conhecimento: `1`
- Talão: `CT-e HOMOLOGAÇÃO`
- Valor total da prestação: `R$ 100,00`
- Status fiscal: sem envio/autorização da SEFAZ
- Confirmação apresentada: `Conhecimento inserido com sucesso.`

Depois do salvamento, o sistema abriu automaticamente o painel de operações fiscais com a opção **Enviar para a SEFAZ** marcada. O botão **Executar** não foi acionado.

## Caminho visual

1. Acessar a rotina de CT-e:
   `https://layanlog.bsoft.app/versoes/versao5.0/rotinas/c.php?id=transp_cte&menu=s`
2. Clicar no ícone **Adicionar**.
3. No grupo de inclusão, clicar em **Preenchimento Manual**.
4. Preencher a aba **Dados Básicos**.
5. Clicar em **Avançar »**.
6. Preencher a aba **Dados do Frete**.
7. Clicar em **Salvar**.
8. Tratar validações apresentadas pelo navegador.
9. Confirmar a mensagem **Conhecimento inserido com sucesso** e o novo registro na grade.
10. Parar antes do botão **Executar** no painel da SEFAZ.

## URLs e estados observados

### Lista

`/versoes/versao5.0/rotinas/c.php?id=transp_cte&menu=s`

### Inclusão manual — dados básicos

`/versoes/versao5.0/rotinas/formulario.php?rotina=transp_cte&OP=O1&_qsf=1`

O caminho direto funcionou durante o teste, mas a automação deve preferir a navegação visual pela lista, pois parâmetros e regras de inicialização podem mudar.

### Inclusão manual — dados do frete

Após **Avançar**, a URL manteve `rotina=transp_cte&OP=O1` e acrescentou parâmetros de estado, como `passoSWU=N` e `message_collection_id`.

### Retorno após o salvamento

`/versoes/versao5.0/rotinas/carrega_rotina.php?...&id=transp_cte&inserido=1747...`

O parâmetro `inserido` identificou o registro criado. A evidência principal de sucesso foi a mensagem visível, não apenas a URL.

## Etapa 1 — autenticação

O sistema usa uma tela com:

- input de usuário com placeholder `Digite seu usuário aqui...`;
- input de senha com placeholder `Digite sua senha aqui...`;
- botão `Entrar`.

Após autenticação, uma sessão expirada pode devolver a página para a tela de login e descartar o formulário em andamento. Isso aconteceu uma vez durante o teste.

### Implicação para automação

A automação deve:

- detectar a tela de login antes de cada estado importante;
- nunca presumir que a sessão continua ativa;
- não persistir a senha em código, logs ou documentos;
- salvar um checkpoint local sem dados sensíveis antes de iniciar o formulário;
- ser capaz de reconstruir o formulário de modo idempotente após nova autenticação.

## Etapa 2 — abrir a inclusão manual

O botão **Adicionar** faz parte de uma barra de operações baseada em imagens/âncoras. Ele não navega diretamente: primeiro expande um grupo com quatro opções:

- Preenchimento Manual;
- Importar Arquivo XML de NF-e;
- Subcontratação através da importação de XML de CT-e;
- Redespacho através da importação de XML de CT-e.

Para o fluxo investigado foi usado **Preenchimento Manual**.

### Seletores recomendados

- ícone por `img[alt="Adicionar"]`, clicando no ancestral interativo;
- opção por texto exato `Preenchimento Manual`;
- confirmar a página pela presença de `CT-e - Inclusão` e do campo `dados_agencias_id`.

Não depender do índice do ícone na barra, pois a ordem e a disponibilidade das operações podem variar por permissão ou configuração.

## Etapa 3 — Dados Básicos

### Campos principais observados

| Rótulo | Nome do campo | Obrigatório | Comportamento |
| --- | --- | --- | --- |
| Agência | `dados_agencias_id` | Sim | Ao selecionar, carrega os talões disponíveis. |
| Talão | `dados_tiposTaloes_id` | Sim | Pode ser preenchido automaticamente após a agência. |
| Número | `dados_nroConhecimento` | Não | Vazio gera o número automaticamente. |
| Data de Emissão | `dados_dtEmissao` | Sim | Já veio com data e hora atuais. |
| Data de Previsão de Saída | `dados_dtPrevInicio` | Não no teste | Campo de data/hora. |
| Pedido/Cotação | `dados_pedidos_id` | Não no teste | Pesquisa assíncrona precedida por `pesquisa_pedidos_id`. |
| Vínculo com OC | `dados_ordensCarregamento_id` | Não no teste | Pesquisa assíncrona precedida por `pesquisa_ordensCarregamento_id`. |
| Vínculo com Manifesto | `dados_manifestoCargaTipo` | Não | Padrão `NA` = não vincular. |
| Vínculo com Viagem | `dados_acao_viagem` | Não | Padrão `N` = não vincular. |
| Vínculo com NF-e pré-cadastrada | `dados_notas_carregamento_id[1]` | Não no teste | Widget de pesquisa e select. |
| Identificação do Pedido | `dados_complementoPedido` | Não | Texto livre. |
| Informações Complementares | `dados_infoComplementares` | Não | Texto livre. |

### Dependência Agência → Talão

Ao selecionar `LAYAN LOG LTDA`, o select de talão foi atualizado com:

- `CT-e`;
- `CT-e HOMOLOGAÇÃO`.

O sistema selecionou automaticamente o talão normal `CT-e`. Para um teste seguro foi necessário trocar explicitamente para `CT-e HOMOLOGAÇÃO`.

Essa é uma barreira essencial: a automação nunca deve aceitar silenciosamente o talão selecionado pelo sistema. O valor escolhido deve ser conferido antes de avançar.

### Dados usados no teste

- Agência: `LAYAN LOG LTDA`
- Talão: `CT-e HOMOLOGAÇÃO`
- Número: vazio, para geração automática
- Data de emissão: valor padrão do sistema
- Manifesto: não vincular
- Viagem: não vincular
- Informações complementares: aviso explícito de teste e proibição de transmissão

## Etapa 4 — Dados do Frete

Esta etapa reúne várias seções na mesma página:

1. Envolvidos
2. Natureza da operação
3. Motorista e veículo
4. Seguro
5. Documentos/mercadorias
6. Totais da carga
7. Frete mínimo
8. Composição do frete e impostos
9. Vale-pedágio
10. Observações

### Widgets de pesquisa

Remetente, destinatário, CFOP, motorista, veículo e outros relacionamentos usam o mesmo padrão:

1. Um input `pesquisa_*` recebe o texto.
2. Pressionar `Enter` dispara a pesquisa.
3. Um select `dados_*` recebe as opções encontradas.
4. O resultado precisa ser selecionado ou confirmado.

Preencher somente o input de pesquisa não é suficiente. A automação deve verificar o `value` do select final.

## Envolvidos

| Rótulo | Pesquisa | Select final | Obrigatório |
| --- | --- | --- | --- |
| Remetente | `pesquisa_enderecoRemetente_id` | `dados_enderecoRemetente_id` | Sim |
| Destinatário | `pesquisa_enderecoDestinatario_id` | `dados_enderecoDestinatario_id` | Sim |
| Recebedor | `pesquisa_enderecoConsignatario_id` | `dados_enderecoConsignatario_id` | Não no teste |
| Expedidor | `pesquisa_enderecoRedespacho_id` | `dados_enderecoRedespacho_id` | Não no teste |

O CNPJ inicialmente fornecido para pesquisa não encontrou cadastro. O teste continuou usando cadastros existentes:

- remetente: `LAYAN LOG LTDA`, Montes Claros/MG;
- destinatário: `ALPARGATAS S.A`, Montes Claros/MG.

O destinatário apresentou vários endereços com nomes semelhantes. A seleção correta não pode depender apenas do nome; a futura ferramenta deve comparar documento, município, UF, endereço e, se disponível, inscrição estadual.

### Pagador do frete

O grupo `dados_pagamentoFrete` usa rádios:

- `R`: remetente;
- `D`: destinatário;
- `C`: recebedor;
- `P`: expedidor;
- `O`: outro.

No teste, o remetente foi selecionado.

## Natureza da operação e a duplicidade do CFOP

Há dois campos semanticamente relacionados e ambos foram necessários:

### Natureza da operação do CT-e

- pesquisa: `pesquisa_cfops_id`
- select: `dados_cfops_id`
- valor escolhido: `5353 - Prest. de Serviço de Transp. Estabelecimento comercial`

### CFOP da mercadoria

- input: `dados_merc_nCFOP[1]`
- valor escolhido: `5353`

Na primeira tentativa de salvar, somente a natureza da operação estava preenchida. O sistema abriu um alerta nativo:

`Os seguintes campos do bloco de mercadorias devem ser preenchidos: - CFOP`

Depois de preencher `dados_merc_nCFOP[1]`, o salvamento foi aceito. A futura automação deve tratar esses campos separadamente.

## Motorista e veículo

Campos observados:

- motorista: pesquisa `pesquisa_dados_motorista_id`, select `dados_motorista_id`;
- veículo principal: pesquisa `pesquisa_dados_veiculos_id`, select `dados_veiculos_id`;
- vinculado 1: pesquisa `pesquisa_dados_carreta_id`, select `dados_carreta_id`;
- vinculado 2: pesquisa `pesquisa_dados_semireboque_id`, select `dados_semireboque_id`.

Esses campos não apareceram com asterisco e não foram exigidos para salvar o CT-e de homologação testado. Em produção, regras de operação, modal, seguro, MDF-e ou RNTRC podem torná-los necessários.

## Seguro

O sistema trouxe valores padrão:

- responsável: `Emi - Emitente` (`dados_respSeg`);
- seguradora: `PORTO SEGURO` (`dados_seguradora_id`);
- número da apólice: valor já configurado em `dados_numeroApolice`.

A automação deve ler e validar esses padrões; não deve assumir que serão iguais entre agências ou ambientes.

## Documento e mercadoria

O tipo padrão foi `NF-e` no grupo `dados_tipoDocumentos`.

### Campos da primeira mercadoria

| Rótulo | Nome do campo | Valor de teste |
| --- | --- | --- |
| Chave de acesso | `dados_merc_chaveNFe[1]` | vazio |
| Natureza da carga | `dados_merc_natureza[1]` | `CALCADOS - TESTE HOMOLOGACAO` |
| Data de emissão | `dados_merc_dtFiscal[1]` | data atual do sistema |
| Tipo | `dados_merc_tipoNF[1]` | `S` |
| Número NF-e | `dados_merc_notaFiscal[1]` | `999999` |
| Série | `dados_merc_serieNotaFiscal[1]` | `1` |
| Peso | `dados_merc_quantKg[1]` | `100` kg |
| Quantidade | `dados_merc_quant[1]` | `10` |
| Espécie | `dados_merc_especie[1]` | `CAIXAS` |
| Marca | `dados_merc_marca[1]` | `GENERICA` |
| CFOP da mercadoria | `dados_merc_nCFOP[1]` | `5353` |
| Valor do produto | `dados_merc_vProd[1]` | `1000` |
| Valor do documento | `dados_merc_valor[1]` | `1000,00` |

Os totais da carga foram recalculados pelo sistema: 100 kg, 0,100 tonelada, 10 caixas e produto predominante igual à natureza informada.

### Máscaras monetárias

O campo `dados_merc_valor[1]` aplica máscara no navegador. Durante a automação, escrever valores em formatos diferentes e perder o foco produziu concatenações temporárias inválidas. O padrão confiável foi:

1. limpar o campo;
2. preencher `1000,00`;
3. retirar o foco;
4. reler o valor final;
5. validar os totais recalculados.

Não manipular `element.value` diretamente sem reproduzir os eventos esperados pelo componente.

## Composição do frete

| Rótulo | Nome | Valor de teste |
| --- | --- | --- |
| Regra | `dados_regraFrete_id` | `Simples Nacional` |
| Frete Valor | `dados_valorFrete` | `100` |
| Total Prestação | `dados_totalPrestacao` | calculado como `100,00` |

O sistema calculou automaticamente:

- alíquota padrão de ICMS para MG × MG: `18,0000`;
- base de cálculo de IBS/CBS: `100,00`;
- IBS estadual: `0,10`;
- CBS: `0,90`.

Esses valores dependem da configuração fiscal e não devem ser definidos pela automação com regras próprias. A ferramenta deve selecionar a regra autorizada, disparar o cálculo do sistema e validar o resultado.

## Salvamento e validações

O botão final é um input com:

- ID `botao_cadastrar`;
- nome `botao_finalizacao`;
- valor `Salvar`;
- ação JavaScript `RG.trocaPasso(this, '2', true, 0)`.

O salvamento pode:

- abrir um alerta nativo com campos pendentes;
- manter a mesma página para correção;
- navegar de volta à rotina e adicionar `inserido=<id>` à URL em caso de sucesso.

Critérios de sucesso recomendados:

1. URL contém `id=transp_cte` e `inserido=<id>`;
2. mensagem visível `Conhecimento inserido com sucesso.`;
3. nova linha da grade contém o mesmo ID interno;
4. número/talão e valor conferem com o formulário;
5. status SEFAZ e chave de acesso permanecem vazios.

## Barreira de segurança após salvar

Logo após a criação, o Layan exibiu um painel operacional para o registro `1/ CT-e HOMOLOGAÇÃO`. A opção **Enviar para a SEFAZ** veio marcada por padrão e havia um botão **Executar**.

Portanto, a futura automação precisa de uma barreira explícita:

- concluir o trabalho assim que detectar `Conhecimento inserido com sucesso`;
- nunca clicar genericamente no primeiro radio ou botão após o salvamento;
- bloquear seletores/textos contendo `SEFAZ`, `Executar`, `Contingência`, `Averbar`, `Cancelar CT-e`, `Carta de Correção` e `Emitir GNRE` sem uma operação autorizada separadamente;
- exigir confirmação humana específica para transmissão;
- registrar que o CT-e está apenas criado no TMS, sem autorização fiscal.

## Máquina de estados recomendada

```text
LOGIN
  -> LISTA_CTE
  -> MENU_ADICIONAR
  -> DADOS_BASICOS
  -> DADOS_FRETE_ENVOLVIDOS
  -> DADOS_FRETE_MERCADORIA
  -> DADOS_FRETE_COMPOSICAO
  -> VALIDAR_ANTES_DE_SALVAR
  -> SALVAR
  -> TRATAR_ALERTA_DE_VALIDACAO (zero ou mais vezes)
  -> CONFIRMAR_REGISTRO_CRIADO
  -> PARADA_SEGURA_ANTES_SEFAZ
```

Cada transição deve possuir pré-condição, ação, pós-condição e timeout limitado.

## Estratégia recomendada de automação

### 1. Extensão Chrome Manifest V3 restrita ao domínio

Usar `host_permissions` apenas para `https://layanlog.bsoft.app/*`, não `<all_urls>`.

### 2. Content script determinístico

Interagir por `name`, rótulo e texto estável. Os nomes observados são melhores que posições ou classes visuais, mas precisam de fallback porque o fornecedor pode alterá-los.

### 3. Orquestrador persistente

Persistir o estado mínimo em `chrome.storage.session` ou mecanismo equivalente, sem senha e sem copiar dados fiscais desnecessários. Isso permite retomar após suspensão do service worker ou expiração de sessão.

### 4. Camada de preenchimento tipada

Representar a entrada em um objeto validado, por exemplo:

```json
{
  "ambiente": "homologacao",
  "agencia": "LAYAN LOG LTDA",
  "remetente": { "documento": "...", "enderecoId": "..." },
  "destinatario": { "documento": "...", "enderecoId": "..." },
  "pagador": "remetente",
  "cfopOperacao": "5353",
  "documentos": [
    {
      "tipo": "NFE",
      "numero": "999999",
      "serie": "1",
      "pesoKg": 100,
      "quantidade": 10,
      "especie": "CAIXAS",
      "cfopMercadoria": "5353",
      "valor": 1000
    }
  ],
  "regraFrete": "Simples Nacional",
  "valorFrete": 100
}
```

### 5. Validação antes de qualquer clique

Conferir:

- ambiente/talão de produção versus homologação;
- endereço exato dos envolvidos;
- CFOP da operação e CFOP de cada mercadoria;
- valores após aplicação de máscaras;
- totais recalculados;
- regra tributária retornada pelo sistema;
- ausência de campos obrigatórios vazios.

### 6. Tratamento de alertas

Capturar alertas nativos, extrair a lista de campos, mapear cada rótulo para o nome técnico e voltar ao estado apropriado. Limitar tentativas para evitar loops.

### 7. Auditoria

Registrar, sem senha:

- timestamp;
- usuário lógico ou ID do processo;
- talão/ambiente;
- ID interno criado;
- número do CT-e;
- ações realizadas;
- campos validados;
- confirmação de que não houve envio à SEFAZ.

## Diferenças em relação à JARVAS-OFERTAS

A JARVAS-OFERTAS explora páginas desconhecidas usando heurísticas e cliques genéricos. O Layan exige o oposto:

- fluxo conhecido e versionado;
- seletores específicos;
- campos tipados;
- validações fiscais;
- ausência de fallback para “primeiro botão”;
- lista de ações proibidas;
- confirmação humana em limites fiscais;
- prova de sucesso por ID e status.

O princípio reaproveitável da JARVAS é verificar o estado após cada ação e persistir o progresso antes de avançar. As heurísticas genéricas de clique não são adequadas para emissão de CT-e.

## Próximos passos técnicos

1. Definir o schema de entrada do CT-e e quais campos podem ser opcionais.
2. Mapear cenários adicionais: interestadual, recebedor/expedidor, múltiplas NF-es, veículos, pedágio, manifesto e viagem.
3. Criar uma página local de teste que simule os widgets de pesquisa e máscaras do Layan.
4. Implementar primeiro somente até a tela de revisão, sem salvamento.
5. Adicionar salvamento de homologação atrás de confirmação explícita.
6. Manter transmissão à SEFAZ fora do MVP e em módulo separado.

