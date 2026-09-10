# HISHCHENIE / THEFT — current project state

Last consolidated project-memory / admin-state sync: **2026-09-10**.

This file contains facts that are true now or explicitly marked as snapshots/reference points. For rationale and durable rules, see `DECISIONS.md`; for active visual/composition laws, see `VISUAL-SYSTEM.md`; for unapproved future ideas, see `BACKLOG.md`.

## Production

- Production release: **REVIVAL R6**.
- PR #17 (`REVIVAL R6 — profile safety, bug report and curated aliases`) has been merged into `main`.
- Production runtime includes R6 profile help, privacy-safe bug-report channel, curated alias generator and its supporting documentation/backend contract.
- Reference `main` snapshot at the start of this admin-state documentation operation: `285303c5559418a3bd4403ddda44e0cd56b49576`.
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

### Current verified DB snapshot

Read-only verified immediately before/after owner-membership activation on **2026-09-10**:

- `public.profiles` = **16**
- `public.reviews` = **11**
- `public.review_likes` = **16**
- `public.review_replies` = **6**
- `public.admins` = **1**

The only intentional database change in this operation was `public.admins: 0 → 1`. The other four table counts were identical before and after the membership insert.

These are **snapshot counts**, not invariants. They can naturally change after normal user/admin activity.

### Operational lesson

The Supabase Free project previously entered `INACTIVE`, was manually resumed, and was then verified `ACTIVE_HEALTHY`.

If reviews/profiles suddenly fail globally, first verify the Supabase project status before assuming the frontend is broken.

## Admin state

- Existing admin UI: `/admin/index.html` + `/js/admin.js` (REVIVAL R1 control panel; no redesign is required for initial activation).
- Existing authorization path: `email/password → Supabase Auth → auth.users.id → public.admins → is_admin_v1() → admin RPC`.
- Existing panel supports login/logout, review list/search/filter/sort/refresh, hide/unhide, pin/unpin, delete review and official reply.
- Admin backend RPC/functions are present.
- The dedicated technical owner Auth user was created manually by the project owner through Supabase Dashboard using the supported email/password Auth flow.
- Read-only verification on **2026-09-10** confirmed exactly one matching Auth user; provider `email`, email confirmed, and `is_anonymous = false`.
- Owner membership is active in `public.admins` with `role = 'owner'`.
- Current verified `public.admins` count: **1**; no other admins were present at verification.
- The membership row joins correctly to the verified `auth.users` row, confirming the FK target exists.
- Backend authorization membership is therefore ready for the normal admin flow.
- **Password login: NOT VERIFIED — connector/tool limitation.** The connected Supabase toolset does not expose an ordinary user password sign-in action, and no JWT/service-role impersonation or Auth-internal workaround was used.
- Because a real user session could not be established through the available tool, `is_admin_v1()` was not executed under the owner's actual password-auth session and remains part of the first real UI smoke test.
- Admin activation must not be described as a fully user-tested moderation flow yet.

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

**first real `/admin/` login + admin UI functional smoke test → responsive/mobile pass**

- The dedicated Auth user and owner membership now exist and are verified at database level.
- The next real owner action is normal password login through the existing `/admin/` UI, which will exercise the frontend session, `is_admin_v1()` and the normal panel bootstrap flow.
- Do not claim moderation UI is fully tested until that real owner/admin smoke check occurs.
- Do not manually call `admin_ensure_official_profile_v1()` before that UI flow; let the existing frontend perform its normal bootstrap.
- Responsive/mobile implementation is a separate workstream and must follow `VISUAL-SYSTEM.md`; it is not authorized by the existence of backlog notes alone.
