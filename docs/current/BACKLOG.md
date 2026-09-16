# HISHCHENIE / THEFT — backlog

> **Presence in this file is not approval for implementation. Every feature or change requires explicit approval before development.**

> **Наличие идеи в этом файле не означает разрешение на реализацию. Любая функция или изменение требует отдельного явного согласования до начала разработки.**

Read `START-HERE.md` before using this file. This file remembers future or historical ideas only. It must not be used to infer the current active R7 correction scope.

If an item here has already become an active owner-approved task, `PROJECT-STATE.md` / `VISUAL-SYSTEM.md` / `ROADMAP.md` are authoritative and this backlog must not be used to reclassify it as unapproved.

## NEXT / near-term

There is currently **no blanket backlog item that authorizes the next implementation**.

The active R7 post-Round6 owner correction set is already approved and is tracked in current canonical state, not as a backlog proposal. See:

- `START-HERE.md`;
- `PROJECT-STATE.md`;
- `VISUAL-SYSTEM.md`;
- `ROADMAP.md`.

Do not use older backlog language about “starting responsive/mobile” to restart or redesign R7 from scratch. Responsive/mobile implementation already exists on the draft feature branch and is in owner-review stabilization.

### Admin visual refinement — future polish

The real owner smoke-test confirmed functional admin readiness for the current sequence. Admin visual refinement is intentionally postponed because the admin panel is not part of the public visitor experience.

Possible future polish may include layout/legibility/accessibility improvements if they become useful, but **this backlog entry is not permission to redesign the admin panel now**.

## COMPLETED / CURRENT CONTEXT

### Responsive/mobile implementation context

Responsive/mobile is no longer a future backlog workstream. REVIVAL R7 exists on `revival-r7-responsive-mobile` under draft PR #18 and has gone through multiple owner-feedback rounds.

Round 6 reached verified SHA `f5e154912986c95e7f48a15bce34c707db39667c` and passed its defined automated browser gate, but owner visual acceptance remains pending and a newer bounded correction set is approved for implementation.

This factual context is included only to prevent stale backlog interpretation. The actual active visual rules live in `VISUAL-SYSTEM.md`.

### Admin activation + first real UI smoke-test

Completed:

- dedicated owner email/password Auth user created manually through Supabase Dashboard;
- owner membership active in `public.admins` with `role = 'owner'`;
- real browser email/password login succeeded through `/admin/`;
- admin panel opened and review list loaded;
- search, filters and sorting worked;
- Hide / Pin / Delete / Official Reply controls were available;
- an official reply was sent and appeared on the public site;
- one test review was deleted and the deletion reflected on the public site quickly;
- admin/site interaction was responsive enough for current functional use.

This is a completed smoke-test milestone, not an authorization to perform further moderation actions or implement new admin features.

The temporary admin test password may be used only for explicitly authorized authentication/smoke tests. It must not be stored in GitHub/docs or repeated in reports.

## FUTURE IDEAS

### Bug Reports v2

Possible future replacement/extension of the current GitHub Issues flow:

`public site → Supabase bug_reports → admin panel`

Possible visitor UI:

- category;
- description;
- privacy-safe technical diagnostics;
- send action.

The older candidate status sketch below is historical and is superseded by the more specific Round4 planning direction later in this file:

- `NEW`;
- `CHECKING`;
- `FIXED`;
- delete/spam handling.

GitHub Issues may remain as a developer fallback.

**This is backlog only. Do not implement without separate approval.**

The public wording `Сообщить о баге` is not permanently fixed and may be reconsidered later.

### MFA / 2FA for admin

MFA/2FA for the admin account may be added later if useful.

It is **not** a blocker for the current admin flow.

### Database Recovery Plan

Create a formal Database Recovery Plan in a future separately approved task.

It should define safe encrypted/private backup storage and recovery procedures without committing production dumps, credentials, password hashes, tokens/sessions or sensitive Auth data to public GitHub.

This is future work only; current repository documentation is not a production-data backup.

## HISTORICAL IDEAS / revisit only if useful

These are remembered because they may still contain useful UX directions. Some are already partly/fully implemented or superseded; always verify current state before treating them as work.

- mobile burger/navigation refinements;
- touch-friendly hit targets;
- gallery/pagination arrows vertically centered with larger hit areas;
- low-height desktop/laptop adaptations;
- responsive interpretation of the Actors scene;
- responsive/mobile interpretation of FAQ;
- responsive/mobile interpretation of Archive;
- profile/reviews mobile adaptation;
- reviews tabs/touch usability;
- smooth but safe scene transitions;
- optional future visual polish after functional responsive release;
- possible visual pulse/intensity dependence on rating — historical idea only, not an approved feature.

Several items above now have implemented R7 forms. Their continued presence here preserves history only; it does not authorize reverting the current design or reimplementing them differently.

Do not list already fully implemented functionality as mandatory future work merely because it existed in an older backlog.

## REJECTED / DO NOT REVIVE WITHOUT EXPLICIT DECISION

### P20 / P21 / P22 redesigns

P20, P21 and P22 are rejected redesign attempts preserved as historical reference.

- Their presence in history/archive does not mean they should return.
- Do not use them as the current UI baseline.
- Individual ideas may only be reconsidered if they become useful again and are explicitly approved.

Historical code is preserved under `archive/rejected-redesigns/`.

### Round 4 — accepted future items requiring separate implementation authorization

The older Bug Reports v2 sketch above remains historical. The more specific planning direction below supersedes conflicting details such as the old candidate `CHECKING` status; this is still **future work, not permission to implement now**.

- Bug Reports v2: simple category + optional `Что случилось?` details + optional diagnostics opt-in; server-side safe storage; admin `BUG REPORTS`; statuses exactly `NEW / IN PROGRESS / FIXED / CLOSED`; minimum Telegram alert; no automatic status advance on open.
- Anti-bot: evaluate Russian-hosted server-verified solutions, with Yandex SmartCaptcha a preferred research candidate; no fake local-only “I am not a robot” control.
- Admin moderation: editable reply templates that never auto-post, audit/history, and optional `ОТКРЫТЬ САЙТ ↗` shortcut without public admin mode.
- Russian backend research: first evaluate self-hosted Supabase compatibility on infrastructure physically in Russia; full Russian managed stack remains an alternative. No provider/migration is approved.
- Legal/privacy: separate personal-data/privacy policy + community rules/required consent surfaces; preserve FAQ `На сайте есть безопасность?` as artistic content.
- Legal prerequisite: confirm the actual personal-data operator identity/contact before publication; current “film author” assumption is provisional only.
