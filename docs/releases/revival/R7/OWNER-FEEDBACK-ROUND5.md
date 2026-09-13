# REVIVAL R7 — OWNER FEEDBACK ROUND 5

Status: **IMPLEMENTED ON FEATURE BRANCH / BROWSER QA PASSED / OWNER VISUAL REVIEW PENDING / NOT PRODUCTION**

Date: 2026-09-12
Starting verified Round4 head: `de8603819ada62a07a63d5aa398b356da2cfc750`

## Owner-directed changes

- Mobile Hero synopsis stays in source/i18n but is not rendered in the compact Hero composition; desktop copy is preserved.
- Materials explanatory note `Материалы представлены в авторском виде…` is removed from public presentation on all devices.
- Mobile/compact Materials previous/next arrows are hidden in normal stage and fullscreen lightbox; existing touch/swipe remains the navigation mechanism. Desktop arrows remain.
- Actors and FAQ transitions are softened into one continuous transformation: outgoing content fades, incoming content begins partially visible and settles with a short stagger; there is no intentional empty-panel phase. Existing structure/state model is preserved.
- CONTACT uses a fixed endpoint beacon plus a short local light impulse near the endpoint; no travelling ball crosses the line. Reduced motion disables the impulse.
- Burger closes on close/menu selection/deliberate outside tap and fullscreen entry, but touch movement/scroll gestures alone do not close it.
- The small inherited underline/protrusion beneath the burger `СООБЩИТЬ О БАГЕ` entry is removed; the entry itself remains.
- Profile help `?` is quiet when closed, visibly active when open; the panel is aligned to roughly the profile-console width and inherited corner-marker remnants are removed.
- Public `BUILD // REVIVAL R6 // PROFILE SAFETY + REPORT` is removed from main and Reviews UI.
- `THEFT // PUBLIC FILE // 2045` remains on main and is added to the Reviews footer without creating a new large section.

## Preservation / safety

No Supabase schema/RLS/Auth/profile/review/rating/moderation business logic was changed. `js/public-response.js` and admin runtime were not modified. Desktop-only pagination and the approved R6 desktop foundation remain intact except for owner-authorized global removals/transition refinement.

## Browser QA

Pre-commit browser matrix: **192/192 PASS**. Required contexts cover `390×844`, `430×932`, `844×390`, `932×430`, `768×1024`, `1024×768`, `1366×768`; exact-final-SHA verification is required after the clean commit and is reported separately by the workflow evidence.

QA covers Hero visibility/source preservation, Materials note removal, mobile normal/fullscreen arrows + swipe, Actors/FAQ viewport stability/soft transition, burger tap-vs-scroll/fullscreen behavior, CONTACT fixed endpoint/local impulse/reduced motion, help-panel states/geometry, build-label removal, Reviews footer signature, horizontal overflow, JS errors and desktop regression sanity.
