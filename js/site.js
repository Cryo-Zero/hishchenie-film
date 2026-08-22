(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const body = document.body;
  const header = $('.site-header');
  const menu = $('#menuToggle');
  const nav = $('#primaryNav');
  const headerHeight = () => header?.offsetHeight || 0;

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

  // Offset hash navigation under the sticky header.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;
    event.preventDefault();
    const top = hash === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - headerHeight();
    window.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
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
    ['faq','06 / FAQ'], ['contacts','07 / CONTACT'], ['reviewsTop','R / RESPONSE'], ['reviewWorkspace','R1 / FEED']
  ].map(([id, code]) => [document.getElementById(id), code]).filter(([el]) => el);

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
  const stage = $('#archiveStage');
  const mainImage = $('#archiveMainImage');
  const cards = $$('.archive-thumbs .gallery-card');
  const prev = $('#galleryPrev');
  const next = $('#galleryNext');
  const code = $('#archiveCode');
  const counter = $('#archiveCounter');
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxCounter = $('#lightboxCounter');
  const lightboxClose = $('#lightboxClose');
  const lightboxPrev = $('#lightboxPrev');
  const lightboxNext = $('#lightboxNext');
  let archiveIndex = 0;
  let touchX = 0;

  const archiveItems = cards.map((card, i) => {
    const img = $('img', card);
    return { src: img?.getAttribute('src') || '', alt: img?.getAttribute('alt') || '', i18n: img?.dataset.i18nAlt || '', file: card.dataset.file || `MAT_${String(i+1).padStart(3,'0')}` };
  });

  function setArchive(index, focus = false) {
    if (!stage || !mainImage || !archiveItems.length) return;
    archiveIndex = (index + archiveItems.length) % archiveItems.length;
    const item = archiveItems[archiveIndex];
    mainImage.src = item.src;
    mainImage.alt = item.alt;
    if (item.i18n) mainImage.dataset.i18nAlt = item.i18n;
    stage.style.setProperty('--archive-bg', `url("${item.src.replace(/"/g,'%22')}")`);
    if (code) code.textContent = `${item.file} // ARCHIVE`;
    if (counter) counter.textContent = `${String(archiveIndex+1).padStart(2,'0')} / ${String(archiveItems.length).padStart(2,'0')}`;
    cards.forEach((card, i) => {
      card.classList.toggle('is-active', i === archiveIndex);
      card.setAttribute('aria-current', i === archiveIndex ? 'true' : 'false');
    });
    cards[archiveIndex]?.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'nearest' });
    if (focus) stage.focus({ preventScroll:true });
  }

  function openLightbox(index = archiveIndex) {
    if (!lightbox || !lightboxImage || !archiveItems.length) return;
    archiveIndex = (index + archiveItems.length) % archiveItems.length;
    const item = archiveItems[archiveIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxCounter.textContent = `${archiveIndex+1} / ${archiveItems.length}`;
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
  function shiftLightbox(delta) { openLightbox(archiveIndex + delta); }

  prev?.addEventListener('click', e => { e.stopPropagation(); setArchive(archiveIndex-1); });
  next?.addEventListener('click', e => { e.stopPropagation(); setArchive(archiveIndex+1); });
  cards.forEach((card, i) => card.addEventListener('click', () => setArchive(i, true)));
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
  lightboxPrev?.addEventListener('click', () => shiftLightbox(-1));
  lightboxNext?.addEventListener('click', () => shiftLightbox(1));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  lightbox?.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive:true });
  lightbox?.addEventListener('touchend', e => {
    const d = e.changedTouches[0].clientX - touchX;
    if (Math.abs(d) > 48) shiftLightbox(d < 0 ? 1 : -1);
  }, { passive:true });
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') shiftLightbox(-1);
    if (e.key === 'ArrowRight') shiftLightbox(1);
  });
  if (archiveItems.length) setArchive(0);

  // Trailer width fits the viewport without forcing an oversized section.
  const videoShell = $('#videoShell');
  function fitTrailer() {
    if (!videoShell) return;
    if (innerWidth <= 820) { videoShell.style.width = '100%'; return; }
    const available = Math.max(340, innerHeight - headerHeight() - 215);
    videoShell.style.width = `${Math.min(1040, available * 16 / 9)}px`;
  }
  fitTrailer();
  addEventListener('resize', fitTrailer);

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

  const motionReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    dossier.classList.remove('is-revealed');
    dossier.classList.add('is-revealing');
    setDossierValues(item);
    if (motionReduced()) {
      dossier.classList.remove('is-revealing');
      dossier.classList.add('is-revealed');
      return;
    }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      dossier.classList.remove('is-revealing');
      dossier.classList.add('is-revealed');
    }));
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

  // Keep FAQ tidy: opening one closes the others.
  $$('.faq-item').forEach(item => item.addEventListener('toggle', () => {
    if (!item.open) return;
    $$('.faq-item[open]').forEach(other => { if (other !== item) other.removeAttribute('open'); });
  }));
})();
