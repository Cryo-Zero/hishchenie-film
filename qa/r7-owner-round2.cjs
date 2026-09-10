const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({headless:true});
  const out = path.join(process.cwd(), 'r7-owner-round2-evidence');
  fs.mkdirSync(path.join(out,'screenshots'), {recursive:true});
  const results=[];
  const check=(name,ok,detail='')=>results.push({name,ok:Boolean(ok),detail});

  const context = await browser.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true });
  const page = await context.newPage();
  const errors=[];
  page.on('pageerror', e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:4173/index.html', {waitUntil:'networkidle'});

  const display = sel => page.locator(sel).evaluate(el=>getComputedStyle(el).display);
  check('mobile hero system strip hidden', (await display('.hero-system-strip'))==='none');
  check('mobile hero eyebrow hidden', (await display('.hero-copy-column > .eyebrow'))==='none');
  check('mobile hero slogan hidden', (await display('.hero-copy-column > .mobile-slogan'))==='none');
  const title=await page.locator('.r7-mobile-hero-title').boundingBox();
  const poster=await page.locator('.hero-poster-frame').boundingBox();
  const actions=await page.locator('.r7-mobile-hero-actions').boundingBox();
  const synopsis=await page.locator('.hero-copy-column .hero-copy').boundingBox();
  check('mobile title above poster', title && poster && title.y+title.height <= poster.y+2, JSON.stringify({title,poster}));
  check('mobile actions below poster', poster && actions && actions.y >= poster.y+poster.height-24, JSON.stringify({poster,actions}));
  check('mobile synopsis below poster/actions', actions && synopsis && synopsis.y > actions.y+actions.height+20, JSON.stringify({actions,synopsis}));
  check('trailer language note hidden globally', (await display('.trailer-language-note'))==='none');
  await page.screenshot({path:path.join(out,'screenshots','390-hero-round2.png'), fullPage:false});

  await page.locator('#materials').scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  const shellPosition=await page.locator('#materials .archive-drawer-shell').evaluate(el=>getComputedStyle(el).position);
  const handleBox=await page.locator('#archiveDrawerToggle').boundingBox();
  check('archive shell anchored to section', shellPosition==='absolute', shellPosition);
  check('mobile archive handle compact', handleBox && handleBox.height <= 82, JSON.stringify(handleBox));
  await page.locator('#archiveDrawerToggle').click();
  await page.waitForTimeout(100);
  const handleLeftOpen=await page.locator('#archiveDrawerToggle').evaluate(el=>getComputedStyle(el).left);
  check('archive handle does not slide when open', parseFloat(handleLeftOpen)===0, handleLeftOpen);
  await page.screenshot({path:path.join(out,'screenshots','390-materials-round2.png'), fullPage:false});

  await page.locator('#cast').scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  await page.evaluate(()=>scrollBy(0,80));
  const castY=await page.evaluate(()=>scrollY);
  await page.locator('#cast .cast-list-item').nth(2).click();
  await page.waitForTimeout(250);
  const castAfter=await page.evaluate(()=>scrollY);
  check('Actors click does not move viewport', Math.abs(castAfter-castY)<=2, `${castY} -> ${castAfter}`);

  await page.locator('#faq').scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  await page.evaluate(()=>scrollBy(0,120));
  const faqY=await page.evaluate(()=>scrollY);
  await page.locator('#faq .faq-query-item').last().click();
  await page.waitForTimeout(250);
  const faqAfter=await page.evaluate(()=>scrollY);
  check('FAQ click does not move viewport', Math.abs(faqAfter-faqY)<=2, `${faqY} -> ${faqAfter}`);
  await page.screenshot({path:path.join(out,'screenshots','390-faq-no-scroll.png'), fullPage:false});

  await page.goto('http://127.0.0.1:4173/reviews.html', {waitUntil:'networkidle'});
  await page.waitForTimeout(1800);
  const ring=await page.locator('#freshnessRing').boundingBox();
  check('freshness ring is circular', ring && Math.abs(ring.width-ring.height)<1.5, JSON.stringify(ring));
  const avgFont=parseFloat(await page.locator('#averageRating').evaluate(el=>getComputedStyle(el).fontSize));
  check('average value is legible', avgFont>=22, `${avgFont}px`);
  const headerOrder=await page.evaluate(()=>{
    const ring=document.querySelector('.header-rating-ring').getBoundingClientRect();
    const copy=document.querySelector('.header-rating-copy').getBoundingClientRect();
    return {ringLeft:ring.left,ringRight:ring.right,copyLeft:copy.left};
  });
  check('header score is right of ring', headerOrder.copyLeft >= headerOrder.ringRight-1, JSON.stringify(headerOrder));

  await page.locator('#profileHelpToggle').scrollIntoViewIfNeeded();
  const helpScroll=await page.evaluate(()=>scrollY);
  await page.locator('#profileHelpToggle').click();
  await page.waitForTimeout(120);
  const helpAfter=await page.evaluate(()=>scrollY);
  const tooltip=await page.locator('#profileHelpPanel').boundingBox();
  const q=await page.locator('#profileHelpToggle').boundingBox();
  check('profile help does not move page', Math.abs(helpAfter-helpScroll)<=2, `${helpScroll} -> ${helpAfter}`);
  check('profile help is anchored near question mark', tooltip && q && Math.abs((tooltip.x+tooltip.width)- (q.x+q.width)) < 80 && tooltip.y >= q.y, JSON.stringify({tooltip,q}));
  check('profile help does not lock body scroll', !(await page.locator('body').evaluate(el=>el.classList.contains('info-overlay-open'))));
  await page.screenshot({path:path.join(out,'screenshots','390-profile-tooltip.png'), fullPage:false});
  await page.locator('#profileHelpClose').click();

  await page.locator('#reviewsList').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const cards=page.locator('#reviewsList > .review-card');
  const total=await cards.count();
  const visibleBefore=await cards.evaluateAll(nodes=>nodes.filter(n=>getComputedStyle(n).display!=='none').length);
  const moreVisible=await page.locator('.r7-load-more-reviews').evaluate(el=>getComputedStyle(el).display!=='none');
  check('mobile feed initially capped when many reviews', total<=6 || visibleBefore===6, `${visibleBefore}/${total}`);
  check('show more appears only when needed', (total<=6 && !moreVisible) || (total>6 && moreVisible), `${moreVisible}/${total}`);
  if(total>6){
    await page.locator('.r7-load-more-reviews').click();
    await page.waitForTimeout(80);
    const visibleAfter=await cards.evaluateAll(nodes=>nodes.filter(n=>getComputedStyle(n).display!=='none').length);
    check('show more reveals next batch', visibleAfter>visibleBefore, `${visibleBefore} -> ${visibleAfter}`);
  }
  const reviewBodyFont = total ? parseFloat(await cards.first().locator('.review-card-text').evaluate(el=>getComputedStyle(el).fontSize)) : 14;
  check('mobile review body typography >=14px', reviewBodyFont>=14, `${reviewBodyFont}px`);
  await page.screenshot({path:path.join(out,'screenshots','390-reviews-round2.png'), fullPage:false});
  check('no phone JS errors', errors.length===0, errors.join('\n'));

  const desktop = await browser.newPage({viewport:{width:1366,height:768}});
  await desktop.goto('http://127.0.0.1:4173/index.html', {waitUntil:'networkidle'});
  check('desktop trailer note hidden', (await desktop.locator('.trailer-language-note').evaluate(el=>getComputedStyle(el).display))==='none');
  const dShell=await desktop.locator('#materials .archive-drawer-shell').evaluate(el=>getComputedStyle(el).position);
  check('desktop archive anchored to section', dShell==='absolute', dShell);
  const castCodeFont=parseFloat(await desktop.locator('#cast .cast-list-item').first().locator('span').evaluate(el=>getComputedStyle(el).fontSize));
  check('desktop subject microcopy >=10px', castCodeFont>=10, `${castCodeFont}px`);
  await desktop.close();

  await browser.close();
  const passed=results.filter(r=>r.ok).length;
  const report=['# R7 owner round2 QA','',`Passed: ${passed}/${results.length}`,'',...results.map(r=>`- ${r.ok?'PASS':'FAIL'} — ${r.name}${r.detail?` — ${r.detail}`:''}`)].join('\n');
  fs.writeFileSync(path.join(out,'REPORT.md'),report);
  console.log(report);
  if(passed!==results.length) process.exit(1);
})().catch(err=>{console.error(err);process.exit(1)});
