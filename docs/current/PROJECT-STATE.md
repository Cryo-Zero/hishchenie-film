# HISHCHENIE / THEFT — current project state

Last consolidated project-memory / admin-smoke / responsive-workflow sync: **2026-09-10**.

This file contains facts that are true now or explicitly marked as snapshots/reference points. For rationale and durable rules, see `DECISIONS.md`; for active visual/composition laws, see `VISUAL-SYSTEM.md`; for the multi-workstream plan/history/next sequence, see `ROADMAP.md`; for unapproved future ideas, see `BACKLOG.md`.

## Production

- Production release: **REVIVAL R6**.
- PR #17 (`REVIVAL R6 — profile safety, bug report and curated aliases`) has been merged into `main`.
- Production runtime includes R6 profile help, privacy-safe bug-report channel, curated alias generator and its supporting documentation/backend contract.
- Reference `main` snapshot at the start of this documentation operation: `eeb60f093dc183b4d2271b923e6777e312941d6f`.
- The SHA above is a **snapshot/reference point, not a permanent latest-main pointer**. Documentation-only commits after that point naturally advance `main` without changing runtime.

## Canonical project memory

Future bridge/developer work starts from:

1. `docs/current/PROJECT-STATE.md` — what is true now;
2. `docs/current/DECISIONS.md` — accepted long-term rules/reasons;
3. `docs/current/VISUAL-SYSTEM.md` — active visual/composition laws;
4. `docs/current/ROADMAP.md` — multi-workstream goals/status, accepted/rejected directions, history references and intended next sequence;
5. `docs/current/BACKLOG.md` — ideas that may be revisited, not approval.

Before visual/responsive work, `VISUAL-SYSTEM.md` is mandatory reading. Before choosing or resuming a significant workstream, read `ROADMAP.md` as well.

## Recovery

- Approved R5 recovery branch: `backup/revival-r5-before-r6`.
- Approved R5 recovery commit: `61bab24b3e0a925e1e2a1591add0e4e13875ac7c`.
- This recovery point exists to return to the known R5 baseline if a future release requires rollback.

## Supabase / R6 backend

- Project: `xltwwvutqkpmtmlavngi` (`hishchenie-film`).
- R6 migration: `20260908155140_revival_r6_unique_aliases` — **APPLIED and VERIFIED**.
- Index `profiles_unique_alias_identity_idx` exists and is **UNIQUE** on `public.profiles`.
- Canonical duplicate groups: **0 before migration / 0 after migration**.
- The migration did not modify user-data rows; it created the uniqueness index and its comment.
- `official_team`, NULL aliases and empty aliases are intentionally outside the index predicate.
- New `curated_*` identity includes both `alias_code` and `alias_number`.
- Source SQL: `docs/database/supabase/REVIVAL-R6_unique_aliases.sql`.
- Applied-state record: `docs/database/supabase/REVIVAL-R6-APPLIED.md`.

### Current verified DB snapshot

Read-only aggregate snapshot after the real owner admin smoke-test on **2026-09-10**:

- `public.profiles` = **17**
- `public.reviews` = **10**
- `public.review_likes` = **15**
- `public.review_replies` = **6**
- `public.admins` = **1**

The previous database-level activation snapshot was `16 / 11 / 16 / 6 / 1`. The later differences are not treated as an error because the owner intentionally exercised the real admin UI, including normal admin bootstrap, an official reply and deletion of one test review. Exact row-by-row causal attribution was not reconstructed in this documentation task.

These are **snapshot counts, not invariants**. They can naturally change after normal user/admin activity.

### Operational lesson

The Supabase Free project previously entered `INACTIVE`, was manually resumed, and was then verified `ACTIVE_HEALTHY`.

If reviews/profiles suddenly fail globally, first verify the Supabase project status before assuming the frontend is broken.

## Admin state

- Existing admin UI: `/admin/index.html` + `/js/admin.js` (REVIVAL R1 control panel).
- Authorization path: `email/password → Supabase Auth → auth.users.id → public.admins → is_admin_v1() → admin RPC`.
- Dedicated owner Auth user exists and was created manually through Supabase Dashboard using the supported email/password Auth flow.
- Owner membership is active in `public.admins` with `role = 'owner'`.
- Current verified `public.admins` count: **1**.
- The owner completed a real browser smoke-test through `/admin/` on **2026-09-10**.
- **Password login is now VERIFIED by owner browser use.**
- The admin panel opened successfully and the review list loaded.
- Search, filters and sorting worked in the real browser smoke-test.
- Hide / Pin / Delete / Official Reply controls were present and available.
- An official reply was actually submitted and appeared on the public site.
- One test review was actually deleted and the deletion reflected on the public site quickly.
- Admin/site interaction was responsive enough for current functional use.
- This smoke-test confirms the normal admin login/bootstrap/authorization path works in practice. It is still a focused smoke-test, not an exhaustive QA matrix for every moderation edge case.
- Admin visual polish is intentionally postponed for the current release sequence because the admin panel is not part of the public visitor experience.
- The completed admin path, accepted/rejected decisions and possible future expansion are summarized as a persistent workstream history in `docs/current/ROADMAP.md`; older admin roadmap/setup files remain historical evidence and are not current truth by themselves.

### Temporary admin credential policy

During active admin development/QA, the temporary admin password may be used by an authorized bridge/operator only for explicitly approved authentication tests when a suitable ordinary sign-in tool is available.

The password itself is intentionally **not documented**. It must never be stored in GitHub/project memory, commit messages, reports, tokens/session records or other project artifacts. After active admin testing, the owner will replace it with a permanent private credential.

