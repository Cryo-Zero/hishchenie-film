# HISHCHENIE / THEFT — durable decisions

This document stores long-lived decisions and the reasoning/constraints behind them. It is not a release log and not a task list.

For active visual/composition laws, see `VISUAL-SYSTEM.md`. For current factual state, see `PROJECT-STATE.md`. For the multi-workstream plan/status/history, see `ROADMAP.md`. For unapproved future ideas, see `BACKLOG.md`.

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
- ROADMAP presence also does not grant blanket implementation permission: it may contain approved principles, completed history, future stages and unapproved candidate ideas together. Current explicit owner/task approval still governs implementation.
- When a workstream is completed, preserve a concise history of what was wanted, what was accepted/rejected, what was actually implemented and what remains future work. Do not erase planning context merely because the feature is now complete.

### Canonical documentation preservation

The canonical documentation is protected project memory and recovery material. Losing it or silently changing its meaning would materially damage future handoff/recovery.

Rules for the assistant/operator/bridge:

- Do not delete any canonical rule, decision, rationale, section or canonical-memory file without explicit owner approval.
- Do not rewrite, weaken, invert, replace or materially change the meaning of an existing rule or decision by personal discretion. A semantic replacement requires explicit owner approval.
- Without separate approval, documentation maintenance may be **additive/clarifying only**: improve wording without changing meaning, add evidence/examples/cross-references, record newly verified factual state in the correct file, or add a new rule that is compatible with the existing rules.
- If new information conflicts with an existing durable rule, do not silently overwrite the old rule. Identify the conflict and obtain owner approval before replacing/superseding it.
- When an owner-approved rule change supersedes an older rule, preserve useful traceability/history where practical instead of erasing the fact that the previous decision existed.
- Small details may be recorded when they are genuinely useful for future recovery, handoff, verification, design consistency or understanding of why the project works as it does. Do not preserve routine chatter, temporary guesses, repetitions or disproven assumptions.
- The purpose of canonical memory is that a future ChatGPT chat or developer can reconstruct the project, its constraints and the reasoning behind important choices without rebuilding the documentation from scratch.

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

If the available tool cannot prove the claimed result, report **NOT VERIFIED** and the exact reason.

Do not replace verification with inference. This rule applies to all bridge/tool operations.

The previous exact reserve-mirror attempt is the reference example: it was stopped rather than publishing an incomplete copy when the full binary tree could not be reproduced and verified.

## Responsive design approval / evidence

For substantial responsive reinterpretations, approve the intended visual composition before final implementation whenever practical.

Two kinds of evidence must remain distinct:

- **Concept / mockup / prototype** — shows an intended design direction. It does not prove that the browser implementation behaves that way.
- **Actual browser render** — proves how the implemented HTML/CSS/JS behaves in a real viewport/device context.

Rules:

- Proposed responsive layouts are **not approved design** until the owner explicitly approves the direction.
- Concept approval allows implementation of that direction; it is not final implementation acceptance.
- Final acceptance of responsive implementation must be based on actual browser rendering, not only a mockup.
- If a real render cannot be produced by the available tooling, report `NOT VERIFIED` rather than treating source-code inspection or a concept image as equivalent evidence.
- Scene-specific owner direction may intentionally override a general visual rule according to the project governance priority.

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

Deleting a review cascades deletion of related review replies and review likes. The profile itself remains.

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
- allowed roles: `owner`, `editor`, `moderator`.

Existing admin panel capabilities include login/logout, review list, search, filters, sorting, refresh, hide/unhide, pin/unpin, delete review and official reply. Admin backend RPC/functions already exist.

Historical pre-activation snapshot had `public.admins = 0` and no suitable email/password Auth user. That snapshot is history; current factual admin state is maintained in `PROJECT-STATE.md`.

### Owner Auth creation rule

The connected Supabase bridge does **not** expose a documented Auth Admin `create user` action. Owner Auth-user creation must therefore use the normal supported Supabase Auth management flow outside bridge work when creation is required.

Do **not** bypass this limitation with direct `auth.users` writes, temporary Edge Functions, installed HTTP/`pg_net` workarounds or undocumented HTTP/database creation paths.

### Admin owner identity

