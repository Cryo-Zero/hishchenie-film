# HISHCHENIE / THEFT — current project state

Last production/backend verification: **2026-09-09**.

## Production

- `main` is still the **REVIVAL R5 production baseline** while PR #17 remains unmerged.
- R6 frontend is in branch `revival-r6-profile-safety-report`.
- PR: `#17 — REVIVAL R6 — profile safety, bug report and curated aliases`.
- The R6 frontend is **not merged or published yet**.

## Recovery

- Recovery branch: `backup/revival-r5-before-r6`.
- Recovery commit: `61bab24b3e0a925e1e2a1591add0e4e13875ac7c`.

## R6 frontend

REVIVAL R6 adds the following without redesigning the approved R5 desktop world/grid contract:

- profile `?` help overlay;
- explanation that anonymous identity is bound to this browser profile;
- expanded answer for FAQ `QUERY_08` while keeping its existing joke title;
- `REPORT // СООБЩИТЬ О БАГЕ` channel;
- privacy-safe diagnostics without profile UUID, alias or review text;
- curated bank of exactly 98 meaningful RU/EN nickname bases;
- every newly generated nickname is `meaningful base + 3-digit number`;
- legacy alias renderers remain intact for existing stored profiles;
- new alias collisions are handled by client reroll/retry;
- approved desktop scene/grid geometry remains the R5 contract.

## Supabase / R6 backend

- Project: `xltwwvutqkpmtmlavngi` (`hishchenie-film`).
- Migration `20260908155140_revival_r6_unique_aliases`: **APPLIED**.
- Index `profiles_unique_alias_identity_idx`: **exists and UNIQUE** on `public.profiles`.
- Canonical duplicate groups after migration: **0**.
- The migration did not change user-data rows; it created the unique index and its comment.
- `official_team`, NULL aliases and empty aliases are intentionally excluded from the index predicate.
- New `curated_*` identity includes both `alias_code` and `alias_number`.
- Source SQL: `docs/database/supabase/REVIVAL-R6_unique_aliases.sql`.
- Applied-state record: `docs/database/supabase/REVIVAL-R6-APPLIED.md`.

## Current DB snapshot

Read-only production check on **2026-09-09**:

- `public.profiles` = **16**
- `public.reviews` = **11**
- `public.review_likes` = **16**
- `public.review_replies` = **6**
- `public.admins` = **0**

`admins = 0` means admin enrollment is still separate future work. The existing admin frontend is the old **REVIVAL R1** moderation UI; do not treat its presence as proof that an admin account has been enrolled.

## Canonical runtime files

- `/index.html` — main public page / section-scene navigation.
- `/reviews.html` — public response workspace.
- `/css/site.css` — active shared visual system.
- `/js/site.js` — public page interactions, exact section landing, gallery, cast and FAQ.
- `/js/public-response.js` — anonymous profile, ratings/reviews, likes/replies, live sync and R6 profile/report UI.
- `/admin/index.html` + `/js/admin.js` — old REVIVAL R1 moderation frontend.

## Important invariants

- Viewer auth/identity remains anonymous.
- No viewer email/password/social login.
- One review per anonymous identity.
- Deleting a review cascades its replies and likes.
- Public community writes use the established server-side RPC surface rather than direct raw-table writes.
- Approved desktop scenes and the shared world/grid contract must not be casually redesigned.
- ARCHIVE is the deliberate layout exception and may extend outside the common support grid.
- Historical material must not be deleted without an explicit decision; rejected work belongs in history/archive, not in the active baseline.

## Operational note

The working Supabase project was observed in an `INACTIVE` state and was restored. After restoration it was verified as `ACTIVE_HEALTHY`, and the R6 migration/backend checks completed successfully.

If `public-response` suddenly stops working across the site, first verify the Supabase project status before assuming the frontend is broken.

## Release lineage

- P10–P18: foundations and review/system work.
- P20–P22: rejected large redesign experiments; historical only.
- REVIVAL R1–R5: return to the approved direction and stabilization.
- REVIVAL R5: current production baseline until PR #17 is merged.
- REVIVAL R6: frontend prepared in PR #17; backend already applied and verified.

## Repository housekeeping rule

Do not remove historical material without explicit approval. Runtime files stay at stable public URLs; documentation belongs under `/docs`, historical code under `/archive`.

## Next step

**R6 backend complete and verified. Next: final frontend/PR verification → mark PR #17 ready → merge only after explicit approval.**
