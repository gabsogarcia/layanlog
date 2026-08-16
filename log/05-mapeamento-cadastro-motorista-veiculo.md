# Mapeamento dos cadastros de Motorista e Veículo

Data do teste: 16/08/2026.

Ambiente: `layanlog.bsoft.app`, usuário operacional `JOAO.PEDRO`.

## Resultado executivo

- O motorista precisa estar salvo antes de ser localizado no campo `Motorista` do veículo.
- O motorista de teste foi salvo com código interno **4224**.
- A busca do veículo encontrou o motorista como `733.812.766-20 - CODEX TESTE AUTOMACAO MOTORISTA` e valor técnico `4224`.
- A tentativa de localizar um nome inexistente retornou `Nenhum registro encontrado!`.
- A tentativa de repetir o CPF não criou um segundo registro: a grade contém somente o código 4224 para `733.812.766-20`.
- O formulário de Pessoa pode ser salvo sem dados de CNH.
- O formulário não exige chegar à última aba para exibir ou acionar `Salvar`; porém, as validações dos demais passos continuam sendo executadas.
- O parâmetro `SWU` muda em cada abertura. O formulário deve ser aberto pelo botão Adicionar da grade.

## 1. Cadastro de Motorista

### Navegação

1. Menu lateral `Pessoas`.
2. Rotina `Pessoas`.
3. Na grade `Cadastro de Pessoas`, clicar no ícone `Adicionar`.

URL da grade:

`/versoes/versao5.0/rotinas/c.php?id=cadastro_pessoas&menu=s`

Exemplos de duas aberturas consecutivas:

- `...formulario.php?...&rotina=cadastro_pessoas&SWU=4nwr5sfmhi38&...`
- `...formulario.php?...&rotina=cadastro_pessoas&SWU=5htffqr6lzdj&...`

Conclusão: o `SWU` é variável. Não é seguro reutilizar uma URL antiga do formulário.

### Grupos da Pessoa

O mecanismo é uma lista de checkboxes com seleção múltipla. Todos usam `name="dados_grupos_id[]"`.

| Grupo | Valor técnico | Tipo | Obrigatório observado |
|---|---:|---|---|
| Clientes | `3` | checkbox | Não |
| Fornecedores | `2` | checkbox | Não |
| Motoristas | `11` | checkbox | Necessário para caracterizar o cadastro como motorista |
| Proprietários Veículos | `17` | checkbox | Não para motorista; necessário para aparecer na busca de proprietário |
| Seguradoras | `12` | checkbox | Não |
| Transportadora | `6` | checkbox | Não |

Ao marcar `Motoristas`, o formulário passa a exibir a quarta aba, `Carteira Nacional de Habilitação`.

### Dados Pessoais

Os campos com `*` são obrigatórios segundo a interface. O HTML legado não usa consistentemente o atributo `required`; a validação é feita por scripts do sistema.

