# Inventário preliminar e amostra bruta

Arquivo analisado: `ctes.pdf` (240 páginas, A4, PDF não criptografado).

## Inventário estrutural

- CT-e delimitados: **66**.
- Âncora: linha de cabeçalho `CT-e ...` no início de cada seção; cada documento vai dessa âncora até imediatamente antes da próxima. A âncora foi encontrada em todas as seções, sem caso incerto.
- Páginas por documento variam de 1 a 29; a paginação do PDF é contínua.
- Texto: extraível diretamente, sem OCR. Usei `pypdf.PdfReader.pages[i].extract_text()`. A inspeção visual de páginas 1–5 confirmou a estrutura tabular e os rótulos.
- Cancelados: **1**, CT-e 440 (páginas 46–47), marcado explicitamente como `(CANCELADO)`.
- Não cancelados: 65 seções sem marcador `CANCELADO`.
- Duplicidade: os 66 números de CT-e são distintos no cabeçalho; não dedupliquei nada.
- O PDF não traz, como campo dedicado uniforme, um status “inserido/emitido”; há chave em vários CT-e e o marcador explícito de cancelamento no 440.

**Decisão pendente:** conforme solicitado, não agreguei estatísticas enquanto aguardo sua decisão sobre incluir ou excluir o CT-e 440 cancelado. Posso calcular duas bases (66 incluindo cancelado e 65 excluindo) se você preferir.

## Amostra bruta completa

Abaixo estão os três primeiros CT-e completos exatamente como extraídos; quebras e espaços são os retornados pelo extrator.


### Amostra 1 — páginas 1–1, seção iniciada por CT-e HOMOLOGAÇÃO - 1

```text
LAYAN LOG LTDA
AVENIDA COMENDADOR ANTONIO LOUREIRO RAMOS, 400 - DISTRITO INDUSTRIAL
CEP: 39404-620, MONTES CLAROS - MG
Fone/E-mail: contato@layanlog.com.br
CT-e HOMOLOGAÇÃO - 1 
Dados CT-e
Chave
Dados da prestação
Tomador do serviço
Remetente
Form. pag.
Pago
Dt. Emissão
16/08/2026 10:00
CFOP - Natureza
5353 - Prest. de Serviço de
Transp. Estabelecimento
comercial
Origem
Montes Claros - MG
Destino
Montes Claros - MG
Remetente Destinatário
Nome LAYAN LOG
EndereçoAVENIDA COMENDADOR ANTONIO LOUREIRO RAMOS, 400
Bairro DISTRITO INDUSTRIAL
MunicípioMONTES CLAROS CEP 39404-620
CNPJ/CPF42.636.705/0001-40 Insc. est.40897670043
País BRASIL Fone /
Nome ALPARGATAS S.A
EndereçoAV B LOTE 1 QUADRA 15, SN
Bairro DISTRITO INDUSTRIAL
MunicípioMONTES CLAROS CEP 39404-628
CNPJ/CPF61.079.117/0109-17 Insc. est.525.138.072/2813
País BRASIL Fone /
Recebedor Expedidor
Nome
Endereço
Bairro
Município CEP
CNPJ/CPF Insc. est.
País Fone
Nome
Endereço
Bairro
Município CEP
CNPJ/CPF Insc. est.
País Fone
Cliente Seguradora
Nome LAYAN LOG
EndereçoAVENIDA COMENDADOR ANTONIO LOUREIRO RAMOS, 400
Bairro DISTRITO INDUSTRIAL
MunicípioMONTES CLAROS CEP 39404-620
CNPJ/CPF42.636.705/0001-40 Insc. est.40897670043
País BRASIL Fone /
Nome PORTO SEGURO
N.º da apólice 10654360040007510000
Responsável Emitente
N.º da averbação 
Motorista
Nome Veículo Carreta Semi-reboque
CNPJ/CPF Fone /
Componentes do valor da prestação de serviço
Tarifa Final
0,00
Tarifa Real
0,00
Frete valor
100,00
Outros valores
0,00
Pedágio
0,00
Gris
0,00
Diária
0,00
Seguro
0,00
SeG. Aduaneiro
0,00
Total Prestação
100,00
Informações relativas ao imposto
Situação tributária Base de cálculo
0.00
Alíq ICMS
18.0000
Valor ICMS
0,00
% RED.BC.CALC.
Documentos originários
TP Doc. QuantidadePeso Série/N.ºdocumentoValor nota
NF 10,00 CAIXAS100,00 Kg 1/999999 1.000,00
TP doc. QuantidadePeso Série/N.ºdocumentoValor nota
Volumes: 10,00 CAIXAS Pesos: 100,00 Kg Valor: 1.000,00
Manifesto de Carga
N.º Data Emissão Usuário Emissão Data Fechamento Usuário Fechamento
* Manifesto Atual
Observações
Ocorrências
Data Ocorrência Referência Série / N.º NF Recebedor Usuário
Declaro que recebi os volumes deste conhecimento de transporte em perfeito estado pelo que dou por cumprido o presente contrato de transporte N.º : 1
Nome
 
Assinatura / Carimbo
Chegada data / Hora
 
RG
 
Saída data / Hora
 
16/08/26 10:31 AM Bsoft TMS - www.bsoft.com.br
8/16/26, 10:32 AM LAYAN LOG - Documento - Sem título
https://layanlog.bsoft.app/versoes/versao5.0/relatorios/carrega_relatorio.php?id=transp_documentos2Multiplos&doc=espelhoCTRC&origem=d&idConhecim… 1/240
```


