from pathlib import Path
import subprocess

ROUND6 = 'f5e154912986c95e7f48a15bce34c707db39667c'


def replace_once(path, old, new, label):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected one marker, got {count}')
    p.write_text(text.replace(old, new, 1), encoding='utf-8')


def append_once(path, marker, addition):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    if marker in text:
        raise SystemExit(f'{path}: marker already present: {marker}')
    p.write_text(text.rstrip() + '\n\n' + addition.strip() + '\n', encoding='utf-8')


# ---------------------------------------------------------------------------
# Preserve the curator-created pending snapshot as history. Create a separate
# implementation record instead of rewriting the pending document.
# ---------------------------------------------------------------------------
round_doc = '''# REVIVAL R7 — OWNER FEEDBACK ROUND 7 — IMPLEMENTATION

Status: **IMPLEMENTED ON FEATURE BRANCH / EXACT-FINAL BROWSER + SCREENSHOT QA REQUIRED BEFORE PUSH / OWNER VISUAL ACCEPTANCE PENDING / NOT PRODUCTION**

Date: 2026-09-16
Starting verified Round6 feature SHA: `f5e154912986c95e7f48a15bce34c707db39667c`

Historical pre-implementation direction is preserved in `OWNER-FEEDBACK-ROUND7-PENDING.md`.

## Required project-memory reread

Before runtime changes, the bridge reread the current `START-HERE.md`, `PROJECT-STATE.md`, `DECISIONS.md`, `VISUAL-SYSTEM.md`, `ROADMAP.md`, `BACKLOG.md`, `PREVIEW-HANDOFF.md`, and owner-feedback Round2 / Round5 / Round6. Round5 and Round6 runtime were compared before choosing corrections. A curator updated current canonical memory concurrently; those documentation changes were preserved and became the factual documentation base for this implementation rather than being rolled back.

## Canonical findings applied

- The world grid remains the default desktop composition contract. The **currently approved outside-grid exception is the Materials ARCHIVE control/handle only**. Archive is scene-local: it belongs to Materials, retracts on leave, and opening its drawer must not redefine or reflow the global grid. Future local exceptions remain possible only after separate explicit owner approval.
- Actors and FAQ preserve their bespoke staged text reveal, but structural rows/dividers remain at final coordinates.
- Profile help is an anchored overlay with zero document reflow/scroll lock. Round5's profile-console-aligned geometry is the accepted reference for this correction.
- Responsive history remains additive: superseded preview choices are retained as history rather than erased.

## Regression vs new owner direction

### Regressions / corrections of previously agreed behavior

- **Desktop Archive wall placement:** the visual regression was found during post-Round6 owner review, but source comparison shows the mis-positioning was not introduced by the Round6 diff. The existing absolute shell was captured by positioned `.archive-viewer--drawer`, placing the handle relative to the inner Materials viewer/grid instead of the physical Materials wall. The correction makes that viewer non-positioning on desktop so the shell is positioned by `#materials`; the handle remains at the wall while the drawer opens, and Materials title/stage do not reflow.
- **Profile help geometry:** Round6's compact ~360px reinterpretation is superseded. The panel returns to Round5's profile-console-aligned width/placement while remaining anchored, non-fullscreen and non-reflowing; help copy is unchanged.
- **Actors / FAQ line jitter:** reveal/crossfade selectors were transforming whole structural containers with borders. Structural containers now stay stationary while their text descendants retain staged opacity/translate reveal.

### New explicit owner direction

- Desktop CONTACT keeps the accepted travelling point/path/rhythm but removes the separate diamond receive fill/glow animation.
- Mobile CONTACT now uses the same travelling-point signal semantics as desktop, scaled by the phone track geometry; old fixed-beacon/local-impulse behavior is superseded. Reduced-motion stays static.
- The visible compact/mobile `ARCHIVE // 11` trigger is removed from public presentation; stage/swipe/lightbox remain. Desktop Archive handle/drawer remain.
- Mobile Hero restores the existing `heroCopy` i18n node and places the real node in the order `TITLE → POSTER → SYNOPSIS → ACTIONS` for phone portrait and phone landscape. No hardcoded duplicate synopsis is created. Desktop Hero keeps its original composition.

## Safety

No Supabase/schema/RLS/Auth/profile/review/rating/moderation business logic was changed. `js/public-response.js`, admin runtime, production `main`, deploy state, Custom Cursor and SECURITY PROTOCOL // 2045 remain outside this round. No existing public element was destructively deleted: the explicitly approved mobile Archive trigger is hidden from the mobile public composition while its historical markup/logic stays preserved.

## Verification contract

Real Chromium QA covers `390×844`, `430×932`, `844×390`, `932×430`, `768×1024`, `1024×768`, `1366×768`, reduced-motion states, Reviews help geometry/content, desktop world-grid regression sanity, mobile Hero RU/EN/order, mobile Materials stage/lightbox swipe, burger/smart-header preservation, desktop/mobile CONTACT semantics, Archive wall behavior, and stationary Actors/FAQ structural geometry during reveal.

Screenshot evidence compares **Round5 / Round6 / fixed candidate** for desktop Materials Archive, profile-help open state, Actors selected state and FAQ selected state, plus fixed mobile Hero portrait/landscape.

This commit is created only after pre-commit QA passes. The same full suite must then pass again against this exact commit SHA before it may be pushed. Therefore the authoritative final QA counts/SHA belong to the workflow evidence and bridge report, not to a self-referential SHA embedded in this document.
'''
Path('docs/releases/revival/R7/OWNER-FEEDBACK-ROUND7.md').write_text(round_doc, encoding='utf-8')

