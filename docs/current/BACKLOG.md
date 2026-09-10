# HISHCHENIE / THEFT — backlog

> **Presence in this file is not approval for implementation. Every feature or change requires explicit approval before development.**

> **Наличие идеи в этом файле не означает разрешение на реализацию. Любая функция или изменение требует отдельного явного согласования до начала разработки.**

This file remembers future or historical ideas. Before implementing anything here, first verify the current production state and obtain explicit approval.

## NEXT / near-term

### Admin activation / first UI smoke test

Technical owner identity:

`zero@hishchenie.invalid`

Completed:

1. project owner manually created the dedicated Supabase email/password Auth user through Supabase Dashboard;
2. bridge verified exactly one matching user, with provider `email`, confirmed email and `is_anonymous = false`;
3. bridge added that verified Auth UUID to `public.admins` with `role = 'owner'`;
4. database-level membership/FK was verified; `public.admins = 1` and no other admins were present at verification;
5. `profiles`, `reviews`, `review_likes` and `review_replies` counts were unchanged by the membership operation.

Not yet verified:

- ordinary password sign-in through a real user session;
- `is_admin_v1()` under that actual password-auth session;
- full admin UI/moderation smoke behavior.

Reason: the connected Supabase toolset does not expose an ordinary password sign-in action. Do not substitute JWT manipulation, service-role impersonation or Auth-internal workarounds as proof of user login.

Next approved verification step:

1. owner opens `/admin/`;
2. performs the first real ordinary password login;
3. confirms the existing panel boots normally and `is_admin_v1()` allows access;
4. performs only the separately approved smoke checks;
5. signs out when testing is complete.

Do not manually call `admin_ensure_official_profile_v1()` before that normal UI flow. Do not treat this backlog entry as permission to add/redesign admin features or perform moderation actions.

The temporary admin test password may be used only for explicitly authorized authentication/smoke tests. It must not be stored in GitHub/docs or repeated in reports.

### Responsive/mobile release

After successful first admin UI smoke verification, open a separate responsive/mobile branch/workstream.

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
