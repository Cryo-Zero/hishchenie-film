# P16 QA checklist

## Static
- [x] P16 cache-bust/version markers applied.
- [x] No media duplicated.
- [x] Cast actor names hidden only in the left rail; source data retained for dossier.
- [x] Review toolbar contains only New / Old / Popular.
- [x] Review service badge exists once and is inside PUBLIC FEED.
- [x] Reviews page brand points to `index.html` (exact page top, no `#top`).
- [x] Reviews page contains right system rail.

## Runtime expectations
- Right rail fill uses `height` 0–100% according to page scroll.
- Dossier does not move the left list. Re-click selected subject returns to `???`.
- P16 channel badge calls `get_public_channel_state_v1` and shows CLOSED while write RPC privileges are revoked.
- Audience Pulse amplitude/speed tracks average rating; density tracks total signal count.

## Deferred
- CAPTCHA / Turnstile.
- Review realtime/live refresh and the disappearing-feed race investigation.
- Full mobile-specific patch.
- Admin UI hardening/final naming.

## Supabase
- [x] `get_public_channel_state_v1()` exists and is callable by anon/authenticated.
- [x] Production state currently reports reviews/likes/replies disabled.
- [x] No review data was created by this patch.
