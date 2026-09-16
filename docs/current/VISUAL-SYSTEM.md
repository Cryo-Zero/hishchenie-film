# HISHCHENIE / THEFT — visual system contract

This document defines the active visual/composition laws of the project. It is **not** a list of arbitrary CSS values and it is **not** a backlog.

Read `START-HERE.md` first. Use this file together with:

- `PROJECT-STATE.md` — what is factually true now;
- `DECISIONS.md` — accepted long-term rules/reasons;
- `ROADMAP.md` — workstream status/history/next sequence;
- `BACKLOG.md` — ideas that may be revisited, not implementation approval.

Before visual/responsive work, read this file in full enough to understand the relevant scene contract.

## Active-contract reading rule

This file intentionally preserves historical R7 preview rounds. Older round sections are evidence/history and may contain rules later superseded by the owner.

For any topic that appears more than once:

1. current explicit owner instruction wins;
2. the newest explicitly marked **active/pending implementation** rule in this file wins over conflicting older R7 round history;
3. older round text remains preserved to explain how the design evolved.

Do not combine conflicting old/new rules into a compromise. Do not assume the currently implemented runtime is the desired final behavior merely because it exists.

The current owner-approved visual target after Round 6 is recorded at the end under **R7 post-Round6 owner visual review corrections**. Round7 now implements that target on the feature preview; owner visual acceptance is still pending and production remains R6.

## 1. World field / world grid / сетка мира

`World field`, `world grid`, `сетка мира`, `поле мира` describe the shared composition system of the site. This is not merely one `margin`, `max-width` or CSS variable.

On desktop, most scenes intentionally share composition offsets from the viewport, left/right visual boundaries, top/bottom reference lines, visual ceilings, cross-scene alignment lines, internal rhythm and controlled empty space.

The goal is that separate sections feel like different states of one system/world.

Do not change one desktop scene's geometry in isolation without checking how it relates to the other scenes. Do not mechanically stretch approved desktop scenes to `width:100%` merely because space exists.

## 2. World grid is a contract, not a cage

The world grid is the default visual contract, not an absolute prohibition.

### Intentional exceptions / explicit creative direction

If the owner explicitly approves a scene-specific direction that requires taking an element outside the world field, making a scene wider than the grid, breaking standard margins, crossing normal alignment lines or creating a deliberate visual exception, that direction is allowed and takes priority over the general grid rule for that scene.

A deliberate local exception is not automatically a layout bug. It must remain local and must not casually destroy the global system of the other scenes.

Historically important example: **Materials / Archive**. The desired Archive composition previously suffered when it was forced too strictly inside the common grid. Do not repeat that mistake. If explicit creative direction says to leave the grid, leaving the grid is allowed.

### Current explicit outside-grid state

For the **current approved design**, the desktop Archive control/handle is the **only presently approved element that may and should sit outside the world grid**.

This is a current-state clarification, not a permanent ban on future exceptions. Another element may leave the grid only after a new explicit owner approval.

The Archive exception remains local to Materials: the desktop control is tied to the physical left viewport wall while Materials is active and must not redefine the global grid for other scenes.

## 3. Navigation = scenes / tabs

The primary navigation — О ФИЛЬМЕ, МАТЕРИАЛЫ, ТРЕЙЛЕР, ГДЕ ПОСМОТРЕТЬ, АКТЁРЫ, ОТЗЫВЫ, FAQ — must be understood as navigation between scene-like compositions/states, not simply anchors in a generic stacked landing page.

Preserve the feeling of moving between system screens/tabs. Do not automatically convert the whole site into a conventional long vertical landing page.

## 4. Desktop = visual reference, not fixed canvas

The approved desktop is the primary visual reference. It defines composition intent, hierarchy, atmosphere, world/system language, interaction character and functional meaning.

It does **not** mean that one specific owner monitor resolution is a fixed canvas that every device must reproduce 1:1. Absolute coordinates and exact geometry may adapt when the viewport requires it.

