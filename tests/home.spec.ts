import { test, expect } from '@playwright/test';
const endpoint = '**/lista-produtos/produtos.json';

test.beforeEach(async ({ page }) => {
  await page.route(endpoint, (route) => route.abort());
  await page.route('**/fotos-produtos/*', (route) => route.abort());
});

test('fallback local exibe as três vitrines e todos os assets', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Venha conhecer nossaspromoções');
  await expect(page.locator('#produtos .product-card')).toHaveCount(10);
  await expect(page.locator('.product-card')).toHaveCount(30);
  await expect(page.locator('.partner-banner')).toHaveCount(4);
  await expect(page.locator('.brand')).toHaveCount(5);
  await page.evaluate(() => document.querySelectorAll('img').forEach((image) => { image.loading = 'eager'; }));
  await expect.poll(() => page.locator('img').evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
});

test('prioriza resposta remota válida', async ({ page }) => {
  await page.route(endpoint, (route) => route.fulfill({ json: { success: true, products: [
    { productName: 'Produto remoto', descriptionShort: 'Descrição do produto remoto', photo: 'https://example.com/item.png', price: 123.45 },
  ] } }));
  await page.route('https://example.com/item.png', (route) => route.abort());
  let localRequests = 0;
  page.on('request', (request) => { if (request.url().includes('/data/produtos.json')) localRequests++; });
  await page.goto('/');
  await expect(page.locator('#produtos .product-card')).toHaveCount(1);
  await expect(page.locator('#produtos')).toContainText('R$ 123,45');
  expect(localRequests).toBe(0);
});

test('resposta remota inválida também usa a cópia local', async ({ page }) => {
  await page.route(endpoint, (route) => route.fulfill({ json: { success: true, products: [{ price: 'inválido' }] } }));
  await page.goto('/');
  await expect(page.locator('#produtos .product-card')).toHaveCount(10);
});

test('modal usa produto clicado, quantidade, foco e fecha por Esc e fundo', async ({ page }) => {
  await page.goto('/');
  const trigger = page.locator('#produtos').getByRole('button', { name: 'Ver detalhes de Iphone 11 PRO MAX BRANCO 1', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading')).toHaveText('Iphone 11 PRO MAX BRANCO 1');
  await expect(dialog).toContainText('R$ 15.000,00');
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  await expect(dialog.getByRole('button', { name: /diminuir/i })).toBeDisabled();
  await expect(dialog.getByLabel('Quantidade', { exact: true })).toHaveText('01');
  const increase = dialog.getByRole('button', { name: /aumentar/i });
  await increase.click();
  await expect(dialog.getByLabel('Quantidade', { exact: true })).toHaveText('02');
  await dialog.getByRole('button', { name: /diminuir/i }).click();
  await expect(dialog.getByLabel('Quantidade', { exact: true })).toHaveText('01');
  await expect(dialog.getByRole('button', { name: /diminuir/i })).toBeDisabled();
  await increase.click();
  await dialog.getByRole('button', { name: /^comprar$/i }).click();
  
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.querySelector('dialog')?.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('img', { name: 'Carrinho com 2 itens' })).toBeVisible();
  await trigger.click();
  await page.mouse.click(5, 5);
  await expect(dialog).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
  const otherTrigger = page.locator('#produtos .purchase-button').nth(1);
  await otherTrigger.click();
  await expect(dialog.getByRole('heading')).toHaveText('IPHONE 13 MINI 1');
  await expect(dialog).toContainText('R$ 9.000,00');
  await expect(dialog.getByLabel('Quantidade', { exact: true })).toHaveText('01');
  await dialog.getByRole('button', { name: /fechar/i }).click();
  await expect(dialog).toHaveCount(0);
  await expect(otherTrigger).toBeFocused();
});

test('busca, categoria vazia e carrossel respondem aos controles', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#produtos .product-card')).toHaveCount(10);
  const track = page.locator('#produtos .product-carousel');
  await page.locator('#produtos').getByRole('button', { name: 'Próximos produtos' }).click();
  await expect.poll(() => track.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
  await page.getByRole('searchbox').fill('MINI');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();
  await expect(page.locator('#produtos .product-card')).toHaveCount(5);
  await page.getByRole('button', { name: 'ACESSÓRIOS', exact: true }).click();
  await expect(page.locator('#produtos')).toContainText('Nenhum produto');
  await page.getByRole('button', { name: 'VER TODOS', exact: true }).click();
  await expect(page.locator('#produtos .product-card')).toHaveCount(5);
});

test('falha de ambas as fontes oferece tentativa novamente', async ({ page }) => {
  await page.route('**/data/produtos.json', (route) => route.fulfill({ status: 503, body: 'indisponível' }));
  await page.goto('/');
  await expect(page.locator('#produtos').getByRole('alert')).toContainText('Não foi possível carregar');
  await page.unroute('**/data/produtos.json');
  await page.locator('#produtos').getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.locator('#produtos .product-card')).toHaveCount(10);
});

