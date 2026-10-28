/* SBH DEV Arcade: catalog interactions.
   Connect only game URLs supplied/approved by your game provider.
   Do not paste arbitrary third-party URLs into this configuration. */
(() => {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const search = document.getElementById('gameSearch');
  const cards = [...document.querySelectorAll('.game-card')];
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const emptyState = document.getElementById('emptyState');
  let activeFilter = 'all';

  function filterGames() {
    const query = (search?.value || '').trim().toLocaleLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const matchesCategory = activeFilter === 'all' || card.dataset.category === activeFilter;
      const text = `${card.dataset.search || ''} ${card.innerText}`.toLocaleLowerCase();
      const matchesSearch = !query || text.includes(query);
      const show = matchesCategory && matchesSearch;
      card.hidden = !show;
      if (show) visible++;
    });
    if (emptyState) emptyState.hidden = visible > 0;
  }
  search?.addEventListener('input', filterGames);
  filterButtons.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter || 'all';
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    filterGames();
  }));

  const modal = document.getElementById('gameModal');
  const modalTitle = document.getElementById('modalTitle');
  const frameWrap = document.getElementById('gameFrameWrap');
  const closeButton = document.getElementById('modalClose');
  const defaultMessage = frameWrap?.innerHTML || '';

  /* Add a provider-approved URL to a card's data-game-url attribute to enable an embed.
     For safety, only HTTPS URLs are accepted. Confirm the provider permits iframe embedding. */
  document.querySelectorAll('.preview-game').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.game-card');
    const gameUrl = card?.dataset.gameUrl || '';
    if (modalTitle) modalTitle.textContent = button.dataset.title || 'Game';
    if (frameWrap) {
      frameWrap.innerHTML = defaultMessage;
      if (gameUrl) {
        try {
          const url = new URL(gameUrl, window.location.href);
          if (url.protocol === 'https:') {
            frameWrap.innerHTML = '';
            const iframe = document.createElement('iframe');
            iframe.src = url.href;
            iframe.title = button.dataset.title || 'Browser game';
            iframe.allow = 'fullscreen; gamepad; autoplay';
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            frameWrap.appendChild(iframe);
          }
        } catch (_) { /* Keep the provider-not-connected message for invalid URLs. */ }
      }
    }
    modal?.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeButton?.focus();
  }));
  function closeModal() {
    modal?.classList.remove('open');
    document.body.style.overflow = '';
    if (frameWrap) frameWrap.innerHTML = defaultMessage;
  }
  closeButton?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
