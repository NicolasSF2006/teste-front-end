import { useState } from 'react';
import type { Product } from '../types';
import { asset } from '../utils/assets';

interface Props { product: Product; loading?: 'lazy' | 'eager'; className?: string; }
export default function ProductImage({ product, loading = 'lazy', className }: Props) {
  const [failed, setFailed] = useState(false);
  return <img className={className} src={failed ? asset('product-iphone.png') : product.photo}
    alt={product.productName} loading={loading} decoding="async" width="278" height="228"
    onError={() => { if (!failed) setFailed(true); }} />;
}
