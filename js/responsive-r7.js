(() => {
  'use strict';

  const body = document.body;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

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
  function installMobileHeroActions() {
    const hero = $('.hero-inner');
    const copy = $('.hero-copy-column', hero || document);
    const originalActions = $('.hero-actions', copy || document);
    const originalTitle = $('h1', copy || document);
    const poster = $('.hero-poster-frame', hero || document);
    if (!hero || !copy || !originalActions || !poster) return;

    if (!$('.r7-mobile-hero-title', hero) && originalTitle) {
      const title = originalTitle.cloneNode(true);
      title.classList.add('r7-mobile-hero-title');
      poster.insertAdjacentElement('beforebegin', title);
    }

    if (!$('.r7-mobile-hero-actions', hero)) {
      const actions = originalActions.cloneNode(true);
      actions.classList.add('r7-mobile-hero-actions');
      actions.setAttribute('aria-label', 'Быстрые действия');
      poster.insertAdjacentElement('afterend', actions);
    }
  }

  // Sequential FAQ / Actors --------------------------------------------------
  // Owner rule: changing index/detail state must never move the viewport.
  // The clicked element changes the local scene only; the visitor controls all scrolling.
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

  function preserveViewportPosition() {
    if (!isSequentialContext()) return;
    const x = scrollX;
    const y = scrollY;
    requestAnimationFrame(() => scrollTo({ left: x, top: y, behavior: 'auto' }));
    setTimeout(() => scrollTo({ left: x, top: y, behavior: 'auto' }), 80);
  }

  function makeBackButton(label, className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `r7-sequence-back ${className}`;
    button.textContent = `← ${label}`;
    return button;
  }

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
        const target = lastSelected || items[0];
        close?.click();
        preserveViewportPosition();
        requestAnimationFrame(() => target?.focus({ preventScroll: true }));
      });
    }

    function syncCast() {
      const selected = items.find(item => item.getAttribute('aria-selected') === 'true') || null;
      cast.classList.toggle('r7-dossier-open', Boolean(selected));
      if (selected) lastSelected = selected;
    }

    items.forEach(item => {
      item.addEventListener('click', () => {
        holdSequentialHeight(cast, '.cast-console');
        queueMicrotask(syncCast);
        preserveViewportPosition();
      });
    });

    close?.addEventListener('click', () => {
      queueMicrotask(syncCast);
      preserveViewportPosition();
    });

    const observer = new MutationObserver(syncCast);
    items.forEach(item => observer.observe(item, { attributes: true, attributeFilter: ['aria-selected', 'class'] }));
    syncCast();
  }

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
        const target = lastSelected || items[0];
        close?.click();
        preserveViewportPosition();
        requestAnimationFrame(() => target?.focus({ preventScroll: true }));
      });
    }

    function syncFaq() {
      const selected = items.find(item => item.getAttribute('aria-selected') === 'true') || null;
      faq.classList.toggle('r7-response-open', Boolean(selected));
      if (selected) lastSelected = selected;
    }

    items.forEach(item => {
      item.addEventListener('click', () => {
        holdSequentialHeight(faq, '.faq-console');
        queueMicrotask(syncFaq);
        preserveViewportPosition();
      });
    });

    close?.addEventListener('click', () => {
      queueMicrotask(syncFaq);
      preserveViewportPosition();
    });

    const observer = new MutationObserver(syncFaq);
    items.forEach(item => observer.observe(item, { attributes: true, attributeFilter: ['aria-selected', 'class'] }));
    if (panel) observer.observe(panel, { attributes: true, attributeFilter: ['class'] });
    syncFaq();
  }

  // PROFILE HELP -------------------------------------------------------------
  // Turn the R6 full-screen helper into an anchored translucent popover.
  function installProfileHelpPopover() {
    const toggle = $('#profileHelpToggle');
    const panel = $('#profileHelpPanel');
    const composer = panel?.closest('.review-composer');
    if (!toggle || !panel || !composer) return;

    const position = () => {
      if (panel.hidden) return;
      const parentRect = composer.getBoundingClientRect();
      const buttonRect = toggle.getBoundingClientRect();
      const width = Math.min(380, Math.max(260, parentRect.width - 28));
      const preferredLeft = buttonRect.right - parentRect.left - width;
      const left = Math.max(10, Math.min(parentRect.width - width - 10, preferredLeft));
      const arrowRight = Math.max(16, Math.min(width - 20, parentRect.right - buttonRect.right + 13));
      panel.style.setProperty('--r7-help-top', `${Math.max(44, buttonRect.bottom - parentRect.top + 10)}px`);
      panel.style.setProperty('--r7-help-left', `${left}px`);
      panel.style.setProperty('--r7-help-arrow-right', `${arrowRight}px`);
      body.classList.remove('info-overlay-open');
    };

    const observer = new MutationObserver(() => {
      if (!panel.hidden) requestAnimationFrame(position);
    });
    observer.observe(panel, { attributes: true, attributeFilter: ['hidden', 'aria-hidden'] });
    toggle.addEventListener('click', () => setTimeout(position, 0));
    addEventListener('resize', position, { passive: true });
    addEventListener('scroll', () => {
      if (!panel.hidden) position();
    }, { passive: true });
  }

  // MOBILE REVIEW PAGING -----------------------------------------------------
  function installMobileReviewPaging() {
    const list = $('#reviewsList');
    if (!list || $('.r7-load-more-reviews')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'r7-load-more-reviews';
    list.insertAdjacentElement('afterend', button);

    const batch = 6;
    let visible = batch;
    let timer = 0;

    const syncLabel = remaining => {
      const ru = document.documentElement.lang !== 'en';
      button.textContent = remaining > 0
        ? `${ru ? 'ПОКАЗАТЬ ЕЩЁ' : 'SHOW MORE'} · ${remaining}`
        : '';
    };

    const apply = ({ reset = false } = {}) => {
      const cards = [...list.children].filter(node => node.classList?.contains('review-card'));
      const compact = isCompactMediaContext();
      if (reset) visible = batch;
      if (!compact) {
        cards.forEach(card => card.classList.remove('r7-review-hidden'));
        button.classList.remove('is-visible');
        syncLabel(0);
        return;
      }
      cards.forEach((card, index) => card.classList.toggle('r7-review-hidden', index >= visible));
      const remaining = Math.max(0, cards.length - visible);
      button.classList.toggle('is-visible', remaining > 0);
      syncLabel(remaining);
    };

    button.addEventListener('click', () => {
      visible += batch;
      apply();
    });

    new MutationObserver(mutations => {
      if (!mutations.some(mutation => mutation.type === 'childList')) return;
      clearTimeout(timer);
      timer = setTimeout(() => apply({ reset: true }), 40);
    }).observe(list, { childList: true });

    addEventListener('theft:language', () => apply(), { passive: true });
    addEventListener('resize', () => apply(), { passive: true });
    apply({ reset: true });
  }

  // ARCHIVE / MATERIALS -----------------------------------------------------
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
    if (width > 0 && height > 0) archiveStage.style.setProperty('--r7-archive-aspect', `${width} / ${height}`);
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

  let viewportTimer = 0;
  function scheduleViewportSync() {
    clearTimeout(viewportTimer);
    viewportTimer = setTimeout(applyViewportClasses, 60);
  }

  installNavigationAdditions();
  installMobileHeroActions();
  installProfileHelpPopover();
  installMobileReviewPaging();
  applyViewportClasses();
  addEventListener('resize', scheduleViewportSync, { passive: true });
  addEventListener('orientationchange', scheduleViewportSync, { passive: true });
})();