# HISHCHENIE / THEFT — durable decisions

This document stores long-lived decisions and the reasoning/constraints behind them. It is not a release log and not a task list.

## Workflow / governance

- For substantial visual, architectural or backend-semantic changes, the required flow is: **feedback → explicit approval → implementation**.
- Do not delete files, history, archive material or project behavior without explicit owner approval.
- Old ideas are not automatically current tasks.
- Historical backlog should be remembered, but implementation requires fresh approval.
- Rejected redesigns must not be revived automatically.
- Do not invent film-author data, contacts, release facts or other public information that is not actually present/confirmed in the project.
- When a task says read-only, do not self-fix discovered problems; report them first.

## Visual / world contract

- Desktop is the primary visual reference for the site.
- The site is **not** intended as a conventional long landing page. Most major sections behave as distinct scene-like screens/tabs connected by a shared visual/world grid.
- Preserve bespoke motion, composition and interface character, especially:
  - Actors;
  - FAQ;
  - Archive;
  - scene navigation.
- `Материалы / Archive` is an intentional layout exception and may extend beyond the main grid composition.
- Do not redesign the approved desktop composition without a separate reason and explicit approval.
- P20/P21/P22 are rejected redesign attempts and historical reference only.

## Responsive philosophy

There is no simple model of **desktop + shrunken desktop**.

Responsive work should create different representations of the same visual system while preserving identity, meaning and function.

### Desktop

- Desktop remains the visual benchmark and should not be casually simplified to satisfy mobile constraints.

### Phones

Phone layouts may legitimately use:

- changed composition;
- element relocation;
- sequential presentation of content that appears simultaneously on desktop;
- replacement/reduction of some effects;
- simplified scene layouts;
- a different navigation pattern.

This is acceptable if the phone version preserves:

- visual language;
- atmosphere;
- typographic hierarchy;
- system/archive character;
- meaning and functionality.

Do not literally squeeze complex desktop scenes into 390–430 px. Example: a two-column desktop FAQ does not need to remain two columns on a phone.

### Tablets

- Tablet landscape should remain as close to desktop as practical.
- Tablet portrait may use stronger adaptation.

### Portrait desktop monitors

- Portrait orientation alone does not mean “phone”. A large portrait monitor with mouse/desktop input remains desktop context.

### Inputs / browser / platform

Responsive decisions must consider more than `width`, including:

- viewport height;
- aspect ratio;
- portrait/landscape;
- `hover` capability;
- pointer type;
- touch;
- `dvh` / `svh`;
- safe-area insets;
- browser UI behavior;
- HiDPI/Retina;
- browser zoom/scaling.

Real target contexts include Android phones, iPhone/iOS Safari, tablets, Windows desktop/laptop, macOS desktop/MacBook, wide monitors, low-height laptops and portrait monitors.

OS name alone must not determine layout. Viewport geometry, input capabilities and browser behavior matter more.

## First mobile release goal

The first responsive/mobile pass exists mainly so the client and other users can fully use the site from a phone.

First-pass priorities:

- every main scene is accessible;
- nothing critical collapses or becomes unreachable;
- text remains readable;
- controls work with touch;
- trailer, materials, actors, reviews, FAQ and profile remain accessible;
- key animations/site character are preserved where reasonable.

Minor spacing and pixel-perfect corrections can be deferred to a separate polish pass.

## Visitor identity / auth / privacy

- Normal visitors use Supabase **anonymous auth**.
- There is no normal viewer registration flow.
- No viewer email/password login.
- No social login.
- No user photo upload.
- One browser-bound anonymous profile per identity context.
- One review per anonymous profile.
- Clearing site data, changing browser or changing device may remove the ability to edit an old review.
- Do not promise recovery of anonymous identity.
- Public profiles must not expose technical Auth IDs.

## Review system

Implemented durable principles:

- integer score `0..10`;
- freshness-positive range `7..10`;
- sorting: Popular / New / Old;
- average score + count;
- anonymous viewer profile;
- reactions/likes;
- replies;
- human-check;
- official team replies;
- RU/EN.

### Delete-review semantics

Deleting a review cascades deletion of related:

- review replies;
- review likes.

The profile itself remains.

This cascade was explicitly approved and must not change accidentally.

## R6 alias system

New profile generation uses:

- curated nickname bank;
- exactly 98 RU/EN bases;
- mandatory visible 3-digit number;
- alias code form `curated_*`;
- database canonical identity = alias code + alias number.

Legacy renderers remain for already stored profiles. Do not automatically rename legacy profiles.

Excluded from **new** curated generation:

- `Тот, Кто Ждёт`;
- `Тот, Кто Помнит`.

`Инспектор` is an allowed standalone nickname base.

Do not claim mathematical global uniqueness for arbitrary historical display strings. The guarantee is the current canonical identity enforced by the database plus the verified production state.

## Admin architecture

Current admin authorization path:

`email/password → Supabase Auth → auth.users.id → public.admins → is_admin_v1() → admin RPC`

`public.admins` contract:

- `user_id uuid` primary key;
- foreign key → `auth.users(id) ON DELETE CASCADE`;
- allowed roles:
  - `owner`;
  - `editor`;
  - `moderator`.

Existing admin panel capabilities:

- login/logout;
- review list;
- search;
- filters;
- sorting;
- refresh;
- hide/unhide;
- pin/unpin;
- delete review;
- official reply.

Admin backend RPC/functions already exist.

Last verified pre-activation state:

- `public.admins` = `0`;
- suitable email/password Auth users = `0`.

## Planned admin owner identity

The planned technical owner login is:

`zero@hishchenie.invalid`

Decisions:

- It is **not** a public email and is not intended to be a real mailbox.
- Its purpose is only Supabase Auth login for the owner/admin panel.
- Create it using the normal Supabase Auth email/password mechanism, then add its `auth.users.id` to `public.admins` with `role = 'owner'`.
- Password must be long and unique.
- Never store the password in GitHub, project documentation or public code.
- Because the email address does not exist, email password recovery will not work; password recovery/change must be handled through Supabase management/dashboard access.
- MFA/2FA is not required for the first admin activation, but remains a possible later security improvement.
- Public nickname/official label must never depend on this technical login email.

## Bug-report privacy

REVIVAL R6 contains `REPORT // СООБЩИТЬ О БАГЕ`, currently opening GitHub Issues with optional safe diagnostics.

Diagnostics must not include:

- UUID/profile ID;
- auth/session tokens;
- cookies;
- localStorage contents;
- review/reply content;
- secret keys;
- application-collected IP address.

## Project memory sync

From this point forward, meaningful new project knowledge should be preserved during future GitHub work, without turning documentation into a transcript.

Classify meaningful information as:

- **STATE** — a factual project state changed;
- **DECISION** — a durable rule/choice was accepted;
- **BACKLOG** — an idea should be remembered but is not approved for implementation.

Rules:

- Do not record empty conversation or routine chatter.
- Do not record random hypotheses as decisions.
- Do not turn every sentence into documentation.
- Backlog presence is never implementation approval.
- Future bridge prompts may include a `Project memory sync delta`; apply it only when it contains meaningful new STATE/DECISION/BACKLOG information.
- If there is no meaningful delta, do not change project-memory docs.

After every significant docs/project-memory update, the current production tree should be synchronized again to the reserve repository:

- repo: `Cryo-Zero/hishchenie-film-v2`;
- branch: `mirror/hishchenie-film-main`.

The reserve repository's existing `main`, `archives/`, `snapshots/` and history are separate recovery material and must not be destructively replaced merely to refresh the mirror branch.
