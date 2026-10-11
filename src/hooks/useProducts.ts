import { useCallback, useEffect, useState } from 'react';
import { loadProducts } from '../services/products';
import type { Product } from '../types';

export function useProducts() {
  const [attempt, setAttempt] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    void loadProducts(controller.signal).then((data) => {
      if (!controller.signal.aborted) setProducts(data);
    }).catch((reason: unknown) => {
      if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Erro ao carregar produtos.');
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [attempt]);
  return { products, loading, error, retry };
}
