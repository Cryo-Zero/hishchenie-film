# REVIVAL R6 — QA

## Scope
- Profile `?` help overlay: no composer reflow, RU/EN, close with × and Escape.
- QUERY_08 title remains the project joke; answer now explains browser-bound anonymous identity.
- Bug report channel available from both public-page footers; diagnostics contain no profile/review identifiers.
- New alias generator uses 98 curated RU/EN bases and always adds a visible 3-digit number; arbitrary adjective/noun mixing is no longer used for new aliases.
- Legacy alias renderers remain intact for already stored profiles; `Тот, Кто Ждёт` / `Тот, Кто Помнит` are excluded from new generation.
- Supabase unique alias index is required before publishing R6.

## Static checks
- `node --check js/public-response.js` and `js/site.js`.
- no duplicate IDs in `index.html` / `reviews.html`.
- all used i18n keys exist RU/EN.
- CSS parses with no fatal errors.

## Regression
1. Desktop scene geometry remains R5-identical with overlays closed.
2. Profile alias/avatar reroll still patches own review/replies immediately.
3. Create/edit/delete review, likes and replies remain unchanged. Deleting a review still cascades replies/likes server-side.
4. Generate many aliases; every new alias is `curated_<base> + number`, renders as a meaningful base plus a 3-digit number, and stays ≤40 chars in RU/EN.
5. Verify legacy aliases still render exactly as before for existing stored alias codes.
6. No duplicate visible alias can be persisted after the R6 index is applied.
7. On forced alias collision, client rerolls transparently and retries.
8. Bug report opens GitHub Issues in a new tab and optional diagnostics copy works.
9. Refresh/hash behavior from R5 remains unchanged.
10. Test RU → EN → RU for help/report/FAQ.
