# HISHCHENIE / THEFT — durable decisions

This document stores long-lived decisions and the reasoning/constraints behind them. It is not a release log and not a task list.

For active visual/composition laws, see `VISUAL-SYSTEM.md`. For current factual state, see `PROJECT-STATE.md`. For unapproved future ideas, see `BACKLOG.md`.

## Workflow / governance

For substantial visual, architectural or backend-semantic changes, the normal flow is:

**feedback → explicit approval → implementation → factual verification**

General rules:

- Do not delete files, history, archive material or project behavior without explicit owner approval.
- Old ideas are not automatically current tasks.
- Historical backlog should be remembered, but implementation requires fresh approval.
- Rejected redesigns must not be revived automatically.
- Do not invent film-author data, contacts, release facts or other public information that is not actually present/confirmed in the project.
- When a task says read-only, do not self-fix discovered problems; report them first.
- BACKLOG presence never means permission to implement.

### Priority of project instructions

When rules conflict, use this priority:

`current explicit owner instruction`

→ `approved scene/task-specific instruction`

→ `current canonical project rules / VISUAL-SYSTEM`

→ `historical context`

→ `BACKLOG`

A newer explicit owner instruction may intentionally change an older general rule. If a prompt appears to conflict with a newer factual state or established rule and the destructive intent is unclear, do not guess: identify the conflict and stop where clarification/approval is required.

## Verification integrity

Never report a backup, mirror, migration, deployment, check or other operation as successful merely because a command/request was sent.

Success means the claimed final state was actually verified.

If the available tool cannot prove the claimed result, report:

**NOT VERIFIED**

and the exact reason.

Do not replace verification with inference. This rule applies to all bridge/tool operations.

The previous exact reserve-mirror attempt is the reference example: it was stopped rather than publishing an incomplete copy when the full binary tree could not be reproduced and verified.

## Visual / world contract

The detailed active visual laws live in `VISUAL-SYSTEM.md` and must be read before visual/responsive work.

Durable high-level decisions:

- Desktop is the primary visual reference, not a fixed pixel canvas.
- The site is not intended as a conventional long landing page; major sections behave as distinct scene-like states connected by a shared world/system language.
- Preserve bespoke motion, composition and interface character, especially Actors, FAQ, Archive and scene navigation.
- The world grid is a default contract, not a cage. Explicit approved creative direction for a specific scene may deliberately cross normal grid/alignment boundaries.
- Materials / Archive is a known intentional exception and may extend beyond the main grid composition.
- A local grid exception must not automatically redefine the global system for all scenes.
- Do not redesign the approved desktop composition without a separate reason and explicit approval.
- P20/P21/P22 are rejected redesign attempts and historical reference only.

## Responsive philosophy

Responsive work creates different representations of the same visual system while preserving identity, meaning and function.

Do not reduce the model to `desktop + shrunken desktop` or `PC/mobile` only.

Real target contexts include wide/normal/small desktop, low-height laptops, MacBook-class laptops, portrait desktop monitors, tablet landscape/portrait and phone landscape/portrait.

Responsive decisions must consider viewport width/height, aspect ratio, orientation, pointer, hover, touch, `dvh`/`svh`, safe-area, browser UI behavior, HiDPI/Retina, scaling and zoom. OS name alone must not determine layout.

A large portrait monitor remains desktop context; tablet landscape should stay close to desktop when space allows; phone layouts may legitimately use sequential/fullscreen/sub-scene interpretations instead of literal geometric compression.

The first responsive/mobile pass prioritizes complete usability and preserved identity over pixel-perfect cosmetic polish.

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

Do not restore old public filters such as all/team reply/low-high rating without new explicit approval.

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

Historical pre-activation snapshot:

- `public.admins` = `0`;
- suitable email/password Auth users = `0`.

That snapshot is history, not current state. Current factual admin state is maintained in `PROJECT-STATE.md`.

### Owner Auth creation rule

The connected Supabase bridge does **not** expose a documented Auth Admin `create user` action.

Therefore owner Auth-user creation must use the normal supported Supabase Auth management flow outside bridge work when creation is required. For the current owner account, the project owner completed this manually through Supabase Dashboard before the membership activation step.

Do **not** bypass this limitation with:

- direct `INSERT`/`UPDATE` into `auth.users`;
- temporary Edge Functions;
- installing HTTP/`pg_net` extensions for this purpose;
- undocumented HTTP/database workarounds.

A separately authorized bridge operation may read a manually created user's UUID, add only an explicitly approved membership row to `public.admins`, and verify the database-level authorization membership.

### Admin owner identity

The technical owner login is:

`zero@hishchenie.invalid`

Decisions:

- It is not a public mailbox and exists only as technical Supabase Auth login for the owner/admin panel.
- The Auth user was created manually through Supabase Dashboard using the supported email/password Auth management flow.
- The owner membership is active in `public.admins` with `role = 'owner'`.
- Never store the password in GitHub, project documentation or public code.
- Because the mailbox is intentionally non-real, email password recovery is unavailable by design; password change/recovery must use Supabase management/dashboard access.
- MFA/2FA is not required for the first activation, but remains a possible later security improvement.
- Public nickname/official label must never depend on this technical login email.
- Database-level membership activation does not by itself prove the complete password-login/UI moderation flow; that must be verified by a real ordinary user login when the available tool/UI permits it.

### Temporary admin test credential policy

During active admin development/testing, the owner explicitly allows the bridge/operator to know and use a temporary test password **only for authorized admin authentication/smoke tests**.

This is a temporary operational policy, not a reason to publish the credential.

The password:

- must not be written to GitHub;
- must not be written to documentation;
- must not appear in commit messages;
- must not be repeated in final reports;
- must not be stored together with token/session data.

After active admin development/testing, the owner will replace the temporary password with a permanent private credential.

Knowledge of the temporary password by the authorized bridge/operator is not itself considered a security incident under this temporary policy.

## Database backup security

Production database contents and credentials must **never** be copied into public GitHub.

Public GitHub may contain:

- schema definitions;
- migrations/source SQL;
- RLS/RPC definitions;
- applied migration records;
- recovery documentation;
- safe aggregate snapshots;
- anonymized test fixtures when needed.

Public GitHub must not contain:

- full production DB dumps;
- password hashes;
- auth sessions/tokens;
- service-role/secret keys;
- private keys;
- real credentials;
- sensitive Auth data.

Real production data backups must live separately in protected/encrypted storage. A formal Database Recovery Plan remains a future task, not an automatically authorized implementation.

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

## Project memory quality / sync

Meaningful project knowledge includes not only features/backend/files but also:

- visual laws;
- composition principles;
- world-grid rules;
- deliberate exceptions;
- responsive philosophy;
- interaction philosophy;
- rejected directions;
- reasons behind important decisions;
- safety and recovery rules;
- operational lessons.

If a rule repeatedly influences project work, it may be more valuable to memory than an isolated feature.

Classify meaningful information as:

- **PROJECT-STATE** — what is true now;
- **DECISIONS** — accepted long-term rules/reasons;
- **VISUAL-SYSTEM** — active visual/composition laws;
- **BACKLOG** — ideas that may be revisited, not implementation approval;
- **history/releases/archive** — past states and experiments.

Do not record casual conversation, routine chatter, temporary debugging guesses, disproven assumptions or random preferences that never became decisions.

Bridge prompts may be a source of durable project knowledge, but do not copy them verbatim into documentation. Extract only long-lived STATE/DECISION/VISUAL-SYSTEM/BACKLOG/HISTORY information.

## Reserve / project-memory safety copy

Reserve repository: `Cryo-Zero/hishchenie-film-v2`.

Its existing `main`, archives, snapshots and history are recovery material and must not be destructively replaced merely to synchronize current production documentation.

The attempted exact production runtime mirror is currently **NOT VERIFIED / not created** because the available connector cannot transfer the missing ~22 MB production trailer blob into the reserve object database. This is a tool limitation, not evidence of production file loss.

Do not publish an approximate `mirror/hishchenie-film-main` and do not call reserve an exact runtime mirror unless the complete tree is independently proven identical.

After meaningful current-memory updates, maintain a **project-memory safety copy** at:

`snapshots/project-memory/current/`

containing the four canonical current files. Verify content equality after writing. This copy is documentation/recovery support, not a runtime mirror.
