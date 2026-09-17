import { chromium, firefox, webkit } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const PRODUCT_SHA = process.env.PRODUCT_SHA;
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173';
const OUT = process.env.EVIDENCE_DIR || '/tmp/r7-evidence';
if (!PRODUCT_SHA) throw new Error('PRODUCT_SHA is required');
await fs.mkdir(path.join(OUT, 'screenshots'), { recursive: true });

const engines = { chromium, firefox, webkit };
const matrix = [
  ['360x800',360,800],['390x844',390,844],['430x932',430,932],
  ['800x360',800,360],['844x390',844,390],['932x430',932,430],
  ['768x1024',768,1024],['1024x768',1024,768],['1280x720',1280,720],
  ['1366x768',1366,768],['1440x900',1440,900],['1920x1080',1920,1080],
  ['1080x1920',1080,1920],['1280x600',1280,600]
];
const screenshotKeys = new Set(['390x844','844x390','1366x768','1440x900']);
const targetedKeys = new Set(['390x844','430x932','844x390','1366x768','1440x900']);
const results = [];
const screenshots = [];

function add(engine, viewport, check, ok, detail = '') {
  results.push({ engine, viewport, check, status: ok ? 'PASS' : 'FAIL', detail });
}
function nt(engine, viewport, check, detail) {
  results.push({ engine, viewport, check, status: 'NOT TESTED', detail });
}
const near = (a,b,t=2) => Math.abs(a-b) <= t;

