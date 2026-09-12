# REVIVAL R7 — owner feedback round 2

Status: **IMPLEMENTED ON FEATURE BRANCH / OWNER VISUAL REVIEW PENDING / NOT PRODUCTION**

Date: 2026-09-11

This round was supplied by the owner from real-phone screenshots after the first R7 correction pass. It was implemented directly in the planning/review chat, not by the implementation bridge ("мостик"). Preserve this file as handoff/history even after later refinements.

## Explicit owner corrections implemented

### Mobile Hero

- Remove the mobile-only first-screen system/status stack (`SYS // 2045`, development/status copy and duplicated safety slogan) because it competes with the cinematic first impression.
- Put `ХИЩЕНИЕ / THEFT` above the poster.
- Keep the poster as the main first visual.
- Keep `Смотреть трейлер` / `О фильме` directly below the poster.
- Keep the synopsis (`В мире, где человек должен доказать...`) clearly farther below the poster/actions rather than inside the first compact visual group.

### Trailer

- Hide the explanatory language/subtitle note beneath the trailer on mobile, desktop and other R7 layouts.

### Archive / Materials

- `ARCHIVE` remains a left-wall control associated with Materials.
- It must be positioned relative to the Materials section/flow rather than following the viewport through unrelated content.
- Opening the drawer must not slide the `ARCHIVE` handle away from its wall position.
- The phone handle is reduced so it does not occupy an excessive amount of screen space.

### Actors / FAQ

This round **supersedes the earlier controlled-settle behavior** for mobile sequential Actors/FAQ.

Current owner rule:

- tapping a cast subject or FAQ query changes only the local index/detail representation;
- the page/viewport must **not automatically scroll or settle at all**;
- this applies even when the user is not neatly positioned at the beginning of the section;
- the visitor controls all page movement manually;
- back actions likewise must not force a viewport jump.

The older controlled-settle idea remains in prior R7 history as a superseded implementation direction and may only return after fresh owner approval.

### Reviews summary / header

- Freshness gauge must render as a true physical circle, not an oval.
- The average numeric rating (example `6.9`) must be materially larger/readable.
- In the mobile header, the numeric score remains to the **right** of the circular rating indicator inside the same rectangular control.

### Profile help

- The `?` help control remains available.
- On mobile it must not open a full-screen/site-covering overlay or alter page position.
- Use a translucent tooltip/popover visually anchored to the `?` control.
- Opening/closing it must not reflow or scroll-lock the page.

### Mobile review feed length

- Avoid an effectively endless initial mobile feed when review volume grows.
- R7 currently shows the first 6 review cards in compact/mobile contexts and adds `ПОКАЗАТЬ ЕЩЁ / SHOW MORE`; each activation reveals the next batch of 6.
- Desktop keeps the existing full feed behavior.
- This is an R7 implementation choice for owner review and can be tuned later without discarding the underlying requirement.

### Legibility

- Continue raising excessively small information-bearing words/phrases on both desktop and mobile.
- Decorative/background atmosphere may remain smaller, but functional labels, record metadata, controls, FAQ/Actors codes and readable explanatory copy must not depend on 6–9px type.

## Verification

The first round-2 Chromium audit passed **24/26** checks and correctly exposed two remaining CSS-specificity defects:

1. small-phone Freshness rendered `72×78` instead of a circle;
2. a desktop Actors subject code still rendered at `9px`.

Both were corrected with stronger selectors.

Final follow-up Chromium acceptance audit: **16/16 passed**.

Explicitly verified in the final follow-up:

- mobile Hero title/poster/actions/synopsis order;
- trailer note hidden;
- Actors click does not alter `scrollY`;
- FAQ click does not alter `scrollY`;
- Freshness physically `72×72` at the tested 390px phone viewport;
- average rating renders at `24px`;
- mobile header number is to the right of the ring;
- profile tooltip opens without viewport movement or body scroll lock;
- current 10-review feed initially shows 6 cards on mobile and exposes `SHOW MORE`;
- no tested phone page JavaScript errors;
- desktop Actors subject code floor is `10px`;
- Archive shell is section-anchored on desktop.

### QA hygiene note

A temporary Chromium-QA cleanup once staged generated `node_modules` and screenshot/report evidence into the R7 feature branch. This was detected before owner handoff, removed from the current feature tree, and `.gitignore` now excludes `node_modules/` and `r7-*-evidence/`. Production `main` was never affected. Do not treat generated QA dependencies/evidence as runtime source files.

## Open decisions — intentionally NOT implemented in this round

### Strong-language display control

Owner said the `Скрывать грубую лексику` panel should “move down as on PC”, but the exact intended mobile behavior needs confirmation before changing it. Do not guess whether this means sticky/following the viewport or ordinary document-flow movement.

### Bug reporting / admin integration

Current R6/R7 public bug-reporting remains V1: the developer action opens GitHub Issues, and the optional diagnostics summary contains only technical environment data such as build/page/language/viewport/screen/user-agent/online state. Bug Reports v2 (`public site → Supabase bug_reports → admin panel`) remains a separately approved future architecture decision.

The owner questioned whether the standalone `Скопировать диагностику` action is understandable/useful and whether bug reports should instead be handled by the admin panel. No backend/reporting-architecture change was made in this feedback round; discuss and approve the intended V2 workflow first.

## Gate

R7 remains draft PR #18. Do not merge to `main` until the owner visually accepts the current preview. After acceptance, perform production deployment/browser verification and then hand off to the bridge with the fact that R7 was implemented in the planning/review chat.