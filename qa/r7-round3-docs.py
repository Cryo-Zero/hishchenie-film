from pathlib import Path
import json

OUT = Path('/tmp/r7-round3-evidence')
report = (OUT / 'REPORT.md').read_text(encoding='utf-8')
typography = json.loads((OUT / 'TYPOGRAPHY.json').read_text(encoding='utf-8'))

round3 = f'''# REVIVAL R7 — OWNER FEEDBACK ROUND 3

Status: **IMPLEMENTED ON FEATURE BRANCH / BROWSER QA PASSED / OWNER VISUAL REVIEW PENDING / NOT PRODUCTION**

Date: 2026-09-11

## Owner instructions

- Reviews mobile public-feed controls (`PUBLIC FEED`, channel/records, New/Old/Popular and profanity toggle) must use normal document flow and leave the viewport while reading a long feed. The previous fixed/sticky Reviews-mobile-header preview choice is superseded. The global site-header is not redesigned by this task.
- Remove the visible RU/EN explanatory profanity-filter hint while keeping the `Скрывать грубую лексику` heading/equivalent and toggle.
- Keep ARCHIVE as a Materials-local left-wall control, but reduce the open phone drawer: approximately 70–76vw maximum in portrait, about 55–60dvh maximum, internally scrollable thumbnails, accessible close/control; low-height landscape must not become near-fullscreen.
- Supersede image-natural-aspect-driven compact Archive stage height. Compact stage geometry must stay stable across all assets; each image keeps its source proportions, is centered and uses `object-fit: contain`; free space is preferable to stretching/cropping.
- CONTACT signal dot must stop horizontal travel/teleport. It stays physically near the right endpoint/diamond; only a calm pulse/fade/glow may animate, with a quiet reduced-motion state.
- Perform a second targeted readability pass on information-bearing microcopy of the tiny 6–9px class. Desktop target for the smallest functional/status labels is roughly +4px when geometry permits; mobile roughly +2px. `SIGNAL // STABLE` is a separate smaller increase. Decorative watermarks are excluded; no mechanical global font-size increase.
- Required browser-render QA: `390×844`, `430×932`, `844×390`, `932×430`, `1366×768`, including Reviews flow/Show More/hint removal, all Archive assets/stage height/drawer, Contact X/reduced motion, typography before→after, overflow and JS errors.
- Bug Reports v2/backend/admin notifications remain **OPEN DISCUSSION** and are explicitly out of scope.

## Implementation

- Removed the Reviews-only fixed-header override; compact public-feed toolbar/settings/sort use normal flow. The existing global R7 sticky site-header behavior remains unchanged in intent.
- Removed the visible profanity-filter explanatory `<small>` from `reviews.html`; the underlying i18n key may remain for compatibility but no longer renders in the UI.
- Replaced compact Archive asset-aspect-driven stage sizing with stable viewport-based stage geometry; images stay centered and contained without distortion.
- Reduced portrait and landscape Archive drawer footprint, made the thumbnail index internally scrollable and kept the Materials-local wall activation rule.
- Replaced CONTACT horizontal dot travel with a fixed endpoint opacity/glow pulse; reduced motion disables the pulse.
- Raised targeted information-bearing microcopy groups while preserving hierarchy and excluding decorative watermarks from the blanket.
- Round2 `Show More` implementation was not modified.

## Superseded R7 preview behavior

Historical Round1/Round2 records remain intact. Active Round3 behavior supersedes:

1. **fixed/sticky Reviews mobile presentation while reading the long feed** → public-feed controls now leave the viewport in normal document flow;
2. **image-natural-aspect-driven compact Archive stage height** → compact stage height is stable across all selected assets while images remain undistorted via centered `object-fit: contain`.

## Contact indicator rule

The CONTACT endpoint dot is spatially fixed near the right endpoint. Animation may change opacity/glow only; horizontal movement through `left`/`translateX` is not part of the active R7 rule. Reduced motion presents a static indicator.

## Readability direction

Information-bearing terminal/system microcopy remains visually subordinate but readable. Do not solve readability by increasing every font. Target the tiny functional/status/meta class, preserve hierarchy, and verify clipping/overflow/world-grid behavior in a real browser. `SIGNAL // STABLE` remains a separate secondary class.

## Computed typography evidence

```json
{json.dumps(typography, ensure_ascii=False, indent=2)}
```

## Browser QA evidence

{report}

Screenshots and machine-readable results were produced by the temporary GitHub Actions/Playwright harness for this Round3 run. The QA harness/dependencies are temporary and are removed from the final feature-tree after verification.

## Gate

Round3 remains part of **Draft PR #18** and is **OWNER VISUAL REVIEW PENDING / NOT PRODUCTION**. Browser QA is implementation evidence, not owner visual acceptance. No Bug Reports v2/backend/admin-notification implementation was performed.
'''
Path('docs/releases/revival/R7/OWNER-FEEDBACK-ROUND3.md').write_text(round3, encoding='utf-8')


