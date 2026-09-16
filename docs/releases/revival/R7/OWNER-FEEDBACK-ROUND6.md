# REVIVAL R7 — OWNER FEEDBACK ROUND 6

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
