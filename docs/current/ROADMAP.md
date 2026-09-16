# HISHCHENIE / THEFT — project roadmap

This document is the canonical multi-workstream plan for the project: what we want to improve, what is already accepted, what was rejected/superseded, what remains only an idea, what is complete, and what should happen next.

Read `START-HERE.md` first. It defines status vocabulary and conflict resolution.

This file complements the other canonical files:

- `PROJECT-STATE.md` — what is factually true now;
- `DECISIONS.md` — durable accepted rules/reasons;
- `VISUAL-SYSTEM.md` — active visual/composition laws;
- `BACKLOG.md` — ideas that may be revisited;
- `ROADMAP.md` — how the known workstreams relate, their status/history and the intended sequence.

**Presence in ROADMAP is not blanket authorization to implement every item.** Current explicit owner instruction and per-task approval still govern implementation. A workstream may contain approved principles while later stages/ideas remain unapproved.

Historical sections are preserved for traceability. If a historical round conflicts with the current status/active direction recorded at the top of its workstream or in `PROJECT-STATE.md` / `VISUAL-SYSTEM.md`, the current canonical state wins.

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

**Status:** ACTIVE R7 PREVIEW STABILIZATION / ROUND 7 CORRECTIONS IMPLEMENTED / EXACT-FINAL QA REQUIRED BEFORE PUSH / OWNER VISUAL ACCEPTANCE PENDING.

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

Production remains **REVIVAL R6** on `main`.

Responsive implementation is already substantially present on feature branch:

- branch: `revival-r7-responsive-mobile`;
- draft PR: `#18`;
- Round 6 verified feature SHA: `f5e154912986c95e7f48a15bce34c707db39667c`;
- Round 6 automated browser gate passed;
- production `main` was not changed by Round 6;
- owner visual acceptance remains pending.

Owner visual review after Round 6 found real presentation regressions/incorrect interpretations despite green automated QA. The owner approved a bounded correction set, and the Round7 bridge has now implemented that set on the feature preview. Exact-final browser/screenshot verification and owner visual acceptance remain separate gates.

### Round 7 correction set — implemented preview / owner visual acceptance pending

Authoritative details live in `VISUAL-SYSTEM.md` and `START-HERE.md`. Summary:

- desktop Archive wall control remains the only currently approved outside-grid element and must preserve its physical-wall behavior;
- mobile visible `ARCHIVE // 11` trigger is superseded and approved for removal while stage/swipe/lightbox remain;
- Actors/FAQ keep staged text reveal but internal structural lines/dividers must remain stationary;
- CONTACT keeps travelling-point semantics on desktop and mobile, with no extra receive/card/diamond glow/fill reaction;
- profile help remains anchored/no-reflow but returns to approximately profile-console-aligned width rather than an arbitrary compact card;
- mobile Hero restores the existing synopsis in order `POSTER → SYNOPSIS → ACTIONS`;
- Round 6 burger scrolling and smart-header improvements remain unless a later owner review says otherwise.

### Accepted direction / decisions

- Desktop is the visual foundation, **not** a fixed pixel canvas.
- Preserve scene identity, world language, hierarchy and bespoke interactions.
- Adapt composition to available space rather than merely shrinking desktop.
- OS name alone must not choose the layout.
- Portrait desktop is still desktop context; it must not automatically receive a phone layout.
- Tablet landscape should remain close to desktop when space allows.
- Phone may use sequential/fullscreen/sub-scene interpretations when literal compression would damage the design.
- Actors, FAQ and Archive require scene-specific responsive treatment rather than generic card/accordion/gallery replacement.
- Final acceptance must use actual browser/device rendering; mockups/source inspection/automated QA do not equal owner visual acceptance.
- Mobile Actors/FAQ state changes do not auto-scroll the page.
- Archive is Materials-local and does not follow the visitor through unrelated scenes.

### Rejected / superseded directions

