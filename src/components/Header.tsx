import type { FormEvent } from 'react';
import { asset } from '../utils/assets';

interface Props { onSearch: (query: string) => void; cartCount: number; }
export default function Header({ onSearch, cartCount }: Props) {
  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSearch(String(data.get('query') ?? '').trim());
    document.getElementById('produtos')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return <header className="site-header" id="inicio">
    <div className="container">
      <ul className="benefits" aria-label="Benefícios da loja">
        <li><img src={asset('header-ShieldCheck.svg')} alt="" /><span>Compra <strong>100% segura</strong></span></li>
        <li><img src={asset('header-Truck.svg')} alt="" /><span><strong>Frete grátis</strong> acima de R$ 200</span></li>
        <li><img src={asset('header-CreditCard.svg')} alt="" /><span><strong>Parcele</strong> suas compras</span></li>
      </ul>
      <div className="header-main">
        <a href="#inicio" aria-label="Econverse — início" className="header-logo"><img src={asset('header-Logo.svg')} alt="Econverse" /></a>
        <form className="search" role="search" onSubmit={search}>
          <label htmlFor="search-query" className="sr-only">Buscar produtos</label>
          <input id="search-query" name="query" type="search" placeholder="O que você está buscando?" />
          <button type="submit" aria-label="Buscar"><img src={asset('header-MagnifyingGlass.svg')} alt="" /></button>
        </form>
        <div className="header-actions" aria-label="Área do cliente">
          <span title="Meus pedidos"><img className="orders-icon" src={asset('header-Group.svg')} alt="Meus pedidos" /></span>
          <span title="Favoritos"><img src={asset('header-Heart.svg')} alt="Favoritos" /></span>
          <span title="Minha conta"><img src={asset('header-UserCircle.svg')} alt="Minha conta" /></span>
          <span className="cart" title={`Carrinho com ${cartCount} itens`} role="img" aria-label={`Carrinho com ${cartCount} itens`}>
            <img src={asset('header-ShoppingCart.svg')} alt="" />
            {cartCount > 0 && <span className="cart-count" aria-hidden="true">{cartCount}</span>}
          </span>
        </div>
      </div>
      <nav className="main-nav" aria-label="Navegação principal">
        <a href="#categorias">Todas Categorias</a><span aria-disabled="true" title="Categoria indisponível no catálogo fornecido">Supermercado</span>
        <span aria-disabled="true" title="Categoria indisponível no catálogo fornecido">Livros</span><span aria-disabled="true" title="Categoria indisponível no catálogo fornecido">Moda</span>
        <a href="#produtos-2">Lançamentos</a><a href="#produtos" className="active">Ofertas do dia</a>
        <a href="#newsletter"><img src={asset('header-CrownSimple.svg')} alt="" />Assinatura</a>
      </nav>
    </div>
  </header>;
}
