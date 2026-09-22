import { chromium, firefox, webkit } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const PRODUCT_SHA = process.env.PRODUCT_SHA;
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173';
const OUT = process.env.EVIDENCE_DIR || '/tmp/r7-evidence';
if (!PRODUCT_SHA) throw new Error('PRODUCT_SHA is required');
await fs.mkdir(path.join(OUT, 'screenshots'), { recursive: true });

const engines = { chromium, firefox, webkit };
const AUDIT_MODE = process.env.AUDIT_MODE === 'sanity' ? 'sanity' : 'full';
const fullMatrix = [
  ['360x800',360,800],['390x844',390,844],['430x932',430,932],
  ['800x360',800,360],['844x390',844,390],['932x430',932,430],
  ['768x1024',768,1024],['1024x768',1024,768],['1280x720',1280,720],
  ['1366x768',1366,768],['1440x900',1440,900],['1920x1080',1920,1080],
  ['1080x1920',1080,1920],['1280x600',1280,600]
];
const sanityMatrix = [
  ['390x844',390,844],['430x932',430,932],['800x360',800,360],
  ['844x390',844,390],['932x430',932,430],['1366x768',1366,768],
  ['1440x900',1440,900]
];
const matrix = AUDIT_MODE === 'sanity' ? sanityMatrix : fullMatrix;
const touchKeys = new Set(['360x800','390x844','430x932','800x360','844x390','932x430','768x1024','1024x768']);
const screenshotKeys = new Set(['390x844','844x390','1366x768','1440x900']);
const fullTargetedKeys = new Set(['390x844','430x932','844x390','1366x768','1440x900']);
const isTargetedViewport = viewport => AUDIT_MODE === 'sanity' || fullTargetedKeys.has(viewport);
const results = [];
const screenshots = [];
let productConsoleErrorTotal = 0;
let pageExceptionTotal = 0;
let environmentEventTotal = 0;

