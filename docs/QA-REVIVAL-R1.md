# REVIVAL R1 — QA checklist

## Automated/static checks performed before packaging
- JavaScript syntax (`node --check`): PASS for site.js, public-response.js, admin.js.
- Duplicate HTML IDs: 0 in index.html, reviews.html and admin/index.html.
- CSS `{}` balance: PASS.
- RU/EN dictionaries: same key count; every `data-i18n*` key used by index/reviews exists in both languages.
- Removed write RPCs are not referenced by the client.
- Explicit `archiveFullscreen` / FULLSCREEN control is not referenced by the release.
- Avatar selection pool excludes `subject-09.webp`.
- Backend transaction test: challenge + first review v5 succeeded and was rolled back; database remained at 0 test reviews.
- Old v4 review write and old v1 like write remain revoked; v5/v2 writes are enabled.

A full real-browser smoke test was not possible in the build environment because
local/file browser navigation is blocked there. Do the following checks on GitHub Pages after merge.

## Desktop smoke test
1. Hard refresh (`Ctrl+F5`). Footer/build should say `REVIVAL R1`.
2. Trailer starts at ~35% volume. Change it, reload, confirm your chosen volume is remembered.
3. Materials section: ARCHIVE button appears from the physical left wall.
4. Open ARCHIVE: drawer slides from the wall and the button rides its right edge.
5. Click ARCHIVE again: drawer returns into the wall, button remains visible.
6. Select several thumbnails: drawer stays open and the main image changes.
7. Use left/right arrows and keyboard arrows: one image per action, no double jump.
8. Click main image: custom overlay opens; no native fullscreen button is needed.
9. Overlay: previous/next, counter, thin pagination and X work. Closing overlay does not close an already-open ARCHIVE.
10. `AUTHOR FILES // VERIFIED` remains visible.

## FAQ
1. On initial load: `QUERY_00 // STANDBY`, `???`.
2. Click each of 8 questions; answer/status/message update.
3. Click the selected question again: returns to standby.
4. Open a question and press X: returns to standby.
5. Compare a very short answer and a long answer: system panel geometry should not jump.
6. Repeat in EN.

## Reviews — first visitor
1. Open reviews in incognito/private mode.
2. Alias/avatar appear; reroll both several times. The removed cyan-eye avatar must never appear.
3. Select rating 0, then 10, then desired value. Only one value is active.
4. Click Publish once: first-write human check appears.
5. Enter a wrong answer: publication remains blocked and an error is shown.
6. Enter the correct answer: review publishes exactly once.
7. Double/triple-click Publish quickly: no duplicate review is created.
8. Edit the review: no new human challenge should be required.
9. Delete the review: it disappears and stats update.

## Reviews — two tabs / two visitors
1. Open reviews in two tabs of the same browser.
2. Publish/edit in tab A; tab B should update via BroadcastChannel/polling without a manual reload.
3. Open incognito or a second browser and publish another review.
4. Existing reviews must not disappear while the new one arrives.
5. Leave both tabs open for >30 seconds and verify the feed remains stable.
6. Disconnect network during a write: UI must leave the busy state and allow retry after reconnect.

## Strong-language display filter
1. Publish a test review containing a word that the filter recognizes.
2. Default/off: original is visible.
3. Turn `Скрывать грубую лексику` on: word is shown as asterisks.
4. `Показать оригинал` reveals only that item.
5. Reload: the filter preference is remembered locally.
6. Verify the admin panel still displays the original unmodified review.

## Likes / replies
1. Like/unlike a review repeatedly but normally; count stays consistent.
2. Open replies and add/edit your reply.
3. Delete your reply.
4. Open a second tab and confirm changes propagate.

## Admin
Requires one-time admin enrollment first.
1. `/admin/` rejects a normal/anonymous account.
2. Admin email/password signs in.
3. Search by alias/text/UID.
4. Filter Public / Hidden.
5. Sort New / Old / Rating high/low.
6. Hide a review: disappears publicly.
7. Restore it: returns publicly.
8. Pin/unpin.
9. Send an OFFICIAL reply.
10. Delete a disposable test review only after confirming the destructive action.