test('tela móvel não possui overflow e modal cabe na viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.locator('#produtos .product-card')).toHaveCount(10);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.locator('#produtos .product-card__image').first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const bounds = await dialog.boundingBox();
  expect(bounds!.width).toBeLessThanOrEqual(375);
  expect(bounds!.height).toBeLessThanOrEqual(812);
  await dialog.getByRole('button', { name: /fechar/i }).click();
  await expect(dialog).toHaveCount(0);
});

test('marcas e cabeçalho cabem em larguras intermediárias', async ({ page }) => {
  for (const width of [768, 1201, 1280, 1320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('#produtos .product-card')).toHaveCount(10);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});
test('newsletter rejeita espaços, e-mail inválido e ausência de consentimento', async ({ page }) => {
  await page.goto('/');
  const name = page.getByRole('textbox', { name: 'Nome', exact: true });
  const email = page.getByRole('textbox', { name: 'E-mail', exact: true });
  const consent = page.getByRole('checkbox', { name: 'Aceito os termos e condições' });
  const submit = page.getByRole('button', { name: 'Inscrever', exact: true });
  const status = page.locator('.newsletter-status');
  await email.fill('ana@example.com');
  await consent.check();
  for (const blankName of ['   ', '\t', '\u00a0']) {
    await name.fill(blankName);
    await submit.click();
    expect(await name.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(false);
    await expect(status).toHaveCount(0);
  }
  await name.fill('  Ana Silva  ');
  await email.fill('email-invalido');
  await submit.click();
  expect(await email.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(false);
  await expect(status).toHaveCount(0);
  await email.fill('ana@example.com');
  await consent.uncheck();
  await submit.click();
  await expect(status).toHaveCount(0);
  await consent.check();
  await submit.click();
  await expect(status).toContainText('Formulário validado');
  await expect(name).toHaveValue('Ana Silva');
});

test('categorias sem catálogo são estáticas e Tecnologia restaura a vitrine de celulares', async ({ page }) => {
  await page.goto('/');
  const categories = page.getByRole('navigation', { name: 'Compre por categoria' });
  await expect(categories.getByRole('link')).toHaveCount(1);
  await expect(categories.locator('.category-item[aria-disabled="true"]')).toHaveCount(6);
  for (const label of ['Supermercado', 'Bebidas', 'Ferramentas', 'Saúde', 'Esportes e Fitness', 'Moda']) {
    await expect(categories.getByText(label, { exact: true })).toBeVisible();
    await expect(categories.getByRole('link', { name: label, exact: true })).toHaveCount(0);
  }
  const mainNav = page.getByRole('navigation', { name: 'Navegação principal' });
  for (const label of ['Supermercado', 'Livros', 'Moda']) {
    await expect(mainNav.getByText(label, { exact: true })).toHaveAttribute('aria-disabled', 'true');
    await expect(mainNav.getByRole('link', { name: label, exact: true })).toHaveCount(0);
  }
  await page.getByRole('searchbox').fill('MINI');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();
  await page.getByRole('button', { name: 'TABLETS', exact: true }).click();
  await expect(page.locator('#produtos .product-card')).toHaveCount(0);
  await categories.getByRole('link', { name: 'Tecnologia', exact: true }).click();
  await expect(page.locator('#produtos .product-card')).toHaveCount(5);
  await expect(page.getByRole('button', { name: 'CELULAR', exact: true })).toHaveAttribute('aria-pressed', 'true');
});