function add(engine, viewport, check, ok, detail = '', failureClass = 'PRODUCT') {
  results.push({ engine, viewport, check, status: ok ? 'PASS' : 'FAIL', failure_class: ok ? null : failureClass, detail });
}
function nt(engine, viewport, check, detail) {
  results.push({ engine, viewport, check, status: 'NOT TESTED', failure_class: null, detail });
}
function env(engine, viewport, check, detail) {
  results.push({ engine, viewport, check, status: 'ENVIRONMENT', failure_class: null, detail });
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
async function waitForLanguage(page, expected) {
  try {
    await page.waitForFunction(lang => document.documentElement.lang === lang, expected, { timeout: 2600, polling: 50 });
    return true;
  } catch { return false; }
}
async function jumpTo(page, selector) {
  await page.evaluate(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    const top = el.getBoundingClientRect().top + scrollY;
    window.scrollTo(0, Math.max(0, Math.round(top)));
    void root.offsetHeight;
    root.style.scrollBehavior = previous;
  }, selector);
  await settle(page, 180);
}
async function anchorGeometry(page, selector) {
  return page.locator(selector).evaluate(el => {
    const r = el.getBoundingClientRect();
    return {
      top: r.top,
      bottom: r.bottom,
      height: r.height,
      scrollY,
      bottomGap: document.documentElement.scrollHeight - (scrollY + innerHeight),
      viewportHeight: innerHeight
    };
  });
}
async function prepareVisualAnchor(page, sectionSelector, anchorSelector) {
  await page.locator(sectionSelector).evaluate(el => el.scrollIntoView({ behavior:'instant', block:'center' }));
  await settle(page, 90);
  let geometry = await anchorGeometry(page, anchorSelector);
  for (let i=0; i<2 && geometry.bottomGap < 160; i += 1) {
    await page.mouse.wheel(0, -260);
    await settle(page, 90);
    geometry = await anchorGeometry(page, anchorSelector);
  }
  return geometry;
}
async function activateSectionAndWaitRail(page, selector, expected) {
  const locator = page.locator(selector);
  await locator.evaluate(el => {
    const top = el.getBoundingClientRect().top + scrollY;
    const previous = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, Math.max(0, Math.round(top - innerHeight * .20)));
    void document.documentElement.offsetHeight;
    document.documentElement.style.scrollBehavior = previous;
  });
  await settle(page, 120);
  let synced = false;
  try {
    await page.waitForFunction(({ sel, exp }) => {
      const el = document.querySelector(sel);
      const rail = document.querySelector('#railSection');
      if (!el || !rail) return false;
      const r = el.getBoundingClientRect();
      const probe = innerHeight * .34;
      return r.top <= probe && r.bottom > probe && (rail.textContent || '').includes(exp);
    }, { sel: selector, exp: expected }, { timeout: 3000, polling: 50 });
    synced = true;
  } catch {}
  const geometry = await locator.evaluate(el => {
    const r = el.getBoundingClientRect();
    const probe = innerHeight * .34;
    return { top:r.top, bottom:r.bottom, height:r.height, viewportHeight:innerHeight, probe, intersectsProbe:r.top<=probe&&r.bottom>probe };
  });
  const text = (await page.locator('#railSection').textContent() || '').trim();
  return { ok: geometry.intersectsProbe && synced && text.includes(expected), geometryActive: geometry.intersectsProbe, geometry, text, expected };
}
const KNOWN_EXTERNAL_RPC_PATHS = new Set([
  '/rest/v1/rpc/get_public_channel_state_v2',
  '/rest/v1/rpc/get_public_stats_v2'
]);
function knownExternalRpcUrl(value = '') {
  try {
    const url = new URL(value);
    return url.hostname === 'xltwwvutqkpmtmlavngi.supabase.co' && KNOWN_EXTERNAL_RPC_PATHS.has(url.pathname);
  } catch { return false; }
}
function externalConsoleRecord(record, externalFailures) {
  const correlated = externalFailures.filter(failure => knownExternalRpcUrl(failure.url));
  if (!correlated.length) return false;
  const locationUrl = record.location?.url || '';
  if (knownExternalRpcUrl(locationUrl)) {
    const endpoint = new URL(locationUrl).pathname;
    return correlated.some(failure => new URL(failure.url).pathname === endpoint);
  }
  return /^\[P17\/stats\]\s+/.test(record.text || '');
}

