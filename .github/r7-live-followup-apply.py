from pathlib import Path
import re
import subprocess

BASE = "4e16c09f9704f634e443efadf042e3516465201a"
RUNTIME_PATHS = ["index.html", "reviews.html", "admin", "assets", "css", "js", "supabase", "migrations"]

subprocess.run(["git", "fetch", "origin", "main"], check=True)
main = subprocess.check_output(["git", "rev-parse", "origin/main"], text=True).strip()
assert main == BASE, (main, BASE)
subprocess.run(["git", "diff", "--exit-code", BASE, "HEAD", "--", *RUNTIME_PATHS], check=True)

# 1) Shared Actors/FAQ staged reveal: slower, reversible, stationary structure.
p = Path("js/site.js")
s = p.read_text()
needle = """  // Keep the old state visible while it softens. The new state is written
  // only after that short fade and starts partially visible, avoiding an
  // empty-panel flash while still reading as one continuous transformation.
  panel.classList.add('is-r7-crossfade-out');
  panel._theftRevealTimer = setTimeout(() => {
    if (typeof writeValues === 'function') writeValues();
    panel.classList.remove('is-r7-crossfade-out');
    panel.classList.add('is-r7-crossfade-in');
    void panel.offsetWidth;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      panel.classList.remove('is-r7-crossfade-in');
      panel.classList.add('is-revealed');
    }));
  }, 140);
"""
replacement = """  // Reverse-draw the current record first. Swap semantic values only after the
  // old record has visually cleared, then draw the new record back in. Geometry stays fixed.
  panel.classList.add('is-r7-crossfade-out');
  panel._theftRevealTimer = setTimeout(() => {
    if (typeof writeValues === 'function') writeValues();
    panel.classList.remove('is-r7-crossfade-out');
    panel.classList.add('is-r7-crossfade-in');
    void panel.offsetWidth;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      panel.classList.remove('is-r7-crossfade-in');
      panel.classList.add('is-revealed');
    }));
  }, 320);
"""
assert s.count(needle) == 1, ("site staged reveal", s.count(needle))
s = s.replace(needle, replacement)
p.write_text(s)

