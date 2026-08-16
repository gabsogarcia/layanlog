export const LUNA_PROMPT = `Você classifica uma entrada de cadastro de motorista. Responda SOMENTE JSON válido, sem markdown, neste schema exato:
{"campo_identificado":"nome|cpf|placa|cnhFoto|cnhNumero|crlvFoto|nao_identificado","valor_extraido":string|null,"confianca_textual":"alta|media|baixa","observacao":string|null}
Regras: uma saudação ou conteúdo sem dado cadastral é nao_identificado. Para imagem, classifique CNH como cnhFoto/cnhNumero e CRLV como crlvFoto; não invente texto ilegível. Preserve URLs de imagem em valor_extraido quando aplicável. A confiança é uma autoavaliação, não um score calibrado.`;

export function parseLunaJson(raw) {
  const text = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('resposta Luna não contém JSON');
  const parsed = JSON.parse(match[0]);
  const allowed = ['nome','cpf','placa','cnhFoto','cnhNumero','crlvFoto','nao_identificado'];
  if (!allowed.includes(parsed.campo_identificado)) throw new Error('campo_identificado inválido');
  if (!['alta','media','baixa'].includes(parsed.confianca_textual)) throw new Error('confianca_textual inválida');
  return parsed;
}

export async function classifyWithKie(input, { apiKey = process.env.KIE_API_KEY, fetchImpl = fetch, timeoutMs = 30000 } = {}) {
  if (!apiKey) throw new Error('KIE_API_KEY não configurada');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const content = input.kind === 'image'
      ? [{ type: 'input_text', text: LUNA_PROMPT }, { type: 'input_image', image_url: input.value }]
      : [{ type: 'input_text', text: `${LUNA_PROMPT}\nEntrada textual: ${input.value}` }];
    const response = await fetchImpl('https://api.kie.ai/codex/v1/responses', {
      method: 'POST', signal: controller.signal,
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-5-6-luna', stream: false, input: [{ role: 'user', content }], tools: [] })
    });
    if (!response.ok) throw new Error(`Kie HTTP ${response.status}`);
    const body = await response.json();
    if (body && typeof body.code === 'number' && body.code !== 0) {
      throw new Error(`Kie API ${body.code}: ${body.msg ?? 'erro sem mensagem'}`);
    }
    const text = body.output_text ?? body.output?.[0]?.content?.[0]?.text ?? body.choices?.[0]?.message?.content;
    if (!text) throw new Error('resposta Kie sem texto estruturado');
    return parseLunaJson(text);
  } finally { clearTimeout(timer); }
}
