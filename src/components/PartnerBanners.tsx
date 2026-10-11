import { asset } from '../utils/assets';
export default function PartnerBanners() {
  return <section className="partner-banners container" aria-label="Parceiros">
    {[0, 1].map((i) => <article className="partner-banner" key={i}>
      <img src={asset('partners-Image46.png')} alt="" loading="lazy" className="partner-banner__image" />
      <div className="partner-banner__content"><h2>Parceiros</h2>
        <p>Lorem ipsum dolor sit amet, consectetur</p>
        <a href="#produtos" className="yellow-button">Confira</a>
      </div>
    </article>)}
  </section>;
}
