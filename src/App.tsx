import { useCallback, useMemo, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryNav from './components/CategoryNav';
import ProductShelf from './components/ProductShelf';
import PartnerBanners from './components/PartnerBanners';
import Brands from './components/Brands';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import { useProducts } from './hooks/useProducts';
import { normalize } from './utils/format';
import type { Product } from './types';

export default function App() {
  const { products, loading, error, retry } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [query, setQuery] = useState('');
  const [productCategory, setProductCategory] = useState('CELULAR');
  const [cartCount, setCartCount] = useState(0);
  const filtered = useMemo(() => products.filter((p) => normalize(`${p.productName} ${p.descriptionShort}`).includes(normalize(query))), [products, query]);
  const close = useCallback(() => setSelectedProduct(null), []);
  const addToCart = useCallback((_product: Product, quantity: number) => setCartCount((n) => n + quantity), []);
  const shelfProps = { products: filtered, loading, error, retry, onSelect: setSelectedProduct, searchQuery: query };
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <Header onSearch={setQuery} cartCount={cartCount} />
    <main id="conteudo">
      <Hero />
      <div className="home-sections">
        <CategoryNav onTechnology={() => setProductCategory('CELULAR')} />
        <ProductShelf id="produtos" tabs category={productCategory} onCategoryChange={setProductCategory} {...shelfProps} />
        <PartnerBanners />
        <ProductShelf id="produtos-2" {...shelfProps} />
        <PartnerBanners />
        <Brands />
        <ProductShelf id="produtos-3" {...shelfProps} />
      </div>
      <Newsletter />
    </main>
    <Footer />
    {selectedProduct && <ProductModal product={selectedProduct} onClose={close} onAddToCart={addToCart} />}
  </>;
}
