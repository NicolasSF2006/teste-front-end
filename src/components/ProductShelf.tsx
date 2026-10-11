import { useRef } from 'react';
import ProductCard from './ProductCard';
import SectionHeading from './SectionHeading';
import type { Product } from '../types';

interface Props {
  id: string; products: Product[]; loading: boolean; error: string; retry: () => void;
  onSelect: (product: Product) => void; tabs?: boolean; searchQuery?: string;
  category?: string; onCategoryChange?: (category: string) => void;
}
const tabsList = ['CELULAR', 'ACESSÓRIOS', 'TABLETS', 'NOTEBOOKS', 'TVS', 'VER TODOS'];

export default function ProductShelf({ id, products, loading, error, retry, onSelect, tabs = false, searchQuery = '', category = 'CELULAR', onCategoryChange }: Props) {
  const track = useRef<HTMLDivElement>(null);
  // The provided technology feed contains phones and has no category field.
  const visible = tabs && category !== 'CELULAR' && category !== 'VER TODOS' ? [] : products;
  const scroll = (direction: number) => {
    const element = track.current;
    const card = element?.querySelector<HTMLElement>('.product-card');
    if (!element || !card) return;
    const gap = parseFloat(getComputedStyle(element).columnGap) || 18;
    element.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return <section className="product-shelf container" id={id} aria-labelledby={`${id}-title`} aria-busy={loading}>
    <SectionHeading id={`${id}-title`}>Produtos relacionados</SectionHeading>
    {tabs ? <nav className="product-tabs" aria-label="Categorias de produtos">
      {tabsList.map((name) => <button type="button" key={name} className={name === category ? 'active' : ''} aria-pressed={name === category}
        onClick={() => { onCategoryChange?.(name); track.current?.scrollTo({ left: 0 }); }}>{name}</button>)}
    </nav> : <button type="button" className="view-all" onClick={() => track.current?.scrollTo({ left: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>Ver todos</button>}
    <div className="carousel-wrapper">
      {loading ? <div className="shelf-feedback" role="status">Carregando produtos...</div>
        : error ? <div className="shelf-feedback" role="alert"><p>{error}</p><button type="button" className="purchase-button" onClick={retry}>Tentar novamente</button></div>
        : visible.length === 0 ? <div className="shelf-feedback" role="status">{searchQuery ? `Nenhum produto encontrado para “${searchQuery}”.` : 'Nenhum produto disponível nesta categoria.'}</div>
        : <>
          <button type="button" className="carousel-arrow carousel-arrow--left" aria-label="Produtos anteriores" onClick={() => scroll(-1)}><span aria-hidden="true">‹</span></button>
          <div className="product-carousel" ref={track} role="region" aria-label="Vitrine de produtos" tabIndex={0}>
            {visible.map((product, i) => <ProductCard key={`${product.productName}-${i}`} product={product} onSelect={onSelect} />)}
          </div>
          <button type="button" className="carousel-arrow carousel-arrow--right" aria-label="Próximos produtos" onClick={() => scroll(1)}><span aria-hidden="true">›</span></button>
        </>}
    </div>
  </section>;
}
