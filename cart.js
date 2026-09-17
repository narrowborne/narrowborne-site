(() => {
  const STORAGE_KEY = 'narrowborne-cart-v1';
  function getStoreData() {
    const published = window.NB_STORE_DATA || {};
    const params = new URLSearchParams(location.search);
    if (params.get('preview') === '1') {
      try {
        const draft = localStorage.getItem('narrowborne-admin-draft');
        if (draft) return JSON.parse(draft);
      } catch (_) {}
    }
    return published;
  }

  const esc = (value = '') => String(value).replace(/[&<>'"]/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[ch]));

  function parsePrice(value = '') {
    const raw = String(value || '').trim();
    if (!raw) return null;
    let clean = raw.replace(/[^0-9,.-]/g, '');
    if (!clean) return null;

    if (clean.includes(',') && clean.includes('.')) {
      clean = clean.replace(/\./g, '').replace(',', '.');
    } else if (clean.includes(',')) {
      clean = clean.replace(',', '.');
    }

    const parsed = Number.parseFloat(clean);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function formatMoney(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  function getCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (_) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    renderCart();
  }

  function itemKey(id, size) {
    return `${String(id)}::${String(size)}`;
  }

  function addItem(product, size, quantity = 1) {
    if (!product || !size) return false;
    const cart = getCart();
    const key = itemKey(product.id || product.name, size);
    const existing = cart.find(item => item.key === key);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        key,
        id: product.id || product.name || key,
        name: product.name || 'Produto NARROWBORNE',
        subtitle: product.subtitle || '',
        size,
        quantity,
        price: product.price || '',
        priceValue: parsePrice(product.price),
        image: product.image || '',
        tone: product.tone || 'black'
      });
    }

    saveCart(cart);
    openCart();
    return true;
  }

  function changeQuantity(key, delta) {
    const cart = getCart();
    const item = cart.find(entry => entry.key === key);
    if (!item) return;
    item.quantity = Math.max(1, Number(item.quantity || 1) + delta);
    saveCart(cart);
  }

  function removeItem(key) {
    saveCart(getCart().filter(item => item.key !== key));
  }

  function clearCart() {
    saveCart([]);
  }

  function cartCount(cart = getCart()) {
    return cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }

  function cartTotal(cart = getCart()) {
    let total = 0;
    let hasUnknown = false;
    cart.forEach(item => {
      const value = Number.isFinite(item.priceValue) ? item.priceValue : parsePrice(item.price);
      if (value === null) hasUnknown = true;
      else total += value * Number(item.quantity || 1);
    });
    return { total, hasUnknown };
  }

  function whatsappNumber() {
    const brand = getStoreData().brand || {};
    return String(brand.whatsapp || '').replace(/\D/g, '');
  }

  function normalizeUrl(url = '') {
    const value = String(url || '').trim();
    if (!value) return '';
    if (/^https?:\/\//i.test(value)) return value;
    return `https://${value}`;
  }

  function buildCheckout(cart) {
    const data = getStoreData();
    const payments = data.payments || {};
    const provider = payments.provider || 'external';

    if (provider === 'whatsapp') {
      return {
        url: buildWhatsappCheckout(cart),
        label: payments.checkoutLabel || 'Finalizar pelo WhatsApp'
      };
    }

    return {
      url: normalizeUrl(payments.checkoutUrl || ''),
      label: payments.checkoutLabel || 'Ir para pagamento'
    };
  }

  function buildWhatsappCheckout(cart) {
    const wa = whatsappNumber();
    if (!wa || !cart.length) return '';

    const totals = cartTotal(cart);
    const lines = cart.map(item => {
      const price = item.price ? ` — ${item.price}` : '';
      return `${item.quantity}x ${item.name} — Tamanho ${item.size}${price}`;
    });

    const totalLine = totals.hasUnknown
      ? 'Total: a confirmar'
      : `Total: ${formatMoney(totals.total)}`;

    const message = [
      'Olá! Quero finalizar meu pedido NARROWBORNE:',
      '',
      ...lines,
      '',
      totalLine
    ].join('\n');

    return `https://wa.me/${wa}?text=${encodeURIComponent(message)}`;
  }

  function itemThumb(item) {
    if (item.image) {
      return `<img src="${esc(item.image)}" alt="${esc(item.name)}">`;
    }
    return `<span>NB</span>`;
  }

  function ensureUi() {
    if (document.getElementById('nbCartDrawer')) return;

    const header = document.querySelector('.site-header');
    if (header) {
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'cart-trigger';
      trigger.id = 'nbCartTrigger';
      trigger.setAttribute('aria-controls', 'nbCartDrawer');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.innerHTML = `CARRINHO <span class="cart-count" data-cart-count>0</span>`;

      const headerCta = header.querySelector('.nav-cta');
      if (headerCta) header.insertBefore(trigger, headerCta);
      else header.appendChild(trigger);
    }

    const ui = document.createElement('div');
    ui.innerHTML = `
      <div class="cart-overlay" id="nbCartOverlay" hidden></div>
      <aside class="cart-drawer" id="nbCartDrawer" aria-hidden="true" aria-label="Carrinho de compras">
        <div class="cart-drawer-head">
          <div>
            <span class="product-detail-label">Seu pedido</span>
            <h2>CARRINHO</h2>
          </div>
          <button class="cart-close" type="button" id="nbCartClose" aria-label="Fechar carrinho">×</button>
        </div>
        <div class="cart-items" id="nbCartItems"></div>
        <div class="cart-summary" id="nbCartSummary"></div>
      </aside>`;
    document.body.append(...ui.children);

    document.getElementById('nbCartTrigger')?.addEventListener('click', openCart);
    document.getElementById('nbCartClose')?.addEventListener('click', closeCart);
    document.getElementById('nbCartOverlay')?.addEventListener('click', closeCart);

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeCart();
    });

    document.getElementById('nbCartItems')?.addEventListener('click', event => {
      const button = event.target.closest('[data-cart-action]');
      if (!button) return;
      const key = button.dataset.key;
      const action = button.dataset.cartAction;
      if (action === 'increase') changeQuantity(key, 1);
      if (action === 'decrease') changeQuantity(key, -1);
      if (action === 'remove') removeItem(key);
    });

    document.getElementById('nbCartSummary')?.addEventListener('click', event => {
      const button = event.target.closest('[data-cart-summary-action]');
      if (!button) return;
      if (button.dataset.cartSummaryAction === 'clear') clearCart();
    });
  }

  function openCart() {
    ensureUi();
    const drawer = document.getElementById('nbCartDrawer');
    const overlay = document.getElementById('nbCartOverlay');
    const trigger = document.getElementById('nbCartTrigger');
    if (!drawer || !overlay) return;
    overlay.hidden = false;
    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
      drawer.classList.add('is-open');
    });
    drawer.setAttribute('aria-hidden', 'false');
    trigger?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('cart-open');
  }

  function closeCart() {
    const drawer = document.getElementById('nbCartDrawer');
    const overlay = document.getElementById('nbCartOverlay');
    const trigger = document.getElementById('nbCartTrigger');
    if (!drawer || !overlay) return;
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    trigger?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('cart-open');
    setTimeout(() => {
      if (!overlay.classList.contains('is-open')) overlay.hidden = true;
    }, 220);
  }

  function renderCart() {
    ensureUi();
    const cart = getCart();
    const itemsHost = document.getElementById('nbCartItems');
    const summaryHost = document.getElementById('nbCartSummary');
    const count = cartCount(cart);

    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = String(count);
    });

    if (!itemsHost || !summaryHost) return;

    if (!cart.length) {
      itemsHost.innerHTML = `
        <div class="cart-empty">
          <strong>Seu carrinho está vazio.</strong>
          <p>Escolha uma peça, selecione o tamanho e adicione ao carrinho.</p>
        </div>`;
      summaryHost.innerHTML = '';
      return;
    }

    itemsHost.innerHTML = cart.map(item => `
      <article class="cart-item">
        <div class="cart-item-thumb tone-${esc(item.tone || 'black')}">${itemThumb(item)}</div>
        <div class="cart-item-info">
          <div class="cart-item-top">
            <div>
              <h3>${esc(item.name)}</h3>
              <p>Tamanho ${esc(item.size)}</p>
            </div>
            <button type="button" class="cart-remove" data-cart-action="remove" data-key="${esc(item.key)}">Remover</button>
          </div>
          <div class="cart-item-bottom">
            <div class="cart-qty" aria-label="Quantidade">
              <button type="button" data-cart-action="decrease" data-key="${esc(item.key)}" aria-label="Diminuir quantidade">−</button>
              <span>${Number(item.quantity || 1)}</span>
              <button type="button" data-cart-action="increase" data-key="${esc(item.key)}" aria-label="Aumentar quantidade">+</button>
            </div>
            <strong>${esc(item.price || 'A confirmar')}</strong>
          </div>
        </div>
      </article>`).join('');

    const totals = cartTotal(cart);
    const checkout = buildCheckout(cart);
    const totalLabel = totals.hasUnknown ? 'A confirmar' : formatMoney(totals.total);

    summaryHost.innerHTML = `
      <div class="cart-total-row"><span>Total</span><strong>${esc(totalLabel)}</strong></div>
      ${checkout.url
        ? `<a class="btn btn-solid cart-checkout" href="${esc(checkout.url)}" target="_blank" rel="noopener">${esc(checkout.label)}</a>`
        : `<button class="btn btn-solid cart-checkout" type="button" disabled>Finalizar pedido</button>
           <p class="cart-checkout-note">Configure o link do Mercado Pago na área “Pagamento” do painel ADM.</p>`}
      <button class="cart-clear" type="button" data-cart-summary-action="clear">Esvaziar carrinho</button>`;
  }

  window.NBCart = {
    addItem,
    open: openCart,
    close: closeCart,
    getItems: getCart,
    clear: clearCart
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCart, { once: true });
  } else {
    renderCart();
  }
})();