# 2) Mobile Actors/FAQ: semantic state transition only. No min-height fabrication and no scrollTo restoration.
p = Path("js/responsive-r7.js")
s = p.read_text()
a = s.index("  // Sequential FAQ / Actors --------------------------------------------------")
b = s.index("  // PROFILE HELP -------------------------------------------------------------")
sequential = r'''  // Sequential FAQ / Actors --------------------------------------------------
  // Follow-up contract: never force viewport coordinates or fabricate a temporary
  // height. Keep the real detail state alive for its reverse reveal, then switch to
  // the real index geometry. Focus restoration uses preventScroll only.
  const reverseRevealMs = 340;

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
    let closeTimer = 0;

    const finishClose = () => {
      const selected = items.find(item => item.getAttribute('aria-selected') === 'true') || null;
      if (selected) return;
      cast.classList.remove('r7-dossier-open');
      const target = cast._r7SequenceFocusTarget;
      cast._r7SequenceFocusTarget = null;
      requestAnimationFrame(() => target?.focus({ preventScroll: true }));
    };

    const back = dossier ? makeBackButton('SUBJECT INDEX', 'r7-subject-back') : null;
    if (back && dossier && !$('.r7-subject-back', dossier)) {
      dossier.insertBefore(back, topline || dossier.firstChild);
      back.addEventListener('click', () => {
        cast._r7SequenceFocusTarget = lastSelected || items[0];
        close?.click();
      });
    }

    function syncCast() {
      const selected = items.find(item => item.getAttribute('aria-selected') === 'true') || null;
      clearTimeout(closeTimer);
      if (selected) {
        cast.classList.add('r7-dossier-open');
        lastSelected = selected;
        return;
      }
      if (!cast.classList.contains('r7-dossier-open')) return;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) finishClose();
      else closeTimer = setTimeout(finishClose, reverseRevealMs);
    }

    items.forEach(item => item.addEventListener('click', () => queueMicrotask(syncCast)));
    close?.addEventListener('click', () => queueMicrotask(syncCast));
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
    let closeTimer = 0;

    const finishClose = () => {
      const selected = items.find(item => item.getAttribute('aria-selected') === 'true') || null;
      if (selected) return;
      faq.classList.remove('r7-response-open');
      const target = faq._r7SequenceFocusTarget;
      faq._r7SequenceFocusTarget = null;
      requestAnimationFrame(() => target?.focus({ preventScroll: true }));
    };

    const back = panel ? makeBackButton('QUERY INDEX', 'r7-query-back') : null;
    if (back && panel && !$('.r7-query-back', panel)) {
      panel.insertBefore(back, header || panel.firstChild);
      back.addEventListener('click', () => {
        faq._r7SequenceFocusTarget = lastSelected || items[0];
        close?.click();
      });
    }

    function syncFaq() {
      const selected = items.find(item => item.getAttribute('aria-selected') === 'true') || null;
      clearTimeout(closeTimer);
      if (selected) {
        faq.classList.add('r7-response-open');
        lastSelected = selected;
        return;
      }
      if (!faq.classList.contains('r7-response-open')) return;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) finishClose();
      else closeTimer = setTimeout(finishClose, reverseRevealMs);
    }

    items.forEach(item => item.addEventListener('click', () => queueMicrotask(syncFaq)));
    close?.addEventListener('click', () => queueMicrotask(syncFaq));
    const observer = new MutationObserver(syncFaq);
    items.forEach(item => observer.observe(item, { attributes: true, attributeFilter: ['aria-selected', 'class'] }));
    if (panel) observer.observe(panel, { attributes: true, attributeFilter: ['class'] });
    syncFaq();
  }

'''
s = s[:a] + sequential + s[b:]

a = s.index("  // OWNER FEEDBACK ROUND 4 ---------------------------------------------------")
b = s.index("  // Compact/phone Materials gets a horizontal control")
prompt = r'''  // OWNER FOLLOW-UP — dossier footer uses the same semantic back action.
  function installSubjectPromptAction() {
    const cast = $('#cast');
    const prompt = $('#dossierPrompt', cast || document);
    if (!cast || !prompt) return;

    const sync = () => {
      const actionable = isSequentialContext() && cast.classList.contains('r7-dossier-open');
      prompt.classList.toggle('r7-subject-return', actionable);
      if (actionable) {
        prompt.setAttribute('role', 'button');
        prompt.setAttribute('tabindex', '0');
        prompt.setAttribute('aria-label', document.documentElement.lang === 'en'
          ? 'Return to subject index'
          : 'Вернуться к списку субъектов');
      } else {
        prompt.removeAttribute('role');
        prompt.removeAttribute('tabindex');
        prompt.removeAttribute('aria-label');
      }
    };

    const activate = event => {
      if (!prompt.classList.contains('r7-subject-return')) return;
      if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
      if (event.type === 'keydown') event.preventDefault();
      $('.r7-subject-back', cast)?.click();
    };

    prompt.addEventListener('click', activate);
    prompt.addEventListener('keydown', activate);
    new MutationObserver(sync).observe(cast, { attributes: true, attributeFilter: ['class'] });
    addEventListener('theft:language', sync, { passive: true });
    addEventListener('resize', sync, { passive: true });
    sync();
  }

'''
s = s[:a] + prompt + s[b:]
p.write_text(s)

