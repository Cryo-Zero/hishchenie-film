# HISHCHENIE / THEFT — current project state

Last consolidated project-memory backfill: **2026-09-09**.

This file contains facts that are true now or explicitly marked as snapshots/reference points. For rationale and durable rules, see `DECISIONS.md`; for unapproved future ideas, see `BACKLOG.md`.

## Production

- Production release: **REVIVAL R6**.
- PR #17 (`REVIVAL R6 — profile safety, bug report and curated aliases`) has been merged into `main`.
- Production runtime now includes the R6 profile help, privacy-safe bug-report channel, curated alias generator and its supporting documentation/backend contract.
- Reference `main` snapshot at the start of this memory-backfill operation: `ddc3542c5d31e544eee1db29b7ea8aa5712e218f`.
- The SHA above is a **snapshot/reference point, not a permanent latest-main pointer**. Documentation-only commits after that point naturally advance `main` without changing the production runtime.

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
- Planned owner login `zero@hishchenie.invalid` is **not created yet**. Its activation remains the next explicit admin task; password must not be stored in GitHub/docs.

## Canonical runtime files

- `/index.html` — main public page / scene navigation.
- `/reviews.html` — public response workspace.
- `/css/site.css` — active shared visual system.
- `/js/site.js` — section navigation, archive, actors and FAQ interactions.
- `/js/public-response.js` — anonymous profiles, ratings/reviews, likes/replies, live sync and R6 profile/report UI.
- `/admin/index.html` + `/js/admin.js` — existing moderation frontend.

## Current release characteristics

REVIVAL R6 adds without redesigning the approved desktop world/grid contract:

- profile `?` help overlay and browser-bound identity explanation;
- expanded FAQ `QUERY_08` answer while keeping the joke title;
- `REPORT // СООБЩИТЬ О БАГЕ` opening GitHub Issues with privacy-safe diagnostics;
- curated bank of exactly 98 RU/EN nickname bases;
- mandatory visible 3-digit number for new nicknames;
- `curated_*` alias codes and transparent collision reroll/retry;
- legacy alias rendering retained for existing stored profiles.

Detailed R6 release documentation: `docs/releases/revival/R6/`.

## Release lineage / history

- P10–P18: foundations and review/system work.
- P20–P22: rejected large redesign attempts; historical reference only. Code is preserved in `archive/rejected-redesigns/`.
- REVIVAL R1–R5: return to the approved direction and stabilization.
- REVIVAL R5: approved recovery baseline before R6.
- REVIVAL R6: **current production release**.

Do not delete historical material without explicit approval. Current-memory files summarize history rather than duplicating full release notes.

## Current next phase

Current direction:

**Admin activation / admin improvements → responsive/mobile pass**

- First: activate the existing admin path with an explicitly approved owner Auth identity; do not redesign the panel merely to activate it.
- Then: open a separate responsive/mobile workstream based on the responsive philosophy in `DECISIONS.md`.
- Fine mobile spacing/pixel-perfect polish can be a later dedicated pass after the first functionally complete mobile release.
