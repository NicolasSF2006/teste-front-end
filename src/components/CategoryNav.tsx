import { asset } from '../utils/assets';
const categories = [
  ['Tecnologia', 'Image'], ['Supermercado', 'Supermercados1'], ['Bebidas', 'Whiskey'],
  ['Ferramentas', 'Ferramentas1'], ['Saúde', 'CuidadosDeSaude1'], ['Esportes e Fitness', 'Corrida1'], ['Moda', 'Moda1'],
];
interface Props { onTechnology: () => void; }
export default function CategoryNav({ onTechnology }: Props) {
  return <nav className="category-nav" id="categorias" aria-label="Compre por categoria">
    {categories.map(([label, image], index) => {
      const content = <>
        <span className="category-icon"><img src={asset(`categories-${image}.png`)} alt="" width={index === 6 ? 63 : 61} height={index === 6 ? 63 : 61} /></span>
        <span>{label}</span>
      </>;
      return index === 0
        ? <a href="#produtos" key={label} className="category-item active" onClick={onTechnology}>{content}</a>
        : <div key={label} className="category-item" aria-disabled="true" title="Categoria indisponível no catálogo fornecido">{content}</div>;
    })}
  </nav>;
}
