import { useState, type FormEvent } from 'react';
export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.namedItem('name') as HTMLInputElement;
    name.value = name.value.trim();
    if (form.reportValidity()) setSubmitted(true);
  };
  return <section className="newsletter" id="newsletter" aria-labelledby="newsletter-title">
    <div className="newsletter-inner container">
      <div><h2 id="newsletter-title">Inscreva-se na nossa newsletter</h2>
        <p>Assine a nossa newsletter e receba as novidades e conteúdos exclusivos da Econverse.</p></div>
      <form onSubmit={submit}>
        <div className="newsletter-fields">
          <label className="sr-only" htmlFor="newsletter-name">Nome</label>
          <input id="newsletter-name" name="name" autoComplete="given-name" placeholder="Digite seu nome" required
            pattern={'.*\\S.*'} title="Informe um nome com pelo menos um caractere que não seja espaço."
            onChange={(event) => {
              event.currentTarget.setCustomValidity(event.currentTarget.value.trim() ? '' : 'Informe seu nome.');
              setSubmitted(false);
            }} />
          <label className="sr-only" htmlFor="newsletter-email">E-mail</label>
          <input id="newsletter-email" name="email" type="email" autoComplete="email" placeholder="Digite seu e-mail" required />
          <button className="yellow-button" type="submit">Inscrever</button>
        </div>
        <label className="newsletter-consent"><input type="checkbox" name="consent" required />Aceito os termos e condições</label>
        {submitted && <p className="newsletter-status" role="status">Formulário validado. Cadastro demonstrativo, sem envio.</p>}
      </form>
    </div>
  </section>;
}
