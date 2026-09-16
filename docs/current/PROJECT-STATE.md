# HISHCHENIE / THEFT — current project state

Last consolidated project-memory / responsive-owner-review sync: **2026-09-16**.

This file contains facts that are true now or explicitly marked as snapshots/reference points. It must not be used alone to infer design intent: read `START-HERE.md` first, then `DECISIONS.md` and `VISUAL-SYSTEM.md`. For the multi-workstream plan/history/next sequence, see `ROADMAP.md`; for unapproved future ideas, see `BACKLOG.md`.

## Read-this-first factual split

There are currently two different factual layers and they must not be confused:

1. **Production:** REVIVAL R6 on `main`.
2. **Responsive preview:** REVIVAL R7 on `revival-r7-responsive-mobile`, draft PR #18, not merged/deployed and still under owner visual review.

Round 6 of the R7 preview reached verified feature SHA:

`f5e154912986c95e7f48a15bce34c707db39667c`

It passed its automated browser gate, but the owner then found visual/behavior regressions in real review. Therefore Round 6 is a verified implementation checkpoint, **not owner-accepted final R7**.

The owner-approved post-Round6 correction set has now been implemented by the bounded Round7 bridge pass. It remains **OWNER VISUAL ACCEPTANCE PENDING** and is not production. The exact final Round7 SHA is established by the exact-final browser/screenshot gate before push; do not confuse automated verification with owner acceptance.

## Production

- Production release: **REVIVAL R6**.
- Production branch: `main`.
- Current production `main` reference during R7 owner review: `bee65a44607e49d0c314ce9981d312699493883a`.
- PR #17 (`REVIVAL R6 — profile safety, bug report and curated aliases`) was merged into `main`.
- Production runtime includes R6 profile help, privacy-safe bug-report channel, curated alias generator and its supporting documentation/backend contract.
- R7 PR #18 is **not production** and must not be merged/deployed without explicit owner acceptance.

## Active R7 responsive preview

- Feature branch: `revival-r7-responsive-mobile`.
- Draft PR: `#18` (`REVIVAL R7 — responsive/mobile first pass`).
- PR state at the Round 6 handoff: **OPEN / DRAFT / UNMERGED**.
- Verified Round 6 preview SHA: `f5e154912986c95e7f48a15bce34c707db39667c`.
- Round 6 automated browser verification: passed for its defined matrix/checks.
- Owner visual acceptance: **PENDING**.
- Merge: **NO**.
- Deploy: **NO**.
- Supabase/backend changes in Round 6: **NO**.

### Round 7 corrections after Round 6 — implemented preview / owner visual acceptance pending

The following active target is now implemented on the Round7 feature preview. It remains subject to exact-final verification before push and then owner visual review; production R6 is unchanged.

- **World grid / Archive:** on the current design, the desktop Archive wall control is the only explicitly approved outside-grid element. It belongs only to Materials and should remain on the physical left viewport wall while Materials is active. Other outside-grid exceptions require new explicit owner approval.
- **Desktop Archive regression:** restore the approved wall-handle/drawer behavior; it must not read as an ordinary button/block inside the Materials grid.
- **Mobile Archive:** the visible `ARCHIVE // 11` trigger is superseded and approved for removal from the mobile public composition. Materials/swipe/lightbox remain.
- **Actors / FAQ:** preserve staged text/data reveal, but structural lines/dividers/row geometry must remain stationary during reveal. Mobile no-auto-scroll semantics remain.
- **CONTACT:** travelling point remains. Desktop and mobile should share the same travelling-signal semantics, adapted for geometry; remove the extra receive/card/diamond glow/fill reaction that reads as a second flash. Reduced-motion remains static/non-travelling.
- **Profile help `?`:** keep the same help content and anchored overlay semantics, with zero reflow/scroll lock. Geometry should approximately follow the profile-console/block width rather than becoming an arbitrary compact ~360 px card.
- **Mobile Hero:** restore the existing translated synopsis and place it `POSTER → SYNOPSIS → ACTIONS`. Desktop Hero remains unchanged.

These items are owner-approved direction, not proof of implementation. `VISUAL-SYSTEM.md` contains the active visual contract; `START-HERE.md` defines how to resolve older conflicting round history.

## Canonical project memory

Every new bridge/curator/developer starts from:

0. `docs/current/START-HERE.md` — mandatory entry point, status vocabulary and conflict-resolution rules;
1. `docs/current/PROJECT-STATE.md` — what is factually true now;
2. `docs/current/DECISIONS.md` — accepted long-term rules/reasons;
3. `docs/current/VISUAL-SYSTEM.md` — active visual/composition laws and owner-approved visual target;
4. `docs/current/ROADMAP.md` — multi-workstream goals/status, accepted/rejected directions, history references and intended next sequence;
5. `docs/current/BACKLOG.md` — ideas that may be revisited, never approval.

Before visual/responsive work, `VISUAL-SYSTEM.md` is mandatory reading. Before choosing or resuming a significant workstream, read `ROADMAP.md` as well.

Historical `OWNER-FEEDBACK-ROUND*.md` files preserve evidence and superseded choices. They do not override newer active canonical rules merely because they contain older explicit instructions.

## Recovery

- Approved R5 recovery branch: `backup/revival-r5-before-r6`.
- Approved R5 recovery commit: `61bab24b3e0a925e1e2a1591add0e4e13875ac7c`.
- This recovery point exists to return to the known R5 baseline if a future release requires rollback.
- Git history and the R7 feature branch preserve the newer preview lineage; do not rewrite or delete it merely to simplify documentation.

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
- **Password login is VERIFIED by owner browser use.**
- The admin panel opened successfully and the review list loaded.
- Search, filters and sorting worked in the real browser smoke-test.
- Hide / Pin / Delete / Official Reply controls were present and available.
- An official reply was actually submitted and appeared on the public site.
- One test review was actually deleted and the deletion reflected on the public site quickly.
- Admin/site interaction was responsive enough for current functional use.
- This smoke-test confirms the normal admin login/bootstrap/authorization path works in practice. It is still a focused smoke-test, not an exhaustive QA matrix for every moderation edge case.
- Admin visual polish is intentionally postponed because the admin panel is not part of the public visitor experience.
- The completed admin path, accepted/rejected decisions and possible future expansion are summarized in `ROADMAP.md`; older admin roadmap/setup files remain historical evidence and are not current truth by themselves.

### Temporary admin credential policy

During active admin development/QA, the temporary admin password may be used by an authorized bridge/operator only for explicitly approved authentication tests when a suitable ordinary sign-in tool is available.

The password itself is intentionally **not documented**. It must never be stored in GitHub/project memory, commit messages, reports, tokens/session records or other project artifacts. After active admin testing, the owner will replace it with a permanent private credential.

## Canonical runtime files

Production R6 foundation:

- `/index.html` — main public page / scene navigation.
- `/reviews.html` — public response workspace.
- `/css/site.css` — R6 shared desktop visual foundation.
- `/js/site.js` — section navigation, archive, actors and FAQ interactions.
- `/js/public-response.js` — anonymous profiles, ratings/reviews, likes/replies, live sync and R6 profile/report UI.
- `/admin/index.html` + `/js/admin.js` — existing moderation frontend.

R7 preview adds responsive runtime layers on its feature branch, including:

- `css/responsive-r7.css`;
- `css/responsive-r7-landscape.css`;
- `css/responsive-r7-polish.css`;
- `css/responsive-r7-owner-round2.css`;
- `js/responsive-r7.js`;
- scoped R7-era changes in `js/site.js` where owner feedback required behavior changes.

Do not infer production deployment from the presence of these files on the feature branch.

## Current visual/runtime characteristics

### Production R6 reference

The production desktop runtime remains the approved foundation and is governed by `VISUAL-SYSTEM.md`.

Key durable characteristics:

- primary navigation remains scene-like across About / Materials / Trailer / Watch / Actors / Reviews / FAQ;
- Hero is static/poster-based; trailer playback remains in the separate SIGNAL scene;
- About combines narrative copy with a four-card dossier information grid;
- Materials / Archive uses the bespoke drawer/viewer/lightbox system and is the known world-grid exception;
- Trailer uses a dedicated 16:9 media frame;
- Watch uses a platform-access block plus a separate current-signal system panel;
- Actors uses a bespoke `SUBJECT DOSSIER` model;
- FAQ remains a bespoke `SYSTEM QUERY` presentation with staged response behavior;
- Reviews are split into a RESPONSE summary scene and a denser review workspace with profile/composer + public feed;
- public review sort controls are New / Old / Popular only;
- R6 profile help remains overlay-like and must not redefine base scene geometry.

REVIVAL R6 adds without redesigning the approved desktop world/grid contract:

- profile `?` help and browser-bound identity explanation;
- expanded FAQ `QUERY_08` answer while keeping the joke title;
- `REPORT // СООБЩИТЬ О БАГЕ` opening GitHub Issues with privacy-safe diagnostics;
- curated bank of exactly 98 RU/EN nickname bases;
- mandatory visible 3-digit number for new nicknames;
- `curated_*` alias codes and transparent collision reroll/retry;
- legacy alias rendering retained for existing stored profiles.

Detailed R6 release documentation: `docs/releases/revival/R6/`.

### R7 preview characteristics

R7 is an additive responsive interpretation, not a replacement of the approved desktop identity. It has already gone through multiple owner-feedback rounds and real Chromium matrices. Historical Round1–Round6 choices are preserved under `docs/releases/revival/R7/`.

Do not use an earlier round description as current truth without checking `START-HERE.md`, this file and `VISUAL-SYSTEM.md`. Several preview choices were intentionally superseded in later rounds. The post-Round6 owner correction set is now implemented in the Round7 preview but remains pending owner visual acceptance.

## Responsive design workflow state

Responsive/mobile implementation **has started and is substantially implemented on the R7 feature branch**. Any older text saying the responsive work has not started is obsolete historical state.

Current workflow state:

1. R7 responsive feature branch exists and is the active preview workspace.
2. Multiple owner-feedback rounds (including Round 6) were implemented and browser-QA'd.
3. Round 6 final SHA `f5e154912986c95e7f48a15bce34c707db39667c` passed its automated gate.
4. Owner visual review then found several regressions/incorrect interpretations.
5. The owner-approved correction direction listed above and in `VISUAL-SYSTEM.md` has been implemented by the bounded Round7 bridge pass.
6. The Round7 implementation must pass the full browser/screenshot suite against the exact final commit, then push that exact SHA and verify remote equality.
7. After that verification, the next gate is owner visual review; R7 remains draft/unmerged/not production until explicit owner acceptance.

Concept/mockup, source inspection, automated assertions and browser QA are distinct evidence classes. Final visual acceptance belongs to the owner.

## Reserve repository / mirror status

Reserve repo: `Cryo-Zero/hishchenie-film-v2`.

- Existing reserve `main`, archives, snapshots and recovery history must be preserved.
- Exact production runtime mirror is currently **NOT VERIFIED / not created**.
- The blocker is a connector limitation: the reserve object database lacks production trailer blob `ede5d2d217a9def3dd757261273315e095c4244b` for `assets/video/signal/signal-trailer-ru.mp4`, while the connector does not return transferable bytes for that ~22 MB source object.
- This is a **tool limitation**, not loss/corruption of the production file.
- Do not create or advertise an approximate `mirror/hishchenie-film-main`.
- Current recovery-safe synchronization target is the five canonical current-memory files under reserve `snapshots/project-memory/current/`.
- `START-HERE.md` may also be mirrored there as an entry/index, but it is not an independent sixth source of truth.
- The safety copy must be content-verified after writing and is **not** an exact runtime mirror.

## Release lineage / history

- P10–P18: foundations and review/system work.
- P20–P22: rejected large redesign attempts; historical reference only. Code is preserved in `archive/rejected-redesigns/`.
- REVIVAL R1–R5: return to the approved direction and stabilization.
- REVIVAL R5: approved recovery baseline before R6.
- REVIVAL R6: **current production release**.
- REVIVAL R7: **active responsive feature-branch preview**, owner visual acceptance pending, not production.

Do not delete historical material without explicit approval. Current-memory files summarize history rather than duplicating full release notes.

## Current next phase

The detailed multi-workstream plan is canonical in `docs/current/ROADMAP.md`.

Current sequence:

**preserve production R6 → correct the owner-identified R7 Round6 regressions on the existing feature branch → browser + screenshot QA → owner visual review → further bounded corrections if needed → only after explicit owner acceptance consider merge/deploy → verify production after deployment**

Immediate R7 correction scope is already owner-approved and recorded above/inside `VISUAL-SYSTEM.md`; it does not authorize unrelated redesign or backend work.

- Admin functional readiness remains sufficient; admin redesign is not part of this R7 correction phase.
- Bug Reports v2, CAPTCHA, Telegram, Russian-hosted backend migration and legal/privacy publication remain separate future workstreams unless explicitly activated.
- Supabase/profile/review business logic is outside the current visual correction scope.
- Device orientation/rotation, width/height/aspect-ratio combinations and real input/browser contexts remain part of responsive QA, not edge cases to ignore.
