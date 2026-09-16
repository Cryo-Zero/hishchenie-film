const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TARGET = process.env.TARGET_URL;
const ROUND5 = process.env.ROUND5_URL;
const ROUND6 = process.env.ROUND6_URL;
const OUT = process.env.EVIDENCE_DIR;
if (!TARGET || !ROUND5 || !ROUND6 || !OUT) throw new Error('TARGET_URL / ROUND5_URL / ROUND6_URL / EVIDENCE_DIR required');
fs.mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: '390x844', w: 390, h: 844, touch: true, phone: true },
  { name: '430x932', w: 430, h: 932, touch: true, phone: true },
  { name: '844x390', w: 844, h: 390, touch: true, phone: true },
  { name: '932x430', w: 932, h: 430, touch: true, phone: true },
  { name: '768x1024', w: 768, h: 1024, touch: true, phone: false },
  { name: '1024x768', w: 1024, h: 768, touch: true, phone: false },
  { name: '1366x768', w: 1366, h: 768, touch: false, phone: false },
];

let passed = 0;
const checks = [];
const failures = [];
function check(cond, name, detail = '') {
  const ok = Boolean(cond);
  checks.push({ ok, name, detail });
  if (ok) passed += 1;
  else failures.push({ name, detail });
}
function maxRectDelta(a, b) {
  if (!a || !b) return Infinity;
  return Math.max(...['x','y','width','height'].map(k => Math.abs((a[k] ?? 0) - (b[k] ?? 0))));
}
function norm(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }

const browser = await chromium.launch({ headless: true });
async function contextFor(v, reducedMotion = 'no-preference') {
  const ctx = await browser.newContext({
    viewport: { width: v.w, height: v.h },
    hasTouch: v.touch,
    isMobile: v.phone,
    reducedMotion,
  });
  await ctx.route('**/*.mp4', r => r.fulfill({ status: 204, contentType: 'video/mp4', body: '' }));
  await ctx.route(/https:\/\/[^/]*\.supabase\.co\/.*/, r => r.abort());
  return ctx;
}
async function open(ctx, url) {
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await p.waitForTimeout(220);
  return { p, errors };
}
async function swipe(locator, fromX = 310, toX = 80) {
  await locator.evaluate((node, xs) => {
    const emit = (type, x) => {
      const e = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(e, 'changedTouches', { value: [{ clientX: x, clientY: 120 }] });
      node.dispatchEvent(e);
    };
    emit('touchstart', xs[0]);
    emit('touchend', xs[1]);
  }, [fromX, toX]);
}
async function rects(page, selectors) {
  const out = [];
  for (const sel of selectors) {
    const box = await page.locator(sel).boundingBox();
    out.push(box);
  }
  return out;
}
function maxRectsDelta(a, b) {
  return Math.max(...a.map((r, i) => maxRectDelta(r, b[i])));
}
async function contactState(page) {
  return page.evaluate(() => {
    const point = document.querySelector('.contact-signal-track i');
    const diamond = document.querySelector('.contact-signal-track b');
    if (!point || !diamond) return { missing: true };
    const anim = point.getAnimations()[0];
    let x0 = point.getBoundingClientRect().x;
    let x1 = x0;
    if (anim) {
      anim.pause();
      anim.currentTime = 350;
      x0 = point.getBoundingClientRect().x;
      anim.currentTime = 3600;
      x1 = point.getBoundingClientRect().x;
    }
    const ds = getComputedStyle(diamond);
    const ps = getComputedStyle(point);
    const pseudo = getComputedStyle(point, '::after');
    return {
      x0, x1,
      pointAnim: ps.animationName,
      diamondAnim: ds.animationName,
      diamondBg: ds.backgroundColor,
      diamondShadow: ds.boxShadow,
      pseudoDisplay: pseudo.display,
    };
  });
}

