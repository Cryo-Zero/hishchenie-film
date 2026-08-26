(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const body = document.body;
  const header = $('.site-header');
  const menu = $('#menuToggle');
  const nav = $('#primaryNav');
  const headerHeight = () => header?.offsetHeight || 0;
  const motionReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (location.hash && 'scrollRestoration' in history) history.scrollRestoration = 'manual';


  // One staged-reveal engine is shared by SUBJECT DOSSIER and SYSTEM QUERY.
  // Keeping one implementation prevents the two interfaces from drifting apart.
  function stagedReveal(panel, writeValues) {
    if (!panel) { if (typeof writeValues === 'function') writeValues(); return; }
    panel.classList.remove('is-revealed');
    panel.classList.add('is-revealing');
    if (typeof writeValues === 'function') writeValues();
    if (motionReduced()) {
      panel.classList.remove('is-revealing');
      panel.classList.add('is-revealed');
      return;
    }
    // Force the hidden state to be painted before starting the reveal.
    void panel.offsetWidth;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      panel.classList.remove('is-revealing');
      panel.classList.add('is-revealed');
    }));
  }

  function closeNav() {
    body.classList.remove('nav-open');
    menu?.setAttribute('aria-expanded', 'false');
  }

  menu?.addEventListener('click', () => {
    const open = body.classList.toggle('nav-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  window.addEventListener('resize', () => { if (window.innerWidth > 980) closeNav(); });

  // Exact top for the brand on the main page; reviews/admin naturally navigate home.
  $('.brand[href="#top"]')?.addEventListener('click', event => {
    event.preventDefault();
    history.replaceState(null, '', `${location.pathname}${location.search}#top`);
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    closeNav();
  });

  // Every section has an exact landing coordinate. This is used both for
  // same-page navigation and for index.html#section arrivals from reviews.html.
  function sectionTop(hash) {
    if (!hash || hash === '#top') return 0;
    const target = document.querySelector(hash);
    if (!target) return null;
    return Math.max(0, Math.round(target.getBoundingClientRect().top + window.scrollY - headerHeight()));
  }
  function instantScrollTo(top) {
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, top);
    // Restore authored smooth scrolling only after the anchor position is committed.
    requestAnimationFrame(() => { html.style.scrollBehavior = previous; });
  }
  function scrollToHash(hash, behavior = 'auto') {
    const top = sectionTop(hash);
    if (top == null) return false;
    if (behavior === 'auto' || behavior === 'instant') instantScrollTo(top);
    else window.scrollTo({ top, behavior });
    return true;
  }
  let anchorBooting = false;
  function enforceInitialHash() {
    const hash = location.hash;
    if (!hash) { anchorBooting = false; return; }
    anchorBooting = true;
    // Browser restoration can otherwise revive an unrelated position from the
    // previous page. Two frames allow the sticky two-row header to settle.
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToHash(hash, 'auto')));
    setTimeout(() => {
      scrollToHash(hash, 'auto');
      anchorBooting = false;
      updateScrollUI();
    }, 90);
  }
  enforceInitialHash();
  addEventListener('pageshow', enforceInitialHash);

  // Offset hash navigation under the sticky header.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    if (sectionTop(hash) == null) return;
    event.preventDefault();
    scrollToHash(hash, motionReduced() ? 'auto' : 'smooth');
    history.replaceState(null, '', `${location.pathname}${location.search}${hash}`);
    closeNav();
  });

  // Global scroll / right rail.
  const scrollProgress = $('#scrollProgress');
  const railProgress = $('#railProgress');
  const railSection = $('#railSection');
  const sectionCodes = [
    ['top','00 / ENTRY'], ['about','01 / DOSSIER'], ['materials','02 / ARCHIVE'],
    ['trailer','03 / SIGNAL'], ['watch','04 / ACCESS'], ['cast','05 / SUBJECTS'],
    ['faq','06 / QUERY'], ['contacts','07 / CONTACT'], ['reviewsTop','R / RESPONSE'], ['reviewWorkspace','R1 / FEED']
  ].map(([id, code]) => [document.getElementById(id), code]).filter(([el]) => el);

  function updateCommunityRefreshAnchor() {
    if (anchorBooting || !body.classList.contains('community-page')) return;
    const workspace = document.getElementById('reviewWorkspace');
    const topPanel = document.getElementById('reviewsTop');
    if (!workspace || !topPanel) return;
    const probe = scrollY + headerHeight() + Math.min(110, innerHeight * .18);
    const hash = probe >= workspace.offsetTop ? '#reviewWorkspace' : '#reviewsTop';
    if (location.hash !== hash) history.replaceState(null, '', `${location.pathname}${location.search}${hash}`);
  }

  function updateScrollUI() {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const pct = Math.max(0, Math.min(100, scrollY / max * 100));
    if (scrollProgress) scrollProgress.style.width = `${pct}%`;
    if (railProgress) railProgress.style.height = `${pct}%`;
    if (railSection && sectionCodes.length) {
      const y = scrollY + innerHeight * .34;
      let active = sectionCodes[0];
      sectionCodes.forEach(item => { if (item[0].offsetTop <= y) active = item; });
      railSection.textContent = active[1];
    }
    updateCommunityRefreshAnchor();
  }
  updateScrollUI();
  addEventListener('scroll', updateScrollUI, { passive: true });
  addEventListener('resize', updateScrollUI);

  // Active nav item — only same-page hash links are observed.
  const hashLinks = $$('.nav-links a[href^="#"]');
  const observed = hashLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (observed.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (!visible) return;
      hashLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: `-${headerHeight()+10}px 0px -55% 0px`, threshold:[.1,.25,.5] });
    observed.forEach(el => observer.observe(el));
  }

  // ARCHIVE viewer ------------------------------------------------------------
  const materialsSection = $('#materials');
  const archiveShell = $('.archive-drawer-shell');
  const archiveDrawer = $('#archiveDrawer');
  const archiveToggle = $('#archiveDrawerToggle');
  const archiveDrawerClose = $('#archiveDrawerClose');
  const stage = $('#archiveStage');
  const mainImage = $('#archiveMainImage');
  const cards = $$('#gallery .gallery-card');
  const prev = $('#galleryPrev');
  const next = $('#galleryNext');
  const code = $('#archiveCode');
  const counter = $('#archiveCounter');
  const archivePagination = $('#archivePagination');
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxCounter = $('#lightboxCounter');
  const lightboxPagination = $('#lightboxPagination');
  const lightboxClose = $('#lightboxClose');
  const lightboxPrev = $('#lightboxPrev');
  const lightboxNext = $('#lightboxNext');
  let archiveIndex = 0;
  let touchX = 0;
  let materialsVisible = false;

  const archiveItems = cards.map((card, i) => {
    const img = $('img', card);
    return {
      src: img?.getAttribute('src') || '',
      alt: img?.getAttribute('alt') || '',
      i18n: img?.dataset.i18nAlt || '',
      file: card.dataset.file || `MAT_${String(i+1).padStart(3,'0')}`,
      type: card.dataset.type || 'ARCHIVE'
    };
  });

  function renderDots(root, active) {
    if (!root) return;
    root.replaceChildren();
    archiveItems.forEach((_, i) => {
      const dot = document.createElement('i');
      dot.className = i === active ? 'is-active' : '';
      root.append(dot);
    });
  }

  function setArchive(index, focus = false) {
    if (!stage || !mainImage || !archiveItems.length) return;
    archiveIndex = (index + archiveItems.length) % archiveItems.length;
    const item = archiveItems[archiveIndex];
    mainImage.src = item.src;
    mainImage.alt = item.alt;
    if (item.i18n) mainImage.dataset.i18nAlt = item.i18n;
    stage.style.setProperty('--archive-bg', `url("${item.src.replace(/"/g,'%22')}")`);
    if (code) code.textContent = `${item.file} // ${item.type}`;
    if (counter) counter.textContent = `${String(archiveIndex+1).padStart(2,'0')} / ${String(archiveItems.length).padStart(2,'0')}`;
    cards.forEach((card, i) => {
      card.classList.toggle('is-active', i === archiveIndex);
      card.setAttribute('aria-current', i === archiveIndex ? 'true' : 'false');
    });
    renderDots(archivePagination, archiveIndex);
    if (lightbox?.classList.contains('open')) syncLightbox();
    if (focus) stage.focus({ preventScroll:true });
  }

  function syncLightbox() {
    if (!lightboxImage || !archiveItems.length) return;
    const item = archiveItems[archiveIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    if (lightboxCounter) lightboxCounter.textContent = `${String(archiveIndex+1).padStart(2,'0')} / ${String(archiveItems.length).padStart(2,'0')}`;
    renderDots(lightboxPagination, archiveIndex);
  }

  function openLightbox(index = archiveIndex) {
    if (!lightbox || !archiveItems.length) return;
    archiveIndex = (index + archiveItems.length) % archiveItems.length;
    setArchive(archiveIndex);
    syncLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    body.classList.add('lightbox-open');
    lightboxClose?.focus();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    body.classList.remove('lightbox-open');
    stage?.focus({ preventScroll:true });
  }
  function shiftLightbox(delta) { setArchive(archiveIndex + delta); syncLightbox(); }

  function setDrawer(open) {
    if (!archiveShell || !archiveDrawer || !archiveToggle) return;
    archiveShell.classList.toggle('is-open', open);
    archiveDrawer.classList.toggle('is-open', open);
    archiveDrawer.setAttribute('aria-hidden', String(!open));
    archiveToggle.setAttribute('aria-expanded', String(open));
    if (!open && !materialsVisible) archiveShell.classList.remove('is-visible');
  }
  function toggleDrawer() { setDrawer(!archiveShell?.classList.contains('is-open')); }

  archiveToggle?.addEventListener('click', toggleDrawer);
  archiveDrawerClose?.addEventListener('click', () => setDrawer(false));
  cards.forEach((card, i) => card.addEventListener('click', () => setArchive(i, true)));
  prev?.addEventListener('click', e => { e.stopPropagation(); setArchive(archiveIndex-1); });
  next?.addEventListener('click', e => { e.stopPropagation(); setArchive(archiveIndex+1); });
  stage?.addEventListener('click', e => { if (!e.target.closest('.gallery-button')) openLightbox(); });
  stage?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); setArchive(archiveIndex-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); setArchive(archiveIndex+1); }
  });
  stage?.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive:true });
  stage?.addEventListener('touchend', e => {
    const d = e.changedTouches[0].clientX - touchX;
    if (Math.abs(d) > 48) setArchive(archiveIndex + (d < 0 ? 1 : -1));
  }, { passive:true });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', e => { e.stopPropagation(); shiftLightbox(-1); });
  lightboxNext?.addEventListener('click', e => { e.stopPropagation(); shiftLightbox(1); });
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  lightbox?.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive:true });
  lightbox?.addEventListener('touchend', e => {
    const d = e.changedTouches[0].clientX - touchX;
    if (Math.abs(d) > 48) shiftLightbox(d < 0 ? 1 : -1);
  }, { passive:true });
  document.addEventListener('keydown', e => {
    if (lightbox?.classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') shiftLightbox(-1);
      if (e.key === 'ArrowRight') shiftLightbox(1);
      return;
    }
    if (e.key === 'Escape' && archiveShell?.classList.contains('is-open')) setDrawer(false);
  });

  // The ARCHIVE control is the deliberate exception to the global grid: while
  // the materials section is on screen it lives on the physical left viewport wall.
  if (materialsSection && archiveShell && 'IntersectionObserver' in window) {
    const archiveObserver = new IntersectionObserver(entries => {
      const visible = entries.some(entry => entry.isIntersecting);
      materialsVisible = visible;
      if (visible) {
        archiveShell.classList.add('is-visible');
      } else {
        // ARCHIVE is local to MATERIALS: leaving the section retracts the drawer
        // into the wall and removes the handle from every other site panel.
        setDrawer(false);
        archiveShell.classList.remove('is-visible');
      }
    }, { rootMargin:'-12% 0px -12% 0px', threshold:.08 });
    archiveObserver.observe(materialsSection);
  } else archiveShell?.classList.add('is-visible');

  if (archiveItems.length) setArchive(0);

  // Trailer and the closed ARCHIVE frame use the same visual media width.
  const videoShell = $('#videoShell');
  const archiveViewer = $('#archiveViewer');
  function fitMediaFrames() {
    if (innerWidth <= 820) {
      if (videoShell) videoShell.style.width = '100%';
      if (archiveViewer) archiveViewer.style.removeProperty('--media-frame-width');
      return;
    }
    // Reserve enough vertical room for the heading, metadata, pagination and
    // the next section boundary. This keeps MATERIALS and SIGNAL self-contained.
    const availableHeight = Math.max(300, Math.min(560, innerHeight - headerHeight() - 260));
    const width = Math.min(1040, availableHeight * 16 / 9);
    if (videoShell) videoShell.style.width = `${width}px`;
    if (archiveViewer) archiveViewer.style.setProperty('--media-frame-width', `${width}px`);
  }
  fitMediaFrames();
  addEventListener('resize', fitMediaFrames);

  // ADAPTIVE DESKTOP PANELS ---------------------------------------------------
  // A panel is kept as a one-viewport "tab" only when the current desktop
  // viewport can actually hold its natural content. Smaller/shorter desktop
  // windows fall back to normal document flow instead of shrinking typography.
  const adaptivePanelIds = ['about','materials','trailer','watch','cast','faq'];
  const adaptivePanels = adaptivePanelIds.map(id => document.getElementById(id)).filter(Boolean);
  const reviewWorkspace = document.getElementById('reviewWorkspace');
  let layoutAuditTimer = 0;

  function auditDesktopPanels() {
    body.classList.add('adaptive-panel-system');
    const finePointer = !matchMedia('(pointer: coarse)').matches;
    const desktopCandidate = innerWidth >= 1180 && innerHeight >= 700 && finePointer;
    body.classList.toggle('desktop-panel-capable', desktopCandidate);
    body.classList.toggle('desktop-flow-mode', !desktopCandidate);

    const available = Math.max(320, innerHeight - headerHeight());
    adaptivePanels.forEach(section => {
      section.classList.remove('is-screen-panel','is-flow-panel');
      const shell = section.querySelector(':scope > .shell') || section.firstElementChild;
      const natural = Math.ceil(shell?.scrollHeight || section.scrollHeight || 0);
      const fits = desktopCandidate && natural <= Math.max(360, available - 18);
      section.classList.add(fits ? 'is-screen-panel' : 'is-flow-panel');
    });

    // Reviews use the independent feed scrollbar only on a genuinely roomy
    // desktop. On short or narrow PC windows the same content becomes a normal
    // flow layout so no controls have to be miniaturised.
    const reviewScreen = !!reviewWorkspace && finePointer && innerWidth >= 1280 && innerHeight >= 760;
    body.classList.toggle('review-screen-mode', reviewScreen);
    body.classList.toggle('review-flow-mode', !!reviewWorkspace && !reviewScreen);
  }

  function scheduleDesktopAudit() {
    clearTimeout(layoutAuditTimer);
    layoutAuditTimer = setTimeout(() => {
      fitMediaFrames();
      requestAnimationFrame(auditDesktopPanels);
    }, 45);
  }
  auditDesktopPanels();
  addEventListener('resize', scheduleDesktopAudit);
  if (document.fonts?.ready) document.fonts.ready.then(scheduleDesktopAudit).catch(() => {});

  // Trailer starts gently. Once a visitor changes the level, remember their choice.
  const trailerVideo = $('#trailerVideo');
  if (trailerVideo) {
    const storedVolume = Number(localStorage.getItem('theft_trailer_volume'));
    trailerVideo.volume = Number.isFinite(storedVolume) && storedVolume >= 0 && storedVolume <= 1 ? storedVolume : .35;
    trailerVideo.addEventListener('volumechange', () => {
      try { localStorage.setItem('theft_trailer_volume', String(trailerVideo.volume)); } catch {}
    });
  }

  // SUBJECT DOSSIER ------------------------------------------------------------
  // The list never changes its geometry. A permanent panel on the right receives
  // the selected subject and reveals fields top-to-bottom.
  const castItems = $$('.cast-list-item');
  const dossier = $('#subjectDossier');
  const dossierClose = $('#subjectDossierClose');
  const dossierSubject = $('#dossierSubject');
  const dossierName = $('#dossierName');
  const dossierRole = $('#dossierRole');
  const dossierRoleValue = $('#dossierRoleValue');
  const dossierStatusValue = $('#dossierStatusValue');
  const dossierAccessValue = $('#dossierAccessValue');
  const dossierRefValue = $('#dossierRefValue');
  const dossierPrompt = $('#dossierPrompt');
  let activeSubject = null;
  let dossierTimer = 0;


  function dossierText(item, selector) {
    return item?.querySelector(selector)?.textContent?.trim() || '???';
  }

  function setDossierValues(item) {
    if (!dossier) return;
    if (!item) {
      dossierSubject.textContent = 'SUBJECT // UNIDENTIFIED';
      dossierName.textContent = '???';
      dossierRole.textContent = '???';
      dossierRoleValue.textContent = '???';
      dossierStatusValue.textContent = '???';
      dossierAccessValue.textContent = 'PUBLIC';
      dossierRefValue.textContent = '—';
      dossierPrompt.dataset.i18n = 'dossierAwaiting';
      dossierPrompt.textContent = document.documentElement.lang === 'en'
        ? 'SELECT SUBJECT // AWAITING INPUT'
        : 'ВЫБЕРИТЕ СУБЪЕКТ // ОЖИДАНИЕ';
      dossier.classList.remove('has-subject');
      return;
    }
    const subject = item.dataset.subject || 'SUBJECT';
    const name = dossierText(item, '.cast-actor-source');
    const role = dossierText(item, 'em');
    dossierSubject.textContent = `${subject} // IDENTIFIED`;
    dossierName.textContent = name;
    dossierRole.textContent = role;
    dossierRoleValue.textContent = role;
    dossierStatusValue.textContent = document.documentElement.lang === 'en' ? 'CAST CONFIRMED' : 'СОСТАВ ПОДТВЕРЖДЁН';
    dossierAccessValue.textContent = 'PUBLIC';
    dossierRefValue.textContent = `PUBLIC/${subject.replace('SUBJECT_','')}`;
    dossierPrompt.dataset.i18n = 'dossierLoaded';
    dossierPrompt.textContent = document.documentElement.lang === 'en'
      ? 'FILE LOADED // SELECT ANOTHER SUBJECT'
      : 'ФАЙЛ ЗАГРУЖЕН // ВЫБЕРИТЕ ДРУГОЙ СУБЪЕКТ';
    dossier.classList.add('has-subject');
  }

  function animateDossier(item) {
    if (!dossier) return;
    clearTimeout(dossierTimer);
    stagedReveal(dossier, () => setDossierValues(item));
  }

  function selectSubject(item) {
    const closing = item && activeSubject === item;
    activeSubject = closing ? null : item;
    castItems.forEach(row => {
      const selected = row === activeSubject;
      row.classList.toggle('is-selected', selected);
      row.setAttribute('aria-selected', String(selected));
    });
    animateDossier(activeSubject);
  }

  castItems.forEach(item => item.addEventListener('click', () => selectSubject(item)));
  dossierClose?.addEventListener('click', () => selectSubject(null));
  if (dossier) {
    setDossierValues(null);
    dossier.classList.add('is-revealed');
  }
  addEventListener('theft:language', () => {
    // public-response translated the list first; re-read visible values.
    setDossierValues(activeSubject);
  });

  // SYSTEM QUERY / FAQ --------------------------------------------------------
  // The question rail always stays visible. Selecting the same question twice
  // closes the response and restores the neutral STANDBY state.
  const faqQueries = $$('.faq-query-item');
  const faqPanel = $('#faqResponsePanel');
  const faqClose = $('#faqResponseClose');
  const faqCode = $('#faqResponseCode');
  const faqQuestion = $('#faqResponseQuestion');
  const faqAnswer = $('#faqResponseAnswer');
  const faqStatus = $('#faqResponseStatus');
  const faqMessage = $('#faqResponseMessage');
  const faqLog = $('#faqResponseLog');
  let activeFaq = null;

  function faqText(item, selector, fallback='—') {
    return item?.querySelector(selector)?.textContent?.trim() || fallback;
  }
  function resetFaq(animate = true) {
    activeFaq = null;
    faqQueries.forEach(row => {
      row.classList.remove('is-selected');
      row.setAttribute('aria-selected','false');
    });
    const writeStandby = () => {
      if (faqCode) faqCode.textContent = 'QUERY_00 // STANDBY';
      if (faqQuestion) faqQuestion.textContent = '???';
      if (faqAnswer) faqAnswer.textContent = document.documentElement.lang === 'en' ? 'Select a question // awaiting response' : 'Выберите вопрос // ожидание ответа';
      if (faqStatus) faqStatus.textContent = '???';
      if (faqMessage) faqMessage.textContent = '???';
      if (faqLog) faqLog.textContent = 'SYSTEM LOG // Q00.STBY';
      faqPanel?.classList.remove('has-response');
    };
    if (!animate) {
      writeStandby();
      faqPanel?.classList.remove('is-revealing');
      faqPanel?.classList.add('is-revealed');
    } else stagedReveal(faqPanel, writeStandby);
  }
  function renderFaq(item, animate = true) {
    if (!item || !faqPanel) return;
    if (activeFaq === item) { resetFaq(animate); return; }
    activeFaq = item;
    faqQueries.forEach(row => {
      const selected = row === item;
      row.classList.toggle('is-selected', selected);
      row.setAttribute('aria-selected', String(selected));
    });
    const writeResponse = () => {
      const qid = item.dataset.query || 'QUERY_00';
      if (faqCode) faqCode.textContent = item.dataset.queryCode || `${qid} // VERIFIED RESPONSE`;
      if (faqQuestion) faqQuestion.textContent = faqText(item, 'strong[data-i18n]', '???');
      if (faqAnswer) faqAnswer.textContent = faqText(item, '.faq-source-answer', '—');
      if (faqStatus) faqStatus.textContent = faqText(item, '.faq-source-status', item.dataset.queryStatus || '—');
      if (faqMessage) faqMessage.textContent = faqText(item, '.faq-source-message', item.dataset.queryMessage || '—');
      if (faqLog) faqLog.textContent = `SYSTEM LOG // Q${qid.slice(-2)}.RSP`;
      faqPanel.classList.add('has-response');
    };
    if (!animate) {
      writeResponse();
      faqPanel.classList.remove('is-revealing');
      faqPanel.classList.add('is-revealed');
    } else stagedReveal(faqPanel, writeResponse);
  }

  faqQueries.forEach(item => item.addEventListener('click', () => renderFaq(item, true)));
  faqClose?.addEventListener('click', () => resetFaq(true));
  if (faqPanel) { faqPanel.classList.add('is-revealed'); resetFaq(false); }
  addEventListener('theft:language', () => {
    if (activeFaq) {
      const item=activeFaq; activeFaq=null; renderFaq(item, false);
    } else resetFaq(false);
  });
})();
