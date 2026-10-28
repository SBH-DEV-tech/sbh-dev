/* SBH DEV Arcade: resilient navigation, catalog filters, and playable local games. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const menuToggle = $('#menuToggle');
  const navMenu = $('#navMenu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    $$('a', navMenu).forEach(link => link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const search = $('#gameSearch');
  const cards = $$('.game-card');
  const filterButtons = $$('[data-filter]');
  const emptyState = $('#emptyState');
  let activeFilter = 'all';

  function filterGames() {
    const query = (search?.value || '').trim().toLocaleLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const categoryMatch = activeFilter === 'all' || card.dataset.category === activeFilter;
      const text = `${card.dataset.search || ''} ${card.innerText}`.toLocaleLowerCase();
      const show = categoryMatch && (!query || text.includes(query));
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

  const modal = $('#gameModal');
  const modalTitle = $('#modalTitle');
  const frameWrap = $('#gameFrameWrap');
  const closeButton = $('#modalClose');
  const initialMessage = frameWrap?.innerHTML || '';

  function openGame(link) {
    const card = link.closest('.game-card');
    const gameUrl = link.getAttribute('href') || card?.dataset.gameUrl || '';
    if (!gameUrl) return; // Anchor still works normally if the modal setup is absent.
    let url;
    try { url = new URL(gameUrl, window.location.href); } catch { return; }
    if (!(url.origin === window.location.origin || url.protocol === 'https:')) return;

    // If the modal markup is missing, let the anchor's normal navigation open the game.
    if (!modal || !frameWrap) return;

    if (modalTitle) modalTitle.textContent = link.dataset.title || 'SBH DEV Arcade';
    frameWrap.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = url.href;
    iframe.title = link.dataset.title || 'Browser game';
    iframe.loading = 'eager';
    iframe.allow = 'fullscreen; gamepad; autoplay';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.addEventListener('error', () => {
      frameWrap.innerHTML = '<p class="modal-message">The game could not load here. <a href="' + url.href + '">Open the game directly</a>.</p>';
    });
    frameWrap.appendChild(iframe);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton?.focus();
  }

  // Game cards use ordinary links so navigation still works if modal/iframe behavior is blocked.
  // Keep the modal helpers below available for future games, but do not intercept Play now.

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (frameWrap) frameWrap.innerHTML = initialMessage;
  }
  closeButton?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
