const brands = [
  ["Tommy Hilfiger", "tommy-hilfiger.svg"],
  ["Nike", "nike.svg"],
  ["Zara", "zara.svg"],
  ["Adidas", "adidas.svg"],
  ["Puma", "puma.svg"],
  ["Harmany", "harmany.svg"],
  ["Ecko", "ecko.svg"],
  ["Lacoste", "lacoste.svg"],
  ["Oakley", "oakley.svg"],
  ["Supreme", "supreme.svg"],
  ["Sal e Pimenta", "sal-e-pimenta.svg"],
  ["Prada", "prada.svg"],
  ["Louis Vuitton", "louis-vuitton.svg"],
  ["Trapstar", "trapstar.svg"]
];

const categories = ["Camisetas", "Moletons", "Calças", "Bonés", "Acessórios"];

const app = document.querySelector("#conteudo");
const nav = document.querySelector("#main-nav");
const menuButton = document.querySelector(".menu-button");

function brandCards(items = brands) {
  return items.map(([name, file]) => `
    <article class="brand-card">
      <img src="assets/brands/${file}" alt="${name}" width="400" height="140" loading="lazy">
    </article>`).join("");
}

function pageHeader(kicker, title, text) {
  return `
    <header class="page-hero">
      <div class="shell">
        <p class="eyebrow">${kicker}</p>
        <h1>${title}</h1>
        <p>${text}</p>
      </div>
    </header>`;
}

const pages = {
  home: () => `
    <div class="view">
      <section class="hero shell" aria-labelledby="home-title">
        <div class="hero-copy">
          <p class="eyebrow">OUTLET / MULTIMARCAS</p>
          <h1 id="home-title">Boas marcas.<br>Preço de outlet.</h1>
          <p>Roupas e acessórios selecionados para quem quer comprar bem, sem pagar preço cheio.</p>
          <div class="hero-actions">
            <a class="button" href="#/catalogo">Ver catálogo</a>
            <a class="button secondary" href="#/marcas">Conhecer marcas</a>
          </div>
        </div>
        <div class="hero-art" role="img" aria-label="Textura de tinta preta e branca">
          <div class="hero-art-card">
            <span>Próxima entrada</span>
            <strong>Novas peças serão publicadas por lote.</strong>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="shell">
          <div class="section-head">
            <h2>Compre por categoria</h2>
            <a class="text-link" href="#/catalogo">Ver tudo →</a>
          </div>
          <div class="category-grid">
            ${categories.map((name, index) => `<a class="category-card" href="#/catalogo?categoria=${name.toLowerCase()}"><small>0${index + 1}</small><strong>${name}</strong></a>`).join("")}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="shell">
          <div class="section-head">
            <h2>Marcas no outlet</h2>
            <a class="text-link" href="#/marcas">Todas as marcas →</a>
          </div>
          <div class="brand-grid">${brandCards(brands.slice(0, 8))}</div>
        </div>
      </section>
    </div>`,

  catalogo: () => `
    <div class="view">
      ${pageHeader("CATÁLOGO", "Roupas e acessórios", "Escolha uma categoria. As peças disponíveis serão adicionadas por lote.")}
      <section class="section">
        <div class="shell">
          <div class="filters" aria-label="Filtrar catálogo">
            <button class="filter-button is-active" type="button" data-filter="Tudo">Tudo</button>
            ${categories.map(name => `<button class="filter-button" type="button" data-filter="${name}">${name}</button>`).join("")}
          </div>
          <div class="catalog-state" aria-live="polite">
            <div>
              <h2 id="catalog-title">Catálogo em preparação</h2>
              <p id="catalog-text">A primeira seleção ainda não foi publicada. Para saber quando as peças entrarem, acompanhe os canais oficiais da loja.</p>
            </div>
            <span class="catalog-code">NB / 001</span>
          </div>
        </div>
      </section>
    </div>`,

  marcas: () => `
    <div class="view">
      ${pageHeader("MULTIMARCAS", "Marcas selecionadas", "O outlet reúne roupas e acessórios das marcas abaixo. A disponibilidade varia conforme cada lote.")}
      <section class="section">
        <div class="shell">
          <div class="brand-grid">${brandCards()}</div>
        </div>
      </section>
    </div>`,

  sobre: () => `
    <div class="view">
      ${pageHeader("A LOJA", "Outlet sem complicação", "A NarrowBorne seleciona roupas e acessórios de marcas variadas para venda em formato outlet.")}
      <section class="section">
        <div class="shell about-grid">
          <div>
            <h2>O que você encontra</h2>
            <p>Camisetas, moletons, calças, bonés e acessórios. Cada entrada de produtos pode mudar conforme a disponibilidade.</p>
          </div>
          <div class="facts">
            <div class="fact"><strong>Seleção</strong><span>Peças escolhidas antes de entrar no catálogo.</span></div>
            <div class="fact"><strong>Transparência</strong><span>Marca, tamanho e condição informados em cada item.</span></div>
            <div class="fact"><strong>Atendimento</strong><span>Dúvidas confirmadas diretamente com a loja.</span></div>
          </div>
        </div>
      </section>
    </div>`,

  atendimento: () => `
    <div class="view">
      ${pageHeader("ATENDIMENTO", "Fale com a loja", "Use apenas os canais oficiais publicados nesta página.")}
      <section class="section">
        <div class="shell contact-panel">
          <div class="contact-copy">
            <h2>Canais em atualização</h2>
            <p>Os contatos serão incluídos antes da abertura do catálogo.</p>
          </div>
          <div class="contact-status">
            <div>
              <div class="status-line"><strong>WhatsApp</strong><span>Em breve</span></div>
              <div class="status-line"><strong>Instagram</strong><span>Em breve</span></div>
              <div class="status-line"><strong>E-mail</strong><span>Em breve</span></div>
            </div>
            <p class="eyebrow">NARROWBORNE OUTLET</p>
          </div>
        </div>
      </section>
    </div>`,

  notFound: () => `
    <div class="view">
      ${pageHeader("ERRO 404", "Página não encontrada", "O endereço informado não existe.")}
      <section class="section"><div class="shell"><a class="button" href="#/">Voltar ao início</a></div></section>
    </div>`
};

function currentRoute() {
  const raw = location.hash.replace(/^#\/?/, "").split("?")[0];
  return raw || "home";
}

function render() {
  const route = currentRoute();
  const template = pages[route] || pages.notFound;
  app.innerHTML = template();

  document.querySelectorAll("[data-route]").forEach(link => {
    const active = link.dataset.route === route;
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  nav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0);
  app.focus({ preventScroll: true });

  if (route === "catalogo") setupFilters();
}

function setupFilters() {
  const params = new URLSearchParams(location.hash.split("?")[1] || "");
  const initial = params.get("categoria");
  const buttons = [...document.querySelectorAll("[data-filter]")];

  function select(label) {
    buttons.forEach(button => button.classList.toggle("is-active", button.dataset.filter.toLowerCase() === label.toLowerCase()));
    const title = document.querySelector("#catalog-title");
    title.textContent = label === "Tudo" ? "Catálogo em preparação" : `${label}: em preparação`;
  }

  buttons.forEach(button => button.addEventListener("click", () => select(button.dataset.filter)));
  if (initial) {
    const matching = buttons.find(button => button.dataset.filter.toLowerCase() === initial.toLowerCase());
    if (matching) select(matching.dataset.filter);
  }
}

menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(open));
});

window.addEventListener("hashchange", render);
document.querySelector("#year").textContent = new Date().getFullYear();

if (!location.hash) history.replaceState(null, "", "#/");
render();
