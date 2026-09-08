# HISHCHENIE / THEFT — current project state

Last consolidated project-memory / visual-contract sync: **2026-09-09**.

This file contains facts that are true now or explicitly marked as snapshots/reference points. For rationale and durable rules, see `DECISIONS.md`; for active visual/composition laws, see `VISUAL-SYSTEM.md`; for unapproved future ideas, see `BACKLOG.md`.

## Production

- Production release: **REVIVAL R6**.
- PR #17 (`REVIVAL R6 — profile safety, bug report and curated aliases`) has been merged into `main`.
- Production runtime includes R6 profile help, privacy-safe bug-report channel, curated alias generator and its supporting documentation/backend contract.
- Reference `main` snapshot at the start of this documentation operation: `45c327b813a53dfb927aba840fdca1f5c5812745`.
- The SHA above is a **snapshot/reference point, not a permanent latest-main pointer**. Documentation-only commits after that point naturally advance `main` without changing runtime.

## Canonical project memory

Future bridge/developer work starts from:

1. `docs/current/PROJECT-STATE.md` — what is true now;
2. `docs/current/DECISIONS.md` — accepted long-term rules/reasons;
3. `docs/current/VISUAL-SYSTEM.md` — active visual/composition laws;
4. `docs/current/BACKLOG.md` — ideas that may be revisited, not approval.

Before visual/responsive work, `VISUAL-SYSTEM.md` is mandatory reading.

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

### Last verified DB snapshot

Read-only verified snapshot on **2026-09-09**:

- `public.profiles` = **16**
- `public.reviews` = **11**
- `public.review_likes` = **16**
- `public.review_replies` = **6**
- `public.admins` = **0**

These are **snapshot counts**, not invariants. They can naturally change after normal user/admin activity.

### Operational lesson

The Supabase Free project previously entered `INACTIVE`, was manually resumed, and was then verified `ACTIVE_HEALTHY`.

If reviews/profiles suddenly fail globally, first verify the Supabase project status before assuming the frontend is broken.

## Admin state

- Existing admin UI: `/admin/index.html` + `/js/admin.js` (REVIVAL R1 control panel; no redesign is required for initial activation).
- Existing authorization path: `email/password → Supabase Auth → auth.users.id → public.admins → is_admin_v1() → admin RPC`.
- Existing panel supports login/logout, review list/search/filter/sort/refresh, hide/unhide, pin/unpin, delete review and official reply.
- Admin backend RPC/functions are present.
- Last verified `public.admins` count: **0**.
- Last verified suitable email/password Auth users: **0**; existing viewer identities were anonymous users.
- Planned owner login `zero@hishchenie.invalid` is **not created yet**.
- Admin activation is therefore **NOT complete**.

### Current admin blocker / next action

The connected Supabase bridge does not expose a documented Auth Admin create-user action. Previous work correctly stopped rather than using a direct `auth.users` mutation or other workaround.

The owner must create the dedicated email/password Auth user manually through the Supabase Dashboard using the supported Auth management flow.

Do not create the Auth user through:

- direct `INSERT`/`UPDATE` in `auth.users`;
- temporary Edge Functions;
- installed HTTP/`pg_net` workarounds;
- undocumented creation paths.

After the owner manually creates the user, a separately authorized bridge step can obtain its UUID, add the approved `public.admins` membership with `role = 'owner'`, and verify backend authorization.

A temporary admin test password may be known/used by the authorized bridge only for explicitly approved authentication/smoke testing. The password itself is intentionally **not documented** and must never be committed or repeated in final reports.

## Canonical runtime files

- `/index.html` — main public page / scene navigation.
- `/reviews.html` — public response workspace.
- `/css/site.css` — active shared visual system.
- `/js/site.js` — section navigation, archive, actors and FAQ interactions.
- `/js/public-response.js` — anonymous profiles, ratings/reviews, likes/replies, live sync and R6 profile/report UI.
- `/admin/index.html` + `/js/admin.js` — existing moderation frontend.

## Current visual/runtime characteristics

The current desktop runtime is the approved visual reference and is governed by `VISUAL-SYSTEM.md`.

Read-only runtime audit on **2026-09-09** confirmed:

- primary navigation remains scene-like across About / Materials / Trailer / Watch / Actors / Reviews / FAQ;
- Hero is static/poster-based; trailer playback remains in the separate SIGNAL scene;
- Actors uses a persistent `SUBJECT DOSSIER` model with an unchanged selection-list geometry and `SUBJECT // UNIDENTIFIED` / `???` neutral state;
- FAQ remains a bespoke `SYSTEM QUERY` presentation with staged response behavior;
- Archive / Materials contains an intentional viewport-wall exception to the global grid;
- Reviews/profile remain in the same system language;
- public review sort controls are New / Old / Popular only;
- R6 profile help is an overlay over the composer and does not redefine the base scene geometry.

REVIVAL R6 adds without redesigning the approved desktop world/grid contract:

- profile `?` help overlay and browser-bound identity explanation;
- expanded FAQ `QUERY_08` answer while keeping the joke title;
- `REPORT // СООБЩИТЬ О БАГЕ` opening GitHub Issues with privacy-safe diagnostics;
- curated bank of exactly 98 RU/EN nickname bases;
- mandatory visible 3-digit number for new nicknames;
- `curated_*` alias codes and transparent collision reroll/retry;
- legacy alias rendering retained for existing stored profiles.

Detailed R6 release documentation: `docs/releases/revival/R6/`.

## Reserve repository / mirror status

Reserve repo: `Cryo-Zero/hishchenie-film-v2`.

- Existing reserve `main`, archives, snapshots and recovery history must be preserved.
- Exact production runtime mirror is currently **NOT VERIFIED / not created**.
- The blocker is a connector limitation: the reserve object database lacks production trailer blob `ede5d2d217a9def3dd757261273315e095c4244b` for `assets/video/signal/signal-trailer-ru.mp4`, while the connector does not return transferable bytes for that ~22 MB source object.
- This is a **tool limitation**, not loss/corruption of the production file.
- Do not create or advertise an approximate `mirror/hishchenie-film-main`.
- Current recovery-safe synchronization target is the four canonical current-memory files under reserve `snapshots/project-memory/current/`.
- That safety copy must be content-verified after writing and is **not** an exact runtime mirror.

## Release lineage / history

- P10–P18: foundations and review/system work.
- P20–P22: rejected large redesign attempts; historical reference only. Code is preserved in `archive/rejected-redesigns/`.
- REVIVAL R1–R5: return to the approved direction and stabilization.
- REVIVAL R5: approved recovery baseline before R6.
- REVIVAL R6: **current production release**.

Do not delete historical material without explicit approval. Current-memory files summarize history rather than duplicating full release notes.

## Current next phase

Current sequence:

**manual owner Auth user creation in Supabase Dashboard → separately approved owner membership/backend verification → first real admin-panel login / functional smoke check → responsive/mobile pass**

- Do not claim admin activation until the Auth user, membership and authorization are actually verified.
- Do not claim the moderation UI has been fully user-tested until a real owner/admin smoke check occurs.
- Responsive/mobile implementation is a separate workstream and must follow `VISUAL-SYSTEM.md`; it is not authorized by the existence of backlog notes alone.