# 3) HTML: remove horizontal progress, load final bounded layer on both pages.
for name in ("index.html", "reviews.html"):
    p = Path(name)
    s = p.read_text()
    s, removed = re.subn(r'\s*<div[^>]*class="scroll-progress"[^>]*id="scrollProgress"[^>]*></div>\s*', '\n', s, count=1)
    assert removed == 1, (name, "horizontal progress", removed)
    css_anchor = '<link rel="stylesheet" href="css/r7-owner-corrections.css?v=r7-owner-20260916b">'
    if css_anchor not in s:
      css_anchor = '<link href="css/r7-owner-corrections.css?v=r7-owner-20260916b" rel="stylesheet"/>'
    assert css_anchor in s, (name, "owner css anchor")
    css_follow = '<link rel="stylesheet" href="css/r7-live-followup.css?v=20260917-final">'
    if css_follow not in s:
      s = s.replace(css_anchor, css_anchor + '\n' + css_follow, 1)
    js_follow = '<script src="js/r7-live-followup.js?v=20260917-final"></script>'
    if js_follow not in s:
      owner_js = '<script src="js/r7-owner-corrections.js?v=r7-owner-20260916b"></script>'
      responsive_js = '<script src="js/responsive-r7.js?v=r7-owner-20260911a"></script>'
      anchor = owner_js if owner_js in s else responsive_js
      assert anchor in s, (name, "script anchor")
      s = s.replace(anchor, anchor + '\n' + js_follow, 1)
    p.write_text(s)

