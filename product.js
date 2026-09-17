const publishedData = window.NB_STORE_DATA || {};
const qs = new URLSearchParams(location.search);
const isPreview = qs.get('preview') === '1';
let data = publishedData;

if (isPreview) {
  try {
    const draft = localStorage.getItem('narrowborne-admin-draft');
    if (draft) data = JSON.parse(draft);
  } catch (e) {
    console.warn('Não foi possível carregar o rascunho.', e);
  }
}

const esc = (value='') => String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
const normalizeUrl = (url='') => {
  const value = String(url || '').trim();
  if (!value) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(value)) return value;
  return `https://${value}`;
};

function buildAction(product, brand) {
  const type = product.actionType || 'whatsapp';
  const label = esc(product.actionLabel || 'Comprar agora');
  let href = '';
  if (type === 'none') return '';
  if (type === 'whatsapp') {
    const wa = String(product.actionUrl || brand.whatsapp || '').replace(/\D/g,'');
    if (!wa) return '';
    href = `https://wa.me/${wa}?text=${encodeURIComponent(`Olá! Quero saber mais sobre ${product.name || 'esta peça'} da NARROWBORNE.`)}`;
  } else if (type === 'instagram') {
    const raw = String(product.actionUrl || brand.instagram || '').trim();
    if (!raw) return '';
    href = /^https?:\/\//i.test(raw) ? raw : `https://instagram.com/${raw.replace(/^@/,'')}`;
  } else {
    href = normalizeUrl(product.actionUrl || '');
    if (!href) return '';
  }
  return `<a class="btn btn-solid product-buy" href="${esc(href)}" target="_blank" rel="noopener">${label}</a>`;
}

function fallbackVisual(product) {
  const tone = esc(product.tone || 'black');
  return `<div class="product-detail-visual tone-${tone}">
    <svg viewBox="0 0 420 500" role="img" aria-label="${esc(product.name || 'NARROWBORNE')}">
      <path class="tee" d="M132 80 66 115 25 192l78 40 22-43v236h170V189l22 43 78-40-41-77-66-35-34 28h-88z"/>
      <path class="neck" d="M166 80c7 29 80 29 88 0"/>
      <text x="210" y="246" text-anchor="middle" class="tee-title ${tone==='bone'?'dark-print':''}">${esc((product.name || 'NARROWBORNE').slice(0,18))}</text>
      <text x="210" y="274" text-anchor="middle" class="tee-sub ${tone==='bone'?'dark-print':''}">NARROWBORNE</text>
    </svg>
  </div>`;
}

function render() {
  const id = qs.get('id');
  const products = (data.products || []).filter(p => p.active !== false);
  const product = products.find(p => String(p.id) === String(id));
  const host = document.getElementById('productPage');
  document.getElementById('year').textContent = new Date().getFullYear();

  if (!product) {
    host.innerHTML = `<section class="product-not-found"><p class="eyebrow">NARROWBORNE</p><h1>PEÇA NÃO ENCONTRADA.</h1><p>Esse produto pode ter sido removido ou ainda não está publicado.</p><a class="btn btn-solid" href="index.html#drop">Voltar ao drop</a></section>`;
    return;
  }

  document.title = `${product.name} — NARROWBORNE`;
  const image = String(product.image || '').trim();
  const visual = image
    ? `<div class="product-detail-visual product-detail-photo"><img src="${esc(image)}" alt="${esc(product.name)}"></div>`
    : fallbackVisual(product);
  const sizes = (product.sizes || []).map(size => `<span>${esc(size)}</span>`).join('');
  const price = product.price ? `<div class="product-detail-price">${esc(product.price)}</div>` : `<div class="product-detail-status">${esc(product.status || 'Em breve')}</div>`;
  const action = buildAction(product, data.brand || {});

  host.innerHTML = `<section class="product-detail">
    <div class="product-detail-media">${visual}</div>
    <div class="product-detail-copy">
      <p class="eyebrow">${esc(product.subtitle || 'NARROWBORNE')}</p>
      <h1>${esc(product.name || '')}</h1>
      ${price}
      <p class="product-detail-description">${esc(product.description || '')}</p>
      ${sizes ? `<div class="product-size-block"><span class="product-detail-label">Tamanhos</span><div class="product-sizes">${sizes}</div></div>` : ''}
      <div class="product-detail-actions">
        ${action || '<span class="product-no-action">Compra ainda não liberada.</span>'}
        <a class="btn btn-ghost" href="index.html#drop">Continuar olhando</a>
      </div>
      <div class="product-detail-notes">
        <div><strong>Modelagem</strong><span>Oversized streetwear</span></div>
        <div><strong>Identidade</strong><span>Faith · Direction · Identity</span></div>
      </div>
    </div>
  </section>`;
}

render();