# ---------------------------------------------------------------------------
# START-HERE: convert the current target from pending implementation to factual
# implemented-preview state. Keep the owner-acceptance gate explicit.
# ---------------------------------------------------------------------------
replace_once(
    'docs/current/START-HERE.md',
    '## 5. Current owner-approved corrections after Round 6 — pending implementation',
    '## 5. Round 7 corrections after Round 6 — implemented preview / owner visual acceptance pending',
    'START-HERE section heading',
)
replace_once(
    'docs/current/START-HERE.md',
    'These directions are the current visual target and supersede conflicting R7 preview choices. Until the next bridge implements them, runtime and desired state intentionally differ.',
    'These directions are the current visual target and are now implemented on the Round7 feature-branch preview. They supersede conflicting R7 preview choices. Automated verification is required for the exact final SHA before push, and owner visual acceptance remains pending.',
    'START-HERE pending paragraph',
)
append_once(
    'docs/current/START-HERE.md',
    '## 8. Round 7 implementation gate',
    '''## 8. Round 7 implementation gate

The post-Round6 owner correction set has now been implemented as a bounded Round7 preview change. `OWNER-FEEDBACK-ROUND7-PENDING.md` remains the historical pre-implementation specification; `OWNER-FEEDBACK-ROUND7.md` is the implementation record.

Round7 is still **not production and not owner-accepted**. The bridge may report it only after the exact-final browser/screenshot suite passes and the tested SHA is pushed with remote equality. PR #18 remains draft/unmerged; `main` and Supabase remain untouched. The next product gate after a verified Round7 SHA is owner visual review.''',
)

# ---------------------------------------------------------------------------
# PROJECT-STATE: factual transition from pending direction -> implemented preview.
# ---------------------------------------------------------------------------
replace_once(
    'docs/current/PROJECT-STATE.md',
    'The owner has already approved a next correction set after Round 6. Those corrections are **PENDING IMPLEMENTATION** until a bridge produces and verifies a later feature SHA. Do not describe the pending directions as already present in runtime.',
    'The owner-approved post-Round6 correction set has now been implemented by the bounded Round7 bridge pass. It remains **OWNER VISUAL ACCEPTANCE PENDING** and is not production. The exact final Round7 SHA is established by the exact-final browser/screenshot gate before push; do not confuse automated verification with owner acceptance.',
    'PROJECT-STATE pending summary',
)
replace_once(
    'docs/current/PROJECT-STATE.md',
    '### Owner-approved corrections after Round 6 — pending implementation\n\nThe following is the active target for the next bounded R7 bridge task. Current Round 6 runtime may still show the older behavior until that task is completed.',
    '### Round 7 corrections after Round 6 — implemented preview / owner visual acceptance pending\n\nThe following active target is now implemented on the Round7 feature preview. It remains subject to exact-final verification before push and then owner visual review; production R6 is unchanged.',
    'PROJECT-STATE correction section',
)
replace_once(
    'docs/current/PROJECT-STATE.md',
    'Do not use an earlier round description as current truth without checking `START-HERE.md`, this file and `VISUAL-SYSTEM.md`. Several preview choices were intentionally superseded in later rounds, and the owner has now supplied a post-Round6 correction set that is approved but not yet implemented.',
    'Do not use an earlier round description as current truth without checking `START-HERE.md`, this file and `VISUAL-SYSTEM.md`. Several preview choices were intentionally superseded in later rounds. The post-Round6 owner correction set is now implemented in the Round7 preview but remains pending owner visual acceptance.',
    'PROJECT-STATE R7 characteristic summary',
)
old_workflow = '''5. The owner has approved the next correction direction listed above and in `VISUAL-SYSTEM.md`.
6. Next bridge task must implement only that bounded correction set, re-run browser/screenshot QA, push an exact verified feature SHA and return to owner visual review.
7. R7 must remain draft/unmerged/not production until explicit owner acceptance.'''
new_workflow = '''5. The owner-approved correction direction listed above and in `VISUAL-SYSTEM.md` has been implemented by the bounded Round7 bridge pass.
6. The Round7 implementation must pass the full browser/screenshot suite against the exact final commit, then push that exact SHA and verify remote equality.
7. After that verification, the next gate is owner visual review; R7 remains draft/unmerged/not production until explicit owner acceptance.'''
replace_once('docs/current/PROJECT-STATE.md', old_workflow, new_workflow, 'PROJECT-STATE workflow sequence')

