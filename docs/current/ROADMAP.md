# HISHCHENIE / THEFT — project roadmap

This document is the canonical multi-workstream plan for the project: what we want to improve, what is already accepted, what was rejected/superseded, what remains only an idea, what is complete, and what should happen next.

It complements the other canonical files:

- `PROJECT-STATE.md` — what is true now;
- `DECISIONS.md` — durable accepted rules/reasons;
- `VISUAL-SYSTEM.md` — active visual/composition laws;
- `BACKLOG.md` — ideas that may be revisited;
- `ROADMAP.md` — how the known workstreams relate, their status/history and the intended sequence.

**Presence in ROADMAP is not blanket authorization to implement every item.** Current explicit owner instruction and per-task approval still govern implementation. A workstream may contain approved principles while later stages/ideas remain unapproved.

## How to maintain this roadmap

Every meaningful workstream should preserve, as applicable:

1. **Goal** — what problem/outcome we are aiming for.
2. **Current state** — what is actually true now.
3. **Accepted direction / decisions** — owner-approved principles that should survive future chats.
4. **Rejected / superseded directions** — approaches that must not silently return.
5. **Candidate ideas / open questions** — useful possibilities, not approval.
6. **Next actions** — intended sequence, with approval/verification gates.
7. **History / evidence** — links to release notes, QA, migrations, historical docs or recovery points.

When a workstream is completed, do **not** erase its previous planning context. Keep a concise completion/history capsule here and preserve detailed release/history documents. If a large amount of obsolete detail would make this file unreadable, move that detail to `docs/history/` and leave a link here rather than deleting it.

Canonical documentation-preservation rules in `DECISIONS.md` apply to this file.

---

## Workstream A — Responsive / device adaptation

**Status:** ACTIVE NEXT WORKSTREAM / design direction requires owner approval before substantial implementation.

### Goal

Use the approved PC/desktop site as the primary visual and interaction foundation, then create faithful representations for different device/viewport contexts without turning the project into a generic responsive landing page.

The site must account for real combinations of:

- wide/normal/small desktop;
- low-height laptops and MacBook-class screens;
- Windows/macOS differences that affect browser/UI context;
- portrait desktop monitors;
- tablet landscape/portrait;
- Android/iPhone-class phone landscape/portrait;
- device rotation and orientation changes;
- width + height + aspect ratio, not width alone;
- touch vs pointer/hover;
- safe areas, mobile browser chrome, `dvh`/`svh`;
- HiDPI/Retina, scaling and zoom.

### Current state

- REVIVAL R6 desktop runtime is the approved visual reference.
- Partial adaptive safeguards already exist: burger navigation, short-desktop fallback, several mobile stacks, coarse-pointer handling and Archive touch/swipe support.
- A full device-responsive reinterpretation has not yet been implemented as the next dedicated release.

### Accepted direction / decisions

- Desktop is the visual foundation, **not** a fixed pixel canvas.
- Preserve scene identity, world language, hierarchy and bespoke interactions.
- Adapt composition to available space rather than merely shrinking desktop.
- OS name alone must not choose the layout.
- Portrait desktop is still desktop context; it must not automatically receive a phone layout.
- Tablet landscape should remain close to desktop when space allows.
- Phone may use sequential/fullscreen/sub-scene interpretations when literal compression would damage the design.
- Actors, FAQ and Archive require scene-specific responsive treatment rather than generic card/accordion/gallery replacement.
- Final acceptance must use actual browser/device rendering; mockups prove direction, not implementation.

### Rejected / superseded directions

- `desktop + shrunken desktop` as the whole responsive strategy.
- One universal `PC/mobile` split that ignores height, orientation and input method.
- Treating every portrait viewport as a phone.
- Reviving P20/P21/P22 rejected redesigns as the responsive baseline.
- Redesigning the approved desktop scene geometry merely to make mobile implementation easier.

### Candidate ideas / open questions

- Exact breakpoint strategy should be derived from content/scene constraints rather than arbitrary device names.
- Some phone scenes may benefit from sub-scene navigation or controlled vertical sequencing.
- Optional pixel-perfect mobile polish should follow functional completeness rather than block the first usable pass.

### Next actions

Planned sequence, each substantial visual reinterpretation still subject to owner review/approval:

1. Capture/confirm current desktop and existing adaptive baseline plus a rollback point.
2. Review scene-by-scene responsive composition with the owner before implementation.
3. Create a separate responsive feature branch after implementation is authorized.
4. Establish shared viewport primitives: header/nav behavior, safe-area handling, viewport-height rules, touch targets and orientation handling.
5. Adapt main public scenes incrementally: Hero → About → Materials/Archive → Trailer → Watch → Actors → FAQ → Contacts/navigation transitions.
6. Adapt Reviews as its own dense workstream: RESPONSE summary → profile/composer → rating controls → feed → replies/inline edit → sorting/settings.
7. Validate representative contexts including `390×844`, `844×390`, `430×932`, `932×430`, `768×1024`, `1024×768`, `1366×768`, `1080×1920`, plus real/problematic sizes discovered during QA.
8. Test rotation/orientation changes, short-height windows, scaling/zoom, touch/pointer/hover and safe-area/browser-UI behavior.
9. Perform actual browser/device render QA; do not substitute source inspection for visual proof.
10. Only after functional completion, run a separate polish pass if useful.

### History / evidence

- `docs/current/VISUAL-SYSTEM.md`
- `docs/releases/revival/R2/` — stable section geometry/hash landing.
- `docs/releases/revival/R3/` — desktop feed/inline edit and support-guide alignment.
- `docs/releases/revival/R4/` — adaptive desktop behavior for short/narrow windows.
- `docs/releases/revival/R5/` — stable refresh/hash behavior.
- P20/P21/P22 are rejected historical redesigns under `archive/rejected-redesigns/`.

---

## Workstream B — Admin / moderation

**Status:** FUNCTIONALLY READY / current milestone completed; visual polish and expansion are future work.

### Goal

Provide a private film-team moderation/control surface without exposing admin authority or credentials to ordinary anonymous visitors.

### Current state

- `/admin/` exists and is functional.
- Dedicated owner email/password Supabase Auth user exists.
- `public.admins` contains one `owner` membership.
- Real owner browser smoke-test on 2026-09-10 verified login, panel boot, review loading, search/filter/sort, visible Hide/Pin/Delete/Official Reply controls, actual official reply publication and test-review deletion.
- Current admin UI is functionally sufficient for the next release sequence; visual redesign is not a blocker.

### Accepted direction / decisions

Authorization path:

`email/password → Supabase Auth → auth.users.id → public.admins → is_admin_v1() → admin RPC`

Accepted principles:

- admin account is separate from anonymous visitor identity;
- credentials are never bundled in the public website/repository;
- authorization is server-side, not based on knowing `/admin/`;
- owner/editor/moderator roles are supported by `public.admins`;
- current admin can list/search/filter/sort reviews, hide/unhide, pin/unpin, delete and publish official replies;
- functional readiness currently has priority over cosmetic admin polish.

### Rejected / superseded directions

- Making a visitor anonymous profile an administrator.
- Storing admin password/service-role secrets in GitHub or project documentation.
- Bypassing missing Supabase Auth Admin connector functionality with direct `auth.users` writes, temporary Edge Functions or undocumented database/HTTP workarounds.
- Treating knowledge of the `/admin/` URL as authorization.

### Candidate ideas / open questions

- Visual/legibility/accessibility refinement if it becomes useful.
- Moderation audit log if community activity grows.
- MFA/2FA for admin if the threat model/usage justifies it.
- Integrating future Bug Reports v2 into the admin panel.
- More granular role-specific UI if multiple team members are enrolled later.

### Next actions

- No admin redesign is required before responsive public-site work.
- Revisit admin only when: a functional/accessibility issue appears, multiple moderators are needed, Bug Reports v2 is approved, audit history becomes useful, or owner explicitly prioritizes visual polish.
- Before expanding admin permissions, define the intended role/permission matrix and verify it server-side.

### History / evidence

- `docs/releases/p-series/P14/UPDATE.txt` — admin foundation introduced.
- `docs/admin/ADMIN-SETUP-REVIVAL-R1.md` — setup model.
- `docs/releases/revival/R1/UPDATE.txt` — search/visibility/sort and admin RPC path.
- `docs/admin/ROADMAP-AFTER-P14.md` — historical pre-activation future ideas; not current truth by itself.
- `docs/current/PROJECT-STATE.md` — current owner activation/smoke-test truth.

---

## Workstream C — Reviews / community

**Status:** CORE SYSTEM STABLE / responsive adaptation is next; scale features remain future ideas.

### Goal

Maintain a low-friction anonymous audience-response system that feels native to the film world while protecting privacy, ownership and basic anti-abuse constraints.

### Current state

Implemented current contract includes:

- Supabase anonymous Auth for normal visitors;
- browser-bound anonymous profile;
- no viewer email/password registration or social login;
- no user photo upload;
- one review per anonymous profile;
- integer rating `0..10`;
- Freshness positive range `7..10`;
- average/count/public statistics;
- New / Old / Popular sorting;
- likes/reactions;
- one-level replies and official team replies;
- first-review human-check;
- server-side rate limits;
- optional display-only strong-language filter;
- RU/EN rendering;
- R6 profile-help/privacy explanation;
- curated numbered aliases with database-enforced canonical uniqueness for covered identities.

