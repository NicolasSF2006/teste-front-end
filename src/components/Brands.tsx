import SectionHeading from './SectionHeading';
import { asset } from '../utils/assets';
export default function Brands() {
  return <section className="brands" aria-labelledby="brands-title">
    <SectionHeading id="brands-title" lines={false}>Navegue por marcas</SectionHeading>
    <div className="brand-list">{[0, 1, 2, 3, 4].map((i) => <a className="brand" key={i} href="#produtos" aria-label="Ver produtos Econverse">
      <img src={asset('header-Logo.svg')} alt="Econverse" loading="lazy" />
    </a>)}</div>
  </section>;
}
