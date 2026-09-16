from pathlib import Path
import subprocess

BASE = 'f5e154912986c95e7f48a15bce34c707db39667c'

round_doc = '''# REVIVAL R7 — OWNER FEEDBACK ROUND 7

Status: **IMPLEMENTED ON FEATURE BRANCH / BROWSER + VISUAL-REGRESSION QA PASSED / OWNER VISUAL REVIEW PENDING / NOT PRODUCTION**

Date: 2026-09-16
Starting verified Round6 head: `f5e154912986c95e7f48a15bce34c707db39667c`

## Required project-memory reread

Before runtime changes, the bridge reread `PROJECT-STATE.md`, `DECISIONS.md`, `VISUAL-SYSTEM.md`, `ROADMAP.md`, `BACKLOG.md`, `PREVIEW-HANDOFF.md`, and owner-feedback Round2 / Round5 / Round6. Round5 and Round6 runtime were compared before choosing corrections.

## Canonical findings applied

- The world grid remains the default desktop composition contract. The **currently approved outside-grid exception is the Materials ARCHIVE control/handle only**. Archive is scene-local: it belongs to Materials, retracts on leave, and opening its drawer must not redefine or reflow the global grid. Future local exceptions remain possible only after separate explicit owner approval.
- Actors and FAQ preserve their bespoke staged text reveal, but structural rows/dividers must remain at final coordinates.
- Profile help is an anchored overlay with zero document reflow/scroll lock. Round5's profile-console-aligned geometry is the accepted reference for this correction.
- Responsive history remains additive: superseded preview choices are retained as history rather than erased.

## Regression vs new owner direction

### Regressions / corrections of previously agreed behavior

- **Desktop Archive wall placement:** the visual regression was found after Round6, but source comparison shows it was not introduced by the Round6 diff. The existing `position:absolute` shell was captured by the positioned `.archive-viewer--drawer`, placing the handle relative to the inner Materials viewer/grid instead of the physical Materials wall. The correction makes the viewer non-positioning on desktop so the shell is positioned by `#materials`; the handle remains at the left wall while the drawer opens from that wall, and Materials title/stage do not reflow.
- **Profile help geometry:** Round6's compact ~360px reinterpretation is superseded. The panel returns to Round5's profile-console-aligned width/placement while remaining anchored, non-fullscreen and non-reflowing; help copy is unchanged.
- **Actors / FAQ line jitter:** reveal/crossfade selectors were transforming whole structural containers with borders. Structural containers now stay fully visible and stationary while their text descendants retain staged opacity/translate reveal.

### New explicit owner direction

- Desktop CONTACT keeps the accepted travelling point/path/rhythm but removes the separate diamond receive fill/glow animation.
- Mobile CONTACT now uses the same travelling-point signal semantics as desktop, scaled by the phone track geometry; old fixed-beacon/local-impulse behavior is superseded. Reduced-motion stays static.
- The visible compact/mobile `ARCHIVE // 11` trigger is removed from public presentation; stage/swipe/lightbox remain. Desktop Archive handle/drawer remain.
- Mobile Hero restores the existing `heroCopy` i18n node and places the real node in the order `TITLE → POSTER → SYNOPSIS → ACTIONS` for phone portrait and phone landscape. No hardcoded duplicate synopsis is created. Desktop Hero restores/keeps its original composition.

## Safety

No Supabase/schema/RLS/Auth/profile/review/rating/moderation business logic was changed. `js/public-response.js`, admin runtime, production `main`, deploy state, Custom Cursor and SECURITY PROTOCOL // 2045 remain outside this round. No existing public element was deleted except the explicitly approved removal of the visible mobile Archive trigger from presentation; its historical markup/logic is retained hidden rather than destructively removed.

## Verification

Real Chromium QA covers `390×844`, `430×932`, `844×390`, `932×430`, `768×1024`, `1024×768`, `1366×768`, reduced-motion states, Reviews help geometry/content, desktop world-grid regression sanity, mobile Hero RU/EN/order, mobile Materials stage/lightbox swipe, burger/smart-header preservation, desktop/mobile CONTACT semantics, Archive wall behavior, and stationary Actors/FAQ structural geometry during reveal.

Screenshot evidence compares **Round5 / Round6 / fixed candidate** for desktop Materials Archive, profile-help open state, Actors selected state and FAQ selected state, plus fixed mobile Hero portrait/landscape. Exact-final-SHA verification repeats the full browser and screenshot suite after the clean final commit and before push.
'''
Path('docs/releases/revival/R7/OWNER-FEEDBACK-ROUND7.md').write_text(round_doc, encoding='utf-8')

