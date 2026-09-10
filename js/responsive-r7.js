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

  function applyViewportClasses() {
    body.classList.toggle('r7-coarse-pointer', isCoarse());
    body.classList.toggle('r7-phone-landscape', isPhoneLandscape());
    body.classList.toggle('r7-sequential-ui', isSequentialContext());
  }

  function safeScrollIntoView(node) {
    if (!node || !isSequentialContext()) return;
    requestAnimationFrame(() => {
      node.scrollIntoView({
        behavior: reducedMotion() ? 'auto' : 'smooth',
        block: 'start'
      });
    });
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
        close?.click();
        requestAnimationFrame(() => {
          const target = lastSelected || items[0];
          safeScrollIntoView(target || cast);
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
        safeScrollIntoView(dossier);
      }
    }

    items.forEach(item => {
      item.addEventListener('click', () => queueMicrotask(() => syncCast({ allowScroll: true })));
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
        close?.click();
        requestAnimationFrame(() => {
          const target = lastSelected || items[0];
          safeScrollIntoView(target || faq);
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
        safeScrollIntoView(panel);
      }
    }

    items.forEach(item => {
      item.addEventListener('click', () => queueMicrotask(() => syncFaq({ allowScroll: true })));
    });

    close?.addEventListener('click', () => queueMicrotask(() => syncFaq()));

    const observer = new MutationObserver(() => syncFaq());
    items.forEach(item => observer.observe(item, { attributes: true, attributeFilter: ['aria-selected', 'class'] }));
    if (panel) observer.observe(panel, { attributes: true, attributeFilter: ['class'] });
    syncFaq();
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

  applyViewportClasses();
  addEventListener('resize', scheduleViewportSync, { passive: true });
  addEventListener('orientationchange', scheduleViewportSync, { passive: true });
})();
