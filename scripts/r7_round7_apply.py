from pathlib import Path
import subprocess

BASE = 'f5e154912986c95e7f48a15bce34c707db39667c'

# ---------------------------------------------------------------------------
# js/responsive-r7.js
# - restore Round5 help sizing source (380px, profile-console aligned)
# - move the existing hero synopsis node for compact/mobile instead of cloning
#   or hardcoding copy, so RU/EN keeps one i18n source of truth.
# ---------------------------------------------------------------------------
p = Path('js/responsive-r7.js')
s = p.read_text(encoding='utf-8')

old = "      const width = Math.min(360, Math.max(260, parentRect.width - 28));"
new = "      const width = Math.min(380, Math.max(260, parentRect.width - 28));"
if s.count(old) != 1:
    raise SystemExit(f'profile-help width marker mismatch: {s.count(old)}')
s = s.replace(old, new, 1)

start_marker = "  function installMobileHeroActions() {"
end_marker = "\n\n  // Sequential FAQ / Actors"
start = s.find(start_marker)
end = s.find(end_marker, start)
if start < 0 or end < 0:
    raise SystemExit('mobile hero function markers missing')
old_func = s[start:end]
new_func = r'''  function installMobileHeroActions() {
    const hero = $('.hero-inner');
    const copy = $('.hero-copy-column', hero || document);
    const originalActions = $('.hero-actions', copy || document);
    const originalTitle = $('h1', copy || document);
    const poster = $('.hero-poster-frame', hero || document);
    const synopsis = $('.hero-copy', copy || document);
    if (!hero || !copy || !originalActions || !poster) return;

    // Keep one synopsis/i18n node. Compact/mobile repositions the real node
    // between poster and actions; desktop restores it to its original slot.
    const synopsisAnchor = synopsis ? document.createComment('r7-hero-copy-anchor') : null;
    if (synopsis && synopsisAnchor) synopsis.parentNode.insertBefore(synopsisAnchor, synopsis);

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

    const syncSynopsisPlacement = () => {
      if (!synopsis || !synopsisAnchor) return;
      const compact = isCompactMediaContext();
      synopsis.classList.toggle('r7-mobile-hero-copy', compact);
      if (compact) {
        poster.insertAdjacentElement('afterend', synopsis);
      } else if (synopsisAnchor.parentNode) {
        synopsisAnchor.parentNode.insertBefore(synopsis, synopsisAnchor.nextSibling);
      }
    };

    syncSynopsisPlacement();
    addEventListener('resize', syncSynopsisPlacement, { passive: true });
  }'''
s = s[:start] + new_func + s[end:]
p.write_text(s, encoding='utf-8')

# ---------------------------------------------------------------------------
# css/responsive-r7-owner-round2.css is the last R7 stylesheet in both public
# pages. Append a Round7 correction layer so historical Round2-6 CSS remains
# traceable while the current explicit owner decisions win the cascade.
# ---------------------------------------------------------------------------
p = Path('css/responsive-r7-owner-round2.css')
s = p.read_text(encoding='utf-8')
marker = 'OWNER VISUAL REVIEW ROUND 7 — 2026-09-16'
if marker in s:
    raise SystemExit('Round7 CSS marker already present')