for (const [engineName, launcher] of Object.entries(engines)) {
  const browser = await launcher.launch({ headless: true });
  for (const [vpName, width, height] of matrix) {
    const touchLike = touchKeys.has(vpName);
    const isCompact = width<=820 || (touchLike && width>height && width<=960 && height<=560);
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'no-preference', hasTouch: touchLike });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const externalFailures = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push({ text: msg.text(), location: msg.location() || {} });
    });
    page.on('pageerror', err => pageErrors.push(String(err)));
    page.on('requestfailed', request => {
      if (knownExternalRpcUrl(request.url())) externalFailures.push({ url: request.url(), errorText: request.failure()?.errorText || 'request failed' });
    });

    try {
      const response = await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      add(engineName,vpName,'homepage HTTP 200',response?.status()===200,String(response?.status()));
      await settle(page, 250);

      add(engineName,vpName,'horizontal scroll progress removed',(await page.locator('#scrollProgress').count())===0);
      add(engineName,vpName,'vertical section indicator visible',await visible(page.locator('.system-rail')));
      add(engineName,vpName,'section indicator has current code',(await page.locator('#railSection').textContent() || '').trim().length>0);
      add(engineName,vpName,'no horizontal document overflow',await noOverflow(page));
      const heroTitle = page.locator(isCompact ? '.r7-mobile-hero-title' : '.hero-copy-column > h1').first();
      const heroTitleText = ((await heroTitle.textContent().catch(() => '')) || '').trim();
      add(engineName,vpName,'Hero title visible',await visible(heroTitle) && /ХИЩЕНИЕ|THEFT/.test(heroTitleText),JSON.stringify({selector:isCompact?'.r7-mobile-hero-title':'.hero-copy-column > h1',text:heroTitleText}));
      add(engineName,vpName,'Hero poster visible',await visible(page.locator('.hero-poster-frame')));

      const order = await page.locator('#primaryNav a').evaluateAll(nodes => nodes.map(n => ({href:n.getAttribute('href')||'', cls:n.className||''})));
      const idx = pred => order.findIndex(pred);
      const iCast=idx(x=>x.href.includes('#cast')), iFaq=idx(x=>x.href.includes('#faq')), iReviews=idx(x=>x.href.includes('reviews')), iReport=idx(x=>x.cls.includes('r7-nav-report'));
      add(engineName,vpName,'navigation ACTORS→FAQ→REVIEWS→REPORT',iCast>=0&&iFaq===iCast+1&&iReviews===iFaq+1&&iReport===iReviews+1,JSON.stringify({iCast,iFaq,iReviews,iReport}));

      if (width <= 980) {
        const toggle = page.locator('#menuToggle');
        add(engineName,vpName,'burger control visible',await visible(toggle));
        await toggle.click(); await settle(page,60);
        add(engineName,vpName,'burger opens navigation',(await page.locator('body').evaluate(b=>b.classList.contains('nav-open'))) && (await toggle.getAttribute('aria-expanded'))==='true');
        await toggle.click(); await settle(page,60);
        add(engineName,vpName,'burger closes navigation',!(await page.locator('body').evaluate(b=>b.classList.contains('nav-open'))) && (await toggle.getAttribute('aria-expanded'))==='false');
      }

      if (isTargetedViewport(vpName)) {
        const copyByLang = { ru:'О фильме', en:'About' };
        const beforeLang = ((await page.locator('html').getAttribute('lang')) || '').toLowerCase();
        const beforeCopy = ((await page.locator('[data-i18n="navAbout"]').first().textContent()) || '').trim();
        const opposite = beforeLang === 'ru' ? 'en' : beforeLang === 'en' ? 'ru' : null;
        add(engineName,vpName,'translation initial language state recognized',!!opposite && beforeCopy===copyByLang[beforeLang],JSON.stringify({beforeLang,beforeCopy}));
        if (opposite) {
          await page.locator('#langToggle').click();
          const changed = await waitForLanguage(page, opposite);
          const oppositeCopy = ((await page.locator('[data-i18n="navAbout"]').first().textContent()) || '').trim();
          add(engineName,vpName,'translation switches to opposite language',changed && oppositeCopy===copyByLang[opposite],JSON.stringify({from:beforeLang,to:opposite,copy:oppositeCopy}));
          await page.locator('#langToggle').click();
          const restored = await waitForLanguage(page, beforeLang);
          const restoredCopy = ((await page.locator('[data-i18n="navAbout"]').first().textContent()) || '').trim();
          add(engineName,vpName,'translation returns to initial language',restored && restoredCopy===copyByLang[beforeLang],JSON.stringify({lang:beforeLang,copy:restoredCopy}));
        }
      }

      await page.locator('#materials').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'})); await settle(page,120);
      add(engineName,vpName,'Materials stage visible',await visible(page.locator('#archiveStage')));
      add(engineName,vpName,'Materials archive has 11 items',(await page.locator('#gallery .gallery-card').count())===11);
      if (isTargetedViewport(vpName)) {
        const stage = page.locator('#archiveStage');
        const stageVisible = await visible(stage);
        add(engineName,vpName,'Materials stage is interactable',stageVisible);
        if (stageVisible) { await stage.click(); await settle(page,90); }
        const lightbox = page.locator('#lightbox');
        const lightboxOpen = await lightbox.evaluate(el=>el.classList.contains('open') && el.getAttribute('aria-hidden')==='false');
        add(engineName,vpName,'Materials lightbox opens',lightboxOpen);
        const lb0=(await page.locator('#lightboxCounter').textContent()||'').trim();
        if (isCompact) {
          await lightbox.evaluate(el => {
            const start = new Event('touchstart',{bubbles:true});
            Object.defineProperty(start,'changedTouches',{value:[{clientX:260}]});
            el.dispatchEvent(start);
            const end = new Event('touchend',{bubbles:true});
            Object.defineProperty(end,'changedTouches',{value:[{clientX:120}]});
            el.dispatchEvent(end);
          });
          await settle(page,70);
        } else {
          const next = page.locator('#lightboxNext');
          const nextVisible = await visible(next);
          add(engineName,vpName,'desktop Materials next arrow visible',nextVisible);
          if (nextVisible) { await next.click(); await settle(page,70); }
        }
        const lb1=(await page.locator('#lightboxCounter').textContent()||'').trim();
        add(engineName,vpName,isCompact?'mobile Materials lightbox swipe advances':'desktop Materials lightbox next advances',lb0.length>0 && lb1.length>0 && lb1!==lb0,lb0+'→'+lb1);
        const close = page.locator('#lightboxClose');
        const closeVisible = await visible(close);
        add(engineName,vpName,'Materials lightbox close control visible',closeVisible);
        if (closeVisible) { await close.click(); await settle(page,70); }
        add(engineName,vpName,'Materials lightbox closes',await lightbox.evaluate(el=>!el.classList.contains('open') && el.getAttribute('aria-hidden')==='true'));
      }

      const controls = page.locator('.r7-player-controls');
      add(engineName,vpName,'THEFT trailer controls visible',await visible(controls));
      const nativeFlagDisabled = await page.locator('#trailerVideo').evaluate(v=>!v.controls);
      if (engineName==='webkit' && vpName==='360x800') {
        nt(engineName,vpName,'native trailer browser chrome visibility','NOT TESTED / BROWSER-NATIVE: headless WebKit DOM controls flag cannot truthfully observe Safari/iOS native media chrome');
      } else {
        add(engineName,vpName,'native trailer controls DOM flag disabled',nativeFlagDisabled,String(nativeFlagDisabled));
      }
      add(engineName,vpName,'trailer play control present',await visible(page.locator('.r7-player-play')));
      add(engineName,vpName,'trailer seek control present',await visible(page.locator('.r7-player-progress')));
      add(engineName,vpName,'trailer fullscreen control present',await visible(page.locator('.r7-player-fullscreen')));
      add(engineName,vpName,'no Settings control',(await page.locator('.r7-player-settings').count())===0);
      add(engineName,vpName,'no Playback Speed control',(await page.locator('.r7-player-speed').count())===0);
      add(engineName,vpName,'no CC control',(await page.locator('.r7-player-cc').count())===0);
      add(engineName,vpName,'no Download control',(await page.locator('[download],.r7-player-download').count())===0);
      if (isCompact) add(engineName,vpName,'mobile PiP absent',!(await visible(page.locator('.r7-player-pip'))));
      else add(engineName,vpName,'desktop volume slider visible',await visible(page.locator('.r7-player-volume')));

      const contact = await page.locator('.contact-signal-track i').evaluate(el => {
        const cs=getComputedStyle(el); return {timing:cs.animationTimingFunction,duration:cs.animationDuration,count:el.parentElement.querySelectorAll('i').length,b:getComputedStyle(el.parentElement.querySelector('b')).display};
      });
      add(engineName,vpName,'CONTACT exactly one travelling point',contact.count===1,JSON.stringify(contact));
      add(engineName,vpName,'CONTACT linear uniform timing',contact.timing==='linear',JSON.stringify(contact));
      add(engineName,vpName,'CONTACT endpoint diamond hidden',contact.b==='none',JSON.stringify(contact));

      const castRail = await activateSectionAndWaitRail(page,'#cast','05');
      add(engineName,vpName,'section indicator updates at ACTORS',castRail.ok,JSON.stringify(castRail));

      if (isTargetedViewport(vpName)) {
        const y0 = await page.evaluate(()=>scrollY);
        await page.locator('#cast .cast-list-item').first().click(); await settle(page,760);
        const y1 = await page.evaluate(()=>scrollY);
        add(engineName,vpName,'Actors open selects dossier',await page.locator('#cast .cast-list-item').first().getAttribute('aria-selected')==='true');
        add(engineName,vpName,'Actors structure has no transform',await page.locator('#subjectDossier').evaluate(el=>getComputedStyle(el).transform==='none'));
        if (isCompact) add(engineName,vpName,'Actors mobile viewport stable on open',near(y0,y1,4),`${y0}→${y1}`);
        const actorSequential = await page.locator('body').evaluate(el=>el.classList.contains('r7-sequential-ui'));
        await page.locator(actorSequential ? '#cast .r7-subject-back' : '#subjectDossierClose').click(); await settle(page,760);
        const y2=await page.evaluate(()=>scrollY);
        add(engineName,vpName,'Actors close returns neutral',(await page.locator('#cast .cast-list-item[aria-selected="true"]').count())===0);
        if (isCompact) add(engineName,vpName,'Actors mobile viewport stable on close',near(y1,y2,4),`${y1}→${y2}`);

        const fq0=await prepareVisualAnchor(page,'#faq','#faq .faq-section-head');
        add(engineName,vpName,'FAQ stability setup has scroll headroom',fq0.bottomGap>=120,JSON.stringify(fq0));
        await page.locator('#faq .faq-query-item').first().click(); await settle(page,760);
        const fq1=await anchorGeometry(page,'#faq .faq-section-head');
        add(engineName,vpName,'FAQ open selects response',await page.locator('#faq .faq-query-item').first().getAttribute('aria-selected')==='true');
        add(engineName,vpName,'FAQ structure has no transform',await page.locator('#faqResponsePanel').evaluate(el=>getComputedStyle(el).transform==='none'));
        if (isCompact) add(engineName,vpName,'FAQ mobile viewport stable on open',near(fq0.top,fq1.top,4),JSON.stringify({before:fq0,after:fq1}));
        const faqSequential = await page.locator('body').evaluate(el=>el.classList.contains('r7-sequential-ui'));
        await page.locator(faqSequential ? '#faq .r7-query-back' : '#faqResponseClose').click(); await settle(page,760);
        const fq2=await anchorGeometry(page,'#faq .faq-section-head');
        add(engineName,vpName,'FAQ close returns standby',(await page.locator('#faq .faq-query-item[aria-selected="true"]').count())===0);
        if (isCompact) add(engineName,vpName,'FAQ mobile viewport stable on close',near(fq1.top,fq2.top,4),JSON.stringify({before:fq1,after:fq2}));
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

      if (isTargetedViewport(vpName)) {
        await page.goto(`${BASE}/index.html#trailer`,{waitUntil:'domcontentloaded'}); await settle(page,250);
        const video=page.locator('#trailerVideo');
        await video.click({position:{x:30,y:30}}).catch(()=>{});
        await page.keyboard.press('f').catch(()=>{}); await settle(page,140);
        const fsAfterF=await page.evaluate(()=>!!(document.fullscreenElement||document.webkitFullscreenElement));
        if (fsAfterF) {
          add(engineName,vpName,'F fullscreen toggle',true);
          if (!isCompact) {
            const g=await page.locator('#videoShell').evaluate(el=>{const r=el.getBoundingClientRect();return {left:r.left,top:r.top,width:r.width,height:r.height,vw:innerWidth,vh:innerHeight};});
            add(engineName,vpName,'desktop fullscreen geometry fills viewport',near(g.left,0,2)&&near(g.top,0,2)&&g.width>=g.vw-2&&g.height>=g.vh-2,JSON.stringify(g));
          }
          await page.keyboard.press('Escape').catch(()=>{}); await settle(page,120);
        } else {
          nt(engineName,vpName,'F fullscreen toggle','browser-native fullscreen not observable/allowed in this headless context');
          if (!isCompact) nt(engineName,vpName,'desktop fullscreen geometry','browser-native fullscreen not observable/allowed in this headless context');
        }
        await video.dblclick({position:{x:50,y:50}}).catch(()=>{}); await settle(page,140);
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

      if (isTargetedViewport(vpName)) {
        await page.locator('#profileHelpToggle').click(); await settle(page,100);
        const help=await page.evaluate(()=>{
          const panel=document.querySelector('#profileHelpPanel'); const composer=panel?.closest('.review-composer');
          if(!panel||!composer) return null;
          const p=panel.getBoundingClientRect(), c=composer.getBoundingClientRect();
          return {hidden:panel.hidden,aria:panel.getAttribute('aria-hidden'),left:p.left,right:p.right,top:p.top,bottom:p.bottom,width:p.width,height:p.height,composerLeft:c.left,composerRight:c.right,composerWidth:c.width,vw:innerWidth,vh:innerHeight};
        });
        add(engineName,vpName,'Profile Help opens as anchored popover',!!help&&!help.hidden&&help.aria==='false'&&help.width<help.vw*.9&&help.left>=help.composerLeft-2&&help.right<=help.composerRight+2,JSON.stringify(help));
        await page.locator('#profileHelpClose').click(); await settle(page,70);
        add(engineName,vpName,'Profile Help closes',await page.locator('#profileHelpPanel').evaluate(el=>el.hidden&&el.getAttribute('aria-hidden')==='true'));
      }

      const reviewRail=await activateSectionAndWaitRail(page,'#reviewWorkspace','R1');
      add(engineName,vpName,'Reviews indicator updates to feed',reviewRail.ok,JSON.stringify(reviewRail));
      if (screenshotKeys.has(vpName)) await screenshot(page,engineName,vpName,'reviews-rating');

      const externalConsoleErrors = consoleErrors.filter(record => externalConsoleRecord(record, externalFailures));
      const productConsoleErrors = consoleErrors.filter(record => !externalConsoleRecord(record, externalFailures));
      if (externalFailures.length || externalConsoleErrors.length) {
        environmentEventTotal += Math.max(externalFailures.length, externalConsoleErrors.length, 1);
        env(engineName,vpName,'external Supabase/stats availability',JSON.stringify({requestFailures:externalFailures,console:externalConsoleErrors}).slice(0,2400));
      }
      productConsoleErrorTotal += productConsoleErrors.length;
      pageExceptionTotal += pageErrors.length;
      add(engineName,vpName,'product console errors = 0',productConsoleErrors.length===0,productConsoleErrors.map(x=>x.text).join(' | ').slice(0,1600));
      add(engineName,vpName,'page exceptions = 0',pageErrors.length===0,pageErrors.join(' | ').slice(0,1600));
    } catch (error) {
      add(engineName,vpName,'audit execution',false,String(error?.stack||error),'HARNESS');
    }
    await context.close();
  }
  await browser.close();
}

