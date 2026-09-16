from pathlib import Path
import subprocess

round_doc = '''# REVIVAL R7 — OWNER FEEDBACK ROUND 6

Status: **IMPLEMENTED ON FEATURE BRANCH / BROWSER QA PASSED / OWNER VISUAL REVIEW PENDING / NOT PRODUCTION**

Date: 2026-09-16
Starting verified Round5 head: `4197adc13cc91cbad395e6d2819e0fbb23278449`

## Owner-directed changes

- Desktop CONTACT restores deliberate point travel across the line. Arrival at the fixed endpoint diamond triggers one restrained receive/fill/glow phase, then the cycle resets. Reduced-motion keeps the endpoint static.
- Trailer audio no longer inherits a stored/ambiguous application state: the page does not autoplay, native controls remain enabled, the application explicitly starts each page entry unmuted at volume `0.30`, and refresh/BFCache entry reapplies that initial state. User volume/mute changes during the current page session are not overridden while playing.
- Materials enlarged/lightbox mode uses materially more viewport space on desktop; normal Materials geometry is unchanged. Close and desktop pagination controls use clean near-square geometry. Compact/mobile previous/next controls remain hidden and swipe remains navigation.
- Profile help remains tied to `?` but is presented as a compact anchored popover instead of a composer-wide heavy overlay; help content is unchanged.
- Mobile sequential Actors/FAQ shell transitions are slowed/softened while preserving the existing state model, internal staged reveal and no-auto-scroll rule.
- Mobile burger no longer locks body scrolling. Pointer movement/scroll gestures do not close it; deliberate outside tap, menu item/X and fullscreen entry still close it. Residual bottom spacing below the REPORT item is removed except for a real device safe-area inset.
- Phone smart-header keeps existing hysteresis/interaction/burger safeguards and receives a smoother translate/opacity interpolation only.

## Safety

No Supabase/schema/RLS/Auth/profile/review business logic was changed. `js/public-response.js`, admin runtime, production `main`, deploy state, Custom Cursor and SECURITY PROTOCOL // 2045 are outside this round.

## Browser QA

Real Chromium QA covers `390×844`, `430×932`, `844×390`, `932×430`, `768×1024`, `1024×768`, `1366×768`, plus reduced-motion CONTACT and Round5-vs-candidate desktop geometry comparison. Exact-final-SHA verification is repeated after the clean commit by the same workflow before push.

Browser/platform note for trailer audio: the site explicitly requests unmuted `0.30` volume and never programmatically autoplays. Native browser/OS/device media policy or hardware output may still constrain actual acoustic output; the application no longer leaves its own mute/volume/autoplay state ambiguous.
'''
Path('docs/releases/revival/R7/OWNER-FEEDBACK-ROUND6.md').write_text(round_doc,encoding='utf-8')

updates={
 'docs/releases/revival/R7/PREVIEW-HANDOFF.md': '''\n\n## Owner feedback Round 6 — 2026-09-16\n\nPost-Round5 visual review keeps the same draft R7 branch and supersedes only the specifically changed preview behavior: desktop CONTACT again uses deliberate line travel with a restrained diamond receive reaction; trailer initial audio is explicit/no-autoplay/unmuted at 30%; desktop Materials enlarged mode uses more viewport space with clean controls; profile help is a compact anchored popover; sequential mobile Actors/FAQ shell transitions are softer; an open burger no longer locks page scrolling while deliberate outside taps still close it; and phone smart-header hide/reveal is visually smoother.\n\nRound6 remains **OWNER VISUAL REVIEW PENDING / NOT PRODUCTION**. No Supabase/backend/deploy/main work is part of this round.\n''',
 'docs/current/VISUAL-SYSTEM.md': '''\n\n## R7 Round 6 preview refinements — owner-directed, not production\n\nThese rules supersede only conflicting R7 preview behavior and do not alter the approved R6 production foundation.\n\n- Desktop CONTACT may again use a point travelling along the existing line, but arrival must read as an intentional signal handoff: the endpoint diamond briefly fills/glows and resets before the next calm cycle. Reduced-motion has no travelling animation.\n- Materials enlarged/lightbox mode must provide a visibly meaningful scale advantage over the normal stage while preserving contained image proportions and the existing sci-fi presentation. Enlarged-view close/pagination controls use balanced near-square geometry.\n- Profile help remains attached to the `?` control and reads as a compact system popover rather than a heavy form-wide/fullscreen overlay; help text is not changed by this visual rule.\n- Sequential mobile Actors/FAQ transitions should overlap/crossfade the list and detail shell softly; no long empty phase, layout jump or automatic page scroll is introduced.\n- An open mobile burger must not lock document scrolling. Scroll/touch movement alone does not dismiss it; deliberate outside tap and explicit navigation/close/fullscreen actions do.\n- Phone smart-header direction logic/hysteresis stays intact while the visual translate/opacity hide/reveal should interpolate smoothly rather than snap.\n'''
}
for name,add in updates.items():
    p=Path(name); s=p.read_text(encoding='utf-8')
    marker='Owner feedback Round 6' if 'PREVIEW-HANDOFF' in name else 'R7 Round 6 preview refinements'
    if marker in s: raise SystemExit(f'{name}: Round6 marker already present')
    p.write_text(s.rstrip()+add+'\n',encoding='utf-8')

temp=[
 '.github/workflows/r7-owner-feedback-round6.yml',
 'scripts/r7_round6_apply.py',
 'scripts/r7_round6_qa.cjs',
 'scripts/r7_round6_finalize.py',
]
subprocess.run(['git','rm',*temp],check=True)
final=[
 'js/site.js','js/responsive-r7.js','css/responsive-r7-polish.css',
 'docs/releases/revival/R7/OWNER-FEEDBACK-ROUND6.md',
 'docs/releases/revival/R7/PREVIEW-HANDOFF.md','docs/current/VISUAL-SYSTEM.md'
]
subprocess.run(['git','add',*final],check=True)
subprocess.run(['git','diff','--cached','--check'],check=True)
actual=sorted(subprocess.check_output(['git','diff','--cached','--name-only']).decode().splitlines())
expected=sorted(temp+final)
if actual!=expected:
    raise SystemExit(f'final staged paths mismatch\nactual={actual}\nexpected={expected}')
subprocess.run(['git','config','user.name','github-actions[bot]'],check=True)
subprocess.run(['git','config','user.email','41898282+github-actions[bot]@users.noreply.github.com'],check=True)
subprocess.run(['git','commit','-m','REVIVAL R7: owner feedback round 6'],check=True)
sha=subprocess.check_output(['git','rev-parse','HEAD']).decode().strip()
Path('/tmp/r7-round6-final-sha.txt').write_text(sha+'\n',encoding='utf-8')
print(sha)