# ---------------------------------------------------------------------------
# VISUAL-SYSTEM: preserve the active rules, update their status from pending to
# implemented preview, and record evidence scope without erasing older rounds.
# ---------------------------------------------------------------------------
replace_once(
    'docs/current/VISUAL-SYSTEM.md',
    'The current owner-approved visual target after Round 6 is recorded at the end under **R7 post-Round6 owner visual review corrections — active / pending implementation**. Until a later bridge implements it, Round 6 runtime and the active desired contract intentionally differ in those specific areas.',
    'The current owner-approved visual target after Round 6 is recorded at the end under **R7 post-Round6 owner visual review corrections**. Round7 now implements that target on the feature preview; owner visual acceptance is still pending and production remains R6.',
    'VISUAL-SYSTEM reading rule',
)
replace_once(
    'docs/current/VISUAL-SYSTEM.md',
    '## R7 post-Round6 owner visual review corrections — ACTIVE / APPROVED / PENDING IMPLEMENTATION\n\nThis is the current visual target. It supersedes conflicting R7 preview choices above but does not claim that runtime already matches it.',
    '## R7 post-Round6 owner visual review corrections — ACTIVE / IMPLEMENTED PREVIEW / OWNER VISUAL ACCEPTANCE PENDING\n\nThis is the current visual target and is implemented by the Round7 feature-branch correction pass. It supersedes conflicting R7 preview choices above. Automated/browser evidence does not constitute owner visual acceptance.',
    'VISUAL-SYSTEM active Round7 status',
)
append_once(
    'docs/current/VISUAL-SYSTEM.md',
    '### Round 7 implementation evidence contract',
    '''### Round 7 implementation evidence contract

Round7 browser verification specifically measures the regressions that escaped Round6 automation: stationary Actors/FAQ structural geometry during text reveal, physical Archive wall placement/opening without Materials reflow, profile-console-aligned help with zero reflow/scroll-lock, desktop/mobile CONTACT travel without a second receive glow, absence of the visible mobile `ARCHIVE // 11` trigger with stage/lightbox swipe preserved, and mobile Hero `POSTER → SYNOPSIS → ACTIONS` with RU/EN source continuity. Screenshot evidence compares Round5, Round6 and the Round7 candidate for the owner-found desktop states.''',
)

