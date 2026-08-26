# HISHCHENIE / THEFT — project state at REVIVAL R6

## Canonical runtime files
- `/index.html` — main public page / section-scene navigation.
- `/reviews.html` — public response workspace.
- `/css/site.css` — active shared visual system.
- `/js/site.js` — public page interactions, exact section landing, gallery, cast and FAQ.
- `/js/public-response.js` — anonymous profile, ratings/reviews, likes/replies, live sync and R6 profile/report UI.
- `/admin/index.html` + `/js/admin.js` — old REVIVAL R1 moderation frontend; backend exists but admin enrollment is currently separate work.

## Backend baseline
- Supabase project: `xltwwvutqkpmtmlavngi`.
- Anonymous viewer identity only; no viewer email/password/social login.
- One review per anonymous identity.
- Review deletion cascades its replies and likes.
- Raw community tables are not the intended browser write surface; current writes use RPCs.
- R6 requires `docs/database/supabase/REVIVAL-R6_unique_aliases.sql` before frontend publication.

## Release lineage
- P10-P18: foundations and review/system work.
- P20-P22: rejected large redesign experiments. Keep for history only.
- REVIVAL R1-R5: return to the approved direction and stabilize it.
- REVIVAL R5: stable pre-R6 baseline.
- REVIVAL R6: profile help, bug reporting, curated numbered aliases and database-enforced alias uniqueness.

## Repository housekeeping rule
Do not remove historical material without explicit approval. Runtime files stay at stable public URLs; documentation belongs under `/docs`, historical code under `/archive`.
