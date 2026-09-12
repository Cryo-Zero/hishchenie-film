# REVIVAL R7 — OWNER FEEDBACK ROUND 4
+ PROJECT RULES / FUTURE ARCHITECTURE CAPTURE

Status: **IMPLEMENTED ON FEATURE BRANCH / FULL BROWSER MATRIX PASSED / EXACT-FINAL-SHA VERIFICATION FOLLOWS THIS COMMIT / OWNER VISUAL REVIEW PENDING / NOT PRODUCTION**

Date: 2026-09-11
Starting verified Round3 head: `a97faa551aba14df059bec815445fd1200dc8360`

## Active owner corrections

Round4 preserves Round1–3 as history but supersedes these active preview choices:

- Round3 fixed-only CONTACT endpoint → small local reversible horizontal signal motion near the right endpoint, no full-line travel/teleport; reduced motion has no horizontal travel.
- Round3 mobile left-wall Archive trigger → compact horizontal `ARCHIVE // 11` trigger on compact/phone contexts; the existing compact drawer/index and stable `object-fit: contain` stage remain.
- Round3 Reviews normal-flow-only controls → compact sticky/following control surface inside the review-feed context. The removed profanity explanatory paragraph remains removed.
- Round3 ordinary sticky mobile site header → phone-only smart hide on meaningful downward scroll / reveal on upward scroll, with threshold/hysteresis, top visibility, burger/interacting safety and rotation reset.

Additional active corrections:

- mobile SUBJECT DOSSIER footer prompt is keyboard/touch interactive and routes to the exact existing `SUBJECT INDEX` action with no automatic page scroll;
- CURRENT SIGNAL no longer displays fabricated/ambiguous time language: rows use `SIGNAL_03 / ONLINE`, `ARCHIVE / OPEN`, `RELEASE / PENDING` around semantic RU/EN center copy;
- Reviews Freshness percentage/state is geometrically centred inside a true circle, including multi-digit/pending states;
- open profile help visibly highlights `?`; anchored popover keeps its size, becomes slightly more translucent/blurred, remains readable and does not lock/reflow the page;
- Hero synopsis text is deliberately unchanged. **OPEN VISUAL QUESTION:** mobile Hero synopsis placement requires owner/planning-chat decision. No new placement was invented in Round4.

## Implementation boundaries

Round4 is frontend + documentation only. It does **not** implement Bug Reports v2, admin Bug Reports, Telegram notifications, CAPTCHA migration/deployment, backend migration, Supabase migration, data copy, credential/end-point changes or production database writes.

## Durable future architecture captured from planning

### Planning / bridge workflow

Keep the project loop:

`discussion → owner approval → task specification → bridge implementation → bridge report → independent verification → owner visual review`

Planning may explore later ideas while bridge work is active, but those ideas must not silently expand the current bridge task.

### Review moderation / official replies — planned

- Team/admin replies originate from ADMIN PANEL, not public visitor UI.
- Future official-reply templates are clickable helpers that insert editable text into the official reply composer; clicking a template never posts automatically.
- Several common positive/neutral/constructive templates may exist; special reviews may receive individually written replies.
- Normal negative criticism stays public; low score alone is never moderation grounds.
- Severe rule-breaking text may be hidden/replaced publicly by a system marker while a genuine viewer score may remain in aggregate.
- Obvious bot/spam/manipulated/fake review may be removed entirely, including its score.
- Abusive replies may similarly be hidden/replaced by a system marker.
- Moderation history should retain reason, time, acting authorized admin/operator and internal note/history.

### Admin → public site — planned

A future admin `ОТКРЫТЬ САЙТ ↗` action may open the visitor-facing site in a new tab. Public pages must not expose moderation controls or become an intentional “admin mode”; authentication remains an admin-panel concern.

### Bug Reports v2 — accepted future direction, not implemented

Planned flow:

`public site → Bug Report form → server-verified anti-bot when required → server-side save → Supabase-compatible/Russian-hosted backend → ADMIN / BUG REPORTS → minimal Telegram alert → admin workflow`

Visitor form direction:

- single-choice category: display problem / button or function failure / slow or frozen page / reviews problem / other;
- optional details field with simple placeholder **`Что случилось?`**;
- do not use QA-jargon prompts about expected result or reproduction steps;
- optional diagnostics checkbox, unchecked by default: `Приложить техническую информацию, чтобы помочь найти ошибку`;
- if unchecked, report still submits.

Permitted optional diagnostics package:

- site build/version;
- current page/section;
- interface language;
- browser family + major version;
- OS family;
- viewport size/orientation.

