# P21 QA — TRUE DESIGNER EDITION

## Static validation completed

- HTML parsed successfully for `index.html` and `reviews.html`.
- Duplicate HTML IDs: **0** on both pages.
- JavaScript syntax (`node --check`): **PASS** for `site.js` and `public-response.js`.
- CSS parser (`tinycss2`): **0 parser errors** in `site.css` and `p21-designer.css`.
- All `data-i18n`, `data-i18n-aria`, `data-i18n-alt`, and `data-i18n-placeholder` keys used by the HTML exist in the client translation map.
- P20 designer files are no longer referenced.
- Supabase URL/publishable-key model is unchanged; no secret/service-role key was introduced.

## Behaviour preserved / rebuilt

- sticky desktop header + active section navigation;
- exact `#top` behaviour on the main page;
- right-side page progress rail;
- RU/EN toggle;
- header audience score;
- ARCHIVE drawer, author-file selection, previous/next, dots;
- archive overlay viewer with contained image, previous/next and counter;
- drawer stays open while the image viewer is open;
- trailer file path preserved;
- SUBJECT list + stable DOSSIER panel;
- audience score/pulse bindings;
- FAQ standby state + stable SYSTEM RESPONSE panel;
- contact signal;
- anonymous profile, avatar/alias, rating/review UI and review feed IDs used by the Supabase client.

## Recommended post-deploy checks

1. Hard refresh after GitHub Pages deploy.
2. Verify footer says `BUILD // P21 // TRUE DESIGNER EDITION`.
3. Click brand from `reviews.html`; it must land at the exact top of the home page.
4. Open ARCHIVE: drawer must slide from the left wall and the tab must move with it.
5. Choose 3–4 archive files, then open the large viewer and use arrows; drawer should remain open underneath.
6. Test SUBJECT_01, SUBJECT_03, then close DOSSIER to return to `???` state.
7. Open FAQ questions with short and long answers; the system panel should not move vertically.
8. Switch RU → EN → RU and repeat SUBJECT / FAQ selection.
9. Confirm the review channel remains closed if Supabase is still configured as closed.
10. Test at 1920×1080 and 1366×768 before evaluating spacing.