- `desktop + shrunken desktop` as the whole responsive strategy.
- One universal `PC/mobile` split that ignores height, orientation and input method.
- Treating every portrait viewport as a phone.
- Reviving P20/P21/P22 rejected redesigns as the responsive baseline.
- Redesigning the approved desktop scene geometry merely to make mobile implementation easier.
- Treating green browser automation as final owner visual approval.
- Round4 mobile `ARCHIVE // 11` trigger as the active desired mobile control: superseded after Round6 owner review.
- Round5 hidden mobile Hero synopsis as the active desired composition: superseded after Round6 owner review.
- Round6 extra CONTACT receive glow/fill and arbitrary compact help-panel interpretation: rejected by owner visual review.

### Candidate ideas / open questions

- Exact breakpoint strategy should continue to be derived from content/scene constraints rather than arbitrary device names.
- Optional pixel-perfect mobile polish may continue after functional/visual stabilization if the owner sees value.
- Any new outside-world-grid visual exception beyond the desktop Archive control requires separate explicit owner approval.

### Next actions

Current authorized sequence:

1. Complete the Round7 exact-final browser + screenshot gate against the clean final commit.
2. Push only the exact tested SHA and verify remote equality.
3. Re-check PR #18 remains draft/open/unmerged and production `main` remains unchanged.
4. Return the verified Round7 preview to owner visual review.
5. Repeat only bounded owner-requested corrections if needed.
6. Only after explicit owner visual acceptance may merge/deploy be considered.

### History / evidence

- `docs/current/START-HERE.md` — current gate/conflict rules.
- `docs/current/VISUAL-SYSTEM.md` — active visual contract.
- `docs/releases/revival/R7/PREVIEW-HANDOFF.md` — R7 implementation history.
- `docs/releases/revival/R7/OWNER-FEEDBACK-ROUND2.md` through `OWNER-FEEDBACK-ROUND6.md` — chronological owner-feedback evidence; older conflicting choices may be superseded.
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

- No admin redesign is required during the active R7 visual-stabilization phase.
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

**Status:** CORE SYSTEM STABLE / R7 responsive preview exists / preserve business logic during current visual stabilization; scale features remain future ideas.

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

R7 includes responsive presentation work for Reviews/profile, but the current post-Round6 correction phase must not change review/profile business logic.

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

- Preserve existing review/profile business logic during R7 visual correction work.
- Reassess feed size/performance and moderation needs later using real usage rather than implementing scale features pre-emptively.

### History / evidence

- `docs/releases/p-series/P14/` — separate reviews page, atomic profile+review write, likes/replies/admin foundation.
- `docs/releases/revival/R1/` — reopened writes, human-check, rate limits, display-only profanity filter, live sync.
- `docs/releases/revival/R2/` — feed update behavior/rate-limit UX.
- `docs/releases/revival/R3/` — inline edit and desktop review workspace.
- `docs/releases/revival/R5/` — refresh/state stability.
- `docs/releases/revival/R6/` + `docs/database/supabase/REVIVAL-R6-APPLIED.md` — profile safety and unique alias identity.
- `docs/releases/revival/R7/` — responsive presentation history; not production until accepted/merged.

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
- Reserve contains `snapshots/project-memory/current/` as a safety copy of canonical project memory.
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
2. Keep an appropriate current feature/recovery point before substantial risky operations.
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

**Status:** ONGOING / CURRENT QUALITY PASS ACTIVE.

### Goal

Make project recovery after chat/context loss fast enough that a new ChatGPT/developer can understand not only the current code but also why important choices were made, which historical rules are superseded, what is already implemented and what is merely approved/pending.

### Accepted direction / decisions

- `START-HERE.md` is the mandatory entry/index for new bridge/curator sessions.
- Maintain canonical project memory continuously when meaningful information appears.
- Explicitly separate factual runtime state from owner-approved pending implementation direction.
- Historical round records remain preserved but must be labelled/treated as history where newer canonical state supersedes them.
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
5. ensure BACKLOG contains only future/candidate material, not stale descriptions of already-active work;
6. write release `UPDATE` + `QA` for a release-sized change;
7. for database changes, keep source migration plus verified `*-APPLIED.md` only after production verification;
8. synchronize and verify canonical project-memory safety copy in reserve.

---

## Global sequence at this snapshot

