from pathlib import Path

BRANCH_BASE = "a97faa551aba14df059bec815445fd1200dc8360"

def replace_once(path, old, new, label):
    p = Path(path)
    s = p.read_text(encoding="utf-8")
    count = s.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")
    p.write_text(s.replace(old, new, 1), encoding="utf-8")

replace_once(
    "index.html",
    '<div class="archive-viewer archive-viewer--drawer" id="archiveViewer">\n<div class="archive-drawer-shell">',
    '<div class="archive-viewer archive-viewer--drawer" id="archiveViewer">\n'
    '<button aria-controls="archiveDrawer" aria-expanded="false" class="r7-mobile-archive-toggle" '
    'id="r7MobileArchiveToggle" type="button">ARCHIVE // 11</button>\n'
    '<div class="archive-drawer-shell">',
    "index mobile archive trigger",
)

replace_once(
    "index.html",
    '<div class="signal-log-row"><time>14:20</time><span data-i18n="signalLog1">Трейлер доступен</span><b data-i18n="signalNow">СЕЙЧАС</b></div>\n'
    '<div class="signal-log-row"><time>SYS</time><span data-i18n="signalLog2">Публичный архив открыт</span><b>ONLINE</b></div>\n'
    '<div class="signal-log-row"><time>2045</time><span data-i18n="signalLog3">Релиз ожидает подтверждения</span><b data-i18n="signalPending">PENDING</b></div>',
    '<div class="signal-log-row"><span class="signal-log-id">SIGNAL_03</span><span data-i18n="signalLog1">Трейлер доступен</span><b>ONLINE</b></div>\n'
    '<div class="signal-log-row"><span class="signal-log-id">ARCHIVE</span><span data-i18n="signalLog2">Публичный архив открыт</span><b>OPEN</b></div>\n'
    '<div class="signal-log-row"><span class="signal-log-id">RELEASE</span><span data-i18n="signalLog3">Релиз ожидает подтверждения</span><b data-i18n="signalPending">PENDING</b></div>',
    "index semantic signal rows",
)

old_reviews = '''          <div class="community-feed-toolbar">
            <div class="community-feed-heading">
              <div class="composer-label">PUBLIC FEED // 2045</div>
              <h2 data-i18n="reviewsTitle">Отзывы зрителей</h2>
              <div class="feed-status-line"><div class="service-badge is-checking" id="reviewServiceBadge" role="status" aria-live="polite"><i></i><span data-i18n="serviceChecking">Проверка канала</span></div><span class="feed-records" id="feedRecords">0 RECORDS // LIVE</span></div>
            </div>
            <div class="review-sort" role="group" aria-label="Review sorting">
              <button class="review-sort-button active" type="button" data-sort="new" data-i18n="latest">Новые</button>
              <button class="review-sort-button" type="button" data-sort="old" data-i18n="oldSort">Старые</button>
              <button class="review-sort-button" type="button" data-sort="popular" data-i18n="popular">Популярные</button>
            </div>
          </div>
          <div class="review-display-settings">
            <label class="lexicon-toggle" for="profanityFilterToggle">
              <span><strong data-i18n="profanityFilter">Скрывать грубую лексику</strong></span>
              <input id="profanityFilterToggle" type="checkbox" role="switch" aria-checked="false">
              <i aria-hidden="true"></i>
            </label>
          </div>'''
new_reviews = '''          <div class="r7-review-controls-dock" id="reviewControlsDock">
            <div class="community-feed-toolbar">
              <div class="community-feed-heading">
                <div class="composer-label">PUBLIC FEED // 2045</div>
                <h2 data-i18n="reviewsTitle">Отзывы зрителей</h2>
                <div class="feed-status-line"><div class="service-badge is-checking" id="reviewServiceBadge" role="status" aria-live="polite"><i></i><span data-i18n="serviceChecking">Проверка канала</span></div><span class="feed-records" id="feedRecords">0 RECORDS // LIVE</span></div>
              </div>
              <div class="review-sort" role="group" aria-label="Review sorting">
                <button class="review-sort-button active" type="button" data-sort="new" data-i18n="latest">Новые</button>
                <button class="review-sort-button" type="button" data-sort="old" data-i18n="oldSort">Старые</button>
                <button class="review-sort-button" type="button" data-sort="popular" data-i18n="popular">Популярные</button>
              </div>
            </div>
            <div class="review-display-settings">
              <label class="lexicon-toggle" for="profanityFilterToggle">
                <span><strong data-i18n="profanityFilter">Скрывать грубую лексику</strong></span>
                <input id="profanityFilterToggle" type="checkbox" role="switch" aria-checked="false">
                <i aria-hidden="true"></i>
              </label>
            </div>
          </div>'''
replace_once("reviews.html", old_reviews, new_reviews, "reviews control dock")

p = Path("js/responsive-r7.js")
js = p.read_text(encoding="utf-8")
old_active = '''    const usableHeight = Math.max(1, innerHeight - headerHeight);
    const probe = headerHeight + usableHeight * .48;
    const active = rect.top <= probe && rect.bottom >= probe;'''
new_active = '''    const usableHeight = Math.max(1, innerHeight - headerHeight);
    const probe = headerHeight + usableHeight * .48;
    const active = isCompactMediaContext()
      ? rect.bottom >= headerHeight + 24 && rect.top <= innerHeight - 24
      : rect.top <= probe && rect.bottom >= probe;'''
