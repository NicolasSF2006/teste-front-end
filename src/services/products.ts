import type { Product } from '../types';

export const PRODUCTS_ENDPOINT = 'https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json';

function parseProducts(value: unknown): Product[] {
  if (typeof value !== 'object' || value === null) throw new Error('Resposta inválida.');
  const data = value as Record<string, unknown>;
  if (data.success !== true || !Array.isArray(data.products)) throw new Error('Resposta inválida.');
  if (!data.products.every((item: unknown) => {
    if (typeof item !== 'object' || item === null) return false;
    const p = item as Record<string, unknown>;
    return typeof p.productName === 'string' && p.productName.trim().length > 0
      && typeof p.descriptionShort === 'string' && typeof p.photo === 'string'
      && /^https?:\/\//.test(p.photo)
      && typeof p.price === 'number' && Number.isFinite(p.price) && p.price >= 0;
  })) throw new Error('Produtos inválidos.');
  return data.products as Product[];
}

async function request(url: string, signal: AbortSignal): Promise<Product[]> {
  signal.throwIfAborted();
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal.addEventListener('abort', cancel, { once: true });
  const timeout = window.setTimeout(cancel, 4000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return parseProducts(await response.json());
  } finally {
    window.clearTimeout(timeout);
    signal.removeEventListener('abort', cancel);
  }
}

export async function loadProducts(signal: AbortSignal): Promise<Product[]> {
  try { return await request(PRODUCTS_ENDPOINT, signal); }
  catch { signal.throwIfAborted(); }
  try { return await request(`${import.meta.env.BASE_URL}data/produtos.json`, signal); }
  catch {
    signal.throwIfAborted();
    throw new Error('Não foi possível carregar os produtos. Tente novamente.');
  }
}
