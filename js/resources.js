(function () {
  const GAMES_PER_PAGE = 50;
  const grid = document.getElementById('gamesGrid');
  const loading = document.getElementById('gamesLoading');
  const errorEl = document.getElementById('gamesError');
  const paginationEl = document.getElementById('pagination');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const categoryFilter = document.getElementById('categoryFilter');
  const gameModal = document.getElementById('gameModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalDetails = document.getElementById('modalDetails');
  const modalFrameWrap = document.getElementById('modalFrameWrap');
  const gameFrame = document.getElementById('gameFrame');
  const modalClose = document.getElementById('modalClose');
  const toggleFullscreenBtn = document.getElementById('toggleFullscreen');

  let allGames = [];
  let filteredGames = [];
  let currentPage = 1;
  let currentGame = null;

  function normalize(str) {
    return (str || '').toLowerCase().trim();
  }

  function filterGames() {
    const query = normalize(searchInput.value);
    const category = (categoryFilter.value || '').trim();
    filteredGames = allGames.filter(function (g) {
      const matchSearch = !query ||
        normalize(g.title).includes(query) ||
        normalize(g.description || '').includes(query) ||
        normalize(g.category || '').includes(query) ||
        normalize((g.tags || '').replace(/,/g, ' ')).includes(query);
      const matchCategory = !category || normalize(g.category || '') === category;
      return matchSearch && matchCategory;
    });
    sortGames();
    currentPage = 1;
    renderPage();
  }

  function sortGames() {
    const value = sortSelect.value;
    const [field, dir] = value.split('-');
    filteredGames.sort(function (a, b) {
      let va = field === 'title' ? (a.title || '') : (a.category || '');
      let vb = field === 'title' ? (b.title || '') : (b.category || '');
      va = va.toLowerCase();
      vb = vb.toLowerCase();
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  function renderGameCard(game) {
    const a = document.createElement('a');
    a.href = '#';
    a.className = 'game-card';
    a.setAttribute('data-id', game.id);
    a.innerHTML =
      '<img class="game-thumb" src="' + (game.thumb || '') + '" alt="" loading="lazy" onerror="this.style.background=\'#2a2a2e\';this.alt=\'No image\'">' +
      '<div class="game-info">' +
        '<h3 class="game-title">' + escapeHtml(game.title || 'Untitled') + '</h3>' +
        '<p class="game-category">' + escapeHtml(game.category || '') + '</p>' +
      '</div>';
    a.addEventListener('click', function (e) {
      e.preventDefault();
      openGame(game);
    });
    return a;
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function renderPage() {
    const total = filteredGames.length;
    const totalPages = Math.max(1, Math.ceil(total / GAMES_PER_PAGE));
    const start = (currentPage - 1) * GAMES_PER_PAGE;
    const slice = filteredGames.slice(start, start + GAMES_PER_PAGE);

    grid.innerHTML = '';
    slice.forEach(function (game) {
      grid.appendChild(renderGameCard(game));
    });
    grid.style.display = 'grid';

    // Pagination
    paginationEl.innerHTML = '';
    paginationEl.style.display = totalPages > 1 ? 'flex' : 'none';

    if (totalPages > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.textContent = 'Previous';
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener('click', function () {
        if (currentPage > 1) {
          currentPage--;
          renderPage();
          var panel = document.getElementById('resourcesModalPanel');
          if (panel) panel.scrollTo({ top: 0, behavior: 'smooth' }); else window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
      paginationEl.appendChild(prevBtn);

      const pageInfo = document.createElement('span');
      pageInfo.className = 'page-info';
      pageInfo.textContent = 'Page ' + currentPage + ' of ' + totalPages + ' (' + total + ' games)';
      paginationEl.appendChild(pageInfo);

      const nextBtn = document.createElement('button');
      nextBtn.textContent = 'Next';
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener('click', function () {
        if (currentPage < totalPages) {
          currentPage++;
          renderPage();
          var panel = document.getElementById('resourcesModalPanel');
          if (panel) panel.scrollTo({ top: 0, behavior: 'smooth' }); else window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
      paginationEl.appendChild(nextBtn);
    }
  }

  // Trigger a small scroll so mobile browsers (Chrome, etc.) minimize the URL bar
  function tryMinimizeUrlBar() {
    function nudge() {
      try {
        var y = window.scrollY || window.pageYOffset || 0;
        // A tiny scroll often collapses browser chrome on mobile.
        window.scrollTo(0, Math.max(1, y + 1));
        // Some iOS versions respond better to an explicit y=1.
        window.scrollTo(0, 1);
        if (document.documentElement) document.documentElement.scrollTop = 1;
        if (document.body) document.body.scrollTop = 1;
        // If we're inside a scrollable panel, nudge it too.
        var panel = document.getElementById('resourcesModalPanel');
        if (panel && typeof panel.scrollTop === 'number') panel.scrollTop = Math.max(1, panel.scrollTop + 1);
      } catch (_) {}
    }
    // Best-effort only; iOS Safari may ignore programmatic URL bar changes.
    setTimeout(nudge, 50);
    setTimeout(nudge, 250);
    setTimeout(nudge, 800);
  }

  function openGame(game) {
    currentGame = game;
    gameModal.classList.remove('pseudo-fullscreen', 'fullscreen-ui');
    modalTitle.textContent = game.title || 'Game';
    if (modalSubtitle) {
      const cat = (game.category || '').trim();
      const tags = (game.tags || '').trim();
      modalSubtitle.textContent = [cat, tags].filter(Boolean).join(' • ');
    }

    modalDetails.innerHTML =
      '<div class="details-grid">' +
        (game.description ? '<div class="details-block"><h3>About</h3><p>' + escapeHtml(game.description) + '</p></div>' : '') +
        (game.instructions ? '<div class="details-block"><h3>How to play</h3><p>' + escapeHtml(game.instructions) + '</p></div>' : '') +
      '</div>';
    modalDetails.style.display = (game.description || game.instructions) ? 'block' : 'none';

    modalFrameWrap.style.display = 'block';
    gameFrame.src = game.url || '';
    gameFrame.style.height = '100%';
    gameModal.style.display = 'flex';
    gameModal.setAttribute('aria-hidden', 'false');
    tryMinimizeUrlBar();
  }

  function closeModal() {
    // If we're in fullscreen, exit before closing.
    if (getFullscreenElement()) exitFullscreen();
    gameModal.classList.remove('pseudo-fullscreen');
    gameModal.classList.remove('fullscreen-ui');
    gameModal.style.display = 'none';
    gameModal.setAttribute('aria-hidden', 'true');
    gameFrame.src = 'about:blank';
    currentGame = null;
  }

  function getFullscreenElement() {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      null
    );
  }

  function exitFullscreen() {
    const exit =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;
    if (!exit) return;
    try {
      const p = exit.call(document);
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (_) {}
  }

  function requestFullscreen(el) {
    if (!el) return false;
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;
    if (!req) return false;
    try {
      const p = req.call(el);
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // Some mobile browsers deny fullscreen; fall back to pseudo fullscreen.
          gameModal.classList.add('pseudo-fullscreen');
          updateFullscreenButton();
          tryMinimizeUrlBar();
        });
      }
      return true;
    } catch (_) {
      return false;
    }
  }

  function isFullscreenEnabled() {
    // If the browser exposes fullscreenEnabled and it's false, fullscreen is blocked
    // (often due to Permissions Policy / iframe restrictions).
    const enabled =
      (typeof document.fullscreenEnabled === 'boolean' ? document.fullscreenEnabled : undefined) ??
      (typeof document.webkitFullscreenEnabled === 'boolean' ? document.webkitFullscreenEnabled : undefined);
    return enabled !== false;
  }

  function updateFullscreenButton() {
    if (!toggleFullscreenBtn) return;
    const on = !!getFullscreenElement() || gameModal.classList.contains('pseudo-fullscreen');
    gameModal.classList.toggle('fullscreen-ui', on);

    const label = on ? 'Exit fullscreen' : 'Fullscreen';
    const aria = on ? 'Exit fullscreen' : 'Enter fullscreen';
    const labelEl = toggleFullscreenBtn.querySelector('.fs-label');
    if (labelEl) labelEl.textContent = label;
    toggleFullscreenBtn.setAttribute('aria-label', aria);
  }

  function toggleFullscreen() {
    const el = modalFrameWrap || gameFrame;
    if (!el) return;
    if (getFullscreenElement()) {
      exitFullscreen();
      gameModal.classList.remove('pseudo-fullscreen');
      updateFullscreenButton();
      return;
    }
    if (gameModal.classList.contains('pseudo-fullscreen')) {
      gameModal.classList.remove('pseudo-fullscreen');
      updateFullscreenButton();
      return;
    }
    // Entering fullscreen
    if (!isFullscreenEnabled()) {
      gameModal.classList.add('pseudo-fullscreen');
      updateFullscreenButton();
      tryMinimizeUrlBar();
      return;
    }
    const started = requestFullscreen(el) || (el !== gameFrame && requestFullscreen(gameFrame));
    if (!started) {
      gameModal.classList.add('pseudo-fullscreen');
      updateFullscreenButton();
      tryMinimizeUrlBar();
      return;
    }
    tryMinimizeUrlBar();
    // Only run fallback when we just tried to enter (not when user exited).
    // Browsers can fail silently; after a short delay, if still not fullscreen, use pseudo.
    setTimeout(() => {
      if (!getFullscreenElement() && !gameModal.classList.contains('pseudo-fullscreen')) {
        gameModal.classList.add('pseudo-fullscreen');
        tryMinimizeUrlBar();
      }
      updateFullscreenButton();
    }, 250);
  }

  modalClose.addEventListener('click', closeModal);
  if (toggleFullscreenBtn) toggleFullscreenBtn.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', updateFullscreenButton);
  document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
  updateFullscreenButton();
  gameModal.addEventListener('click', function (e) {
    if (e.target === gameModal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && gameModal.style.display === 'flex') closeModal();
  });

  searchInput.addEventListener('input', function () {
    filterGames();
  });
  sortSelect.addEventListener('change', function () {
    sortGames();
    currentPage = 1;
    renderPage();
  });
  categoryFilter.addEventListener('change', filterGames);

  function populateCategories() {
    const set = new Set();
    allGames.forEach(function (g) {
      const c = (g.category || '').trim();
      if (c) set.add(c);
    });
    const list = Array.from(set).sort();
    list.forEach(function (c) {
      const opt = document.createElement('option');
      opt.value = c.toLowerCase();
      opt.textContent = c;
      categoryFilter.appendChild(opt);
    });
  }

  function init() {
    fetch('data.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Could not load games.');
        return res.json();
      })
      .then(function (data) {
        loading.style.display = 'none';
        allGames = Array.isArray(data) ? data : [];
        populateCategories();
        filteredGames = allGames.slice();
        sortGames();
        renderPage();
      })
      .catch(function (err) {
        loading.style.display = 'none';
        errorEl.textContent = 'Failed to load games. Please try again.';
        errorEl.style.display = 'block';
      });
  }

  init();
})();