| Rótulo | Obrigatório | Tipo | Nome técnico / id |
|---|---|---|---|
| Tipo: Pessoa Física / Outros | Sim | rádio | `dados_fisica_juridica`, valores `F` e `E` |
| CPF | Sim | texto com máscara | `dados_CPF` |
| Nome | Sim | texto | `dados_nome` |
| Sobrenome | Não | texto | `dados_sobrenome` |
| Nome Social | Não | texto | `dados_nome_social` |
| Sexo | Não | select | `dados_sexo` |
| Data de Nascimento | Não | texto/data + calendário | `dados_data_nascimento` |
| Mãe Desconhecida | Não | checkbox | `dados_check_mae_desconhecida[]` |
| Mãe | Não | texto | `dados_mae` |
| Pai Desconhecido | Não | checkbox | `dados_check_pai_desconhecido[]` |
| Pai | Não | texto | `dados_pai` |
| Apelido | Não | texto | `dados_apelido` |
| Grau de Instrução | Não | select | `dados_grauInstruTrabalhador` |
| Município de Naturalidade | Não | busca assíncrona | pesquisa `pesquisa_naturalidade_id` (`pswobj1`), valor `dados_naturalidade_id` (`cswobj1`) |
| Naturalidade Não Cadastrada | Não | checkbox | `dados_basicoLocNaoCad[]` |
| Naturalidade livre | Condicional | texto | `dados_naturalidade` |
| UF Naturalidade | Não | select | `dados_naturalidadeEstado` |
| Nacionalidade | Não | busca assíncrona | `pesquisa_paisNacionalidade_id` / `dados_paisNacionalidade_id` |
| País de Nascimento | Não | busca assíncrona | `pesquisa_paisNascimento_id` / `dados_paisNascimento_id` |
| Identidade (RG) | Não | texto | `dados_CI` |
| Data de Emissão (RG) | Não | texto/data | `dados_emissaoRG` |
| Órgão Expedidor (RG) | Não | busca/select | `pesquisa_CI` / `dados_CI_orgaoExpedidor_mdm` |
| UF (RG) | Não | select | `dados_CI_Estado` |
| INSS/NIS/PIS/PASEP | Não | texto | `dados_matriculaINSS` |
| Ignorar Validação | Não | checkbox | `dados_ignoraValidacaoNIS[]` |
| Número CTPS | Não | texto | `dados_numeroCTPS` |
| Série CTPS | Não | texto | `dados_serieCTPS` |
| UF Expedição CTPS | Não | select | `dados_ufExpedicaoCTPS` |
| Telefone Residencial | Não | texto | `dados_telResidencial` |
| Celular | Não | texto | `dados_celular` |
| Outros - Contato | Não | texto | `dados_outrosTels` |
| Site | Não | texto | `dados_site` |
| E-mail | Não | textarea | `dados_email` |
| E-mail para Cobrança | Não | textarea | `dados_emailCobranca` |
| E-mail para Cotação | Não | textarea | `dados_emailCotacaoEstoque` |
| E-mail para Ocorrências | Não | textarea | `dados_emailOcorrenciasTransporte` |
| Protestar | Não | rádio | `dados_protestar`, valores `S`, `N`, `C` |
| Lotação | Não | busca assíncrona | `pesquisa_lotacao_id` / `dados_lotacao_id` |
| Observação | Não | textarea | `dados_observacoes` |
| Referências | Não | texto | `dados_referencias` |

### CPF e duplicidade

CPF utilizado: `733.812.766-20`.

Na primeira digitação, não houve busca automática visível, preenchimento de nome ou mensagem. O cadastro completo foi salvo normalmente.

Na segunda tentativa, com o mesmo CPF, o sistema permaneceu no formulário e não criou um segundo registro. A grade confirmou apenas:

- código `4224`;
- `CODEX TESTE AUTOMACAO MOTORISTA`;
- CPF `733.812.766-20`.

Conclusão: o Layan impede a duplicação no salvamento. A mensagem textual exata não ficou disponível no DOM nem em diálogo; o efeito observável foi a permanência no formulário e a ausência do segundo registro.

### Nome vazio

Foi usado o CPF alternativo `798.598.350-39`, deixando `Nome` vazio. Ao acionar `Salvar`, o sistema permaneceu na aba de Dados Pessoais e colocou o foco em `dados_nome`. Nenhum registro foi criado. A interface não expôs uma mensagem textual acessível; portanto, não foi possível registrar literalmente o texto do erro.

### Endereço

| Rótulo | Obrigatório visual | Tipo | Nome técnico / id |
|---|---|---|---|
| Tipo do endereço | Sim | rádio Nacional/Estrangeiro | `dados_nacional_estrangeiro` |
| CEP | Sim | texto + pesquisa | `dados_CEP` |
| Estado | Preenchido/validado conforme CEP | select | `dados_estado` |
| Cidade | Sim na prática | busca assíncrona | `pesquisa_cidade_id` (`pswobj1`) / `dados_cidade_id` (`cswobj1`) |
| Não Cadastrada | Não | checkbox | `dados_locNaoCad[]` |
| Bairro | Sim | texto | `dados_bairro` |
| Logradouro | Sim | texto | `dados_localidade` |
| Número | Sim | texto | `dados_nro` |
| Complemento | Não | texto | `dados_complemento` |
| Endereço consolidado | Não | texto | `dados_endereco` |
| Telefones | Não | texto | `dados_telefone1`, `dados_telefone2` |
| Localização Maps | Não | texto | `dados_localizacaoMaps` |
| Latitude/Longitude | Não | texto | `dados_latitudeLongitude` |
| Inscrição Estadual | Marcado com `*` | texto | `dados_inscricaoEstadual` |
| Isento IE | Alternativa | checkbox | `dados_isentoEst[]` |
| Não Contribuinte | Alternativa | checkbox | `dados_naoContribuinte[]` |
| Inscrição Municipal | Marcado com `*` | texto | `dados_inscricaoMunicipal` |
| Isento IM | Alternativa | checkbox | `dados_isencao[]` |
| Não Informar IM | Alternativa | checkbox | `dados_naoInformar[]` |
| Chave de Busca | Não | texto | `dados_chaveBusca` |
| Referência | Não | texto | `dados_referencia` |

