(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);

  function reorderNavigation() {
    const nav = $('#primaryNav');
    if (!nav) return;
    const links = [...nav.querySelectorAll('a')];
    const cast = links.find(a => (a.getAttribute('href') || '').includes('#cast'));
    const faq = links.find(a => (a.getAttribute('href') || '').includes('#faq'));
    const reviews = links.find(a => (a.getAttribute('href') || '').includes('reviews'));
    const report = $('.r7-nav-report', nav);
    if (!cast || !faq || !reviews) return;
    cast.insertAdjacentElement('afterend', faq);
    faq.insertAdjacentElement('afterend', reviews);
    if (report) reviews.insertAdjacentElement('afterend', report);
  }
  reorderNavigation();

  const video = $('#trailerVideo');
  const shell = $('#videoShell');
  const controls = $('.r7-player-controls', shell || document);
  if (!video || !shell || !controls) return;
  shell.classList.add('r7-followup-player');

  const progress = $('.r7-player-progress', controls);
  const volume = $('.r7-player-volume', controls);
  const pip = $('.r7-player-pip', controls);
  const fullscreen = $('.r7-player-fullscreen', controls);
  const compact = matchMedia('(max-width: 820px), (pointer: coarse) and (max-height: 560px)');
  let trailerContextActive = false;

  function syncRangeFill(input, maxOverride) {
    if (!input) return;
    const min = Number(input.min || 0);
    const max = Number(maxOverride ?? input.max ?? 100);
    const value = Number(input.value || 0);
    const pct = max > min ? Math.max(0, Math.min(100, (value - min) / (max - min) * 100)) : 0;
    input.style.setProperty('--r7-range-fill', `${pct}%`);
  }
  function syncRanges() {
    syncRangeFill(progress, 100);
    syncRangeFill(volume, 1);
  }
  function syncMode() {
    shell.classList.add('r7-followup-player', 'r7-custom-player-ready');
    controls.hidden = false;
    video.controls = false;
    video.setAttribute('controlsList', 'nodownload noplaybackrate noremoteplayback');
    video.disablePictureInPicture = compact.matches;
    if (pip) pip.hidden = compact.matches || pip.hidden;
    syncRanges();
  }

  const isFullscreen = () => document.fullscreenElement === shell || document.webkitFullscreenElement === shell;
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) await exit.call(document);
        return;
      }
      if (shell.requestFullscreen) await shell.requestFullscreen();
      else if (shell.webkitRequestFullscreen) await shell.webkitRequestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    } catch (_) {}
  }

  const editable = target => target && (target.matches?.('input,textarea,select,[contenteditable="true"]') || target.closest?.('[contenteditable="true"]'));
  shell.addEventListener('pointerdown', () => { trailerContextActive = true; }, { passive: true });
  shell.addEventListener('focusin', () => { trailerContextActive = true; });
  document.addEventListener('pointerdown', event => {
    if (!shell.contains(event.target)) trailerContextActive = false;
  }, true);
  document.addEventListener('focusin', event => {
    if (!shell.contains(event.target)) trailerContextActive = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key.toLowerCase() !== 'f' || !trailerContextActive || editable(event.target)) return;
    event.preventDefault();
    toggleFullscreen();
  });
  video.addEventListener('dblclick', event => {
    event.preventDefault();
    trailerContextActive = true;
    toggleFullscreen();
  });
  fullscreen?.addEventListener('click', () => { trailerContextActive = true; });

  progress?.addEventListener('input', syncRanges);
  volume?.addEventListener('input', syncRanges);
  video.addEventListener('timeupdate', syncRanges);
  video.addEventListener('loadedmetadata', syncRanges);
  video.addEventListener('volumechange', syncRanges);
  document.addEventListener('fullscreenchange', () => { shell.classList.toggle('r7-is-fullscreen', isFullscreen()); syncMode(); });
  document.addEventListener('webkitfullscreenchange', () => { shell.classList.toggle('r7-is-fullscreen', isFullscreen()); syncMode(); });
  compact.addEventListener?.('change', syncMode);
  addEventListener('resize', syncMode, { passive: true });
  requestAnimationFrame(syncMode);
})();
