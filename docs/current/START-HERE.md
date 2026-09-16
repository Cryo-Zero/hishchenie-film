# HISHCHENIE / THEFT — START HERE

This file is the entry point for every new bridge, curator, planning chat or developer. It is an index and conflict-resolution guide; it does not replace the five canonical memory files.

## 1. Read order — mandatory

Before changing runtime, visual behavior, backend, release state or project documentation, read in this order:

1. `docs/current/START-HERE.md` — current gate, terminology and conflict rules;
2. `docs/current/PROJECT-STATE.md` — factual state now: production, preview branch, current owner-review gate;
3. `docs/current/DECISIONS.md` — durable governance, product/backend/privacy decisions and preservation rules;
4. `docs/current/VISUAL-SYSTEM.md` — active visual/composition contract;
5. `docs/current/ROADMAP.md` — workstream status/history and next sequence;
6. `docs/current/BACKLOG.md` — ideas only; never implementation authorization.

For R7 work also read the relevant `docs/releases/revival/R7/OWNER-FEEDBACK-ROUND*.md` files as historical/evidence context. Release-round files do **not** override the current canonical state merely because they contain older owner instructions.

### Mandatory fresh-read rule — durable project rule

This is a standing governance rule, not optional prompt wording.

- Every **new bridge, curator, planning/development session** must determine the actual current branch/commit first and then read `START-HERE.md` plus all five canonical files above from that current HEAD before planning or changing anything.
- A bridge that has worked on the project before must **not** rely on a previous reading, remembered rules, an old prompt, chat context, release notes or a pasted summary as a substitute for the current canonical files.
- A resumed bridge must perform the same fresh read when canonical documentation may have changed since its previous read.
- If canonical documentation changes while a task is in progress, the bridge/curator must re-check `START-HERE.md` and the affected canonical files before finalizing implementation or making a new design/architecture decision.
- The implementation report must state which HEAD/ref was used for the fresh canonical read. If the bridge cannot verify/read the current canonical files, it must stop and report that limitation instead of guessing.
- Future task prompts may remind the bridge of this rule, but the rule applies even when a prompt does not repeat it.

The purpose is to prevent a new or returning bridge from implementing an older interpretation after project memory has moved forward.

## 2. Status vocabulary — do not mix these states

- **PRODUCTION** — merged/deployed public release on `main`.
- **PREVIEW IMPLEMENTED** — code exists on the feature branch and may have automated QA, but is not production and is not automatically owner-approved.
- **OWNER VISUAL ACCEPTANCE PENDING** — owner has not accepted the current browser appearance yet.
- **OWNER-APPROVED / PENDING IMPLEMENTATION** — owner explicitly chose the direction, but current runtime may still show the older behavior until the next bridge implements it.
- **HISTORICAL / SUPERSEDED** — preserved reasoning/evidence; not the active rule where a later owner decision conflicts.
- **BACKLOG / CANDIDATE** — an idea only; no permission to implement.

Automated QA never equals owner visual acceptance.

## 3. Authority / conflict rule

When two statements appear to conflict, resolve them in this order:

`current explicit owner instruction`
→ `owner-approved pending implementation direction recorded in current canonical docs`
→ `active scene/task-specific rule in VISUAL-SYSTEM / DECISIONS`
→ `PROJECT-STATE factual runtime truth`
→ `ROADMAP current workstream status`
→ `historical release/context`
→ `BACKLOG candidate`

Never silently choose an older historical rule because its implementation already exists. Never treat a newer desired rule as already implemented unless `PROJECT-STATE` says it is factual runtime truth.

If a genuine unresolved conflict remains after applying this order, stop and ask the owner instead of inventing a compromise.

## 4. Current production vs preview

Production remains **REVIVAL R6** on `main`.

Active responsive preview work is on:

- branch: `revival-r7-responsive-mobile`;
- draft PR: `#18`;
- verified Round 6 preview SHA: `f5e154912986c95e7f48a15bce34c707db39667c`;
- owner visual acceptance: **PENDING**;
- merge/deploy: **NO until explicit owner approval**.

Round 6 passed automated QA, but owner visual review found several visual/behavior regressions. Therefore Round 6 is a verified implementation checkpoint, **not** the final accepted R7 design.

## 5. Round 7 corrections after Round 6 — implemented preview / owner visual acceptance pending

These directions are the current visual target and are now implemented on the Round7 feature-branch preview. They supersede conflicting R7 preview choices. Automated verification is required for the exact final SHA before push, and owner visual acceptance remains pending.

### World grid / Archive

- The world grid remains the default composition contract.
- **Currently the desktop Archive control/handle is the only explicitly approved element that may and should sit outside the world grid.**
- This does not permanently forbid future exceptions; any other outside-grid element requires a new explicit owner approval.
- Desktop Archive belongs to Materials only, lives on the physical left viewport wall while Materials is active, and retracts/hides when leaving Materials.
- The desktop drawer must not turn the wall handle into an ordinary inner-grid Materials button.
- The mobile visible `ARCHIVE // 11` trigger is superseded and is approved for removal from the mobile public composition; mobile Materials remains usable through the stage/swipe/lightbox interaction.

### Actors / FAQ

- Staged text/data reveal remains part of the identity.
- Structural lines/dividers/row geometry must remain stationary during reveal. Text may appear; the geometry must not jump, translate or resize.
- Mobile sequential state changes retain the no-auto-scroll rule.

### CONTACT

- Keep the travelling point along the existing line.
- Use the same signal semantics on desktop and mobile, adapted only for geometry/scale.
- Remove the extra receive/card/diamond glow or fill reaction that reads as a second flash; the point travel itself is the signal.
- Reduced-motion remains non-travelling/static.

### Profile help `?`

- Keep the help control and existing help text.
- The open panel is an anchored overlay/popover with zero page reflow and zero scroll lock.
- Geometry should follow the profile-console/block width approximately; do not reinterpret it as an arbitrary small ~360 px card inside the profile area.
- It is not fullscreen/site-covering.

### Mobile Hero

Use the existing translated synopsis already stored in source/i18n. Current approved mobile order is:

`POSTER → SHORT SYNOPSIS → ACTION BUTTONS`

The buttons remain `Смотреть трейлер / О фильме` (RU) and their existing EN equivalents. Desktop Hero remains unchanged.

## 6. Preservation / safety rules

- Do not delete runtime elements, files, history, archive material, canonical rules or rationale without explicit owner approval.
- When a newer decision supersedes an older one, preserve the older decision as history and mark the newer active state clearly.
- Documentation maintenance should remove ambiguity, not erase history.
- `BACKLOG` and `ROADMAP` presence never grant implementation permission.
- Do not touch production `main`, merge PR #18, deploy, or change Supabase/schema/RLS/Auth/review/profile business logic unless the owner explicitly authorizes that specific operation.

## 7. Before handing work back

A bridge/curator must distinguish:

- what was already true at task start;
- what owner-approved direction was pending;
- what it actually changed;
- what automated QA proved;
- what still requires owner visual acceptance.

For implementation rounds, report exact initial/final/tested/pushed/remote SHAs and never call a preview accepted until the owner says so.

## 8. Round 7 implementation gate

The post-Round6 owner correction set has now been implemented as a bounded Round7 preview change. `OWNER-FEEDBACK-ROUND7-PENDING.md` remains the historical pre-implementation specification; `OWNER-FEEDBACK-ROUND7.md` is the implementation record.

Round7 is still **not production and not owner-accepted**. The bridge may report it only after the exact-final browser/screenshot suite passes and the tested SHA is pushed with remote equality. PR #18 remains draft/unmerged; `main` and Supabase remain untouched. The next product gate after a verified Round7 SHA is owner visual review.