Teste de CEP: `01001-000`.

Em aproximadamente 2 segundos foram preenchidos:

- Estado: SP;
- Cidade: São Paulo;
- Bairro: SÉ;
- Logradouro: PRAÇA DA SÉ;
- Endereço consolidado: PRAÇA DA SÉ.

Os campos permaneceram habilitados e editáveis. Para pessoa física, IE e IM continuaram visualmente marcadas com asterisco; o cadastro foi aceito usando `Não Contribuinte` e `Não Informar`.

### Carteira Nacional de Habilitação

Todos os campos apareceram sem asterisco e o motorista foi salvo com a aba inteira vazia.

| Rótulo | Obrigatório | Tipo | Nome técnico / id |
|---|---|---|---|
| N.º Registro CNH | Não | texto | `dados_cnh` |
| N.º Protocolo/Espelho | Não | texto | `dados_protocoloCNH` |
| Seguro da CNH | Não | texto | `dados_seguroCNH` |
| RENACH | Não | texto | `dados_renachCNH` |
| Categoria | Não | texto | `dados_categoria` |
| Data de Emissão | Não | texto/data | `dados_dtExpedicao` |
| Data da 1.ª Habilitação | Não | texto/data | `dados_dtPrimeiraExpedicao` |
| Validade da CNH | Não | texto/data | `dados_dtValidade` |
| Validade Exame Toxicológico | Não | texto/data | `dados_dtValidadeExameToxicologico` |
| Órgão Expedidor | Não | texto | `dados_orgaoExpedidor` |
| Cidade de Expedição | Não | busca assíncrona | `pesquisa_cidadeEmissaoCNH_id` (`pswobj0`) / `dados_cidadeEmissaoCNH_id` (`cswobj0`) |

### Confirmação de sucesso do motorista

Após salvar, o sistema abriu a visualização:

`preview.php?OP=O5&rotina=cadastro_pessoas&id=4224...`

O código interno é `4224`, aparece imediatamente na grade e é o identificador que deve ser guardado para confirmar o cadastro.

## 2. Cadastro de Veículo

### Navegação

1. Menu lateral `Transporte`.
2. Rotina `Veículos`.
3. Na grade `Cadastro de Veículos`, clicar no ícone `Adicionar`.

URL da grade:

`/versoes/versao5.0/rotinas/c.php?id=trans_veiculos&menu=s`

O formulário também recebe um `SWU` variável. Exemplo observado:

`...formulario.php?...&rotina=trans_veiculos&SWU=144txc0isx1e&...`

Os botões ficam no rodapé: `Voltar`, `Cadastrar mais` e `Cadastrar`.

### Dados do Veículo

| Rótulo | Obrigatório | Tipo | Nome técnico / id |
|---|---|---|---|
| Placa | Sim | texto com máscara | `dados_placa` |
| Grupo do Veículo | Sim | busca assíncrona | `pesquisa_gruposVeiculos_id` (`pswobj2`) / `dados_gruposVeiculos_id` (`cswobj2`) |
| Categoria | Sim | busca assíncrona | `pesquisa_categoriasVeiculos_id` (`pswobj0`) / `dados_categoriasVeiculos_id` (`cswobj0`) |
| Marca | Não | busca assíncrona | `pesquisa_marcasVeiculos_id` (`pswobj1`) / `dados_marcasVeiculos_id` (`cswobj1`) |
| Modelo | Não | texto | `dados_modeloVeiculo` |
| Tipo de Rodado | Não no cadastro; relevante para MDF-e | select | `dados_tpRod` |
| Tipo de Carroceria | Não no cadastro; relevante para MDF-e | select | `dados_tpCar` |
| Capacidade de Carga (kg) | Não | texto numérico | `dados_capCarga` |
| Tara (kg) | Não | texto numérico | `dados_tara` |

