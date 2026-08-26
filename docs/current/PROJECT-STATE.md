# HISHCHENIE / THEFT — current production state

## Production baseline
- Live `main`: REVIVAL R5 / STABLE STATE + REFRESH.
- Recovery branch: `backup/revival-r5-before-r6` at commit `61bab24b3e0a925e1e2a1591add0e4e13875ac7c`.
- R6 is prepared separately in draft PR #17 and must not be published before its Supabase migration is applied.

## Canonical runtime files
- `/index.html` — main public scene/tab site.
- `/reviews.html` — public response workspace.
- `/css/site.css` — active visual system.
- `/js/site.js` — section landing, archive, cast and FAQ interactions.
- `/js/public-response.js` — anonymous profile, ratings/reviews, likes/replies and live sync.
- `/admin/index.html` + `/js/admin.js` — existing old REVIVAL R1 moderation frontend; admin activation remains separate work.

## Backend baseline
- Supabase project: `xltwwvutqkpmtmlavngi`.
- Viewer identity is anonymous; no normal viewer email/password/social login.
- One review per anonymous identity.
- Review deletion cascades replies and likes.
- Public writes use server-side RPCs rather than direct raw-table writes.

## Visual contract
- Desktop sections behave as composed scenes with their own geometry.
- The shared support/world grid is intentional.
- ARCHIVE is the deliberate exception that may extend beyond the global content grid.
- P20–P22 are rejected redesign experiments and are historical only.
