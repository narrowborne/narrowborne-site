(() => {
  const HISTORY_KEY = 'narrowborne-support-chat-v1';
  const MAX_HISTORY = 60;

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

  const store = getStoreData();
  const config = {
    enabled: true,
    botName: 'NARROW Assist',
    welcome: 'Olá! Sou o assistente virtual da NARROWBORNE. Pode escrever sua dúvida que eu vou tentar ajudar.',
    whatsapp: '',
    whatsappMessage: 'Olá! Vim pelo atendimento do site e preciso de ajuda.',
    offlineText: 'Nosso atendimento humano está fora do horário agora. O robô continua disponível e sua mensagem no WhatsApp poderá ser respondida posteriormente.',
    schedule: { timezone: 'America/Sao_Paulo', days: [1, 2, 3, 4, 5, 6], start: '09:00', end: '18:00' },
    knowledgeEnabled: true,
    disabledFaqIds: [],
    faqs: [],
    ...(store.chat || {})
  };
  config.schedule = {
    timezone: 'America/Sao_Paulo', days: [1, 2, 3, 4, 5, 6], start: '09:00', end: '18:00',
    ...((store.chat && store.chat.schedule) || {})
  };
  if (config.enabled === false) return;

  const TOKEN_ALIASES = {
    vc: 'voce', vcs: 'voces', ce: 'voce', cê: 'voce', q: 'que', pq: 'porque', pqp: 'problema',
    pra: 'para', pro: 'para', pros: 'para', ta: 'esta', tava: 'estava', to: 'estou', tou: 'estou',
    n: 'nao', nn: 'nao', ñ: 'nao', s: 'sim', blz: 'beleza', vlw: 'valeu', obg: 'obrigado',
    zap: 'whatsapp', whats: 'whatsapp', wpp: 'whatsapp', insta: 'instagram', pgto: 'pagamento',
    pg: 'pagamento', cartaozinho: 'cartao', rastrear: 'rastreio', rastreamento: 'rastreio',
    camiseta: 'camiseta', camisa: 'camiseta', camisas: 'camisetas', produto: 'produto', produtos: 'produtos'
  };

  const normalize = (value = '') => String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(token => TOKEN_ALIASES[token] || token)
    .join(' ');

  function buildFaqCatalog() {
    const builtIns = config.knowledgeEnabled === false
      ? []
      : (((window.NB_CHAT_KNOWLEDGE || {}).faqs || []).map(item => ({ ...item, source: 'builtin' })));
    const configured = (Array.isArray(config.faqs) ? config.faqs : []).map(item => ({ ...item, source: 'custom' }));
    const disabled = new Set((config.disabledFaqIds || []).map(String));
    const merged = new Map();
    builtIns.forEach(item => { if (item && item.id && !disabled.has(String(item.id))) merged.set(String(item.id), item); });
    configured.forEach((item, index) => {
      if (!item || !item.answer || disabled.has(String(item.id))) return;
      const id = String(item.id || `custom-${index}`);
      const existing = merged.get(id) || {};
      const keywords = [...new Set([
        ...(Array.isArray(existing.keywords) ? existing.keywords : []),
        ...faqKeywords(item)
      ])];
      merged.set(id, { ...existing, ...item, keywords });
    });
    return [...merged.values()];
  }

  const faqCatalog = buildFaqCatalog();

  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));

  function createSessionId() {
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `NB-${random}`;
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
      return {
        sessionId: saved.sessionId || createSessionId(),
        messages: Array.isArray(saved.messages) ? saved.messages.slice(-MAX_HISTORY) : [],
        lastIntentId: saved.lastIntentId || ''
      };
    } catch (_) {
      return { sessionId: createSessionId(), messages: [], lastIntentId: '' };
    }
  }

  const state = loadState();
  let panelOpen = false;
  let botTyping = false;
  let unread = 0;

  function persist() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify({
        sessionId: state.sessionId,
        messages: state.messages.slice(-MAX_HISTORY),
        lastIntentId: state.lastIntentId || ''
      }));
    } catch (_) {}
  }

  function getBrazilTime() {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: config.schedule.timezone || 'America/Sao_Paulo',
        weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(new Date());
      const map = Object.fromEntries(parts.map(part => [part.type, part.value]));
      const week = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: week[map.weekday], minutes: Number(map.hour) * 60 + Number(map.minute) };
    } catch (_) {
      const now = new Date();
      return { day: now.getDay(), minutes: now.getHours() * 60 + now.getMinutes() };
    }
  }

  function parseMinutes(value, fallback) {
    const match = String(value || '').match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return fallback;
    return Number(match[1]) * 60 + Number(match[2]);
  }

  function humanIsAvailable() {
    const now = getBrazilTime();
    const days = Array.isArray(config.schedule.days) ? config.schedule.days.map(Number) : [];
    if (!days.includes(now.day)) return false;
    const start = parseMinutes(config.schedule.start, 9 * 60);
    const end = parseMinutes(config.schedule.end, 18 * 60);
    if (start === end) return true;
    return start < end
      ? now.minutes >= start && now.minutes < end
      : now.minutes >= start || now.minutes < end;
  }

  function addMessage(role, text, action = '') {
    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role,
      text: String(text || '').trim(),
      action,
      time: Date.now()
    };
    if (!message.text) return;
    state.messages.push(message);
    state.messages = state.messages.slice(-MAX_HISTORY);
    if (role === 'bot' && !panelOpen) unread += 1;
    persist();
    renderMessages();
    updateUnread();
  }

  function faqKeywords(faq) {
    const keywords = Array.isArray(faq.keywords)
      ? faq.keywords
      : String(faq.keywords || '').split(',').map(item => item.trim()).filter(Boolean);
    const phrases = Array.isArray(faq.phrases) ? faq.phrases : [];
    return [...keywords, ...phrases];
  }

  const STOP_WORDS = new Set([
    'a', 'as', 'o', 'os', 'um', 'uma', 'uns', 'umas', 'de', 'da', 'do', 'das', 'dos', 'e', 'ou',
    'em', 'no', 'na', 'nos', 'nas', 'para', 'por', 'com', 'sem', 'que', 'qual', 'quais', 'como',
    'eu', 'me', 'meu', 'minha', 'voce', 'voces', 'isso', 'esse', 'essa', 'tem', 'ter', 'esta', 'estou'
  ]);

  function meaningfulTokens(value) {
    return normalize(value).split(' ').filter(token => token && !STOP_WORDS.has(token));
  }

  function wordDistance(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i += 1) {
      const current = [i];
      for (let j = 1; j <= b.length; j += 1) {
        current[j] = Math.min(
          current[j - 1] + 1,
          previous[j] + 1,
          previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
      for (let j = 0; j < current.length; j += 1) previous[j] = current[j];
    }
    return previous[b.length];
  }

  function wordsMatch(messageWord, expectedWord) {
    if (messageWord === expectedWord) return true;
    if (expectedWord.length < 5 || messageWord.length < 5) return false;
    const allowedDistance = expectedWord.length >= 8 ? 2 : 1;
    return Math.abs(messageWord.length - expectedWord.length) <= allowedDistance
      && wordDistance(messageWord, expectedWord) <= allowedDistance;
  }

  function scoreFaq(faq, text, messageTokens) {
    let score = Number(faq.priority || 0);
    let strongMatches = 0;
    const keywordScores = [];

    faqKeywords(faq).forEach(keyword => {
      const key = normalize(keyword);
      if (!key) return;
      const keyTokens = meaningfulTokens(key);
      if (!keyTokens.length) return;

      if (text === key) {
        keywordScores.push(12);
        strongMatches += 1;
        return;
      }
      if (key.includes(' ') && (` ${text} `).includes(` ${key} `)) {
        keywordScores.push(9 + Math.min(3, keyTokens.length));
        strongMatches += 1;
        return;
      }

      const matched = keyTokens.filter(expected => messageTokens.some(word => wordsMatch(word, expected))).length;
      if (matched === keyTokens.length) {
        keywordScores.push(keyTokens.length > 1 ? 5 + keyTokens.length : 3.5);
        strongMatches += 1;
      } else if (keyTokens.length > 1 && matched >= 2 && matched / keyTokens.length >= 0.6) {
        keywordScores.push(2.5 + matched);
      }
    });

    keywordScores.sort((a, b) => b - a);
    score += (keywordScores[0] || 0) + (keywordScores[1] || 0) * 0.25 + (keywordScores[2] || 0) * 0.1;

    const questionTokens = meaningfulTokens(faq.question || '');
    const questionMatches = questionTokens.filter(expected => messageTokens.some(word => wordsMatch(word, expected))).length;
    score += questionMatches * 0.45;

    const exclusions = Array.isArray(faq.negativeKeywords) ? faq.negativeKeywords : [];
    if (exclusions.some(keyword => text.includes(normalize(keyword)))) score -= 12;
    const isFollowUp = /^(e |mas |tambem |quanto |quando |como assim|isso|ele |ela |sim$|nao$)/.test(text);
    if (String(faq.id || '') === String(state.lastIntentId || '') && messageTokens.length <= 5 && isFollowUp) score += 0.8;
    if (!strongMatches && questionMatches < 2) score = Math.min(score, 2.4);
    return score;
  }

  function findFaq(message) {
    const text = normalize(message);
    const messageTokens = meaningfulTokens(text);
    let best = null;
    let bestScore = 0;

    faqCatalog.forEach(faq => {
      if (!faq || !faq.answer) return;
      const score = scoreFaq(faq, text, messageTokens);
      if (score > bestScore) {
        best = faq;
        bestScore = score;
      }
    });

    return bestScore >= 3.2 ? best : null;
  }

  function hashText(value = '') {
    let hash = 2166136261;
    String(value).split('').forEach(char => {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    });
    return Math.abs(hash >>> 0);
  }

  function pickVariant(items, seed, offset = 0) {
    const list = (items || []).filter(item => typeof item === 'string');
    if (!list.length) return '';
    return list[(hashText(`${seed}-${offset}`) + offset) % list.length];
  }

  function naturalFaqAnswer(faq, message) {
    const answers = Array.isArray(faq.answers) && faq.answers.length ? faq.answers : [faq.answer];
    const base = pickVariant(answers, `${state.sessionId}-${message}-${faq.id}`, 7) || faq.answer;
    if (faq.style === 'direct') return base;
    const knowledge = window.NB_CHAT_KNOWLEDGE || {};
    const opener = pickVariant(knowledge.openers || ['Entendi.'], `${message}-${faq.id}`, 11);
    const closer = pickVariant(knowledge.closers || [''], `${state.sessionId}-${message}`, 19);
    return [opener, base, faq.action === 'whatsapp' ? '' : closer].filter(Boolean).join(' ');
  }

  function productSizeAnswer() {
    const products = (store.products || []).filter(product => product.active !== false);
    if (!products.length) return 'As informações de tamanho ainda não foram publicadas. Posso chamar um atendente para confirmar para você.';
    const lines = products.map(product => {
      const sizes = Array.isArray(product.sizes) && product.sizes.length ? product.sizes.join(', ') : 'a confirmar';
      return `${product.name}: ${sizes}`;
    });
    return `Estes são os tamanhos informados no momento:\n${lines.join('\n')}\nNa página da peça, selecione o tamanho antes de adicionar ao carrinho.`;
  }

  function productAnswer() {
    const products = (store.products || []).filter(product => product.active !== false);
    if (!products.length) return 'Ainda não há produtos publicados. Se quiser, posso direcionar você para o atendimento humano.';
    const lines = products.map(product => {
      const availability = product.price || product.status || 'Consulte disponibilidade';
      return `${product.name} — ${availability}`;
    });
    return `No momento, estas são as peças exibidas na loja:\n${lines.join('\n')}\nVocê pode abrir cada produto para ver descrição, tamanhos e opções de compra.`;
  }

  function findMentionedProduct(message) {
    const text = normalize(message);
    let bestProduct = null;
    let bestScore = 0;
    (store.products || []).filter(product => product.active !== false).forEach(product => {
      const tokens = meaningfulTokens(product.name || '');
      const score = tokens.filter(token => text.includes(token)).length;
      if (tokens.length && score > bestScore && (score === tokens.length || score >= 2)) {
        bestProduct = product;
        bestScore = score;
      }
    });
    return bestProduct;
  }

  function productDetailAnswer(product) {
    if (!product) return productAnswer();
    const sizes = Array.isArray(product.sizes) && product.sizes.length ? product.sizes.join(', ') : 'a confirmar';
    const value = product.price || product.status || 'valor a confirmar';
    const description = product.description ? ` ${product.description}` : '';
    return `${product.name} — ${value}. Tamanhos informados: ${sizes}.${description}`;
  }

  function businessHoursAnswer() {
    const labels = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const days = (config.schedule.days || []).map(Number).sort((a, b) => a - b).map(day => labels[day]).filter(Boolean);
    const dayText = days.length ? days.join(', ') : 'nenhum dia configurado';
    return `O atendimento humano funciona em: ${dayText}, das ${config.schedule.start || '09:00'} às ${config.schedule.end || '18:00'} (horário de São Paulo). O assistente virtual continua disponível fora desse período.`;
  }

  function answerFor(message) {
    const text = normalize(message);

    if (/\b(atendente|pessoa real|atendimento humano|falar com humano|falar com alguem|falar com uma pessoa|chamar no whatsapp|abrir o whatsapp|whatsapp da loja|numero do whatsapp|qual o whatsapp)\b/.test(text) || text === 'whatsapp') {
      return { text: humanIsAvailable()
        ? 'Claro. Vou abrir o WhatsApp oficial com o contexto desta conversa para o atendente conseguir ajudar mais rápido.'
        : config.offlineText,
        action: 'whatsapp', intent: 'atendente' };
    }

    const faq = findFaq(message);
    if (faq) {
      state.lastIntentId = faq.id || '';
      persist();
      const product = findMentionedProduct(message);
      if (faq.dynamic === 'sizes') return { text: product ? productDetailAnswer(product) : productSizeAnswer(), intent: faq.id };
      if (faq.dynamic === 'products') return { text: product ? productDetailAnswer(product) : productAnswer(), action: faq.action || '', intent: faq.id };
      if (faq.dynamic === 'hours') return { text: businessHoursAnswer(), intent: faq.id };
      const inferredHuman = /^(pedido|trocas|devolucao|defeito|reembolso|rastreio|atraso|item-|pagamento-pendente|cobranca-duplicada)/.test(String(faq.id || ''));
      return { text: naturalFaqAnswer(faq, message), action: faq.action || (inferredHuman ? 'whatsapp' : ''), intent: faq.id };
    }

    const product = findMentionedProduct(message);
    if (product) return { text: productDetailAnswer(product), intent: 'produto-dinamico' };

    if (/\b(produto|produtos|camiseta|camisetas|peca|pecas|drop|colecao|disponivel|estoque)\b/.test(text)) {
      return { text: productAnswer(), intent: 'produtos' };
    }

    return {
      text: pickVariant([
        'Ainda não encontrei uma resposta segura para essa dúvida. Você pode explicar de outro jeito ou falar diretamente com um atendente.',
        'Não quero te passar uma informação errada. Tente escrever com mais detalhes ou use o atendimento humano.',
        'Essa pergunta precisa de uma confirmação da equipe. Se preferir, posso abrir o WhatsApp oficial agora.',
        'Não consegui identificar exatamente o que você precisa. Diga se a dúvida é sobre produto, pagamento, entrega, pedido ou troca.'
      ], `${state.sessionId}-${message}`, 31),
      action: 'whatsapp',
      intent: 'fallback'
    };
  }

  function whatsappNumber() {
    return String(config.whatsapp || (store.brand && store.brand.whatsapp) || '').replace(/\D/g, '');
  }

  function lastCustomerMessage() {
    return [...state.messages].reverse().find(message => message.role === 'user')?.text || 'Não informado';
  }

  function buildWhatsappUrl() {
    const number = whatsappNumber();
    if (!number) return '';
    const availabilityNote = humanIsAvailable()
      ? 'Atendimento humano dentro do horário.'
      : 'Contato enviado fora do horário de atendimento.';
    const message = [
      config.whatsappMessage || 'Olá! Vim pelo atendimento do site e preciso de ajuda.',
      '',
      `Atendimento: ${state.sessionId}`,
      `Última dúvida: ${lastCustomerMessage()}`,
      `Página: ${document.title}`,
      availabilityNote
    ].join('\n');
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  function transferToWhatsapp() {
    const url = buildWhatsappUrl();
    if (!url) {
      addMessage('bot', 'O WhatsApp oficial ainda não foi configurado. Você pode tentar novamente mais tarde ou usar outro contato exibido na loja.');
      return;
    }
    if (!humanIsAvailable()) addMessage('bot', config.offlineText);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function ensureUi() {
    if (document.getElementById('nbSupportRoot')) return;
    const available = humanIsAvailable();
    const root = document.createElement('div');
    root.className = 'nb-support-root';
    root.id = 'nbSupportRoot';
    root.innerHTML = `
      <button class="nb-chat-launcher" id="nbChatLauncher" type="button" aria-controls="nbChatPanel" aria-expanded="false" aria-label="Abrir atendimento">
        <span class="nb-chat-launcher-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 5.75h14v10.5H9.6L6 19v-2.75H5z"/></svg>
          <i class="nb-chat-presence ${available ? 'is-online' : 'is-later'}"></i>
        </span>
        <span class="nb-chat-launcher-copy"><strong>Precisa de ajuda?</strong><small>${available ? 'Atendimento disponível' : 'Robô disponível agora'}</small></span>
        <span class="nb-chat-unread" id="nbChatUnread" hidden>0</span>
      </button>

      <section class="nb-chat-panel" id="nbChatPanel" aria-label="Atendimento NARROWBORNE" aria-hidden="true" hidden>
        <header class="nb-chat-head">
          <div class="nb-chat-avatar" aria-hidden="true">N</div>
          <div class="nb-chat-head-copy">
            <strong>${escapeHtml(config.botName || 'NARROW Assist')}</strong>
            <span><i class="${available ? 'is-online' : 'is-later'}"></i>${available ? 'Robô e atendimento humano disponíveis' : 'Robô online · humano responde depois'}</span>
          </div>
          <button class="nb-chat-minimize" id="nbChatMinimize" type="button" aria-label="Minimizar atendimento">−</button>
        </header>

        <div class="nb-chat-messages" id="nbChatMessages" role="log" aria-live="polite" aria-relevant="additions"></div>
        <div class="nb-chat-typing" id="nbChatTyping" hidden aria-label="Assistente digitando"><span></span><span></span><span></span></div>
        <div class="nb-chat-suggestions" id="nbChatSuggestions"></div>

        <div class="nb-chat-human-row">
          <button type="button" id="nbChatHuman">Falar com um atendente <span>↗</span></button>
          <small>${available ? 'Resposta pelo WhatsApp' : 'Fora do horário · responderemos depois'}</small>
        </div>

        <form class="nb-chat-form" id="nbChatForm">
          <label class="sr-only" for="nbChatInput">Digite sua dúvida</label>
          <input id="nbChatInput" type="text" maxlength="500" autocomplete="off" placeholder="Digite sua dúvida…" required>
          <button type="submit" aria-label="Enviar mensagem">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 17 8-17 8 3-8zM7 12h14"/></svg>
          </button>
        </form>
        <div class="nb-chat-footnote">Atendimento ${escapeHtml(state.sessionId)}</div>
      </section>`;
    document.body.appendChild(root);

    document.getElementById('nbChatLauncher').addEventListener('click', openPanel);
    document.getElementById('nbChatMinimize').addEventListener('click', closePanel);
    document.getElementById('nbChatHuman').addEventListener('click', transferToWhatsapp);
    document.getElementById('nbChatForm').addEventListener('submit', event => {
      event.preventDefault();
      const input = document.getElementById('nbChatInput');
      sendCustomerMessage(input.value);
      input.value = '';
    });
    document.getElementById('nbChatSuggestions').addEventListener('click', event => {
      const button = event.target.closest('[data-chat-question]');
      if (button) sendCustomerMessage(button.dataset.chatQuestion || '');
    });
    document.getElementById('nbChatMessages').addEventListener('click', event => {
      if (event.target.closest('[data-chat-whatsapp]')) transferToWhatsapp();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && panelOpen) closePanel();
    });

    if (!state.messages.length) {
      addMessage('bot', config.welcome);
      if (!available && config.offlineText) addMessage('bot', config.offlineText);
    }
    renderSuggestions();
    renderMessages();
  }

  function renderSuggestions() {
    const host = document.getElementById('nbChatSuggestions');
    if (!host) return;
    const featured = faqCatalog.filter(faq => faq.featured);
    const questions = (featured.length ? featured : faqCatalog).map(faq => faq.question).filter(Boolean).slice(0, 4);
    host.innerHTML = questions.map(question => `<button type="button" data-chat-question="${escapeHtml(question)}">${escapeHtml(question)}</button>`).join('');
  }

  function renderMessages() {
    const host = document.getElementById('nbChatMessages');
    if (!host) return;
    host.innerHTML = state.messages.map(message => {
      const action = message.action === 'whatsapp'
        ? '<button class="nb-message-action" type="button" data-chat-whatsapp>Falar com um atendente <span>↗</span></button>'
        : '';
      return `<div class="nb-chat-message is-${message.role}">
        <div class="nb-message-bubble">${escapeHtml(message.text).replace(/\n/g, '<br>')}${action}</div>
      </div>`;
    }).join('');
    requestAnimationFrame(() => { host.scrollTop = host.scrollHeight; });
  }

  function setTyping(active) {
    botTyping = active;
    const indicator = document.getElementById('nbChatTyping');
    const input = document.getElementById('nbChatInput');
    if (indicator) indicator.hidden = !active;
    if (input) input.disabled = active;
    if (active) requestAnimationFrame(() => {
      const messages = document.getElementById('nbChatMessages');
      if (messages) messages.scrollTop = messages.scrollHeight;
    });
  }

  function sendCustomerMessage(rawMessage) {
    const message = String(rawMessage || '').trim();
    if (!message || botTyping) return;
    addMessage('user', message);
    setTyping(true);
    const delay = Math.min(1300, 520 + message.length * 8);
    setTimeout(() => {
      const response = answerFor(message);
      setTyping(false);
      addMessage('bot', response.text, response.action || '');
      document.getElementById('nbChatInput')?.focus();
    }, delay);
  }

  function updateUnread() {
    const badge = document.getElementById('nbChatUnread');
    if (!badge) return;
    badge.textContent = String(Math.min(unread, 9));
    badge.hidden = unread < 1;
  }

  function openPanel() {
    ensureUi();
    const root = document.getElementById('nbSupportRoot');
    const panel = document.getElementById('nbChatPanel');
    const launcher = document.getElementById('nbChatLauncher');
    if (!panel) return;
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('is-open'));
    panel.setAttribute('aria-hidden', 'false');
    launcher?.setAttribute('aria-expanded', 'true');
    root?.classList.add('is-panel-open');
    panelOpen = true;
    unread = 0;
    updateUnread();
    setTimeout(() => document.getElementById('nbChatInput')?.focus(), 180);
  }

  function closePanel() {
    const root = document.getElementById('nbSupportRoot');
    const panel = document.getElementById('nbChatPanel');
    const launcher = document.getElementById('nbChatLauncher');
    if (!panel) return;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    launcher?.setAttribute('aria-expanded', 'false');
    root?.classList.remove('is-panel-open');
    panelOpen = false;
    setTimeout(() => { if (!panel.classList.contains('is-open')) panel.hidden = true; }, 220);
    launcher?.focus();
  }

  window.NBSupportChat = {
    open: openPanel,
    close: closePanel,
    ask: sendCustomerMessage,
    whatsapp: transferToWhatsapp,
    resolve: answerFor,
    stats: {
      topics: faqCatalog.length,
      keywords: faqCatalog.reduce((total, faq) => total + faqKeywords(faq).length, 0),
      estimatedQuestionVariations: faqCatalog.reduce((total, faq) => total + faqKeywords(faq).length * 4, 0),
      estimatedResponseVariations: faqCatalog.reduce((total, faq) => {
        const answerCount = Array.isArray(faq.answers) && faq.answers.length ? faq.answers.length : 1;
        if (faq.style === 'direct') return total + answerCount;
        const knowledge = window.NB_CHAT_KNOWLEDGE || {};
        return total + answerCount * Math.max(1, (knowledge.openers || []).length) * Math.max(1, (knowledge.closers || []).length);
      }, 0),
      knowledgeVersion: (window.NB_CHAT_KNOWLEDGE || {}).version || 'custom'
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureUi, { once: true });
  } else {
    ensureUi();
  }
})();