# 4) Final visual layer.
Path("css/r7-live-followup.css").write_text(r'''/* R7 LIVE FOLLOW-UP — owner-approved PC + mobile corrections, 2026-09-17. */
.scroll-progress{display:none!important}
#cast,#faq,body.r7-sequential-ui #cast .cast-console,body.r7-sequential-ui #faq .faq-console{overflow-anchor:none!important}
.subject-dossier .dossier-data small,.subject-dossier .dossier-data strong,.subject-dossier .dossier-subject,.subject-dossier .dossier-prompt,.faq-response-panel .faq-system-box>div>span,.faq-response-panel .faq-system-box>div>strong,.faq-response-panel .faq-response-log>span,.faq-response-panel .faq-response-content>h3,.faq-response-panel .faq-response-content>p{transform:none!important;transition-property:opacity,clip-path!important;transition-duration:.48s,.52s!important;transition-timing-function:linear,cubic-bezier(.2,.72,.2,1)!important}
.subject-dossier.is-r7-crossfade-out .dossier-data small,.subject-dossier.is-r7-crossfade-out .dossier-data strong,.subject-dossier.is-r7-crossfade-out .dossier-subject,.subject-dossier.is-r7-crossfade-out .dossier-prompt,.faq-response-panel.is-r7-crossfade-out .faq-system-box>div>span,.faq-response-panel.is-r7-crossfade-out .faq-system-box>div>strong,.faq-response-panel.is-r7-crossfade-out .faq-response-log>span,.faq-response-panel.is-r7-crossfade-out .faq-response-content>h3,.faq-response-panel.is-r7-crossfade-out .faq-response-content>p{opacity:.04!important;clip-path:inset(0 0 100% 0)!important;transition-duration:.30s,.32s!important;transition-delay:0s!important}
.subject-dossier.is-r7-crossfade-in .dossier-data small,.subject-dossier.is-r7-crossfade-in .dossier-data strong,.subject-dossier.is-r7-crossfade-in .dossier-subject,.subject-dossier.is-r7-crossfade-in .dossier-prompt,.faq-response-panel.is-r7-crossfade-in .faq-system-box>div>span,.faq-response-panel.is-r7-crossfade-in .faq-system-box>div>strong,.faq-response-panel.is-r7-crossfade-in .faq-response-log>span,.faq-response-panel.is-r7-crossfade-in .faq-response-content>h3,.faq-response-panel.is-r7-crossfade-in .faq-response-content>p{opacity:.04!important;clip-path:inset(0 0 100% 0)!important;transition:none!important}
.subject-dossier.is-revealed .dossier-data>div:nth-child(1)>*,.faq-response-panel.is-revealed .faq-system-box>div:nth-child(1)>*{transition-delay:.02s!important}.subject-dossier.is-revealed .dossier-data>div:nth-child(2)>*,.faq-response-panel.is-revealed .faq-system-box>div:nth-child(2)>*{transition-delay:.07s!important}.subject-dossier.is-revealed .dossier-data>div:nth-child(3)>*{transition-delay:.12s!important}.subject-dossier.is-revealed .dossier-data>div:nth-child(4)>*{transition-delay:.17s!important}.faq-response-panel.is-revealed .faq-response-content>h3{transition-delay:.08s!important}.faq-response-panel.is-revealed .faq-response-content>p{transition-delay:.14s!important}.subject-dossier.is-r7-crossfade-out *,.faq-response-panel.is-r7-crossfade-out *{transition-delay:0s!important}
@media(max-width:820px){body.r7-sequential-ui #cast.r7-dossier-open .subject-dossier,body.r7-sequential-ui #cast:not(.r7-dossier-open) .cast-list,body.r7-sequential-ui #faq.r7-response-open .faq-response-panel,body.r7-sequential-ui #faq:not(.r7-response-open) .faq-query-list{animation:r7FollowupSemanticReveal .36s linear both!important}}
body.r7-phone-landscape #cast.r7-dossier-open .subject-dossier,body.r7-phone-landscape #cast:not(.r7-dossier-open) .cast-list,body.r7-phone-landscape #faq.r7-response-open .faq-response-panel,body.r7-phone-landscape #faq:not(.r7-response-open) .faq-query-list{animation:r7FollowupSemanticReveal .36s linear both!important}
@keyframes r7FollowupSemanticReveal{from{opacity:.18;clip-path:inset(0 0 5% 0)}to{opacity:1;clip-path:inset(0)}}
.video-shell.r7-followup-player .r7-player-controls{padding:48px 16px 12px!important;background:linear-gradient(to top,rgba(2,5,6,.92),rgba(2,5,6,.52) 55%,transparent)!important}.r7-player-progress-row{margin-bottom:6px!important}.r7-player-row{gap:14px!important}.r7-player-left,.r7-player-right{gap:6px!important}.r7-player-button{width:40px!important;height:40px!important;min-width:40px!important;border:0!important;background:transparent!important;box-shadow:none!important;border-radius:2px}.r7-player-button:hover,.r7-player-button:focus-visible{border:0!important;background:rgba(155,196,199,.09)!important;box-shadow:none!important;outline:1px solid rgba(155,196,199,.38)!important;outline-offset:-3px}.r7-player-time{min-width:86px!important;color:#c1cecf!important}.r7-player-range{height:26px!important}.r7-player-range::-webkit-slider-runnable-track{height:2px!important;background:linear-gradient(90deg,#9bc4c7 0 var(--r7-range-fill,0%),rgba(155,196,199,.28) var(--r7-range-fill,0%) 100%)!important}.r7-player-range::-moz-range-track{height:2px!important;background:rgba(155,196,199,.28)!important}.r7-player-range::-moz-range-progress{height:2px!important;background:#9bc4c7!important}.r7-player-range::-webkit-slider-thumb{width:9px!important;height:9px!important;margin-top:-3.5px!important;background:#d4e4e5!important}.r7-player-range::-moz-range-thumb{width:9px!important;height:9px!important;background:#d4e4e5!important}.r7-player-volume{width:88px!important}.r7-player-glyph{width:16px!important;height:16px!important}
.video-shell.r7-followup-player:fullscreen,.video-shell.r7-followup-player:-webkit-full-screen{width:100vw!important;height:100vh!important;max-width:none!important;max-height:none!important;margin:0!important;padding:0!important;background:#000!important;display:grid!important;place-items:center!important}.video-shell.r7-followup-player:fullscreen video,.video-shell.r7-followup-player:-webkit-full-screen video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:contain!important;background:#000!important}.video-shell.r7-followup-player:fullscreen .r7-player-controls,.video-shell.r7-followup-player:-webkit-full-screen .r7-player-controls{position:absolute!important;left:0!important;right:0!important;bottom:0!important;width:100%!important;z-index:20!important}
.contact-signal-track i{animation:r7ContactTravel 4.15s linear infinite!important;box-shadow:0 0 8px rgba(155,196,199,.42)!important}.contact-signal::before,.contact-signal-track b,.contact-signal-track i::after{display:none!important;content:none!important;animation:none!important}@keyframes r7ContactTravel{0%{left:0;opacity:.18}7%{opacity:1}93%{opacity:1}100%{left:calc(100% - 5px);opacity:.18}}
@media(max-width:820px){
  .hero-inner>.r7-mobile-hero-copy{margin-top:20px!important;padding-top:0!important;border-top:0!important}.hero-inner>.r7-mobile-hero-actions{margin-top:14px!important;row-gap:6px!important}.hero{padding-bottom:28px!important}
  .review-composer .rating-scale{grid-template-columns:repeat(12,minmax(0,1fr))!important;gap:6px!important}.review-composer .rating-button{grid-column:span 2!important;width:100%!important;min-width:0!important}.review-composer .rating-button:nth-child(7){grid-column:2/span 2!important}.review-composer .rating-button:last-child{grid-column:span 2!important}
  .system-rail{display:grid!important;right:max(4px,env(safe-area-inset-right,0px))!important;top:50%!important;gap:6px!important;font-size:6px!important;letter-spacing:.65px!important;opacity:.7!important}.system-rail .rail-status{display:none!important}.system-rail .rail-track{height:min(28svh,150px)!important}.system-rail .rail-section{max-height:94px;overflow:hidden;color:#789294!important}
  .video-shell.r7-followup-player .r7-player-controls{display:block!important;padding:38px 9px 8px!important}.video-shell.r7-followup-player .r7-player-row{gap:4px!important}.video-shell.r7-followup-player .r7-player-left,.video-shell.r7-followup-player .r7-player-right{gap:2px!important}.video-shell.r7-followup-player .r7-player-button{width:42px!important;height:42px!important;min-width:42px!important}.video-shell.r7-followup-player .r7-player-time{min-width:78px!important;font-size:8px!important}.video-shell.r7-followup-player .r7-player-volume,.video-shell.r7-followup-player .r7-player-pip{display:none!important}.video-shell.r7-followup-player .r7-player-progress-row{margin-bottom:2px!important}
}
body.r7-phone-landscape .hero-inner>.r7-mobile-hero-copy{margin-top:12px!important}body.r7-phone-landscape .hero-inner>.r7-mobile-hero-actions{margin-top:9px!important}body.r7-phone-landscape .system-rail{right:max(3px,env(safe-area-inset-right,0px))!important}.r7-phone-landscape .system-rail .rail-track{height:min(34svh,112px)!important}
@media(max-width:430px){.system-rail{opacity:.58!important}.system-rail .rail-section{font-size:5px!important}.video-shell.r7-followup-player .r7-player-time{min-width:66px!important;font-size:7px!important}}
@media(prefers-reduced-motion:reduce){.subject-dossier *,.faq-response-panel *{transition:none!important}.contact-signal-track i{animation:none!important;left:50%!important}.r7-phone-landscape #cast .cast-list,.r7-phone-landscape #cast .subject-dossier,.r7-phone-landscape #faq .faq-query-list,.r7-phone-landscape #faq .faq-response-panel{animation:none!important}}
''')

# 5) Runtime behavior layer: navigation order, responsive custom trailer, fullscreen interactions.
Path("js/r7-live-followup.js").write_text(r'''(() => {
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
''')

# Remove temporary apply tooling from the resulting product commit. Historical runs remain in GitHub.
Path(".github/r7-live-followup-apply.py").unlink(missing_ok=True)
Path(".github/workflows/r7-live-followup-apply.yml").unlink(missing_ok=True)