Do not plan to store in the Bug Report: raw IP, physical screen resolution unless separately justified, full raw User-Agent, UUID/profile ID, cookies/localStorage, review/reply contents, phone model or unrelated profile/user information.

Success-message direction:

> Спасибо! Сообщение передано команде.
> Вы помогаете системе становиться стабильнее.

Visitor-facing v1 does not expose internal report-status tracking.

### Bug Reports admin workflow — planned

Separate `BUG REPORTS` section with exactly four statuses:

`NEW → IN PROGRESS → FIXED → CLOSED`

Admin can open a report, see category/details/permitted optional diagnostics, change status and add internal note. Opening does **not** automatically change `NEW → IN PROGRESS`; `FIXED/CLOSED` are never inferred automatically. Status history records previous/new status, time, authorized operator and internal notes where applicable.

### Telegram notification — planned

Telegram is an alert channel, never source of truth. A new-report alert should contain only minimum data such as NEW report, report number, category and admin-open link/action. Full user-written bug text/diagnostics are not sent by default. Telegram delivery failure must never lose the safely stored report.

### CAPTCHA / anti-bot — planned

Prefer research/deployment of a Russian solution such as Yandex SmartCaptcha or another suitable Russian-hosted option; nothing is deployed by Round4.

- Verification normally appears at submit stage, not as permanent form furniture.
- A new anonymous identity must pass a server-verified human check before first review.
- Clearing cookies/new anonymous identity does not bypass protection; the new identity needs verification again.
- Editing an existing owned review normally does not repeat CAPTCHA absent abuse.
- Bug Report submission uses server-verified anti-bot/rate-limit protection.
- A fake local `Я не робот` checkbox is insufficient.
- Raw IP storage is not the primary anti-bot model.

### Privacy / raw IP — durable direction

Privacy minimization/privacy-by-design remains intentional. Application product tables/admin UI/reviews/bug reports do not store/show/attach raw IP and product identity must not be built around IP. Revisit only with explicit future approval plus legal/technical reason.

Infrastructure/providers may technically see connection IP while delivering service, so project copy must never claim that “nobody can ever see your IP.”

### Russian backend / Supabase-compatible migration research — future

Production Supabase is unchanged by Round4. First research direction is a self-hosted Supabase-compatible stack on infrastructure physically located in Russia, aiming to preserve PostgreSQL, RLS, RPC and current application/admin/community architecture. No provider is approved. A full Russian managed stack remains an alternative if self-hosted compatibility is unsuitable.

Do not migrate/copy production data or change credentials/endpoints until separately approved.

### Legal/privacy documents

FAQ `На сайте есть безопасность?` remains intentional artistic wordplay against the film phrase `В системе нет безопасности`; it is not the legal privacy notice and must not be rewritten into one.

Future legal/privacy material should be separate: personal-data/privacy policy, community rules and legally required consent/notice controls. Do not add a random alarming disclaimer under Reviews “just in case.” Community rules may later advise users not to publish their own/third-party personal information.

### Personal-data operator — provisional prerequisite

Current project assumption only: likely operator is the **author of the film**. Identity/legal details are not confirmed. Owner will clarify later. Do not publish guessed legal name/contact. The project owner explicitly says the operator will not be himself and not an ordinary site-team member; a lawyer is not automatically operator merely for providing legal assistance. Final operator identity must be confirmed before legal/privacy publication.

## Browser QA evidence

# REVIVAL R7 — Owner Feedback Round 4 browser QA

Exact tested SHA: WORKTREE PRE-COMMIT
Checks: 226 / Passed: 226 / Failed: 0

