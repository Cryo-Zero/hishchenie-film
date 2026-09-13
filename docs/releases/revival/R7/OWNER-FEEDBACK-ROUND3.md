# REVIVAL R7 — OWNER FEEDBACK ROUND 3

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
{
  "desktop1366": {
    "before": {
      "currentAfter": "7px",
      "signalKicker": "10px",
      "signalDataDt": "9px",
      "signalTime": "7px",
      "signalStatus": "7px",
      "signalFoot": "9px",
      "signalMeta": "10px",
      "archiveMeta": "10px",
      "archiveBottom": "10px",
      "archiveDrawerHead": "9px",
      "dossierTop": "10px",
      "dossierSubject": "10px",
      "dossierSmall": "10px",
      "dossierPrompt": "10px",
      "faqQueryCode": "10px",
      "faqHeader": "10px",
      "faqCode": "10px",
      "faqSystemLabel": "10px",
      "contactLabel": "8px",
      "contactStatus": "8px",
      "footerSystem": "8px",
      "buildMark": "8px",
      "heroSystem": "9px",
      "posterHud": "8px",
      "feedRecords": "10px",
      "serviceBadge": "10px",
      "reviewEnterHint": "10px",
      "humanCheck": "10px",
      "composerLabel": "10px",
      "audiencePulseHead": "10px",
      "audiencePulseDt": "10px",
      "audiencePulseFoot": "10px"
    },
    "after": {
      "currentAfter": "11px",
      "signalKicker": "10px",
      "signalDataDt": "11px",
      "signalTime": "11px",
      "signalStatus": "11px",
      "signalFoot": "11px",
      "signalMeta": "10px",
      "archiveMeta": "10px",
      "archiveBottom": "10px",
      "archiveDrawerHead": "11px",
      "dossierTop": "10px",
      "dossierSubject": "10px",
      "dossierSmall": "10px",
      "dossierPrompt": "10px",
      "faqQueryCode": "10px",
      "faqHeader": "10px",
      "faqCode": "10px",
      "faqSystemLabel": "10px",
      "contactLabel": "10px",
      "contactStatus": "10px",
      "footerSystem": "10px",
      "buildMark": "10px",
      "heroSystem": "11px",
      "posterHud": "11px",
      "feedRecords": "10px",
      "serviceBadge": "10px",
      "reviewEnterHint": "10px",
      "humanCheck": "10px",
      "composerLabel": "10px",
      "audiencePulseHead": "10px",
      "audiencePulseDt": "10px",
      "audiencePulseFoot": "10px"
    }
  },
  "mobile390": {
    "before": {
      "currentAfter": "7px",
      "signalKicker": "11px",
      "signalDataDt": "7px",
      "signalTime": "7px",
      "signalStatus": "7px",
      "signalFoot": "7px",
      "signalMeta": "11px",
      "archiveMeta": "11px",
      "archiveBottom": "11px",
      "archiveDrawerHead": "10.72px",
      "dossierTop": "11px",
      "dossierSubject": "11px",
      "dossierSmall": "11px",
      "dossierPrompt": "11px",
      "faqQueryCode": "11px",
      "faqHeader": "11px",
      "faqCode": "11px",
      "faqSystemLabel": "11px",
      "contactLabel": "8px",
      "contactStatus": "8px",
      "footerSystem": "8px",
      "buildMark": "8px",
      "heroSystem": "10px",
      "posterHud": "10px",
      "feedRecords": "11px",
      "serviceBadge": "11px",
      "reviewEnterHint": "11px",
      "humanCheck": "11px",
      "composerLabel": "11px",
      "audiencePulseHead": "11px",
      "audiencePulseDt": "11px",
      "audiencePulseFoot": "11px"
    },
    "after": {
      "currentAfter": "9px",
      "signalKicker": "11px",
      "signalDataDt": "9px",
      "signalTime": "9px",
      "signalStatus": "9px",
      "signalFoot": "8px",
      "signalMeta": "11px",
      "archiveMeta": "11px",
      "archiveBottom": "11px",
      "archiveDrawerHead": "11px",
      "dossierTop": "11px",
      "dossierSubject": "11px",
      "dossierSmall": "11px",
      "dossierPrompt": "11px",
      "faqQueryCode": "11px",
      "faqHeader": "11px",
      "faqCode": "11px",
      "faqSystemLabel": "11px",
      "contactLabel": "10px",
      "contactStatus": "10px",
      "footerSystem": "10px",
      "buildMark": "10px",
      "heroSystem": "11px",
      "posterHud": "11px",
      "feedRecords": "11px",
      "serviceBadge": "11px",
      "reviewEnterHint": "11px",
      "humanCheck": "11px",
      "composerLabel": "11px",
      "audiencePulseHead": "11px",
      "audiencePulseDt": "11px",
      "audiencePulseFoot": "11px"
    }
  }
}
```

## Browser QA evidence

# REVIVAL R7 — Owner Feedback Round 3 browser QA

Checks: 102 / Passed: 102 / Failed: 0

- PASS — desktop typography currentAfter increased — 7px -> 11px
- PASS — desktop typography signalTime increased — 7px -> 11px
- PASS — desktop typography signalStatus increased — 7px -> 11px
- PASS — desktop SIGNAL STABLE increased — 9px -> 11px
- PASS — mobile typography currentAfter increased — 7px -> 9px
- PASS — mobile typography signalTime increased — 7px -> 9px
- PASS — mobile typography signalStatus increased — 7px -> 9px
- PASS — mobile SIGNAL STABLE increased — 7px -> 8px
- PASS — 1366 desktop heroPoster horizontal geometry preserved — {"before":{"x":791.25,"y":166.828125,"w":506.4375,"h":545.34375},"after":{"x":791.25,"y":166.828125,"w":506.4375,"h":545.34375},"maxDelta":0}
- PASS — 1366 desktop castConsole horizontal geometry preserved — {"before":{"x":68.296875,"y":3510.6875,"w":1229.390625,"h":440.953125},"after":{"x":68.296875,"y":3510.6875,"w":1229.390625,"h":440.953125},"maxDelta":0}
- PASS — 1366 desktop faqConsole horizontal geometry preserved — {"before":{"x":68.296875,"y":4170.65625,"w":1229.390625,"h":540},"after":{"x":68.296875,"y":4170.65625,"w":1229.390625,"h":540},"maxDelta":0}
- PASS — 390x844 index horizontal overflow=0 — 0
- PASS — 390x844 all 11 archive stages stable — delta=0.00 heights=472.6,472.6,472.6,472.6,472.6,472.6,472.6,472.6,472.6,472.6,472.6; aspects=1.016,0.826,0.667,1.015,0.615,0.573
- PASS — 390x844 archive images loaded
- PASS — 390x844 archive images object-fit contain
- PASS — 390x844 archive drawer width compact — {"w":296.390625,"h":489.515625,"gridOverflow":"auto","gridScroll":544,"gridClient":416,"closeInside":true,"toggleW":40,"toggleH":76}
- PASS — 390x844 archive drawer height compact — {"w":296.390625,"h":489.515625,"gridOverflow":"auto","gridScroll":544,"gridClient":416,"closeInside":true,"toggleW":40,"toggleH":76}
- PASS — 390x844 archive drawer internal scrolling enabled — {"w":296.390625,"h":489.515625,"gridOverflow":"auto","gridScroll":544,"gridClient":416,"closeInside":true,"toggleW":40,"toggleH":76}
- PASS — 390x844 archive close accessible — {"w":296.390625,"h":489.515625,"gridOverflow":"auto","gridScroll":544,"gridClient":416,"closeInside":true,"toggleW":40,"toggleH":76}
- PASS — 390x844 archive handle compact — {"w":296.390625,"h":489.515625,"gridOverflow":"auto","gridScroll":544,"gridClient":416,"closeInside":true,"toggleW":40,"toggleH":76}
- PASS — 390x844 ARCHIVE remains Materials-local — {"active":false,"visibility":"hidden","pointer":"none","open":false}
- PASS — 390x844 contact dot X fixed — x=337,337,337
- PASS — 390x844 contact no layout shift — [[13,470.6416015625,364,120.390625],[13,470.46875,364,120.390625],[13,470.46875,364,120.390625]]
- PASS — 390x844 reviews horizontal overflow=0 — 0
- PASS — 390x844 RU profanity hint absent
- PASS — 390x844 EN profanity hint absent
- PASS — 390x844 Show More initial cap — visible=6
- PASS — 390x844 Show More visible
- PASS — 390x844 Show More expands feed — visible=10
- PASS — 390x844 review controls are not sticky/fixed — [{"s":".community-feed-toolbar","pos":"static","top":375.953125},{"s":".review-display-settings","pos":"static","top":550.875},{"s":".review-sort","pos":"static","top":492.875}]
- PASS — 390x844 global site header remains sticky — sticky
- PASS — 390x844 review toolbar scrolls with document — 376.0 -> -124.0
- PASS — 390x844 JS errors=0
- PASS — 430x932 index horizontal overflow=0 — 0
- PASS — 430x932 all 11 archive stages stable — delta=0.00 heights=500.0,500.0,500.0,500.0,500.0,500.0,500.0,500.0,500.0,500.0,500.0; aspects=1.016,0.826,0.667,1.015,0.615,0.573
- PASS — 430x932 archive images loaded
- PASS — 430x932 archive images object-fit contain
- PASS — 430x932 archive drawer width compact — {"w":300,"h":540.546875,"gridOverflow":"auto","gridScroll":589,"gridClient":467,"closeInside":true,"toggleW":40,"toggleH":76}
- PASS — 430x932 archive drawer height compact — {"w":300,"h":540.546875,"gridOverflow":"auto","gridScroll":589,"gridClient":467,"closeInside":true,"toggleW":40,"toggleH":76}
- PASS — 430x932 archive drawer internal scrolling enabled — {"w":300,"h":540.546875,"gridOverflow":"auto","gridScroll":589,"gridClient":467,"closeInside":true,"toggleW":40,"toggleH":76}
- PASS — 430x932 archive close accessible — {"w":300,"h":540.546875,"gridOverflow":"auto","gridScroll":589,"gridClient":467,"closeInside":true,"toggleW":40,"toggleH":76}
- PASS — 430x932 archive handle compact — {"w":300,"h":540.546875,"gridOverflow":"auto","gridScroll":589,"gridClient":467,"closeInside":true,"toggleW":40,"toggleH":76}
- PASS — 430x932 ARCHIVE remains Materials-local — {"active":false,"visibility":"hidden","pointer":"none","open":false}
- PASS — 430x932 reviews horizontal overflow=0 — 0
- PASS — 430x932 RU profanity hint absent
- PASS — 430x932 EN profanity hint absent
- PASS — 430x932 Show More initial cap — visible=6
- PASS — 430x932 Show More visible
- PASS — 430x932 Show More expands feed — visible=10
- PASS — 430x932 review controls are not sticky/fixed — [{"s":".community-feed-toolbar","pos":"static","top":66.234375},{"s":".review-display-settings","pos":"static","top":244.6875},{"s":".review-sort","pos":"static","top":186.6875}]
- PASS — 430x932 global site header remains sticky — sticky
- PASS — 430x932 review toolbar scrolls with document — 66.2 -> -329.8
- PASS — 430x932 JS errors=0
- PASS — 844x390 index horizontal overflow=0 — 0
- PASS — 844x390 all 11 archive stages stable — delta=0.00 heights=226.2,226.2,226.2,226.2,226.2,226.2,226.2,226.2,226.2,226.2,226.2; aspects=1.016,0.826,0.667,1.015,0.615,0.573
- PASS — 844x390 archive images loaded
- PASS — 844x390 archive images object-fit contain
- PASS — 844x390 archive drawer width compact — {"w":290,"h":218.390625,"gridOverflow":"auto","gridScroll":318,"gridClient":150,"closeInside":true,"toggleW":38,"toggleH":72}
- PASS — 844x390 archive drawer height compact — {"w":290,"h":218.390625,"gridOverflow":"auto","gridScroll":318,"gridClient":150,"closeInside":true,"toggleW":38,"toggleH":72}
- PASS — 844x390 archive drawer internal scrolling enabled — {"w":290,"h":218.390625,"gridOverflow":"auto","gridScroll":318,"gridClient":150,"closeInside":true,"toggleW":38,"toggleH":72}
- PASS — 844x390 archive close accessible — {"w":290,"h":218.390625,"gridOverflow":"auto","gridScroll":318,"gridClient":150,"closeInside":true,"toggleW":38,"toggleH":72}
- PASS — 844x390 archive handle compact — {"w":290,"h":218.390625,"gridOverflow":"auto","gridScroll":318,"gridClient":150,"closeInside":true,"toggleW":38,"toggleH":72}
- PASS — 844x390 ARCHIVE remains Materials-local — {"active":false,"visibility":"hidden","pointer":"none","open":false}
- PASS — 844x390 reviews horizontal overflow=0 — 0
- PASS — 844x390 RU profanity hint absent
- PASS — 844x390 EN profanity hint absent
- PASS — 844x390 Show More initial cap — visible=6
- PASS — 844x390 Show More visible
- PASS — 844x390 Show More expands feed — visible=10
- PASS — 844x390 review controls are not sticky/fixed — [{"s":".community-feed-toolbar","pos":"static","top":147.765625},{"s":".review-display-settings","pos":"static","top":325.421875},{"s":".review-sort","pos":"static","top":267.421875}]
- PASS — 844x390 global site header remains sticky — sticky
- PASS — 844x390 review toolbar scrolls with document — 147.8 -> -352.2
- PASS — 844x390 JS errors=0
- PASS — 932x430 index horizontal overflow=0 — 0
- PASS — 932x430 all 11 archive stages stable — delta=0.00 heights=249.4,249.4,249.4,249.4,249.4,249.4,249.4,249.4,249.4,249.4,249.4; aspects=1.016,0.826,0.667,1.015,0.615,0.573
- PASS — 932x430 archive images loaded
- PASS — 932x430 archive images object-fit contain
- PASS — 932x430 archive drawer width compact — {"w":290,"h":240.796875,"gridOverflow":"auto","gridScroll":337,"gridClient":173,"closeInside":true,"toggleW":38,"toggleH":72}
- PASS — 932x430 archive drawer height compact — {"w":290,"h":240.796875,"gridOverflow":"auto","gridScroll":337,"gridClient":173,"closeInside":true,"toggleW":38,"toggleH":72}
- PASS — 932x430 archive drawer internal scrolling enabled — {"w":290,"h":240.796875,"gridOverflow":"auto","gridScroll":337,"gridClient":173,"closeInside":true,"toggleW":38,"toggleH":72}
- PASS — 932x430 archive close accessible — {"w":290,"h":240.796875,"gridOverflow":"auto","gridScroll":337,"gridClient":173,"closeInside":true,"toggleW":38,"toggleH":72}
- PASS — 932x430 archive handle compact — {"w":290,"h":240.796875,"gridOverflow":"auto","gridScroll":337,"gridClient":173,"closeInside":true,"toggleW":38,"toggleH":72}
- PASS — 932x430 ARCHIVE remains Materials-local — {"active":false,"visibility":"hidden","pointer":"none","open":false}
- PASS — 932x430 reviews horizontal overflow=0 — 0
- PASS — 932x430 RU profanity hint absent
- PASS — 932x430 EN profanity hint absent
- PASS — 932x430 Show More initial cap — visible=6
- PASS — 932x430 Show More visible
- PASS — 932x430 Show More expands feed — visible=10
- PASS — 932x430 review controls are not sticky/fixed — [{"s":".community-feed-toolbar","pos":"static","top":167.765625},{"s":".review-display-settings","pos":"static","top":345.421875},{"s":".review-sort","pos":"static","top":287.421875}]
- PASS — 932x430 global site header remains sticky — sticky
- PASS — 932x430 review toolbar scrolls with document — 167.8 -> -332.2
- PASS — 932x430 JS errors=0
- PASS — 1366x768 index horizontal overflow=0 — 0
- PASS — 1366x768 contact dot X fixed — x=1257.6875,1257.6875,1257.6875
- PASS — 1366x768 contact no layout shift — [[877.6875,443.21875,420,101],[877.6875,443.21875,420,101],[877.6875,443.21875,420,101]]
- PASS — 1366x768 reviews horizontal overflow=0 — 0
- PASS — 1366x768 RU profanity hint absent
- PASS — 1366x768 EN profanity hint absent
- PASS — 1366x768 JS errors=0
- PASS — 390x844 contact reduced-motion quiet — {"animation":"none","x":337,"x2":337}
- PASS — 1366x768 contact reduced-motion quiet — {"animation":"none","x":1257.6875,"x2":1257.6875}

Screenshots and machine-readable results were produced by the temporary GitHub Actions/Playwright harness for this Round3 run. The QA harness/dependencies are temporary and are removed from the final feature-tree after verification.

## Gate

Round3 remains part of **Draft PR #18** and is **OWNER VISUAL REVIEW PENDING / NOT PRODUCTION**. Browser QA is implementation evidence, not owner visual acceptance. No Bug Reports v2/backend/admin-notification implementation was performed.
