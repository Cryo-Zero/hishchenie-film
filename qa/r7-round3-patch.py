from pathlib import Path

BASE = 'e5a5c26ff9be2ff7d845cbf8f14de77ef5ed83db'
css_path = Path('css/responsive-r7-polish.css')
css = css_path.read_text(encoding='utf-8')
marker = '/* OWNER FEEDBACK ROUND 3 — 2026-09-11 */'
if marker in css:
    raise SystemExit('Round3 CSS marker already exists')

old_reviews = '''/* Reviews header must remain available while reading the long public feed. */
@media (max-width: 980px) {
  body.community-page .site-header {
    position: fixed !important;
    inset: 0 0 auto 0 !important;
    width: 100% !important;
    z-index: 180 !important;
  }
  body.community-page main {
    padding-top: calc(var(--header-h) + var(--r7-safe-top)) !important;
  }
}
'''
if old_reviews not in css:
    raise SystemExit('Expected Round2 Reviews fixed-header block not found')
css = css.replace(old_reviews, '''/* Round2 historical note: Reviews once kept a special fixed mobile header.
   Round3 owner feedback supersedes that behavior; feed controls now use normal flow. */
''', 1)

old_archive = '''/* Mobile media uses the selected asset's own aspect ratio. This prevents the
   desktop 16:9 media footprint from making portrait posters look tiny. */
@media (max-width: 820px) {
  #materials .archive-stage-wrap {
    position: relative !important;
    display: block !important;
    width: 100% !important;
  }
  #materials .archive-stage {
    width: 100% !important;
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    aspect-ratio: var(--r7-archive-aspect, 4 / 5) !important;
  }
  #materials .archive-stage img {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
  }
  #materials .archive-stage-wrap .gallery-button {
    position: absolute !important;
    z-index: 6 !important;
    top: 50% !important;
    width: 42px !important;
    height: 58px !important;
    min-height: 58px !important;
    transform: translateY(-50%) !important;
  }
  #materials .archive-stage-wrap .gallery-button.prev { left: 6px !important; }
  #materials .archive-stage-wrap .gallery-button.next { right: 6px !important; }
}
'''
if old_archive not in css:
    raise SystemExit('Expected Round2 aspect-driven Archive block not found')
css = css.replace(old_archive, '''/* Round2 historical note: compact Archive stage previously followed each
   asset's natural aspect ratio. Round3 owner feedback requires stable stage geometry. */
@media (max-width: 820px) {
  #materials .archive-stage-wrap {
    position: relative !important;
    display: block !important;
    width: 100% !important;
  }
  #materials .archive-stage {
    width: 100% !important;
    height: clamp(320px, 56dvh, 500px) !important;
    min-height: 0 !important;
    max-height: 500px !important;
    aspect-ratio: auto !important;
  }
  #materials .archive-stage img {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
    object-position: center !important;
  }
  #materials .archive-stage-wrap .gallery-button {
    position: absolute !important;
    z-index: 6 !important;
    top: 50% !important;
    width: 42px !important;
    height: 58px !important;
    min-height: 58px !important;
    transform: translateY(-50%) !important;
  }
  #materials .archive-stage-wrap .gallery-button.prev { left: 6px !important; }
  #materials .archive-stage-wrap .gallery-button.next { right: 6px !important; }
}
''', 1)