The technical owner login exists only as operational Supabase Auth login for the owner/admin panel; it is not a public mailbox.

Decisions:

- The owner Auth user was created manually through Supabase Dashboard using the supported email/password Auth management flow.
- The owner membership is active in `public.admins` with `role = 'owner'`.
- Never store the password in GitHub, project documentation or public code.
- Because the mailbox is intentionally non-real, email password recovery is unavailable by design; password change/recovery must use Supabase management/dashboard access.
- MFA/2FA is not required for the current activation, but remains a possible later security improvement.
- Public nickname/official label must never depend on the technical login email.

### Admin functional readiness vs visual polish

**Admin functional readiness has priority over admin visual polish for the current release sequence.**

The owner completed a real browser smoke-test confirming normal login, panel boot, review loading, search/filter/sort behavior, visible moderation controls, official reply publication and test-review deletion. That is sufficient to proceed to the responsive public-site workstream without first redesigning the admin UI.

Admin visual refinement remains optional future polish unless a new functional/accessibility problem makes it necessary. This does not mean every moderation edge case has received exhaustive QA.

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

## Database backup security

Production database contents and credentials must **never** be copied into public GitHub.

Public GitHub may contain schema definitions, migrations/source SQL, RLS/RPC definitions, applied migration records, recovery documentation, safe aggregate snapshots and anonymized test fixtures when needed.

Public GitHub must not contain full production DB dumps, password hashes, auth sessions/tokens, service-role/secret keys, private keys, real credentials or sensitive Auth data.

Real production data backups must live separately in protected/encrypted storage. A formal Database Recovery Plan remains future work, not an automatically authorized implementation.

## Bug-report privacy

REVIVAL R6 contains `REPORT // СООБЩИТЬ О БАГЕ`, currently opening GitHub Issues with optional safe diagnostics.

Diagnostics must not include UUID/profile ID, auth/session tokens, cookies, localStorage contents, review/reply content, secret keys or application-collected IP address.

## Project memory quality / sync

Meaningful project knowledge includes not only features/backend/files but also visual laws, composition principles, world-grid rules, deliberate exceptions, responsive philosophy, interaction philosophy, rejected directions, reasons behind important decisions, safety/recovery rules, roadmap/workstream state and operational lessons.

Classify meaningful information as:

- **PROJECT-STATE** — what is true now;
- **DECISIONS** — accepted long-term rules/reasons;
- **VISUAL-SYSTEM** — active visual/composition laws;
- **ROADMAP** — known workstreams, goals/current status, accepted/rejected directions, candidate ideas, next sequence and history/evidence links;
- **BACKLOG** — ideas that may be revisited, not implementation approval;
- **history/releases/archive** — past states and experiments.

Completed workstream planning should not disappear. Keep a concise history capsule in `ROADMAP.md`; retain detailed evidence in release/admin/database/history documents. If old planning detail becomes too large for current memory, move it to `docs/history/` with a reference rather than deleting it without approval.

Do not record casual conversation, routine chatter, temporary debugging guesses, disproven assumptions or random preferences that never became decisions.

Bridge prompts may be a source of durable project knowledge, but do not copy them verbatim into documentation. Extract only long-lived STATE/DECISION/VISUAL-SYSTEM/ROADMAP/BACKLOG/HISTORY information.

## Reserve / project-memory safety copy

Reserve repository: `Cryo-Zero/hishchenie-film-v2`.

Its existing `main`, archives, snapshots and history are recovery material and must not be destructively replaced merely to synchronize current production documentation.

The attempted exact production runtime mirror is **NOT VERIFIED / not created** because the available connector cannot transfer the missing ~22 MB production trailer blob into the reserve object database. This is a tool limitation, not evidence of production file loss.

Do not publish an approximate `mirror/hishchenie-film-main` and do not call reserve an exact runtime mirror unless the complete tree is independently proven identical.

After meaningful current-memory updates, maintain a **project-memory safety copy** at `snapshots/project-memory/current/` containing the five canonical current files: `PROJECT-STATE.md`, `DECISIONS.md`, `VISUAL-SYSTEM.md`, `ROADMAP.md`, and `BACKLOG.md`. Verify content equality after writing. This copy is documentation/recovery support, not a runtime mirror.
