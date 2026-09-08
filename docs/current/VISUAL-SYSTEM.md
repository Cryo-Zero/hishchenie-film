# HISHCHENIE / THEFT — visual system contract

This document defines the active visual/composition laws of the project. It is **not** a list of arbitrary CSS values and it is **not** a backlog.

Use it together with:

- `PROJECT-STATE.md` — what is true now;
- `DECISIONS.md` — accepted long-term rules/reasons;
- `BACKLOG.md` — ideas that may be revisited, not implementation approval.

Before visual/responsive work, read this file first.

## 1. World field / world grid / сетка мира

`World field`, `world grid`, `сетка мира`, `поле мира` describe the shared composition system of the site. This is not merely one `margin`, `max-width` or CSS variable.

On desktop, most scenes intentionally share:

- composition offsets from the viewport;
- left/right visual boundaries;
- top/bottom reference lines;
- visual ceilings;
- cross-scene alignment lines;
- internal rhythm;
- controlled empty space.

The goal is that separate sections feel like different states of one system/world.

Do not change one desktop scene's geometry in isolation without checking how it relates to the other scenes. Do not mechanically stretch approved desktop scenes to `width:100%` merely because space exists.

## 2. World grid is a contract, not a cage

The world grid is the default visual contract, not an absolute prohibition.

### Intentional exceptions / explicit creative direction

If the owner explicitly approves a scene-specific direction that requires:

- taking an element outside the world field;
- making a scene wider than the grid;
- breaking standard margins;
- crossing normal alignment lines;
- creating a deliberate visual exception;

that direction is allowed and takes priority over the general grid rule for that scene.

A deliberate local exception is not automatically a layout bug. It must remain local and must not casually destroy the global system of the other scenes.

Historically important example: **Materials / Archive**. The desired Archive composition previously suffered when it was forced too strictly inside the common grid. Do not repeat that mistake. If explicit creative direction says to leave the grid, leaving the grid is allowed.

Current runtime reinforces this: the Archive control is intentionally tied to the physical viewport wall while the Materials scene is active.

## 3. Navigation = scenes / tabs

The primary navigation:

- О ФИЛЬМЕ;
- МАТЕРИАЛЫ;
- ТРЕЙЛЕР;
- ГДЕ ПОСМОТРЕТЬ;
- АКТЁРЫ;
- ОТЗЫВЫ;
- FAQ

must be understood as navigation between scene-like compositions/states, not simply anchors in a generic stacked landing page.

Preserve the feeling of moving between system screens/tabs. Do not automatically convert the whole site into a conventional long vertical landing page.

## 4. Desktop = visual reference, not fixed canvas

The approved desktop is the primary visual reference.

It defines:

- composition intent;
- hierarchy;
- atmosphere;
- world/system language;
- interaction character;
- functional meaning.

It does **not** mean that one specific owner monitor resolution is a fixed canvas that every device must reproduce 1:1.

Absolute coordinates and exact geometry may adapt when the viewport requires it.

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

Layout decisions should consider the combination of:

- viewport width;
- viewport height;
- aspect ratio;
- orientation;
- pointer type;
- hover capability;
- touch capability;
- `dvh` / `svh` behavior;
- safe-area insets;
- browser chrome;
- Retina / HiDPI;
- OS/browser scaling;
- browser zoom.

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

Allowed adaptations include:

- different layout;
- sequential presentation;
- vertical flow;
- fullscreen/sub-scenes;
- reordering blocks;
- different navigation interaction;
- simplified decorative geometry;
- reduced/simplified nonessential animation;
- touch alternatives to hover;
- reducing the amount of information visible simultaneously.

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

If a historical Actors detail no longer exists in current runtime, do not reintroduce it merely because it appears in old notes.

## 11. FAQ contract

FAQ uses its own `SYSTEM QUERY` presentation and staged response behavior. This system/query character and animation are part of the visual identity.

The desktop multi-zone presentation does not have to remain simultaneous on a phone.

Phone interpretation may legitimately become sequential, for example:

`QUERY LIST → SELECTED ANSWER`

or use a fullscreen/sub-scene approach.

Do not automatically replace FAQ with a generic accordion without a new explicit decision.

## 12. Archive / Materials contract

Archive / Materials is a deliberate exception to the default world grid when needed.

Preserve:

- bespoke archive layout;
- drawer/viewer character;
- bespoke transition/animation behavior;
- the ability for explicit creative direction to take the composition outside the normal world field.

Do not classify intentional overflow/alignment exceptions as bugs merely because they differ from the default grid.

## 13. Reviews / profile contract

Reviews/profile are functionally denser than the film scenes but must remain visually part of the same system/world language. Do not automatically restyle them as a generic dashboard/web app.

Current public sorting contract:

- New;
- Old;
- Popular.

Do not restore old public filters without new approval, including:

- all;
- team reply;
- low/high rating.

The R6 profile-help UI is an overlay over the composer and must remain overlay-like; it must not create layout reflow that breaks the scene geometry.

## 14. Interaction / touch

Important functionality cannot depend on hover alone.

Touch contexts need a clear equivalent for any important hover interaction.

Interactive controls need usable hit areas.

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

They are:

- not current design;
- not approved alternatives;
- not a source of automatic tasks;
- not to be revived as the baseline.

Individual ideas from those experiments may only return after a new explicit decision.

## 17. How to resolve visual conflicts

Visual work follows this priority:

`current explicit owner instruction`

→ `approved scene/task-specific decision`

→ `current VISUAL-SYSTEM contract`

→ `historical decision/context`

→ `BACKLOG idea`

A newer explicit owner direction may intentionally override a more general older rule. BACKLOG never authorizes implementation.
