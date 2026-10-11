import { asset } from '../utils/assets';
export default function Hero() {
  return <section className="hero" aria-labelledby="hero-title">
    <img className="hero-background" src={asset('hero.png')} alt="" width="1440" height="390" fetchPriority="high" />
    <div className="container hero-content">
      <h1 id="hero-title">Venha conhecer nossas<br />promoções</h1>
      <p><strong>50% Off</strong> nos produtos</p>
      <a href="#produtos" className="yellow-button">Ver produto</a>
    </div>
  </section>;
}