### Amostra 2 — páginas 2–3, seção iniciada por CT-e - 454

```text
LAYAN LOG LTDA
AVENIDA COMENDADOR ANTONIO LOUREIRO RAMOS, 400 - DISTRITO INDUSTRIAL
CEP: 39404-620, MONTES CLAROS - MG
Fone/E-mail: contato@layanlog.com.br
CT-e - 454 
Dados CT-e
Chave
31260842636705000140570010000004541288537775
Dados da prestação
Tomador do serviço
Remetente
Form. pag.
Pago
Dt. Emissão
15/08/2026 09:51
CFOP - Natureza
6352 - Prest. de Serviço de
Transp. Estab. industrial
Origem
Montes Claros - MG
Destino
Duque de Caxias - RJ
Remetente Destinatário
Nome ALPARGATAS S.A
EndereçoAV B LOTE 1 QUADRA 15, SN
Bairro DISTRITO INDUSTRIAL
MunicípioMONTES CLAROS CEP 39404-628
CNPJ/CPF61.079.117/0109-17 Insc. est.525.138.072/2813
País BRASIL Fone /
Nome PATRUS TRANSPORTES URGENTES LTDA
EndereçoWASHINGTON LUIZ - DE 14002 A 19000 LADO PAR, 7749
Bairro PARQUE SAO BENTO
MunicípioDUQUE DE CAXIAS CEP 25265-008
CNPJ/CPF17.463.456/0002-71 Insc. est.81853053
País BRASIL Fone
Recebedor Expedidor
Nome PATRUS TRANSPORTES URGENTES LTDA
EndereçoWASHINGTON LUIZ - DE 14002 A 19000 LADO PAR, 7749
Bairro PARQUE SAO BENTO
MunicípioDUQUE DE CAXIAS CEP 25265-008
CNPJ/CPF17.463.456/0002-71 Insc. est.81853053
País BRASIL Fone
Nome
Endereço
Bairro
Município CEP
CNPJ/CPF Insc. est.
País Fone
Cliente Seguradora
Nome ALPARGATAS S.A
EndereçoAV B LOTE 1 QUADRA 15, SN
Bairro DISTRITO INDUSTRIAL
MunicípioMONTES CLAROS CEP 39404-628
CNPJ/CPF61.079.117/0109-17 Insc. est.525.138.072/2813
País BRASIL Fone /
Nome PORTO SEGURO
N.º da apólice 10654360040007510000
Responsável Emitente
N.º da averbação 
Motorista
Nome ADEVAIR DE MATOS SOUZA Veículo Carreta Semi-reboque
CNPJ/CPF 223.135.418-78 Fone / QHB-4B38 TME-0I46
Componentes do valor da prestação de serviço
Tarifa Final
0,00
Tarifa Real
0,00
Frete valor
3.053,91
Outros valores
0,00
Pedágio
0,00
Gris
0,00
Diária
0,00
Seguro
0,00
SeG. Aduaneiro
0,00
Total Prestação
3.053,91
Informações relativas ao imposto
Situação tributária
040 - ICMS Isenção Base de cálculo
0.00
Alíq ICMS
0.0000
Valor ICMS
0,00
% RED.BC.CALC.
Documentos originários
TP Doc. QuantidadePeso Série/N.ºdocumentoValor nota
NF 4,00 12,01 Kg 13/217961 1.086,96
NF 1,00 3,03 Kg 13/217967 241,08
NF 1,00 3,03 Kg 13/217978 241,08
NF 40,00 118,00 Kg 13/217983 7.132,80
NF 26,00 138,53 Kg 13/217994 6.642,48
NF 25,00 85,50 Kg 13/217995 6.969,00
NF 25,00 69,84 Kg 13/217996 5.880,00
NF 24,00 72,43 Kg 13/217997 7.016,16
NF 21,00 89,17 Kg 13/218001 6.102,24
NF 21,00 69,80 Kg 13/218002 4.878,72
NF 21,00 52,67 Kg 13/218003 5.667,72
NF 14,00 39,48 Kg 13/218006 3.566,64
NF 10,00 45,89 Kg 13/218007 2.671,20
NF 8,00 31,93 Kg 13/218010 2.216,28
NF 7,00 19,74 Kg 13/218011 2.073,96
NF 7,00 19,74 Kg 13/218013 1.788,36
NF 7,00 19,74 Kg 13/218015 1.990,80
NF 7,00 24,62 Kg 13/218017 2.338,56
NF 7,00 24,62 Kg 13/218018 2.338,56
NF 7,00 24,62 Kg 13/218019 2.338,56
NF 14,00 36,24 Kg 13/218021 3.902,64
NF 10,00 25,44 Kg 13/218032 1.591,20
NF 10,00 27,72 Kg 13/218033 2.554,80
NF 7,00 24,62 Kg 13/218034 2.338,56
NF 7,00 21,01 Kg 13/218035 1.949,64
TP doc. QuantidadePeso Série/N.ºdocumentoValor nota
NF 5,00 24,30 Kg 13/218036 1777.20
NF 4,00 10,62 Kg 13/218037 1303.68
NF 44,00 146,26 Kg 13/218044 10222.08
NF 43,00 151,70 Kg 13/218045 15985.68
NF 42,00 146,98 Kg 13/218046 9757.44
NF 42,00 154,23 Kg 13/218047 9757.44
NF 41,00 144,51 Kg 13/218048 9525.12
NF 41,00 143,39 Kg 13/218049 9525.12
NF 39,00 135,28 Kg 13/218050 9060.48
NF 35,00 98,28 Kg 13/218052 9756.60
NF 34,00 119,95 Kg 13/218053 10269.36
NF 34,00 102,82 Kg 13/218055 9477.84
NF 31,00 108,56 Kg 13/218056 7201.92
NF 76,00 266,88 Kg 13/218068 17656.32
NF 50,00 176,40 Kg 13/218072 11616.00
NF 49,00 171,37 Kg 13/218074 11383.68
NF 48,00 168,73 Kg 13/218075 11430.00
NF 47,00 164,54 Kg 13/218078 10919.04
NF 46,00 162,73 Kg 13/218079 10686.72
NF 46,00 162,81 Kg 13/218080 11227.68
NF 45,00 157,73 Kg 13/218081 10854.00
NF 44,00 132,77 Kg 13/218084 10950.72
NF 44,00 156,78 Kg 13/218085 10222.08
NF 5,00 17,69 Kg 13/218087 1161.60
Volumes: 1.266,00 Pesos: 4.324,72 Kg Valor: 317.245,80
Manifesto de Carga
N.º Data Emissão Usuário Emissão Data Fechamento Usuário Fechamento
113 * 15/08/2026 Leandro Costa Barbosa
* Manifesto Atual
Observações
8/16/26, 10:32 AM LAYAN LOG - Documento - Sem título
https://layanlog.bsoft.app/versoes/versao5.0/relatorios/carrega_relatorio.php?id=transp_documentos2Multiplos&doc=espelhoCTRC&origem=d&idConhecim… 2/240
SH: 9990997
Isenção do ICMS conforme item 162 do Anexo X do RICMS/MG
Ocorrências
Data Ocorrência Referência Série / N.º NF Recebedor Usuário
Declaro que recebi os volumes deste conhecimento de transporte em perfeito estado pelo que dou por cumprido o presente contrato de transporte N.º : 454
Nome
 
Assinatura / Carimbo
Chegada data / Hora
 
RG
 
Saída data / Hora
 
16/08/26 10:31 AM Bsoft TMS - www.bsoft.com.br
8/16/26, 10:32 AM LAYAN LOG - Documento - Sem título
https://layanlog.bsoft.app/versoes/versao5.0/relatorios/carrega_relatorio.php?id=transp_documentos2Multiplos&doc=espelhoCTRC&origem=d&idConhecim… 3/240
```