# ---------------------------------------------------------------------------
# ROADMAP / BACKLOG: remove stale "next bridge must implement" status without
# deleting the curator's history/context.
# ---------------------------------------------------------------------------
replace_once(
    'docs/current/ROADMAP.md',
    '**Status:** ACTIVE R7 PREVIEW STABILIZATION / ROUND 6 IMPLEMENTED AND QA-VERIFIED / OWNER VISUAL ACCEPTANCE PENDING / POST-ROUND6 CORRECTIONS APPROVED AND PENDING IMPLEMENTATION.',
    '**Status:** ACTIVE R7 PREVIEW STABILIZATION / ROUND 7 CORRECTIONS IMPLEMENTED / EXACT-FINAL QA REQUIRED BEFORE PUSH / OWNER VISUAL ACCEPTANCE PENDING.',
    'ROADMAP status',
)
replace_once(
    'docs/current/ROADMAP.md',
    'Owner visual review after Round 6 found real presentation regressions/incorrect interpretations despite green automated QA. The owner has approved a bounded correction set that is **pending implementation**. Therefore the current runtime checkpoint and the current desired visual contract intentionally differ in those specific areas.',
    'Owner visual review after Round 6 found real presentation regressions/incorrect interpretations despite green automated QA. The owner approved a bounded correction set, and the Round7 bridge has now implemented that set on the feature preview. Exact-final browser/screenshot verification and owner visual acceptance remain separate gates.',
    'ROADMAP current state',
)
replace_once(
    'docs/current/ROADMAP.md',
    '### Current owner-approved correction set — pending implementation',
    '### Round 7 correction set — implemented preview / owner visual acceptance pending',
    'ROADMAP correction heading',
)
old_next = '''Current authorized sequence:

1. Read `START-HERE.md`, `PROJECT-STATE.md`, `DECISIONS.md`, `VISUAL-SYSTEM.md`, this ROADMAP and relevant R7 round history.
2. Continue from the actual current R7 branch head; do not restart responsive work from R6 or an older round.
3. Implement only the owner-approved post-Round6 correction set.
4. Preserve production `main`, Supabase/backend/review/profile business logic and unrelated scenes.
5. Add browser assertions and screenshot evidence specifically capable of catching the visual regressions missed by Round6 automation.
6. Verify representative phone/tablet/desktop contexts, orientation, scrolling, overflow and JS errors.
7. Produce an exact tested/pushed/remote feature SHA.
8. Return to owner visual review.
9. Repeat bounded corrections if needed.
10. Only after explicit owner visual acceptance may merge/deploy be considered.'''
new_next = '''Current authorized sequence:

1. Complete the Round7 exact-final browser + screenshot gate against the clean final commit.
2. Push only the exact tested SHA and verify remote equality.
3. Re-check PR #18 remains draft/open/unmerged and production `main` remains unchanged.
4. Return the verified Round7 preview to owner visual review.
5. Repeat only bounded owner-requested corrections if needed.
6. Only after explicit owner visual acceptance may merge/deploy be considered.'''
replace_once('docs/current/ROADMAP.md', old_next, new_next, 'ROADMAP next actions')
append_once(
    'docs/current/ROADMAP.md',
    '- `docs/releases/revival/R7/OWNER-FEEDBACK-ROUND7.md` — bounded implementation/evidence record.',
    '''- `docs/releases/revival/R7/OWNER-FEEDBACK-ROUND7.md` — bounded implementation/evidence record.''',
)

replace_once(
    'docs/current/BACKLOG.md',
    'Round 6 reached verified SHA `f5e154912986c95e7f48a15bce34c707db39667c` and passed its defined automated browser gate, but owner visual acceptance remains pending and a newer bounded correction set is approved for implementation.',
    'Round 6 reached verified SHA `f5e154912986c95e7f48a15bce34c707db39667c` and passed its defined automated browser gate. The newer bounded owner correction set has now been implemented as Round7 preview work, but owner visual acceptance remains pending. This remains current responsive stabilization, not a backlog authorization for additional redesign.',
    'BACKLOG responsive context',
)

# ---------------------------------------------------------------------------
# Durable decision + chronological handoff are additive.
# ---------------------------------------------------------------------------
append_once(
    'docs/current/DECISIONS.md',
    '## R7 owner clarification — current world-grid exception (2026-09-16)',
    '''## R7 owner clarification — current world-grid exception (2026-09-16)

The durable rule remains that the world grid is a default contract and a scene may receive a deliberate local exception only through explicit owner approval. The owner now clarifies the **current factual exception set** for the active design: **CURRENTLY APPROVED OUTSIDE-GRID EXCEPTION = MATERIALS ARCHIVE CONTROL / HANDLE ONLY**.

This is not a permanent ban on all future exceptions. It means no other element may inherit Archive's privilege by analogy; any additional element crossing the world grid requires its own explicit owner approval. Archive remains Materials-local, retracts when leaving the scene, and its drawer interaction must not redefine the global grid.

Round7 also reconfirms documentation traceability: Round4 mobile `ARCHIVE // 11`, Round5 hidden mobile Hero synopsis, and Round6 diamond receive glow / compact profile-help geometry remain historical preview decisions even where the current owner direction supersedes them.''',
)

