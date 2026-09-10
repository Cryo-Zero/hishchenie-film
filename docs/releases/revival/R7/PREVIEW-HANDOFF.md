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

## Current gate

Do **not** merge or redesign R7 automatically.

Current required sequence:

1. owner visually reviews the R7 result;
2. requested corrections, if any, stay on `revival-r7-responsive-mobile` and receive repeat browser/screenshot QA;
3. after explicit owner acceptance, merge/publish using the normal release flow;
4. verify actual production browser behavior after deployment;
5. update canonical state/release history from PREVIEW to accepted/production truth.

If the owner rejects or changes an R7 choice, preserve the prior direction as history rather than erasing it; rejected/unused ideas may be reconsidered later only with fresh owner approval.
