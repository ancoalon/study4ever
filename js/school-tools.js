(function () {
  'use strict';

  function playBeep() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  }

  // ----- Theme (night mode) -----
  var THEME_KEY = 'study4class-theme';
  function getTheme() { return localStorage.getItem(THEME_KEY); }
  function setTheme(v) { localStorage.setItem(THEME_KEY, v); }
  function isNight() { return document.body.classList.contains('body-night'); }
  function applyTheme(night) {
    if (night) {
      document.body.classList.add('body-night');
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.content = '#0f172a';
    } else {
      document.body.classList.remove('body-night');
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.content = '#2563eb';
    }
  }
  function updateToggleIcon() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.textContent = isNight() ? '☀️' : '🌙';
    btn.setAttribute('aria-label', isNight() ? 'Switch to light mode' : 'Switch to dark mode');
  }
  if (getTheme() === 'dark') {
    document.body.classList.add('body-night');
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = '#0f172a';
  } else {
    var m2 = document.querySelector('meta[name="theme-color"]');
    if (m2) m2.content = '#2563eb';
  }
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    updateToggleIcon();
    themeToggle.addEventListener('click', function () {
      var night = !isNight();
      setTheme(night ? 'dark' : 'light');
      applyTheme(night);
      updateToggleIcon();
    });
  }

  // ----- Tool "How to" (SEO-friendly + UX) -----
  var TOOL_HOWTO = {
    calculator: {
      steps: [
        'Type an expression (e.g., 2*pi, sqrt(16)+1) and press Enter.',
        'Or use the keypad buttons to build an expression.',
        'Use C to clear and = to evaluate.'
      ]
    },
    timer: {
      steps: [
        'Pick Stopwatch or Countdown at the top.',
        'Press Start to begin; use Reset to clear.',
        'For countdown, set minutes/seconds first.'
      ]
    },
    wordcounter: {
      steps: [
        'Paste or type text into the box.',
        'Counts update automatically (words, characters, paragraphs, reading time).',
        'Edit the text to see stats change instantly.'
      ]
    },
    notes: {
      steps: [
        'Type notes in Edit; they auto-save in your browser.',
        'Use Preview to see Markdown formatting.',
        'Use Clear notes to remove saved notes on this device.'
      ]
    },
    converter: {
      steps: [
        'Choose a category (length, area, volume, etc.).',
        'Enter a value and select the “from” and “to” units.',
        'The converted value updates automatically.'
      ]
    },
    formulas: {
      steps: [
        'Search for a topic or formula name.',
        'Click a result to view the formula and notes.',
        'Use the category buttons to browse.'
      ]
    },
    flashcards: {
      steps: [
        'Enter Front and Back, then press Add card.',
        'Use Prev/Next to navigate and Flip to reveal the other side.',
        'Shuffle mixes the deck; Remove deletes the current card.'
      ]
    },
    pomodoro: {
      steps: [
        'Set focus/break times (if available) and press Start.',
        'Work during focus; take breaks during break.',
        'Reset to restart the cycle.'
      ]
    },
    gpa: {
      steps: [
        'Add classes with credits and letter grades.',
        'Update each row; GPA recalculates automatically.',
        'Use Reset/Clear to start over.'
      ]
    },
    checklist: {
      steps: [
        'Add tasks and check them off as you finish.',
        'Your list saves in your browser on this device.',
        'Clear removes the saved checklist.'
      ]
    },
    citations: {
      steps: [
        'Pick MLA or APA (basic).',
        'Fill in the fields (title, author, site, date, URL).',
        'Copy the generated citation from the output box.'
      ]
    },
    practice: {
      steps: [
        'Choose your difficulty/settings (if shown).',
        'Answer the questions and submit to check your score.',
        'Use Reset/New to generate more practice.'
      ]
    },
    finalgrade: {
      steps: [
        'Enter current grade, desired grade, and final weight.',
        'Press Calculate to see the score you need on the final.',
        'Reset restores the example values.'
      ]
    },
    typing: {
      steps: [
        'Pick passage length and duration.',
        'Press Start, then type in the input box.',
        'See WPM and accuracy update; Restart generates new text.'
      ]
    },
    cornell: {
      steps: [
        'Fill Topic, Cues, Notes, and Summary.',
        'Use Preview to see a clean formatted view.',
        'Print exports a clean copy; your work auto-saves.'
      ]
    },
    quadratic: {
      steps: [
        'Enter a, b, and c for ax² + bx + c = 0.',
        'Press Solve to see roots and the discriminant.',
        'Reset restores the default example.'
      ]
    },
    periodictable: {
      steps: [
        'Open the tool and wait for elements to load.',
        'Click an element to see details (symbol, mass, etc.).',
        'Use the detail panel to review properties.'
      ]
    },
    roman: {
      steps: [
        'Type a number (1–3999) or a Roman numeral (e.g., XLII).',
        'Press Convert (or Enter).',
        'Use Clear to reset.'
      ]
    },
    percentage: {
      steps: [
        'Choose a tab (% of, what %, or percent change).',
        'Fill in the numbers for that tab.',
        'Press Calculate to get the result.'
      ]
    },
    fraction: {
      steps: [
        'Enter numerator and denominator.',
        'Press Simplify & convert.',
        'You’ll see simplified form, decimal, and mixed number.'
      ]
    }
  };

  function ensureHowTo(toolId) {
    var data = TOOL_HOWTO[toolId];
    if (!data) return;
    var modal = document.getElementById('modal-' + toolId);
    if (!modal) return;
    if (modal.querySelector('.tool-howto')) return;
    var body = modal.querySelector('.tool-modal-body');
    if (!body) return;

    var details = document.createElement('details');
    details.className = 'tool-howto';
    details.open = false;

    var summary = document.createElement('summary');
    summary.textContent = 'How to use';
    details.appendChild(summary);

    var ol = document.createElement('ol');
    (data.steps || []).forEach(function (step) {
      var li = document.createElement('li');
      li.textContent = step;
      ol.appendChild(li);
    });
    details.appendChild(ol);

    if (data.note) {
      var note = document.createElement('div');
      note.className = 'tool-howto-note';
      note.textContent = data.note;
      details.appendChild(note);
    }

    body.insertBefore(details, body.firstChild);
  }

  // ----- Generic tool modals -----
  function openToolModal(toolId) {
    // Only allow one modal open at a time
    closeOpenModal();
    ensureHowTo(toolId);
    var modal = document.getElementById('modal-' + toolId);
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeToolModal(toolId) {
    var modal = document.getElementById('modal-' + toolId);
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    // Re-enable scroll only if nothing is open
    if (!document.querySelector('.tool-modal-overlay.open')) document.body.style.overflow = '';
  }

  function closeOpenModal() {
    var openModal = document.querySelector('.tool-modal-overlay.open');
    if (openModal) {
      var id = openModal.getAttribute('data-modal');
      if (id) closeToolModal(id);
    }
  }

  document.querySelectorAll('.tool-card[data-tool]').forEach(function (card) {
    card.addEventListener('click', function () {
      openToolModal(this.getAttribute('data-tool'));
    });
  });

  document.querySelectorAll('.tool-modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeToolModal(overlay.getAttribute('data-modal'));
    });
  });

  document.querySelectorAll('.tool-modal-close').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var overlay = this.closest('.tool-modal-overlay');
      if (overlay) closeToolModal(overlay.getAttribute('data-modal'));
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var resourcesModal = document.getElementById('resourcesModal');
    var gameModal = document.getElementById('gameModal');
    if (resourcesModal && resourcesModal.classList.contains('open') && gameModal && gameModal.style.display === 'flex') {
      return;
    }
    if (resourcesModal && resourcesModal.classList.contains('open')) {
      if (typeof window.closeResourcesModal === 'function') window.closeResourcesModal();
      return;
    }
    closeOpenModal();
  });

  // ----- Resources modal (games) -----
  (function () {
    var resourcesModal = document.getElementById('resourcesModal');
    if (!resourcesModal) return;
    var closeBtn = document.getElementById('resourcesModalClose');
    var resourcesSavedScrollY = 0;
    var resourcesPrevBodyOverflow = '';
    function isIOSLikeSafari() {
      try {
        var ua = navigator.userAgent || '';
        var iOS = /iP(ad|hone|od)/.test(ua);
        // iPadOS often reports as MacIntel but has touch points
        var iPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
        // Only treat as Safari-ish when not iOS Chrome/Firefox wrappers
        var webkitWrapper = /(CriOS|FxiOS|EdgiOS)/.test(ua);
        return (iOS || iPadOS) && !webkitWrapper;
      } catch (e) {
        return false;
      }
    }
    function tryMinimizeUrlBar() {
      function nudge() {
        try {
          var y = window.scrollY || window.pageYOffset || 0;
          window.scrollTo(0, Math.max(1, y + 1));
          window.scrollTo(0, 1);
          if (document.documentElement) document.documentElement.scrollTop = 1;
          if (document.body) document.body.scrollTop = 1;
          var panel = document.getElementById('resourcesModalPanel');
          if (panel && typeof panel.scrollTop === 'number') panel.scrollTop = Math.max(1, panel.scrollTop + 1);
        } catch (e) {}
      }
      setTimeout(nudge, 50);
      setTimeout(nudge, 250);
      setTimeout(nudge, 800);
    }
    function openResourcesModal() {
      closeOpenModal();
      resourcesSavedScrollY = window.scrollY || window.pageYOffset || 0;
      resourcesPrevBodyOverflow = document.body.style.overflow || '';
      resourcesModal.classList.add('open');
      resourcesModal.setAttribute('aria-hidden', 'false');
      // iPhone Safari only collapses the URL bar on real page scroll.
      // So on iOS Safari, don't lock scrolling; we restore scroll position on close.
      document.body.style.overflow = isIOSLikeSafari() ? '' : 'hidden';
      tryMinimizeUrlBar();
    }
    function closeResourcesModal() {
      resourcesModal.classList.remove('open');
      resourcesModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = resourcesPrevBodyOverflow;
      // Restore scroll position so background doesn't "jump" after closing.
      try { window.scrollTo(0, resourcesSavedScrollY || 0); } catch (e) {}
      var gameModal = document.getElementById('gameModal');
      if (gameModal && gameModal.style.display === 'flex') {
        gameModal.style.display = 'none';
        gameModal.setAttribute('aria-hidden', 'true');
        var frame = document.getElementById('gameFrame');
        if (frame) frame.src = 'about:blank';
      }
    }
    window.openResourcesModal = openResourcesModal;
    window.closeResourcesModal = closeResourcesModal;
    if (closeBtn) closeBtn.addEventListener('click', closeResourcesModal);
    resourcesModal.addEventListener('click', function (e) {
      if (e.target === resourcesModal) closeResourcesModal();
    });
  })();

  // ----- Stopwatch -----
  var stopwatchDisplay = document.getElementById('stopwatchDisplay');
  var stopwatchStart = document.getElementById('stopwatchStart');
  var stopwatchLap = document.getElementById('stopwatchLap');
  var stopwatchReset = document.getElementById('stopwatchReset');
  var stopwatchLaps = document.getElementById('stopwatchLaps');

  var stopwatchElapsed = 0;
  var stopwatchTick = null;
  var stopwatchLastLap = 0;

  function stopwatchRender() {
    if (!stopwatchDisplay) return;
    var ms = Math.floor(stopwatchElapsed % 1000 / 100);
    var s = Math.floor(stopwatchElapsed / 1000) % 60;
    var m = Math.floor(stopwatchElapsed / 60000) % 60;
    var h = Math.floor(stopwatchElapsed / 3600000);
    stopwatchDisplay.textContent =
      (h < 10 ? '0' : '') + h + ':' +
      (m < 10 ? '0' : '') + m + ':' +
      (s < 10 ? '0' : '') + s + '.' + ms;
  }

  function stopwatchTickFn() {
    stopwatchElapsed += 100;
    stopwatchRender();
  }

  if (stopwatchStart) {
    stopwatchStart.addEventListener('click', function () {
      if (stopwatchTick) {
        clearInterval(stopwatchTick);
        stopwatchTick = null;
        stopwatchStart.textContent = 'Start';
        if (stopwatchLap) stopwatchLap.disabled = true;
      } else {
        stopwatchTick = setInterval(stopwatchTickFn, 100);
        stopwatchStart.textContent = 'Pause';
        if (stopwatchLap) stopwatchLap.disabled = false;
      }
    });
  }
  if (stopwatchLap && stopwatchLaps) {
    stopwatchLap.addEventListener('click', function () {
      var lapTime = stopwatchElapsed - stopwatchLastLap;
      stopwatchLastLap = stopwatchElapsed;
      var li = document.createElement('li');
      var ms = Math.floor(lapTime % 1000 / 100);
      var s = Math.floor(lapTime / 1000) % 60;
      var m = Math.floor(lapTime / 60000);
      li.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s + '.' + ms;
      stopwatchLaps.appendChild(li);
    });
  }
  if (stopwatchReset) {
    stopwatchReset.addEventListener('click', function () {
      if (stopwatchTick) {
        clearInterval(stopwatchTick);
        stopwatchTick = null;
      }
      stopwatchElapsed = 0;
      stopwatchLastLap = 0;
      if (stopwatchStart) stopwatchStart.textContent = 'Start';
      if (stopwatchLap) stopwatchLap.disabled = true;
      if (stopwatchLaps) stopwatchLaps.innerHTML = '';
      stopwatchRender();
    });
  }

  // ----- Countdown timer -----
  var cdMinutes = document.getElementById('cdMinutes');
  var cdSeconds = document.getElementById('cdSeconds');
  var countdownDisplay = document.getElementById('countdownDisplay');
  var countdownStart = document.getElementById('countdownStart');
  var countdownReset = document.getElementById('countdownReset');

  var countdownRemaining = 0;
  var countdownTick = null;

  function countdownRender() {
    if (!countdownDisplay) return;
    var total = Math.max(0, countdownRemaining);
    var s = total % 60;
    var m = Math.floor(total / 60);
    countdownDisplay.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function countdownTickFn() {
    countdownRemaining -= 1;
    countdownRender();
    if (countdownRemaining <= 0) {
      clearInterval(countdownTick);
      countdownTick = null;
      playBeep();
      if (countdownStart) { countdownStart.textContent = 'Start'; countdownStart.disabled = false; }
      if (cdMinutes) cdMinutes.disabled = false;
      if (cdSeconds) cdSeconds.disabled = false;
    }
  }

  if (countdownStart) {
    countdownStart.addEventListener('click', function () {
      if (countdownTick) {
        clearInterval(countdownTick);
        countdownTick = null;
        countdownStart.textContent = 'Start';
        countdownStart.disabled = false;
        return;
      }
      var m = parseInt(cdMinutes.value, 10) || 0;
      var s = parseInt(cdSeconds.value, 10) || 0;
      countdownRemaining = m * 60 + s;
      if (countdownRemaining <= 0) return;
      if (cdMinutes) cdMinutes.disabled = true;
      if (cdSeconds) cdSeconds.disabled = true;
      countdownStart.textContent = 'Pause';
      countdownTick = setInterval(countdownTickFn, 1000);
      countdownRender();
    });
  }
  if (countdownReset) {
    countdownReset.addEventListener('click', function () {
      if (countdownTick) clearInterval(countdownTick);
      countdownTick = null;
      countdownRemaining = 0;
      if (countdownStart) { countdownStart.textContent = 'Start'; countdownStart.disabled = false; }
      if (cdMinutes) cdMinutes.disabled = false;
      if (cdSeconds) cdSeconds.disabled = false;
      countdownRender();
    });
  }

  function countdownUpdateFromInputs() {
    if (countdownTick || !cdMinutes || !cdSeconds) return;
    var m = parseInt(cdMinutes.value, 10) || 0;
    var s = parseInt(cdSeconds.value, 10) || 0;
    countdownRemaining = m * 60 + s;
    countdownRender();
  }
  if (cdMinutes) cdMinutes.addEventListener('input', countdownUpdateFromInputs);
  if (cdSeconds) cdSeconds.addEventListener('input', countdownUpdateFromInputs);

  document.querySelectorAll('.timer-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var t = this.getAttribute('data-tab');
      var parent = this.closest('.tool-modal-body');
      if (!parent) return;
      parent.querySelectorAll('.timer-tab').forEach(function (x) { x.classList.remove('active'); });
      parent.querySelectorAll('.timer-panel').forEach(function (x) { x.classList.remove('active'); });
      this.classList.add('active');
      var panel = parent.querySelector('.stopwatch-panel');
      if (t === 'countdown') panel = parent.querySelector('.countdown-panel');
      if (panel) panel.classList.add('active');
    });
  });

  // ----- Word counter -----
  var wordCounterText = document.getElementById('wordCounterText');
  var wordCountEl = document.getElementById('wordCount');
  var charCountEl = document.getElementById('charCount');
  var charCountNoSpacesEl = document.getElementById('charCountNoSpaces');
  var paragraphCountEl = document.getElementById('paragraphCount');
  var readingTimeEl = document.getElementById('readingTime');
  var READING_WPM = 200;

  function updateWordCount() {
    var text = (wordCounterText && wordCounterText.value) || '';
    var chars = text.length;
    var noSpaces = text.replace(/\s/g, '').length;
    var words = text.trim() ? text.trim().split(/\s+/).length : 0;
    var paragraphs = text ? text.split(/\n\s*\n/).filter(function (p) { return p.trim().length > 0; }).length : 0;
    var readingMin = words > 0 ? Math.max(1, Math.ceil(words / READING_WPM)) : 0;
    if (wordCountEl) wordCountEl.textContent = words;
    if (charCountEl) charCountEl.textContent = chars;
    if (charCountNoSpacesEl) charCountNoSpacesEl.textContent = noSpaces;
    if (paragraphCountEl) paragraphCountEl.textContent = paragraphs;
    if (readingTimeEl) readingTimeEl.textContent = readingMin + ' min read';
  }

  if (wordCounterText) {
    wordCounterText.addEventListener('input', updateWordCount);
    wordCounterText.addEventListener('paste', function () { setTimeout(updateWordCount, 0); });
  }

  // ----- Quick notes (localStorage) -----
  var notesText = document.getElementById('notesText');
  var notesClear = document.getElementById('notesClear');
  var NOTES_KEY = 'school-tools-notes';

  var notesCharCountEl = document.getElementById('notesCharCount');

  function updateNotesCharCount() {
    if (notesCharCountEl && notesText) notesCharCountEl.textContent = notesText.value.length + ' characters';
  }

  if (notesText) {
    try {
      var saved = localStorage.getItem(NOTES_KEY);
      if (saved != null) notesText.value = saved;
    } catch (e) {}
    updateNotesCharCount();
    notesText.addEventListener('input', function () {
      try { localStorage.setItem(NOTES_KEY, notesText.value); } catch (e) {}
      updateNotesCharCount();
    });
  }
  if (notesClear && notesText) {
    notesClear.addEventListener('click', function () {
      notesText.value = '';
      try { localStorage.setItem(NOTES_KEY, ''); } catch (e) {}
      updateNotesCharCount();
    });
  }
  var notesEditTab = document.getElementById('notesEditTab');
  var notesPreviewTab = document.getElementById('notesPreviewTab');
  var notesEditPane = document.getElementById('notesEditPane');
  var notesPreviewPane = document.getElementById('notesPreviewPane');
  var notesPreviewContent = document.getElementById('notesPreviewContent');
  function renderNotesPreview() {
    if (!notesPreviewContent || !notesText) return;
    if (typeof marked !== 'undefined') {
      try {
        notesPreviewContent.innerHTML = (marked.parse ? marked.parse(notesText.value || '') : marked(notesText.value || ''));
      } catch (e) {
        notesPreviewContent.textContent = notesText.value || '(No content)';
      }
    } else {
      notesPreviewContent.textContent = notesText.value || '(No content)';
    }
  }
  function showNotesEdit() {
    if (notesEditPane) notesEditPane.style.display = '';
    if (notesPreviewPane) { notesPreviewPane.style.display = 'none'; notesPreviewPane.setAttribute('aria-hidden', 'true'); }
    if (notesEditTab) { notesEditTab.classList.add('active'); notesEditTab.setAttribute('aria-pressed', 'true'); }
    if (notesPreviewTab) { notesPreviewTab.classList.remove('active'); notesPreviewTab.setAttribute('aria-pressed', 'false'); }
  }
  function showNotesPreview() {
    renderNotesPreview();
    if (notesEditPane) notesEditPane.style.display = 'none';
    if (notesPreviewPane) { notesPreviewPane.style.display = 'block'; notesPreviewPane.setAttribute('aria-hidden', 'false'); }
    if (notesEditTab) { notesEditTab.classList.remove('active'); notesEditTab.setAttribute('aria-pressed', 'false'); }
    if (notesPreviewTab) { notesPreviewTab.classList.add('active'); notesPreviewTab.setAttribute('aria-pressed', 'true'); }
  }
  if (notesEditTab) notesEditTab.addEventListener('click', showNotesEdit);
  if (notesPreviewTab) notesPreviewTab.addEventListener('click', showNotesPreview);

  // ----- Unit converter -----
  var lengthRates = { m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, yd: 0.9144, mi: 1609.344, nmi: 1852 };
  var areaRates = { m2: 1, km2: 1e6, cm2: 0.0001, ft2: 0.092903, in2: 0.00064516, yd2: 0.836127, mi2: 2589988.11, acre: 4046.86, hectare: 10000 };
  var volumeRates = { m3: 1, L: 0.001, mL: 0.000001, cm3: 0.000001, ft3: 0.0283168, in3: 1.63871e-5, gal: 0.00378541, qt: 0.000946353, floz: 2.95735e-5, galuk: 0.00454609 };
  var weightRates = { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, ton: 1000, stone: 6.35029 };
  var timeRates = { s: 1, min: 60, h: 3600, d: 86400, week: 604800, year: 31536000 };
  var speedRates = { ms: 1, kmh: 0.277778, mph: 0.44704, fts: 0.3048, knot: 0.514444 };
  var pressureRates = { pa: 1, kpa: 1000, bar: 100000, atm: 101325, psi: 6894.76, mmHg: 133.322, inHg: 3386.39 };
  var energyRates = { J: 1, kJ: 1000, cal: 4.184, kcal: 4184, kWh: 3600000, eV: 1.60218e-19, BTU: 1055.06 };

  function runConvert(fromInputId, toInputId, fromUnitId, toUnitId, rates) {
    var fromVal = parseFloat(document.getElementById(fromInputId).value) || 0;
    var fromU = (document.getElementById(fromUnitId) || {}).value;
    var toU = (document.getElementById(toUnitId) || {}).value;
    var base = fromVal * (rates[fromU] || 1);
    var out = base / (rates[toU] || 1);
    var toEl = document.getElementById(toInputId);
    if (toEl) toEl.value = out >= 1e10 || (out > 0 && out < 1e-6) ? out : Math.round(out * 1e10) / 1e10;
  }

  function convertLength() { runConvert('lengthFrom', 'lengthTo', 'lengthFromUnit', 'lengthToUnit', lengthRates); }
  function convertArea() { runConvert('areaFrom', 'areaTo', 'areaFromUnit', 'areaToUnit', areaRates); }
  function convertVolume() { runConvert('volumeFrom', 'volumeTo', 'volumeFromUnit', 'volumeToUnit', volumeRates); }
  function convertWeight() { runConvert('weightFrom', 'weightTo', 'weightFromUnit', 'weightToUnit', weightRates); }
  function convertTime() { runConvert('timeFrom', 'timeTo', 'timeFromUnit', 'timeToUnit', timeRates); }
  function convertSpeed() { runConvert('speedFrom', 'speedTo', 'speedFromUnit', 'speedToUnit', speedRates); }
  function convertPressure() { runConvert('pressureFrom', 'pressureTo', 'pressureFromUnit', 'pressureToUnit', pressureRates); }
  function convertEnergy() { runConvert('energyFrom', 'energyTo', 'energyFromUnit', 'energyToUnit', energyRates); }

  function convertTemp() {
    var fromVal = parseFloat(document.getElementById('tempFrom').value) || 0;
    var fromU = document.getElementById('tempFromUnit').value;
    var toU = document.getElementById('tempToUnit').value;
    var c = fromVal;
    if (fromU === 'f') c = (fromVal - 32) * 5 / 9;
    if (fromU === 'k') c = fromVal - 273.15;
    var out = c;
    if (toU === 'f') out = c * 9 / 5 + 32;
    if (toU === 'k') out = c + 273.15;
    var toEl = document.getElementById('tempTo');
    if (toEl) toEl.value = Math.round(out * 1e4) / 1e4;
  }

  [
    ['lengthFrom', 'lengthFromUnit', 'lengthToUnit', convertLength],
    ['areaFrom', 'areaFromUnit', 'areaToUnit', convertArea],
    ['volumeFrom', 'volumeFromUnit', 'volumeToUnit', convertVolume],
    ['weightFrom', 'weightFromUnit', 'weightToUnit', convertWeight],
    ['timeFrom', 'timeFromUnit', 'timeToUnit', convertTime],
    ['speedFrom', 'speedFromUnit', 'speedToUnit', convertSpeed],
    ['pressureFrom', 'pressureFromUnit', 'pressureToUnit', convertPressure],
    ['energyFrom', 'energyFromUnit', 'energyToUnit', convertEnergy],
    ['tempFrom', 'tempFromUnit', 'tempToUnit', convertTemp]
  ].forEach(function (arr) {
    var ids = [arr[0], arr[1], arr[2]];
    var fn = arr[3];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.addEventListener('input', fn); el.addEventListener('change', fn); }
    });
  });

  document.querySelectorAll('.converter-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var conv = this.getAttribute('data-conv');
      var parent = this.closest('.tool-modal-body');
      if (!parent) return;
      parent.querySelectorAll('.converter-tab').forEach(function (x) { x.classList.remove('active'); });
      parent.querySelectorAll('.converter-panel').forEach(function (x) { x.classList.remove('active'); });
      this.classList.add('active');
      var panel = parent.querySelector('.length-panel');
      if (conv === 'area') panel = parent.querySelector('.area-panel');
      if (conv === 'volume') panel = parent.querySelector('.volume-panel');
      if (conv === 'weight') panel = parent.querySelector('.weight-panel');
      if (conv === 'temp') panel = parent.querySelector('.temp-panel');
      if (conv === 'time') panel = parent.querySelector('.time-panel');
      if (conv === 'speed') panel = parent.querySelector('.speed-panel');
      if (conv === 'pressure') panel = parent.querySelector('.pressure-panel');
      if (conv === 'energy') panel = parent.querySelector('.energy-panel');
      if (panel) panel.classList.add('active');
    });
  });

  convertLength();
  convertArea();
  convertVolume();
  convertWeight();
  convertTime();
  convertSpeed();
  convertPressure();
  convertEnergy();
  convertTemp();

  // ----- Formula search + category filter + KaTeX render -----
  var formulaSearch = document.getElementById('formulaSearch');
  var formulaCategory = document.getElementById('formulaCategory');
  function formulaApplyFilters() {
    var q = (formulaSearch && formulaSearch.value || '').toLowerCase().trim();
    var cat = (formulaCategory && formulaCategory.value || '').toLowerCase().trim();
    document.querySelectorAll('[data-formula-section]').forEach(function (section) {
      var sectionCat = (section.getAttribute('data-category') || '').toLowerCase();
      var matchCat = !cat || sectionCat === cat;
      var text = (section.textContent || '').toLowerCase();
      var matchSearch = !q || text.indexOf(q) !== -1;
      section.style.display = matchCat && matchSearch ? '' : 'none';
    });
  }
  if (formulaSearch) formulaSearch.addEventListener('input', formulaApplyFilters);
  if (formulaCategory) formulaCategory.addEventListener('change', formulaApplyFilters);
  function renderFormulaLatex() {
    if (typeof katex === 'undefined') return;
    document.querySelectorAll('#formulaList [data-latex]').forEach(function (el) {
      try {
        katex.render(el.getAttribute('data-latex'), el, { throwOnError: false, displayMode: false });
      } catch (e) {}
    });
  }
  var formulaModal = document.getElementById('modal-formulas');
  if (formulaModal) {
    formulaModal.addEventListener('transitionend', function () {
      if (formulaModal.classList.contains('open')) renderFormulaLatex();
    });
    document.querySelectorAll('.tool-card[data-tool="formulas"]').forEach(function (btn) {
      btn.addEventListener('click', function () { setTimeout(renderFormulaLatex, 100); });
    });
  }

  // ----- GPA calculator -----
  var gpaAddRow = document.getElementById('gpaAddRow');
  var gpaClear = document.getElementById('gpaClear');
  var gpaTbody = document.getElementById('gpaTbody');
  var gpaValue = document.getElementById('gpaValue');
  var GPA_KEY = 'school-tools-gpa';

  var gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };

  var gpaCourses = [];
  var gpaChartInstance = null;

  function gpaSave() {
    try { localStorage.setItem(GPA_KEY, JSON.stringify(gpaCourses)); } catch (e) {}
  }

  function gpaLoad() {
    try {
      var raw = localStorage.getItem(GPA_KEY);
      if (raw) {
        var data = JSON.parse(raw);
        if (Array.isArray(data)) gpaCourses = data;
      }
    } catch (e) {}
    if (!Array.isArray(gpaCourses) || gpaCourses.length === 0) {
      gpaCourses = [
        { name: 'Course 1', credits: 3, grade: 'A' },
        { name: 'Course 2', credits: 3, grade: 'B+' },
        { name: 'Course 3', credits: 3, grade: 'B' }
      ];
    }
    gpaRender();
    gpaRecalc();
  }

  function gpaRecalc() {
    if (!gpaValue) return;
    var totalCredits = 0;
    var totalPoints = 0;
    gpaCourses.forEach(function (c) {
      var credits = parseFloat(c.credits) || 0;
      var points = gradePoints[c.grade] != null ? gradePoints[c.grade] : 0;
      if (credits > 0) {
        totalCredits += credits;
        totalPoints += credits * points;
      }
    });
    var gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    gpaValue.textContent = gpa.toFixed(2);
    if (typeof Chart !== 'undefined') {
      var canvas = document.getElementById('gpaChart');
      if (canvas) {
        if (gpaChartInstance) gpaChartInstance.destroy();
        if (gpaCourses.length === 0) return;
        gpaChartInstance = new Chart(canvas, {
          type: 'bar',
          data: {
            labels: gpaCourses.map(function (c) { return (c.name || '').slice(0, 20); }),
            datasets: [{
              label: 'Grade points',
              data: gpaCourses.map(function (c) { return gradePoints[c.grade] != null ? gradePoints[c.grade] : 0; }),
              backgroundColor: 'rgba(37, 99, 235, 0.6)',
              borderColor: 'rgba(37, 99, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { min: 0, max: 4 }
            }
          }
        });
      }
    }
  }

  function gpaRender() {
    if (!gpaTbody) return;
    gpaTbody.innerHTML = '';
    gpaCourses.forEach(function (c, idx) {
      var tr = document.createElement('tr');

      var tdName = document.createElement('td');
      var nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.className = 'tool-input';
      nameInput.value = c.name || '';
      nameInput.addEventListener('input', function () {
        gpaCourses[idx].name = nameInput.value;
        gpaSave();
      });
      tdName.appendChild(nameInput);

      var tdCredits = document.createElement('td');
      var creditsInput = document.createElement('input');
      creditsInput.type = 'number';
      creditsInput.min = '0';
      creditsInput.step = '0.5';
      creditsInput.className = 'tool-input';
      creditsInput.value = c.credits != null ? c.credits : 0;
      creditsInput.addEventListener('input', function () {
        gpaCourses[idx].credits = creditsInput.value;
        gpaSave();
        gpaRecalc();
      });
      tdCredits.appendChild(creditsInput);

      var tdGrade = document.createElement('td');
      var gradeSelect = document.createElement('select');
      gradeSelect.className = 'converter-select';
      Object.keys(gradePoints).forEach(function (g) {
        var opt = document.createElement('option');
        opt.value = g;
        opt.textContent = g;
        gradeSelect.appendChild(opt);
      });
      gradeSelect.value = c.grade && gradePoints[c.grade] != null ? c.grade : 'A';
      gradeSelect.addEventListener('change', function () {
        gpaCourses[idx].grade = gradeSelect.value;
        gpaSave();
        gpaRecalc();
      });
      tdGrade.appendChild(gradeSelect);

      var tdRemove = document.createElement('td');
      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'gpa-remove';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', function () {
        gpaCourses.splice(idx, 1);
        gpaSave();
        gpaRender();
        gpaRecalc();
      });
      tdRemove.appendChild(removeBtn);

      tr.appendChild(tdName);
      tr.appendChild(tdCredits);
      tr.appendChild(tdGrade);
      tr.appendChild(tdRemove);
      gpaTbody.appendChild(tr);
    });
  }

  if (gpaAddRow) {
    gpaAddRow.addEventListener('click', function () {
      gpaCourses.push({ name: 'Course ' + (gpaCourses.length + 1), credits: 3, grade: 'A' });
      gpaSave();
      gpaRender();
      gpaRecalc();
    });
  }

  if (gpaClear) {
    gpaClear.addEventListener('click', function () {
      gpaCourses = [];
      try { localStorage.removeItem(GPA_KEY); } catch (e) {}
      gpaLoad();
    });
  }

  gpaLoad();

  // ----- Study checklist -----
  var checklistInput = document.getElementById('checklistInput');
  var checklistAddBtn = document.getElementById('checklistAddBtn');
  var checklistList = document.getElementById('checklistList');
  var checklistClearDone = document.getElementById('checklistClearDone');
  var checklistClearAll = document.getElementById('checklistClearAll');
  var CHECKLIST_KEY = 'school-tools-checklist';

  var checklistItems = [];

  function checklistSave() {
    try { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklistItems)); } catch (e) {}
  }

  function checklistLoad() {
    try {
      var raw = localStorage.getItem(CHECKLIST_KEY);
      if (raw) {
        var data = JSON.parse(raw);
        if (Array.isArray(data)) checklistItems = data;
      }
    } catch (e) {}
    checklistRender();
  }

  function checklistRender() {
    if (!checklistList) return;
    checklistList.innerHTML = '';
    checklistItems.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'checklist-item';

      var left = document.createElement('div');
      left.className = 'checklist-left';

      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = !!item.done;
      cb.addEventListener('change', function () {
        item.done = cb.checked;
        checklistSave();
        checklistRender();
      });

      var text = document.createElement('span');
      text.className = 'checklist-text' + (item.done ? ' done' : '');
      text.textContent = item.text || '';

      left.appendChild(cb);
      left.appendChild(text);

      var remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'checklist-remove';
      remove.textContent = 'Remove';
      remove.addEventListener('click', function () {
        checklistItems = checklistItems.filter(function (x) { return x.id !== item.id; });
        checklistSave();
        checklistRender();
      });

      li.appendChild(left);
      li.appendChild(remove);
      checklistList.appendChild(li);
    });
  }

  function checklistAdd() {
    if (!checklistInput) return;
    var text = (checklistInput.value || '').trim();
    if (!text) return;
    checklistItems.unshift({ id: String(Date.now()) + Math.random().toString(16).slice(2), text: text, done: false });
    checklistInput.value = '';
    checklistSave();
    checklistRender();
  }

  if (checklistAddBtn) checklistAddBtn.addEventListener('click', checklistAdd);
  if (checklistInput) {
    checklistInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') checklistAdd();
    });
  }

  if (checklistClearDone) {
    checklistClearDone.addEventListener('click', function () {
      checklistItems = checklistItems.filter(function (x) { return !x.done; });
      checklistSave();
      checklistRender();
    });
  }

  if (checklistClearAll) {
    checklistClearAll.addEventListener('click', function () {
      checklistItems = [];
      checklistSave();
      checklistRender();
    });
  }

  checklistLoad();

  // ----- Citation helper (basic) -----
  var citeStyle = document.getElementById('citeStyle');
  var citeType = document.getElementById('citeType');
  var citeWebsiteFields = document.getElementById('citeWebsiteFields');
  var citeBookFields = document.getElementById('citeBookFields');
  var citeOutput = document.getElementById('citeOutput');
  var citeCopy = document.getElementById('citeCopy');
  var citeClear = document.getElementById('citeClear');

  function v(id) {
    var el = document.getElementById(id);
    return (el && el.value ? String(el.value).trim() : '');
  }

  function citeFormat() {
    if (!citeOutput || !citeStyle || !citeType) return;
    var style = citeStyle.value;
    var type = citeType.value;

    var out = '';

    if (type === 'website') {
      var author = v('citeAuthor');
      var title = v('citeTitle');
      var site = v('citeSite');
      var url = v('citeUrl');
      var access = v('citeAccess');

      if (style === 'mla') {
        out = (author ? author + '. ' : '') +
          (title ? '\"' + title + '.\" ' : '') +
          (site ? site + ', ' : '') +
          (url ? url + '. ' : '') +
          (access ? 'Accessed ' + access + '.' : '');
      } else {
        out = (author ? author + '. ' : '') +
          '(n.d.). ' +
          (title ? title + '. ' : '') +
          (site ? site + '. ' : '') +
          (url ? url : '') +
          (access ? ' (Accessed ' + access + ').' : '');
      }
    } else {
      var bAuthor = v('bookAuthor');
      var bTitle = v('bookTitle');
      var bPublisher = v('bookPublisher');
      var bYear = v('bookYear');

      if (style === 'mla') {
        out = (bAuthor ? bAuthor + '. ' : '') +
          (bTitle ? bTitle + '. ' : '') +
          (bPublisher ? bPublisher + ', ' : '') +
          (bYear ? bYear + '.' : '');
      } else {
        out = (bAuthor ? bAuthor + '. ' : '') +
          '(' + (bYear || 'n.d.') + '). ' +
          (bTitle ? bTitle + '. ' : '') +
          (bPublisher ? bPublisher + '.' : '');
      }
    }

    citeOutput.value = out.trim();
  }

  function citeUpdateFields() {
    if (!citeType || !citeWebsiteFields || !citeBookFields) return;
    var isWebsite = citeType.value === 'website';
    citeWebsiteFields.style.display = isWebsite ? '' : 'none';
    citeBookFields.style.display = isWebsite ? 'none' : '';
    citeFormat();
  }

  if (citeStyle) citeStyle.addEventListener('change', citeFormat);
  if (citeType) citeType.addEventListener('change', citeUpdateFields);
  ['citeAuthor', 'citeTitle', 'citeSite', 'citeUrl', 'citeAccess', 'bookAuthor', 'bookTitle', 'bookPublisher', 'bookYear']
    .forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', citeFormat);
    });

  if (citeCopy) {
    citeCopy.addEventListener('click', function () {
      if (!citeOutput) return;
      var text = citeOutput.value || '';
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(function () {});
      } else {
        citeOutput.focus();
        citeOutput.select();
        try { document.execCommand('copy'); } catch (e) {}
      }
    });
  }

  if (citeClear) {
    citeClear.addEventListener('click', function () {
      ['citeAuthor', 'citeTitle', 'citeSite', 'citeUrl', 'citeAccess', 'bookAuthor', 'bookTitle', 'bookPublisher', 'bookYear']
        .forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.value = '';
        });
      if (citeOutput) citeOutput.value = '';
    });
  }

  citeUpdateFields();

  // ----- Math practice (arithmetic quiz) -----
  var practiceMode = document.getElementById('practiceMode');
  var practiceMax = document.getElementById('practiceMax');
  var practiceCount = document.getElementById('practiceCount');
  var practiceStart = document.getElementById('practiceStart');
  var practiceReset = document.getElementById('practiceReset');
  var practiceCard = document.getElementById('practiceCard');
  var practiceProgress = document.getElementById('practiceProgress');
  var practiceQuestion = document.getElementById('practiceQuestion');
  var practiceAnswer = document.getElementById('practiceAnswer');
  var practiceSubmit = document.getElementById('practiceSubmit');
  var practiceFeedback = document.getElementById('practiceFeedback');
  var practiceScore = document.getElementById('practiceScore');

  var pq = null;
  var pTotal = 10;
  var pIndex = 0;
  var pCorrect = 0;
  var pAnswered = 0;

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickOp(mode) {
    if (mode !== 'mixed') return mode;
    var ops = ['add', 'sub', 'mul', 'div'];
    return ops[randInt(0, ops.length - 1)];
  }

  function makeQuestion() {
    var mode = (practiceMode && practiceMode.value) || 'mixed';
    var max = Math.max(1, parseInt(practiceMax && practiceMax.value, 10) || 12);
    var op = pickOp(mode);
    var a, b, ans, sym;
    if (op === 'add') { a = randInt(0, max); b = randInt(0, max); ans = a + b; sym = '+'; }
    else if (op === 'sub') { a = randInt(0, max); b = randInt(0, max); if (b > a) { var t = a; a = b; b = t; } ans = a - b; sym = '−'; }
    else if (op === 'mul') { a = randInt(0, max); b = randInt(0, max); ans = a * b; sym = '×'; }
    else { // div - make integer answers
      b = randInt(1, max);
      ans = randInt(0, max);
      a = b * ans;
      sym = '÷';
    }
    return { a: a, b: b, ans: ans, sym: sym };
  }

  function practiceRender() {
    if (!practiceCard) return;
    if (!pq) return;
    practiceProgress.textContent = 'Question ' + (pIndex + 1) + ' of ' + pTotal;
    practiceQuestion.textContent = pq.a + ' ' + pq.sym + ' ' + pq.b + ' = ?';
    practiceScore.textContent = 'Score: ' + pCorrect + ' / ' + pAnswered;
    if (practiceFeedback) practiceFeedback.textContent = '';
    if (practiceAnswer) { practiceAnswer.value = ''; practiceAnswer.focus(); }
  }

  function practiceStartNew() {
    pTotal = Math.max(1, Math.min(100, parseInt(practiceCount && practiceCount.value, 10) || 10));
    pIndex = 0;
    pCorrect = 0;
    pAnswered = 0;
    pq = makeQuestion();
    practiceCard.style.display = '';
    practiceRender();
  }

  function practiceSubmitAnswer() {
    if (!pq) return;
    var raw = (practiceAnswer && practiceAnswer.value) || '';
    var val = parseFloat(raw);
    var ok = false;
    if (!isNaN(val) && val === pq.ans) {
      ok = true;
    } else if (typeof math !== 'undefined' && raw.trim()) {
      try {
        var evaluated = math.evaluate(raw.trim());
        var num = typeof evaluated === 'number' ? evaluated : parseFloat(evaluated);
        if (!isNaN(num) && Math.abs(num - pq.ans) < 1e-9) ok = true;
      } catch (e) {}
    }
    pAnswered += 1;
    if (ok) pCorrect += 1;
    if (practiceFeedback) practiceFeedback.textContent = ok ? 'Correct!' : ('Wrong — answer: ' + pq.ans);

    practiceScore.textContent = 'Score: ' + pCorrect + ' / ' + pAnswered;

    pIndex += 1;
    if (pIndex >= pTotal) {
      pq = null;
      practiceQuestion.textContent = 'Done!';
      if (practiceProgress) practiceProgress.textContent = 'Final score';
      if (practiceFeedback) practiceFeedback.textContent = 'You got ' + pCorrect + ' out of ' + pAnswered + '.';
      return;
    }

    setTimeout(function () {
      pq = makeQuestion();
      practiceRender();
    }, 700);
  }

  if (practiceStart) practiceStart.addEventListener('click', practiceStartNew);
  if (practiceReset) {
    practiceReset.addEventListener('click', function () {
      pq = null;
      pIndex = 0;
      pCorrect = 0;
      pAnswered = 0;
      if (practiceCard) practiceCard.style.display = 'none';
      if (practiceProgress) practiceProgress.textContent = '';
      if (practiceQuestion) practiceQuestion.textContent = '';
      if (practiceFeedback) practiceFeedback.textContent = '';
      if (practiceScore) practiceScore.textContent = 'Score: 0 / 0';
    });
  }
  if (practiceSubmit) practiceSubmit.addEventListener('click', practiceSubmitAnswer);
  if (practiceAnswer) {
    practiceAnswer.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') practiceSubmitAnswer();
    });
  }

  // ----- Final grade calculator -----
  var fgCurrent = document.getElementById('fgCurrent');
  var fgDesired = document.getElementById('fgDesired');
  var fgWeight = document.getElementById('fgWeight');
  var fgCalc = document.getElementById('fgCalc');
  var fgReset = document.getElementById('fgReset');
  var fgResult = document.getElementById('fgResult');

  function fgRender(msg) {
    if (fgResult) fgResult.textContent = msg || '';
  }

  function fgCompute() {
    var current = parseFloat(fgCurrent && fgCurrent.value);
    var desired = parseFloat(fgDesired && fgDesired.value);
    var weightPct = parseFloat(fgWeight && fgWeight.value);
    if (isNaN(current) || isNaN(desired) || isNaN(weightPct)) {
      fgRender('Enter current grade, desired grade, and final weight.');
      return;
    }
    var w = weightPct / 100;
    if (w <= 0) {
      fgRender('Final weight is 0%. Your final exam does not affect the grade.');
      return;
    }
    if (w >= 1) {
      fgRender('Final weight is 100%. You need ' + desired.toFixed(2) + '% on the final.');
      return;
    }
    var needed = (desired - current * (1 - w)) / w;
    var neededMsg = 'You need about ' + needed.toFixed(2) + '% on the final.';
    if (needed > 100) neededMsg += ' (That is above 100%.)';
    if (needed < 0) neededMsg += ' (You already have enough.)';
    fgRender(neededMsg);
  }

  if (fgCalc) fgCalc.addEventListener('click', fgCompute);
  if (fgReset) {
    fgReset.addEventListener('click', function () {
      if (fgCurrent) fgCurrent.value = '88';
      if (fgDesired) fgDesired.value = '90';
      if (fgWeight) fgWeight.value = '20';
      fgRender('');
    });
  }

  // ----- Typing test -----
  var typingDuration = document.getElementById('typingDuration');
  var typingStart = document.getElementById('typingStart');
  var typingRestart = document.getElementById('typingRestart');
  var typingText = document.getElementById('typingText');
  var typingInput = document.getElementById('typingInput');
  var typingTime = document.getElementById('typingTime');
  var typingWpm = document.getElementById('typingWpm');
  var typingAcc = document.getElementById('typingAcc');
  var typingResult = document.getElementById('typingResult');

  var typingShort = [
    'The quick brown fox jumps over the lazy dog.',
    'Practice typing with steady rhythm and accuracy.',
    'Focus on one task at a time when you study.',
    'Clear notes use headings and key definitions.',
    'Math improves when you check your work.',
    'Skim the chapter before class to follow the lecture.',
    'Take a short break after twenty-five minutes of work.',
    'Note the author and date when you take notes.',
    'Test yourself often with old and new flashcards.',
    'Break big projects into smaller deadlines.'
  ];
  var typingMedium = [
    'The quick brown fox jumps over the lazy dog. Practice steady rhythm and accuracy.',
    'Studying is easier when you break tasks into small steps. Focus on one thing at a time.',
    'Write clear notes: headings, short bullets, and key definitions. Review them the same day.',
    'Math improves with practice. Check your work, learn from mistakes, and try again.',
    'Reading before class helps you follow the lecture. Skim the chapter and note key terms.',
    'Use the Pomodoro technique: work for twenty-five minutes, then take a short break.',
    'Citations matter in research. Always note the author, title, and date when you take notes.',
    'Flashcards work best when you test yourself often. Mix old and new cards each session.',
    'Break big projects into smaller deadlines. Finish the first draft before you edit.',
    'Sleep helps memory. Review your notes once before bed to remember more in the morning.',
    'Summarize each paragraph in the margin as you read. It keeps you engaged and improves recall.',
    'When you get stuck, try explaining the idea out loud or to a friend. Teaching reinforces learning.'
  ];
  var typingLong = [
    'The quick brown fox jumps over the lazy dog. Studying is easier when you break tasks into small steps. Focus on one thing at a time. Write clear notes with headings, short bullets, and key definitions. Review them the same day so the material stays fresh.',
    'Math improves with practice. Check your work, learn from mistakes, and try again. Reading before class helps you follow the lecture. Skim the chapter and note key terms. Use the Pomodoro technique: work for twenty-five minutes, then take a short break.',
    'Citations matter in research. Always note the author, title, and date when you take notes. Flashcards work best when you test yourself often. Mix old and new cards each session. Break big projects into smaller deadlines. Finish the first draft before you edit.',
    'Sleep helps memory. Review your notes once before bed to remember more in the morning. Summarize each paragraph in the margin as you read. It keeps you engaged and improves recall. When you get stuck, try explaining the idea out loud or to a friend.',
    'Active reading means asking questions before, during, and after you read. Before class, list what you already know. During the lecture, fill in gaps. Afterward, write a short summary in your own words. This process strengthens understanding and retention.',
    'Time management in school is easier when you use a calendar. Block out study time, assignment due dates, and exams. Leave buffer time for longer projects. Review your plan each week and adjust as needed. Small, consistent effort beats last-minute cramming.'
  ];

  var typingTarget = '';
  var typingStartedAt = 0;
  var typingLeft = 60;
  var typingTick = null;

  function typingPickNewText() {
    var lengthSel = document.getElementById('typingLength');
    var length = (lengthSel && lengthSel.value) || 'medium';
    var arr = length === 'short' ? typingShort : length === 'long' ? typingLong : typingMedium;
    typingTarget = arr[Math.floor(Math.random() * arr.length)];
    if (typingText) typingText.textContent = typingTarget;
    if (typingInput) typingInput.value = '';
    if (typingResult) typingResult.textContent = '';
  }

  function typingResetStats() {
    var dur = parseInt(typingDuration && typingDuration.value, 10) || 60;
    typingLeft = dur;
    if (typingTime) typingTime.textContent = dur + 's';
    if (typingWpm) typingWpm.textContent = '0';
    if (typingAcc) typingAcc.textContent = '0%';
  }

  function typingStop() {
    if (typingTick) clearInterval(typingTick);
    typingTick = null;
    if (typingInput) typingInput.disabled = true;
    if (typingStart) typingStart.textContent = 'Start';
  }

  function typingCalcLive() {
    var typed = (typingInput && typingInput.value) || '';
    var correct = 0;
    for (var i = 0; i < typed.length; i++) {
      if (typed[i] === typingTarget[i]) correct++;
    }
    var elapsedSec = Math.max(1, Math.floor((Date.now() - typingStartedAt) / 1000));
    var minutes = elapsedSec / 60;
    var wpm = Math.round((correct / 5) / minutes);
    var acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 0;
    if (typingWpm) typingWpm.textContent = String(isFinite(wpm) ? wpm : 0);
    if (typingAcc) typingAcc.textContent = acc + '%';
  }

  function typingTickFn() {
    typingLeft -= 1;
    if (typingTime) typingTime.textContent = typingLeft + 's';
    typingCalcLive();
    if (typingLeft <= 0) {
      typingStop();
      playBeep();
      if (typingResult) typingResult.textContent = 'Time! Your results are shown above.';
    }
  }

  function typingBegin() {
    if (!typingInput) return;
    typingPickNewText();
    typingResetStats();
    typingStartedAt = Date.now();
    typingInput.disabled = false;
    typingInput.focus();
    if (typingStart) typingStart.textContent = 'Running…';
    if (typingTick) clearInterval(typingTick);
    typingTick = setInterval(typingTickFn, 1000);
  }

  if (typingStart) typingStart.addEventListener('click', function () {
    if (typingTick) {
      typingStop();
      if (typingResult) typingResult.textContent = 'Paused.';
      return;
    }
    typingBegin();
  });
  if (typingRestart) typingRestart.addEventListener('click', function () {
    typingStop();
    typingPickNewText();
    typingResetStats();
  });
  if (typingDuration) typingDuration.addEventListener('change', function () {
    if (!typingTick) typingResetStats();
  });
  if (typingInput) typingInput.addEventListener('input', function () {
    if (typingTick) typingCalcLive();
  });
  typingPickNewText();
  typingResetStats();

  // ----- Cornell notes (save + preview + print) -----
  var cnTopic = document.getElementById('cnTopic');
  var cnCues = document.getElementById('cnCues');
  var cnNotes = document.getElementById('cnNotes');
  var cnSummary = document.getElementById('cnSummary');
  var cnPrint = document.getElementById('cnPrint');
  var cnClear = document.getElementById('cnClear');
  var cnPreview = document.getElementById('cnPreview');
  var CN_KEY = 'school-tools-cornell';

  function cnState() {
    return {
      topic: (cnTopic && cnTopic.value) || '',
      cues: (cnCues && cnCues.value) || '',
      notes: (cnNotes && cnNotes.value) || '',
      summary: (cnSummary && cnSummary.value) || ''
    };
  }

  function cnSave() {
    try { localStorage.setItem(CN_KEY, JSON.stringify(cnState())); } catch (e) {}
  }

  function cnLoad() {
    try {
      var raw = localStorage.getItem(CN_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (cnTopic) cnTopic.value = data.topic || '';
      if (cnCues) cnCues.value = data.cues || '';
      if (cnNotes) cnNotes.value = data.notes || '';
      if (cnSummary) cnSummary.value = data.summary || '';
    } catch (e) {}
  }

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function cnRenderPreview() {
    if (!cnPreview) return;
    var st = cnState();
    cnPreview.innerHTML =
      '<div class=\"cn-title\">' + (st.topic ? esc(st.topic) : 'Cornell notes') + '</div>' +
      '<div class=\"cn-box\">' +
        '<div class=\"cn-col\"><strong>Cues</strong>\\n' + esc(st.cues) + '</div>' +
        '<div class=\"cn-col\"><strong>Notes</strong>\\n' + esc(st.notes) + '</div>' +
      '</div>' +
      '<div class=\"cn-summary\"><strong>Summary</strong>\\n' + esc(st.summary) + '</div>';
  }

  var cnEditTab = document.getElementById('cnEditTab');
  var cnPreviewTab = document.getElementById('cnPreviewTab');
  var cnEditPane = document.getElementById('cnEditPane');
  var cnPreviewPane = document.getElementById('cnPreviewPane');
  var cnPreviewContent = document.getElementById('cnPreviewContent');
  function cnRenderMarkdownPreview() {
    if (!cnPreviewContent) return;
    var st = cnState();
    var md = function (s) {
      if (typeof marked !== 'undefined' && marked.parse) return marked.parse(s || '');
      if (typeof marked !== 'undefined') return marked(s || '');
      return esc(s || '');
    };
    cnPreviewContent.innerHTML =
      '<h3 style="margin-top:0">' + esc(st.topic || 'Cornell notes') + '</h3>' +
      '<p><strong>Cues</strong></p>' + (st.cues ? md(st.cues) : '<p class="text-muted">(none)</p>') +
      '<p><strong>Notes</strong></p>' + (st.notes ? md(st.notes) : '<p class="text-muted">(none)</p>') +
      '<p><strong>Summary</strong></p>' + (st.summary ? md(st.summary) : '<p class="text-muted">(none)</p>');
  }
  function cnShowEdit() {
    if (cnEditPane) cnEditPane.style.display = '';
    if (cnPreviewPane) { cnPreviewPane.style.display = 'none'; cnPreviewPane.setAttribute('aria-hidden', 'true'); }
    if (cnEditTab) { cnEditTab.classList.add('active'); cnEditTab.setAttribute('aria-pressed', 'true'); }
    if (cnPreviewTab) { cnPreviewTab.classList.remove('active'); cnPreviewTab.setAttribute('aria-pressed', 'false'); }
  }
  function cnShowPreview() {
    cnRenderMarkdownPreview();
    if (cnEditPane) cnEditPane.style.display = 'none';
    if (cnPreviewPane) { cnPreviewPane.style.display = 'block'; cnPreviewPane.setAttribute('aria-hidden', 'false'); }
    if (cnEditTab) { cnEditTab.classList.remove('active'); cnEditTab.setAttribute('aria-pressed', 'false'); }
    if (cnPreviewTab) { cnPreviewTab.classList.add('active'); cnPreviewTab.setAttribute('aria-pressed', 'true'); }
  }
  if (cnEditTab) cnEditTab.addEventListener('click', cnShowEdit);
  if (cnPreviewTab) cnPreviewTab.addEventListener('click', cnShowPreview);

  function cnPrintNow() {
    var st = cnState();
    var w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) return;
    w.document.open();
    w.document.write('<!doctype html><html><head><meta charset=\"utf-8\"><title>Cornell Notes</title>' +
      '<style>body{font-family:Arial,sans-serif;padding:24px}h1{font-size:18px;margin:0 0 12px}' +
      '.grid{display:grid;grid-template-columns:1fr 2fr;gap:12px}.box{border:1px solid #ddd;border-radius:8px;padding:12px;white-space:pre-wrap;min-height:200px}' +
      '.sum{margin-top:12px}</style></head><body>' +
      '<h1>' + esc(st.topic || 'Cornell notes') + '</h1>' +
      '<div class=\"grid\"><div class=\"box\"><strong>Cues</strong>\\n' + esc(st.cues) + '</div>' +
      '<div class=\"box\"><strong>Notes</strong>\\n' + esc(st.notes) + '</div></div>' +
      '<div class=\"box sum\"><strong>Summary</strong>\\n' + esc(st.summary) + '</div>' +
      '</body></html>');
    w.document.close();
    w.focus();
    w.print();
  }

  if (cnTopic) cnTopic.addEventListener('input', function () { cnSave(); cnRenderPreview(); });
  if (cnCues) cnCues.addEventListener('input', function () { cnSave(); cnRenderPreview(); });
  if (cnNotes) cnNotes.addEventListener('input', function () { cnSave(); cnRenderPreview(); });
  if (cnSummary) cnSummary.addEventListener('input', function () { cnSave(); cnRenderPreview(); });
  if (cnClear) cnClear.addEventListener('click', function () {
    if (cnTopic) cnTopic.value = '';
    if (cnCues) cnCues.value = '';
    if (cnNotes) cnNotes.value = '';
    if (cnSummary) cnSummary.value = '';
    try { localStorage.removeItem(CN_KEY); } catch (e) {}
    cnRenderPreview();
  });
  if (cnPrint) cnPrint.addEventListener('click', cnPrintNow);
  cnLoad();
  cnRenderPreview();

  // ----- Quadratic solver -----
  var qa = document.getElementById('qa');
  var qb = document.getElementById('qb');
  var qc = document.getElementById('qc');
  var qSolve = document.getElementById('qSolve');
  var qReset = document.getElementById('qReset');
  var qResult = document.getElementById('qResult');

  function qSet(msg) {
    if (qResult) qResult.textContent = msg || '';
  }
  function qSetHtml(html) {
    if (qResult) qResult.innerHTML = html || '';
  }

  function qSolveNow() {
    var a = parseFloat(qa && qa.value);
    var b = parseFloat(qb && qb.value);
    var c = parseFloat(qc && qc.value);
    if ([a, b, c].some(function (x) { return isNaN(x); })) {
      qSet('Enter numeric values for a, b, and c.');
      return;
    }
    if (typeof katex !== 'undefined') {
      try {
        if (a === 0) {
          if (b === 0) {
            qSet(c === 0 ? 'Infinite solutions (0 = 0).' : 'No solution (constant ≠ 0).');
            return;
          }
          var x = -c / b;
          qSetHtml(katex.renderToString('x = ' + x, { throwOnError: false }));
          return;
        }
        var d = b * b - 4 * a * c;
        if (d >= 0) {
          var sqrt = Math.sqrt(d);
          var x1 = (-b + sqrt) / (2 * a);
          var x2 = (-b - sqrt) / (2 * a);
          var s1 = katex.renderToString('x_1 = ' + x1, { throwOnError: false });
          var s2 = katex.renderToString('x_2 = ' + x2, { throwOnError: false });
          qSetHtml('<p class="q-result-text">Discriminant &Delta; = ' + d + '</p><p>' + s1 + ' &nbsp; ' + s2 + '</p>');
        } else {
          var re = (-b) / (2 * a);
          var im = Math.sqrt(-d) / (2 * a);
          var sc = katex.renderToString('x = ' + re + ' \\pm ' + im + 'i', { throwOnError: false });
          qSetHtml('<p class="q-result-text">Discriminant &Delta; = ' + d + ' (complex)</p><p>' + sc + '</p>');
        }
        return;
      } catch (e) {}
    }
    if (a === 0) {
      if (b === 0) {
        qSet(c === 0 ? 'Infinite solutions (0 = 0).' : 'No solution (constant ≠ 0).');
        return;
      }
      var x = -c / b;
      qSet('Linear solution: x = ' + x);
      return;
    }
    var d = b * b - 4 * a * c;
    if (d >= 0) {
      var sqrt = Math.sqrt(d);
      var x1 = (-b + sqrt) / (2 * a);
      var x2 = (-b - sqrt) / (2 * a);
      qSet('Discriminant: ' + d.toFixed(6) + '. Roots: x₁ = ' + x1 + ', x₂ = ' + x2);
    } else {
      var re = (-b) / (2 * a);
      var im = Math.sqrt(-d) / (2 * a);
      qSet('Discriminant: ' + d.toFixed(6) + '. Complex roots: x = ' + re + ' ± ' + im + 'i');
    }
  }

  if (qSolve) qSolve.addEventListener('click', qSolveNow);
  if (qReset) qReset.addEventListener('click', function () {
    if (qa) qa.value = '1';
    if (qb) qb.value = '0';
    if (qc) qc.value = '-1';
    qSet('');
  });

  // ----- Roman numerals -----
  var romanInput = document.getElementById('romanInput');
  var romanConvert = document.getElementById('romanConvert');
  var romanClear = document.getElementById('romanClear');
  var romanResult = document.getElementById('romanResult');

  function toRoman(n) {
    var num = Math.floor(Number(n));
    if (num < 1 || num > 3999) return null;
    var map = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    var out = '';
    for (var i = 0; i < map.length; i++) {
      while (num >= map[i][0]) {
        out += map[i][1];
        num -= map[i][0];
      }
    }
    return out;
  }

  function fromRoman(s) {
    var str = String(s || '').trim().toUpperCase().replace(/\s/g, '');
    var map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    var val = 0;
    for (var i = 0; i < str.length; i++) {
      var curr = map[str[i]];
      if (curr === undefined) return null;
      var next = map[str[i + 1]];
      if (next !== undefined && next > curr) {
        val -= curr;
      } else {
        val += curr;
      }
    }
    return val >= 1 && val <= 3999 ? val : null;
  }

  function romanConvertNow() {
    if (!romanResult || !romanInput) return;
    var raw = (romanInput.value || '').trim();
    if (!raw) {
      romanResult.textContent = 'Enter a number (1–3999) or a Roman numeral.';
      return;
    }
    var num = parseInt(raw, 10);
    if (!isNaN(num)) {
      var r = toRoman(num);
      romanResult.textContent = r ? num + ' = ' + r : 'Number must be between 1 and 3999.';
      return;
    }
    var v = fromRoman(raw);
    romanResult.textContent = v !== null ? raw + ' = ' + v : 'Invalid Roman numeral. Use I, V, X, L, C, D, M (1–3999).';
  }

  if (romanConvert) romanConvert.addEventListener('click', romanConvertNow);
  if (romanClear) romanClear.addEventListener('click', function () {
    if (romanInput) romanInput.value = '';
    if (romanResult) romanResult.textContent = '';
  });
  if (romanInput) romanInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') romanConvertNow();
  });

  // ----- Percentage calculator -----
  var pctTabs = document.querySelectorAll('.percentage-tab');
  var pctPanels = document.querySelectorAll('.percentage-panel');
  var pctCalc = document.getElementById('pctCalc');
  var pctResult = document.getElementById('pctResult');
  var pctXOf = document.getElementById('pctXOf');
  var pctYOf = document.getElementById('pctYOf');
  var pctXWhat = document.getElementById('pctXWhat');
  var pctYWhat = document.getElementById('pctYWhat');
  var pctFrom = document.getElementById('pctFrom');
  var pctTo = document.getElementById('pctTo');

  function pctShowPanel(name) {
    pctTabs.forEach(function (tab) {
      var on = tab.getAttribute('data-pct') === name;
      tab.classList.toggle('active', on);
    });
    pctPanels.forEach(function (panel) {
      var on = (panel.classList.contains('pct-of-panel') && name === 'of') ||
        (panel.classList.contains('pct-what-panel') && name === 'what') ||
        (panel.classList.contains('pct-change-panel') && name === 'change');
      panel.classList.toggle('active', !!on);
    });
  }

  pctTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      pctShowPanel(this.getAttribute('data-pct'));
    });
  });

  function pctCalcNow() {
    if (!pctResult) return;
    var active = document.querySelector('.percentage-tab.active');
    var mode = active ? active.getAttribute('data-pct') : 'of';
    var msg = '';
    if (mode === 'of') {
      var x = parseFloat(pctXOf && pctXOf.value);
      var y = parseFloat(pctYOf && pctYOf.value);
      if (isNaN(x) || isNaN(y)) {
        msg = 'Enter numbers for X and Y.';
      } else {
        var res = (x / 100) * y;
        msg = x + '% of ' + y + ' = ' + res;
      }
    } else if (mode === 'what') {
      var xw = parseFloat(pctXWhat && pctXWhat.value);
      var yw = parseFloat(pctYWhat && pctYWhat.value);
      if (isNaN(xw) || isNaN(yw) || yw === 0) {
        msg = 'Enter numbers; Y cannot be 0.';
      } else {
        var p = ((xw / yw) * 100).toFixed(2);
        msg = xw + ' is ' + p + '% of ' + yw;
      }
    } else {
      var from = parseFloat(pctFrom && pctFrom.value);
      var to = parseFloat(pctTo && pctTo.value);
      if (isNaN(from) || isNaN(to)) {
        msg = 'Enter numbers for From and To.';
      } else if (from === 0) {
        msg = 'From cannot be 0.';
      } else {
        var ch = ((to - from) / from * 100).toFixed(1);
        var sign = ch >= 0 ? '+' : '';
        msg = 'From ' + from + ' to ' + to + ': ' + sign + ch + '% change';
      }
    }
    pctResult.textContent = msg;
  }

  if (pctCalc) pctCalc.addEventListener('click', pctCalcNow);

  // ----- Fraction helper -----
  var fracNum = document.getElementById('fracNum');
  var fracDen = document.getElementById('fracDen');
  var fracCalc = document.getElementById('fracCalc');
  var fracReset = document.getElementById('fracReset');
  var fracResult = document.getElementById('fracResult');

  function gcd(a, b) {
    a = Math.abs(Math.floor(a));
    b = Math.abs(Math.floor(b));
    while (b) {
      var t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  function fracCalcNow() {
    if (!fracResult || !fracNum || !fracDen) return;
    var num = parseInt(fracNum.value, 10);
    var den = parseInt(fracDen.value, 10);
    if (isNaN(num) || isNaN(den) || den === 0) {
      fracResult.textContent = 'Enter valid numerator and denominator (denominator ≠ 0).';
      return;
    }
    var g = gcd(num, den);
    var sign = (num < 0) !== (den < 0) ? -1 : 1;
    num = Math.abs(num);
    den = Math.abs(den);
    var sn = Math.floor(num / g);
    var sd = Math.floor(den / g);
    sn *= sign;
    var decimal = sign * num / den;
    var whole = Math.trunc(decimal);
    var rem = Math.round(Math.abs(decimal - whole) * sd);
    if (rem === sd) {
      whole += 1;
      rem = 0;
    }
    var mixed = '';
    if (whole !== 0 && rem !== 0) {
      mixed = whole + ' ' + rem + '/' + sd;
    } else if (whole !== 0) {
      mixed = String(whole);
    } else {
      mixed = (sn < 0 ? '−' : '') + (rem ? rem + '/' + sd : '0');
    }
    var simple = (sn < 0 ? '−' : '') + Math.abs(sn) + '/' + sd;
    var html = 'Simplified: <strong>' + simple + '</strong>';
    if (typeof katex !== 'undefined') {
      try {
        var fracLatex = (sn < 0 ? '-' : '') + '\\frac{' + Math.abs(sn) + '}{' + sd + '}';
        html += ' &nbsp; ' + katex.renderToString(fracLatex, { throwOnError: false }) + '<br>';
      } catch (e) {}
    }
    html += 'Decimal: <strong>' + (sign * num / den) + '</strong><br>Mixed: <strong>' + mixed + '</strong>';
    fracResult.innerHTML = html;
  }

  if (fracCalc) fracCalc.addEventListener('click', fracCalcNow);
  if (fracReset) fracReset.addEventListener('click', function () {
    if (fracNum) fracNum.value = '8';
    if (fracDen) fracDen.value = '12';
    if (fracResult) fracResult.textContent = '';
  });

  // ----- Flashcards -----
  var fcFront = document.getElementById('fcFront');
  var fcBack = document.getElementById('fcBack');
  var fcAdd = document.getElementById('fcAdd');
  var flashcardText = document.getElementById('flashcardText');
  var fcPrev = document.getElementById('fcPrev');
  var fcFlip = document.getElementById('fcFlip');
  var fcNext = document.getElementById('fcNext');
  var fcShuffle = document.getElementById('fcShuffle');
  var fcRemove = document.getElementById('fcRemove');
  var flashcardCount = document.getElementById('flashcardCount');
  var FC_KEY = 'school-tools-flashcards';

  var flashcards = [];
  var fcIndex = 0;
  var fcShowingFront = true;

  function fcSave() {
    try { localStorage.setItem(FC_KEY, JSON.stringify(flashcards)); } catch (e) {}
  }

  function fcLoad() {
    try {
      var raw = localStorage.getItem(FC_KEY);
      if (raw) {
        var data = JSON.parse(raw);
        if (Array.isArray(data)) flashcards = data;
      }
    } catch (e) {}
    fcIndex = 0;
    fcShowingFront = true;
    fcUpdateDisplay();
  }

  function fcUpdateDisplay() {
    if (!flashcardText) return;
    if (flashcards.length === 0) {
      flashcardText.textContent = 'Add cards to start';
      if (flashcardCount) flashcardCount.textContent = '0 cards';
      return;
    }
    if (fcIndex >= flashcards.length) fcIndex = flashcards.length - 1;
    if (fcIndex < 0) fcIndex = 0;
    var card = flashcards[fcIndex];
    flashcardText.textContent = fcShowingFront ? card.front : card.back;
    if (flashcardCount) flashcardCount.textContent = (fcIndex + 1) + ' / ' + flashcards.length;
  }

  if (fcAdd && fcFront && fcBack) {
    fcAdd.addEventListener('click', function () {
      var front = (fcFront.value || '').trim();
      var back = (fcBack.value || '').trim();
      if (!front && !back) return;
      flashcards.push({ front: front || '(blank)', back: back || '(blank)' });
      fcFront.value = '';
      fcBack.value = '';
      fcIndex = flashcards.length - 1;
      fcShowingFront = true;
      fcSave();
      fcUpdateDisplay();
    });
  }

  if (fcFlip && flashcardText) {
    fcFlip.addEventListener('click', function () {
      if (flashcards.length === 0) return;
      fcShowingFront = !fcShowingFront;
      fcUpdateDisplay();
    });
  }

  if (fcPrev) {
    fcPrev.addEventListener('click', function () {
      if (flashcards.length === 0) return;
      fcIndex = (fcIndex - 1 + flashcards.length) % flashcards.length;
      fcShowingFront = true;
      fcUpdateDisplay();
    });
  }

  if (fcNext) {
    fcNext.addEventListener('click', function () {
      if (flashcards.length === 0) return;
      fcIndex = (fcIndex + 1) % flashcards.length;
      fcShowingFront = true;
      fcUpdateDisplay();
    });
  }

  if (fcShuffle) {
    fcShuffle.addEventListener('click', function () {
      if (flashcards.length < 2) return;
      for (var i = flashcards.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = flashcards[i];
        flashcards[i] = flashcards[j];
        flashcards[j] = t;
      }
      fcIndex = 0;
      fcShowingFront = true;
      fcSave();
      fcUpdateDisplay();
    });
  }

  if (fcRemove) {
    fcRemove.addEventListener('click', function () {
      if (flashcards.length === 0) return;
      flashcards.splice(fcIndex, 1);
      if (fcIndex >= flashcards.length) fcIndex = Math.max(0, flashcards.length - 1);
      fcShowingFront = true;
      fcSave();
      fcUpdateDisplay();
    });
  }

  var flashcardsModal = document.getElementById('modal-flashcards');
  if (flashcardsModal) {
    flashcardsModal.addEventListener('keydown', function (e) {
      if (!flashcardsModal.classList.contains('open') || flashcards.length === 0) return;
      var tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (fcPrev) fcPrev.click();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (fcNext) fcNext.click();
      } else if (e.key === ' ') {
        e.preventDefault();
        if (fcFlip) fcFlip.click();
      }
    });
  }

  fcLoad();

  // ----- Pomodoro -----
  var pomodoroDisplay = document.getElementById('pomodoroDisplay');
  var pomodoroPhase = document.getElementById('pomodoroPhase');
  var pomodoroStart = document.getElementById('pomodoroStart');
  var pomodoroReset = document.getElementById('pomodoroReset');
  var pomodoroWorkMinEl = document.getElementById('pomodoroWorkMin');
  var pomodoroBreakMinEl = document.getElementById('pomodoroBreakMin');

  var pomodoroWorkSec = 25 * 60;
  var pomodoroBreakSec = 5 * 60;
  var pomodoroRemaining = pomodoroWorkSec;
  var pomodoroIsWork = true;
  var pomodoroTick = null;

  function pomodoroReadSettings() {
    var w = parseInt(pomodoroWorkMinEl && pomodoroWorkMinEl.value, 10);
    var b = parseInt(pomodoroBreakMinEl && pomodoroBreakMinEl.value, 10);
    if (!isNaN(w) && w >= 1 && w <= 60) pomodoroWorkSec = w * 60;
    if (!isNaN(b) && b >= 1 && b <= 30) pomodoroBreakSec = b * 60;
  }

  function pomodoroRender() {
    if (!pomodoroDisplay) return;
    var m = Math.floor(pomodoroRemaining / 60);
    var s = pomodoroRemaining % 60;
    pomodoroDisplay.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    if (pomodoroPhase) pomodoroPhase.textContent = pomodoroIsWork ? 'Focus' : 'Break';
  }

  function pomodoroTickFn() {
    pomodoroRemaining -= 1;
    pomodoroRender();
    if (pomodoroRemaining <= 0) {
      clearInterval(pomodoroTick);
      pomodoroTick = null;
      playBeep();
      if (pomodoroStart) { pomodoroStart.textContent = 'Start'; pomodoroStart.disabled = false; }
      pomodoroIsWork = !pomodoroIsWork;
      pomodoroRemaining = pomodoroIsWork ? pomodoroWorkSec : pomodoroBreakSec;
      pomodoroRender();
    }
  }

  if (pomodoroStart) {
    pomodoroStart.addEventListener('click', function () {
      if (pomodoroTick) {
        clearInterval(pomodoroTick);
        pomodoroTick = null;
        pomodoroStart.textContent = 'Start';
        pomodoroStart.disabled = false;
        return;
      }
      pomodoroReadSettings();
      pomodoroRemaining = pomodoroIsWork ? pomodoroWorkSec : pomodoroBreakSec;
      pomodoroStart.textContent = 'Pause';
      pomodoroStart.disabled = false;
      pomodoroTick = setInterval(pomodoroTickFn, 1000);
    });
  }

  if (pomodoroReset) {
    pomodoroReset.addEventListener('click', function () {
      if (pomodoroTick) {
        clearInterval(pomodoroTick);
        pomodoroTick = null;
      }
      if (pomodoroStart) { pomodoroStart.textContent = 'Start'; pomodoroStart.disabled = false; }
      pomodoroReadSettings();
      pomodoroIsWork = true;
      pomodoroRemaining = pomodoroWorkSec;
      pomodoroRender();
    });
  }

  function pomodoroSettingsChange() {
    if (pomodoroTick) return;
    pomodoroReadSettings();
    pomodoroRemaining = pomodoroIsWork ? pomodoroWorkSec : pomodoroBreakSec;
    pomodoroRender();
  }
  if (pomodoroWorkMinEl) pomodoroWorkMinEl.addEventListener('input', pomodoroSettingsChange);
  if (pomodoroBreakMinEl) pomodoroBreakMinEl.addEventListener('input', pomodoroSettingsChange);

  pomodoroRender();
})();

  // ----- Periodic table -----