O Grupo do Veículo abriu pré-selecionado como `FROTA TERCEIROS`, valor técnico `2`.

Ao selecionar a categoria `CAVALO`, valor técnico `1`, o sistema marcou automaticamente `Dados Adicionais`, preencheu Capacidade (m³) com `32` e tornou Cidade/UF obrigatória.

### Proprietário, Motorista e Arrendatário

| Rótulo | Obrigatório observado | Tipo | Nome técnico / id |
|---|---|---|---|
| Definir Proprietário como Motorista | Não | checkbox | `dados_motProp[]` |
| Proprietário | Necessário no teste de cadastro | busca assíncrona | `pesquisa_proprietario_id` (`pswobj4`) / `dados_proprietario_id` (`cswobj4`) |
| Arrendatário | Não | busca assíncrona | `pesquisa_arrendatario_id` (`pswobj5`) / `dados_arrendatario_id` (`cswobj5`) |
| Motorista | Não marcado com asterisco, mas necessário para o vínculo desejado | busca assíncrona | `pesquisa_motorista_id` (`pswobj6`) / `dados_motorista_id` (`cswobj6`) |

O checkbox `Definir Proprietário como Motorista do Veículo` não desabilitou imediatamente o campo Motorista quando marcado sem proprietário. A própria ajuda da tela informa: “Define que o Cadastro do Proprietário será utilizado também como Motorista do Veículo”. O comportamento completo depende da seleção de um proprietário.

O motorista de teste não apareceu na busca de Proprietário, pois foi cadastrado somente no grupo Motoristas, e não em `Proprietários Veículos`. Para o teste do veículo foi selecionada `42.636.705/0001-40 - LAYAN LOG` como proprietária.

### Teste do vínculo Motorista → Veículo

Busca inexistente:

- entrada: `MOTORISTA INEXISTENTE XYZ`;
- ação necessária: digitar e pressionar Enter;
- resposta: `Nenhum registro encontrado!`.

Busca existente:

- entrada: `CODEX TESTE AUTOMACAO MOTORISTA`;
- ação: digitar e pressionar Enter;
- resposta em aproximadamente 1 segundo: `733.812.766-20 - CODEX TESTE AUTOMACAO MOTORISTA`;
- valor técnico selecionado: `4224`.

Conclusão: **sim, o motorista precisa existir e estar salvo antes de o veículo conseguir referenciá-lo**. A evidência é que a busca só retornou o motorista após o cadastro e retornou seu código interno 4224.

### Dados Adicionais

| Rótulo | Obrigatório | Tipo | Nome técnico / id |
|---|---|---|---|
| Dados Adicionais | Não; pode ser ativado pela categoria | checkbox | `dados_dados_adicionais[]` |
| Renavam | Não | texto | `dados_renavam` |
| Capacidade (m³) | Não | texto numérico | `dados_capM3` |
| Cidade/UF | Sim quando Dados Adicionais está ativo | busca assíncrona | `pesquisa_codIBGE` (`pswobj7`) / `dados_codIBGE` (`cswobj7`) |
| Código de licenciamento | Não | texto | `dados_codigo_licenciamento` |
| Ano Modelo | Não | texto | `dados_anoModelo` |
| Ano Fabricação | Não | texto | `dados_anoFabricacao` |
| Chassi | Não | texto | `dados_chassi` |
| Combustível | Não | select | `dados_combustivel_mdm` |
| Cor | Não | select | `dados_cor_mdm` |
| Certificado de Registro | Não | texto | `dados_certificadoReg` |
| N.º Eixos | Não | texto numérico | `dados_qtdeEixos` |
| Alienado para | Não | busca assíncrona | `pesquisa_alienado` (`pswobj8`) / `dados_alienado` (`cswobj8`) |
| Veículo movido a Diesel | Sim/Não com Sim predefinido | rádio | `dados_pre_validar_frete_minimo` |
| Observações | Não | textarea | `dados_observacao` |

Também existem blocos opcionais de Rastreamento e Gerenciadora de Risco, desmarcados por padrão.

### Confirmação do veículo

A primeira tentativa, com `TST-0A01`, não criou registro. A investigação posterior mostrou o motivo: o valor havia sido submetido sem a máscara aceita e o sistema respondeu `Valor do campo Placa não é do tipo Placa!`.

O teste conclusivo foi realizado com:

- placa: `TST-0A02`;
- grupo: `FROTA TERCEIROS` (`2`);
- categoria: `CAVALO` (`1`);
- proprietário: `42.636.705/0001-40 - LAYAN LOG` (`1`);
- motorista: `733.812.766-20 - CODEX TESTE AUTOMACAO MOTORISTA` (`4224`);
- Cidade/UF: `MG - Montes Claros` (`3143302`);
- Capacidade (m³): `32`, preenchida automaticamente pela categoria;
- Diesel: Sim.

Após `Cadastrar`, a primeira submissão sem hífen foi rejeitada com a mensagem exata `Valor do campo Placa não é do tipo Placa!`. Mantidos os mesmos campos e corrigida a placa para `TST-0A02`, o sistema redirecionou para:

`preview.php?OP=O5&rotina=trans_veiculos&id=446&REF=R3...`

A tela mostrou a mensagem exata `Veículo cadastrado com sucesso`. Após aproximadamente 19,8 segundos contados desde o clique, a busca nativa da grade mostrou:

- código interno `446`;
- placa `TST-0A02/MG`;
- categoria `CAVALO`;
- proprietário `42.636.705/0001-40 - LAYAN LOG`;
- motorista `733.812.766-20 - CODEX TESTE AUTOMACAO MOTORISTA`.

O sinal confiável de sucesso é, portanto, a combinação de redirecionamento para `preview.php` com um `id` numérico e a mensagem `Veículo cadastrado com sucesso`. A presença posterior na grade confirma a persistência.

## 3. Consulta pública ANTT/RNTRC

URL: `https://consultapublica.antt.gov.br/Site/ConsultaRNTRC.aspx`.

Na opção `Por Veículo`, a página exige:

- Placa;
- e RNTRC ou CPF/CNPJ do transportador.

Consulta única realizada:

- placa fictícia: `TST0A01`;
- CNPJ: LAYAN LOG, `42.636.705/0001-40`.

O site possui proteção ALTCHA apresentada como checkbox `Eu não sou um robô`. A validação foi concluída uma vez, sem desafio visual. Não foi observada mensagem de rate limit, mas não foram feitas consultas repetidas.

O resultado apareceu na mesma página, em tabela:

- Transportador: `ETC - Layan Log Ltda`;
- CNPJ mascarado: `XX.XXX.705/0001-XX`;
- RNTRC: `058227722`;
- Situação: `ATIVO`;
- Cadastrado desde: `30/06/2025`;
- Município/UF: `Montes Claros/MG`;
- Resultado do veículo: `O veículo placa TST0A01 NÃO está cadastrado na frota do transportador informado.`

A página ainda oferece `Imprimir Protocolo` e abre uma caixa de avaliação do serviço após a consulta.

## 4. Incertezas e limitações

- A mensagem literal de CPF duplicado não foi exposta no DOM; a conclusão foi confirmada pela existência de somente um registro na grade.
- A mensagem literal de Nome vazio também não foi exposta; o sistema permaneceu no formulário e focou `dados_nome`.
- O atributo HTML `required` não representa corretamente a obrigatoriedade dessa aplicação; a fonte mais confiável observada foi o asterisco visual e o comportamento ao salvar.
- O efeito completo de `Definir Proprietário como Motorista` não foi testado com uma pessoa pertencente simultaneamente aos grupos Proprietário e Motorista.
- A placa precisa ser submetida com a máscara aceita pelo formulário. Sem o hífen, `TST0A02` foi rejeitada; com `TST-0A02`, o cadastro foi concluído.

## 5. Registros de teste para remoção

### Confirmado na grade

- Pessoa/motorista: código `4224`, nome `CODEX TESTE AUTOMACAO MOTORISTA`, CPF `733.812.766-20`, endereço `PRAÇA DA SÉ, 1`, São Paulo/SP, CEP `01001-000`.

### Confirmado na grade

- Veículo: código `446`, placa `TST-0A02/MG`, categoria `CAVALO`, grupo `FROTA TERCEIROS`, proprietário LAYAN LOG, motorista código `4224`, Cidade/UF Montes Claros/MG.

### Não criado

- Veículo `TST-0A01`: a tentativa anterior não gerou registro.

### Não criados

- A segunda tentativa com CPF `733.812.766-20` não gerou outro registro.
- O teste de Nome vazio com CPF `798.598.350-39` não gerou registro.
