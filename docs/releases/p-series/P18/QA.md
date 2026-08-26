# P18 — QA checklist

## Static checks performed
- `index.html`: no duplicate IDs.
- `reviews.html`: no duplicate IDs.
- JavaScript syntax: PASS (`site.js`, `public-response.js`).
- CSS brace balance: PASS.
- i18n references used by both HTML files: all keys found.
- `reviews.html` brand target: `index.html#top`.
- Legacy home `audience-strip`: removed from `index.html`.

## Manual checks after GitHub Pages deploy
1. Hard refresh (`Ctrl+F5`).
2. Desktop header is two levels; all old navigation links remain available.
3. Materials frame is visually the same 16:9 media size as the trailer before opening.
4. Opening a material still launches the large lightbox.
5. Actors list and dossier align along the same top guide; gap between them is visible.
6. `reviews.html`: profile and PUBLIC FEED do not touch; gap is visible.
7. From Reviews click `ХИЩЕНИЕ`: main page opens at the absolute top, not Materials.
8. FAQ:
   - left query list remains fixed;
   - clicking queries changes only the right response panel;
   - QUERY_01..QUERY_10 work;
   - RU/EN switching updates list and response text.
9. Mobile/tablet: burger menu still opens and the FAQ stacks vertically.
10. Review publishing remains closed while backend channel is closed.

## No backend change
P18 contains no SQL migration and does not reopen reviews.
