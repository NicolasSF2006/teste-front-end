import { asset } from '../utils/assets';
const groups = [
  ['Institucional', 'Sobre Nós', 'Movimento', 'Trabalhe conosco'],
  ['Ajuda', 'Suporte', 'Fale Conosco', 'Perguntas Frequentes'],
  ['Termos', 'Termos e Condições', 'Política de Privacidade', 'Troca e Devolução'],
];
export default function Footer() {
  return <footer id="rodape">
    <div className="footer-main"><div className="container footer-inner">
      <div className="footer-about">
        <a href="#inicio" aria-label="Econverse — início"><img src={asset('footer-Grupo9.svg')} alt="Econverse" /></a>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <div className="social-icons" aria-label="Redes sociais">
          <img src={asset('footer-Instagram.svg')} alt="Instagram" />
          <img src={asset('footer-Facebook.svg')} alt="Facebook" />
          <img src={asset('footer-Linkedin.svg')} alt="LinkedIn" />
        </div>
      </div>
      <span className="footer-divider" aria-hidden="true"><img src={asset('footer-Line4.svg')} alt="" /></span>
      <div className="footer-groups">{groups.map(([title, ...items]) => <div key={title}><h2>{title}</h2>
        <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div>
    </div></div>
    <p className="footer-bottom">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </footer>;
}