If viewport height allows, a scene may read as a complete screen. On low-height desktop/laptop viewports, normal document flow is acceptable. Do not crop content or shrink the interface to unreadability merely to preserve an artificial one-screen/100vh composition.

## 5. Responsive philosophy / device matrix

Responsive work is not only `PC` versus `mobile`.

At minimum consider:

- wide desktop;
- normal desktop;
- small desktop;
- low-height laptop;
- MacBook-class laptop;
- portrait desktop monitor;
- tablet landscape;
- tablet portrait;
- phone portrait;
- phone landscape.

Layout decisions should consider the combination of viewport width, viewport height, aspect ratio, orientation, pointer type, hover capability, touch capability, `dvh`/`svh` behavior, safe-area insets, browser chrome, Retina/HiDPI, OS/browser scaling and browser zoom.

Android/iOS/Windows/macOS matter because browser/platform behavior differs, but OS name alone must not decide the layout.

## 6. Portrait desktop ≠ phone

`height > width` is not sufficient reason to activate a phone layout.

A large portrait monitor with mouse/hover and large physical area remains a desktop context. It should receive an adapted desktop visual, not automatically a phone composition.

## 7. Tablets

A tablet is not automatically a large phone.

- Tablet landscape should preserve the desktop experience as closely as practical, or fully, when space allows.
- Tablet portrait may use stronger structural adaptation.

## 8. Phone version is an interpretation

Phone layouts must not literally compress complex desktop scenes into ~390–430 px.

Allowed adaptations include different layout, sequential presentation, vertical flow, fullscreen/sub-scenes, reordering blocks, different navigation interaction, simplified decorative geometry, reduced/simplified nonessential animation, touch alternatives to hover and reducing the amount of information visible simultaneously.

Priority order for a phone interpretation:

1. functionality;
2. meaning;
3. visual identity;
4. hierarchy;
5. atmosphere;
6. interaction character;
7. composition intent;
8. literal geometric similarity.

## 9. First responsive/mobile release

The first responsive/mobile pass is primarily for making the whole site usable from a phone, including the client/film team viewing it normally.

The first pass does not need to be pixel-perfect.

Priority:

- the whole site is reachable;
- scenes do not collapse;
- text remains readable;
- touch controls work;
- navigation/menu works;
- trailer, materials, actors, reviews, FAQ and profile remain accessible;
- the distinctive site character is preserved as far as practical.

Fine spacing/cosmetic polish may be a separate later pass.

## 10. Actors contract

Current runtime confirms the Actors scene uses a bespoke `SUBJECT DOSSIER` model.

Preserve these principles:

- compact subject selection;
- selected-subject highlight;
- the selection list must not jump/change geometry when a subject is selected;
- a persistent detail/dossier area receives the selected subject;
- the information area remains part of the scene rather than disappearing randomly;
- system identity uses subject/number/role language;
- `SUBJECT // UNIDENTIFIED` and `???` are valid neutral/default states;
- staged/bespoke reveal animation is part of the scene identity.

Do not automatically turn Actors into a generic card grid.

### Approved responsive Actors direction — 2026-09-10

The owner approved the following **composition direction** for responsive Actors. This is approved design direction, not proof that the future implementation is correct; final acceptance still requires real browser rendering.

- **Phone portrait:** sequential scene model `SUBJECT INDEX → SUBJECT DOSSIER`.
- **Phone landscape:** keep the same sequential conceptual interaction instead of automatically switching to the desktop two-pane layout because width is larger; use horizontal space to make the dossier more compact where useful.
- **Tablet portrait:** use the sequential subject-index/dossier interpretation as the default starting direction, with more breathing room than phone.
- **Tablet landscape:** preserve the current `SUBJECT LIST | SUBJECT DOSSIER` two-zone composition when actual fit remains usable.
- **Desktop, including portrait desktop context:** preserve the current two-zone subject-list/dossier model unless a separate viewport-specific problem is proven.

For the sequential phone/tablet-portrait behavior:

