# P17 QA checklist

## Static
- [x] `public-response.js` passes `node --check`.
- [x] `index.html` duplicate IDs: 0.
- [x] `reviews.html` duplicate IDs: 0.
- [x] P17 cache/build markers applied.
- [x] Ten new WebP avatars are 512×512.
- [x] Avatar library size is 16; existing DB `avatar_style` 1..6 remains compatible.

## Layout intent
- [x] Desktop `.shell` and `.hero-inner` use one `--support-max` / `--support-gutter` system.
- [x] Left/right global outer margins are computed symmetrically.
- [x] Main sections, header, community hero/workspace and audience strip share the same outer guides.
- [x] SUBJECTS list and dossier keep different widths but share the global external grid.
- [x] Mobile <=820px falls back to equal 13px safe gutters.

## Backend
- [x] P17 does not change database schema.
- [x] Review write channel remains closed; P17 only reads the existing public channel state.
