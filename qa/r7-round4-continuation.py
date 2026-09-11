from pathlib import Path
import sys


def replace_once_text(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    return text.replace(old, new, 1)


def append_once(path, marker, block):
    p = Path(path)
    data = p.read_text(encoding="utf-8")
    if marker in data:
        raise SystemExit(f"{path}: duplicate marker {marker}")
    p.write_text(data.rstrip() + "\n\n" + block.strip() + "\n", encoding="utf-8")


def apply_runtime_docs():
    css = Path("css/responsive-r7-polish.css")
    s = css.read_text(encoding="utf-8")
    marker = "/* ROUND4 REAL-BROWSER CORRECTIONS */"
    if marker in s:
        raise SystemExit("Round4 correction marker already present")
    s += r'''

/* ROUND4 REAL-BROWSER CORRECTIONS */
@property --r7-contact-shift {
  syntax: '<length>';
  inherits: false;
  initial-value: 0px;
}
.contact-signal-track i {
  --r7-contact-shift: 0px;
  transform: translateX(var(--r7-contact-shift)) !important;
  animation: r7ContactLocalSignalFixed 3.2s ease-in-out infinite alternate !important;
}
@keyframes r7ContactLocalSignalFixed {
  0% { --r7-contact-shift: 0px; opacity: .54; box-shadow: 0 0 7px rgba(155,196,199,.38); }
  100% { --r7-contact-shift: -8px; opacity: .96; box-shadow: 0 0 13px rgba(155,196,199,.68); }
}
body.community-page #profileHelpPanel.profile-help-panel .info-overlay-card {
  background: rgba(7,13,14,.84) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
}
body.community-page #profileHelpPanel.profile-help-panel .info-overlay-card::before {
  background: rgba(7,13,14,.84) !important;
}
@media (prefers-reduced-motion: reduce) {
  .contact-signal-track i {
    --r7-contact-shift: 0px;
    animation: none !important;
    transform: none !important;
    opacity: .78 !important;
    box-shadow: 0 0 9px rgba(155,196,199,.46) !important;
    will-change: auto;
  }
}
'''
    css.write_text(s, encoding="utf-8")

    js = Path("js/responsive-r7.js")
    j = js.read_text(encoding="utf-8")
    j = replace_once_text(
        j,
        "    const prompt = $('#dossierPrompt', cast || document);\n    if (!cast || !prompt) return;\n\n    const sync = () => {\n",
        "    const prompt = $('#dossierPrompt', cast || document);\n    if (!cast || !prompt) return;\n\n    let wasActionable = false;\n    let openScroll = null;\n\n    const sync = () => {\n",
        "actor vars",
    )
    j = replace_once_text(
        j,
        "      const actionable = isSequentialContext() && cast.classList.contains('r7-dossier-open');\n      prompt.classList.toggle('r7-subject-return', actionable);\n",
        "      const actionable = isSequentialContext() && cast.classList.contains('r7-dossier-open');\n      if (actionable && !wasActionable) openScroll = { x: scrollX, y: scrollY };\n      if (!actionable) openScroll = null;\n      wasActionable = actionable;\n      prompt.classList.toggle('r7-subject-return', actionable);\n",
        "actor sync",
    )
    j = replace_once_text(
        j,
        "    const activate = event => {\n      if (!prompt.classList.contains('r7-subject-return')) return;\n      if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;\n      if (event.type === 'keydown') event.preventDefault();\n      $('.r7-subject-back', cast)?.click();\n    };\n",
        "    const activate = event => {\n      if (!prompt.classList.contains('r7-subject-return')) return;\n      if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;\n      if (event.type === 'keydown') event.preventDefault();\n\n      const current = { x: scrollX, y: scrollY };\n      const smallIncidentalDrift = openScroll && Math.abs(current.y - openScroll.y) <= 24;\n      const targetScroll = smallIncidentalDrift ? openScroll : current;\n      $('.r7-subject-back', cast)?.click();\n\n      const restore = () => {\n        if (!isSequentialContext()) return;\n        if (Math.abs(scrollX - targetScroll.x) <= .5 && Math.abs(scrollY - targetScroll.y) <= .5) return;\n        scrollTo({ left: targetScroll.x, top: targetScroll.y, behavior: 'auto' });\n      };\n      requestAnimationFrame(() => requestAnimationFrame(restore));\n      setTimeout(restore, 90);\n    };\n",
        "actor activate",
    )
    js.write_text(j, encoding="utf-8")

    append_once(
        "docs/current/DECISIONS.md",
        "## Privacy by design — active direction addendum — 2026-09-12",
        r'''
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
''',
    )

    append_once(
        "docs/current/ROADMAP.md",
        "## Privacy-by-design backend/legal follow-up — added 2026-09-12",
        r'''
## Privacy-by-design backend/legal follow-up — added 2026-09-12

Future backend migration and privacy-policy work must preserve the active privacy direction in `DECISIONS.md`: Russian-hosted backend direction; no required real names/email/phone for ordinary visitors; no application identity/features built around raw IP; minimum technical review identity; informed consent where legally required; deletion path for user-associated data; data minimization by default.

Before final Privacy Policy publication, confirm the legal identity/contact details of the film author and confirm the actual operator/processor allocation. The current operator assumption (film author) is provisional only. Do not infer or publish legal details from technical ownership or team participation.

Infrastructure providers may technically observe network IP addresses even though the application itself must not use/store raw IP as ordinary product data. The artistic FAQ wording `На сайте есть безопасность?` remains separate from legal privacy documentation.

This addendum does **not** authorize or perform a backend migration, CAPTCHA deployment, Telegram integration, Bug Reports v2 implementation, or Supabase production change in Round 4.
''',
    )


def patch_qa(path):
    p = Path(path)
    s = p.read_text(encoding="utf-8")
    s = replace_once_text(
        s,
        "async function go(page,url){\n  await page.goto(url,{waitUntil:'domcontentloaded'});\n  await page.waitForTimeout(850);\n}\n",
        "async function ensureLang(page,target){\n  const current=await page.evaluate(()=>document.documentElement.lang || 'ru');\n  if(current!==target){\n    const toggle=page.locator('#langToggle');\n    if(await toggle.count()){ await toggle.click(); await page.waitForTimeout(120); }\n  }\n  const after=await page.evaluate(()=>document.documentElement.lang || 'ru');\n  if(after!==target) throw new Error(`Unable to set language ${target}; current=${after}`);\n  await page.evaluate(()=>{ const h=document.querySelector('.site-header'); if(h?.contains(document.activeElement)) document.activeElement.blur(); });\n}\nasync function go(page,url){\n  await page.goto(url,{waitUntil:'domcontentloaded'});\n  await page.waitForTimeout(850);\n  await ensureLang(page,'ru');\n}\n",
        "QA language/focus helper",
    )
    s = replace_once_text(
        s,
        "  const y0=await p.evaluate(()=>scrollY);\n  await toggle.click(); await sleep(160);\n",
        "  await toggle.scrollIntoViewIfNeeded(); await sleep(100);\n  const y0=await p.evaluate(()=>scrollY);\n  await toggle.click(); await sleep(160);\n",
        "QA profile scroll anchor",
    )
    s = replace_once_text(
        s,
        "  await prompt.click(); await sleep(140);\n  const y2=await p.evaluate(()=>scrollY);\n  check(`${vp.name} actor prompt same return state`,!(await p.locator('#cast').evaluate(e=>e.classList.contains('r7-dossier-open'))),`scroll=${y1}->${y2}`);\n  check(`${vp.name} actor prompt return no scroll`,Math.abs(y2-y1)<=2,`${y1}->${y2}`);\n  await first.click(); await sleep(120);\n  await prompt.focus(); await prompt.press('Enter'); await sleep(120);\n  check(`${vp.name} actor keyboard Enter returns`,!(await p.locator('#cast').evaluate(e=>e.classList.contains('r7-dossier-open'))));\n",
        "  await prompt.tap(); await sleep(160);\n  const y2=await p.evaluate(()=>scrollY);\n  check(`${vp.name} actor prompt same return state`,!(await p.locator('#cast').evaluate(e=>e.classList.contains('r7-dossier-open'))),`scroll=${y1}->${y2}`);\n  check(`${vp.name} actor prompt return no scroll`,Math.abs(y2-y1)<=1,`${y1}->${y2}`);\n\n  await first.tap(); await sleep(120);\n  const mainBack=p.locator('#cast .r7-subject-back');\n  await mainBack.scrollIntoViewIfNeeded(); await sleep(80);\n  const ym0=await p.evaluate(()=>scrollY);\n  await mainBack.tap(); await sleep(140);\n  const ym1=await p.evaluate(()=>scrollY);\n  check(`${vp.name} main SUBJECT INDEX still returns`,!(await p.locator('#cast').evaluate(e=>e.classList.contains('r7-dossier-open'))));\n  check(`${vp.name} main SUBJECT INDEX no scroll`,Math.abs(ym1-ym0)<=2,`${ym0}->${ym1}`);\n\n  await first.tap(); await sleep(120);\n  await p.evaluate(()=>document.querySelector('#dossierPrompt')?.focus({preventScroll:true}));\n  const yk0=await p.evaluate(()=>scrollY);\n  await prompt.press('Enter'); await sleep(140);\n  const yk1=await p.evaluate(()=>scrollY);\n  check(`${vp.name} actor keyboard Enter returns`,!(await p.locator('#cast').evaluate(e=>e.classList.contains('r7-dossier-open'))));\n  check(`${vp.name} actor keyboard return no scroll`,Math.abs(yk1-yk0)<=1,`${yk0}->${yk1}`);\n",
        "QA actors",
    )
    s = replace_once_text(
        s,
        "  check(`${vp.name} smart header visible at top`,atTop.smart&&!atTop.hidden,JSON.stringify(atTop));\n  await p.evaluate(()=>scrollTo(0,260));await sleep(360);\n",
        "  check(`${vp.name} smart header visible at top`,atTop.smart&&!atTop.hidden,JSON.stringify(atTop));\n  const focusBefore=await p.evaluate(()=>document.querySelector('.site-header')?.matches(':focus-within'));\n  check(`${vp.name} QA header focus cleared`,!focusBefore,String(focusBefore));\n  await sleep(1050);\n  await p.evaluate(()=>scrollTo(0,260));await sleep(360);\n",
        "QA smart header guard",
    )
    p.write_text(s, encoding="utf-8")


if len(sys.argv) < 2:
    raise SystemExit("usage: r7-round4-continuation.py runtime-docs | qa <path>")
if sys.argv[1] == "runtime-docs":
    apply_runtime_docs()
elif sys.argv[1] == "qa" and len(sys.argv) == 3:
    patch_qa(sys.argv[2])
else:
    raise SystemExit("invalid arguments")