### Accepted direction / decisions

- Public feeds/stats may be readable without exposing technical Auth IDs.
- Anonymous identity is local/browser-bound; do not promise recovery after clearing data/changing device/browser.
- Strong-language filtering is presentation-only; stored review text is not silently rewritten.
- Deleting a review cascades related likes/replies; the profile remains.
- Legacy aliases remain renderable and are not automatically renamed.
- Public review sorting remains New / Old / Popular unless separately reconsidered.

### Rejected / superseded directions

- Normal viewer registration/password flow.
- Social login for viewers.
- User photo uploads.
- Automatically restoring old public filters such as all/team-reply/high-low rating without a new decision.
- Arbitrary adjective/noun alias mixing for newly generated aliases after R6.

### Candidate ideas / open questions

- Pagination/infinite loading when the feed grows beyond the current practical first-page size.
- Optional on-demand review translation while keeping the original visible.
- Moderation audit/history if the community becomes active enough to need it.
- Further abuse controls only if real usage shows a need; avoid adding friction without evidence.

### Next actions

- Preserve current desktop review behavior during responsive work.
- Design/approve the phone/tablet review workspace separately because composer + feed density cannot be solved by simple scaling.
- After responsive QA, reassess feed size/performance and moderation needs using real usage rather than implementing scale features pre-emptively.

### History / evidence

- `docs/releases/p-series/P14/` — separate reviews page, atomic profile+review write, likes/replies/admin foundation.
- `docs/releases/revival/R1/` — reopened writes, human-check, rate limits, display-only profanity filter, live sync.
- `docs/releases/revival/R2/` — feed update behavior/rate-limit UX.
- `docs/releases/revival/R3/` — inline edit and desktop review workspace.
- `docs/releases/revival/R5/` — refresh/state stability.
- `docs/releases/revival/R6/` + `docs/database/supabase/REVIVAL-R6-APPLIED.md` — profile safety and unique alias identity.

---

## Workstream D — Bug reporting

**Status:** V1 COMPLETE / V2 FUTURE IDEA.

### Goal

Let visitors report problems with enough technical context to diagnose them without collecting profile/review secrets.

### Current state

REVIVAL R6 provides `REPORT // СООБЩИТЬ О БАГЕ`, opening GitHub Issues with optional privacy-safe diagnostics.

Diagnostics must exclude UUID/profile ID, tokens/sessions, cookies/localStorage, review/reply content, secret keys and application-collected IP address.

### Accepted direction / decisions

- Privacy-safe reporting is part of the public site.
- Current GitHub Issues flow is acceptable as V1.

### Candidate ideas / open questions

Possible Bug Reports v2:

`public site → Supabase bug_reports → admin panel`

Possible fields/categories/statuses are recorded in `BACKLOG.md`. GitHub Issues may remain as developer fallback.

### Next actions

- Do not build v2 until separately approved.
- If approved, first define minimal stored fields, retention/privacy rules, admin workflow and abuse/spam protection before schema/UI implementation.

### History / evidence

- `docs/releases/revival/R6/`
- `docs/current/BACKLOG.md`

---

## Workstream E — Recovery / backup / project memory

**Status:** ONGOING CROSS-CUTTING REQUIREMENT; exact external runtime mirror remains NOT VERIFIED.

### Goal

A failure of a chat, deployment, repository operation or database change should not force the project, its reasoning or its working site state to be reconstructed from zero.

### Current state

- Git history preserves the primary runtime evolution.
- Known R5 rollback point exists: branch `backup/revival-r5-before-r6`, commit `61bab24b3e0a925e1e2a1591add0e4e13875ac7c`.
- Reserve repo: `Cryo-Zero/hishchenie-film-v2`.
- Reserve contains `snapshots/project-memory/current/` as a verified safety copy of canonical project memory.
- Exact current production runtime mirror in reserve is **NOT VERIFIED / not created** because the connector cannot transfer the missing ~22 MB trailer blob into the reserve object database.
- Production database documentation exists, but a formal private data-backup/recovery plan is not yet implemented.

### Accepted direction / decisions

- Canonical documentation is protected recovery material.
- Do not delete/semantically rewrite canonical rules without explicit owner approval.
- After meaningful project-memory changes, sync and verify the reserve project-memory copy.
- Before substantial risky runtime/backend operations, keep an appropriate rollback/recovery point.
- Existing reserve history must not be destructively overwritten merely for synchronization.
- Never describe a backup/mirror as successful without verifying the claimed final state.
- Production DB dumps/secrets must never be placed in public GitHub.

