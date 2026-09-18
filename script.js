const publishedData = window.NB_STORE_DATA || {};
const params = new URLSearchParams(location.search);
const isPreview = params.get('preview') === '1';
let storeData = publishedData;

if (isPreview) {
  try {
    const draft = localStorage.getItem('narrowborne-admin-draft');
    if (draft) storeData = JSON.parse(draft);
  } catch (e) {
    console.warn('Não foi possível carregar o rascunho do admin.', e);
  }
}

const $ = (id) => document.getElementById(id);
const esc = (value='') => String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

function formatTitle(text) {
  return esc(text).replace(/\n/g, '<br>');
}

function renderSite() {
  const data = storeData || {};
  const hero = data.hero || {};
  const drop = data.drop || {};
  const manifesto = data.manifesto || {};
  const brand = data.brand || {};

  if ($('heroEyebrow')) $('heroEyebrow').textContent = hero.eyebrow || '';
  if ($('heroTitleTop')) $('heroTitleTop').textContent = hero.titleTop || '';
  if ($('heroTitleBottom')) $('heroTitleBottom').textContent = hero.titleBottom || '';
  if ($('heroText')) $('heroText').textContent = hero.text || '';
  if ($('heroPrimaryCta')) { $('heroPrimaryCta').textContent = hero.primaryCta || 'Explorar'; $('heroPrimaryCta').href = hero.primaryUrl || '#drop'; }
  if ($('heroSecondaryCta')) { $('heroSecondaryCta').textContent = hero.secondaryCta || ''; $('heroSecondaryCta').href = hero.secondaryUrl || '#manifesto'; }

  if ($('dropEyebrow')) $('dropEyebrow').textContent = drop.eyebrow || '';
  if ($('dropTitle')) $('dropTitle').textContent = drop.title || '';
  if ($('dropDescription')) $('dropDescription').textContent = drop.description || '';

  if ($('manifestoEyebrow')) $('manifestoEyebrow').textContent = manifesto.eyebrow || '';
  if ($('manifestoTitle')) $('manifestoTitle').innerHTML = formatTitle(manifesto.title || '');
  if ($('manifestoText')) $('manifestoText').textContent = manifesto.text || '';
  if ($('manifestoScripture')) $('manifestoScripture').textContent = manifesto.scripture || '';

  renderProducts(data.products || [], brand);
  renderContacts(brand);
}

function fallbackProduct(product, index, total) {
  const tone = product.tone || 'black';
  const label = esc(product.name || 'NARROWBORNE');
  return `
    <div class="product-visual tone-${esc(tone)}">
      <span class="product-code">${String(index+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}</span>
      <svg viewBox="0 0 420 500" role="img" aria-label="${label}">
        <path class="tee" d="M132 80 66 115 25 192l78 40 22-43v236h170V189l22 43 78-40-41-77-66-35-34 28h-88z"/>
        <path class="neck" d="M166 80c7 29 80 29 88 0"/>
        <text x="210" y="246" text-anchor="middle" class="tee-title ${tone==='bone'?'dark-print':''}">${label.slice(0,18)}</text>
        <text x="210" y="274" text-anchor="middle" class="tee-sub ${tone==='bone'?'dark-print':''}">NARROWBORNE</text>
      </svg>
    </div>`;
}


function normalizeUrl(url='') {
  const value = String(url || '').trim();
  if (!value) return '';
  if (value.startsWith('#') || value.startsWith('/') || /^https?:\/\//i.test(value) || /^mailto:/i.test(value) || /^tel:/i.test(value)) return value;
  return `https://${value}`;
}

function buildProductAction(product, brand) {
  const type = product.actionType || 'whatsapp';
  const label = esc(product.actionLabel || (type === 'custom' ? 'Comprar agora' : 'Tenho interesse'));
  let href = '';

  if (type === 'none') return '';
  if (type === 'whatsapp') {
    const wa = (product.actionUrl || brand.whatsapp || '').replace(/\D/g,'');
    if (!wa) return '';
    const encoded = encodeURIComponent(`Olá! Tenho interesse na peça ${product.name || ''}.`);
    href = `https://wa.me/${wa}?text=${encoded}`;
  } else if (type === 'instagram') {
    const raw = String(product.actionUrl || brand.instagram || '').trim();
    if (!raw) return '';
    href = /^https?:\/\//i.test(raw) ? raw : `https://instagram.com/${raw.replace(/^@/,'')}`;
  } else {
    href = normalizeUrl(product.actionUrl || '');
    if (!href) return '';
  }

  const external = /^https?:\/\//i.test(href);
  return `<a class="product-link" href="${esc(href)}"${external ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`;
}

function renderProducts(products, brand) {
  const grid = $('productGrid');
  if (!grid) return;
  const active = products.filter(p => p.active !== false);
  grid.innerHTML = active.map((product, index) => {
    const image = (product.image || '').trim();
    const visual = image
      ? `<div class="product-visual product-photo"><span class="product-code">${String(index+1).padStart(2,'0')} / ${String(active.length).padStart(2,'0')}</span><img src="${esc(image)}" alt="${esc(product.name)}" loading="lazy"></div>`
      : fallbackProduct(product, index, active.length);

    const priceOrStatus = product.price ? esc(product.price) : esc(product.status || 'Em breve');
    const query = new URLSearchParams({ id: product.id || `produto-${index+1}` });
    if (isPreview) query.set('preview', '1');
    const productUrl = `product.html?${query.toString()}`;

    return `<article class="product-card reveal">
      <a class="product-card-link" href="${esc(productUrl)}" aria-label="Ver ${esc(product.name || 'produto')}">
        ${visual}
        <div class="product-meta">
          <div><h3>${esc(product.name)}</h3><p>${esc(product.subtitle || '')}</p></div>
          <span>${priceOrStatus}</span>
        </div>
        <div class="product-extra product-extra-home">
          <p>${esc(product.description || '')}</p>
          <span class="product-link">Ver produto →</span>
        </div>
      </a>
    </article>`;
  }).join('');

  if (!active.length) {
    grid.innerHTML = '<div class="empty-products">Nenhum produto publicado ainda.</div>';
  }

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function renderContacts(brand) {
  const actions = $('contactActions');
  if (!actions) return;
  const links = [];
  if (brand.instagram) {
    let url = brand.instagram.trim();
    if (!/^https?:\/\//i.test(url)) url = `https://instagram.com/${url.replace(/^@/,'')}`;
    links.push(`<a class="btn btn-solid" href="${esc(url)}" target="_blank" rel="noopener">Instagram</a>`);
  }
  if (brand.whatsapp) {
    const wa = brand.whatsapp.replace(/\D/g,'');
    links.push(`<a class="btn btn-ghost" href="https://wa.me/${wa}" target="_blank" rel="noopener">WhatsApp</a>`);
  }
  if (!links.length) links.push('<a class="btn btn-solid" href="#top">NARROWBORNE / 2026</a>');
  actions.innerHTML = links.join('');

  const footerBits = ['Christian streetwear'];
  if (brand.domain) footerBits.push(brand.domain);
  if ($('footerContact')) $('footerContact').textContent = footerBits.join(' · ');
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
if ($('year')) $('year').textContent = new Date().getFullYear();
renderSite();


window.addEventListener('nb-store-ready', (event) => {
  if (!event.detail) return;
  storeData = event.detail;
  renderSite();
});
