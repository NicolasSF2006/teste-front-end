# Teste Front-End Econverse

Home do teste técnico implementada em **React + TypeScript + Sass/SCSS**, com Vite e sem bibliotecas de UI.

## Requisitos

- Node.js 20.19+ ou 22.12+ (validado com Node 24).
- npm.
- Google Chrome instalado para executar os testes de navegador.

## Instalação e desenvolvimento

```bash
cd teste-front-end
npm install
npm run dev
```

Abra a URL mostrada pelo Vite, normalmente http://localhost:5173.

## Build de produção

```bash
npm run build
npm run preview
```

O build verifica os tipos com TypeScript e gera a aplicação estática em `dist/`. O preview serve o build, normalmente em http://localhost:4173.

## Implementação

- Cabeçalho, busca, hero, sete categorias, três vitrines, quatro banners de parceiros, cinco marcas, newsletter e rodapé na ordem da Home.
- Componentes reutilizáveis para vitrines, cards, títulos, imagens e banners.
- Modal baseado no Popup do Figma, com nome, imagem, preço, descrição, quantidade e botão Comprar.
- Modal nativo com isolamento de foco, Escape, clique no fundo, fechamento por botão, restauração de foco e bloqueio de rolagem.
- Busca por nome/descrição, carrosséis horizontais e estados de carregamento, erro, tentativa novamente e categoria sem produtos.
- HTML semântico, título/descrição SEO, texto alternativo, link para pular ao conteúdo, foco visível e respeito a movimento reduzido.
- Layout responsivo; fontes, imagens e SVGs disponíveis localmente.

## Produtos e fallback

A primeira tentativa busca:

https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json

Se houver erro de rede, CORS, HTTP, resposta inválida ou timeout de quatro segundos, a aplicação busca `/data/produtos.json`. Essa cópia preserva integralmente o JSON original com dez produtos. Ao desmontar a página, a consulta é cancelada. As imagens continuam dinâmicas; se a foto remota falhar, a imagem original do catálogo salva em `public/assets/product-iphone.png` é usada.

O JSON fornece somente `productName`, `descriptionShort`, `photo` e `price`. Os preços são tratados como valores em reais, sem conversão não documentada para centavos. Não há preço anterior, categoria ou backend de checkout. Por isso:

- O espaço do preço anterior é mantido, sem inventar desconto.
- As três vitrines compartilham o catálogo fornecido.
- Tecnologia leva à primeira vitrine e restaura a aba Celular, preservando a busca. As outras categorias da Home e do cabeçalho permanecem como rótulos estáticos, sem destinos fictícios.
- Celular e Ver Todos mostram esse catálogo de tecnologia; demais abas exibem estado vazio.
- Parcelamento em duas vezes e texto Frete grátis reproduzem a interface de referência.
- Comprar atualiza o contador demonstrativo do carrinho; não conclui pagamento.
- A newsletter exige nome com conteúdo além de espaços, e-mail válido e consentimento; remove espaços nas extremidades do nome ao validar e não envia dados.
- Ícones da área do cliente, redes sociais e textos institucionais são estáticos, sem destinos/backend fornecidos.

## Organização

```text
public/
  assets/              # Imagens e SVGs locais
  data/produtos.json   # Cópia integral do endpoint
src/
  components/          # Seções e componentes reutilizáveis
  hooks/useProducts.ts # Carregamento e tentativa novamente
  services/products.ts # Fetch, timeout e validação
  styles/              # Tokens e SCSS por área da interface
  utils/               # Assets e formatação
  types.ts
tests/home.spec.ts     # Testes de integração no navegador
```

## Referência visual e assets