// ---------------------------------------------------------------------------
// Candidate matrix: general, mobile Hero/Archive/CONTACT, burger/header.
// ---------------------------------------------------------------------------
for (const v of viewports) {
  const ctx = await contextFor(v);
  const { p, errors } = await open(ctx, `${TARGET}/index.html?round7=${v.name}`);
  const tag = `[${v.name}]`;

  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(Math.abs(overflow) <= 1, `${tag} index horizontal overflow = 0`, String(overflow));

  if (v.phone) {
    const hero = await p.evaluate(() => {
      const box = sel => {
        const el = document.querySelector(sel); if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x:r.x, y:r.y, width:r.width, height:r.height, top:r.top, bottom:r.bottom };
      };
      const synopsis = document.querySelector('.hero-copy');
      return {
        title: box('.r7-mobile-hero-title'),
        poster: box('.hero-poster-frame'),
        synopsis: box('.r7-mobile-hero-copy'),
        actions: box('.r7-mobile-hero-actions'),
        copies: document.querySelectorAll('.hero-copy').length,
        synopsisParent: synopsis?.parentElement?.className || '',
        synopsisKey: synopsis?.dataset?.i18n || '',
        text: synopsis?.textContent || '',
      };
    });
    check(hero.copies === 1, `${tag} Hero keeps one synopsis node`, JSON.stringify(hero));
    check(hero.synopsisKey === 'heroCopy' && hero.synopsisParent.includes('hero-inner'), `${tag} Hero uses existing i18n synopsis node`, JSON.stringify(hero));
    check(hero.title && hero.poster && hero.synopsis && hero.actions && hero.title.bottom <= hero.poster.top + 2 && hero.poster.bottom <= hero.synopsis.top + 2 && hero.synopsis.bottom <= hero.actions.top + 2,
      `${tag} Hero order TITLE -> POSTER -> SYNOPSIS -> ACTIONS`, JSON.stringify(hero));

    const ruText = norm(await p.locator('.r7-mobile-hero-copy').textContent());
    const lang0 = await p.locator('html').getAttribute('lang');
    await p.locator('#langToggle').click();
    await p.waitForTimeout(80);
    const enText = norm(await p.locator('.r7-mobile-hero-copy').textContent());
    const lang1 = await p.locator('html').getAttribute('lang');
    check(lang0 !== lang1 && ruText !== enText && enText.length > 20, `${tag} Hero synopsis RU/EN i18n works`, `${lang0}:${ruText} -> ${lang1}:${enText}`);
    await p.locator('#langToggle').click();
    await p.waitForTimeout(40);

    const archiveDisplay = await p.locator('#r7MobileArchiveToggle').evaluate(el => getComputedStyle(el).display);
    check(archiveDisplay === 'none', `${tag} visible ARCHIVE // 11 control absent`, archiveDisplay);

    await p.locator('#materials').scrollIntoViewIfNeeded();
    await p.waitForTimeout(100);
    const c0 = await p.locator('#archiveCounter').textContent();
    await swipe(p.locator('#archiveStage'));
    await p.waitForTimeout(80);
    const c1 = await p.locator('#archiveCounter').textContent();
    check(c0 !== c1, `${tag} Materials stage swipe preserved`, `${c0} -> ${c1}`);

    await p.locator('#archiveStage').focus();
    await p.locator('#archiveStage').press('Enter');
    await p.waitForSelector('#lightbox.open');
    const l0 = await p.locator('#lightboxCounter').textContent();
    await swipe(p.locator('#lightbox'));
    await p.waitForTimeout(80);
    const l1 = await p.locator('#lightboxCounter').textContent();
    check(l0 !== l1, `${tag} Materials lightbox swipe preserved`, `${l0} -> ${l1}`);
    await p.keyboard.press('Escape');

    const contact = await contactState(p);
    check(!contact.missing && contact.pointAnim === 'r7Round6ContactTravel' && contact.x1 - contact.x0 > 100,
      `${tag} mobile CONTACT uses travelling-point semantics`, JSON.stringify(contact));
    check(!contact.missing && contact.diamondAnim === 'none' && contact.diamondShadow === 'none', `${tag} mobile CONTACT has no receive glow animation`, JSON.stringify(contact));
    check(contact.pseudoDisplay === 'none', `${tag} mobile CONTACT old local impulse absent`, JSON.stringify(contact));

    // Preserve Round6 burger behavior.
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(80);
    await p.locator('#menuToggle').click();
    await p.waitForSelector('body.nav-open');
    const overflowY = await p.evaluate(() => getComputedStyle(document.body).overflowY);
    check(overflowY !== 'hidden', `${tag} burger keeps page scroll unlocked`, overflowY);
    await p.mouse.wheel(0, 420);
    await p.waitForTimeout(120);
    const sy = await p.evaluate(() => scrollY);
    check(sy > 10, `${tag} page scrolls with burger open`, String(sy));
    check(await p.locator('body').evaluate(el => el.classList.contains('nav-open')), `${tag} scroll does not close burger`);
    await p.evaluate(() => {
      const mk = (type,x,y) => document.body.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:77,pointerType:'touch',clientX:x,clientY:y}));
      mk('pointerdown',20,300); mk('pointermove',20,240); mk('pointerup',20,240);
    });
    check(await p.locator('body').evaluate(el => el.classList.contains('nav-open')), `${tag} movement gesture does not close burger`);
    await p.evaluate(() => {
      const mk = type => document.body.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:78,pointerType:'touch',clientX:20,clientY:300}));
      mk('pointerdown'); mk('pointerup');
    });
    await p.waitForTimeout(30);
    check(!(await p.locator('body').evaluate(el => el.classList.contains('nav-open'))), `${tag} deliberate outside tap closes burger`);

    // Preserve smart-header logic after its interaction safeguard expires.
    await p.evaluate(() => { document.activeElement?.blur(); scrollTo(0,0); });
    await p.waitForTimeout(1350);
    await p.evaluate(() => scrollTo(0,620));
    await p.waitForTimeout(140);
    check(await p.locator('body').evaluate(el => el.classList.contains('r7-header-hidden')), `${tag} smart header hides on down-scroll`);
    await p.evaluate(() => scrollTo(0,420));
    await p.waitForTimeout(140);
    check(!(await p.locator('body').evaluate(el => el.classList.contains('r7-header-hidden'))), `${tag} smart header reveals on up-scroll`);

    if (v.name === '390x844' || v.name === '844x390') {
      await p.evaluate(() => scrollTo(0,0));
      await p.waitForTimeout(120);
      await p.screenshot({ path: path.join(OUT, `candidate-mobile-hero-${v.name}.png`) });
    }
  }

  if (v.name === '1366x768') {
    // Desktop CONTACT: accepted travel, no separate diamond receive flash.
    const contact = await contactState(p);
    check(!contact.missing && contact.pointAnim === 'r7Round6ContactTravel' && contact.x1 - contact.x0 > 100,
      `${tag} desktop CONTACT point physically travels`, JSON.stringify(contact));
    check(!contact.missing && contact.diamondAnim === 'none' && contact.diamondShadow === 'none', `${tag} desktop CONTACT receive glow/fill removed`, JSON.stringify(contact));

    // Desktop Archive: physical wall, Materials-local, stable scene geometry.
    await p.locator('#materials').scrollIntoViewIfNeeded();
    await p.waitForTimeout(180);
    const archiveBefore = await p.evaluate(() => {
      const shell = document.querySelector('#materials .archive-drawer-shell');
      const handle = document.querySelector('#archiveDrawerToggle');
      const grid = document.querySelector('#materials > .shell');
      const head = document.querySelector('#materials .section-head');
      const stage = document.querySelector('#archiveStage');
      const rr = el => { const r=el.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; };
      return {
        active: shell.classList.contains('r7-materials-active'),
        offsetParent: shell.offsetParent?.id || shell.offsetParent?.className || '',
        handle: rr(handle), grid: rr(grid), head: rr(head), stage: rr(stage),
      };
    });
    check(archiveBefore.active, `${tag} Archive visible while Materials active`, JSON.stringify(archiveBefore));
    check(archiveBefore.offsetParent === 'materials', `${tag} Archive shell positioned by Materials scene, not inner grid`, JSON.stringify(archiveBefore));
    check(archiveBefore.handle.x <= 2 && archiveBefore.grid.x - archiveBefore.handle.x > 20, `${tag} Archive handle sits on physical left wall outside world grid`, JSON.stringify(archiveBefore));

    await p.locator('#archiveDrawerToggle').click();
    await p.waitForTimeout(140);
    const archiveOpen = await p.evaluate(() => {
      const handle = document.querySelector('#archiveDrawerToggle');
      const drawer = document.querySelector('#archiveDrawer');
      const head = document.querySelector('#materials .section-head');
      const stage = document.querySelector('#archiveStage');
      const rr = el => { const r=el.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; };
      return { handle:rr(handle), drawer:rr(drawer), head:rr(head), stage:rr(stage) };
    });
    check(Math.abs(archiveOpen.handle.x - archiveBefore.handle.x) <= 1, `${tag} Archive handle does not slide into composition when drawer opens`, JSON.stringify({before:archiveBefore.handle,after:archiveOpen.handle}));
    check(archiveOpen.drawer.x <= 2, `${tag} Archive drawer opens from physical wall`, JSON.stringify(archiveOpen.drawer));
    check(maxRectDelta(archiveBefore.head, archiveOpen.head) <= 1 && maxRectDelta(archiveBefore.stage, archiveOpen.stage) <= 1,
      `${tag} Archive open does not reflow Materials title/stage`, JSON.stringify({before:archiveBefore,after:archiveOpen}));

    // Actors: structure stationary while text still reveals.
    await p.locator('#cast').scrollIntoViewIfNeeded();
    await p.waitForTimeout(100);
    const actorStruct = ['#cast .dossier-data', '#cast .dossier-data > div:nth-child(1)', '#cast .dossier-data > div:nth-child(2)', '#cast .dossier-data > div:nth-child(3)', '#cast .dossier-data > div:nth-child(4)'];
    const a0 = await rects(p, actorStruct);
    await p.locator('#cast .cast-list-item').nth(1).click();
    await p.waitForTimeout(45);
    const a1 = await rects(p, actorStruct);
    const actorOpacityMid = parseFloat(await p.locator('#dossierName').evaluate(el => getComputedStyle(el).opacity));
    await p.waitForTimeout(150);
    const a2 = await rects(p, actorStruct);
    await p.waitForTimeout(360);
    const a3 = await rects(p, actorStruct);
    const actorOpacityEnd = parseFloat(await p.locator('#dossierName').evaluate(el => getComputedStyle(el).opacity));
    const actorDelta = Math.max(maxRectsDelta(a0,a1), maxRectsDelta(a0,a2), maxRectsDelta(a0,a3));
    check(actorDelta <= 0.75, `${tag} Actors structural lines/rows stationary during reveal`, String(actorDelta));
    check(actorOpacityMid < .95 && actorOpacityEnd > .99, `${tag} Actors staged text reveal preserved`, `${actorOpacityMid} -> ${actorOpacityEnd}`);

    // FAQ: structural rows/log stationary while text still reveals.
    await p.locator('#faq').scrollIntoViewIfNeeded();
    await p.waitForTimeout(100);
    const faqStruct = ['#faq .faq-system-box > div:nth-child(1)', '#faq .faq-system-box > div:nth-child(2)', '#faq .faq-system-box > div:nth-child(3)', '#faq .faq-system-box > div:nth-child(4)', '#faq .faq-response-log'];
    const f0 = await rects(p, faqStruct);
    await p.locator('#faq .faq-query-item').nth(1).click();
    await p.waitForTimeout(45);
    const f1 = await rects(p, faqStruct);
    const faqOpacityMid = parseFloat(await p.locator('#faqResponseQuestion').evaluate(el => getComputedStyle(el).opacity));
    await p.waitForTimeout(150);
    const f2 = await rects(p, faqStruct);
    await p.waitForTimeout(360);
    const f3 = await rects(p, faqStruct);
    const faqOpacityEnd = parseFloat(await p.locator('#faqResponseQuestion').evaluate(el => getComputedStyle(el).opacity));
    const faqDelta = Math.max(maxRectsDelta(f0,f1), maxRectsDelta(f0,f2), maxRectsDelta(f0,f3));
    check(faqDelta <= 0.75, `${tag} FAQ structural lines/rows stationary during reveal`, String(faqDelta));
    check(faqOpacityMid < .95 && faqOpacityEnd > .99, `${tag} FAQ staged text reveal preserved`, `${faqOpacityMid} -> ${faqOpacityEnd}`);

    // Leaving Materials retracts/closes Archive even after opening it earlier.
    await p.locator('#contacts').scrollIntoViewIfNeeded();
    await p.waitForTimeout(180);
    const archiveAway = await p.evaluate(() => {
      const shell=document.querySelector('#materials .archive-drawer-shell');
      return {active:shell.classList.contains('r7-materials-active'),open:shell.classList.contains('is-open'),visibility:getComputedStyle(shell).visibility,opacity:getComputedStyle(shell).opacity};
    });
    check(!archiveAway.active && !archiveAway.open && (archiveAway.visibility === 'hidden' || parseFloat(archiveAway.opacity) === 0), `${tag} Archive retracts outside Materials`, JSON.stringify(archiveAway));
  }

  check(errors.length === 0, `${tag} index JS errors = 0`, errors.join(' | '));
  await ctx.close();
}

