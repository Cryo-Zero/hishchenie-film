# HISHCHENIE / THEFT — backlog

> **Presence in this file is not approval for implementation. Every feature or change requires explicit approval before development.**

> **Наличие идеи в этом файле не означает разрешение на реализацию. Любая функция или изменение требует отдельного явного согласования до начала разработки.**

This file remembers future or historical ideas. Before implementing anything here, first verify the current production state and obtain explicit approval.

## NEXT / near-term

### Responsive/mobile release

Admin activation and the first real owner browser smoke-test are completed sufficiently for the current release sequence.

The next workstream is responsive/mobile, but **the proposed responsive layouts are not approved merely because they exist in a plan**.

Required sequence:

1. review the scene-by-scene responsive direction with the owner;
2. explicitly approve substantial visual reinterpretations before final implementation whenever practical;
3. create a separate responsive feature branch only after implementation is authorized;
4. implement incrementally scene by scene while protecting approved desktop behavior;
5. validate complex stages with actual browser rendering;
6. finish with a functionally complete phone/tablet pass before optional pixel-perfect polish.

First-pass goal: a functionally complete phone experience, not mandatory pixel-perfect polish.

Follow `VISUAL-SYSTEM.md`: preserve visual identity/meaning while allowing device-specific composition instead of literally shrinking desktop.

Reference viewports for design/testing may include `390×844`, `844×390`, `430×932`, `932×430`, `768×1024`, `1024×768`, `1366×768` and `1080×1920`. These are reference contexts, not fixed breakpoint requirements.

### Admin visual refinement — future polish

The real owner smoke-test confirmed functional admin readiness for the current sequence. Admin visual refinement is intentionally postponed because the admin panel is not part of the public visitor experience.

Possible future polish may include layout/legibility/accessibility improvements if they become useful, but **this backlog entry is not permission to redesign the admin panel now**.

## COMPLETED / CURRENT CONTEXT

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

Possible categories:

- ошибка;
- визуальная проблема;
- функция не работает;
- другое.

Possible admin workflow:

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

These are remembered because they may still contain useful UX directions. Some may already be partly implemented or obsolete; always verify current production before treating them as work.

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

Do not list already fully implemented functionality as mandatory future work merely because it existed in an older backlog.

## REJECTED / DO NOT REVIVE WITHOUT EXPLICIT DECISION

### P20 / P21 / P22 redesigns

P20, P21 and P22 are rejected redesign attempts preserved as historical reference.

- Their presence in history/archive does not mean they should return.
- Do not use them as the current UI baseline.
- Individual ideas may only be reconsidered if they become useful again and are explicitly approved.

Historical code is preserved under `archive/rejected-redesigns/`.