The current project-level priority is:

**preserve production R6 → finish the owner-approved post-Round6 R7 corrections on the existing draft feature branch → browser + screenshot QA → owner visual review → repeat bounded corrections if necessary → only after explicit owner acceptance consider merge/deploy → verify real production behavior after deployment → then reassess later admin/review/report/content workstreams by actual need and owner priority**.

This ordering may be changed by a newer explicit owner instruction, but it must not be silently rewritten by the assistant/operator.

## R7 responsive history capsules

### Owner feedback Round 3 — historical preview checkpoint

Round3 owner corrections implemented and browser-QA'd on `revival-r7-responsive-mobile` included normal-flow Reviews controls, reduced Archive footprint/stable stage, fixed-endpoint CONTACT pulse, targeted microcopy readability and preserved Show More behavior. Later rounds superseded several of these preview choices.

### Round 4 — historical preview checkpoint + accepted future architecture

Round4 introduced local reversible CONTACT motion, mobile `ARCHIVE // 11`, centred Freshness, active/lighter profile help, a following Reviews control dock and phone smart-header behavior. It also captured future moderation/Bug Reports/CAPTCHA/backend/legal planning without implementing those backend workstreams.

Later owner feedback superseded several Round4 preview details. Do not use this history capsule as current implementation permission.

### Privacy-by-design backend/legal follow-up — 2026-09-12

Future backend migration and privacy-policy work must preserve the active privacy direction in `DECISIONS.md`: Russian-hosted backend direction; no required real names/email/phone for ordinary visitors; no application identity/features built around raw IP; minimum technical review identity; informed consent where legally required; deletion path for user-associated data; data minimization by default.

Before final Privacy Policy publication, confirm the legal identity/contact details of the film author and confirm the actual operator/processor allocation. The current operator assumption (film author) is provisional only. Do not infer or publish legal details from technical ownership or team participation.

Infrastructure providers may technically observe network IP addresses even though the application itself must not use/store raw IP as ordinary product data. The artistic FAQ wording `На сайте есть безопасность?` remains separate from legal privacy documentation.

This addendum does **not** authorize or perform a backend migration, CAPTCHA deployment, Telegram integration, Bug Reports v2 implementation, or Supabase production change.

### R7 Round 5 — historical preview checkpoint

Round5 focused on public responsive interaction/polish: mobile Hero synopsis hidden at that time, Materials copy/arrows changes, softer Actors/FAQ transitions, local CONTACT signal, robust burger dismissal/fullscreen behavior, burger REPORT contour cleanup, profile-help state/geometry, public BUILD removal and PUBLIC FILE footer consistency.

The post-Round6 owner review now supersedes the hidden mobile Hero synopsis and retains only the non-conflicting historical choices.

### R7 Round 6 — verified implementation checkpoint, not owner-accepted final

Round6 final SHA:

`f5e154912986c95e7f48a15bce34c707db39667c`

Round6 passed its automated browser gate and improved trailer audio determinism, enlarged Materials lightbox geometry, burger scrolling, mobile Actors/FAQ shell transitions and smart-header interpolation. It also restored a travelling desktop CONTACT point and changed profile-help geometry.

Owner visual review then rejected/corrected specific results:

- extra CONTACT receive glow/fill;
- desktop Archive presentation regression;
- arbitrary compact profile-help geometry;
- moving/jittering structural lines in Actors/FAQ reveals;
- old mobile CONTACT semantics;
- visible mobile `ARCHIVE // 11` trigger;
- hidden mobile Hero synopsis.

### Active next gate after Round 6 owner review

Implement only the current correction set documented in `START-HERE.md`, `PROJECT-STATE.md` and `VISUAL-SYSTEM.md`, then return an exact verified feature SHA plus screenshot evidence to owner visual review.

Do not merge R7, deploy, touch Supabase/backend, start Bug Reports v2, Custom Cursor, SECURITY PROTOCOL // 2045 or unrelated redesign work merely because those topics exist elsewhere in project history/planning.

- `docs/releases/revival/R7/OWNER-FEEDBACK-ROUND7.md` — bounded implementation/evidence record.