- selecting a subject changes the Actors scene into a dossier/file state rather than expanding the selected list row into a generic card;
- preserve `SUBJECT_xx`, role identity, selected state, `SUBJECT DOSSIER // PUBLIC`, `IDENTIFIED`, `UNIDENTIFIED / ???`, role/status/access/system-record fields and the dossier prompt language;
- keep the existing staged/scan reveal character so entering a subject feels like opening a system file, not receiving a FAQ response;
- provide a clear return path such as `SUBJECT INDEX` / equivalent back control;
- preserve the visitor's selected subject/state through orientation changes where practical instead of unexpectedly resetting to the first subject or standby;
- on phone portrait, the dossier data may use a compact 2×2 field grid when real rendering remains readable; fall back to a single column when content or language makes 2×2 too cramped;
- on phone landscape, the dossier may use a more horizontal internal composition to save vertical space while preserving the same sequential state model;
- names remain dossier information rather than being automatically exposed as the primary content of the compact subject-index rows.

Candidate idea retained for future review, **not approved for the first responsive pass**: previous/next subject controls inside an open dossier could allow browsing adjacent subjects without returning to the index. This may be reconsidered later if real mobile use shows that it improves navigation without turning the scene into a generic gallery.

The exact micro-layout, spacing, typography, scan timing and final browser behavior remain subject to implementation/render QA.

## 11. FAQ contract

FAQ uses its own `SYSTEM QUERY` presentation and staged response behavior. This system/query character and animation are part of the visual identity.

The desktop multi-zone presentation does not have to remain simultaneous on a phone.

### Approved responsive FAQ direction — 2026-09-10

The owner approved the following **composition direction** for the responsive FAQ. This is approved design direction, not proof that a future implementation is correct; final acceptance still requires actual browser rendering.

- **Phone portrait:** sequential scene model `QUERY INDEX → SYSTEM RESPONSE`.
- **Phone landscape:** use the same sequential interaction model instead of switching back to desktop merely because width is larger; low viewport height is a primary constraint.
- **Tablet portrait:** use the same sequential interpretation as the default starting direction, with more breathing room where available.
- **Tablet landscape:** preserve the current two-zone `QUERY LIST | SYSTEM RESPONSE` composition when real fit/render remains usable.
- **Desktop, including portrait desktop context:** preserve the approved two-zone console model unless a separate viewport-specific problem is proven.

For sequential phone/tablet-portrait behavior:

- entering a question changes the FAQ scene state rather than expanding a generic accordion row;
- keep `QUERY_xx`, selected state, `SYSTEM RESPONSE`, status/source/message/system-log language, neutral `QUERY_00 // STANDBY`, close/back behavior and staged reveal character;
- provide a clear return path such as `QUERY INDEX` / equivalent back control;
- the response should replace/succeed the index within the FAQ scene rather than forcing the visitor to scroll past the full question list to find a response panel below it;
- phone rotation must not arbitrarily change the conceptual interaction model from sequential to desktop; actual height/aspect/input capability must be considered;
- do not present this as a modal/generic accordion unless a later explicit owner decision chooses such a variation.

The exact micro-layout, spacing, typography, animation timing and final responsive implementation remain subject to visual/browser QA. The approved principle is the scene-state relationship above.

## 12. Archive / Materials contract

Archive / Materials is a deliberate exception to the default world grid when needed.

Preserve bespoke archive layout, drawer/viewer character, bespoke transition/animation behavior and the ability for explicit creative direction to take the composition outside the normal world field.

Current desktop contract is stronger and specific: the Archive control/handle is the presently approved outside-grid element, lives on the physical left viewport wall only while Materials is active, and retracts/hides when leaving Materials. Opening the drawer must not transform the wall handle into an ordinary inner-grid Materials control.

Do not classify intentional Archive overflow/alignment as a bug merely because it differs from the default grid. Do not use Archive as precedent to move unrelated controls outside the grid without new owner approval.

## 13. Reviews / profile contract