### Amostra 3 — páginas 4–5, seção iniciada por CT-e - 453

```text
LAYAN LOG LTDA
AVENIDA COMENDADOR ANTONIO LOUREIRO RAMOS, 400 - DISTRITO INDUSTRIAL
CEP: 39404-620, MONTES CLAROS - MG
Fone/E-mail: contato@layanlog.com.br
CT-e - 453 
Dados CT-e
Chave
31260842636705000140570010000004531459087003
Dados da prestação
Tomador do serviço
Remetente
Form. pag.
Pago
Dt. Emissão
15/08/2026 09:51
CFOP - Natureza
6352 - Prest. de Serviço de
Transp. Estab. industrial
Origem
Montes Claros - MG
Destino
Guarulhos - SP
Remetente Destinatário
Nome ALPARGATAS S.A
EndereçoAV B LOTE 1 QUADRA 15, SN
Bairro DISTRITO INDUSTRIAL
MunicípioMONTES CLAROS CEP 39404-628
CNPJ/CPF61.079.117/0109-17 Insc. est.525.138.072/2813
País BRASIL Fone /
Nome MODULAR TRANSPORTES LTDA
EndereçoPAPA JOAO PAULO I, 1745
Bairro VILA AEROPORTO
MunicípioGUARULHOS CEP 07170-340
CNPJ/CPF88.009.030/0003-71 Insc. est.336.795.939.113
País BRASIL Fone
Recebedor Expedidor
Nome MODULAR TRANSPORTES LTDA
EndereçoPAPA JOAO PAULO I, 1745
Bairro VILA AEROPORTO
MunicípioGUARULHOS CEP 07170-340
CNPJ/CPF88.009.030/0003-71 Insc. est.336.795.939.113
País BRASIL Fone
Nome
Endereço
Bairro
Município CEP
CNPJ/CPF Insc. est.
País Fone
Cliente Seguradora
Nome ALPARGATAS S.A
EndereçoAV B LOTE 1 QUADRA 15, SN
Bairro DISTRITO INDUSTRIAL
MunicípioMONTES CLAROS CEP 39404-628
CNPJ/CPF61.079.117/0109-17 Insc. est.525.138.072/2813
País BRASIL Fone /
Nome PORTO SEGURO
N.º da apólice 10654360040007510000
Responsável Emitente
N.º da averbação 
Motorista
Nome ADEVAIR DE MATOS SOUZA Veículo Carreta Semi-reboque
CNPJ/CPF 223.135.418-78 Fone / QHB-4B38 TME-0I46
Componentes do valor da prestação de serviço
Tarifa Final
0,00
Tarifa Real
0,00
Frete valor
6.088,52
Outros valores
0,00
Pedágio
0,00
Gris
0,00
Diária
0,00
Seguro
0,00
SeG. Aduaneiro
0,00
Total Prestação
6.088,52
Informações relativas ao imposto
Situação tributária
040 - ICMS Isenção Base de cálculo
0.00
Alíq ICMS
0.0000
Valor ICMS
0,00
% RED.BC.CALC.
Documentos originários
TP Doc. QuantidadePeso Série/N.ºdocumentoValor nota
NF 1,00 3,52 Kg 13/217944 305,64
NF 2,00 7,05 Kg 13/217946 710,88
NF 2,00 9,86 Kg 13/217947 710,88
NF 20,00 88,86 Kg 13/217948 7.013,04
NF 8,00 32,64 Kg 13/217949 2.685,12
NF 7,00 29,55 Kg 13/217952 2.073,96
NF 8,00 29,00 Kg 13/217953 2.245,20
NF 1,00 0,31 Kg 13/217954 325,92
NF 1,00 2,95 Kg 13/217955 236,16
NF 5,00 15,26 Kg 13/217956 1.494,96
NF 6,00 21,35 Kg 13/217957 1.896,00
NF 6,00 22,69 Kg 13/217960 1.955,52
NF 2,00 5,40 Kg 13/217962 592,56
NF 8,00 21,11 Kg 13/217963 2.370,24
NF 5,00 20,44 Kg 13/217964 1.317,72
NF 5,00 22,11 Kg 13/217965 1.317,72
NF 2,00 6,06 Kg 13/217966 487,92
NF 6,00 20,62 Kg 13/217968 1.883,64
NF 6,00 20,62 Kg 13/217969 1.883,64
NF 6,00 20,62 Kg 13/217970 1.883,64
NF 6,00 19,32 Kg 13/217971 1.095,12
NF 7,00 23,89 Kg 13/217972 1.718,28
NF 2,00 9,83 Kg 13/217974 746,64
NF 5,00 20,44 Kg 13/217975 1.317,72
NF 82,00 410,19 Kg 13/217976 29.766,00
NF 92,00 418,39 Kg 13/217977 33.694,08
NF 2,00 5,28 Kg 13/217979 487,92
NF 4,00 10,56 Kg 13/217980 975,84
NF 1,00 4,95 Kg 13/217981 292,92
NF 49,00 186,79 Kg 13/217984 11.957,40
NF 27,00 89,46 Kg 13/217985 6.774,12
NF 16,00 71,41 Kg 13/217986 4.762,44
NF 6,00 17,80 Kg 13/217988 1.452,12
NF 7,00 18,72 Kg 13/217989 1.617,60
TP doc. QuantidadePeso Série/N.ºdocumentoValor nota
NF 17,00 46,07 Kg 13/218004 2672.40
NF 16,00 69,53 Kg 13/218005 5454.24
NF 10,00 45,71 Kg 13/218008 3637.20
NF 9,00 27,54 Kg 13/218009 1337.04
NF 7,00 29,33 Kg 13/218012 2450.28
NF 7,00 19,74 Kg 13/218014 1928.64
NF 7,00 19,74 Kg 13/218016 1928.64
NF 14,00 39,61 Kg 13/218020 3732.96
NF 14,00 47,18 Kg 13/218022 2699.76
NF 13,00 46,25 Kg 13/218023 3135.60
NF 13,00 36,19 Kg 13/218024 3466.32
NF 12,00 30,56 Kg 13/218025 1886.40
NF 12,00 44,93 Kg 13/218026 3967.20
NF 11,00 38,82 Kg 13/218027 2653.20
NF 11,00 52,14 Kg 13/218028 3978.48
NF 11,00 38,81 Kg 13/218029 2579.28
NF 11,00 53,84 Kg 13/218030 3636.60
NF 10,00 28,08 Kg 13/218031 2547.60
NF 4,00 10,62 Kg 13/218039 612.96
NF 4,00 10,62 Kg 13/218040 612.96
NF 3,00 12,49 Kg 13/218041 907.92
NF 2,00 8,60 Kg 13/218043 675.36
NF 39,00 136,45 Kg 13/218051 8732.88
NF 34,00 115,59 Kg 13/218054 8642.04
NF 326,00 1.173,54 Kg13/218058 77340.24
NF 201,00 818,94 Kg 13/218060 41522.28
NF 153,00 537,95 Kg 13/218064 50893.92
NF 152,00 690,28 Kg 13/218065 32065.92
NF 139,00 656,24 Kg 13/218066 29323.44
NF 59,00 293,74 Kg 13/218069 11143.92
NF 59,00 190,90 Kg 13/218070 13710.48
NF 51,00 161,77 Kg 13/218071 10605.96
NF 50,00 264,92 Kg 13/218073 13860.00
NF 48,00 257,09 Kg 13/218076 13305.60
8/16/26, 10:32 AM LAYAN LOG - Documento - Sem título
https://layanlog.bsoft.app/versoes/versao5.0/relatorios/carrega_relatorio.php?id=transp_documentos2Multiplos&doc=espelhoCTRC&origem=d&idConhecim… 4/240
NF 8,00 26,65 Kg 13/217990 2.221,56
NF 25,00 115,85 Kg 13/217991 8.780,28
NF 24,00 60,19 Kg 13/217998 4.245,12
NF 24,00 100,61 Kg 13/217999 9.256,32
NF 24,00 108,86 Kg 13/218000 8.317,44
NF 48,00 141,12 Kg 13/218077 16548.48
NF 45,00 160,02 Kg 13/218082 12155.40
NF 45,00 158,22 Kg 13/218083 14968.80
NF 8,00 21,98 Kg 13/218086 1257.60
NF 18,00 51,70 Kg 13/218088 3741.12
Volumes: 2.211,00 Pesos: 8.706,04 Kg Valor: 579.188,40
Manifesto de Carga
N.º Data Emissão Usuário Emissão Data Fechamento Usuário Fechamento
112 * 15/08/2026 Leandro Costa Barbosa
* Manifesto Atual
Observações
SH: 9990997
Isenção do ICMS conforme item 162 do Anexo X do RICMS/MG
Ocorrências
Data Ocorrência Referência Série / N.º NF Recebedor Usuário
Declaro que recebi os volumes deste conhecimento de transporte em perfeito estado pelo que dou por cumprido o presente contrato de transporte N.º : 453
Nome
 
Assinatura / Carimbo
Chegada data / Hora
 
RG
 
Saída data / Hora
 
16/08/26 10:31 AM Bsoft TMS - www.bsoft.com.br
8/16/26, 10:32 AM LAYAN LOG - Documento - Sem título
https://layanlog.bsoft.app/versoes/versao5.0/relatorios/carrega_relatorio.php?id=transp_documentos2Multiplos&doc=espelhoCTRC&origem=d&idConhecim… 5/240
```