css += r'''

/* OWNER FEEDBACK ROUND 3 — 2026-09-11 */

/* Reviews: public-feed controls leave the viewport in normal document flow.
   The global R7 site header keeps its ordinary sticky behavior; there is no
   Reviews-only fixed header mode. */
@media (max-width: 980px) {
  body.community-page .site-header {
    position: sticky !important;
    top: 0 !important;
    right: auto !important;
    bottom: auto !important;
    left: auto !important;
    width: 100% !important;
  }
  body.community-page main { padding-top: 0 !important; }
  body.community-page .community-feed-toolbar,
  body.community-page .review-display-settings,
  body.community-page .review-sort {
    position: static !important;
    inset: auto !important;
    transform: none !important;
  }
}

/* Keep the profanity toggle, remove only its explanatory copy from presentation. */
.lexicon-toggle small[data-i18n="profanityFilterHint"] { display: none !important; }

/* Compact Materials-local Archive drawer. */
@media (max-width: 820px) {
  #materials .archive-drawer-shell {
    --archive-drawer-width: min(76vw, 300px) !important;
    height: min(58dvh, 560px) !important;
  }
  #materials .archive-drawer {
    height: min(58dvh, 560px) !important;
    max-height: 58dvh !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
  }
  #materials .archive-drawer-head {
    flex: 0 0 auto !important;
    margin-bottom: 10px !important;
  }
  #materials .archive-drawer-grid {
    flex: 1 1 auto !important;
    min-height: 0 !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    overscroll-behavior: contain !important;
    scrollbar-width: thin;
  }
  #materials .archive-drawer-toggle {
    width: 40px !important;
    min-width: 40px !important;
    height: 76px !important;
    min-height: 76px !important;
    max-height: 76px !important;
  }
}

/* Phone landscape is width-wide but height-starved, so it needs its own drawer
   constraints rather than inheriting portrait max-width rules. */
body.r7-phone-landscape #materials .archive-drawer-shell {
  --archive-drawer-width: min(70vw, 290px) !important;
  height: clamp(190px, 56dvh, 250px) !important;
}
body.r7-phone-landscape #materials .archive-drawer {
  height: clamp(190px, 56dvh, 250px) !important;
  max-height: 56dvh !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
}
body.r7-phone-landscape #materials .archive-drawer-head {
  flex: 0 0 auto !important;
  margin-bottom: 8px !important;
}
body.r7-phone-landscape #materials .archive-drawer-grid {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  overscroll-behavior: contain !important;
  scrollbar-width: thin;
}
body.r7-phone-landscape #materials .archive-drawer-toggle {
  width: 38px !important;
  min-width: 38px !important;
  height: 72px !important;
  min-height: 72px !important;
  max-height: 72px !important;
}
body.r7-phone-landscape #materials .archive-stage {
  height: clamp(220px, 58dvh, 300px) !important;
  min-height: 0 !important;
  max-height: 300px !important;
  aspect-ratio: auto !important;
}
body.r7-phone-landscape #materials .archive-stage img {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
  object-position: center !important;
}

/* CONTACT: fixed endpoint dot; only opacity/glow pulse, no X travel. */
.contact-signal-track i {
  left: auto !important;
  right: 12px !important;
  transform: none !important;
  animation: r7ContactEndpointPulse 2.8s ease-in-out infinite !important;
}
@keyframes r7ContactEndpointPulse {
  0%, 100% { opacity: .42; box-shadow: 0 0 7px rgba(155,196,199,.36); }
  50% { opacity: 1; box-shadow: 0 0 14px rgba(155,196,199,.72); }
}

/* Targeted information-bearing microcopy readability pass. */
.current-signal::after,
.signal-log-row time,
.signal-log-row b,
.signal-data dt,
.hero-system-strip,
.poster-hud,
.signal-meta,
.archive-stage-meta,
.archive-bottom-code,
.archive-drawer-head,
.archive-drawer-grid .gallery-card::after,
.dossier-topline,
.dossier-subject,
.dossier-prompt,
.faq-query-item > span,
.faq-response-header,
.faq-response-code,
.faq-system-box span,
.feed-records,
.service-badge,
.review-enter-hint,
.human-check-note,
.reply-head time,
.review-edited,
.audience-pulse-head {
  font-size: 11px !important;
  line-height: 1.4 !important;
}

.dossier-data small,
.audience-pulse-data dt,
.audience-pulse-foot,
.contact-signal-copy span,
.contact-signal-status,
.footer-system,
.build-mark {
  font-size: 10px !important;
  line-height: 1.4 !important;
}

.signal-foot {
  font-size: 11px !important;
  line-height: 1.4 !important;
}

@media (max-width: 820px) {
  .current-signal::after,
  .signal-log-row time,
  .signal-log-row b { font-size: 9px !important; }

  .signal-data dt,
  .hero-system-strip,
  .poster-hud,
  .signal-meta,
  .archive-stage-meta,
  .archive-bottom-code,
  .archive-drawer-head,
  .archive-drawer-grid .gallery-card::after,
  .dossier-topline,
  .dossier-subject,
  .dossier-prompt,
  .faq-query-item > span,
  .faq-response-header,
  .faq-response-code,
  .faq-system-box span,
  .feed-records,
  .service-badge,
  .review-enter-hint,
  .human-check-note,
  .reply-head time,
  .review-edited,
  .audience-pulse-head { font-size: 11px !important; }

  .dossier-data small,
  .audience-pulse-data dt,
  .audience-pulse-foot,
  .contact-signal-copy span,
  .contact-signal-status,
  .footer-system,
  .build-mark { font-size: 10px !important; }

  .signal-foot { font-size: 8px !important; }
}

@media (prefers-reduced-motion: reduce) {
  .contact-signal-track i {
    animation: none !important;
    opacity: .78 !important;
    box-shadow: 0 0 9px rgba(155,196,199,.46) !important;
  }
}
'''
css_path.write_text(css, encoding='utf-8')

reviews_path = Path('reviews.html')
reviews = reviews_path.read_text(encoding='utf-8')
hint = '<small data-i18n="profanityFilterHint">Оригинал отзыва не изменяется. Скрытые слова можно показать отдельно.</small>'
if reviews.count(hint) != 1:
    raise SystemExit(f'Expected exactly one visible profanity hint, found {reviews.count(hint)}')
reviews_path.write_text(reviews.replace(hint, '', 1), encoding='utf-8')

print('Round3 patch prepared: css/responsive-r7-polish.css + reviews.html')
