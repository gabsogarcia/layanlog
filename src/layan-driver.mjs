import { chromium } from 'playwright-core';
import sparticuzChromium from '@sparticuz/chromium';

const BASE = 'https://layanlog.bsoft.app';
const GRADE = `${BASE}/versoes/versao5.0/rotinas/c.php?id=cadastro_pessoas&menu=s`;

const text = async page => page.locator('body').innerText().catch(() => '');
const fill = async (page, name, value) => {
  if (value == null) return;
  const field = page.locator(`[name="${name}"]`).first();
  await field.fill('');
  await field.pressSequentially(String(value), { delay: 80 });
  await field.evaluate(e => { e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); e.dispatchEvent(new Event('blur', { bubbles: true })); });
};
const typeReal = async (field, value) => {
  await field.fill('');
  await field.pressSequentially(String(value ?? ''), { delay: 80 });
  await field.evaluate(e => { e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); e.dispatchEvent(new Event('blur', { bubbles: true })); });
};
const check = async (page, selector) => {
  const field = page.locator(selector).first();
  if (await field.count() && !(await field.isChecked())) await field.check();
};
const next = async page => { await page.locator('#botao_avancar').click(); await page.waitForTimeout(500); };
const formatPlate = value => {
  const raw = String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return raw.length === 7 ? `${raw.slice(0, 3)}-${raw.slice(3)}` : String(value ?? '').toUpperCase();
};
async function searchSelect(page, searchName, selectName, query, expectedLabel) {
  const search = page.locator(`[name="${searchName}"]`).first();
  await search.fill('');
  await search.pressSequentially(String(query), { delay: 80 });
  await search.evaluate(e => {
    e.dispatchEvent(new Event('input', { bubbles: true }));
    e.dispatchEvent(new Event('change', { bubbles: true }));
    e.dispatchEvent(new Event('blur', { bubbles: true }));
  });
  await search.press('Enter').catch(() => {});
  await page.waitForFunction(({ name, label }) => {
    const select = document.querySelector(`select[name="${name}"]`);
    return select && [...select.options].some(o => o.textContent.trim().toLowerCase().includes(String(label).toLowerCase()));
  }, { name: selectName, label: expectedLabel ?? query }, { timeout: 3000 });
  const select = page.locator(`[name="${selectName}"]`).first();
  const options = await select.locator('option').evaluateAll(os => os.map(o => ({ value: o.value, label: o.textContent.trim() })));
  const wanted = String(expectedLabel ?? query).toLowerCase().trim();
  const normalizeName = value => value.toLowerCase()
    .replace(/^\s*[a-z]{2}\s*[-/]\s*/i, '')
    .replace(/\s*[/|-]\s*[a-z]{2}\s*$/i, '')
    .trim();
  const found = options.find(o => normalizeName(o.label) === normalizeName(wanted)) ?? options.find(o => o.label.toLowerCase().includes(wanted));
  if (!found) throw new Error(`opção não encontrada: ${expectedLabel ?? query}`);
  await select.selectOption(found.value);
  return { value: found.value, label: found.label };
}