Reviews/profile are functionally denser than the film scenes but must remain visually part of the same system/world language. Do not automatically restyle them as a generic dashboard/web app.

Current public sorting contract: New / Old / Popular.

Do not restore old public filters without new approval, including all, team reply or low/high rating.

The R6 profile-help UI is an overlay over the composer and must remain overlay-like; it must not create layout reflow that breaks the scene geometry.

Phone adaptation must prioritize readability, touch, composer usability, rating, sorting, replies and profile-help access while preserving the system language.

## 14. Interaction / touch

Important functionality cannot depend on hover alone.

Touch contexts need a clear equivalent for any important hover interaction. Interactive controls need usable hit areas.

Potential future improvements such as burger/navigation refinements, larger gallery/pagination hit targets, vertically centered arrows and review-tab touch polish belong in `BACKLOG.md` until explicitly approved.

## 15. Hero / trailer historical decision

Current runtime uses a **static first-screen poster**. The trailer is a separate `SIGNAL` scene with its own video preview/player.

A previous looped/autoplay trailer fragment on the first screen was tried and rejected.

Approved current direction:

- keep the first screen static/poster-based;
- keep trailer preview/playback in the trailer scene;
- do not restore autoplay/looped hero video without a new explicit decision.

## 16. Rejected redesigns

P20 / P21 / P22 are rejected historical redesign attempts.

They are not current design, not approved alternatives and not a source of automatic tasks.

Their historical preservation is intentional: an individual old idea may be reconsidered or restored if it later becomes useful to the project, but only after new explicit owner review/approval. Rejected history is therefore not a permanent ban and not automatic implementation permission.

## 17. Responsive design approval evidence

For substantial responsive reinterpretations, approve the intended visual composition before final implementation whenever practical.

Keep two evidence classes separate:

- **Concept / mockup / prototype** — communicates the intended design direction.
- **Actual browser render** — confirms how the real implementation behaves at a real viewport/device context.

A proposed concept is **not approved design** until the owner explicitly approves the direction. Concept approval is permission to implement that direction, not proof that implementation is correct.

Final responsive acceptance must be based on actual browser rendering. Do not treat a mockup, source inspection or verbal plan as equivalent to a verified browser result.

If rendering evidence is unavailable, report the limitation explicitly and keep the implementation status `NOT VERIFIED` where appropriate.

Reference viewport sizes such as `390×844`, `844×390`, `430×932`, `932×430`, `768×1024`, `1024×768`, `1366×768` and `1080×1920` are **design/test references**, not hardcoded breakpoint requirements.

## 18. How to resolve visual conflicts

Visual work follows this priority:

`current explicit owner instruction`

→ `owner-approved pending implementation direction recorded in the active contract`

→ `approved scene/task-specific decision`

→ `current VISUAL-SYSTEM contract`

→ `factual runtime state in PROJECT-STATE`

→ `historical decision/context`

→ `BACKLOG idea`

A newer explicit owner direction may intentionally override a more general older rule. BACKLOG never authorizes implementation. Runtime does not automatically override desired design merely because it is newer code; owner review may reject a newer implementation.

## R7 Round 3 preview refinements — historical owner-directed preview state

These rules are preserved as R7 history. Later R7 sections supersede only the conflicting parts.

- On compact/mobile Reviews, public-feed heading/status/records, New/Old/Popular and profanity toggle belong to normal document flow and must not occupy permanent sticky/fixed space while the user reads the feed.
- For compact Materials, mixed image aspect ratios must not move the page: the main stage uses stable geometry while assets preserve their own proportions through centered `object-fit: contain`. Free space inside the stage is preferable to stretching/cropping.
- ARCHIVE remains the intentional Materials left-wall exception, but its open phone drawer must be compact/non-fullscreen and internally scrollable, especially in low-height landscape.
- CONTACT's small endpoint indicator remains physically fixed near the right endpoint/diamond. Signal animation may pulse/fade/glow but must not travel horizontally or visibly teleport on loop.
- Information-bearing microcopy must stay subordinate **and readable**. Do not solve this with a global font-size increase: target the tiny functional/status/meta class, preserve hierarchy, and verify geometry in browser. Decorative watermarks are not part of this rule.
- Substantial responsive changes remain subject to direction/concept approval where practical, and final acceptance must use actual browser rendering rather than mockup-only evidence.

