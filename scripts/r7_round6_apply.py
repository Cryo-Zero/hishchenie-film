from pathlib import Path
import subprocess

# Trailer audio: deterministic application-owned initial state.
p = Path('js/site.js')
s = p.read_text(encoding='utf-8')
old = """  // Trailer starts gently. Once a visitor changes the level, remember their choice.\n  const trailerVideo = $('#trailerVideo');\n  if (trailerVideo) {\n    const storedVolume = Number(localStorage.getItem('theft_trailer_volume'));\n    trailerVideo.volume = Number.isFinite(storedVolume) && storedVolume >= 0 && storedVolume <= 1 ? storedVolume : .35;\n    trailerVideo.addEventListener('volumechange', () => {\n      try { localStorage.setItem('theft_trailer_volume', String(trailerVideo.volume)); } catch {}\n    });\n  }\n"""
new = """  // Trailer audio is deterministic and user-safe: no autoplay, explicit unmuted\n  // application state, and a restrained 30% starting level on each page entry.\n  // Native controls may change volume/mute for the current page session; we do not\n  // fight those user changes while playback is active.\n  const trailerVideo = $('#trailerVideo');\n  if (trailerVideo) {\n    const resetTrailerAudio = () => {\n      trailerVideo.removeAttribute('autoplay');\n      trailerVideo.autoplay = false;\n      trailerVideo.defaultMuted = false;\n      trailerVideo.muted = false;\n      trailerVideo.volume = .30;\n    };\n    resetTrailerAudio();\n    addEventListener('pageshow', event => { if (event.persisted) resetTrailerAudio(); });\n  }\n"""
if s.count(old) != 1:
    raise SystemExit(f'js/site.js trailer block mismatch: {s.count(old)}')
p.write_text(s.replace(old, new, 1), encoding='utf-8')

# Keep JS popover geometry aligned with the new compact help width.
p = Path('js/responsive-r7.js')
s = p.read_text(encoding='utf-8')
old = '      const width = Math.min(380, Math.max(260, parentRect.width - 28));'
new = '      const width = Math.min(360, Math.max(260, parentRect.width - 28));'
if s.count(old) != 1:
    raise SystemExit(f'js/responsive-r7.js help-width mismatch: {s.count(old)}')
p.write_text(s.replace(old, new, 1), encoding='utf-8')

p = Path('css/responsive-r7-polish.css')
s = p.read_text(encoding='utf-8')
marker = 'OWNER FEEDBACK ROUND 6 — 2026-09-16'
if marker in s:
    raise SystemExit('Round6 CSS already present unexpectedly')