def append_once(path, marker, block):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    if marker in text:
        raise SystemExit(f'Marker already exists in {path}: {marker}')
    p.write_text(text.rstrip() + '\n\n' + block.strip() + '\n', encoding='utf-8')

append_once(
    'docs/releases/revival/R7/PREVIEW-HANDOFF.md',
    '## Owner feedback round 3 — 2026-09-11',
    '''## Owner feedback round 3 — 2026-09-11

Round3 preserves earlier owner-feedback records as history while superseding two active preview choices:

- Reviews mobile public-feed controls no longer remain fixed/sticky while reading; `PUBLIC FEED`, channel/records, sort controls and profanity toggle now leave the viewport in normal document flow;
- compact Archive stage no longer follows each selected asset's natural aspect ratio; stage geometry is stable across the asset set and images remain centered with `object-fit: contain`.

Additional owner-directed Round3 changes:

- visible profanity-filter explanatory hint removed in RU/EN while keeping the toggle;
- phone Archive drawer footprint reduced and thumbnail area made internally scrollable; ARCHIVE remains a Materials-local left-wall control;
- CONTACT dot fixed at the right endpoint and changed to a calm opacity/glow pulse, with no horizontal travel and a static reduced-motion state;
- information-bearing microcopy received a second targeted readability pass; decorative watermarks were not globally enlarged;
- Round2 Show More behavior was retained.

Real Chromium QA covered `390×844`, `430×932`, `844×390`, `932×430`, `1366×768`, including all 11 Archive assets, stable stage geometry, Reviews flow/Show More, RU/EN hint removal, Contact X stability/reduced motion, computed typography before→after, horizontal overflow and page JS errors. Exact results live in `OWNER-FEEDBACK-ROUND3.md`.

**Bug Reports v2/backend/admin notifications remain OPEN DISCUSSION and were not implemented in Round3.**

Round3 remains **OWNER VISUAL REVIEW PENDING / NOT PRODUCTION**. Browser QA must not be described as owner visual acceptance.'''
)

append_once(
    'docs/current/VISUAL-SYSTEM.md',
    '## R7 Round 3 preview refinements — owner-directed, not production',
    '''## R7 Round 3 preview refinements — owner-directed, not production

These are owner-directed durable visual rules for the R7 preview; R7 is not production until separately accepted and merged.

- On compact/mobile Reviews, public-feed heading/status/records, New/Old/Popular and profanity toggle belong to normal document flow and must not occupy permanent sticky/fixed space while the user reads the feed.
- For compact Materials, mixed image aspect ratios must not move the page: the main stage uses stable geometry while assets preserve their own proportions through centered `object-fit: contain`. Free space inside the stage is preferable to stretching/cropping.
- ARCHIVE remains the intentional Materials left-wall exception, but its open phone drawer must be compact/non-fullscreen and internally scrollable, especially in low-height landscape.
- CONTACT's small endpoint indicator remains physically fixed near the right endpoint/diamond. Signal animation may pulse/fade/glow but must not travel horizontally or visibly teleport on loop.
- Information-bearing microcopy must stay subordinate **and readable**. Do not solve this with a global font-size increase: target the tiny functional/status/meta class, preserve hierarchy, and verify geometry in browser. Decorative watermarks are not part of this rule.
- Substantial responsive changes remain subject to direction/concept approval where practical, and final acceptance must use actual browser rendering rather than mockup-only evidence.'''
)

append_once(
    'docs/current/ROADMAP.md',
    '### Owner feedback round 3 — implemented on draft R7 branch',
    '''### Owner feedback round 3 — implemented on draft R7 branch

Round3 owner corrections implemented and browser-QA'd on `revival-r7-responsive-mobile`:

- Reviews compact public-feed controls return to normal flow; the previous fixed/sticky preview choice remains only as history;
- profanity explanatory hint removed from visible UI while preserving the toggle;
- compact Archive drawer reduced and internally scrollable; all-asset stage geometry stabilized without image distortion;
- CONTACT horizontal dot travel replaced by a fixed endpoint pulse;
- targeted information-bearing microcopy readability pass completed;
- Round2 Show More regression preserved;
- required phone/landscape/desktop Chromium matrix passed.

Next gate: **owner visual review of Round3 preview**. Do not merge R7, publish mobile, begin Bug Reports v2/admin notifications, or treat browser QA as owner visual acceptance without a separate explicit decision.'''
)

print('Round3 docs prepared')