// ---------------------------------------------------------------------------
// Reduced motion: no travelling CONTACT on desktop or phone.
// ---------------------------------------------------------------------------
for (const v of [viewports[0], viewports.at(-1)]) {
  const ctx = await contextFor(v, 'reduce');
  const { p, errors } = await open(ctx, `${TARGET}/index.html?round7=reduce-${v.name}`);
  const state = await p.evaluate(() => ({
    point: getComputedStyle(document.querySelector('.contact-signal-track i')).animationName,
    diamond: getComputedStyle(document.querySelector('.contact-signal-track b')).animationName,
  }));
  check(state.point === 'none' && state.diamond === 'none', `[${v.name}] CONTACT reduced-motion static`, JSON.stringify(state));
  check(errors.length === 0, `[${v.name}] reduced-motion JS errors = 0`, errors.join(' | '));
  await ctx.close();
}

// ---------------------------------------------------------------------------
// Profile help geometry + unchanged content + no reflow/scroll lock.
// ---------------------------------------------------------------------------
for (const v of [viewports[0], viewports.at(-1)]) {
  const ctx = await contextFor(v);
  const { p, errors } = await open(ctx, `${TARGET}/reviews.html?round7=help-${v.name}`);
  const tag = `[${v.name}][reviews]`;
  const before = await p.evaluate(() => {
    const rr = el => { const r=el.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; };
    return {composer:rr(document.querySelector('.review-composer')), profile:rr(document.querySelector('.profile-console')), y:scrollY, overflow:getComputedStyle(document.body).overflowY};
  });
  await p.locator('#profileHelpToggle').click();
  await p.waitForTimeout(120);
  const state = await p.evaluate(() => {
    const rr = el => { const r=el.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height,top:r.top,bottom:r.bottom,left:r.left,right:r.right}; };
    const panel=document.querySelector('#profileHelpPanel'), profile=document.querySelector('.profile-console'), toggle=document.querySelector('#profileHelpToggle'), composer=document.querySelector('.review-composer');
    return {help:rr(panel),profile:rr(profile),toggle:rr(toggle),composer:rr(composer),position:getComputedStyle(panel).position,y:scrollY,overflow:getComputedStyle(document.body).overflowY,text:panel.innerText};
  });
  const ratio = state.help.width / state.profile.width;
  check(state.position === 'absolute', `${tag} help remains anchored overlay`, JSON.stringify(state));
  check(ratio >= .90 && ratio <= 1.12, `${tag} help follows profile-console width`, JSON.stringify({ratio,help:state.help,profile:state.profile}));
  check(state.help.top >= state.toggle.bottom - 4, `${tag} help anchored below ?`, JSON.stringify({help:state.help,toggle:state.toggle}));
  check(maxRectDelta(before.composer,state.composer) <= .75 && maxRectDelta(before.profile,state.profile) <= .75 && Math.abs(before.y-state.y) <= 1, `${tag} help causes zero reflow/scroll`, JSON.stringify({before,state}));
  check(state.overflow !== 'hidden', `${tag} help causes zero scroll lock`, state.overflow);

  const bctx = await contextFor(v);
  const { p: bp } = await open(bctx, `${ROUND6}/reviews.html?round7=baseline-help-${v.name}`);
  await bp.locator('#profileHelpToggle').click();
  await bp.waitForTimeout(80);
  const baselineText = norm(await bp.locator('#profileHelpPanel').innerText());
  check(norm(state.text) === baselineText, `${tag} help content unchanged`, `${norm(state.text)} | baseline=${baselineText}`);
  await bctx.close();

  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(Math.abs(overflow) <= 1, `${tag} horizontal overflow = 0`, String(overflow));
  check(errors.length === 0, `${tag} JS errors = 0`, errors.join(' | '));
  await ctx.close();
}

