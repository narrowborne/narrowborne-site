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
  return `<a class="btn btn-solid product-buy" href="${esc(href)}" target="_blank" rel="noopener" data-action-type="${esc(type)}">${label}</a>`;
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

function wireProductOptions(host, product) {
  const sizeButtons = [...host.querySelectorAll('.product-size-option')];
  const buyButton = host.querySelector('.product-buy');
  const cartButton = host.querySelector('.product-add-cart');
  const feedback = host.querySelector('.product-size-feedback');
  let selectedSize = '';

  const setFeedback = (text, type = '') => {
    if (!feedback) return;
    feedback.textContent = text;
    feedback.classList.remove('is-ok', 'is-error');
    if (type) feedback.classList.add(type);
  };

  const requireSize = () => {
    if (!sizeButtons.length || selectedSize) return true;
    setFeedback('Selecione um tamanho para continuar.', 'is-error');
    sizeButtons[0]?.focus();
    return false;
  };

  if (sizeButtons.length) {
    buyButton?.classList.add('is-waiting-size');
    buyButton?.setAttribute('aria-disabled', 'true');
    cartButton?.classList.add('is-waiting-size');
    cartButton?.setAttribute('aria-disabled', 'true');
  }

  sizeButtons.forEach(button => {
    button.addEventListener('click', () => {
      selectedSize = button.dataset.size || '';
      sizeButtons.forEach(item => {
        const selected = item === button;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });

      [buyButton, cartButton].forEach(action => {
        action?.classList.remove('is-waiting-size');
        action?.setAttribute('aria-disabled', 'false');
      });

      setFeedback(`Tamanho ${selectedSize} selecionado.`, 'is-ok');
    });
  });

  cartButton?.addEventListener('click', event => {
    event.preventDefault();
    if (!requireSize()) return;

    if (!window.NBCart?.addItem) {
      setFeedback('Não foi possível abrir o carrinho. Atualize a página e tente novamente.', 'is-error');
      return;
    }

    window.NBCart.addItem(product, selectedSize, 1);
    setFeedback(`${product.name || 'Peça'} — tamanho ${selectedSize} adicionado ao carrinho.`, 'is-ok');
  });

  buyButton?.addEventListener('click', event => {
    if (!requireSize()) {
      event.preventDefault();
      return;
    }

    if (buyButton.dataset.actionType === 'whatsapp' && selectedSize) {
      try {
        const url = new URL(buyButton.href);
        url.searchParams.set('text', `Olá! Quero comprar ${product.name || 'esta peça'} da NARROWBORNE. Tamanho: ${selectedSize}.`);
        buyButton.href = url.toString();
      } catch (e) {
        console.warn('Não foi possível adicionar o tamanho à mensagem do WhatsApp.', e);
      }
    }
  });
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
  const action = buildAction(product, data.brand || {});
  const canAddToCart = Boolean(product.price && product.active !== false);
  const canBuyDirect = Boolean(action);
  const sizes = (product.sizes || []).map(size => `<button type="button" class="product-size-option" data-size="${esc(size)}" aria-pressed="false" ${canAddToCart ? '' : 'disabled'}>${esc(size)}</button>`).join('');
  const price = product.price ? `<div class="product-detail-price">${esc(product.price)}</div>` : `<div class="product-detail-status">${esc(product.status || 'Em breve')}</div>`;

  host.innerHTML = `<section class="product-detail">
    <div class="product-detail-media">${visual}${renderProductExtraInfo()}</div>
    <div class="product-detail-copy">
      <p class="eyebrow">${esc(product.subtitle || 'NARROWBORNE')}</p>
      <h1>${esc(product.name || '')}</h1>
      ${price}
      <p class="product-detail-description">${esc(product.description || '')}</p>
      ${sizes ? `<div class="product-size-block"><span class="product-detail-label">Tamanhos</span><div class="product-sizes">${sizes}</div>${canAddToCart ? '<p class="product-size-feedback" aria-live="polite">Escolha seu tamanho.</p>' : '<p class="product-size-feedback">Tamanhos serão liberados junto com a compra.</p>'}</div>` : ''}
      <div class="product-detail-actions">
        ${canAddToCart ? '<button type="button" class="btn btn-solid product-add-cart">Adicionar ao carrinho</button>' : ''}
        ${canBuyDirect ? action : ''}
        <a class="btn btn-ghost product-continue" href="index.html#drop">Continuar olhando</a>
      </div>
      <div class="product-detail-notes">
        <div><strong>Modelagem</strong><span>Oversized streetwear</span></div>
        <div><strong>Identidade</strong><span>Faith · Direction · Identity</span></div>
      </div>
    </div>
  </section>`;

  wireProductOptions(host, product);
}

render();


window.addEventListener('nb-store-ready', (event) => {
  if (!event.detail) return;
  data = event.detail;
  render();
});