async function visible(locator) {
  try { return await locator.isVisible(); } catch { return false; }
}
async function noOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2);
}
async function screenshot(page, engine, viewport, name) {
  const file = path.join(OUT, 'screenshots', `${engine}-${viewport}-${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  screenshots.push(path.basename(file));
}
async function settle(page, ms=450) { await page.waitForTimeout(ms); }

for (const [engineName, launcher] of Object.entries(engines)) {
  const browser = await launcher.launch({ headless: true });
  for (const [vpName, width, height] of matrix) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', err => pageErrors.push(String(err)));

    try {
      const response = await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      add(engineName,vpName,'homepage HTTP 200',response?.status()===200,String(response?.status()));
      await settle(page, 250);

      add(engineName,vpName,'horizontal scroll progress removed',(await page.locator('#scrollProgress').count())===0);
      add(engineName,vpName,'vertical section indicator visible',await visible(page.locator('.system-rail')));
      add(engineName,vpName,'section indicator has current code',(await page.locator('#railSection').textContent() || '').trim().length>0);
      add(engineName,vpName,'no horizontal document overflow',await noOverflow(page));

      const order = await page.locator('#primaryNav a').evaluateAll(nodes => nodes.map(n => ({href:n.getAttribute('href')||'', cls:n.className||''})));
      const idx = pred => order.findIndex(pred);
      const iCast=idx(x=>x.href.includes('#cast')), iFaq=idx(x=>x.href.includes('#faq')), iReviews=idx(x=>x.href.includes('reviews')), iReport=idx(x=>x.cls.includes('r7-nav-report'));
      add(engineName,vpName,'navigation ACTORS→FAQ→REVIEWS→REPORT',iCast>=0&&iFaq===iCast+1&&iReviews===iFaq+1&&iReport===iReviews+1,JSON.stringify({iCast,iFaq,iReviews,iReport}));

      const controls = page.locator('.r7-player-controls');
      add(engineName,vpName,'THEFT trailer controls visible',await visible(controls));
      add(engineName,vpName,'native trailer controls disabled',await page.locator('#trailerVideo').evaluate(v=>!v.controls));
      add(engineName,vpName,'trailer play control present',await visible(page.locator('.r7-player-play')));
      add(engineName,vpName,'trailer seek control present',await visible(page.locator('.r7-player-progress')));
      add(engineName,vpName,'trailer fullscreen control present',await visible(page.locator('.r7-player-fullscreen')));
      add(engineName,vpName,'no Settings control',(await page.locator('.r7-player-settings').count())===0);
      add(engineName,vpName,'no Playback Speed control',(await page.locator('.r7-player-speed').count())===0);
      add(engineName,vpName,'no CC control',(await page.locator('.r7-player-cc').count())===0);
      add(engineName,vpName,'no Download control',(await page.locator('[download],.r7-player-download').count())===0);
      const isCompact = width<=820 || (width>height && width<=960 && height<=560);
      if (isCompact) add(engineName,vpName,'mobile PiP absent',!(await visible(page.locator('.r7-player-pip'))));
      else add(engineName,vpName,'desktop volume slider visible',await visible(page.locator('.r7-player-volume')));

      const contact = await page.locator('.contact-signal-track i').evaluate(el => {
        const cs=getComputedStyle(el); return {timing:cs.animationTimingFunction,duration:cs.animationDuration,count:el.parentElement.querySelectorAll('i').length,b:getComputedStyle(el.parentElement.querySelector('b')).display};
      });
      add(engineName,vpName,'CONTACT exactly one travelling point',contact.count===1,JSON.stringify(contact));
      add(engineName,vpName,'CONTACT linear uniform timing',contact.timing==='linear',JSON.stringify(contact));
      add(engineName,vpName,'CONTACT endpoint diamond hidden',contact.b==='none',JSON.stringify(contact));

      await page.locator('#cast').scrollIntoViewIfNeeded(); await settle(page,100);
      await page.evaluate(() => document.querySelector('#cast')?.scrollIntoView({block:'start'})); await settle(page,120);
      const railCast = (await page.locator('#railSection').textContent()||'');
      add(engineName,vpName,'section indicator updates at ACTORS',railCast.includes('05'),railCast);

      if (targetedKeys.has(vpName)) {
        const y0 = await page.evaluate(()=>scrollY);
        await page.locator('#cast .cast-list-item').first().click(); await settle(page,760);
        const y1 = await page.evaluate(()=>scrollY);
        add(engineName,vpName,'Actors open selects dossier',await page.locator('#cast .cast-list-item').first().getAttribute('aria-selected')==='true');
        add(engineName,vpName,'Actors structure has no transform',await page.locator('#subjectDossier').evaluate(el=>getComputedStyle(el).transform==='none'));
        if (isCompact) add(engineName,vpName,'Actors mobile viewport stable on open',near(y0,y1,4),`${y0}→${y1}`);
        await page.locator('#subjectDossierClose').click(); await settle(page,760);
        const y2=await page.evaluate(()=>scrollY);
        add(engineName,vpName,'Actors close returns neutral',(await page.locator('#cast .cast-list-item[aria-selected="true"]').count())===0);
        if (isCompact) add(engineName,vpName,'Actors mobile viewport stable on close',near(y1,y2,4),`${y1}→${y2}`);

        await page.locator('#faq').scrollIntoViewIfNeeded(); await page.evaluate(()=>document.querySelector('#faq')?.scrollIntoView({block:'start'})); await settle(page,120);
        const fq0=await page.evaluate(()=>scrollY);
        await page.locator('#faq .faq-query-item').first().click(); await settle(page,760);
        const fq1=await page.evaluate(()=>scrollY);
        add(engineName,vpName,'FAQ open selects response',await page.locator('#faq .faq-query-item').first().getAttribute('aria-selected')==='true');
        add(engineName,vpName,'FAQ structure has no transform',await page.locator('#faqResponsePanel').evaluate(el=>getComputedStyle(el).transform==='none'));
        if (isCompact) add(engineName,vpName,'FAQ mobile viewport stable on open',near(fq0,fq1,4),`${fq0}→${fq1}`);
        await page.locator('#faqResponseClose').click(); await settle(page,760);
        const fq2=await page.evaluate(()=>scrollY);
        add(engineName,vpName,'FAQ close returns standby',(await page.locator('#faq .faq-query-item[aria-selected="true"]').count())===0);
        if (isCompact) add(engineName,vpName,'FAQ mobile viewport stable on close',near(fq1,fq2,4),`${fq1}→${fq2}`);
      }

      if (isCompact) {
        const hero = await page.evaluate(() => {
          const p=document.querySelector('.hero-poster-frame')?.getBoundingClientRect();
          const s=document.querySelector('.r7-mobile-hero-copy')?.getBoundingClientRect();
          const a=document.querySelector('.r7-mobile-hero-actions')?.getBoundingClientRect();
          return p&&s&&a ? {posterBottom:p.bottom,synopsisTop:s.top,synopsisBottom:s.bottom,actionsTop:a.top} : null;
        });
        add(engineName,vpName,'mobile Hero order POSTER→SYNOPSIS→ACTIONS',!!hero&&hero.posterBottom<=hero.synopsisTop+1&&hero.synopsisBottom<=hero.actionsTop+1,JSON.stringify(hero));
        add(engineName,vpName,'mobile Hero poster→synopsis breathing room',!!hero&&(hero.synopsisTop-hero.posterBottom)>=8,JSON.stringify(hero));
      }

      if (screenshotKeys.has(vpName)) {
        await page.goto(`${BASE}/index.html#trailer`,{waitUntil:'domcontentloaded'}); await settle(page,300); await screenshot(page,engineName,vpName,'trailer');
        await page.goto(`${BASE}/index.html#cast`,{waitUntil:'domcontentloaded'}); await settle(page,250); await page.locator('#cast .cast-list-item').first().click(); await settle(page,650); await screenshot(page,engineName,vpName,'actors-open');
        await page.goto(`${BASE}/index.html#faq`,{waitUntil:'domcontentloaded'}); await settle(page,250); await page.locator('#faq .faq-query-item').first().click(); await settle(page,650); await screenshot(page,engineName,vpName,'faq-open');
        await page.goto(`${BASE}/index.html#contacts`,{waitUntil:'domcontentloaded'}); await settle(page,250); await screenshot(page,engineName,vpName,'contact');
      }

      if (targetedKeys.has(vpName)) {
        await page.goto(`${BASE}/index.html#trailer`,{waitUntil:'domcontentloaded'}); await settle(page,250);
        const video=page.locator('#trailerVideo');
        await video.click({position:{x:30,y:30}}).catch(()=>{});
        await page.keyboard.press('f').catch(()=>{}); await settle(page,120);
        const fsAfterF=await page.evaluate(()=>!!(document.fullscreenElement||document.webkitFullscreenElement));
        if (fsAfterF) { add(engineName,vpName,'F fullscreen toggle',true); await page.keyboard.press('Escape').catch(()=>{}); await settle(page,100); }
        else nt(engineName,vpName,'F fullscreen toggle','browser-native fullscreen not observable/allowed in this headless context');
        await video.dblclick({position:{x:50,y:50}}).catch(()=>{}); await settle(page,120);
        const fsAfterDbl=await page.evaluate(()=>!!(document.fullscreenElement||document.webkitFullscreenElement));
        if (fsAfterDbl) { add(engineName,vpName,'double-click fullscreen toggle',true); await page.keyboard.press('Escape').catch(()=>{}); }
        else nt(engineName,vpName,'double-click fullscreen toggle','browser-native fullscreen not observable/allowed in this headless context');
      }

      const reviewsResponse = await page.goto(`${BASE}/reviews.html`,{waitUntil:'domcontentloaded',timeout:30000}); await settle(page,300);
      add(engineName,vpName,'Reviews HTTP 200',reviewsResponse?.status()===200,String(reviewsResponse?.status()));
      add(engineName,vpName,'Reviews horizontal progress removed',(await page.locator('#scrollProgress').count())===0);
      add(engineName,vpName,'Reviews vertical indicator visible',await visible(page.locator('.system-rail')));
      add(engineName,vpName,'rating contract has 11 values',(await page.locator('.rating-button').count())===11);
      add(engineName,vpName,'rating keeps 0',await page.locator('.rating-button[data-rating="0"]').count()===1);
      if (isCompact) {
        const boxes=await page.locator('.rating-button').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {w:r.width,h:r.height,x:r.x,y:r.y}}));
        const w0=boxes[0]?.w||0,h0=boxes[0]?.h||0;
        add(engineName,vpName,'mobile rating equal visible dimensions',boxes.length===11&&boxes.every(b=>near(b.w,w0,1)&&near(b.h,h0,1)),JSON.stringify(boxes));
        const rows=[...new Set(boxes.map(b=>Math.round(b.y)))];
        add(engineName,vpName,'mobile rating wraps to balanced two rows',rows.length===2,JSON.stringify(rows));
      }
      await page.locator('#reviewWorkspace').scrollIntoViewIfNeeded(); await settle(page,120);
      const railReview=(await page.locator('#railSection').textContent()||'');
      add(engineName,vpName,'Reviews indicator updates to feed',railReview.includes('R1'),railReview);
      if (screenshotKeys.has(vpName)) await screenshot(page,engineName,vpName,'reviews-rating');

      add(engineName,vpName,'page console errors = 0',consoleErrors.length===0,consoleErrors.join(' | ').slice(0,1200));
      add(engineName,vpName,'page exceptions = 0',pageErrors.length===0,pageErrors.join(' | ').slice(0,1200));
    } catch (error) {
      add(engineName,vpName,'audit execution',false,String(error?.stack||error));
    }
    await context.close();
  }
  await browser.close();
}

