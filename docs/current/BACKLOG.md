# HISHCHENIE / THEFT — backlog

> **Presence in this file is not approval for implementation. Every feature or change requires explicit approval before development.**

> **Наличие идеи в этом файле не означает разрешение на реализацию. Любая функция или изменение требует отдельного явного согласования до начала разработки.**

This file remembers future or historical ideas. Before implementing anything here, first verify the current production state and obtain explicit approval.

## NEXT / near-term

### Admin activation

Planned owner identity:

`zero@hishchenie.invalid`

Current blocker: the connected Supabase bridge does not expose a documented Auth Admin create-user action.

Planned sequence:

1. project owner manually creates the dedicated Supabase email/password Auth user through Supabase Dashboard;
2. after explicit approval, bridge reads the created `auth.users.id`;
3. bridge adds only that UUID to `public.admins` with `role = 'owner'`;
4. verify backend authorization (`is_admin_v1()` and membership);
5. perform the first real owner admin-panel login / functional smoke check;
6. sign out after the authorized smoke test.

Do not bypass Auth user creation with direct `auth.users` writes, temporary Edge Functions, installed HTTP/`pg_net` workarounds or undocumented mechanisms.

The temporary admin test password may be used only for explicitly authorized authentication/smoke tests. It must not be stored in GitHub/docs or repeated in reports.

### Responsive/mobile release

After successful admin activation/smoke verification, open a separate responsive/mobile branch/workstream.

First-pass goal: a functionally complete phone experience, not mandatory pixel-perfect polish.

Follow `VISUAL-SYSTEM.md`: preserve visual identity/meaning while allowing device-specific composition instead of literally shrinking desktop.

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

It is **not** a blocker for initial admin activation.

### Database Recovery Plan

Create a formal Database Recovery Plan in a future separately approved task.

It should define safe encrypted/private backup storage and recovery procedures without committing production dumps, credentials, password hashes, tokens/sessions or sensitive Auth data to public GitHub.

This is future work only; current repository documentation is not a production-data backup.

## HISTORICAL IDEAS / revisit only if useful

These are remembered because they may still contain useful UX directions. Some may already be partly implemented or obsolete; always verify current production before treating them as work.

- mobile burger/navigation patterns;
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