(function () {
  var ptGrid = document.getElementById('ptGrid');
  var ptWrap = document.getElementById('ptWrap');
  var ptLoading = document.getElementById('ptLoading');
  var ptDetail = document.getElementById('ptDetail');
  var ptDetailPlaceholder = ptDetail && ptDetail.querySelector('.pt-detail-placeholder');
  var elementsByNum = {};
  var elementsLoaded = false;

  function parseCSVLine(line) {
    var out = [];
    var cur = '';
    var inQuotes = false;
    for (var i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQuotes = !inQuotes; }
      else if (line[i] === ',' && !inQuotes) { out.push(cur.trim()); cur = ''; }
      else { cur += line[i]; }
    }
    out.push(cur.trim());
    return out;
  }

  function parseCSV(text) {
    var lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    var headers = parseCSVLine(lines[0]);
    var rows = [];
    for (var i = 1; i < lines.length; i++) {
      var cells = parseCSVLine(lines[i]);
      var row = {};
      for (var j = 0; j < headers.length; j++) row[headers[j]] = cells[j] || '';
      rows.push(row);
    }
    return rows;
  }

  function getTypeClass(type) {
    if (!type) return '';
    var s = (type + '').toLowerCase().replace(/\s+/g, '-');
    if (s.indexOf('alkali') !== -1) return 'pt-type-alkali';
    if (s.indexOf('alkaline') !== -1) return 'pt-type-alkaline';
    if (s.indexOf('transition') !== -1) return 'pt-type-transition';
    if (s.indexOf('noble') !== -1) return 'pt-type-noble';
    if (s.indexOf('nonmetal') !== -1) return 'pt-type-nonmetal';
    if (s.indexOf('metalloid') !== -1) return 'pt-type-metalloid';
    return 'pt-type-other';
  }

  function renderDetail(el) {
    if (!ptDetail) return;
    if (!el) {
      if (ptDetailPlaceholder) ptDetailPlaceholder.style.display = '';
      ptDetail.querySelectorAll('.pt-detail-content').forEach(function (n) { n.remove(); });
      return;
    }
    if (ptDetailPlaceholder) ptDetailPlaceholder.style.display = 'none';
    ptDetail.querySelectorAll('.pt-detail-content').forEach(function (n) { n.remove(); });
    var div = document.createElement('div');
    div.className = 'pt-detail-content';
    var num = el.AtomicNumber || '';
    var sym = el.Symbol || '';
    var name = el.Element || '';
    var mass = el.AtomicMass || '';
    var type = el.Type || '';
    var phase = el.Phase || '';
    var discoverer = el.Discoverer || '';
    var year = el.Year || '';
    var melt = el.MeltingPoint ? Number(el.MeltingPoint) : null;
    var boil = el.BoilingPoint ? Number(el.BoilingPoint) : null;
    var en = el.Electronegativity || '';
    var ion = el.FirstIonization || '';
    var density = el.Density || '';
    div.innerHTML =
      '<p class="pt-detail-title"><strong>' + escapeHtml(num) + ' ' + escapeHtml(sym) + '</strong> ' + escapeHtml(name) + '</p>' +
      '<p>Type: ' + escapeHtml(type) + (phase ? ' · Phase: ' + escapeHtml(phase) : '') + '</p>' +
      '<p>Atomic mass: ' + escapeHtml(mass) + '</p>' +
      (discoverer || year ? '<p>Discoverer: ' + escapeHtml(discoverer) + (year ? ' (' + escapeHtml(year) + ')' : '') + '</p>' : '') +
      (melt != null && !isNaN(melt) ? '<p>Melting point: ' + melt + ' K</p>' : '') +
      (boil != null && !isNaN(boil) ? '<p>Boiling point: ' + boil + ' K</p>' : '') +
      (en ? '<p>Electronegativity: ' + escapeHtml(en) + '</p>' : '') +
      (ion ? '<p>First ionization: ' + escapeHtml(ion) + ' eV</p>' : '') +
      (density ? '<p>Density: ' + escapeHtml(density) + '</p>' : '');
    ptDetail.appendChild(div);
  }

  function escapeHtml(s) {
    if (s == null) return '';
    var t = document.createElement('span');
    t.textContent = s;
    return t.innerHTML;
  }

  function buildGrid(rows) {
    if (!ptGrid) return;
    var byKey = {};
    var lanthanides = [];
    var actinides = [];
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var num = parseInt(r.AtomicNumber, 10);
      if (isNaN(num)) continue;
      elementsByNum[num] = r;
      var grp = r.Group ? parseInt(r.Group, 10) : NaN;
      if (grp >= 1 && grp <= 18) byKey[r.Period + '-' + grp] = r;
      if (num >= 58 && num <= 71) lanthanides.push(r);
      if (num >= 90 && num <= 103) actinides.push(r);
    }
    lanthanides.sort(function (a, b) { return parseInt(a.AtomicNumber, 10) - parseInt(b.AtomicNumber, 10); });
    actinides.sort(function (a, b) { return parseInt(a.AtomicNumber, 10) - parseInt(b.AtomicNumber, 10); });

    function rowForPeriod(period) {
      var arr = [];
      for (var g = 1; g <= 18; g++) arr.push(byKey[period + '-' + g] || null);
      return arr;
    }
    function rowPeriod6Correct() {
      var arr = [];
      arr.push(byKey['6-1'] || null);
      arr.push(byKey['6-2'] || null);
      arr.push(byKey['6-3'] || null);
      arr.push(null);
      for (var g = 4; g <= 18; g++) arr.push(byKey['6-' + g] || null);
      return arr;
    }
    function rowPeriod7Correct() {
      var arr = [];
      arr.push(byKey['7-1'] || null);
      arr.push(byKey['7-2'] || null);
      arr.push(byKey['7-3'] || null);
      arr.push(null);
      for (var g = 4; g <= 18; g++) arr.push(byKey['7-' + g] || null);
      return arr;
    }
    function rowLanthanide() {
      var arr = [];
      for (var c = 0; c < 3; c++) arr.push(null);
      for (var i = 0; i < lanthanides.length; i++) arr.push(lanthanides[i]);
      while (arr.length < 18) arr.push(null);
      return arr;
    }
    function rowActinide() {
      var arr = [];
      for (var c = 0; c < 3; c++) arr.push(null);
      for (var i = 0; i < actinides.length; i++) arr.push(actinides[i]);
      while (arr.length < 18) arr.push(null);
      return arr;
    }

    var gridRows = [
      rowForPeriod(1),
      rowForPeriod(2),
      rowForPeriod(3),
      rowForPeriod(4),
      rowForPeriod(5),
      rowPeriod6Correct(),
      rowLanthanide(),
      rowPeriod7Correct(),
      rowActinide()
    ];
    var periodLabels = ['1', '2', '3', '4', '5', '6', 'Ln', '7', 'An'];

    ptGrid.innerHTML = '';
    ptGrid.style.gridTemplateColumns = 'minmax(1.5em, 2em) repeat(18, 1fr)';

    var corner = document.createElement('div');
    corner.className = 'pt-corner';
    corner.setAttribute('aria-hidden', 'true');
    ptGrid.appendChild(corner);
    for (var g = 0; g < 18; g++) {
      var groupLabel = document.createElement('div');
      groupLabel.className = 'pt-group-label';
      groupLabel.setAttribute('aria-hidden', 'true');
      groupLabel.textContent = g + 1;
      ptGrid.appendChild(groupLabel);
    }
    for (var ri = 0; ri < gridRows.length; ri++) {
      var periodLabel = document.createElement('div');
      periodLabel.className = 'pt-period-label';
      periodLabel.setAttribute('aria-hidden', 'true');
      periodLabel.textContent = periodLabels[ri];
      ptGrid.appendChild(periodLabel);

      var row = gridRows[ri];
      for (var c = 0; c < 18; c++) {
        var el = row[c];
        var isGap = (ri === 5 || ri === 7) && c === 3;
        if (el) {
          var cell = document.createElement('button');
          cell.type = 'button';
          cell.className = 'pt-cell ' + getTypeClass(el.Type);
          if (ri === 6) cell.classList.add('pt-cell-lanthanide');
          if (ri === 8) cell.classList.add('pt-cell-actinide');
          cell.innerHTML = '<span class="pt-num">' + escapeHtml(el.AtomicNumber) + '</span><span class="pt-sym">' + escapeHtml(el.Symbol) + '</span>';
          cell.dataset.atomicNumber = el.AtomicNumber;
          cell.addEventListener('click', function (ev) {
            var n = parseInt(ev.currentTarget.dataset.atomicNumber, 10);
            renderDetail(elementsByNum[n]);
          });
          ptGrid.appendChild(cell);
        } else {
          var empty = document.createElement('div');
          empty.className = 'pt-cell pt-cell-empty' + (isGap ? ' pt-cell-gap' : '');
          empty.setAttribute('aria-hidden', 'true');
          ptGrid.appendChild(empty);
        }
      }
    }
    elementsLoaded = true;
  }

  function loadPeriodicTable() {
    if (elementsLoaded) return;
    if (!ptGrid || !ptWrap || !ptLoading) return;
    ptLoading.style.display = '';
    ptWrap.style.display = 'none';
    fetch('periodictable.csv')
      .then(function (r) { return r.text(); })
      .then(function (text) {
        var rows = parseCSV(text);
        buildGrid(rows);
        ptLoading.style.display = 'none';
        ptWrap.style.display = 'block';
      })
      .catch(function () {
        ptLoading.textContent = 'Could not load periodic table data.';
      });
  }

  var modalPt = document.getElementById('modal-periodictable');
  if (modalPt) {
    modalPt.addEventListener('transitionend', function (e) {
      if (e.target !== modalPt || !modalPt.classList.contains('open')) return;
      loadPeriodicTable();
    });
    var openObserver = setInterval(function () {
      if (modalPt.classList.contains('open')) {
        loadPeriodicTable();
        clearInterval(openObserver);
      }
    }, 300);
    setTimeout(function () { clearInterval(openObserver); }, 5000);
  }
})();