// Source/safety checks independent of browser viewport.
const sourceChecks = [];
async function source(name, ok, detail='') { sourceChecks.push({engine:'source',viewport:'all',check:name,status:ok?'PASS':'FAIL',detail}); }
const index = await fs.readFile('index.html','utf8');
const reviews = await fs.readFile('reviews.html','utf8');
const site = await fs.readFile('js/site.js','utf8');
const responsive = await fs.readFile('js/responsive-r7.js','utf8');
const followJs = await fs.readFile('js/r7-live-followup.js','utf8');
const followCss = await fs.readFile('css/r7-live-followup.css','utf8');
await source('bad Archive CSS path count = 0',![index,reviews,site,responsive,followJs,followCss].join('\n').includes('/css/assets/images/archive/'));
await source('horizontal progress node absent',!index.includes('id="scrollProgress"')&&!reviews.includes('id="scrollProgress"'));
await source('forbidden mobile scrollTo workaround absent from sequential block',!responsive.slice(responsive.indexOf('// Sequential FAQ / Actors'),responsive.indexOf('// PROFILE HELP')).includes('scrollTo('));
await source('forbidden sequential min-height helper absent',!responsive.includes('holdSequentialHeight'));
await source('follow-up does not touch Supabase',!followJs.toLowerCase().includes('supabase')&&!followCss.toLowerCase().includes('supabase'));
results.push(...sourceChecks);