## R7 Round 4 preview refinements — historical owner-directed preview state

These rules superseded conflicting Round3 preview rules at the time; newer sections may supersede them again.

- CONTACT endpoint diamond is fixed. The nearby dot may move only a **short local horizontal distance** with continuous eased reversible motion; no full-line travel, abrupt reset or layout-coordinate animation. Reduced motion has no horizontal travel.
- Compact Materials keeps Round3 stable stage geometry and centered `object-fit: contain`, but its phone/compact trigger is a horizontal technical `ARCHIVE // 11` control near the stage rather than the vertical wall handle. Desktop wall treatment remains the reference.
- Sequential Actors keeps no-auto-scroll semantics. `SELECT ANOTHER SUBJECT` is an interactive alternate route to the same `SUBJECT INDEX` transition, with keyboard/touch/focus support.
- CURRENT SIGNAL must use semantic system identifiers/states rather than fabricated time-like tokens.
- Freshness ring content is geometrically centred for short, multi-digit and pending/insufficient states; the calculation itself is unchanged.
- Anchored profile-help remains a popover, not fullscreen. Open `?` visibly communicates active state; popover may be slightly translucent/blurred while keeping readable contrast and zero page reflow/scroll lock.
- Compact Reviews feed controls follow the reading context through a **small feed-local sticky/following surface**. Do not return to the early oversized sticky block, and do not reduce Round4 to Round3 normal-flow-only behavior.
- Phone global site header may smart-hide on meaningful downward scroll and reveal on upward scroll, with hysteresis, top visibility, burger/header-interaction safety and rotation recovery. Desktop header behavior is unchanged.
- Mobile Hero synopsis remains present and unchanged. Its final mobile placement was an open visual question at this stage; a later owner decision now resolves it.

## R7 Round 5 preview refinements — historical owner-directed preview state

These rules superseded conflicting earlier R7 preview behavior at the time; newer sections may supersede them again.

- Compact/mobile Hero keeps the synopsis text in project source/i18n but does not present it in the current mobile Hero composition; desktop Hero copy remains part of the approved reference.
- Materials no longer presents the authorial-format explanatory note. On compact/mobile, previous/next arrow buttons are not shown in stage or fullscreen; touch/swipe is the primary navigation, while desktop arrows remain.
- Actors and FAQ state changes should read as one continuous transformation: outgoing content softens, incoming content crossfades/reveals without a deliberate empty-panel phase, and the scene container must not jump.
- CONTACT keeps the main line and endpoint/diamond. The visible signal is local to the endpoint area: fixed beacon plus a short subdued light impulse, never a long-distance travelling ball or flashing effect.
- Mobile burger dismissal distinguishes deliberate outside tap/click from scroll/swipe movement; fullscreen content must not retain the open burger above it.
- Profile help `?` is quiet at rest and clearly active only while its anchored panel is open; the panel contour is complete/clean and approximately follows the profile block width.
- Public build/debug labels are not visitor-facing UI. `THEFT // PUBLIC FILE // 2045` remains the public footer signature and is shared by main and Reviews.

## R7 Round 6 preview refinements — implemented checkpoint, owner visual acceptance rejected for specific details

These rules describe the Round 6 implementation checkpoint. They are not automatically the active desired contract where the owner later rejected the visual result.