if js.count(old_active) != 1:
    raise SystemExit(f"responsive archive active rule expected 1, found {js.count(old_active)}")
js = js.replace(old_active, new_active, 1)

insertion_marker = '''  // MOBILE REVIEW PAGING -----------------------------------------------------
  function installMobileReviewPaging() {'''
round4_helpers = r'''  // OWNER FEEDBACK ROUND 4 ---------------------------------------------------
  // The dossier footer is a second route to the existing SUBJECT INDEX action.
  // It deliberately clicks the already-installed back control so state/focus/scroll
  // semantics cannot drift into a parallel navigation model.
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

  // Compact/phone Materials gets a horizontal control, but the real drawer keeps
  // one source of truth: the existing archiveDrawerToggle and its site.js logic.
  function installMobileArchiveControl() {
    const mobileToggle = $('#r7MobileArchiveToggle');
    if (!mobileToggle || !archiveToggle) return;

    const sync = () => {
      mobileToggle.setAttribute('aria-expanded', archiveToggle.getAttribute('aria-expanded') || 'false');
    };
    mobileToggle.addEventListener('click', () => {
      syncMaterialsArchiveVisibility();
      archiveToggle.click();
      sync();
    });
    new MutationObserver(sync).observe(archiveToggle, { attributes: true, attributeFilter: ['aria-expanded'] });
    sync();
  }

  // Phone-only smart header: direction hysteresis prevents 1–2 px touch noise
  // from toggling the header. Header interaction and an open burger always reveal it.
  const header = $('.site-header');
  const headerControl = $('#menuToggle');
  const isSmartHeaderContext = () => isCoarse() && (innerWidth <= 560 || isPhoneLandscape());
  let smartHeaderLastY = Math.max(0, scrollY);
  let smartHeaderDirection = 0;
  let smartHeaderTravel = 0;
  let smartHeaderInteractionUntil = 0;
  let smartHeaderFrame = 0;

  function revealSmartHeader() {
    body.classList.remove('r7-header-hidden');
  }

  function resetSmartHeaderTracking() {
    smartHeaderLastY = Math.max(0, scrollY);
    smartHeaderDirection = 0;
    smartHeaderTravel = 0;
  }

  function syncSmartHeader(forceVisible = false) {
    if (!header) return;
    const enabled = isSmartHeaderContext();
    body.classList.toggle('r7-smart-header', enabled);
    if (!enabled) {
      revealSmartHeader();
      resetSmartHeaderTracking();
      return;
    }

    const y = Math.max(0, scrollY);
    const interacting = performance.now() < smartHeaderInteractionUntil
      || body.classList.contains('nav-open')
      || header.matches(':focus-within');

    if (forceVisible || y <= 28 || interacting) {
      revealSmartHeader();
      resetSmartHeaderTracking();
      return;
    }

    const delta = y - smartHeaderLastY;
    smartHeaderLastY = y;
    if (Math.abs(delta) < 3) return;

    const direction = delta > 0 ? 1 : -1;
    if (direction !== smartHeaderDirection) {
      smartHeaderDirection = direction;
      smartHeaderTravel = 0;
    }
    smartHeaderTravel += Math.abs(delta);

    if (direction > 0 && y > 92 && smartHeaderTravel >= 28) {
      body.classList.add('r7-header-hidden');
      smartHeaderTravel = 0;
    } else if (direction < 0 && smartHeaderTravel >= 14) {
      revealSmartHeader();
      smartHeaderTravel = 0;
    }
  }

  function scheduleSmartHeader() {
    cancelAnimationFrame(smartHeaderFrame);
    smartHeaderFrame = requestAnimationFrame(() => syncSmartHeader(false));
  }

  function installSmartHeader() {
    if (!header) return;
    ['pointerdown', 'focusin'].forEach(type => header.addEventListener(type, () => {
      smartHeaderInteractionUntil = performance.now() + 900;
      revealSmartHeader();
      resetSmartHeaderTracking();
    }, { passive: type === 'pointerdown' }));
    headerControl?.addEventListener('click', () => {
      smartHeaderInteractionUntil = performance.now() + 1200;
      requestAnimationFrame(() => syncSmartHeader(true));
    });
    addEventListener('scroll', scheduleSmartHeader, { passive: true });
    syncSmartHeader(true);
  }

  // MOBILE REVIEW PAGING -----------------------------------------------------
  function installMobileReviewPaging() {'''
if js.count(insertion_marker) != 1:
    raise SystemExit(f"responsive round4 insertion marker expected 1, found {js.count(insertion_marker)}")
js = js.replace(insertion_marker, round4_helpers, 1)

old_apply = '''    syncInjectedNavVisibility();
    syncMaterialsArchiveVisibility();
    syncArchiveAspect();
  }'''
new_apply = '''    syncInjectedNavVisibility();
    syncMaterialsArchiveVisibility();
    syncArchiveAspect();
    syncSmartHeader(true);
  }'''
if js.count(old_apply) != 1:
    raise SystemExit(f"apply viewport marker expected 1, found {js.count(old_apply)}")
js = js.replace(old_apply, new_apply, 1)

old_install = '''  installMobileHeroActions();
  installProfileHelpPopover();
  installMobileReviewPaging();
  applyViewportClasses();'''