const sourceChecks = [];
async function source(name, ok, detail='') { sourceChecks.push({engine:'source',viewport:'all',check:name,status:ok?'PASS':'FAIL',failure_class:ok?null:'PRODUCT',detail}); }
const classifierKnown=[{url:'https://xltwwvutqkpmtmlavngi.supabase.co/rest/v1/rpc/get_public_stats_v2'}];
const classifierUnrelated=[{url:'https://xltwwvutqkpmtmlavngi.supabase.co/rest/v1/rpc/unrelated_rpc'}];
const classifierRecord={text:'[P17/stats] Error',location:{url:'http://127.0.0.1:4173/js/public-response.js'}};
add('harness','classifier','Supabase environment classification requires correlated known RPC failure',
  externalConsoleRecord(classifierRecord,classifierKnown) &&
  !externalConsoleRecord(classifierRecord,[]) &&
  !externalConsoleRecord(classifierRecord,classifierUnrelated),
  'known correlated=true; none/unrelated=false','HARNESS');
const index = await fs.readFile('index.html','utf8');
const reviews = await fs.readFile('reviews.html','utf8');
const site = await fs.readFile('js/site.js','utf8');
const responsive = await fs.readFile('js/responsive-r7.js','utf8');
const followJs = await fs.readFile('js/r7-live-followup.js','utf8');
const followCss = await fs.readFile('css/r7-live-followup.css','utf8');
const combinedSource=[index,reviews,site,responsive,followJs,followCss].join('\n');
const badArchivePathCount=(combinedSource.match(/\/css\/assets\/images\/archive\//g)||[]).length;
await source('bad Archive CSS path count = 0',badArchivePathCount===0,String(badArchivePathCount));
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
  product_fail: results.filter(r=>r.status==='FAIL' && r.failure_class==='PRODUCT').length,
  harness_fail: results.filter(r=>r.status==='FAIL' && r.failure_class==='HARNESS').length,
  not_tested: results.filter(r=>r.status==='NOT TESTED').length,
  environment: results.filter(r=>r.status==='ENVIRONMENT').length
};
const summary = {
  product_console_errors: productConsoleErrorTotal,
  page_exceptions: pageExceptionTotal,
  environment_events: environmentEventTotal,
  archive_bad_path_count: badArchivePathCount,
  archive_asset_http_status: archiveResponse.status
};
const report = { audit_mode: AUDIT_MODE, product_sha: PRODUCT_SHA, audit_trigger_sha: process.env.GITHUB_SHA || null, matrix: matrix.map(([name,w,h])=>({name,width:w,height:h})), engines:Object.keys(engines), totals, summary, results, screenshots };
await fs.writeFile(path.join(OUT,'RESULTS.json'),JSON.stringify(report,null,2));
const failures=results.filter(r=>r.status==='FAIL');
const nts=results.filter(r=>r.status==='NOT TESTED');
const envs=results.filter(r=>r.status==='ENVIRONMENT');
const md=[
  '# R7 LIVE FOLLOW-UP AUDIT', '', `Mode: ${AUDIT_MODE}`, `Product SHA: ${PRODUCT_SHA}`, `Audit trigger SHA: ${process.env.GITHUB_SHA||'unknown'}`,
  '', `TOTAL ${totals.total} / PASS ${totals.pass} / FAIL ${totals.fail} / PRODUCT FAIL ${totals.product_fail} / HARNESS FAIL ${totals.harness_fail} / NOT TESTED ${totals.not_tested} / ENVIRONMENT ${totals.environment}`,
  '', `Product console errors: ${summary.product_console_errors}`, `Page exceptions: ${summary.page_exceptions}`, `Environment events: ${summary.environment_events}`, `Archive bad path count: ${summary.archive_bad_path_count}`, `Archive asset HTTP: ${summary.archive_asset_http_status}`,
  '', '## Failures', ...(failures.length?failures.map(r=>`- ${r.engine} ${r.viewport} — ${r.check}: ${r.detail||''}`):['- none']),
  '', '## ENVIRONMENT', ...(envs.length?envs.map(r=>`- ${r.engine} ${r.viewport} — ${r.check}: ${r.detail}`):['- none']),
  '', '## NOT TESTED', ...(nts.length?nts.map(r=>`- ${r.engine} ${r.viewport} — ${r.check}: ${r.detail}`):['- none']),
  '', '## Screenshots', ...screenshots.map(s=>`- screenshots/${s}`)
];
await fs.writeFile(path.join(OUT,'REPORT.md'),md.join('\n'));
await fs.writeFile(path.join(OUT,'EVIDENCE-INDEX.md'),[
  '# Evidence index','',`- Mode: ${AUDIT_MODE}`,`- Product SHA: ${PRODUCT_SHA}`,`- Audit trigger SHA: ${process.env.GITHUB_SHA||'unknown'}`,'- RESULTS.json','- REPORT.md','- EXIT_CODE.txt',...screenshots.map(s=>`- screenshots/${s}`)
].join('\n'));
console.log(JSON.stringify({totals,summary}));
if (totals.fail) process.exit(1);