const archiveResponse = await fetch(`${BASE}/assets/images/archive/archive-01.jpg`);
add('network','all','correct Archive asset HTTP 200',archiveResponse.status===200,String(archiveResponse.status));

const totals = {
  total: results.length,
  pass: results.filter(r=>r.status==='PASS').length,
  fail: results.filter(r=>r.status==='FAIL').length,
  not_tested: results.filter(r=>r.status==='NOT TESTED').length
};
const report = { product_sha: PRODUCT_SHA, audit_trigger_sha: process.env.GITHUB_SHA || null, matrix: matrix.map(([name,w,h])=>({name,width:w,height:h})), engines:Object.keys(engines), totals, results, screenshots };
await fs.writeFile(path.join(OUT,'RESULTS.json'),JSON.stringify(report,null,2));
const failures=results.filter(r=>r.status==='FAIL');
const nts=results.filter(r=>r.status==='NOT TESTED');
const md=[
  '# R7 LIVE FOLLOW-UP AUDIT', '', `Product SHA: ${PRODUCT_SHA}`, `Audit trigger SHA: ${process.env.GITHUB_SHA||'unknown'}`,
  '', `TOTAL ${totals.total} / PASS ${totals.pass} / FAIL ${totals.fail} / NOT TESTED ${totals.not_tested}`,
  '', '## Failures', ...(failures.length?failures.map(r=>`- ${r.engine} ${r.viewport} — ${r.check}: ${r.detail||''}`):['- none']),
  '', '## NOT TESTED', ...(nts.length?nts.map(r=>`- ${r.engine} ${r.viewport} — ${r.check}: ${r.detail}`):['- none']),
  '', '## Screenshots', ...screenshots.map(s=>`- screenshots/${s}`)
];
await fs.writeFile(path.join(OUT,'REPORT.md'),md.join('\n'));
await fs.writeFile(path.join(OUT,'EVIDENCE-INDEX.md'),['# Evidence index','',`- Product SHA: ${PRODUCT_SHA}`,'- RESULTS.json','- REPORT.md',...screenshots.map(s=>`- screenshots/${s}`)].join('\n'));
console.log(JSON.stringify(totals));
if (totals.fail) process.exit(1);