new_install = '''  installMobileHeroActions();
  installProfileHelpPopover();
  installSubjectPromptAction();
  installMobileArchiveControl();
  installSmartHeader();
  installMobileReviewPaging();
  applyViewportClasses();'''
if js.count(old_install) != 1:
    raise SystemExit(f"install marker expected 1, found {js.count(old_install)}")
js = js.replace(old_install, new_install, 1)
p.write_text(js, encoding="utf-8")

css_path = Path("css/responsive-r7-polish.css")
css = css_path.read_text(encoding="utf-8")
if "OWNER FEEDBACK ROUND 4 — 2026-09-11" in css:
    raise SystemExit("Round4 CSS already present")
css += r'''

/* ========================================================================== */
/* OWNER FEEDBACK ROUND 4 — 2026-09-11                                       */
/* Later owner direction intentionally supersedes selected Round3 preview      */
/* behavior while leaving historical rules above intact for traceability.      */
/* ========================================================================== */

.contact-signal-track i {
  left: auto !important;
  right: 12px !important;
  transform: translateX(0) !important;
  animation: r7ContactLocalSignal 3.2s ease-in-out infinite alternate !important;
  will-change: transform, opacity, box-shadow;
}
@keyframes r7ContactLocalSignal {
  0% { transform: translateX(0); opacity: .54; box-shadow: 0 0 7px rgba(155,196,199,.38); }
  100% { transform: translateX(-8px); opacity: .96; box-shadow: 0 0 13px rgba(155,196,199,.68); }
}

body.r7-sequential-ui #cast.r7-dossier-open .dossier-prompt.r7-subject-return {
  min-height: 44px !important;
  display: flex !important;
  align-items: center;
  width: 100%;
  padding: 8px 10px !important;
  border: 1px solid rgba(122,151,153,.18);
  background: rgba(7,13,14,.38);
  color: #9bb1b3;
  cursor: pointer;
  user-select: none;
  transition: border-color .18s ease, background .18s ease, color .18s ease;
}
body.r7-sequential-ui #cast.r7-dossier-open .dossier-prompt.r7-subject-return:hover,
body.r7-sequential-ui #cast.r7-dossier-open .dossier-prompt.r7-subject-return:focus-visible {
  border-color: rgba(189,232,237,.58);
  background: rgba(21,38,40,.58);
  color: #e3eded;
  outline: 1px solid rgba(189,232,237,.24);
  outline-offset: 2px;
}

.signal-log-row .signal-log-id {
  color: #4f6668;
  font: 500 11px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace;
  letter-spacing: 1.1px;
  margin-top: 0;
}

.r7-mobile-archive-toggle { display: none; }
@media (max-width: 820px) {
  #materials .archive-drawer-toggle { display: none !important; }
  #materials .r7-mobile-archive-toggle {
    display: inline-flex !important;
    align-items: center;
    justify-content: flex-start;
    justify-self: start;
    width: auto;
    min-width: 148px;
    min-height: 44px;
    margin: 0 0 -2px;
    padding: 0 14px;
    border: 1px solid rgba(122,151,153,.26);
    border-radius: 0;
    background: linear-gradient(90deg, rgba(13,23,24,.84), rgba(8,13,14,.62));
    color: #a8bfc1;
    font: 700 10px/1 ui-monospace,SFMono-Regular,Consolas,monospace;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    cursor: pointer;
    touch-action: manipulation;
  }
  #materials .r7-mobile-archive-toggle:hover,
  #materials .r7-mobile-archive-toggle:focus-visible,
  #materials .r7-mobile-archive-toggle[aria-expanded="true"] {
    border-color: rgba(189,232,237,.58);
    color: #e5eeee;
    background: linear-gradient(90deg, rgba(23,42,44,.88), rgba(10,18,19,.74));
    outline: none;
  }
}
body.r7-phone-landscape #materials .archive-drawer-toggle { display: none !important; }
body.r7-phone-landscape #materials .r7-mobile-archive-toggle {
  display: inline-flex !important;
  align-items: center;
  min-height: 40px;
  margin: 0 0 -4px;
  padding: 0 12px;
  border: 1px solid rgba(122,151,153,.26);
  border-radius: 0;
  background: rgba(9,16,17,.78);
  color: #a8bfc1;
  font: 700 10px/1 ui-monospace,SFMono-Regular,Consolas,monospace;
  letter-spacing: 1.5px;
  cursor: pointer;
}

.community-metric.freshness-mini .freshness-ring {
  position: relative !important;
  display: block !important;
  border-radius: 50% !important;
  aspect-ratio: 1 / 1 !important;
}
.community-metric.freshness-mini .freshness-ring-inner {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  flex-direction: column;
  align-items: center !important;
  justify-content: center !important;
  gap: 5px;
  padding: 8px !important;
  text-align: center !important;
  transform: none !important;
}
.community-metric.freshness-mini .freshness-ring-inner strong,
.community-metric.freshness-mini .freshness-ring-inner span {
  margin: 0 !important;
  text-align: center !important;
  max-width: 100% !important;
}
.community-metric.freshness-mini .freshness-ring-inner span { line-height: 1.22 !important; }

.profile-help-toggle[aria-expanded="true"] {
  border-color: rgba(189,232,237,.78) !important;
  background: rgba(26,48,51,.68) !important;
  color: #fff !important;
  transform: translateY(-1px);
}
.profile-help-panel .info-overlay-card {
  background: rgba(7,13,14,.84) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
}
.profile-help-panel .info-overlay-card::before { background: rgba(7,13,14,.84) !important; }

.r7-review-controls-dock { display: contents; }
@media (max-width: 820px) {
  body.community-page .r7-review-controls-dock {
    position: sticky;
    z-index: 46;
    top: calc(var(--header-h) + var(--r7-safe-top) + 6px);
    display: grid;
    gap: 7px;
    margin: 0 0 14px;
    padding: 9px 10px;
    border: 1px solid rgba(122,151,153,.20);
    background: rgba(7,11,12,.91);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 10px 26px rgba(0,0,0,.24);
    transition: top .24s ease, background .24s ease, box-shadow .24s ease;
  }
  body.community-page.r7-header-hidden .r7-review-controls-dock { top: 6px; }
  body.community-page .r7-review-controls-dock .community-feed-toolbar {
    margin: 0 !important;
    display: grid !important;
    gap: 7px !important;
  }
  body.community-page .r7-review-controls-dock .community-feed-heading { gap: 3px; }
  body.community-page .r7-review-controls-dock .community-feed-toolbar h2 {
    font-size: 17px !important;
    line-height: 1.05 !important;
  }
  body.community-page .r7-review-controls-dock .feed-status-line { gap: 8px; }
  body.community-page .r7-review-controls-dock .review-sort {
    width: 100%;
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0,1fr));
    gap: 5px !important;
  }
  body.community-page .r7-review-controls-dock .review-sort-button {
    min-height: 34px !important;
    padding: 6px 7px !important;
    font-size: 10px !important;
  }
  body.community-page .r7-review-controls-dock .review-display-settings {
    margin: 0 !important;
    padding-top: 7px;
    border-top: 1px solid rgba(122,151,153,.13);
  }
  body.community-page .r7-review-controls-dock .lexicon-toggle { min-height: 34px; }
}
body.r7-phone-landscape.community-page .r7-review-controls-dock {
  position: sticky;
  z-index: 46;
  top: calc(var(--header-h) + var(--r7-safe-top) + 4px);
  display: grid;
  grid-template-columns: minmax(0,1fr) auto;
  gap: 6px 10px;
  margin: 0 0 12px;
  padding: 7px 9px;
  border: 1px solid rgba(122,151,153,.20);
  background: rgba(7,11,12,.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: top .2s ease;
}
body.r7-phone-landscape.community-page.r7-header-hidden .r7-review-controls-dock { top: 4px; }
body.r7-phone-landscape.community-page .r7-review-controls-dock .community-feed-toolbar { display: contents !important; }
body.r7-phone-landscape.community-page .r7-review-controls-dock .community-feed-heading { gap: 2px; }
body.r7-phone-landscape.community-page .r7-review-controls-dock .community-feed-toolbar h2 { font-size: 15px !important; }
body.r7-phone-landscape.community-page .r7-review-controls-dock .review-sort {
  display: grid !important;
  grid-template-columns: repeat(3, auto);
  gap: 4px !important;
  align-self: center;
}
body.r7-phone-landscape.community-page .r7-review-controls-dock .review-sort-button {
  min-height: 32px !important;
  padding: 5px 7px !important;
  font-size: 9px !important;
}
body.r7-phone-landscape.community-page .r7-review-controls-dock .review-display-settings {
  grid-column: 1 / -1;
  margin: 0 !important;
  padding-top: 5px;
  border-top: 1px solid rgba(122,151,153,.13);
}

@media (max-width: 820px) {
  body.r7-smart-header .site-header {
    transition: transform .26s cubic-bezier(.2,.72,.2,1), opacity .2s ease !important;
    will-change: transform, opacity;
  }
  body.r7-smart-header.r7-header-hidden:not(.nav-open) .site-header {
    transform: translateY(calc(-100% - 2px)) !important;
    opacity: .02;
    pointer-events: none;
  }
  body.r7-smart-header.nav-open .site-header {
    transform: none !important;
    opacity: 1 !important;
    pointer-events: auto !important;
  }
}
body.r7-phone-landscape.r7-smart-header .site-header {
  transition: transform .22s cubic-bezier(.2,.72,.2,1), opacity .18s ease !important;
  will-change: transform, opacity;
}
body.r7-phone-landscape.r7-smart-header.r7-header-hidden:not(.nav-open) .site-header {
  transform: translateY(calc(-100% - 2px)) !important;
  opacity: .02;
  pointer-events: none;
}
body.r7-phone-landscape.r7-smart-header.nav-open .site-header {
  transform: none !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}

@media (max-width: 820px) {
  .signal-log-row .signal-log-id { font-size: 9px !important; }
}

@media (prefers-reduced-motion: reduce) {
  .contact-signal-track i {
    animation: none !important;
    transform: none !important;
    opacity: .78 !important;
    box-shadow: 0 0 9px rgba(155,196,199,.46) !important;
    will-change: auto;
  }
  body.r7-smart-header .site-header,
  body.r7-phone-landscape.r7-smart-header .site-header,
  body.community-page .r7-review-controls-dock,
  body.r7-phone-landscape.community-page .r7-review-controls-dock {
    transition-duration: .01ms !important;
  }
}
'''
css_path.write_text(css, encoding="utf-8")