add = r'''

/* ========================================================================== */
/* OWNER FEEDBACK ROUND 6 — 2026-09-16                                       */
/* Post-Round5 visual review corrections. R7 remains preview / not production. */
/* ========================================================================== */

/* Desktop CONTACT: restore deliberate point travel. The fixed diamond receives
   the point with one restrained fill/glow near arrival; no chaotic flashing. */
@media (min-width: 821px) {
  .contact-signal-track i {
    left: 0 !important;
    right: auto !important;
    width: 5px !important;
    height: 5px !important;
    transform: none !important;
    animation: r7Round6ContactTravel 4.4s cubic-bezier(.45,0,.24,1) infinite !important;
    will-change: left, opacity, box-shadow !important;
  }
  .contact-signal-track i::after {
    content: none !important;
    display: none !important;
    animation: none !important;
  }
  .contact-signal-track b {
    animation: r7Round6ContactReceive 4.4s ease-in-out infinite !important;
    will-change: background-color, border-color, box-shadow !important;
  }
}
@keyframes r7Round6ContactTravel {
  0%, 7% { left: 0; opacity: 0; box-shadow: 0 0 5px rgba(155,196,199,.20); }
  14% { opacity: .84; }
  76% { left: calc(100% - 18px); opacity: .88; }
  82% { left: calc(100% - 7px); opacity: 1; box-shadow: 0 0 12px rgba(155,196,199,.62); }
  88%, 100% { left: calc(100% - 7px); opacity: 0; box-shadow: 0 0 4px rgba(155,196,199,.12); }
}
@keyframes r7Round6ContactReceive {
  0%, 76%, 100% { background-color: transparent; border-color: rgba(155,196,199,.52); box-shadow: none; }
  82% { background-color: rgba(181,226,230,.72); border-color: rgba(220,249,250,.88); box-shadow: 0 0 13px rgba(155,196,199,.42); }
  90% { background-color: rgba(155,196,199,.08); border-color: rgba(155,196,199,.58); box-shadow: 0 0 5px rgba(155,196,199,.12); }
}

/* Materials enlarged mode: use the viewport decisively on desktop, while the
   normal Materials stage stays unchanged. Controls are geometrically clean. */
.lightbox .lightbox-close {
  width: 48px !important;
  height: 48px !important;
  min-width: 48px !important;
  min-height: 48px !important;
  padding: 0 !important;
}
@media (min-width: 821px) {
  .lightbox {
    padding: clamp(18px, 2.8vh, 30px) clamp(58px, 5.2vw, 86px) 54px !important;
  }
  .lightbox-image {
    width: auto !important;
    height: auto !important;
    max-width: calc(100vw - 132px) !important;
    max-height: calc(100dvh - 76px) !important;
  }
  .lightbox .lightbox-prev,
  .lightbox .lightbox-next {
    width: 50px !important;
    height: 50px !important;
    min-width: 50px !important;
    min-height: 50px !important;
    padding: 0 !important;
  }
}

/* Profile help: compact, button-related popover rather than a heavy composer-wide
   overlay. Text/content is untouched. */
body.community-page #profileHelpPanel.profile-help-panel {
  top: var(--r7-help-top, 52px) !important;
  left: var(--r7-help-left, 10px) !important;
  right: auto !important;
  bottom: auto !important;
  width: min(360px, calc(100% - 20px)) !important;
  max-width: 360px !important;
  padding: 0 !important;
  background: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}
body.community-page #profileHelpPanel.profile-help-panel .info-overlay-card {
  width: 100% !important;
  max-width: 360px !important;
  margin: 0 !important;
  padding: 20px 22px 19px !important;
  background: rgba(7,13,14,.985) !important;
  box-shadow: 0 14px 34px rgba(0,0,0,.42) !important;
}

/* Sequential mobile scene shells get a slower overlap. Internal staged reveal
   remains intact; no empty-screen phase and no desktop change. */
body.r7-sequential-ui #cast .cast-list,
body.r7-sequential-ui #cast .subject-dossier,
body.r7-sequential-ui #faq .faq-query-list,
body.r7-sequential-ui #faq .faq-response-panel {
  transition: opacity .38s ease, transform .48s cubic-bezier(.2,.72,.2,1), visibility 0s linear .38s !important;
}

/* Burger: keep the page scrollable while the menu is open. The existing pointer
   classifier still closes deliberate outside taps and ignores movement gestures. */
@media (max-width: 980px) {
  body.nav-open {
    overflow-x: hidden !important;
    overflow-y: auto !important;
  }
  body.nav-open .nav-links {
    padding-bottom: var(--r7-safe-bottom, 0px) !important;
    overscroll-behavior-y: auto !important;
    touch-action: pan-y !important;
  }
  body.nav-open .nav-links .r7-nav-report {
    margin-bottom: 0 !important;
  }
}

/* Smart header keeps the existing thresholds/safeguards; only the visual hide/
   reveal interpolation is softened. */
@media (max-width: 820px) {
  body.r7-smart-header .site-header {
    transition: transform .40s cubic-bezier(.22,.72,.18,1), opacity .32s ease !important;
  }
}
body.r7-phone-landscape.r7-smart-header .site-header {
  transition: transform .36s cubic-bezier(.22,.72,.18,1), opacity .28s ease !important;
}

@media (min-width: 821px) and (prefers-reduced-motion: reduce) {
  .contact-signal-track i {
    left: auto !important;
    right: 12px !important;
    animation: none !important;
    transform: none !important;
    opacity: .72 !important;
    will-change: auto !important;
  }
  .contact-signal-track b {
    animation: none !important;
    background-color: transparent !important;
    box-shadow: none !important;
    will-change: auto !important;
  }
}
'''
p.write_text(s.rstrip() + add + '\n', encoding='utf-8')

allowed = {'js/site.js','js/responsive-r7.js','css/responsive-r7-polish.css'}
changed = set(subprocess.check_output(['git','diff','--name-only']).decode().splitlines())
if changed != allowed:
    raise SystemExit(f'unexpected runtime patch paths: {sorted(changed)}')
subprocess.run(['git','diff','--check'],check=True)
