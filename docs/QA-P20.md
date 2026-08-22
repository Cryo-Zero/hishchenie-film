# P20 — QA checklist

## Automated checks completed
- `p20-designer.js`: Node syntax check PASS.
- `index.html`: no duplicate IDs.
- `reviews.html`: no duplicate IDs.
- FAQ entries: 8.
- Archive entries: 11 existing author files.
- CSS block count balanced.
- P20 CSS/JS references present on both pages.
- No Supabase secret/service-role key added.
- No new canonical actor/film imagery included.

## Desktop acceptance pass
Recommended viewport: 1920×1080 and 1440×900.

### Header
- Brand, navigation and controls fit on one line.
- Left/right global gutters appear symmetric.
- Rating remains clickable.
- RU/EN control still works.

### Hero
- Content starts on the same global left guide used by later sections.
- Official poster does not touch the browser wall.
- CTA buttons remain usable.

### Archive
- Closed: only the ARCHIVE tab protrudes from the left wall.
- Open: drawer slides from the wall and the tab moves with it.
- Main page content does not shift horizontally.
- Selecting a thumbnail updates the main frame and keeps the drawer open.
- Opening the image viewer keeps the drawer open behind the overlay.
- Viewer image is contained/zoomed rather than stretched to the whole screen.
- Previous/next works in both stage and viewer.
- Closing viewer returns to the same archive state.

### Trailer
- Video controls work.
- Poster/preview and aspect ratio remain correct.

### Cast
- SUBJECT list does not shift when dossier content changes.
- Selecting a subject highlights only one row.
- Closing returns dossier to ??? state.

### FAQ
- On page entry no question is selected; response shows ???.
- Each of the 8 questions fills the response panel.
- Status box remains vertically fixed for both short and long answers.
- RU/EN switching does not break selected FAQ state.

### Reviews
- Profile controls still render.
- Sort controls remain New / Old / Popular.
- Backend channel status remains visible.
- If publishing is closed, submit controls stay blocked by existing backend/frontend logic.
- No duplicate home-page rating card was added.

### Navigation regression
- From reviews.html, clicking the brand returns to index.html top.
- All index anchors land on the intended section.

## Deliberately not changed in P20
- Supabase schema/RLS.
- Admin backend.
- Review anti-spam/CAPTCHA.
- Mobile-specific redesign beyond basic safe fallback.
- Film canon/content not explicitly confirmed by the author.
