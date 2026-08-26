# P14 — QA report

## Главный дефект P13
В production-логах последняя попытка дошла до `POST /auth/v1/signup = 200` и создания профиля, но `POST /reviews` не последовал. Поэтому P14 устраняет саму многошаговую цепочку: `submit_my_review_v4()` создаёт/обновляет профиль и отзыв одной серверной транзакцией и возвращает JSON.

## Backend
Проверено в транзакциях с rollback:
- rating 0..10;
- create/update/delete own review;
- create/update profile;
- like/unlike;
- one-level reply;
- sanitized public feed;
- official-reply filter;
- hidden reviews excluded from stats/feed;
- raw `profiles`, `reviews`, `review_stats` revoked from browser roles;
- после QA в production: 0 reviews / 0 likes / 0 replies.

## Concurrency / abuse cases
Frontend guards:
- shared auth promise;
- single refresh promise;
- single identity/profile promise;
- Web Locks between tabs + short fallback lease;
- duplicate Publish blocked while write is in flight;
- profile rerolls blocked during review write;
- feed sequence number prevents old slow response replacing newer sort/filter;
- per-review locks for like/reply/delete.

## Session recovery
- temporary network/VPN timeout does not discard identity;
- only explicit 400/401 refresh rejection clears stale session and allows a fresh anonymous identity;
- P14 has a new localStorage namespace (`auth-v4`), so old experimental P10–P13 sessions are not reused.

## Security / privacy
- only publishable Supabase key in browser;
- no service-role/secret key;
- user text inserted via `textContent`;
- public review feed contains no `user_id` UUID;
- profile pictures are local generated assets, not user uploads;
- admin RPCs re-check membership server-side.

Supabase Advisor notes that remain by design:
- public SECURITY DEFINER read RPCs are intentionally exposed because raw tables are closed;
- authenticated SECURITY DEFINER mutation RPCs are intentionally exposed and derive identity via `auth.uid()`;
- anonymous Auth warning is expected for the no-registration model;
- leaked-password warning is irrelevant to anonymous visitors; it matters only for future admin accounts.

Performance advisor after hardening: only `reviews_rating_idx` is reported unused while the table is empty.

## Static frontend checks
- JS syntax: public-response.js, site.js, admin.js — PASS;
- CSS parser errors — 0;
- duplicate HTML ids — 0;
- 136 i18n keys used by pages, missing RU — 0, missing EN — 0;
- six local profile avatar WebP assets included (~20–35 KB each).

## Visual fixes
- ARCHIVE stage now has a defined height and `object-fit: contain`;
- blurred background fill preserves cinematic wide frame without stretching portrait posters;
- archive arrows reduced and faded;
- audience score moved to an early compact block on main page;
- full reviews live on a separate page;
- FAQ/security easter egg/current signal/subject dossier included.

## Still requires the first real production smoke test
No local/mock test can replace:
GitHub Pages -> visitor browser -> Supabase Auth -> `submit_my_review_v4`.
After deployment, the success criterion is one real review visible in the database/feed and a successful update/delete path.
