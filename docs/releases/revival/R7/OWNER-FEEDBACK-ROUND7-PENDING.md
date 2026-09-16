# REVIVAL R7 — OWNER FEEDBACK ROUND 7 — PENDING IMPLEMENTATION

Status: **OWNER-APPROVED DIRECTION / NOT YET IMPLEMENTED / OWNER VISUAL ACCEPTANCE PENDING / NOT PRODUCTION**

Date: 2026-09-16

Starting verified Round6 feature SHA:

`f5e154912986c95e7f48a15bce34c707db39667c`

Branch:

`revival-r7-responsive-mobile`

Draft PR:

`#18`

This file records the owner feedback discovered during real visual review of Round6. It does **not** claim these corrections are already present in runtime. Current active interpretation is also summarized in `docs/current/START-HERE.md`, `PROJECT-STATE.md` and `VISUAL-SYSTEM.md`.

## Why this round exists

Round6 passed its automated browser gate, but owner visual review found presentation/behavior regressions that the automated assertions did not catch. This confirms the project rule that browser automation is evidence, not owner visual acceptance.

The next bridge must reread current canonical project memory before implementation and must not infer design from the most recent code alone.

## Owner-approved corrections

### 1. Actors / FAQ — structural line jitter

The staged reveal itself remains correct: values/text may begin absent and appear progressively.

Incorrect behavior: structural lines/dividers/row geometry inside the data card visibly move/jump during reveal.

Required behavior:

- text/data reveal remains;
- structural lines/dividers are already at their final coordinates;
- no translate/height/position jitter for those lines;
- the scene/card identity remains bespoke;
- mobile no-auto-scroll behavior remains.

### 2. CONTACT — keep travelling point, remove extra glow

Owner accepts the current travelling point concept.

Required behavior:

- point travels along the existing line to the endpoint;
- no additional receive/card/diamond glow/fill that reads as a second flash;
- mobile uses the same travelling-signal semantics as desktop, adapted to phone geometry;
- reduced-motion remains static/non-travelling.

Round6 desktop receive glow/fill and older mobile fixed-beacon/local-impulse semantics are superseded.

### 3. Desktop Archive — restore approved wall behavior

Round6 visual review showed Archive behaving like an internal Materials block/button. Owner did not authorize this change.

Required desktop behavior:

- Archive control/handle is attached to the physical left viewport wall while Materials is active;
- it remains a deliberate outside-world-grid exception;
- leaving Materials retracts/hides it and closes the drawer;
- opening the drawer does not convert the handle into an ordinary in-grid Materials control;
- Materials heading/stage grid is not redefined around the drawer.

### 4. World-grid clarification

Current explicit owner clarification:

**The desktop Archive control/handle is currently the only approved element that may and should live outside the world grid.**

This does not permanently ban future exceptions. Any other outside-grid element requires a new explicit owner approval.

### 5. Profile help `?`

Round6 compact ~360px reinterpretation is rejected.

Required behavior:

- keep `?`;
- help content unchanged;
- anchored overlay/popover, not document-flow block;
- no page reflow;
- no scroll lock;
- not fullscreen/site-covering;
- panel geometry approximately follows the profile-console/block width, consistent with the previously accepted Round5 direction.

### 6. Mobile Archive trigger

The visible mobile `ARCHIVE // 11` trigger is no longer desired.

Explicit permission:

- remove this visible mobile trigger from the public composition.

Do **not** remove:

- Materials;
- archive assets;
- mobile stage;
- swipe navigation;
- lightbox;
- desktop Archive wall handle/drawer.

Round4 mobile `ARCHIVE // 11` trigger is historical/superseded.

### 7. Mobile Hero synopsis

Use the existing synopsis already stored in source/i18n.

Approved mobile order:

`POSTER → SHORT SYNOPSIS → ACTIONS`

The actions remain the existing Trailer/About buttons.

This supersedes:

- Round5 mobile hidden synopsis;
- earlier Round2 placement below the action buttons.

Desktop Hero remains unchanged.

## Documentation/handoff clarification

The owner also requested a documentation-quality pass so new bridges/curators cannot reasonably confuse:

- production vs preview;
- implemented preview vs owner-approved pending implementation;
- current rules vs historical/superseded round history;
- roadmap/backlog presence vs implementation authorization.

`docs/current/START-HERE.md` is now the mandatory entry/index for this purpose. Historical rules remain preserved rather than deleted.

## Safety boundary

This round does not authorize:

- merge PR #18;
- deploy;
- changes to production `main`;
- Supabase/schema/RLS/Auth changes;
- review/profile business-logic changes;
- unrelated redesign/refactor;
- Custom Cursor;
- SECURITY PROTOCOL // 2045;
- deletion of existing elements/history except the explicitly approved removal of the visible mobile `ARCHIVE // 11` trigger from the mobile composition.

## Required verification when implemented

Implementation must include real browser QA and screenshot evidence capable of catching the Round6 visual misses, especially:

- desktop Actors selected state during reveal;
- desktop FAQ selected state during reveal;
- desktop Archive closed/open wall geometry;
- profile-help open geometry;
- desktop/mobile CONTACT animation;
- mobile Materials without `ARCHIVE // 11`;
- mobile Hero order and RU/EN synopsis.

The final implementation gate remains:

`TESTED SHA == PUSHED SHA == REMOTE SHA == REPORTED FINAL SHA`

and then another **OWNER VISUAL REVIEW**.
