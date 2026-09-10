(() => {
  'use strict';

  const body = document.body;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = () => matchMedia('(pointer: coarse)').matches || Number(navigator.maxTouchPoints || 0) > 0;
  const isPhoneLandscape = () => isCoarse() && innerWidth > innerHeight && innerWidth <= 960 && innerHeight <= 560;
  const isSequentialContext = () => {
    const coarse = isCoarse();
    return (innerWidth <= 820 && (coarse || innerWidth <= 560)) || isPhoneLandscape();
  };
  const isCompactMediaContext = () => innerWidth <= 820 || isPhoneLandscape();

  function closeMobileNav() {
    body.classList.remove('nav-open');
    $('#menuToggle')?.setAttribute('aria-expanded', 'false');
  }

  // R7 navigation additions --------------------------------------------------
  // The compact menu now repeats the brand/home destination so the clickable
  // top-left wordmark is not the only way back to ENTRY. REPORT is moved from
  // the footer to the navigation and stays after FAQ on both PC and mobile.
  function installNavigationAdditions() {
    const nav = $('#primaryNav');
    if (!nav) return;

    if (!$('.r7-nav-home', nav)) {
      const home = document.createElement('a');
      home.className = 'r7-nav-home';
      home.href = body.classList.contains('community-page') ? 'index.html#top' : '#top';
      home.textContent = 'ХИЩЕНИЕ / THEFT';
      home.setAttribute('aria-label', 'ХИЩЕНИЕ / THEFT — главная');
      nav.insertBefore(home, nav.firstChild);
      home.addEventListener('click', closeMobileNav);
    }

    if (!$('.r7-nav-report', nav)) {
      const report = document.createElement('a');
      report.className = 'r7-nav-report';
      report.href = '#report';
      report.dataset.i18n = 'reportBug';
      const syncLabel = () => {
        report.textContent = document.documentElement.lang === 'en' ? 'REPORT A BUG' : 'СООБЩИТЬ О БАГЕ';
      };
      syncLabel();
      const faqLink = [...nav.querySelectorAll('a')].find(link => (link.getAttribute('href') || '').includes('#faq'));
      if (faqLink) faqLink.insertAdjacentElement('afterend', report);
      else nav.appendChild(report);
      report.addEventListener('click', event => {
        event.preventDefault();
        closeMobileNav();
        $('#bugReportToggle')?.click();
      });
      addEventListener('theft:language', syncLabel);
    }
  }

  function syncInjectedNavVisibility() {
    const home = $('#primaryNav .r7-nav-home');
    if (!home) return;
    if (innerWidth > 980) home.style.setProperty('display', 'none', 'important');
    else home.style.removeProperty('display');
  }

  // Mobile Hero composition --------------------------------------------------
  // The poster is the first meaningful visual on phone portrait. The action
  // pair is duplicated for the compact representation and placed directly
  // under the poster; the original desktop actions remain untouched.
  function installMobileHeroActions() {
    const hero = $('.hero-inner');
    const original = $('.hero-copy-column .hero-actions', hero || document);
    const poster = $('.hero-poster-frame', hero || document);
    if (!hero || !original || !poster || $('.r7-mobile-hero-actions', hero)) return;
    const clone = original.cloneNode(true);
    clone.classList.add('r7-mobile-hero-actions');
    clone.setAttribute('aria-label', 'Быстрые действия');
    poster.insertAdjacentElement('afterend', clone);
  }

  let scrollAnimation = 0;
  function smoothScrollIntoView(node, duration = 620) {
    if (!node || !isSequentialContext()) return;
    cancelAnimationFrame(scrollAnimation);
    const header = $('.site-header');
    const headerHeight = header?.offsetHeight || 0;
    const start = scrollY;
    const target = Math.max(0, Math.round(node.getBoundingClientRect().top + scrollY - headerHeight - 10));
    const distance = target - start;
    if (Math.abs(distance) < 2) return;
    if (reducedMotion()) {
      scrollTo(0, target);
      return;
    }
    const started = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const tick = now => {
      const t = Math.min(1, (now - started) / duration);
      scrollTo(0, Math.round(start + distance * ease(t)));
      if (t < 1) scrollAnimation = requestAnimationFrame(tick);
    };
    scrollAnimation = requestAnimationFrame(tick);
  }

  function holdSequentialHeight(section, selector) {
    if (!section || !isSequentialContext()) return;
    const consoleNode = $(selector, section);
    if (!consoleNode) return;
    const height = Math.ceil(consoleNode.getBoundingClientRect().height);
    if (height > 0) consoleNode.style.minHeight = `${height}px`;
    clearTimeout(consoleNode._r7HeightTimer);
    consoleNode._r7HeightTimer = setTimeout(() => {
      consoleNode.style.removeProperty('min-height');
    }, 900);
  }

  function makeBackButton(label, className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `r7-sequence-back ${className}`;
    button.textContent = `← ${label}`;
    return button;
  }

  // SUBJECT DOSSIER ---------------------------------------------------------
  const cast = $('#cast');
  if (cast) {
    const items = $$('.cast-list-item', cast);
    const dossier = $('#subjectDossier', cast);
    const close = $('#subjectDossierClose', cast);
    const topline = $('.dossier-topline', dossier || cast);
    let lastSelected = null;

    const back = dossier ? makeBackButton('SUBJECT INDEX', 'r7-subject-back') : null;
    if (back && dossier && !$('.r7-subject-back', dossier)) {
      dossier.insertBefore(back, topline || dossier.firstChild);
      back.addEventListener('click', () => {
        holdSequentialHeight(cast, '.cast-console');
        close?.click();
        requestAnimationFrame(() => {
          const target = lastSelected || items[0];
          smoothScrollIntoView(target || cast, 560);
          target?.focus({ preventScroll: true });
        });
      });
    }

    function syncCast({ allowScroll = false } = {}) {
      const selected = items.find(item => item.getAttribute('aria-selected') === 'true') || null;
      const wasOpen = cast.classList.contains('r7-dossier-open');
      cast.classList.toggle('r7-dossier-open', Boolean(selected));
      if (selected) lastSelected = selected;
      if (allowScroll && selected && !wasOpen && isSequentialContext()) {
        requestAnimationFrame(() => smoothScrollIntoView(dossier, 680));
      }
    }

    items.forEach(item => {
      item.addEventListener('click', () => {
        holdSequentialHeight(cast, '.cast-console');
        queueMicrotask(() => syncCast({ allowScroll: true }));
      });
    });

    close?.addEventListener('click', () => queueMicrotask(() => syncCast()));

    const observer = new MutationObserver(() => syncCast());
    items.forEach(item => observer.observe(item, { attributes: true, attributeFilter: ['aria-selected', 'class'] }));
    syncCast();
  }

  // SYSTEM QUERY / FAQ ------------------------------------------------------
  const faq = $('#faq');
  if (faq) {
    const items = $$('.faq-query-item', faq);
    const panel = $('#faqResponsePanel', faq);
    const close = $('#faqResponseClose', faq);
    const header = $('.faq-response-header', panel || faq);
    let lastSelected = null;

    const back = panel ? makeBackButton('QUERY INDEX', 'r7-query-back') : null;
    if (back && panel && !$('.r7-query-back', panel)) {
      panel.insertBefore(back, header || panel.firstChild);
      back.addEventListener('click', () => {
        holdSequentialHeight(faq, '.faq-console');
        close?.click();
        requestAnimationFrame(() => {
          const target = lastSelected || items[0];
          smoothScrollIntoView(target || faq, 560);
          target?.focus({ preventScroll: true });
        });
      });
    }

    function syncFaq({ allowScroll = false } = {}) {
      const selected = items.find(item => item.getAttribute('aria-selected') === 'true') || null;
      const wasOpen = faq.classList.contains('r7-response-open');
      faq.classList.toggle('r7-response-open', Boolean(selected));
      if (selected) lastSelected = selected;
      if (allowScroll && selected && !wasOpen && isSequentialContext()) {
        requestAnimationFrame(() => smoothScrollIntoView(panel, 700));
      }
    }

    items.forEach(item => {
      item.addEventListener('click', () => {
        holdSequentialHeight(faq, '.faq-console');
        queueMicrotask(() => syncFaq({ allowScroll: true }));
      });
    });

    close?.addEventListener('click', () => queueMicrotask(() => syncFaq()));

    const observer = new MutationObserver(() => syncFaq());
    items.forEach(item => observer.observe(item, { attributes: true, attributeFilter: ['aria-selected', 'class'] }));
    if (panel) observer.observe(panel, { attributes: true, attributeFilter: ['class'] });
    syncFaq();
  }

  // ARCHIVE / MATERIALS -----------------------------------------------------
  // The physical-wall ARCHIVE handle belongs only to the MATERIALS scene. The
  // active test uses the visible viewport centre rather than a loose section
  // intersection, so the handle does not bleed into neighbouring tabs.
  const materials = $('#materials');
  const archiveShell = $('.archive-drawer-shell', materials || document);
  const archiveDrawer = $('#archiveDrawer', materials || document);
  const archiveToggle = $('#archiveDrawerToggle', materials || document);
  const archiveImage = $('#archiveMainImage', materials || document);
  const archiveStage = $('#archiveStage', materials || document);
  let archiveFrame = 0;

  function syncMaterialsArchiveVisibility() {
    if (!materials || !archiveShell) return;
    const rect = materials.getBoundingClientRect();
    const headerHeight = $('.site-header')?.offsetHeight || 0;
    const usableHeight = Math.max(1, innerHeight - headerHeight);
    const probe = headerHeight + usableHeight * .48;
    const active = rect.top <= probe && rect.bottom >= probe;
    archiveShell.classList.toggle('r7-materials-active', active);
    if (!active && archiveShell.classList.contains('is-open')) {
      archiveShell.classList.remove('is-open');
      archiveDrawer?.classList.remove('is-open');
      archiveDrawer?.setAttribute('aria-hidden', 'true');
      archiveToggle?.setAttribute('aria-expanded', 'false');
    }
  }

  function scheduleArchiveVisibility() {
    cancelAnimationFrame(archiveFrame);
    archiveFrame = requestAnimationFrame(syncMaterialsArchiveVisibility);
  }

  function syncArchiveAspect() {
    if (!archiveStage || !archiveImage) return;
    if (!isCompactMediaContext()) {
      archiveStage.style.removeProperty('--r7-archive-aspect');
      return;
    }
    const width = archiveImage.naturalWidth;
    const height = archiveImage.naturalHeight;
    if (width > 0 && height > 0) {
      archiveStage.style.setProperty('--r7-archive-aspect', `${width} / ${height}`);
    }
  }

  if (archiveImage) {
    archiveImage.addEventListener('load', syncArchiveAspect);
    new MutationObserver(syncArchiveAspect).observe(archiveImage, { attributes: true, attributeFilter: ['src'] });
    syncArchiveAspect();
  }
  addEventListener('scroll', scheduleArchiveVisibility, { passive: true });

  function applyViewportClasses() {
    body.classList.toggle('r7-coarse-pointer', isCoarse());
    body.classList.toggle('r7-phone-landscape', isPhoneLandscape());
    body.classList.toggle('r7-sequential-ui', isSequentialContext());
    syncInjectedNavVisibility();
    syncMaterialsArchiveVisibility();
    syncArchiveAspect();
  }

  // Keep state across device rotation. We only change representation classes;
  // existing selected FAQ/subject state remains untouched in the DOM.
  let viewportTimer = 0;
  function scheduleViewportSync() {
    clearTimeout(viewportTimer);
    viewportTimer = setTimeout(() => {
      applyViewportClasses();
    }, 60);
  }

  installNavigationAdditions();
  installMobileHeroActions();
  applyViewportClasses();
  addEventListener('resize', scheduleViewportSync, { passive: true });
  addEventListener('orientationchange', scheduleViewportSync, { passive: true });
})();