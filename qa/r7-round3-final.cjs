const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = '/tmp/r7-round3-evidence';
const SHOTS = path.join(OUT, 'screenshots');
fs.mkdirSync(SHOTS, { recursive: true });
const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail: String(detail || '') });
const px = value => Number.parseFloat(String(value || '0'));
const overflow = page => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const viewports = [
  { name: '390x844', width: 390, height: 844, mobile: true },
  { name: '430x932', width: 430, height: 932, mobile: true },
  { name: '844x390', width: 844, height: 390, mobile: true },
  { name: '932x430', width: 932, height: 430, mobile: true },
  { name: '1366x768', width: 1366, height: 768, mobile: false },
];

async function goto(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
}

let browser;
async function fontMap(base, vp) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile });
  const page = await ctx.newPage();
  await goto(page, `${base}/index.html#watch`);
  const index = await page.evaluate(() => {
    const g = (sel, pseudo = null) => {
      const e = document.querySelector(sel);
      return e ? getComputedStyle(e, pseudo).fontSize : null;
    };
    return {
      currentAfter: g('.current-signal', '::after'),
      signalKicker: g('.current-signal .metric-kicker'),
      signalDataDt: g('.signal-data dt'),
      signalTime: g('.signal-log-row time'),
      signalStatus: g('.signal-log-row b'),
      signalFoot: g('.signal-foot'),
      signalMeta: g('.signal-meta'),
      archiveMeta: g('.archive-stage-meta'),
      archiveBottom: g('.archive-bottom-code'),
      archiveDrawerHead: g('.archive-drawer-head'),
      dossierTop: g('.dossier-topline'),
      dossierSubject: g('.dossier-subject'),
      dossierSmall: g('.dossier-data small'),
      dossierPrompt: g('.dossier-prompt'),
      faqQueryCode: g('.faq-query-item > span'),
      faqHeader: g('.faq-response-header'),
      faqCode: g('.faq-response-code'),
      faqSystemLabel: g('.faq-system-box span'),
      contactLabel: g('.contact-signal-copy span'),
      contactStatus: g('.contact-signal-status'),
      footerSystem: g('.footer-system'),
      buildMark: g('.build-mark'),
      heroSystem: g('.hero-system-strip'),
      posterHud: g('.poster-hud')
    };
  });
  await goto(page, `${base}/reviews.html`);
  const reviews = await page.evaluate(() => {
    const g = sel => {
      const e = document.querySelector(sel);
      return e ? getComputedStyle(e).fontSize : null;
    };
    return {
      feedRecords: g('.feed-records'),
      serviceBadge: g('.service-badge'),
      reviewEnterHint: g('.review-enter-hint'),
      humanCheck: g('.human-check-note'),
      composerLabel: g('.composer-label'),
      audiencePulseHead: g('.audience-pulse-head'),
      audiencePulseDt: g('.audience-pulse-data dt'),
      audiencePulseFoot: g('.audience-pulse-foot')
    };
  });
  await ctx.close();
  return { ...index, ...reviews };
}

