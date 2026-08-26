# REVIVAL R2 QA

## Desktop sections
Test at 1920x1080 and 1920x800.

- Header navigation lands at the exact start of ABOUT, MATERIALS, TRAILER, ACCESS, SUBJECTS and FAQ.
- Navigate to each main-page section from `reviews.html`; the same exact landing position is used.
- Clicking the brand from `reviews.html` returns to the exact top of the main page.
- MATERIALS image, controls and bottom metadata remain inside the MATERIALS viewport.
- TRAILER video and language note remain inside the TRAILER viewport.
- Section titles use the same desktop scale (max 48px).

## Gallery
- Main image arrows are single chevrons.
- Click the image: custom large viewer opens.
- Viewer counter is at the upper-left and does not overlap progress marks.
- Viewer progress remains at the bottom center.
- Arrow keys and visible arrows change the image.
- ARCHIVE drawer remains open if it was open before the large viewer.

## FAQ
- No question selected: STANDBY state is shown.
- Open QUERY_01, then QUERY_02: the system-information box stays on the same horizontal guide.
- Long and short answers do not move the system box.
- Values reveal progressively top-to-bottom.
- Click the active question again or `×`: return to STANDBY.

## Reviews
- A new review can be submitted with the button.
- A new review can be submitted with ENTER.
- SHIFT+ENTER creates a line break and does not submit.
- Delete your review, then create another review; a new human check is expected because it is a new review.
- Leave a reply open for at least 30 seconds. It must not disappear/reappear during background sync.
- Type into an open reply composer while background sync runs; the draft should not be replaced by a refresh.
- Toggle strong-language filtering; demo reviews/replies containing strong language are masked and can be revealed.
- Switch New / Old / Popular and verify stable ordering.

## Demo content
Expected seed: 10 synthetic reviews, 6 replies. These are test content, not audience reviews.
