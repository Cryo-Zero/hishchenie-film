import { chromium, firefox, webkit } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const PRODUCT_SHA = process.env.PRODUCT_SHA;
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173';
const OUT = process.env.EVIDENCE_DIR || '/tmp/r7-phone-landscape-targeted';
if (!PRODUCT_SHA) throw new Error('PRODUCT_SHA is required');
await fs.mkdir(path.join(OUT, 'screenshots'), { recursive: true });

const engines = { chromium, firefox, webkit };
const landscapes = [
  ['800x360',800,360],
  ['844x390',844,390],
  ['932x430',932,430]
];
const portraits = [
  ['390x844',390,844],
  ['430x932',430,932]
];
const results = [];
const shots = [];
const near = (a,b,t=1.2) => Math.abs(a-b) <= t;

function add(engine, viewport, check, ok, detail='') {
  results.push({ engine, viewport, check, status: ok ? 'PASS' : 'FAIL', detail });
}
async function visible(locator) {
  try { return await locator.isVisible(); } catch { return false; }
}
async function shot(page, engine, viewport, name) {
  const file = path.join(OUT, 'screenshots', `${engine}-${viewport}-${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  shots.push(path.basename(file));
}
async function openPage(browser, width, height, pagePath) {
  const context = await browser.newContext({ viewport:{width,height}, reducedMotion:'no-preference', hasTouch:true });
  const page = await context.newPage();
  const response = await page.goto(`${BASE}/${pagePath}`, { waitUntil:'domcontentloaded', timeout:30000 });
  await page.waitForTimeout(280);
  return { context, page, status: response?.status() || 0 };
}
async function contactState(page) {
  return page.locator('.contact-signal-track i').evaluate(el => {
    const cs = getComputedStyle(el);
    const track = el.parentElement;
    const signal = el.closest('.contact-signal');
    const b = track?.querySelector('b');
    const anim = el.getAnimations().find(a => a.effect);
    const durationMs = parseFloat(cs.animationDuration) * 1000;
    const travel = [];
    if (anim && Number.isFinite(durationMs) && durationMs > 0) {
      anim.pause();
      for (const fraction of [.2,.5,.8]) {
        anim.currentTime = durationMs * fraction;
        travel.push({ fraction, left: parseFloat(getComputedStyle(el).left) });
      }
    }
    const usable = Math.max(0, (track?.getBoundingClientRect().width || 0) - el.getBoundingClientRect().width);
    return {
      timing: cs.animationTimingFunction,
      duration: cs.animationDuration,
      name: cs.animationName,
      pointCount: track?.querySelectorAll('i').length || 0,
      endpointDisplay: b ? getComputedStyle(b).display : 'missing',
      endpointAnimation: b ? getComputedStyle(b).animationName : 'missing',
      sweepDisplay: getComputedStyle(el,'::after').display,
      sweepContent: getComputedStyle(el,'::after').content,
      signalBeforeDisplay: signal ? getComputedStyle(signal,'::before').display : 'missing',
      travel,
      usable
    };
  });
}
function linearTravelOk(state) {
  if (state.travel.length !== 3 || state.usable <= 0) return false;
  return state.travel.every(s => near(s.left, state.usable * s.fraction, 3));
}
async function ratingState(page) {
  return page.locator('.review-composer .rating-button').evaluateAll(nodes => {
    const boxes = nodes.map(n => { const r=n.getBoundingClientRect(); return { value:n.getAttribute('data-rating'), w:r.width, h:r.height, x:r.x, y:r.y }; });
    const rows = [...new Set(boxes.map(b => Math.round(b.y)))].sort((a,b)=>a-b);
    const counts = rows.map(y => boxes.filter(b => Math.round(b.y) === y).length);
    return { boxes, rows, counts, values:boxes.map(b=>b.value) };
  });
}
function ratingEqual(state) {
  if (state.boxes.length !== 11) return false;
  const {w,h}=state.boxes[0];
  return state.boxes.every(b=>near(b.w,w,1)&&near(b.h,h,1));
}
async function railState(page, shellSelector) {
  return page.evaluate((shellSelector) => {
    const rail=document.querySelector('.system-rail');
    const shell=document.querySelector(shellSelector);
    if (!rail || !shell) return null;
    const rr=rail.getBoundingClientRect();
    const sr=shell.getBoundingClientRect();
    return {
      display:getComputedStyle(rail).display,
      visibility:getComputedStyle(rail).visibility,
      opacity:getComputedStyle(rail).opacity,
      rail:{left:rr.left,right:rr.right,top:rr.top,bottom:rr.bottom,width:rr.width,height:rr.height},
      shell:{left:sr.left,right:sr.right,width:sr.width},
      viewport:{width:innerWidth,height:innerHeight},
      section:(document.querySelector('#railSection')?.textContent||'').trim(),
      horizontalProgressNodes:document.querySelectorAll('#scrollProgress,.scroll-progress').length
    };
  }, shellSelector);
}
function railGeometryOk(s) {
  return !!s && s.display==='grid' && s.visibility!=='hidden' && Number(s.opacity)>0 &&
    s.rail.left >= s.shell.right - 1 && s.rail.right <= s.viewport.width + .5 &&
    s.shell.width >= s.viewport.width - 32;
}
async function waitRail(page, expected) {
  try {
    await page.waitForFunction(exp => (document.querySelector('#railSection')?.textContent||'').includes(exp), expected, { timeout:2200, polling:50 });
    return true;
  } catch { return false; }
}

for (const [engineName, launcher] of Object.entries(engines)) {
  const browser = await launcher.launch({ headless:true });

  for (const [vp,width,height] of landscapes) {
    const home = await openPage(browser,width,height,'index.html');
    const {context,page}=home;
    add(engineName,vp,'homepage HTTP 200',home.status===200,String(home.status));
    add(engineName,vp,'phone-landscape class active',await page.locator('body').evaluate(b=>b.classList.contains('r7-phone-landscape')));

    const contact=await contactState(page);
    add(engineName,vp,'CONTACT timing linear',contact.timing==='linear',JSON.stringify(contact));
    add(engineName,vp,'CONTACT duration 4.15s',contact.duration==='4.15s',JSON.stringify(contact));
    add(engineName,vp,'CONTACT uses final travel animation',contact.name==='r7ContactTravel',JSON.stringify(contact));
    add(engineName,vp,'CONTACT exactly one point',contact.pointCount===1,JSON.stringify(contact));
    add(engineName,vp,'CONTACT no diamond/sweep',contact.endpointDisplay==='none'&&contact.sweepDisplay==='none'&&contact.signalBeforeDisplay==='none',JSON.stringify(contact));
    add(engineName,vp,'CONTACT uniform sampled travel / no endpoint braking',linearTravelOk(contact),JSON.stringify(contact));

    if (vp==='844x390'||vp==='932x430') {
      const initial=await railState(page,'.hero-inner');
      add(engineName,vp,'HOME system rail visible and edge-safe',railGeometryOk(initial),JSON.stringify(initial));
      add(engineName,vp,'HOME rail initial state ENTRY',initial?.section.includes('00')||initial?.section.includes('ENTRY'),JSON.stringify(initial));
      add(engineName,vp,'HOME horizontal progress absent',initial?.horizontalProgressNodes===0,JSON.stringify(initial));
      await page.locator('#cast').scrollIntoViewIfNeeded();
      add(engineName,vp,'HOME ordinary scroll updates rail to ACTORS',await waitRail(page,'05'),(await page.locator('#railSection').textContent()||'').trim());
      await page.goto(`${BASE}/index.html`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(220); await shot(page,engineName,vp,'home-rail');
    }
    await context.close();

    const reviews=await openPage(browser,width,height,'reviews.html');
    const rp=reviews.page;
    add(engineName,vp,'Reviews HTTP 200',reviews.status===200,String(reviews.status));
    add(engineName,vp,'Reviews phone-landscape class active',await rp.locator('body').evaluate(b=>b.classList.contains('r7-phone-landscape')));

    if (vp==='800x360') {
      const rating=await ratingState(rp);
      add(engineName,vp,'RATING contract values 0-10 retained',rating.values.join(',')==='0,1,2,3,4,5,6,7,8,9,10',JSON.stringify(rating));
      add(engineName,vp,'RATING all 11 controls equal dimensions',ratingEqual(rating),JSON.stringify(rating));
      add(engineName,vp,'RATING exactly two balanced rows',rating.rows.length===2&&rating.counts[0]===6&&rating.counts[1]===5,JSON.stringify(rating));
      add(engineName,vp,'RATING 10 equal to first control',rating.boxes.length===11&&near(rating.boxes[10].w,rating.boxes[0].w,1)&&near(rating.boxes[10].h,rating.boxes[0].h,1),JSON.stringify(rating));
      add(engineName,vp,'RATING no horizontal document overflow',await rp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),`${await rp.evaluate(()=>document.documentElement.scrollWidth)} / ${width}`);
      await shot(rp,engineName,vp,'reviews-rating');
    }

    if (vp==='844x390'||vp==='932x430') {
      const initial=await railState(rp,'.community-hero .shell');
      add(engineName,vp,'REVIEWS system rail visible and edge-safe',railGeometryOk(initial),JSON.stringify(initial));
      add(engineName,vp,'REVIEWS rail initial state RESPONSE',initial?.section.includes('R / RESPONSE')||initial?.section==='R / RESPONSE',JSON.stringify(initial));
      add(engineName,vp,'REVIEWS horizontal progress absent',initial?.horizontalProgressNodes===0,JSON.stringify(initial));
      await rp.locator('#reviewWorkspace').scrollIntoViewIfNeeded();
      add(engineName,vp,'REVIEWS ordinary scroll updates rail to feed',await waitRail(rp,'R1'),(await rp.locator('#railSection').textContent()||'').trim());
      await rp.goto(`${BASE}/reviews.html`,{waitUntil:'domcontentloaded'}); await rp.waitForTimeout(220); await shot(rp,engineName,vp,'reviews-rail');
    }
    await reviews.context.close();
  }

  for (const [vp,width,height] of portraits) {
    const home=await openPage(browser,width,height,'index.html');
    const hp=home.page;
    add(engineName,vp,'PORTRAIT remains non-phone-landscape',!(await hp.locator('body').evaluate(b=>b.classList.contains('r7-phone-landscape'))));
    const contact=await contactState(hp);
    add(engineName,vp,'PORTRAIT CONTACT still linear 4.15s',contact.timing==='linear'&&contact.duration==='4.15s'&&contact.pointCount===1,JSON.stringify(contact));
    add(engineName,vp,'PORTRAIT system rail still visible',await visible(hp.locator('.system-rail')));
    add(engineName,vp,'PORTRAIT no horizontal overflow',await hp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
    await home.context.close();

    const reviews=await openPage(browser,width,height,'reviews.html');
    const rating=await ratingState(reviews.page);
    add(engineName,vp,'PORTRAIT rating remains equal two-row 0-10',rating.values.join(',')==='0,1,2,3,4,5,6,7,8,9,10'&&ratingEqual(rating)&&rating.rows.length===2,JSON.stringify(rating));
    add(engineName,vp,'PORTRAIT Reviews rail still visible',await visible(reviews.page.locator('.system-rail')));
    await reviews.context.close();
  }

  await browser.close();
}

const totals={total:results.length,pass:results.filter(r=>r.status==='PASS').length,fail:results.filter(r=>r.status==='FAIL').length};
const report={product_sha:PRODUCT_SHA,trigger_sha:process.env.GITHUB_SHA||null,engines:Object.keys(engines),landscapes:landscapes.map(([name,width,height])=>({name,width,height})),portraits:portraits.map(([name,width,height])=>({name,width,height})),totals,results,screenshots:shots};
await fs.writeFile(path.join(OUT,'RESULTS.json'),JSON.stringify(report,null,2));
const failures=results.filter(r=>r.status==='FAIL');
await fs.writeFile(path.join(OUT,'REPORT.md'),[
  '# R7 PHONE-LANDSCAPE TARGETED QA','',`Product SHA: ${PRODUCT_SHA}`,`Trigger SHA: ${process.env.GITHUB_SHA||'unknown'}`,'',`TOTAL ${totals.total} / PASS ${totals.pass} / FAIL ${totals.fail}`,'','## Failures',...(failures.length?failures.map(r=>`- ${r.engine} ${r.viewport} — ${r.check}: ${r.detail}`):['- none']),'','## Screenshots',...shots.map(s=>`- screenshots/${s}`)
].join('\n'));
console.log(JSON.stringify(totals));
if (totals.fail) process.exit(1);