append_once(
    'docs/releases/revival/R7/PREVIEW-HANDOFF.md',
    '## Owner feedback Round 7 — 2026-09-16',
    '''## Owner feedback Round 7 — 2026-09-16

Owner visual review of the green Round6 automation found visual regressions that structural assertions had missed. Round7 therefore adds screenshot-backed visual-regression checks and corrects only the owner-listed areas.

Current Round7 preview: desktop Actors/FAQ keep staged text reveal while structural lines stay stationary; desktop CONTACT keeps point travel but removes the separate diamond receive glow; mobile CONTACT adopts the same travelling-point semantics; desktop Archive is restored to a true Materials-local physical-wall handle/drawer; Round5 profile-console-aligned help geometry is restored; the visible compact/mobile `ARCHIVE // 11` control is superseded/hidden while stage+swipe+lightbox remain; mobile Hero restores the existing translated synopsis between poster and actions in portrait and landscape. Desktop Hero remains unchanged.

Canonical clarification: **the Archive control/handle is the only currently approved outside-world-grid element**. Other future local exceptions remain possible only through new explicit owner approval. Historical Round4/5/6 choices and the pre-implementation `OWNER-FEEDBACK-ROUND7-PENDING.md` record remain preserved rather than deleted.

Round7 remains **OWNER VISUAL REVIEW PENDING / NOT PRODUCTION**. No merge, deploy, Supabase/backend or production-main operation is part of this correction pass.''',
)

# ---------------------------------------------------------------------------
# Remove only temporary QA staging infrastructure. Curator documentation is
# intentionally retained as project memory.
# ---------------------------------------------------------------------------
temp = [
    '.github/workflows/r7-owner-feedback-round7.yml',
    'scripts/r7_round7_apply.py',
    'scripts/r7_round7_qa.cjs',
    'scripts/r7_round7_finalize.py',
]
for f in temp:
    if not Path(f).exists():
        raise SystemExit(f'missing temporary staging file: {f}')
subprocess.run(['git', 'rm', *temp], check=True)

bridge_final = [
    'css/responsive-r7-owner-round2.css',
    'js/responsive-r7.js',
    'docs/current/START-HERE.md',
    'docs/current/PROJECT-STATE.md',
    'docs/current/VISUAL-SYSTEM.md',
    'docs/current/ROADMAP.md',
    'docs/current/BACKLOG.md',
    'docs/current/DECISIONS.md',
    'docs/releases/revival/R7/PREVIEW-HANDOFF.md',
    'docs/releases/revival/R7/OWNER-FEEDBACK-ROUND7.md',
]
subprocess.run(['git', 'add', *bridge_final], check=True)
subprocess.run(['git', 'diff', '--cached', '--check'], check=True)

# The finalizer starts from a staging HEAD that already contains curator docs.
# Only bridge runtime/docs + temporary file deletions should be staged now.
actual_staged = sorted(subprocess.check_output(['git', 'diff', '--cached', '--name-only']).decode().splitlines())
expected_staged = sorted(temp + bridge_final)
if actual_staged != expected_staged:
    raise SystemExit(f'final staged paths mismatch\nactual={actual_staged}\nexpected={expected_staged}')

subprocess.run(['git', 'config', 'user.name', 'github-actions[bot]'], check=True)
subprocess.run(['git', 'config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com'], check=True)
subprocess.run(['git', 'commit', '-m', 'REVIVAL R7: owner visual corrections round 7'], check=True)
sha = subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip()

# Persistent Round6 -> Round7 tree must contain curator memory updates plus the
# bounded bridge runtime/docs, and no temporary QA files.
persistent = sorted(subprocess.check_output(['git', 'diff', '--name-only', f'{ROUND6}..HEAD']).decode().splitlines())
expected_persistent = sorted([
    'css/responsive-r7-owner-round2.css',
    'js/responsive-r7.js',
    'docs/current/START-HERE.md',
    'docs/current/PROJECT-STATE.md',
    'docs/current/VISUAL-SYSTEM.md',
    'docs/current/ROADMAP.md',
    'docs/current/BACKLOG.md',
    'docs/current/DECISIONS.md',
    'docs/releases/revival/R7/PREVIEW-HANDOFF.md',
    'docs/releases/revival/R7/OWNER-FEEDBACK-ROUND7-PENDING.md',
    'docs/releases/revival/R7/OWNER-FEEDBACK-ROUND7.md',
])
if persistent != expected_persistent:
    raise SystemExit(f'persistent final diff mismatch\nactual={persistent}\nexpected={expected_persistent}')

for f in temp:
    if Path(f).exists():
        raise SystemExit(f'temporary file survived final tree: {f}')
if subprocess.check_output(['git', 'status', '--porcelain']).decode().strip():
    raise SystemExit('working tree not clean after final commit')

Path('/tmp/r7-round7-final-sha.txt').write_text(sha + '\n', encoding='utf-8')
print(sha)