round4_doc = r'''# REVIVAL R7 — OWNER FEEDBACK ROUND 4
+ PROJECT RULES / FUTURE ARCHITECTURE CAPTURE

Status: **IMPLEMENTED ON FEATURE BRANCH / BROWSER QA PENDING AT DOCUMENT-CREATION STEP / OWNER VISUAL REVIEW PENDING / NOT PRODUCTION**

Date: 2026-09-11
Starting verified Round3 head: `a97faa551aba14df059bec815445fd1200dc8360`

## Active owner corrections

Round4 preserves Round1–3 as history but supersedes these active preview choices:

- Round3 fixed-only CONTACT endpoint → small local reversible horizontal signal motion near the right endpoint, no full-line travel/teleport; reduced motion has no horizontal travel.
- Round3 mobile left-wall Archive trigger → compact horizontal `ARCHIVE // 11` trigger on compact/phone contexts; the existing compact drawer/index and stable `object-fit: contain` stage remain.
- Round3 Reviews normal-flow-only controls → compact sticky/following control surface inside the review-feed context. The removed profanity explanatory paragraph remains removed.
- Round3 ordinary sticky mobile site header → phone-only smart hide on meaningful downward scroll / reveal on upward scroll, with threshold/hysteresis, top visibility, burger/interacting safety and rotation reset.

Additional active corrections:

- mobile SUBJECT DOSSIER footer prompt is keyboard/touch interactive and routes to the exact existing `SUBJECT INDEX` action with no automatic page scroll;
- CURRENT SIGNAL no longer displays fabricated/ambiguous time language: rows use `SIGNAL_03 / ONLINE`, `ARCHIVE / OPEN`, `RELEASE / PENDING` around semantic RU/EN center copy;
- Reviews Freshness percentage/state is geometrically centred inside a true circle, including multi-digit/pending states;
- open profile help visibly highlights `?`; anchored popover keeps its size, becomes slightly more translucent/blurred, remains readable and does not lock/reflow the page;
- Hero synopsis text is deliberately unchanged. **OPEN VISUAL QUESTION:** mobile Hero synopsis placement requires owner/planning-chat decision. No new placement was invented in Round4.

## Implementation boundaries

Round4 is frontend + documentation only. It does **not** implement Bug Reports v2, admin Bug Reports, Telegram notifications, CAPTCHA migration/deployment, backend migration, Supabase migration, data copy, credential/end-point changes or production database writes.

## Durable future architecture captured from planning

### Planning / bridge workflow

Keep the project loop:

`discussion → owner approval → task specification → bridge implementation → bridge report → independent verification → owner visual review`

Planning may explore later ideas while bridge work is active, but those ideas must not silently expand the current bridge task.

### Review moderation / official replies — planned

- Team/admin replies originate from ADMIN PANEL, not public visitor UI.
- Future official-reply templates are clickable helpers that insert editable text into the official reply composer; clicking a template never posts automatically.
- Several common positive/neutral/constructive templates may exist; special reviews may receive individually written replies.
- Normal negative criticism stays public; low score alone is never moderation grounds.
- Severe rule-breaking text may be hidden/replaced publicly by a system marker while a genuine viewer score may remain in aggregate.
- Obvious bot/spam/manipulated/fake review may be removed entirely, including its score.
- Abusive replies may similarly be hidden/replaced by a system marker.
- Moderation history should retain reason, time, acting authorized admin/operator and internal note/history.

### Admin → public site — planned

A future admin `ОТКРЫТЬ САЙТ ↗` action may open the visitor-facing site in a new tab. Public pages must not expose moderation controls or become an intentional “admin mode”; authentication remains an admin-panel concern.

### Bug Reports v2 — accepted future direction, not implemented

Planned flow:

`public site → Bug Report form → server-verified anti-bot when required → server-side save → Supabase-compatible/Russian-hosted backend → ADMIN / BUG REPORTS → minimal Telegram alert → admin workflow`

Visitor form direction:

- single-choice category: display problem / button or function failure / slow or frozen page / reviews problem / other;
- optional details field with simple placeholder **`Что случилось?`**;
- do not use QA-jargon prompts about expected result or reproduction steps;
- optional diagnostics checkbox, unchecked by default: `Приложить техническую информацию, чтобы помочь найти ошибку`;
- if unchecked, report still submits.

Permitted optional diagnostics package:

- site build/version;
- current page/section;
- interface language;
- browser family + major version;
- OS family;
- viewport size/orientation.

Do not plan to store in the Bug Report: raw IP, physical screen resolution unless separately justified, full raw User-Agent, UUID/profile ID, cookies/localStorage, review/reply contents, phone model or unrelated profile/user information.

Success-message direction:

> Спасибо! Сообщение передано команде.  
> Вы помогаете системе становиться стабильнее.

Visitor-facing v1 does not expose internal report-status tracking.

### Bug Reports admin workflow — planned

Separate `BUG REPORTS` section with exactly four statuses:

`NEW → IN PROGRESS → FIXED → CLOSED`

Admin can open a report, see category/details/permitted optional diagnostics, change status and add internal note. Opening does **not** automatically change `NEW → IN PROGRESS`; `FIXED/CLOSED` are never inferred automatically. Status history records previous/new status, time, authorized operator and internal notes where applicable.

### Telegram notification — planned

Telegram is an alert channel, never source of truth. A new-report alert should contain only minimum data such as NEW report, report number, category and admin-open link/action. Full user-written bug text/diagnostics are not sent by default. Telegram delivery failure must never lose the safely stored report.

### CAPTCHA / anti-bot — planned

Prefer research/deployment of a Russian solution such as Yandex SmartCaptcha or another suitable Russian-hosted option; nothing is deployed by Round4.

- Verification normally appears at submit stage, not as permanent form furniture.
- A new anonymous identity must pass a server-verified human check before first review.
- Clearing cookies/new anonymous identity does not bypass protection; the new identity needs verification again.
- Editing an existing owned review normally does not repeat CAPTCHA absent abuse.
- Bug Report submission uses server-verified anti-bot/rate-limit protection.
- A fake local `Я не робот` checkbox is insufficient.
- Raw IP storage is not the primary anti-bot model.

### Privacy / raw IP — durable direction

Privacy minimization/privacy-by-design remains intentional. Application product tables/admin UI/reviews/bug reports do not store/show/attach raw IP and product identity must not be built around IP. Revisit only with explicit future approval plus legal/technical reason.

Infrastructure/providers may technically see connection IP while delivering service, so project copy must never claim that “nobody can ever see your IP.”

### Russian backend / Supabase-compatible migration research — future

Production Supabase is unchanged by Round4. First research direction is a self-hosted Supabase-compatible stack on infrastructure physically located in Russia, aiming to preserve PostgreSQL, RLS, RPC and current application/admin/community architecture. No provider is approved. A full Russian managed stack remains an alternative if self-hosted compatibility is unsuitable.

Do not migrate/copy production data or change credentials/endpoints until separately approved.

### Legal/privacy documents

FAQ `На сайте есть безопасность?` remains intentional artistic wordplay against the film phrase `В системе нет безопасности`; it is not the legal privacy notice and must not be rewritten into one.

Future legal/privacy material should be separate: personal-data/privacy policy, community rules and legally required consent/notice controls. Do not add a random alarming disclaimer under Reviews “just in case.” Community rules may later advise users not to publish their own/third-party personal information.

### Personal-data operator — provisional prerequisite

Current project assumption only: likely operator is the **author of the film**. Identity/legal details are not confirmed. Owner will clarify later. Do not publish guessed legal name/contact. The project owner explicitly says the operator will not be himself and not an ordinary site-team member; a lawyer is not automatically operator merely for providing legal assistance. Final operator identity must be confirmed before legal/privacy publication.

## Browser QA evidence

`__ROUND4_QA_EVIDENCE__`

## Gate

Round4 remains in draft PR #18, owner visual review pending, not production. Browser evidence is implementation evidence, not owner visual acceptance.
'''
Path("docs/releases/revival/R7/OWNER-FEEDBACK-ROUND4.md").write_text(round4_doc, encoding="utf-8")