## Canonical runtime files

- `/index.html` — main public page / scene navigation.
- `/reviews.html` — public response workspace.
- `/css/site.css` — active shared visual system.
- `/js/site.js` — section navigation, archive, actors and FAQ interactions.
- `/js/public-response.js` — anonymous profiles, ratings/reviews, likes/replies, live sync and R6 profile/report UI.
- `/admin/index.html` + `/js/admin.js` — existing moderation frontend.

## Current visual/runtime characteristics

The current desktop runtime is the approved visual reference and is governed by `VISUAL-SYSTEM.md`.

Read-only runtime audit confirmed:

- primary navigation remains scene-like across About / Materials / Trailer / Watch / Actors / Reviews / FAQ;
- Hero is static/poster-based; trailer playback remains in the separate SIGNAL scene;
- About combines narrative copy with a four-card dossier information grid;
- Materials / Archive uses the bespoke drawer/viewer/lightbox system and remains an intentional viewport-wall exception to the global grid;
- Trailer uses a dedicated 16:9 media frame;
- Watch uses a platform-access block plus a separate current-signal system panel;
- Actors uses a persistent `SUBJECT DOSSIER` model with an unchanged selection-list geometry and `SUBJECT // UNIDENTIFIED` / `???` neutral state;
- FAQ remains a bespoke `SYSTEM QUERY` presentation with staged response behavior;
- Reviews are split into a RESPONSE summary scene and a denser review workspace with profile/composer + public feed;
- public review sort controls are New / Old / Popular only;
- R6 profile help is an overlay over the composer and does not redefine the base scene geometry;
- the current runtime already has partial adaptive behavior: burger navigation, coarse-pointer hit-area handling, short-desktop flow mode, mobile stacking for several scenes and touch/swipe handling in Archive.

REVIVAL R6 adds without redesigning the approved desktop world/grid contract:

- profile `?` help overlay and browser-bound identity explanation;
- expanded FAQ `QUERY_08` answer while keeping the joke title;
- `REPORT // СООБЩИТЬ О БАГЕ` opening GitHub Issues with privacy-safe diagnostics;
- curated bank of exactly 98 RU/EN nickname bases;
- mandatory visible 3-digit number for new nicknames;
- `curated_*` alias codes and transparent collision reroll/retry;
- legacy alias rendering retained for existing stored profiles.

Detailed R6 release documentation: `docs/releases/revival/R6/`.

## Responsive design workflow state

Responsive/mobile implementation has **not** started in this documentation task and no runtime files were changed.

A responsive design preflight/design plan was prepared from current R6 runtime. Proposed phone/tablet layouts remain **concept direction only** until explicitly approved by the owner.

For substantial responsive reinterpretations, the intended visual composition should be approved before final implementation whenever practical. A concept/mockup/prototype shows intended direction; an actual browser render proves what the implementation really does. Final acceptance must rely on real browser rendering rather than mockup alone.

Current screenshot limitation for this bridge run: the available GitHub connector exposes source files but not arbitrary rendered webpage screenshots/viewport capture, and the local Chromium environment could not resolve the public GitHub Pages host. Therefore no current R6 browser screenshots or faithful local visual prototype were produced in this task.

The persistent scene-by-scene responsive/device plan, including portrait/landscape and rotation contexts, is maintained in `docs/current/ROADMAP.md` rather than being reconstructed from chat history.

## Reserve repository / mirror status

Reserve repo: `Cryo-Zero/hishchenie-film-v2`.

- Existing reserve `main`, archives, snapshots and recovery history must be preserved.
- Exact production runtime mirror is currently **NOT VERIFIED / not created**.
- The blocker is a connector limitation: the reserve object database lacks production trailer blob `ede5d2d217a9def3dd757261273315e095c4244b` for `assets/video/signal/signal-trailer-ru.mp4`, while the connector does not return transferable bytes for that ~22 MB source object.
- This is a **tool limitation**, not loss/corruption of the production file.
- Do not create or advertise an approximate `mirror/hishchenie-film-main`.
- Current recovery-safe synchronization target is the five canonical current-memory files under reserve `snapshots/project-memory/current/`.
- That safety copy must be content-verified after writing and is **not** an exact runtime mirror.

## Release lineage / history

- P10–P18: foundations and review/system work.
- P20–P22: rejected large redesign attempts; historical reference only. Code is preserved in `archive/rejected-redesigns/`.
- REVIVAL R1–R5: return to the approved direction and stabilization.
- REVIVAL R5: approved recovery baseline before R6.
- REVIVAL R6: **current production release**.

Do not delete historical material without explicit approval. Current-memory files summarize history rather than duplicating full release notes.

## Current next phase

The detailed multi-workstream plan is canonical in `docs/current/ROADMAP.md`.

Current sequence:

**protect current R6 state/documentation → owner review/approval of responsive visual direction → separate responsive feature branch → incremental responsive/mobile implementation → real browser/device-render QA → mobile polish pass if needed → reassess later admin/review/report/content workstreams by actual need and owner priority**

- Admin functional smoke readiness is sufficient for the current release sequence; admin visual refinement is postponed.
- Proposed responsive layouts are not approved merely because they are described in a design plan/ROADMAP.
- Before substantial responsive implementation, owner approval of the intended composition is required whenever practical.
- Responsive implementation must be incremental and preserve the approved desktop visual contract.
- Device orientation/rotation, width/height/aspect-ratio combinations and real input/browser contexts are part of the responsive plan, not edge cases to ignore.
- Bug Reports v2 remains future work and is not authorized by this phase.