- PASS — 1366 desktop .hero-poster-frame geometry preserved — {"before":{"x":791.25,"w":506.4375,"h":545.34375},"after":{"x":791.25,"w":506.4375,"h":545.34375},"maxDelta":0}
- PASS — 1366 desktop #materials .archive-stage-wrap geometry preserved — {"before":{"x":68.296875,"w":1229.390625,"h":396.984375},"after":{"x":68.296875,"w":1229.390625,"h":396.984375},"maxDelta":0}
- PASS — 1366 desktop #cast .cast-console geometry preserved — {"before":{"x":68.296875,"w":1229.390625,"h":440.953125},"after":{"x":68.296875,"w":1229.390625,"h":440.953125},"maxDelta":0}
- PASS — 1366 desktop #faq .faq-console geometry preserved — {"before":{"x":68.296875,"w":1229.390625,"h":540},"after":{"x":68.296875,"w":1229.390625,"h":540},"maxDelta":0}
- PASS — 390x844 index horizontal overflow=0 — 0
- PASS — 390x844 index JS errors=0
- PASS — 390x844 Hero synopsis preserved — В мире, где человек должен доказать свою пользу системе, взросление становится борьбой за право самому выбирать своё будущее.
- PASS — 390x844 signal semantic RU tokens — [["SIGNAL_03","Трейлер доступен","ONLINE"],["ARCHIVE","Публичный архив открыт","OPEN"],["RELEASE","Релиз ожидает подтверждения","PENDING"]]
- PASS — 390x844 signal no fake time/NOW RU — SIGNAL_03|Трейлер доступен|ONLINE|ARCHIVE|Публичный архив открыт|OPEN|RELEASE|Релиз ожидает подтверждения|PENDING
- PASS — 390x844 signal EN semantic states — [["SIGNAL_03","Trailer online","ONLINE"],["ARCHIVE","Public archive open","OPEN"],["RELEASE","Release awaiting confirmation","PENDING"]]
- PASS — 390x844 signal EN centers meaningful — [["SIGNAL_03","Trailer online","ONLINE"],["ARCHIVE","Public archive open","OPEN"],["RELEASE","Release awaiting confirmation","PENDING"]]
- PASS — 390x844 signal typography readable — 9px,11px,9px
- PASS — 390x844 vertical archive handle gone — {"old":"none","mobile":"flex","text":"ARCHIVE // 11"}
- PASS — 390x844 horizontal ARCHIVE // 11 visible — {"old":"none","mobile":"flex","text":"ARCHIVE // 11"}
- PASS — 390x844 all 11 Materials stage heights stable — delta=0.00 heights=472.6,472.6,472.6,472.6,472.6,472.6,472.6,472.6,472.6,472.6,472.6
- PASS — 390x844 all 11 images contained — contain
- PASS — 390x844 mixed source ratios actually tested — 1.016,0.826,0.667,0.667,0.667,0.667,1.015,0.667,0.615,0.573,0.667
- PASS — 390x844 Archive drawer opens from horizontal control — {"open":true,"w":296.390625,"h":489.515625,"overflow":"auto","scroll":544,"client":416,"close":true,"count":11}
- PASS — 390x844 Archive thumbnails internally usable — {"open":true,"w":296.390625,"h":489.515625,"overflow":"auto","scroll":544,"client":416,"close":true,"count":11}
- PASS — 390x844 Archive drawer remains compact — {"open":true,"w":296.390625,"h":489.515625,"overflow":"auto","scroll":544,"client":416,"close":true,"count":11}
- PASS — 390x844 materials horizontal overflow=0 — 0
- PASS — 390x844 Show More initial 6 — 6
- PASS — 390x844 Show More expands by 6 — 12
- PASS — 390x844 review controls follow feed — {"pos":"sticky","top":72,"h":201.96875,"display":"grid"}
- PASS — 390x844 review control dock not giant — {"pos":"sticky","top":72,"h":201.96875,"display":"grid"}
- PASS — 390x844 review sort/toggle usable
- PASS — 390x844 profanity explanation absent
- PASS — 390x844 reviews overflow=0 — 0
- PASS — 390x844 reviews JS errors=0
- PASS — 390x844 contact local X motion — range=5.26 xs=334.26,333.22,332.22,331.22,330.42,329.75,329.32,329.06,329.00,329.12
- PASS — 390x844 contact no teleport — maxStep=1.05
- PASS — 390x844 contact diamond static — 343.13604736328125,343.13604736328125,343.13604736328125,343.13604736328125,343.13604736328125,343.13604736328125,343.13604736328125,343.13604736328125,343.13604736328125,343.13604736328125
- PASS — 390x844 contact no layout shift — [[13,669.0625,364,120.390625],[13,669.0625,364,120.390625],[13,669.0625,364,120.390625],[13,669.0625,364,120.390625],[13,669.0625,364,120.390625],[13,669.0625,364,120.390625],[13,669.0625,364,120.390625],[13,669.0625,364,120.390625],[13,669.0625,364,120.390625],[13,669.0625,364,120.390625]]
- PASS — 390x844 contact reduced-motion no X motion — {"x":337,"anim":"none","transform":"none","x2":337}
- PASS — 390x844 actor prompt interactive — {"role":"button","tab":"0","text":"ФАЙЛ ЗАГРУЖЕН // ВЫБЕРИТЕ ДРУГОЙ СУБЪЕКТ","min":"44px"}
- PASS — 390x844 actor open no auto-scroll — 4216->4216
- PASS — 390x844 actor prompt same return state — scroll=4216->4216
- PASS — 390x844 actor prompt return no scroll — 4216->4216
- PASS — 390x844 main SUBJECT INDEX still returns
- PASS — 390x844 main SUBJECT INDEX no scroll — 4216->4216
- PASS — 390x844 actor keyboard Enter returns
- PASS — 390x844 actor keyboard return no scroll — 4216->4216
- PASS — 390x844 actor prompt EN works — FILE LOADED // SELECT ANOTHER SUBJECT
- PASS — 390x844 freshness 7% centered — {"rw":72,"rh":72,"dx":-0.0078125,"dy":0}
- PASS — 390x844 freshness 64% centered — {"rw":72,"rh":72,"dx":0,"dy":0}
- PASS — 390x844 freshness 100% centered — {"rw":72,"rh":72,"dx":0,"dy":0}
- PASS — 390x844 freshness — centered — {"rw":72,"rh":72,"dx":0,"dy":0}
- PASS — 390x844 profile ? active state — {"rest":{"border":"rgba(157, 205, 211, 0.32)","bg":"rgba(5, 12, 14, 0.5)"},"open":{"aria":"true","border":"rgba(189, 232, 237, 0.773)","bg":"rgba(26, 48, 51, 0.675)"}}
- PASS — 390x844 profile popover lighter/translucent — {"bg":"rgba(7, 13, 14, 0.84)","blur":"blur(12px)"}
- PASS — 390x844 profile popover no page move/lock — 717->717; overflowY=auto
- PASS — 390x844 profile ? returns to rest
- PASS — 390x844 smart header visible at top — {"smart":true,"hidden":false}
- PASS — 390x844 QA header focus cleared — false
- PASS — 390x844 scroll down hides header — {"hidden":true,"transform":"matrix(1, 0, 0, 1, 0, -69)"}
- PASS — 390x844 scroll up reveals header
- PASS — 390x844 1px scroll no jitter — false->false
- PASS — 390x844 burger open keeps header visible — {"open":true,"hidden":false}
- PASS — 390→844 rotation reveals header
- PASS — 390x844 smart header reduced-motion minimal transition — 1e-05s
- PASS — 430x932 index horizontal overflow=0 — 0
- PASS — 430x932 index JS errors=0
- PASS — 430x932 Hero synopsis preserved — В мире, где человек должен доказать свою пользу системе, взросление становится борьбой за право самому выбирать своё будущее.
- PASS — 430x932 signal semantic RU tokens — [["SIGNAL_03","Трейлер доступен","ONLINE"],["ARCHIVE","Публичный архив открыт","OPEN"],["RELEASE","Релиз ожидает подтверждения","PENDING"]]
- PASS — 430x932 signal no fake time/NOW RU — SIGNAL_03|Трейлер доступен|ONLINE|ARCHIVE|Публичный архив открыт|OPEN|RELEASE|Релиз ожидает подтверждения|PENDING
- PASS — 430x932 signal EN semantic states — [["SIGNAL_03","Trailer online","ONLINE"],["ARCHIVE","Public archive open","OPEN"],["RELEASE","Release awaiting confirmation","PENDING"]]
- PASS — 430x932 signal EN centers meaningful — [["SIGNAL_03","Trailer online","ONLINE"],["ARCHIVE","Public archive open","OPEN"],["RELEASE","Release awaiting confirmation","PENDING"]]
- PASS — 430x932 signal typography readable — 9px,11px,9px
- PASS — 430x932 vertical archive handle gone — {"old":"none","mobile":"flex","text":"ARCHIVE // 11"}
- PASS — 430x932 horizontal ARCHIVE // 11 visible — {"old":"none","mobile":"flex","text":"ARCHIVE // 11"}
- PASS — 430x932 all 11 Materials stage heights stable — delta=0.00 heights=500.0,500.0,500.0,500.0,500.0,500.0,500.0,500.0,500.0,500.0,500.0
- PASS — 430x932 all 11 images contained — contain
- PASS — 430x932 mixed source ratios actually tested — 1.016,0.826,0.667,0.667,0.667,0.667,1.015,0.667,0.615,0.573,0.667
- PASS — 430x932 Archive drawer opens from horizontal control — {"open":true,"w":300,"h":540.546875,"overflow":"auto","scroll":589,"client":467,"close":true,"count":11}
- PASS — 430x932 Archive thumbnails internally usable — {"open":true,"w":300,"h":540.546875,"overflow":"auto","scroll":589,"client":467,"close":true,"count":11}
- PASS — 430x932 Archive drawer remains compact — {"open":true,"w":300,"h":540.546875,"overflow":"auto","scroll":589,"client":467,"close":true,"count":11}
- PASS — 430x932 materials horizontal overflow=0 — 0
- PASS — 430x932 Show More initial 6 — 6
- PASS — 430x932 Show More expands by 6 — 12
- PASS — 430x932 review controls follow feed — {"pos":"sticky","top":72,"h":201.96875,"display":"grid"}
- PASS — 430x932 review control dock not giant — {"pos":"sticky","top":72,"h":201.96875,"display":"grid"}
- PASS — 430x932 review sort/toggle usable
- PASS — 430x932 profanity explanation absent
- PASS — 430x932 reviews overflow=0 — 0
- PASS — 430x932 reviews JS errors=0
- PASS — 430x932 smart header visible at top — {"smart":true,"hidden":false}
- PASS — 430x932 QA header focus cleared — false
- PASS — 430x932 scroll down hides header — {"hidden":true,"transform":"matrix(1, 0, 0, 1, 0, -69)"}
- PASS — 430x932 scroll up reveals header
- PASS — 430x932 1px scroll no jitter — false->false
- PASS — 430x932 burger open keeps header visible — {"open":true,"hidden":false}
- PASS — 430x932 smart header reduced-motion minimal transition — 1e-05s
- PASS — 844x390 index horizontal overflow=0 — 0
- PASS — 844x390 index JS errors=0
- PASS — 844x390 Hero synopsis preserved — В мире, где человек должен доказать свою пользу системе, взросление становится борьбой за право самому выбирать своё будущее.
- PASS — 844x390 signal semantic RU tokens — [["SIGNAL_03","Трейлер доступен","ONLINE"],["ARCHIVE","Публичный архив открыт","OPEN"],["RELEASE","Релиз ожидает подтверждения","PENDING"]]
- PASS — 844x390 signal no fake time/NOW RU — SIGNAL_03|Трейлер доступен|ONLINE|ARCHIVE|Публичный архив открыт|OPEN|RELEASE|Релиз ожидает подтверждения|PENDING
- PASS — 844x390 signal EN semantic states — [["SIGNAL_03","Trailer online","ONLINE"],["ARCHIVE","Public archive open","OPEN"],["RELEASE","Release awaiting confirmation","PENDING"]]
- PASS — 844x390 signal EN centers meaningful — [["SIGNAL_03","Trailer online","ONLINE"],["ARCHIVE","Public archive open","OPEN"],["RELEASE","Release awaiting confirmation","PENDING"]]
- PASS — 844x390 signal typography readable — 11px,11px,11px
- PASS — 844x390 vertical archive handle gone — {"old":"none","mobile":"flex","text":"ARCHIVE // 11"}
- PASS — 844x390 horizontal ARCHIVE // 11 visible — {"old":"none","mobile":"flex","text":"ARCHIVE // 11"}
- PASS — 844x390 all 11 Materials stage heights stable — delta=0.00 heights=226.2,226.2,226.2,226.2,226.2,226.2,226.2,226.2,226.2,226.2,226.2
- PASS — 844x390 all 11 images contained — contain
- PASS — 844x390 mixed source ratios actually tested — 1.016,0.826,0.667,0.667,0.667,0.667,1.015,0.667,0.615,0.573,0.667
- PASS — 844x390 Archive drawer opens from horizontal control — {"open":true,"w":290,"h":218.390625,"overflow":"auto","scroll":318,"client":150,"close":true,"count":11}
- PASS — 844x390 Archive thumbnails internally usable — {"open":true,"w":290,"h":218.390625,"overflow":"auto","scroll":318,"client":150,"close":true,"count":11}
- PASS — 844x390 Archive drawer remains compact — {"open":true,"w":290,"h":218.390625,"overflow":"auto","scroll":318,"client":150,"close":true,"count":11}
- PASS — 844x390 materials horizontal overflow=0 — 0
- PASS — 844x390 Show More initial 6 — 6
- PASS — 844x390 Show More expands by 6 — 12
- PASS — 844x390 review controls follow feed — {"pos":"sticky","top":70,"h":146.78125,"display":"grid"}
- PASS — 844x390 review control dock not giant — {"pos":"sticky","top":70,"h":146.78125,"display":"grid"}
- PASS — 844x390 review sort/toggle usable
- PASS — 844x390 profanity explanation absent
- PASS — 844x390 reviews overflow=0 — 0
- PASS — 844x390 reviews JS errors=0
- PASS — 844x390 smart header visible at top — {"smart":true,"hidden":false}
- PASS — 844x390 QA header focus cleared — false
- PASS — 844x390 scroll down hides header — {"hidden":true,"transform":"matrix(1, 0, 0, 1, 0, -69)"}
- PASS — 844x390 scroll up reveals header
- PASS — 844x390 1px scroll no jitter — false->false
- PASS — 844x390 burger open keeps header visible — {"open":true,"hidden":false}
- PASS — 844x390 smart header reduced-motion minimal transition — 1e-05s
- PASS — 932x430 index horizontal overflow=0 — 0
- PASS — 932x430 index JS errors=0
- PASS — 932x430 Hero synopsis preserved — В мире, где человек должен доказать свою пользу системе, взросление становится борьбой за право самому выбирать своё будущее.
- PASS — 932x430 signal semantic RU tokens — [["SIGNAL_03","Трейлер доступен","ONLINE"],["ARCHIVE","Публичный архив открыт","OPEN"],["RELEASE","Релиз ожидает подтверждения","PENDING"]]
- PASS — 932x430 signal no fake time/NOW RU — SIGNAL_03|Трейлер доступен|ONLINE|ARCHIVE|Публичный архив открыт|OPEN|RELEASE|Релиз ожидает подтверждения|PENDING
- PASS — 932x430 signal EN semantic states — [["SIGNAL_03","Trailer online","ONLINE"],["ARCHIVE","Public archive open","OPEN"],["RELEASE","Release awaiting confirmation","PENDING"]]
- PASS — 932x430 signal EN centers meaningful — [["SIGNAL_03","Trailer online","ONLINE"],["ARCHIVE","Public archive open","OPEN"],["RELEASE","Release awaiting confirmation","PENDING"]]
- PASS — 932x430 signal typography readable — 11px,11px,11px
- PASS — 932x430 vertical archive handle gone — {"old":"none","mobile":"flex","text":"ARCHIVE // 11"}
- PASS — 932x430 horizontal ARCHIVE // 11 visible — {"old":"none","mobile":"flex","text":"ARCHIVE // 11"}
- PASS — 932x430 all 11 Materials stage heights stable — delta=0.00 heights=249.4,249.4,249.4,249.4,249.4,249.4,249.4,249.4,249.4,249.4,249.4
- PASS — 932x430 all 11 images contained — contain
- PASS — 932x430 mixed source ratios actually tested — 1.016,0.826,0.667,0.667,0.667,0.667,1.015,0.667,0.615,0.573,0.667
- PASS — 932x430 Archive drawer opens from horizontal control — {"open":true,"w":290,"h":240.796875,"overflow":"auto","scroll":337,"client":173,"close":true,"count":11}
- PASS — 932x430 Archive thumbnails internally usable — {"open":true,"w":290,"h":240.796875,"overflow":"auto","scroll":337,"client":173,"close":true,"count":11}
- PASS — 932x430 Archive drawer remains compact — {"open":true,"w":290,"h":240.796875,"overflow":"auto","scroll":337,"client":173,"close":true,"count":11}
- PASS — 932x430 materials horizontal overflow=0 — 0
- PASS — 932x430 Show More initial 6 — 6
- PASS — 932x430 Show More expands by 6 — 12
- PASS — 932x430 review controls follow feed — {"pos":"sticky","top":70,"h":146.78125,"display":"grid"}
- PASS — 932x430 review control dock not giant — {"pos":"sticky","top":70,"h":146.78125,"display":"grid"}
- PASS — 932x430 review sort/toggle usable
- PASS — 932x430 profanity explanation absent
- PASS — 932x430 reviews overflow=0 — 0
- PASS — 932x430 reviews JS errors=0
- PASS — 932x430 smart header visible at top — {"smart":true,"hidden":false}
- PASS — 932x430 QA header focus cleared — false
- PASS — 932x430 scroll down hides header — {"hidden":true,"transform":"matrix(1, 0, 0, 1, 0, -69)"}
- PASS — 932x430 scroll up reveals header
- PASS — 932x430 1px scroll no jitter — false->false
- PASS — 932x430 burger open keeps header visible — {"open":true,"hidden":false}
- PASS — 932x430 smart header reduced-motion minimal transition — 1e-05s
- PASS — 768x1024 index horizontal overflow=0 — 0
- PASS — 768x1024 index JS errors=0
- PASS — 768x1024 Hero synopsis preserved — В мире, где человек должен доказать свою пользу системе, взросление становится борьбой за право самому выбирать своё будущее.
- PASS — 768x1024 signal semantic RU tokens — [["SIGNAL_03","Трейлер доступен","ONLINE"],["ARCHIVE","Публичный архив открыт","OPEN"],["RELEASE","Релиз ожидает подтверждения","PENDING"]]
- PASS — 768x1024 signal no fake time/NOW RU — SIGNAL_03|Трейлер доступен|ONLINE|ARCHIVE|Публичный архив открыт|OPEN|RELEASE|Релиз ожидает подтверждения|PENDING
- PASS — 768x1024 signal EN semantic states — [["SIGNAL_03","Trailer online","ONLINE"],["ARCHIVE","Public archive open","OPEN"],["RELEASE","Release awaiting confirmation","PENDING"]]
- PASS — 768x1024 signal EN centers meaningful — [["SIGNAL_03","Trailer online","ONLINE"],["ARCHIVE","Public archive open","OPEN"],["RELEASE","Release awaiting confirmation","PENDING"]]
- PASS — 768x1024 signal typography readable — 9px,11px,9px
- PASS — 768x1024 vertical archive handle gone — {"old":"none","mobile":"flex","text":"ARCHIVE // 11"}
- PASS — 768x1024 horizontal ARCHIVE // 11 visible — {"old":"none","mobile":"flex","text":"ARCHIVE // 11"}
- PASS — 768x1024 all 11 Materials stage heights stable — delta=0.00 heights=500.0,500.0,500.0,500.0,500.0,500.0,500.0,500.0,500.0,500.0,500.0
- PASS — 768x1024 all 11 images contained — contain
- PASS — 768x1024 mixed source ratios actually tested — 1.016,0.826,0.667,0.667,0.667,0.667,1.015,0.667,0.615,0.573,0.667
- PASS — 768x1024 Archive drawer opens from horizontal control — {"open":true,"w":300,"h":560,"overflow":"auto","scroll":605,"client":486,"close":true,"count":11}
- PASS — 768x1024 Archive thumbnails internally usable — {"open":true,"w":300,"h":560,"overflow":"auto","scroll":605,"client":486,"close":true,"count":11}
- PASS — 768x1024 Archive drawer remains compact — {"open":true,"w":300,"h":560,"overflow":"auto","scroll":605,"client":486,"close":true,"count":11}
- PASS — 768x1024 materials horizontal overflow=0 — 0
- PASS — 768x1024 Show More initial 6 — 6
- PASS — 768x1024 Show More expands by 6 — 12
- PASS — 768x1024 review controls follow feed — {"pos":"sticky","top":72,"h":201.96875,"display":"grid"}
- PASS — 768x1024 review control dock not giant — {"pos":"sticky","top":72,"h":201.96875,"display":"grid"}
- PASS — 768x1024 review sort/toggle usable
- PASS — 768x1024 profanity explanation absent
- PASS — 768x1024 reviews overflow=0 — 0
- PASS — 768x1024 reviews JS errors=0
- PASS — 768x1024 actor prompt interactive — {"role":"button","tab":"0","text":"ФАЙЛ ЗАГРУЖЕН // ВЫБЕРИТЕ ДРУГОЙ СУБЪЕКТ","min":"44px"}
- PASS — 768x1024 actor open no auto-scroll — 3855->3855
- PASS — 768x1024 actor prompt same return state — scroll=3855->3855
- PASS — 768x1024 actor prompt return no scroll — 3855->3855
- PASS — 768x1024 main SUBJECT INDEX still returns
- PASS — 768x1024 main SUBJECT INDEX no scroll — 3855->3855
- PASS — 768x1024 actor keyboard Enter returns
- PASS — 768x1024 actor keyboard return no scroll — 3855->3855
- PASS — 768x1024 actor prompt EN works — FILE LOADED // SELECT ANOTHER SUBJECT
- PASS — 1024x768 index horizontal overflow=0 — 0
- PASS — 1024x768 index JS errors=0
- PASS — 1024x768 Hero synopsis preserved — В мире, где человек должен доказать свою пользу системе, взросление становится борьбой за право самому выбирать своё будущее.
- PASS — 1024x768 signal semantic RU tokens — [["SIGNAL_03","Трейлер доступен","ONLINE"],["ARCHIVE","Публичный архив открыт","OPEN"],["RELEASE","Релиз ожидает подтверждения","PENDING"]]
- PASS — 1024x768 signal no fake time/NOW RU — SIGNAL_03|Трейлер доступен|ONLINE|ARCHIVE|Публичный архив открыт|OPEN|RELEASE|Релиз ожидает подтверждения|PENDING
- PASS — 1024x768 signal EN semantic states — [["SIGNAL_03","Trailer online","ONLINE"],["ARCHIVE","Public archive open","OPEN"],["RELEASE","Release awaiting confirmation","PENDING"]]
- PASS — 1024x768 signal EN centers meaningful — [["SIGNAL_03","Trailer online","ONLINE"],["ARCHIVE","Public archive open","OPEN"],["RELEASE","Release awaiting confirmation","PENDING"]]
- PASS — 1024x768 signal typography readable — 11px,11px,11px
- PASS — 1024x768 desktop/tablet-landscape wall handle preserved — {"old":"block","mobile":"none","text":"ARCHIVE // 11"}
- PASS — 1024x768 materials horizontal overflow=0 — 0
- PASS — 1024x768 reviews overflow=0 — 0
- PASS — 1024x768 reviews JS errors=0
- PASS — 1366x768 index horizontal overflow=0 — 0
- PASS — 1366x768 index JS errors=0
- PASS — 1366x768 Hero synopsis preserved — В мире, где человек должен доказать свою пользу системе, взросление становится борьбой за право самому выбирать своё будущее.
- PASS — 1366x768 signal semantic RU tokens — [["SIGNAL_03","Трейлер доступен","ONLINE"],["ARCHIVE","Публичный архив открыт","OPEN"],["RELEASE","Релиз ожидает подтверждения","PENDING"]]
- PASS — 1366x768 signal no fake time/NOW RU — SIGNAL_03|Трейлер доступен|ONLINE|ARCHIVE|Публичный архив открыт|OPEN|RELEASE|Релиз ожидает подтверждения|PENDING
- PASS — 1366x768 signal EN semantic states — [["SIGNAL_03","Trailer online","ONLINE"],["ARCHIVE","Public archive open","OPEN"],["RELEASE","Release awaiting confirmation","PENDING"]]
- PASS — 1366x768 signal EN centers meaningful — [["SIGNAL_03","Trailer online","ONLINE"],["ARCHIVE","Public archive open","OPEN"],["RELEASE","Release awaiting confirmation","PENDING"]]
- PASS — 1366x768 signal typography readable — 11px,11px,11px
- PASS — 1366x768 desktop/tablet-landscape wall handle preserved — {"old":"block","mobile":"none","text":"ARCHIVE // 11"}
- PASS — 1366x768 materials horizontal overflow=0 — 0
- PASS — 1366x768 reviews overflow=0 — 0
- PASS — 1366x768 reviews JS errors=0
- PASS — 1366x768 contact local X motion — range=5.12 xs=1254.82,1253.83,1252.77,1251.84,1251.00,1250.40,1249.96,1249.74,1249.69,1249.83
- PASS — 1366x768 contact no teleport — maxStep=1.07
- PASS — 1366x768 contact diamond static — 1263.823486328125,1263.823486328125,1263.823486328125,1263.823486328125,1263.823486328125,1263.823486328125,1263.823486328125,1263.823486328125,1263.823486328125,1263.823486328125
- PASS — 1366x768 contact no layout shift — [[877.6875,602.21875,420,101],[877.6875,602.21875,420,101],[877.6875,602.21875,420,101],[877.6875,602.21875,420,101],[877.6875,602.21875,420,101],[877.6875,602.21875,420,101],[877.6875,602.21875,420,101],[877.6875,602.21875,420,101],[877.6875,602.21875,420,101],[877.6875,602.21875,420,101]]
- PASS — 1366x768 contact reduced-motion no X motion — {"x":1257.6875,"anim":"none","transform":"none","x2":1257.6875}
- PASS — 1366x768 freshness 7% centered — {"rw":86,"rh":86,"dx":-0.0078125,"dy":0}
- PASS — 1366x768 freshness 64% centered — {"rw":86,"rh":86,"dx":0,"dy":0}
- PASS — 1366x768 freshness 100% centered — {"rw":86,"rh":86,"dx":0,"dy":0}
- PASS — 1366x768 freshness — centered — {"rw":86,"rh":86,"dx":0,"dy":0}
- PASS — 1366x768 profile ? active state — {"rest":{"border":"rgba(157, 205, 211, 0.32)","bg":"rgba(5, 12, 14, 0.5)"},"open":{"aria":"true","border":"rgba(188, 232, 237, 0.76)","bg":"rgba(25, 47, 50, 0.67)"}}
- PASS — 1366x768 profile popover lighter/translucent — {"bg":"rgba(7, 13, 14, 0.84)","blur":"blur(12px)"}
- PASS — 1366x768 profile popover no page move/lock — 382->382; overflowY=auto
- PASS — 1366x768 profile ? returns to rest


## Gate

Round4 remains in draft PR #18, owner visual review pending, not production. Browser evidence is implementation evidence, not owner visual acceptance.