add = r'''
/* ========================================================================== */
/* OWNER VISUAL REVIEW ROUND 7 — 2026-09-16                                  */
/* Corrections after real owner visual review of the green Round6 browser QA. */
/* ========================================================================== */

/* DESKTOP ACTORS / FAQ ------------------------------------------------------ */
/* Text may reveal, but structural rows/dividers stay at final coordinates. */
@media (min-width: 821px) {
  .subject-dossier .dossier-reveal > .dossier-data,
  .subject-dossier .dossier-data > div,
  .faq-response-panel .faq-system-box > div,
  .faq-response-panel .faq-response-log {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }

  .subject-dossier.is-revealing .dossier-reveal > .dossier-data,
  .subject-dossier.is-r7-crossfade-out .dossier-reveal > .dossier-data,
  .subject-dossier.is-r7-crossfade-in .dossier-reveal > .dossier-data,
  .subject-dossier.is-revealed .dossier-reveal > .dossier-data,
  .faq-response-panel.is-revealing .faq-system-box > div,
  .faq-response-panel.is-r7-crossfade-out .faq-system-box > div,
  .faq-response-panel.is-r7-crossfade-in .faq-system-box > div,
  .faq-response-panel.is-revealed .faq-system-box > div,
  .faq-response-panel.is-revealing .faq-response-log,
  .faq-response-panel.is-r7-crossfade-out .faq-response-log,
  .faq-response-panel.is-r7-crossfade-in .faq-response-log,
  .faq-response-panel.is-revealed .faq-response-log {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }

  .subject-dossier .dossier-data small,
  .subject-dossier .dossier-data strong,
  .faq-response-panel .faq-system-box > div > span,
  .faq-response-panel .faq-system-box > div > strong,
  .faq-response-panel .faq-response-log > span {
    opacity: 1;
    transform: none;
    transition: opacity .24s ease, transform .34s cubic-bezier(.2,.78,.2,1);
  }

  .subject-dossier.is-revealing .dossier-data small,
  .subject-dossier.is-revealing .dossier-data strong,
  .faq-response-panel.is-revealing .faq-system-box > div > span,
  .faq-response-panel.is-revealing .faq-system-box > div > strong,
  .faq-response-panel.is-revealing .faq-response-log > span {
    opacity: 0 !important;
    transform: translateY(9px) !important;
    transition: none !important;
  }

  .subject-dossier.is-r7-crossfade-out .dossier-data small,
  .subject-dossier.is-r7-crossfade-out .dossier-data strong,
  .faq-response-panel.is-r7-crossfade-out .faq-system-box > div > span,
  .faq-response-panel.is-r7-crossfade-out .faq-system-box > div > strong,
  .faq-response-panel.is-r7-crossfade-out .faq-response-log > span {
    opacity: .38 !important;
    transform: translateY(2px) !important;
    transition: opacity .14s ease, transform .14s ease !important;
  }

  .subject-dossier.is-r7-crossfade-in .dossier-data small,
  .subject-dossier.is-r7-crossfade-in .dossier-data strong,
  .faq-response-panel.is-r7-crossfade-in .faq-system-box > div > span,
  .faq-response-panel.is-r7-crossfade-in .faq-system-box > div > strong,
  .faq-response-panel.is-r7-crossfade-in .faq-response-log > span {
    opacity: .38 !important;
    transform: translateY(4px) !important;
    transition: none !important;
  }

  .subject-dossier.is-revealed .dossier-data small,
  .subject-dossier.is-revealed .dossier-data strong,
  .faq-response-panel.is-revealed .faq-system-box > div > span,
  .faq-response-panel.is-revealed .faq-system-box > div > strong,
  .faq-response-panel.is-revealed .faq-response-log > span {
    opacity: 1 !important;
    transform: none !important;
  }

  .subject-dossier.is-revealed .dossier-data > div:nth-child(1) > * { transition-delay: .11s !important; }
  .subject-dossier.is-revealed .dossier-data > div:nth-child(2) > * { transition-delay: .15s !important; }
  .subject-dossier.is-revealed .dossier-data > div:nth-child(3) > * { transition-delay: .19s !important; }
  .subject-dossier.is-revealed .dossier-data > div:nth-child(4) > * { transition-delay: .23s !important; }
  .faq-response-panel.is-revealed .faq-system-box > div:nth-child(1) > * { transition-delay: .11s !important; }
  .faq-response-panel.is-revealed .faq-system-box > div:nth-child(2) > * { transition-delay: .15s !important; }
  .faq-response-panel.is-revealed .faq-system-box > div:nth-child(3) > * { transition-delay: .19s !important; }
  .faq-response-panel.is-revealed .faq-system-box > div:nth-child(4) > * { transition-delay: .23s !important; }
  .faq-response-panel.is-revealed .faq-response-log > * { transition-delay: .27s !important; }
}

/* CONTACT ------------------------------------------------------------------ */
/* Keep the accepted travel path/rhythm. Remove the separate endpoint receive
   flash/fill. Mobile now uses the same travelling-point signal semantics. */
.contact-signal-track b {
  animation: none !important;
  background-color: transparent !important;
  box-shadow: none !important;
}

@media (max-width: 820px) {
  .contact-signal-track i {
    left: 0 !important;
    right: auto !important;
    width: 4px !important;
    height: 4px !important;
    margin-left: 0;
    transform: none !important;
    animation: r7Round6ContactTravel 4.4s cubic-bezier(.45,0,.24,1) infinite !important;
    will-change: margin-left, opacity, box-shadow !important;
  }
  .contact-signal-track i::after {
    content: none !important;
    display: none !important;
    animation: none !important;
  }
}
body.r7-phone-landscape .contact-signal-track i {
  left: 0 !important;
  right: auto !important;
  width: 4px !important;
  height: 4px !important;
  margin-left: 0;
  transform: none !important;
  animation: r7Round6ContactTravel 4.4s cubic-bezier(.45,0,.24,1) infinite !important;
  will-change: margin-left, opacity, box-shadow !important;
}
body.r7-phone-landscape .contact-signal-track i::after {
  content: none !important;
  display: none !important;
  animation: none !important;
}

/* ARCHIVE ------------------------------------------------------------------ */
/* The viewer's positioned ancestor was trapping the absolute shell inside the
   content grid. Desktop restores the wall-handle containing block to #materials. */
@media (min-width: 821px) {
  #materials .archive-viewer--drawer {
    position: static !important;
  }
  #materials .archive-drawer-shell {
    position: absolute !important;
    left: 0 !important;
    top: 50% !important;
    width: 0 !important;
    transform: none !important;
  }
  #materials .archive-drawer-toggle,
  #materials .archive-drawer-shell.is-open .archive-drawer-toggle {
    left: 0 !important;
  }
}

/* The owner explicitly superseded the compact/mobile ARCHIVE // 11 trigger.
   Keep gallery/swipe/lightbox; do not replace the trigger with another button. */
@media (max-width: 820px) {
  #materials .r7-mobile-archive-toggle,
  #materials .archive-drawer-shell {
    display: none !important;
  }
}
body.r7-phone-landscape #materials .r7-mobile-archive-toggle,
body.r7-phone-landscape #materials .archive-drawer-shell {
  display: none !important;
}

/* PROFILE HELP ------------------------------------------------------------- */
/* Restore the approved Round5 profile-console-aligned geometry. */
body.community-page #profileHelpPanel.profile-help-panel {
  top: var(--r7-help-top, 52px) !important;
  left: 0 !important;
  right: auto !important;
  bottom: auto !important;
  width: 100% !important;
  max-width: none !important;
  padding: 0 !important;
  background: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}
@media (min-width: 981px) {
  body.community-page #profileHelpPanel.profile-help-panel {
    left: 20px !important;
    right: 20px !important;
    width: auto !important;
  }
}
body.community-page #profileHelpPanel.profile-help-panel .info-overlay-card {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 18px 42px 18px 18px !important;
  border: 1px solid rgba(155,196,199,.34) !important;
  background: rgba(7,13,14,.97) !important;
  box-shadow: 0 16px 40px rgba(0,0,0,.40) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}
body.community-page #profileHelpPanel.profile-help-panel .info-overlay-card::before,
body.community-page #profileHelpPanel.profile-help-panel .info-overlay-card::after {
  content: none !important;
  display: none !important;
}

/* MOBILE HERO -------------------------------------------------------------- */
/* One existing i18n synopsis node is moved by JS: TITLE → POSTER → SYNOPSIS
   → ACTIONS. Desktop restores the original node and composition. */
@media (max-width: 820px) {
  .hero-inner > .r7-mobile-hero-copy {
    order: 2 !important;
    display: block !important;
    width: min(100%, 470px) !important;
    justify-self: center !important;
    margin: 22px 0 0 !important;
    padding-top: 18px !important;
    border-top: 1px solid rgba(122,151,153,.14) !important;
    font-size: 15px !important;
    line-height: 1.65 !important;
  }
  .r7-mobile-hero-actions {
    order: 3 !important;
    margin-top: 18px !important;
  }
  .hero-copy-column {
    order: 4 !important;
  }
}

body.r7-phone-landscape .hero-inner {
  display: grid !important;
  grid-template-columns: minmax(0,1fr) !important;
  grid-template-areas: none !important;
  align-items: start !important;
}
body.r7-phone-landscape .r7-mobile-hero-title {
  display: block !important;
  grid-area: auto !important;
  order: 0 !important;
  width: min(100%, 470px) !important;
  justify-self: center !important;
  margin: 2px 0 18px !important;
  font-size: clamp(42px, 11vw, 62px) !important;
  line-height: .86 !important;
  letter-spacing: -.055em !important;
}
body.r7-phone-landscape .r7-mobile-hero-title .english-title {
  margin-top: 12px !important;
  font-size: 14px !important;
  letter-spacing: .58em !important;
}
body.r7-phone-landscape .hero-poster-frame {
  grid-area: auto !important;
  order: 1 !important;
  width: min(100%, 470px) !important;
  justify-self: center !important;
}
body.r7-phone-landscape .r7-mobile-hero-copy {
  grid-area: auto !important;
  order: 2 !important;
  display: block !important;
  width: min(100%, 470px) !important;
  justify-self: center !important;
  margin: 18px 0 0 !important;
  padding-top: 16px !important;
  border-top: 1px solid rgba(122,151,153,.14) !important;
  font-size: 14px !important;
  line-height: 1.58 !important;
}
body.r7-phone-landscape .r7-mobile-hero-actions {
  grid-area: auto !important;
  order: 3 !important;
  width: min(100%, 470px) !important;
  justify-self: center !important;
  margin-top: 16px !important;
}
body.r7-phone-landscape .hero-copy-column {
  grid-area: auto !important;
  order: 4 !important;
}
body.r7-phone-landscape .hero-copy-column > h1 {
  display: none !important;
}

@media (prefers-reduced-motion: reduce) {
  .contact-signal-track i,
  body.r7-phone-landscape .contact-signal-track i {
    left: auto !important;
    right: 12px !important;
    margin-left: 0 !important;
    transform: none !important;
    animation: none !important;
    opacity: .72 !important;
    will-change: auto !important;
  }
  .contact-signal-track b {
    animation: none !important;
    background-color: transparent !important;
    box-shadow: none !important;
  }
}
'''

p.write_text(s.rstrip() + '\n\n' + add.strip() + '\n', encoding='utf-8')

allowed = {'js/responsive-r7.js', 'css/responsive-r7-owner-round2.css'}
changed = set(subprocess.check_output(['git', 'diff', '--name-only']).decode().splitlines())
if changed != allowed:
    raise SystemExit(f'unexpected runtime patch paths: {sorted(changed)}')
subprocess.run(['git', 'diff', '--check'], check=True)
print('Round7 runtime patch prepared:', ', '.join(sorted(changed)))