- Desktop CONTACT may again use a point travelling along the existing line, but Round6 also added an endpoint diamond receive fill/glow. The later owner review keeps the travelling point but rejects the extra receive glow/fill.
- Materials enlarged/lightbox mode must provide a visibly meaningful scale advantage over the normal stage while preserving contained image proportions and the existing sci-fi presentation. Enlarged-view close/pagination controls use balanced near-square geometry.
- Round6 changed profile help toward a compact system popover. The later owner review rejects the arbitrary compact reinterpretation and restores profile-console-aligned geometry while keeping anchored/no-reflow semantics.
- Sequential mobile Actors/FAQ transitions overlap/crossfade list/detail shells softly; no long empty phase, layout jump or automatic page scroll is intended. Later owner review additionally requires internal structural lines/dividers to remain stationary while text/data reveals.
- An open mobile burger must not lock document scrolling. Scroll/touch movement alone does not dismiss it; deliberate outside tap and explicit navigation/close/fullscreen actions do.
- Phone smart-header direction logic/hysteresis stays intact while the visual translate/opacity hide/reveal should interpolate smoothly rather than snap.

## R7 post-Round6 owner visual review corrections — ACTIVE / IMPLEMENTED PREVIEW / OWNER VISUAL ACCEPTANCE PENDING

This is the current visual target and is implemented by the Round7 feature-branch correction pass. It supersedes conflicting R7 preview choices above. Automated/browser evidence does not constitute owner visual acceptance.

### Actors / FAQ reveal geometry

- Keep staged text/data reveal.
- The card/panel shell may transition as already approved where appropriate.
- Structural lines, dividers and row geometry inside the selected Actors/FAQ data panel must already sit at final coordinates and remain stationary while values/text appear.
- Do not animate those structural lines with translate/height/position changes.
- Mobile sequential Actors/FAQ retains no-auto-scroll behavior.

### CONTACT — desktop and mobile

- Keep the travelling point along the existing line.
- Desktop and mobile use the same signal idea; only geometry/scale adapts.
- Remove the separate endpoint/card/diamond glow/fill receive reaction that reads as an extra flash. The travelling point itself is the signal event.
- Reduced-motion keeps a static/non-travelling representation.

### Archive / Materials

- Desktop Archive wall behavior is restored/preserved: the handle lives on the physical left viewport wall while Materials is active, outside the world grid, and retracts/hides outside Materials.
- The desktop wall handle is the only currently approved outside-grid element. Other elements require new explicit owner approval before leaving the grid.
- Opening the drawer must not convert the wall handle into an ordinary in-grid Materials button/block.
- The mobile visible `ARCHIVE // 11` trigger is no longer part of the approved mobile composition and is approved for removal.
- Mobile Materials remains navigable through the existing stage/swipe/lightbox behavior; removing the trigger does not authorize removal of Materials, assets, swipe or lightbox.

### Profile help `?`

- Preserve existing help content.
- Preserve anchored overlay/popover semantics and visible active `?` state.
- Zero page reflow; zero scroll lock; not fullscreen/site-covering.
- Geometry should approximately follow the profile-console/block width as in the previously accepted direction.
- Do not reduce it to an arbitrary small ~360 px card merely because compactness seems cleaner.

### Mobile Hero

Use the existing synopsis from source/i18n. Current approved mobile order is:

`POSTER → SHORT SYNOPSIS → ACTIONS`

The actions remain the existing Trailer/About buttons. Desktop Hero is unchanged.

### Owner acceptance gate

These corrections require implementation + real browser/screenshot QA + another owner visual review. Automated QA may prove structure/behavior, but it does not close the visual-acceptance gate.

### Round 7 implementation evidence contract

Round7 browser verification specifically measures the regressions that escaped Round6 automation: stationary Actors/FAQ structural geometry during text reveal, physical Archive wall placement/opening without Materials reflow, profile-console-aligned help with zero reflow/scroll-lock, desktop/mobile CONTACT travel without a second receive glow, absence of the visible mobile `ARCHIVE // 11` trigger with stage/lightbox swipe preserved, and mobile Hero `POSTER → SYNOPSIS → ACTIONS` with RU/EN source continuity. Screenshot evidence compares Round5, Round6 and the Round7 candidate for the owner-found desktop states.