def append_once(path, marker, text):
    p = Path(path)
    s = p.read_text(encoding="utf-8")
    if marker in s:
        raise SystemExit(f"{path}: marker already exists")
    p.write_text(s.rstrip() + "\n\n" + text.strip() + "\n", encoding="utf-8")

append_once("docs/releases/revival/R7/PREVIEW-HANDOFF.md", "## Owner feedback round 4 — 2026-09-11", r'''
## Owner feedback round 4 — 2026-09-11

Round4 is another owner visual-review correction pass on the same draft feature branch. Historical Round1–3 records remain above; active Round4 supersedes only the explicitly changed preview rules.

Active Round4 preview:
- CONTACT signal dot regains **small local reversible X motion** near the fixed right endpoint/diamond; no full-line travel or loop teleport; reduced-motion removes horizontal motion.
- Mobile SUBJECT DOSSIER `SELECT ANOTHER SUBJECT` prompt is now a second keyboard/touch route to the existing `SUBJECT INDEX` action, with no auto-scroll.
- CURRENT SIGNAL uses semantic identifiers `SIGNAL_03`, `ARCHIVE`, `RELEASE` and states `ONLINE`, `OPEN`, `PENDING`; no fabricated `14:20` / ambiguous `СЕЙЧАС`.
- Compact Materials uses a horizontal `ARCHIVE // 11` trigger; desktop retains the wall-handle concept. Round3 compact drawer and stable contained stage remain.
- Reviews Freshness content is geometrically centred in its true circle.
- Open profile help highlights `?`; the same anchored popover is slightly more translucent/blurred without scroll lock/reflow.
- Mobile/compact public-feed controls use a compact sticky/following feed-local dock; Round3 normal-flow-only behavior is historical/superseded.
- Phone global header uses thresholded down-hide/up-reveal; top/burger/header-interaction/rotation safeguards apply; desktop remains unchanged.
- Hero synopsis content/placement is untouched in runtime; final mobile placement remains an explicit owner/planning-chat visual question.

Future architecture captured in `OWNER-FEEDBACK-ROUND4.md` and canonical docs includes moderation/template principles, Admin→public-site boundary, Bug Reports v2/admin/Telegram, Russian CAPTCHA preference, privacy/raw-IP minimization, Russian Supabase-compatible hosting research and separate legal/privacy prerequisites. **None of those future backend/product migrations are implemented by Round4.**

Round4 remains **OWNER VISUAL REVIEW PENDING / NOT PRODUCTION**. Do not merge or describe QA as owner acceptance.
''')

