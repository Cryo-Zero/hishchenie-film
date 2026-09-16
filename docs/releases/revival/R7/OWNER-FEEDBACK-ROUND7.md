# REVIVAL R7 — OWNER FEEDBACK ROUND 7 — IMPLEMENTATION

Status: **IMPLEMENTED ON FEATURE BRANCH / EXACT-FINAL BROWSER + SCREENSHOT QA REQUIRED BEFORE PUSH / OWNER VISUAL ACCEPTANCE PENDING / NOT PRODUCTION**

Date: 2026-09-16
Starting verified Round6 feature SHA: `f5e154912986c95e7f48a15bce34c707db39667c`

Historical pre-implementation direction is preserved in `OWNER-FEEDBACK-ROUND7-PENDING.md`.

## Required project-memory reread

Before runtime changes, the bridge reread the current `START-HERE.md`, `PROJECT-STATE.md`, `DECISIONS.md`, `VISUAL-SYSTEM.md`, `ROADMAP.md`, `BACKLOG.md`, `PREVIEW-HANDOFF.md`, and owner-feedback Round2 / Round5 / Round6. Round5 and Round6 runtime were compared before choosing corrections. A curator updated current canonical memory concurrently; those documentation changes were preserved and became the factual documentation base for this implementation rather than being rolled back.

## Canonical findings applied

- The world grid remains the default desktop composition contract. The **currently approved outside-grid exception is the Materials ARCHIVE control/handle only**. Archive is scene-local: it belongs to Materials, retracts on leave, and opening its drawer must not redefine or reflow the global grid. Future local exceptions remain possible only after separate explicit owner approval.
- Actors and FAQ preserve their bespoke staged text reveal, but structural rows/dividers remain at final coordinates.
- Profile help is an anchored overlay with zero document reflow/scroll lock. Round5's profile-console-aligned geometry is the accepted reference for this correction.
- Responsive history remains additive: superseded preview choices are retained as history rather than erased.

## Regression vs new owner direction

### Regressions / corrections of previously agreed behavior

- **Desktop Archive wall placement:** the visual regression was found during post-Round6 owner review, but source comparison shows the mis-positioning was not introduced by the Round6 diff. The existing absolute shell was captured by positioned `.archive-viewer--drawer`, placing the handle relative to the inner Materials viewer/grid instead of the physical Materials wall. The correction makes that viewer non-positioning on desktop so the shell is positioned by `#materials`; the handle remains at the wall while the drawer opens, and Materials title/stage do not reflow.
- **Profile help geometry:** Round6's compact ~360px reinterpretation is superseded. The panel returns to Round5's profile-console-aligned width/placement while remaining anchored, non-fullscreen and non-reflowing; help copy is unchanged.
- **Actors / FAQ line jitter:** reveal/crossfade selectors were transforming whole structural containers with borders. Structural containers now stay stationary while their text descendants retain staged opacity/translate reveal.

### New explicit owner direction

- Desktop CONTACT keeps the accepted travelling point/path/rhythm but removes the separate diamond receive fill/glow animation.
- Mobile CONTACT now uses the same travelling-point signal semantics as desktop, scaled by the phone track geometry; old fixed-beacon/local-impulse behavior is superseded. Reduced-motion stays static.
- The visible compact/mobile `ARCHIVE // 11` trigger is removed from public presentation; stage/swipe/lightbox remain. Desktop Archive handle/drawer remain.
- Mobile Hero restores the existing `heroCopy` i18n node and places the real node in the order `TITLE → POSTER → SYNOPSIS → ACTIONS` for phone portrait and phone landscape. No hardcoded duplicate synopsis is created. Desktop Hero keeps its original composition.

## Safety

No Supabase/schema/RLS/Auth/profile/review/rating/moderation business logic was changed. `js/public-response.js`, admin runtime, production `main`, deploy state, Custom Cursor and SECURITY PROTOCOL // 2045 remain outside this round. No existing public element was destructively deleted: the explicitly approved mobile Archive trigger is hidden from the mobile public composition while its historical markup/logic stays preserved.

## Verification contract

Real Chromium QA covers `390×844`, `430×932`, `844×390`, `932×430`, `768×1024`, `1024×768`, `1366×768`, reduced-motion states, Reviews help geometry/content, desktop world-grid regression sanity, mobile Hero RU/EN/order, mobile Materials stage/lightbox swipe, burger/smart-header preservation, desktop/mobile CONTACT semantics, Archive wall behavior, and stationary Actors/FAQ structural geometry during reveal.

Screenshot evidence compares **Round5 / Round6 / fixed candidate** for desktop Materials Archive, profile-help open state, Actors selected state and FAQ selected state, plus fixed mobile Hero portrait/landscape.

This commit is created only after pre-commit QA passes. The same full suite must then pass again against this exact commit SHA before it may be pushed. Therefore the authoritative final QA counts/SHA belong to the workflow evidence and bridge report, not to a self-referential SHA embedded in this document.
