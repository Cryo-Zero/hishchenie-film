# P15 SIGNAL UI — QA note

## Scope
P15 не меняет схему Supabase. Проверялись только frontend-интеграция, DOM/CSS/JS и совместимость с backend P14.

## Static checks
- `public-response.js`: Node syntax check — PASS.
- `site.js`: Node syntax check — PASS.
- CSS parsing (`tinycss2`) — 0 parser errors.
- Duplicate HTML IDs: `index.html` — 0; `reviews.html` — 0.
- i18n: 154 используемых ключа; отсутствующих RU/EN ключей — 0.
- Header rating присутствует ровно один раз на каждой публичной странице.

## Backend state checked before build
- Production содержит сохраненный тестовый review `8/10` с текстом `Тест`.
- `get_public_stats_v2()` возвращает `total_ratings=1`, `average_rating=8`, `positive_ratings=1`.
- `freshness` остается `null` до 5 оценок — это намеренная серверная логика, не ошибка UI.

## Review UX change
P14 после успешного `submit_my_review_v4()` ждал еще две сетевые операции (`stats` + `feed`) прежде чем разблокировать composer. P15:
1. ждет только завершение атомарной серверной записи;
2. сразу обновляет локальные score/count;
3. разблокирует UI;
4. запускает stats/feed reconciliation в фоне.

Это не маскирует ошибку записи: optimistic update выполняется только после успешного ответа `submit_my_review_v4()`.

## Stress/edge behavior retained from P14
- duplicate submit guard (`state.busy`);
- auth refresh lock / cross-tab fallback lock;
- one review per user on backend;
- profile + review atomic RPC;
- sanitized public feed without public UUID;
- 0..10 rating validation and 2000-char limit server-side;
- RU/EN deterministic aliases;
- no user photo uploads / no email / no phone / no password for viewers.

## Visual acceptance targets
- ARCHIVE image presentation must remain P14-identical; only arrows change.
- Actor list must never resize when selecting a subject.
- DOSSIER panel must always occupy its column, including the initial `???` state.
- On subject change, only panel contents animate; surrounding layout stays fixed.
- Reviews hero uses a left metrics block + right Audience Pulse on desktop and stacks on narrow screens.
- Header score must not force horizontal overflow; below 820px its text collapses to the circular indicator.
- Contact animation respects `prefers-reduced-motion`.
