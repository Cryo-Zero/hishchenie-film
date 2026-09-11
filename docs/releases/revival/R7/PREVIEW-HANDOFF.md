# REVIVAL R7 — responsive/mobile preview handoff

Status: **IMPLEMENTED ON FEATURE BRANCH / OWNER VISUAL REVIEW PENDING / NOT PRODUCTION**

Date: 2026-09-10

## Important workflow note

This first R7 responsive/mobile implementation pass was performed directly in the **planning/review ChatGPT conversation** after explicit owner authorization. The separate implementation bridge chat ("мостик") did **not** implement this pass.

When bridge work resumes, read current canonical memory first and treat this file as the R7 implementation handoff. Do not repeat or overwrite R7 merely because the bridge has no local chat history of performing it.

## Safety / branches

- pre-R7 production reference: `c50815437a7e6203a4a06f009a97985759458094`;
- rollback branch: `backup/pre-responsive-mobile-r7`;
- implementation branch: `revival-r7-responsive-mobile`;
- draft PR: #18 `REVIVAL R7 — responsive/mobile first pass`;
- production runtime remains R6 until owner approval and merge.

## Implementation shape

R7 was deliberately implemented as an additive responsive layer instead of rewriting the approved R6 desktop system.

Runtime additions:

- `css/responsive-r7.css` — shared responsive/mobile interpretation;
- `css/responsive-r7-landscape.css` — coarse-pointer low-height phone-landscape treatment;
- `css/responsive-r7-polish.css` — focused fixes discovered during actual screenshot review;
- `js/responsive-r7.js` — responsive context classes plus sequential FAQ/Actors state presentation;
- minimal stylesheet/script wiring in `index.html` and `reviews.html`.

Existing R6 `css/site.css`, `js/site.js` and `js/public-response.js` were not wholesale rewritten for this pass.

## Implemented direction

Coverage includes header/navigation, Hero, About, Materials/Archive, Trailer, Watch, Contacts, Actors, FAQ, Reviews/Profile, overlays/touch targets and phone landscape.

Approved complex-scene concepts implemented:

- FAQ: phone/tablet portrait `QUERY INDEX → SYSTEM RESPONSE`; phone landscape remains sequential; tablet landscape/desktop keep the two-zone console where usable.
- Actors: phone/tablet portrait `SUBJECT INDEX → SUBJECT DOSSIER`; phone landscape remains sequential; tablet landscape/desktop keep list+dossier where usable.
- Reviews/Profile: compact/mobile normal-flow sequence `profile → rating → review/publish → public feed`; feed/replies/inline editing remain part of the same community page.

## Browser evidence

Actual Chromium branch-runtime QA was used, not only source inspection.

Reference matrix:

- `390×844`
- `844×390`
- `430×932`
- `932×430`
- `768×1024`
- `1024×768`
- `1366×768`
- `1080×1920`

Final general audit: **80 checks / 0 failures**.

Visual screenshot review then found a Reviews mobile-flow problem not caught by the first structural checks: feed presentation could visually begin before the composer sequence had naturally completed in compact landscape. The layout was corrected to explicit normal document flow.

Focused post-fix Reviews audit: **24 checks / 0 failures**, including composer natural height, feed-after-composer geometry, zero horizontal overflow and no page JS errors for `390×844`, `844×390`, `430×932`, `932×430`.

## Owner feedback round — 2026-09-10

The owner then reviewed the R7 preview on a real phone and supplied screenshot-by-screenshot corrections. These were implemented directly on the same R7 feature branch; they are explicit owner instructions, not speculative additions.

Implemented feedback:

- the top-left `ХИЩЕНИЕ / THEFT` wordmark stays clickable, while the same home destination is repeated inside the mobile burger for discoverability; that repeated entry is intentionally hidden on desktop;
- mobile Hero now shows the poster as the first meaningful visual, with `Смотреть трейлер` and `О фильме` directly beneath the poster; desktop Hero composition is preserved;
- the mobile header rating includes the numeric score to the **right** of the circular indicator, inside the same rectangular control;
- `REPORT / СООБЩИТЬ О БАГЕ` was removed from the footer presentation and placed after FAQ in navigation: burger on mobile and top navigation on desktop;
- the Archive physical-wall handle is now constrained to the Materials scene on both PC and mobile; leaving Materials hides it and closes an open drawer;
- mobile Archive uses the selected asset's actual aspect ratio and available phone width rather than looking like the desktop media frame squeezed into the phone;
- FAQ and Actors preserve layout geometry while switching from index to detail, use a slower staged reveal, and settle the opened response/dossier into a controlled position directly below the header; the back command remains visible, avoiding the previous anchor-like jump;
- the Reviews header remains fixed/available while the long mobile feed scrolls;
- a broad legibility pass raised the size floor for excessively small system labels, review metadata/actions/body text, dossier/FAQ labels and other microcopy on both PC and mobile, while preserving hierarchy and the terminal/system language.