append_once("docs/current/VISUAL-SYSTEM.md", "## R7 Round 4 preview refinements — owner-directed, not production", r'''
## R7 Round 4 preview refinements — owner-directed, not production

These rules supersede only the conflicting Round3 preview rules; the earlier section remains historical traceability until R7 acceptance/release cleanup.

- CONTACT endpoint diamond is fixed. The nearby dot may move only a **short local horizontal distance** with continuous eased reversible motion; no full-line travel, abrupt reset or layout-coordinate animation. Reduced motion has no horizontal travel.
- Compact Materials keeps Round3 stable stage geometry and centered `object-fit: contain`, but its phone/compact trigger is a horizontal technical `ARCHIVE // 11` control near the stage rather than the vertical wall handle. Desktop wall treatment remains the reference.
- Sequential Actors keeps no-auto-scroll semantics. `SELECT ANOTHER SUBJECT` is an interactive alternate route to the same `SUBJECT INDEX` transition, with keyboard/touch/focus support.
- CURRENT SIGNAL must use semantic system identifiers/states rather than fabricated time-like tokens.
- Freshness ring content is geometrically centred for short, multi-digit and pending/insufficient states; the calculation itself is unchanged.
- Anchored profile-help remains a popover, not fullscreen. Open `?` visibly communicates active state; popover may be slightly translucent/blurred while keeping readable contrast and zero page reflow/scroll lock.
- Compact Reviews feed controls follow the reading context through a **small feed-local sticky/following surface**. Do not return to the early oversized sticky block, and do not reduce Round4 to Round3 normal-flow-only behavior.
- Phone global site header may smart-hide on meaningful downward scroll and reveal on upward scroll, with hysteresis, top visibility, burger/header-interaction safety and rotation recovery. Desktop header behavior is unchanged.
- Mobile Hero synopsis remains present and unchanged. Its final mobile placement is an **open visual question** requiring owner/planning-chat approval; no bridge implementation may invent a new final placement.
''')

