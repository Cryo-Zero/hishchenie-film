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
- Rejected, unused or superseded ideas are preserved because they may contain useful project knowledge. They are **not permanently forbidden merely because they were rejected or not used**: an old idea may be reconsidered, adapted or restored later when it becomes useful, but only after a new explicit owner review/approval. Historical preservation is therefore recovery/design memory, not implementation authorization.
- Do not invent film-author data, contacts, release facts or other public information that is not actually present/confirmed in the project.
- When a task says read-only, do not self-fix discovered problems; report them first.
- BACKLOG presence never means permission to implement.
- ROADMAP presence also does not grant blanket implementation permission: it may contain approved principles, completed history, future stages and unapproved candidate ideas together. Current explicit owner/task approval still governs implementation.
- When a workstream is completed, preserve a concise history of what was wanted, what was accepted/rejected, what was actually implemented and what remains future work. Do not erase planning context merely because the feature is now complete.

### Planning chat / implementation bridge loop

The normal collaborative workflow may use two separate ChatGPT conversations with different roles:

- the **planning/review chat** is where the owner and assistant discuss goals, compare alternatives, make design/product/technical decisions, review returned results and decide what should happen next;
- the **implementation bridge chat** receives a bounded implementation task prepared from the currently approved plan and performs the authorized repository/backend work;
- after bridge work, the owner may return its result, report, diff, screenshots or verification evidence to the planning chat for review before the next substantial decision/implementation step;
- while a separate bridge task is being worked on, the planning chat may continue exploring later ideas, alternatives and future workstreams. Those discussions remain candidate planning material until explicitly approved and must not silently expand the bridge task already in progress;
- a bridge task should contain the current approved scope, relevant constraints, preservation/safety rules, required verification and the expected report/handoff so implementation does not depend on unstated chat context;
- discoveries made during implementation may return to planning as new evidence or candidate ideas. They do not automatically authorize additional unrelated changes;
- meaningful decisions, accepted/rejected alternatives, useful future ideas, completed results and verification lessons from either chat must be transferred into the appropriate canonical documentation (`PROJECT-STATE`, `DECISIONS`, `VISUAL-SYSTEM`, `ROADMAP`, `BACKLOG`, release/history/database docs) so a failure or loss of either chat does not destroy project knowledge.

This separation is intentional: planning may move ahead conceptually while implementation remains tightly scoped to the last approved bridge task.

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

- **Concept / mockup / prototype** — shows the intended design direction. It does not prove that the browser implementation behaves that way.
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

## Round 4 durable planning decisions — 2026-09-11

### Workflow reconfirmed

The existing planning/review → explicit owner approval → bounded bridge task → bridge report → independent verification → owner visual review loop remains authoritative. Planning discussion that happens while a bridge is working does not silently expand that bridge scope.

### Community moderation / official replies

- Official/team replies are authored from the admin panel, not from public visitor UI.
- Future reply templates are composer helpers: selecting one inserts editable text and never posts automatically.
- Normal negative criticism remains public; low score alone is never moderation grounds.
- Severe rule-breaking text/replies may be hidden or replaced with a clear system moderation marker while preserving a genuine viewer score where appropriate.
- Obvious bot/spam/manipulated/fake review may be removed completely, including its score.
- Moderation history should preserve reason, timestamp, authorized actor and internal note/history.

### Admin/public boundary

A future admin `ОТКРЫТЬ САЙТ ↗` shortcut may open the public site in a new tab for inspection. Public pages remain visitor-facing and do not expose moderation controls or an intentional “admin mode.” Authentication/authorization remains an admin-panel/backend concern.

### Bug Reports v2 product direction — future, not current implementation

Bug Reports v2 is accepted as future architecture: visitor form → server-side safe storage → admin `BUG REPORTS` workflow → optional minimum Telegram alert. Four admin statuses only: `NEW`, `IN PROGRESS`, `FIXED`, `CLOSED`; opening a report never automatically advances status.

Optional diagnostics are consented per report and minimized to build, page/section, UI language, browser family+major, OS family and viewport/orientation. Do not store raw IP, physical screen resolution by default, full raw User-Agent, technical profile UUID, cookies/localStorage, review/reply contents, phone model or unrelated profile data in the report. Report submission remains possible when optional diagnostics are unchecked.

Telegram is notification-only, not source of truth, and default alerts contain minimum metadata rather than full report text/diagnostics. Delivery failure must not affect stored report integrity.

### Anti-bot / CAPTCHA direction — future

Prefer researching a Russian-hosted CAPTCHA/human-verification solution such as Yandex SmartCaptcha. Verification must be server-checked; a decorative local checkbox is insufficient. First review by each new anonymous identity requires verification; clearing local identity creates a new identity that must verify again. Editing an owned existing review normally should not repeat CAPTCHA absent abuse. Bug Reports use server-verified anti-bot/rate-limit protection. Raw IP storage is not the primary anti-bot model.

### Privacy minimization / raw IP

The product follows privacy-by-design/minimization:
- application tables do not intentionally store raw IP for reviews/bug reports;
- admin UI does not expose raw IP;
- product identity/features are not built around IP;
- this may change only after explicit future approval with legal/technical justification.

Infrastructure/service providers can technically observe connection IPs while delivering network service; public copy must not make the false absolute claim that nobody can ever see an IP.

### Russian backend research direction

Before considering a total rewrite, first research whether the current Supabase-compatible architecture can be self-hosted on infrastructure physically located in Russia while preserving PostgreSQL, RLS, RPC and existing application/admin/community logic. No provider is approved. A full Russian managed stack remains an alternative if compatibility is unsuitable. Research does not authorize migration, production data copy, endpoint/credential changes or production Supabase changes.

### FAQ wordplay and legal/privacy separation

`На сайте есть безопасность?` remains intentional artistic wordplay and must stay. It is not the legal privacy notice. Future privacy/personal-data policy, community rules and legally required consent/notices are separate documents/surfaces; do not replace the FAQ joke with legal boilerplate or add fear-inducing review disclaimers without a concrete requirement.

## Privacy by design — active direction addendum — 2026-09-12

This is an active project direction and a documentation decision, not a claim that a final Privacy Policy has already been legally approved or published.

- Move toward a Russian-hosted backend as the intended infrastructure direction.
- Do not require real visitor names.
- Do not require visitor email addresses or phone numbers for ordinary public participation.
- Raw IP addresses must not be used or stored as ordinary product/application data and must not become a user identity or product-feature primitive.
- Infrastructure/network providers may still technically observe network IP addresses; project documentation must not claim that this can never happen.
- Keep only the minimum technical identity required for review ownership/editing and related abuse-prevention integrity.
- Use clear, informed consent where legally required.
- Provide a practical way to delete user-associated data.
- Continue data minimization by default.

**Personal-data operator — provisional assumption only:** the film author is the current working assumption. This is not yet a final legal publication. The author's legal identity/details/contact have not been confirmed for publication, and the actual operator/processor allocation must be confirmed before a final Privacy Policy is published. Do not publish guessed legal details. Ordinary team members or the technical developer are not automatically designated the operator merely because they implement or maintain the system.

The FAQ item `На сайте есть безопасность?` remains untouched as intentional artistic wordplay. It is not the legal Privacy Policy and must not be treated as one.
