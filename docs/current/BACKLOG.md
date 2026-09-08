# HISHCHENIE / THEFT — backlog

> **Presence in this file is not approval for implementation. Every feature or change requires explicit approval before development.**

> **Наличие идеи в этом файле не означает разрешение на реализацию. Любая функция или изменение требует отдельного явного согласования до начала разработки.**

This file remembers future or historical ideas. Before implementing anything here, first verify the current production state and obtain explicit approval.

## NEXT / near-term

### Admin activation

Planned owner identity:

`zero@hishchenie.invalid`

Planned sequence:

1. create it as a Supabase email/password Auth user using the normal Auth mechanism;
2. obtain its `auth.users.id`;
3. add that UUID to `public.admins` with `role = 'owner'`;
4. verify the existing admin login/moderation flow.

**Do not perform this as part of documentation/project-memory work.**

The password must be long, unique and must not be stored in GitHub/docs.

### Responsive/mobile release

After admin activation, open a separate responsive/mobile branch/workstream.

First pass goal: a functionally complete phone experience, not mandatory pixel-perfect polish.

Follow the responsive philosophy in `DECISIONS.md`: preserve the same visual system and meaning, but allow phone/tablet-specific compositions rather than shrinking desktop literally.

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