Owner-feedback QA history:

- owner-feedback audit after the first correction set: **31 checks / 0 failures** after correcting the test expectation that stable FAQ scroll is valid;
- visual review of that evidence identified one remaining composition nuance: an opened FAQ panel could begin slightly above the visible area when the selected query was low in the index;
- a controlled settle refinement was added for FAQ and Actors so the new detail panel begins below the fixed header;
- an intermediate QA run reported **16 / 17** because its Actors motion assertion incorrectly required a large scroll even when the dossier was already only 7 px from the correct destination; panel placement/back visibility/overflow were all already passing;
- the corrected final sequential acceptance check then completed with **14 / 14 checks passed**;
- the final check explicitly verified controlled FAQ and Actors movement, panel placement below the header, visible back commands, no horizontal overflow, no phone JS errors, desktop repeated-home hidden, desktop bug-report entry visible, and fixed Reviews mobile header.

The owner later clarified that the requested mobile rating placement was **number to the right of the ring** (the earlier “left” wording was a typo); the R7 CSS and this handoff were corrected accordingly.

The owner also reported that a branch-level preview did not display the latest correction set on the phone. For subsequent visual review, prefer an immutable **commit-pinned preview URL** so the reviewed HTML/CSS/JS revision cannot drift or resolve to stale branch content.

The owner-feedback round remains part of the draft R7 preview until the owner visually accepts the updated result.

## Current gate

Do **not** merge or redesign R7 automatically.

Current required sequence:

1. owner visually reviews the R7 result;
2. requested corrections, if any, stay on `revival-r7-responsive-mobile` and receive repeat browser/screenshot QA;
3. after explicit owner acceptance, merge/publish using the normal release flow;
4. verify actual production browser behavior after deployment;
5. update canonical state/release history from PREVIEW to accepted/production truth.

If the owner rejects or changes an R7 choice, preserve the prior direction as history rather than erasing it; rejected/unused ideas may be reconsidered later only with fresh owner approval.

Latest owner-feedback implementation/refinement commits are in the R7 feature branch; treat the current branch head as authoritative preview state rather than any earlier screenshot artifact.

## Owner feedback round 3 — 2026-09-11

Round3 preserves earlier owner-feedback records as history while superseding two active preview choices:

- Reviews mobile public-feed controls no longer remain fixed/sticky while reading; `PUBLIC FEED`, channel/records, sort controls and profanity toggle now leave the viewport in normal document flow;
- compact Archive stage no longer follows each selected asset's natural aspect ratio; stage geometry is stable across the asset set and images remain centered with `object-fit: contain`.

Additional owner-directed Round3 changes:

- visible profanity-filter explanatory hint removed in RU/EN while keeping the toggle;
- phone Archive drawer footprint reduced and thumbnail area made internally scrollable; ARCHIVE remains a Materials-local left-wall control;
- CONTACT dot fixed at the right endpoint and changed to a calm opacity/glow pulse, with no horizontal travel and a static reduced-motion state;
- information-bearing microcopy received a second targeted readability pass; decorative watermarks were not globally enlarged;
- Round2 Show More behavior was retained.

Real Chromium QA covered `390×844`, `430×932`, `844×390`, `932×430`, `1366×768`, including all 11 Archive assets, stable stage geometry, Reviews flow/Show More, RU/EN hint removal, Contact X stability/reduced motion, computed typography before→after, horizontal overflow and page JS errors. Exact results live in `OWNER-FEEDBACK-ROUND3.md`.

**Bug Reports v2/backend/admin notifications remain OPEN DISCUSSION and were not implemented in Round3.**

Round3 remains **OWNER VISUAL REVIEW PENDING / NOT PRODUCTION**. Browser QA must not be described as owner visual acceptance.

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
