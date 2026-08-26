# Supabase backend state — REVIVAL R1

Migration already applied to project `xltwwvutqkpmtmlavngi`:
`revival_r1_reviews_reopen_human_check`

It added server-only tables:
- `review_challenges`
- `community_rate_events`

Both have RLS enabled and no direct anon/auth table privileges.

New RPCs:
- `create_review_challenge_v1()`
- `submit_my_review_v5(...)`
- `toggle_review_like_v2(uuid)`
- `save_review_reply_v2(uuid,text)`
- `get_public_channel_state_v2()`
- `admin_get_reviews_v2()`

Limits:
- human challenges: max 8 / 10 minutes / profile
- review writes: max 5 / 10 minutes / profile
- like toggles: max 40 / 10 minutes / profile
- reply writes: max 12 / 10 minutes / profile
- challenge validity: 5 minutes
- first review requires challenge; later edits do not

Old public write entry points remain revoked so stale/cached clients cannot bypass
REVIVAL R1 verification and rate limits.

Public read RPCs remain intentionally accessible because the review feed and its
aggregate stats are public website content.