export async function cadastrarMotoristaNoLayan(payload, options = {}) {
  const username = options.username ?? process.env.LAYAN_USER;
  const password = options.password ?? process.env.LAYAN_PASSWORD;
  if (!username || !password) return { sucesso: false, motivo: 'credenciais_ausentes', detalhe: 'Configure LAYAN_USER e LAYAN_PASSWORD.' };
  const timeoutMs = options.timeoutMs ?? 10000;
  const started = Date.now();
  const trace = step => console.log(`[layan-driver][motorista] ${step}`);
  const browser = await chromium.launch({ args: sparticuzChromium.args, executablePath: await sparticuzChromium.executablePath(), headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(timeoutMs);
  page.setDefaultNavigationTimeout(timeoutMs);
  let dialogError = null;
  const requestFailures = [];
  page.on('requestfailed', request => requestFailures.push({ url: request.url(), failure: request.failure()?.errorText ?? 'unknown' }));
  page.on('dialog', async dialog => { dialogError = dialog.message(); await dialog.dismiss(); });
  const snapshot = async step => console.log(JSON.stringify({ etapa: step, url: page.url(), titulo: await page.title().catch(() => ''), body: (await text(page)).replace(/\s+/g, ' ').slice(0, 500), requestFailures: requestFailures.slice(-10), dialog: dialogError }));
  try {
    trace('abrindo login'); await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await typeReal(page.getByRole('textbox', { name: 'Digite seu usuário aqui...' }), username);
    await typeReal(page.getByRole('textbox', { name: 'Digite sua senha aqui...' }), password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    trace('login enviado'); await snapshot('login enviado'); await page.screenshot({ path: `/tmp/layan-post-login-${Date.now()}.png` }).catch(() => {});
    await snapshot('URL atual depois do login');
    trace('navegação para a grade iniciada');
    await page.goto(GRADE, { waitUntil: 'domcontentloaded' });
    await snapshot('grade carregada');
    trace('botão Adicionar encontrado'); await page.locator('a[swktl="Adicionar"]').click();
    await page.waitForURL(/formulario\.php.*rotina=cadastro_pessoas/, { timeout: timeoutMs });
    await snapshot('formulário aberto');

    await check(page, '[name="dados_grupos_id[]"][value="11"]');
    await check(page, '[name="dados_grupos_id[]"][value="17"]');
    await next(page);

    await page.locator('[name="dados_fisica_juridica"][value="F"]').check();
    await fill(page, 'dados_CPF', payload.cpf);
    await fill(page, 'dados_nome', payload.nome);
    await fill(page, 'dados_sobrenome', payload.sobrenome);
    if (await page.locator('[name="dados_RNTRC"]').count()) await fill(page, 'dados_RNTRC', payload.rntrc ?? '12345678');
    await next(page);
    if (!(await page.locator('[name="dados_CEP"]').count())) {
      const active = await page.evaluate(() => ({ name: document.activeElement?.name, id: document.activeElement?.id })).catch(() => ({}));
      return { sucesso: false, motivo: active.name === 'dados_nome' ? 'campo_obrigatorio_vazio' : 'timeout_sem_navegacao', detalhe: null, campoFoco: active, url: page.url(), duracaoMs: Date.now() - started };
    }

    await page.locator('[name="dados_nacional_estrangeiro"]').first().check().catch(() => {});
    const cepField = page.locator('[name="dados_CEP"]');
    await cepField.fill('');
    await cepField.pressSequentially(String(payload.cep ?? '01001-000'), { delay: 80 });
    await page.locator('[name="dados_CEP"]').press('Tab');
    await cepField.evaluate(e => e.dispatchEvent(new Event('change', { bubbles: true })));
    // O formulário legado dispara a consulta quando o ícone ao lado do CEP
    // é clicado. Tenta o controle no mesmo contêiner antes de aguardar.
    const cepContainer = cepField.locator('xpath=..');
    const cepActions = cepContainer.locator('button, input[type="button"], input[type="image"], a, i');
    if (await cepActions.count()) await cepActions.last().click().catch(() => {});
    let cepAutoPreenchido = false;
    await page.waitForFunction(() => {
      const v = n => document.querySelector(`[name="${n}"]`)?.value?.trim();
      return v('dados_estado') && v('dados_bairro') && v('dados_localidade') && (v('dados_cidade_id') || v('pesquisa_cidade_id'));
    }, null, { timeout: 8000 }).then(() => { cepAutoPreenchido = true; }).catch(() => {});
    if (!(await page.locator('[name="dados_cidade_id"]').inputValue())) {
      // Em execução serverless, o serviço de CEP pode não responder. Nunca
      // assume uma cidade: usa somente os dados de endereço fornecidos pelo
      // chamador como alternativa explícita.
      if (!payload.cidade || !payload.estado) {
        return { sucesso: false, motivo: 'autocomplete_cep_falhou', detalhe: 'O CEP não preencheu os campos dependentes e o payload não contém cidade/UF alternativos.', url: page.url(), duracaoMs: Date.now() - started };
      }
      try {
        await page.locator('[name="dados_estado"]').selectOption({ label: String(payload.estado).toUpperCase() }).catch(() => {});
        await searchSelect(page, 'pesquisa_cidade_id', 'dados_cidade_id', payload.cidade, payload.cidade);
        await fill(page, 'dados_bairro', payload.bairro ?? '');
        await fill(page, 'dados_logradouro', payload.logradouro ?? '');
      } catch (error) {
        return { sucesso: false, motivo: 'autocomplete_cep_falhou', detalhe: `CEP sem resposta e busca alternativa de cidade falhou: ${error.message}`, url: page.url(), duracaoMs: Date.now() - started };
      }
    }
    await fill(page, 'dados_nro', payload.numero ?? '1');
    await check(page, '[name="dados_naoContribuinte[]"]');
    await check(page, '[name="dados_naoInformar[]"]');
    await next(page);

    // Ao incluir o grupo Proprietários Veículos, algumas contas exibem RNTRC
    // como campo adicional obrigatório. Preenche apenas se o campo existir.
    if (await page.locator('[name="dados_RNTRC"], [name="dados_RNTRC_numero"]').count()) {
      await fill(page, 'dados_RNTRC', payload.rntrc ?? '12345678');
      await fill(page, 'dados_RNTRC_numero', payload.rntrc ?? '12345678');
    }

    const save = page.locator('input[value="Salvar"], button:has-text("Salvar")').first();
    await save.click();
    try {
      await page.waitForURL(/preview\.php[^\n]*[?&]id=\d+/, { timeout: timeoutMs });
      const match = new URL(page.url()).searchParams.get('id');
      return { sucesso: true, layanMotoristaId: match, url: page.url(), cepAutoPreenchido, duracaoMs: Date.now() - started };
    } catch {
      const active = await page.evaluate(() => ({ name: document.activeElement?.name, id: document.activeElement?.id })).catch(() => ({}));
      if (!dialogError && active.name === 'dados_RNTRC' && await page.locator('[name="dados_RNTRC"]').count()) {
        await fill(page, 'dados_RNTRC', payload.rntrc ?? '12345678');
        try {
          await page.locator('input[value="Salvar"], button:has-text("Salvar")').first().click();
          await page.waitForURL(/preview\.php[^\n]*[?&]id=\d+/, { timeout: timeoutMs });
          const match = new URL(page.url()).searchParams.get('id');
          return { sucesso: true, layanMotoristaId: match, url: page.url(), cepAutoPreenchido, duracaoMs: Date.now() - started };
        } catch { /* continua para o diagnóstico normal abaixo */ }
      }
      const body = await text(page);
      return {
        sucesso: false,
        motivo: dialogError ? 'mensagem_erro' : active.name === 'dados_nome' ? 'campo_obrigatorio_vazio' : 'timeout_sem_navegacao',
        detalhe: dialogError ?? body.match(/.{0,80}(erro|obrigat|duplic|inválid).{0,120}/i)?.[0] ?? null,
        ...(dialogError ? {} : { campoFoco: active }),
        url: page.url(),
        duracaoMs: Date.now() - started
      };
    }
  } catch (error) {
    return { sucesso: false, motivo: 'erro_driver', detalhe: error.message, url: page.url(), duracaoMs: Date.now() - started };
  } finally { await browser.close(); }
}

export async function cadastrarVeiculoNoLayan(payload, options = {}) {
  const username = options.username ?? process.env.LAYAN_USER;
  const password = options.password ?? process.env.LAYAN_PASSWORD;
  if (!username || !password) return { sucesso: false, motivo: 'credenciais_ausentes', detalhe: 'Configure LAYAN_USER e LAYAN_PASSWORD.' };
  const timeoutMs = options.timeoutMs ?? 10000;
  const started = Date.now();
  const browser = await chromium.launch({ args: sparticuzChromium.args, executablePath: await sparticuzChromium.executablePath(), headless: true });
  const page = await browser.newPage();
  let dialogError = null;
  page.on('dialog', async dialog => { dialogError = dialog.message(); await dialog.dismiss(); });
  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await typeReal(page.getByRole('textbox', { name: 'Digite seu usuário aqui...' }), username);
    await typeReal(page.getByRole('textbox', { name: 'Digite sua senha aqui...' }), password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    trace(`pós-login URL=${page.url()}`);
    await page.goto(`${BASE}/versoes/versao5.0/rotinas/c.php?id=trans_veiculos&menu=s`, { waitUntil: 'domcontentloaded' });
    await page.locator('a[swktl="Adicionar"]').click();
    await page.waitForURL(/formulario\.php.*rotina=trans_veiculos/, { timeout: timeoutMs });

    await fill(page, 'dados_placa', formatPlate(payload.placa));
    await searchSelect(page, 'pesquisa_gruposVeiculos_id', 'dados_gruposVeiculos_id', payload.grupo ?? 'FROTA TERCEIROS', payload.grupo ?? 'FROTA TERCEIROS');
    await searchSelect(page, 'pesquisa_categoriasVeiculos_id', 'dados_categoriasVeiculos_id', payload.categoria ?? 'CAVALO', payload.categoria ?? 'CAVALO');
    await searchSelect(page, 'pesquisa_proprietario_id', 'dados_proprietario_id', payload.proprietarioNome, payload.proprietarioNome);
    await searchSelect(page, 'pesquisa_motorista_id', 'dados_motorista_id', payload.motoristaNome, payload.motoristaNome);
    if (await page.locator('[name="dados_codIBGE"]').count()) {
      await searchSelect(page, 'pesquisa_codIBGE', 'dados_codIBGE', payload.cidade ?? 'Montes Claros', payload.cidade ?? 'Montes Claros');
    }
    if (await page.locator('[name="dados_capM3"]').count() && payload.capacidadeM3 != null) await fill(page, 'dados_capM3', payload.capacidadeM3);
    await page.getByRole('button', { name: 'Cadastrar', exact: true }).click();
    try {
      await page.waitForURL(/preview\.php[^\n]*[?&]id=\d+/, { timeout: timeoutMs });
      const body = await text(page);
      const id = new URL(page.url()).searchParams.get('id');
      return { sucesso: true, layanVeiculoId: id, url: page.url(), confirmacao: /Veículo cadastrado com sucesso/i.test(body), duracaoMs: Date.now() - started };
    } catch {
      return { sucesso: false, motivo: dialogError ? 'mensagem_erro' : 'timeout_sem_navegacao', detalhe: dialogError ?? null, url: page.url(), duracaoMs: Date.now() - started };
    }
  } catch (error) {
    return { sucesso: false, motivo: dialogError ? 'mensagem_erro' : 'erro_driver', detalhe: dialogError ?? error.message, url: page.url(), duracaoMs: Date.now() - started };
  } finally { await browser.close(); }
}