append_once("docs/current/DECISIONS.md", "## Round 4 durable planning decisions — 2026-09-11", r'''
## Round 4 durable planning decisions — 2026-09-11

### Workflow reconfirmed

The existing planning/review → explicit owner approval → bounded bridge task → bridge report → independent verification → owner visual review loop remains authoritative. Planning discussion that happens while a bridge is working does not silently expand that bridge scope.

### Community moderation / official replies

- Official/team replies are authored from the admin panel, not from public visitor UI.
- Future reply templates are composer helpers: selecting one inserts editable text and never posts automatically.
- Normal negative criticism remains public; low score alone is never moderation grounds.
- Severe rule-breaking text/replies may be hidden or replaced with a clear system moderation marker while preserving a genuine viewer score where appropriate.
- Obvious bot/spam/manipulated/fake review may be removed completely, including its score.
- Moderation history should preserve reason, timestamp, authorized actor and internal note/history.

### Admin/public boundary

A future admin `ОТКРЫТЬ САЙТ ↗` shortcut may open the public site in a new tab for inspection. Public pages remain visitor-facing and do not expose moderation controls or an intentional “admin mode.” Authentication/authorization remains an admin-panel/backend concern.

### Bug Reports v2 product direction — future, not current implementation

Bug Reports v2 is accepted as future architecture: visitor form → server-side safe storage → admin `BUG REPORTS` workflow → optional minimum Telegram alert. Four admin statuses only: `NEW`, `IN PROGRESS`, `FIXED`, `CLOSED`; opening a report never automatically advances status.

Optional diagnostics are consented per report and minimized to build, page/section, UI language, browser family+major, OS family and viewport/orientation. Do not store raw IP, physical screen resolution by default, full raw User-Agent, technical profile UUID, cookies/localStorage, review/reply contents, phone model or unrelated profile data in the report. Report submission remains possible when optional diagnostics are unchecked.

Telegram is notification-only, not source of truth, and default alerts contain minimum metadata rather than full report text/diagnostics. Delivery failure must not affect stored report integrity.

### Anti-bot / CAPTCHA direction — future

Prefer researching a Russian-hosted CAPTCHA/human-verification solution such as Yandex SmartCaptcha. Verification must be server-checked; a decorative local checkbox is insufficient. First review by each new anonymous identity requires verification; clearing local identity creates a new identity that must verify again. Editing an owned existing review normally should not repeat CAPTCHA absent abuse. Bug Reports use server-verified anti-bot/rate-limit protection. Raw IP storage is not the primary anti-bot model.

### Privacy minimization / raw IP

The product follows privacy-by-design/minimization:
- application tables do not intentionally store raw IP for reviews/bug reports;
- admin UI does not expose raw IP;
- product identity/features are not built around IP;
- this may change only after explicit future approval with legal/technical justification.

Infrastructure/service providers can technically observe connection IPs while delivering network service; public copy must not make the false absolute claim that nobody can ever see an IP.

### Russian backend research direction

Before considering a total rewrite, first research whether the current Supabase-compatible architecture can be self-hosted on infrastructure physically located in Russia while preserving PostgreSQL, RLS, RPC and existing application/admin/community logic. No provider is approved. A full Russian managed stack remains an alternative if compatibility is unsuitable. Research does not authorize migration, production data copy, endpoint/credential changes or production Supabase changes.

### FAQ wordplay and legal/privacy separation

`На сайте есть безопасность?` remains intentional artistic wordplay and must stay. It is not the legal privacy notice. Future privacy/personal-data policy, community rules and legally required consent/notices are separate documents/surfaces; do not replace the FAQ joke with legal boilerplate or add fear-inducing review disclaimers without a concrete requirement.
''')