updates = {
    'docs/current/VISUAL-SYSTEM.md': '''
## R7 Round 7 preview refinements — owner visual-review correction, not production

These rules supersede only the conflicting R7 preview choices above; the older Round4/5/6 entries remain historical traceability.

- **Current outside-grid rule:** the Materials `ARCHIVE` control/handle is the **only currently approved element that deliberately sits outside the desktop world grid**. It is a Materials-local scene exception, retracts when Materials is left, and opening its drawer must not shift the handle into the content grid or reflow Materials. This does not revoke the durable rule that another local exception may be approved in the future; any additional outside-grid element requires separate explicit owner approval.
- Desktop Actors/FAQ preserve staged text reveal, but structural borders/dividers/row containers stay in their final coordinates throughout the reveal. Text may fade/translate; structural lines do not translate, jump or resize as part of the animation.
- CONTACT uses the same signal idea on desktop and phone: one point travels along the existing line to the endpoint. The Round6 separate endpoint diamond fill/glow receive reaction is superseded; no second flash is layered over point travel. Reduced-motion has no travel.
- Desktop Archive uses the physical left Materials wall treatment; the drawer opens from that wall without turning the handle into an internal Materials button/block. Compact/mobile no longer presents the `ARCHIVE // 11` trigger; Materials stage/swipe/lightbox remain the mobile access model.
- Profile help remains attached to `?`, overlay-like, non-fullscreen, zero-reflow and zero-scroll-lock. Its current geometry returns to the Round5 reference: approximately the profile-console width rather than the smaller Round6 ~360px card.
- Mobile Hero uses the existing translated synopsis node and current order `TITLE → POSTER → SHORT SYNOPSIS → ACTIONS`; this supersedes Round5 hidden synopsis and the older Round2 placement below actions. Desktop Hero is unchanged.
''',
    'docs/current/DECISIONS.md': '''
## R7 owner clarification — current world-grid exception (2026-09-16)

The durable rule remains that the world grid is a default contract and a scene may receive a deliberate local exception only through explicit owner approval. The owner now clarifies the **current factual exception set** for the active design: **CURRENTLY APPROVED OUTSIDE-GRID EXCEPTION = MATERIALS ARCHIVE CONTROL / HANDLE ONLY**.

This is not a permanent ban on all future exceptions. It means no other element may inherit Archive's privilege by analogy; any additional element crossing the world grid requires its own explicit owner approval. Archive remains Materials-local, retracts when leaving the scene, and its drawer interaction must not redefine the global grid.

Round7 also reconfirms documentation traceability: Round4 mobile `ARCHIVE // 11`, Round5 hidden mobile Hero synopsis, and Round6 diamond receive glow / compact profile-help geometry remain historical preview decisions even where the current owner direction supersedes them.
''',
    'docs/releases/revival/R7/PREVIEW-HANDOFF.md': '''
## Owner feedback Round 7 — 2026-09-16

Owner visual review of the green Round6 automation found visual regressions that structural assertions had missed. Round7 therefore adds screenshot-backed visual-regression checks and corrects only the owner-listed areas.

Current Round7 preview: desktop Actors/FAQ keep staged text reveal while structural lines stay stationary; desktop CONTACT keeps point travel but removes the separate diamond receive glow; mobile CONTACT adopts the same travelling-point semantics; desktop Archive is restored to a true Materials-local physical-wall handle/drawer; Round5 profile-console-aligned help geometry is restored; the visible compact/mobile `ARCHIVE // 11` control is superseded/hidden while stage+swipe+lightbox remain; mobile Hero restores the existing translated synopsis between poster and actions in portrait and landscape. Desktop Hero remains unchanged.

Canonical clarification: **the Archive control/handle is the only currently approved outside-world-grid element**. Other future local exceptions remain possible only through new explicit owner approval. Historical Round4/5/6 choices remain documented above rather than deleted.

Round7 remains **OWNER VISUAL REVIEW PENDING / NOT PRODUCTION**. No merge, deploy, Supabase/backend or production-main operation is part of this correction pass.
''',
}

for name, addition in updates.items():
    p = Path(name)
    text = p.read_text(encoding='utf-8')
    marker = {
        'docs/current/VISUAL-SYSTEM.md': 'R7 Round 7 preview refinements',
        'docs/current/DECISIONS.md': 'R7 owner clarification — current world-grid exception',
        'docs/releases/revival/R7/PREVIEW-HANDOFF.md': 'Owner feedback Round 7 — 2026-09-16',
    }[name]
    if marker in text:
        raise SystemExit(f'{name}: Round7 marker already present')
    p.write_text(text.rstrip() + '\n\n' + addition.strip() + '\n', encoding='utf-8')

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

final = [
    'css/responsive-r7-owner-round2.css',
    'js/responsive-r7.js',
    'docs/current/VISUAL-SYSTEM.md',
    'docs/current/DECISIONS.md',
    'docs/releases/revival/R7/PREVIEW-HANDOFF.md',
    'docs/releases/revival/R7/OWNER-FEEDBACK-ROUND7.md',
]
subprocess.run(['git', 'add', *final], check=True)
subprocess.run(['git', 'diff', '--cached', '--check'], check=True)

actual = sorted(subprocess.check_output(['git', 'diff', '--cached', '--name-only']).decode().splitlines())
expected = sorted(temp + final)
if actual != expected:
    raise SystemExit(f'final staged paths mismatch\nactual={actual}\nexpected={expected}')

subprocess.run(['git', 'config', 'user.name', 'github-actions[bot]'], check=True)
subprocess.run(['git', 'config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com'], check=True)
subprocess.run(['git', 'commit', '-m', 'REVIVAL R7: owner visual corrections round 7'], check=True)
sha = subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip()

persistent = sorted(subprocess.check_output(['git', 'diff', '--name-only', f'{BASE}..HEAD']).decode().splitlines())
expected_persistent = sorted(final)
if persistent != expected_persistent:
    raise SystemExit(f'persistent final diff mismatch\nactual={persistent}\nexpected={expected_persistent}')

if subprocess.check_output(['git', 'status', '--porcelain']).decode().strip():
    raise SystemExit('working tree not clean after final commit')

Path('/tmp/r7-round7-final-sha.txt').write_text(sha + '\n', encoding='utf-8')
print(sha)