- [Home no Figma](https://www.figma.com/design/P5iEFlPpi9WPyt2i7TYBhf/Teste-Front-End-Jr--Copy-?node-id=1-1248)
- [Popup no Figma](https://www.figma.com/design/P5iEFlPpi9WPyt2i7TYBhf/Teste-Front-End-Jr--Copy-?node-id=12730-2)

Os assets de categorias, logotipos, ícones e banners foram baixados diretamente dos URLs retornados pelo MCP do Figma. Nenhum URL temporário do Figma é usado pela aplicação. O hero foi obtido de uma [cópia pública do mesmo teste](https://github.com/MathzRod/econverse-teste-front-end/blob/main/src/assets/images/heroWallpaper.png) e conferido contra a imagem da Home. Nenhum código dessa cópia foi reutilizado.

O MCP atingiu o limite do plano Starter durante a inspeção. Header, categorias, banners, rodapé, abas e Popup tiveram contexto detalhado; para as partes restantes foram usadas a estrutura retornada e a referência visual disponível. Logotipos nas marcas usam o mesmo vetor original com escala visual de 117px. Cards e Popup usam os dados reais do JSON em lugar do texto e preços ilustrativos do Figma. O Popup mede aproximadamente 769 × 299px no desktop com o catálogo atual; cresce ou oferece rolagem interna para conteúdo maior. O layout móvel adapta a referência desktop.


### Comparação final em 1440px

A revisão utilizou as capturas originais e metadados já retornados pelo MCP nesta sessão. Novas consultas de screenshot aos frames Home (`1:1248`) e Popup (`12730:2`) foram recusadas pelo limite do plano Starter. O contexto detalhado do diálogo corresponde ao nó `1:2580`, dentro do Popup. Portanto, a comparação usa a referência obtida anteriormente, sem presumir que ela reflete mudanças posteriores no Figma.

Capturas Playwright em Chrome, escala de dispositivo 1, fontes e imagens carregadas: Home completa em 1440px e Popup em viewport 1440 × 834px. A captura usa a cópia local integral do JSON e a foto original salva do mesmo endpoint, para reproduzir o catálogo sem depender da rede. Os arquivos de diagnóstico ficam em `.artifacts/`, ignorados pelo Git:

- `visual-comparison.html`: sobreposição interativa do Figma com o resultado, links para antes/depois e medidas.
- `figma-home.png`, `figma-popup.png`: referências originais do MCP.
- `home-before.png`, `home-after.png`, `popup-before-crop.png`, `popup-after-crop.png`: capturas do navegador.
- `comparison-before.json`, `comparison-after.json`: dimensões, posições, tipografia e cores medidas no DOM.

Foram corrigidos a entrelinha do título e posição do CTA do hero, alinhamento e sombras dos cards, posição de imagem/preço/parcelamento/frete/botão, setas, distribuição das categorias e fluxo das vitrines. A newsletter passou de y=4167 para y=4169 e a Home de 4658 para 4660px de altura, como a referência. No Popup foram ajustados altura, posição da imagem e do X, espaçamentos do texto, largura da descrição, entreletras do link e peso da quantidade.

Permanecem diferenças nos textos e preços por usar o JSON real, na ausência de preço anterior e nas proporções internas da foto do catálogo em relação ao asset ilustrativo do Figma. Há pequenos arredondamentos de coordenadas e rasterização de fontes/sombras entre Chrome e Figma. As cores principais já correspondiam aos tokens consultados e foram mantidas. Não foi realizada uma certificação de igualdade de todos os pixels.

## Testes

```bash
npm test
```

Playwright abre o Chrome instalado em modo headless e inicia o Vite na porta 4173. Os testes verificam catálogo remoto, fallback de rede e de resposta inválida, retry, imagens, modal/foco/Escape/clique externo, quantidade/carrinho, busca, carrossel, categorias sem catálogo, newsletter (incluindo espaços), viewport móvel de 375px e larguras intermediárias/desktop. Não é necessário baixar navegadores.

Para conferir manualmente:

1. Abra a Home e navegue pelas três vitrines com as setas.
2. Clique na imagem, nome ou Comprar de um card. Confira item, preço, quantidade e fechamento do Popup.
3. Teste a busca, abas, categorias e larguras de 375px, 768px e 1440px. Na newsletter, tente enviar um nome composto apenas por espaços.
4. Bloqueie o endpoint remoto no DevTools e recarregue: o catálogo deve continuar aparecendo via JSON local.
5. Desconecte a rede após iniciar o servidor: assets, fontes e catálogo local permanecem disponíveis.