append_once("docs/current/ROADMAP.md", "## Round 4 planning capture — responsive preview + accepted future architecture", r'''
## Round 4 planning capture — responsive preview + accepted future architecture

### R7 responsive preview — Round4

**Status:** IMPLEMENTED ON DRAFT FEATURE BRANCH / OWNER VISUAL REVIEW REQUIRED / NOT PRODUCTION.

Round4 active changes:
- local reversible CONTACT signal motion;
- interactive Actors “select another subject” alternate return route;
- semantic Current Signal row identifiers/states;
- compact horizontal mobile Archive trigger while preserving Round3 stable stage/drawer;
- centred Freshness content;
- active/lighter anchored profile help;
- compact following Reviews control dock;
- phone smart-hide/reveal global header.

Superseded active preview rules:
- Round3 fixed CONTACT dot presentation;
- Round3 normal-flow-only Reviews control behavior;
- Round3 compact/mobile vertical Archive trigger.

Still preserved:
- no auto-scroll for mobile Actors/FAQ state changes;
- Show More batching;
- profanity explanatory paragraph stays removed;
- stable Materials stage with undistorted contained assets;
- approved desktop/R6 foundation.

**Open visual question:** mobile Hero synopsis placement. Keep the approved synopsis text/content and current placement until owner/planning-chat approves a new placement.

### Admin / moderation — accepted future direction

Future admin work may add editable official-reply templates and `ОТКРЫТЬ САЙТ ↗` in a new tab, without exposing admin controls on public pages. Moderation/audit semantics follow `DECISIONS.md`: criticism/low rating is not a violation; severe prohibited text can be system-hidden while genuine rating may remain; obvious fake/spam/manipulation may be removed including score; retain action reason/time/authorized operator/internal history.

### Bug Reports v2 / Telegram — accepted future workstream

Future flow:
`visitor → Bug Report → server-verified anti-bot when required → safe backend storage → ADMIN / BUG REPORTS → minimum Telegram notification`.

Visitor fields: simple single-choice category, optional details (`Что случилось?`), optional diagnostics checkbox off by default. Planned diagnostics are minimized as defined in `DECISIONS.md`. Admin statuses are exactly `NEW / IN PROGRESS / FIXED / CLOSED`; opening does not mutate status. Telegram is only an alert path and does not carry full report text/diagnostics by default.

No Round4 backend/schema/notification implementation occurred.

### CAPTCHA / anti-bot research

Research Russian-hosted verification, with Yandex SmartCaptcha a preferred candidate to evaluate. Submission-time server verification is the direction for first review on a new anonymous identity and future Bug Reports. No CAPTCHA deployment/migration is authorized by this planning record.

### Russian-hosted backend research

Create a future research phase for a self-hosted Supabase-compatible stack physically hosted in Russia, prioritizing preservation of PostgreSQL/RLS/RPC/application architecture. Compare with a full Russian managed-stack alternative only after compatibility/operations/legal requirements are understood. No provider, migration, production copy, credential or endpoint change is approved yet.

### Legal/privacy prerequisites

Future legal/privacy publication is separate from the artistic FAQ and should cover the personal-data/privacy policy, community rules and any required consent/notice controls.

**Unresolved prerequisite:** likely personal-data operator is the film author, but legal identity/contact are not confirmed. Owner will clarify later. Do not publish guessed operator details; the owner states it is not himself and not an ordinary site-team member, and a lawyer is not automatically the operator.

### Next gate

Owner/planning-chat visual review of Round4 browser evidence. Do not merge R7 or start the future Bug Reports/CAPTCHA/backend/legal implementation work merely because the architecture is documented.
''')

append_once("docs/current/BACKLOG.md", "### Round 4 — accepted future items requiring separate implementation authorization", r'''
### Round 4 — accepted future items requiring separate implementation authorization

The older Bug Reports v2 sketch above remains historical. The more specific planning direction below supersedes conflicting details such as the old candidate `CHECKING` status; this is still **future work, not permission to implement now**.

- Bug Reports v2: simple category + optional `Что случилось?` details + optional diagnostics opt-in; server-side safe storage; admin `BUG REPORTS`; statuses exactly `NEW / IN PROGRESS / FIXED / CLOSED`; minimum Telegram alert; no automatic status advance on open.
- Anti-bot: evaluate Russian-hosted server-verified solutions, with Yandex SmartCaptcha a preferred research candidate; no fake local-only “I am not a robot” control.
- Admin moderation: editable reply templates that never auto-post, audit/history, and optional `ОТКРЫТЬ САЙТ ↗` shortcut without public admin mode.
- Russian backend research: first evaluate self-hosted Supabase compatibility on infrastructure physically in Russia; full Russian managed stack remains an alternative. No provider/migration is approved.
- Legal/privacy: separate personal-data/privacy policy + community rules/required consent surfaces; preserve FAQ `На сайте есть безопасность?` as artistic content.
- Legal prerequisite: confirm the actual personal-data operator identity/contact before publication; current “film author” assumption is provisional only.
''')

print("Round4 patch prepared")