(async () => {
  browser = await chromium.launch({ headless: true });

  const beforeDesktop = await fontMap('http://127.0.0.1:4172', viewports[4]);
  const afterDesktop = await fontMap('http://127.0.0.1:4173', viewports[4]);
  const beforeMobile = await fontMap('http://127.0.0.1:4172', viewports[0]);
  const afterMobile = await fontMap('http://127.0.0.1:4173', viewports[0]);
  const typography = {
    desktop1366: { before: beforeDesktop, after: afterDesktop },
    mobile390: { before: beforeMobile, after: afterMobile }
  };
  fs.writeFileSync(path.join(OUT, 'TYPOGRAPHY.json'), JSON.stringify(typography, null, 2));

  for (const key of ['currentAfter', 'signalTime', 'signalStatus']) {
    check(`desktop typography ${key} increased`, px(afterDesktop[key]) >= px(beforeDesktop[key]) + 3.5, `${beforeDesktop[key]} -> ${afterDesktop[key]}`);
  }
  check('desktop SIGNAL STABLE increased', px(afterDesktop.signalFoot) >= px(beforeDesktop.signalFoot) + 2, `${beforeDesktop.signalFoot} -> ${afterDesktop.signalFoot}`);
  for (const key of ['currentAfter', 'signalTime', 'signalStatus']) {
    check(`mobile typography ${key} increased`, px(afterMobile[key]) >= px(beforeMobile[key]) + 1.5, `${beforeMobile[key]} -> ${afterMobile[key]}`);
  }
  check('mobile SIGNAL STABLE increased', px(afterMobile.signalFoot) >= px(beforeMobile.signalFoot) + 0.8, `${beforeMobile.signalFoot} -> ${afterMobile.signalFoot}`);

  // Desktop geometry outside the requested microtype/contact scope should keep its broad composition.
  {
    const measure = async base => {
      const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
      const p = await ctx.newPage();
      await goto(p, `${base}/index.html`);
      const data = await p.evaluate(() => {
        const rect = sel => {
          const e = document.querySelector(sel); const r = e.getBoundingClientRect();
          return { x: r.x, y: r.y, w: r.width, h: r.height };
        };
        return { heroPoster: rect('.hero-poster-frame'), castConsole: rect('#cast .cast-console'), faqConsole: rect('#faq .faq-console') };
      });
      await ctx.close(); return data;
    };
    const a = await measure('http://127.0.0.1:4172');
    const b = await measure('http://127.0.0.1:4173');
    for (const key of Object.keys(a)) {
      const maxDelta = Math.max(...['x','w'].map(k => Math.abs(a[key][k] - b[key][k])));
      check(`1366 desktop ${key} horizontal geometry preserved`, maxDelta <= 3, JSON.stringify({ before: a[key], after: b[key], maxDelta }));
    }
  }

  for (const vp of viewports) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));

    await goto(page, 'http://127.0.0.1:4173/index.html');
    check(`${vp.name} index horizontal overflow=0`, Math.abs(await overflow(page)) <= 1, String(await overflow(page)));

    await page.locator('#materials').scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    if (vp.mobile) {
      const heights = [];
      const aspects = [];
      let allContain = true;
      let allLoaded = true;
      for (let i = 0; i < 11; i++) {
        await page.waitForFunction(() => {
          const im = document.querySelector('#archiveMainImage');
          return im && im.complete && im.naturalWidth > 0 && im.naturalHeight > 0;
        }, { timeout: 5000 });
        const sample = await page.evaluate(() => {
          const st = document.querySelector('#archiveStage');
          const im = document.querySelector('#archiveMainImage');
          return {
            h: st.getBoundingClientRect().height,
            nw: im.naturalWidth,
            nh: im.naturalHeight,
            fit: getComputedStyle(im).objectFit,
            objectPosition: getComputedStyle(im).objectPosition
          };
        });
        heights.push(sample.h);
        aspects.push(Number((sample.nw / sample.nh).toFixed(3)));
        allContain &&= sample.fit === 'contain';
        allLoaded &&= sample.nw > 0 && sample.nh > 0;
        if (i < 10) {
          await page.locator('#galleryNext').click({ force: true });
          await page.waitForTimeout(120);
        }
      }
      const delta = Math.max(...heights) - Math.min(...heights);
      check(`${vp.name} all 11 archive stages stable`, delta <= 1, `delta=${delta.toFixed(2)} heights=${heights.map(x => x.toFixed(1)).join(',')}; aspects=${[...new Set(aspects)].join(',')}`);
      check(`${vp.name} archive images loaded`, allLoaded);
      check(`${vp.name} archive images object-fit contain`, allContain);

      await page.locator('#archiveDrawerToggle').click({ force: true });
      await page.waitForTimeout(180);
      const drawer = await page.evaluate(() => {
        const d = document.querySelector('#archiveDrawer');
        const g = document.querySelector('#gallery');
        const c = document.querySelector('#archiveDrawerClose');
        const t = document.querySelector('#archiveDrawerToggle');
        const db = d.getBoundingClientRect(), cb = c.getBoundingClientRect(), tb = t.getBoundingClientRect();
        return {
          w: db.width, h: db.height,
          gridOverflow: getComputedStyle(g).overflowY,
          gridScroll: g.scrollHeight, gridClient: g.clientHeight,
          closeInside: cb.top >= db.top - 1 && cb.bottom <= db.bottom + 1,
          toggleW: tb.width, toggleH: tb.height
        };
      });
      const portrait = vp.height >= vp.width;
      check(`${vp.name} archive drawer width compact`, drawer.w <= vp.width * (portrait ? .77 : .72) + 2, JSON.stringify(drawer));
      check(`${vp.name} archive drawer height compact`, drawer.h <= vp.height * (portrait ? .60 : .58) + 2, JSON.stringify(drawer));
      check(`${vp.name} archive drawer internal scrolling enabled`, ['auto','scroll'].includes(drawer.gridOverflow) && drawer.gridScroll > drawer.gridClient, JSON.stringify(drawer));
      check(`${vp.name} archive close accessible`, drawer.closeInside, JSON.stringify(drawer));
      check(`${vp.name} archive handle compact`, drawer.toggleW <= 46 && drawer.toggleH <= 80, JSON.stringify(drawer));

      await page.locator('#watch').scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      const local = await page.evaluate(() => {
        const s = document.querySelector('#materials .archive-drawer-shell');
        return { active: s.classList.contains('r7-materials-active'), visibility: getComputedStyle(s).visibility, pointer: getComputedStyle(s).pointerEvents, open: s.classList.contains('is-open') };
      });
      check(`${vp.name} ARCHIVE remains Materials-local`, !local.active && local.pointer === 'none' && !local.open, JSON.stringify(local));
    }

    await page.locator('#contacts').scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    if (vp.name === '390x844' || vp.name === '1366x768') {
      const xs = [], cards = [];
      for (let i = 0; i < 3; i++) {
        const m = await page.evaluate(() => {
          const d = document.querySelector('.contact-signal-track i').getBoundingClientRect();
          const c = document.querySelector('.contact-signal').getBoundingClientRect();
          return { x: d.x, card: [c.x, c.y, c.width, c.height] };
        });
        xs.push(m.x); cards.push(m.card); await page.waitForTimeout(650);
      }
      check(`${vp.name} contact dot X fixed`, Math.max(...xs) - Math.min(...xs) <= .5, `x=${xs.join(',')}`);
      const shift = Math.max(...cards.map(v=>v[0])) - Math.min(...cards.map(v=>v[0])) + Math.max(...cards.map(v=>v[2])) - Math.min(...cards.map(v=>v[2]));
      check(`${vp.name} contact no layout shift`, shift <= .5, JSON.stringify(cards));
    }

    await goto(page, 'http://127.0.0.1:4173/reviews.html');
    check(`${vp.name} reviews horizontal overflow=0`, Math.abs(await overflow(page)) <= 1, String(await overflow(page)));
    const hint = page.locator('[data-i18n="profanityFilterHint"]');
    check(`${vp.name} RU profanity hint absent`, await hint.count() === 0 || !(await hint.isVisible()));
    await page.locator('#langToggle').click(); await page.waitForTimeout(80);
    check(`${vp.name} EN profanity hint absent`, await hint.count() === 0 || !(await hint.isVisible()));
    await page.locator('#langToggle').click();

    if (vp.mobile) {
      await page.evaluate(() => {
        const l = document.querySelector('#reviewsList'); l.innerHTML = '';
        for (let i = 0; i < 10; i++) {
          const c = document.createElement('article'); c.className = 'review-card';
          c.innerHTML = `<div class="review-card-text">QA REVIEW ${i + 1}</div>`; l.appendChild(c);
        }
      });
      await page.waitForTimeout(120);
      const vis0 = await page.locator('#reviewsList > .review-card').evaluateAll(ns => ns.filter(n => getComputedStyle(n).display !== 'none').length);
      const more = page.locator('.r7-load-more-reviews');
      check(`${vp.name} Show More initial cap`, vis0 === 6, `visible=${vis0}`);
      check(`${vp.name} Show More visible`, await more.isVisible());
      await more.click(); await page.waitForTimeout(80);
      const vis1 = await page.locator('#reviewsList > .review-card').evaluateAll(ns => ns.filter(n => getComputedStyle(n).display !== 'none').length);
      check(`${vp.name} Show More expands feed`, vis1 === 10, `visible=${vis1}`);

      await page.locator('.community-feed-toolbar').scrollIntoViewIfNeeded(); await page.waitForTimeout(80);
      const positions = await page.evaluate(() => ['.community-feed-toolbar','.review-display-settings','.review-sort'].map(s => ({ s, pos: getComputedStyle(document.querySelector(s)).position, top: document.querySelector(s).getBoundingClientRect().top })));
      check(`${vp.name} review controls are not sticky/fixed`, positions.every(x => !['sticky','fixed'].includes(x.pos)), JSON.stringify(positions));
      const headerPos = await page.locator('.site-header').evaluate(e => getComputedStyle(e).position);
      check(`${vp.name} global site header remains sticky`, headerPos === 'sticky', headerPos);
      const top0 = await page.locator('.community-feed-toolbar').evaluate(e => e.getBoundingClientRect().top);
      await page.evaluate(() => scrollBy(0, Math.min(500, document.documentElement.scrollHeight - innerHeight - scrollY)));
      await page.waitForTimeout(80);
      const top1 = await page.locator('.community-feed-toolbar').evaluate(e => e.getBoundingClientRect().top);
      check(`${vp.name} review toolbar scrolls with document`, top1 < top0 - 80, `${top0.toFixed(1)} -> ${top1.toFixed(1)}`);
    }

    check(`${vp.name} JS errors=0`, errors.length === 0, errors.join(' | '));

    if (vp.name === '390x844') {
      await goto(page, 'http://127.0.0.1:4173/index.html#watch');
      await page.locator('.current-signal').screenshot({ path: path.join(SHOTS, 'current-signal-after-390x844.png') });
      await goto(page, 'http://127.0.0.1:4173/reviews.html');
      await page.locator('.community-feed-toolbar').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(SHOTS, 'reviews-flow-390x844.png'), fullPage: false });
    }
    if (vp.name === '430x932') {
      await goto(page, 'http://127.0.0.1:4173/index.html#materials');
      await page.locator('#archiveDrawerToggle').click({ force: true }); await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(SHOTS, 'materials-drawer-430x932.png'), fullPage: false });
    }
    if (vp.name === '844x390') {
      await goto(page, 'http://127.0.0.1:4173/index.html#materials');
      await page.locator('#archiveDrawerToggle').click({ force: true }); await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(SHOTS, 'materials-drawer-844x390.png'), fullPage: false });
    }
    if (vp.name === '932x430') {
      await goto(page, 'http://127.0.0.1:4173/index.html#materials');
      await page.locator('#archiveDrawerToggle').click({ force: true }); await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(SHOTS, 'materials-drawer-932x430.png'), fullPage: false });
    }
    if (vp.name === '1366x768') {
      await goto(page, 'http://127.0.0.1:4173/index.html#watch');
      await page.locator('.current-signal').screenshot({ path: path.join(SHOTS, 'current-signal-after-1366x768.png') });
      await page.screenshot({ path: path.join(SHOTS, 'desktop-watch-1366x768.png'), fullPage: false });
    }
    await ctx.close();
  }

  for (const vp of [viewports[0], viewports[4]]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await goto(p, 'http://127.0.0.1:4173/index.html#contacts');
    const a = await p.evaluate(() => {
      const e = document.querySelector('.contact-signal-track i');
      const c = getComputedStyle(e);
      return { animation: c.animationName, x: e.getBoundingClientRect().x };
    });
    await p.waitForTimeout(500);
    const x2 = await p.locator('.contact-signal-track i').evaluate(e => e.getBoundingClientRect().x);
    check(`${vp.name} contact reduced-motion quiet`, a.animation === 'none' && Math.abs(a.x - x2) <= .5, JSON.stringify({ ...a, x2 }));
    await ctx.close();
  }

  for (const vp of [viewports[4], viewports[0]]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile });
    const p = await ctx.newPage();
    await goto(p, 'http://127.0.0.1:4172/index.html#watch');
    await p.locator('.current-signal').screenshot({ path: path.join(SHOTS, `current-signal-before-${vp.name}.png`) });
    await ctx.close();
  }

  await browser.close();
  const failed = results.filter(x => !x.ok);
  const report = [
    '# REVIVAL R7 — Owner Feedback Round 3 browser QA', '',
    `Checks: ${results.length} / Passed: ${results.length - failed.length} / Failed: ${failed.length}`, '',
    ...results.map(x => `- ${x.ok ? 'PASS' : 'FAIL'} — ${x.name}${x.detail ? ' — ' + x.detail : ''}`)
  ].join('\n');
  fs.writeFileSync(path.join(OUT, 'REPORT.md'), report);
  fs.writeFileSync(path.join(OUT, 'RESULTS.json'), JSON.stringify(results, null, 2));
  console.log(report);
  if (failed.length) process.exit(1);
})().catch(async e => {
  console.error(e);
  try { await browser?.close(); } catch {}
  process.exit(1);
});