// ---------------------------------------------------------------------------
// Desktop unchanged-geometry sanity against exact Round6 baseline.
// ---------------------------------------------------------------------------
async function geometry(url) {
  const v = viewports.at(-1);
  const ctx = await contextFor(v);
  const { p } = await open(ctx, `${url}/index.html?round7=geometry`);
  const sels = ['.hero-poster-frame','.hero-copy-column','.hero-copy-column .hero-copy','#about .story','#materials .archive-stage','#trailer .video-shell','#cast .cast-console','#faq .faq-console'];
  const out = {};
  for (const sel of sels) out[sel] = await p.locator(sel).boundingBox();
  await ctx.close();
  return out;
}
{
  const before = await geometry(ROUND6);
  const after = await geometry(TARGET);
  let maxDelta = 0;
  for (const sel of Object.keys(before)) maxDelta = Math.max(maxDelta, maxRectDelta(before[sel], after[sel]));
  check(maxDelta <= 1, '[1366x768] unaffected desktop/world-grid geometry matches Round6', String(maxDelta));
}

// ---------------------------------------------------------------------------
// Screenshot evidence: Round5 / Round6 / candidate for the owner-found areas.
// ---------------------------------------------------------------------------
async function captureDesktopEvidence(base, label) {
  const v = viewports.at(-1);
  const ctx = await contextFor(v);
  const { p } = await open(ctx, `${base}/index.html?round7=evidence-${label}`);

  await p.locator('#materials').scrollIntoViewIfNeeded();
  await p.waitForTimeout(180);
  if (await p.locator('#archiveDrawerToggle').isVisible()) {
    await p.locator('#archiveDrawerToggle').click().catch(() => {});
    await p.waitForTimeout(140);
  }
  await p.screenshot({ path: path.join(OUT, `${label}-desktop-materials-archive.png`) });

  await p.locator('#cast').scrollIntoViewIfNeeded();
  await p.locator('#cast .cast-list-item').nth(1).click();
  await p.waitForTimeout(520);
  await p.screenshot({ path: path.join(OUT, `${label}-desktop-actors-selected.png`) });

  await p.locator('#faq').scrollIntoViewIfNeeded();
  await p.locator('#faq .faq-query-item').nth(1).click();
  await p.waitForTimeout(520);
  await p.screenshot({ path: path.join(OUT, `${label}-desktop-faq-selected.png`) });
  await ctx.close();

  const rctx = await contextFor(v);
  const { p: rp } = await open(rctx, `${base}/reviews.html?round7=evidence-help-${label}`);
  await rp.locator('#profileHelpToggle').click();
  await rp.waitForTimeout(120);
  await rp.screenshot({ path: path.join(OUT, `${label}-desktop-profile-help.png`) });
  await rctx.close();
}
await captureDesktopEvidence(ROUND5, 'round5');
await captureDesktopEvidence(ROUND6, 'round6');
await captureDesktopEvidence(TARGET, 'candidate');

await browser.close();

const result = { checks: checks.length, passed, failed: failures.length, failures };
fs.writeFileSync(path.join(OUT, 'RESULTS.json'), JSON.stringify(result, null, 2));
fs.writeFileSync(path.join(OUT, 'REPORT.md'), `# R7 Round7 browser + visual-regression QA\n\nChecks: ${checks.length}\nPassed: ${passed}\nFailed: ${failures.length}\n\nScreenshot evidence includes Round5 / Round6 / candidate comparisons for desktop Materials Archive, Profile Help, Actors selected and FAQ selected, plus candidate mobile Hero portrait/landscape.\n`);
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
