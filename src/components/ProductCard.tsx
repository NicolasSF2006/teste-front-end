import type { Product } from '../types';
import ProductImage from './ProductImage';
import { money } from '../utils/format';

interface Props { product: Product; onSelect: (product: Product) => void; }
export default function ProductCard({ product, onSelect }: Props) {
  return <article className="product-card" onClick={() => onSelect(product)}>
    <button type="button" className="product-card__image" aria-label={`Ver detalhes de ${product.productName}`}>
      <ProductImage product={product} />
    </button>
    <div className="product-card__body">
      <h3 className="product-card__name"><button type="button">{product.productName}</button></h3>
      <div className="product-card__previous-price" aria-hidden="true" />
      <p className="product-card__price">{money(product.price)}</p>
      <p className="product-card__installment">ou 2x de {money(product.price / 2)} sem juros</p>
      <p className="product-card__shipping">Frete grátis</p>
      <button type="button" className="purchase-button" aria-label={`Comprar ${product.productName}`}>Comprar</button>
    </div>
  </article>;
}