### Candidate ideas / open questions

- Create an exact verified current-runtime mirror when tooling can safely transfer/verify all required blobs.
- Formal Database Recovery Plan with protected/encrypted storage and restore procedure.
- Periodic recovery drills/checks if the project becomes operationally important enough to justify them.

### Next actions

1. Continue verified project-memory safety-copy synchronization after meaningful canonical changes.
2. Before the next substantial responsive release, create/verify an appropriate current rollback point rather than relying only on the older R5 baseline.
3. Separately design and approve a formal Database Recovery Plan.
4. Revisit exact reserve runtime mirroring when the binary-transfer limitation can be solved and the complete tree can be independently verified.

### History / evidence

- `docs/current/DECISIONS.md` — documentation preservation, verification integrity and reserve rules.
- `docs/current/PROJECT-STATE.md` — current recovery facts.
- `Cryo-Zero/hishchenie-film-v2/snapshots/project-memory/current/` — project-memory safety copy.

---

## Workstream F — Film publication / content expansion

**Status:** FUTURE / dependent on author-confirmed material and decisions.

### Goal

Extend the public site only when the film team has confirmed real release/content information, without inventing public facts.

### Current state

The site presents confirmed current film information, visual materials and trailer. Several publication/content ideas were deliberately left out because they require author decisions or source material.

### Candidate / blocked items

- confirmed release date;
- confirmed streaming/platform links;
- English trailer subtitles after author approval;
- richer actor dossiers when official portraits/bios are supplied;
- optional press/media page if a press kit is wanted;
- optional Telegram notification bot only if it has a real release/news job rather than duplicating the site;
- advertising only after explicit requirements/approval;
- full-film hosting/embed only after publication/distribution decision.

### Rejected / safety direction

- Do not invent release facts, contacts, platform availability, actor bios or other author data.
- Do not add advertising/full-film hosting merely because earlier notes mentioned them.

### Next actions

None automatically. Each item begins only when the owner/film author provides or confirms the necessary material and explicitly prioritizes the workstream.

### History / evidence

- `docs/admin/ROADMAP-AFTER-P14.md`
- `docs/releases/revival/R1/UPDATE.txt`

---

## Workstream G — Documentation / handoff discipline

**Status:** ONGOING.

### Goal

Make project recovery after chat/context loss fast enough that a new ChatGPT/developer can understand not only the current code but also why important choices were made and what remains planned.

### Accepted direction / decisions

- Maintain canonical project memory continuously when meaningful information appears.
- Preserve useful small details when they affect future recovery, design consistency, verification or reasoning.
- Do not store routine chatter, temporary guesses, repetition or disproven assumptions.
- Completed plans are not erased: summarize completion/current truth and preserve detailed history/release evidence.
- Rejected ideas stay identifiable as rejected so they do not silently return.
- `BACKLOG` can inspire future work, but every implementation still requires current approval.

### Next actions

After each significant task/release:

1. determine whether PROJECT-STATE changed;
2. record durable accepted/rejected decisions in DECISIONS when needed;
3. update VISUAL-SYSTEM if the approved visual contract changed;
4. update ROADMAP workstream status/history/next step;
5. add/remove nothing from BACKLOG except by the documentation-preservation rules and owner-approved semantic changes;
6. write release `UPDATE` + `QA` for a release-sized change;
7. for database changes, keep source migration plus verified `*-APPLIED.md` only after production verification;
8. synchronize and verify canonical project-memory safety copy in reserve.

---

## Global sequence at this snapshot

The current project-level priority is:

**protect current R6 state/documentation → approve responsive direction → implement responsive/device adaptation incrementally → real browser/device QA → optional polish → then reassess admin/review/report/content expansions based on actual need and owner priority**.

This ordering may be changed by a newer explicit owner instruction, but it must not be silently rewritten by the assistant/operator.

### Owner feedback round 3 — implemented on draft R7 branch

Round3 owner corrections implemented and browser-QA'd on `revival-r7-responsive-mobile`:

- Reviews compact public-feed controls return to normal flow; the previous fixed/sticky preview choice remains only as history;
- profanity explanatory hint removed from visible UI while preserving the toggle;
- compact Archive drawer reduced and internally scrollable; all-asset stage geometry stabilized without image distortion;
- CONTACT horizontal dot travel replaced by a fixed endpoint pulse;
- targeted information-bearing microcopy readability pass completed;
- Round2 Show More regression preserved;
- required phone/landscape/desktop Chromium matrix passed.

Next gate: **owner visual review of Round3 preview**. Do not merge R7, publish mobile, begin Bug Reports v2/admin notifications, or treat browser QA as owner visual acceptance without a separate explicit decision.
