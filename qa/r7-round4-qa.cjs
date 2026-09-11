const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = process.env.R7_OUT || '/tmp/r7-round4-evidence';
const BASE = process.env.R7_BASE || 'http://127.0.0.1:4183';
const BEFORE = process.env.R7_BEFORE || 'http://127.0.0.1:4182';
const EXACT_SHA = process.env.R7_EXACT_SHA || '';
fs.mkdirSync(path.join(OUT,'screenshots'), {recursive:true});

const results=[];
const check=(name,ok,detail='')=>results.push({name,ok:!!ok,detail:String(detail||'')});
const vps=[
  {name:'390x844',w:390,h:844,mobile:true},
  {name:'430x932',w:430,h:932,mobile:true},
  {name:'844x390',w:844,h:390,mobile:true},
  {name:'932x430',w:932,h:430,mobile:true},
  {name:'768x1024',w:768,h:1024,mobile:true},
  {name:'1024x768',w:1024,h:768,mobile:false},
  {name:'1366x768',w:1366,h:768,mobile:false},
];
const smartNames=new Set(['390x844','430x932','844x390','932x430']);
const compactNames=new Set(['390x844','430x932','844x390','932x430','768x1024']);

let browser;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function contextFor(vp, reduced=false){
  const ctx=await browser.newContext({
    viewport:{width:vp.w,height:vp.h},
    isMobile:vp.mobile,
    hasTouch:vp.mobile,
    reducedMotion:reduced?'reduce':'no-preference',
  });
  await ctx.route('https://xltwwvutqkpmtmlavngi.supabase.co/**', route => route.abort('blockedbyclient'));
  return ctx;
}
async function go(page,url){
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(850);
}
async function overflow(page){
  return page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
}

async function compareDesktopGeometry(){
  const vp=vps.find(v=>v.name==='1366x768');
  const sels=['.hero-poster-frame','#materials .archive-stage-wrap','#cast .cast-console','#faq .faq-console'];
  async function take(base){
    const ctx=await contextFor(vp); const p=await ctx.newPage(); await go(p,base+'/index.html');
    const o={};
    for(const sel of sels){
      o[sel]=await p.locator(sel).evaluate(e=>{const r=e.getBoundingClientRect();return{x:r.x,w:r.width,h:r.height}});
    }
    await ctx.close(); return o;
  }
  const before=await take(BEFORE), after=await take(BASE);
  for(const sel of sels){
    const b=before[sel],a=after[sel];
    const d=Math.max(Math.abs(b.x-a.x),Math.abs(b.w-a.w),Math.abs(b.h-a.h));
    check(`1366 desktop ${sel} geometry preserved`,d<=1,JSON.stringify({before:b,after:a,maxDelta:d}));
  }
}

async function testContact(vp){
  const ctx=await contextFor(vp); const p=await ctx.newPage(); await go(p,BASE+'/index.html#contacts');
  await p.locator('#contacts').scrollIntoViewIfNeeded(); await sleep(120);
  const xs=[], diamonds=[], cards=[];
  for(let i=0;i<10;i++){
    const m=await p.evaluate(()=>{
      const dot=document.querySelector('.contact-signal-track i').getBoundingClientRect();
      const dia=document.querySelector('.contact-signal-track b').getBoundingClientRect();
      const card=document.querySelector('.contact-signal').getBoundingClientRect();
      return {x:dot.x,diamond:dia.x,card:[card.x,card.y,card.width,card.height]};
    });
    xs.push(m.x);diamonds.push(m.diamond);cards.push(m.card);await sleep(240);
  }
  const range=Math.max(...xs)-Math.min(...xs);
  const steps=xs.slice(1).map((x,i)=>Math.abs(x-xs[i]));
  check(`${vp.name} contact local X motion`,range>=1.5&&range<=10.5,`range=${range.toFixed(2)} xs=${xs.map(x=>x.toFixed(2)).join(',')}`);
  check(`${vp.name} contact no teleport`,Math.max(...steps)<=3.5,`maxStep=${Math.max(...steps).toFixed(2)}`);
  check(`${vp.name} contact diamond static`,Math.max(...diamonds)-Math.min(...diamonds)<=.2,diamonds.join(','));
  const cw=cards.map(v=>v[2]),cx=cards.map(v=>v[0]);
  check(`${vp.name} contact no layout shift`,Math.max(...cw)-Math.min(...cw)<=.3&&Math.max(...cx)-Math.min(...cx)<=.3,JSON.stringify(cards));
  if(vp.name==='390x844'||vp.name==='1366x768')
    await p.locator('.contact-signal').screenshot({path:path.join(OUT,'screenshots',`contact-${vp.name}.png`)});
  await ctx.close();

  const rctx=await contextFor(vp,true); const rp=await rctx.newPage(); await go(rp,BASE+'/index.html#contacts');
  const a=await rp.locator('.contact-signal-track i').evaluate(e=>({x:e.getBoundingClientRect().x,anim:getComputedStyle(e).animationName,transform:getComputedStyle(e).transform}));
  await sleep(500);
  const x2=await rp.locator('.contact-signal-track i').evaluate(e=>e.getBoundingClientRect().x);
  check(`${vp.name} contact reduced-motion no X motion`,Math.abs(a.x-x2)<=.2&&a.anim==='none',JSON.stringify({...a,x2}));
  await rctx.close();
}

async function testActors(vp){
  if(!compactNames.has(vp.name)) return;
  const ctx=await contextFor(vp); const p=await ctx.newPage(); await go(p,BASE+'/index.html#cast');
  await p.locator('#cast').scrollIntoViewIfNeeded(); await sleep(100);
  const first=p.locator('#cast .cast-list-item').first();
  const y0=await p.evaluate(()=>scrollY);
  await first.click(); await sleep(180);
  const prompt=p.locator('#dossierPrompt');
  const semantics=await prompt.evaluate(e=>({role:e.getAttribute('role'),tab:e.getAttribute('tabindex'),text:e.textContent.trim(),min:getComputedStyle(e).minHeight}));
  check(`${vp.name} actor prompt interactive`,semantics.role==='button'&&semantics.tab==='0'&&parseFloat(semantics.min)>=44,JSON.stringify(semantics));
  const y1=await p.evaluate(()=>scrollY);
  check(`${vp.name} actor open no auto-scroll`,Math.abs(y1-y0)<=2,`${y0}->${y1}`);
  await prompt.click(); await sleep(140);
  const y2=await p.evaluate(()=>scrollY);
  check(`${vp.name} actor prompt same return state`,!(await p.locator('#cast').evaluate(e=>e.classList.contains('r7-dossier-open'))),`scroll=${y1}->${y2}`);
  check(`${vp.name} actor prompt return no scroll`,Math.abs(y2-y1)<=2,`${y1}->${y2}`);
  await first.click(); await sleep(120);
  await prompt.focus(); await prompt.press('Enter'); await sleep(120);
  check(`${vp.name} actor keyboard Enter returns`,!(await p.locator('#cast').evaluate(e=>e.classList.contains('r7-dossier-open'))));
  await first.click(); await sleep(100);
  await p.locator('#langToggle').click(); await sleep(120);
  const en=await prompt.textContent();
  check(`${vp.name} actor prompt EN works`,/SELECT ANOTHER SUBJECT/i.test(en),en);
  if(vp.name==='390x844') await p.locator('#subjectDossier').screenshot({path:path.join(OUT,'screenshots','actors-prompt-390x844.png')});
  await ctx.close();
}

async function testSignal(vp){
  const ctx=await contextFor(vp); const p=await ctx.newPage(); await go(p,BASE+'/index.html#watch');
  const ru=await p.locator('.signal-log-row').evaluateAll(rows=>rows.map(r=>[...r.children].map(x=>x.textContent.trim())));
  const flat=ru.flat().join('|');
  check(`${vp.name} signal semantic RU tokens`,JSON.stringify(ru)===JSON.stringify([
    ['SIGNAL_03','Трейлер доступен','ONLINE'],
    ['ARCHIVE','Публичный архив открыт','OPEN'],
    ['RELEASE','Релиз ожидает подтверждения','PENDING']
  ]),JSON.stringify(ru));
  check(`${vp.name} signal no fake time/NOW RU`,!flat.includes('14:20')&&!flat.includes('СЕЙЧАС'),flat);
  await p.locator('#langToggle').click(); await sleep(120);
  const en=await p.locator('.signal-log-row').evaluateAll(rows=>rows.map(r=>[...r.children].map(x=>x.textContent.trim())));
  check(`${vp.name} signal EN semantic states`,en[0][0]==='SIGNAL_03'&&en[0][2]==='ONLINE'&&en[1][0]==='ARCHIVE'&&en[1][2]==='OPEN'&&en[2][0]==='RELEASE'&&en[2][2]==='PENDING',JSON.stringify(en));
  check(`${vp.name} signal EN centers meaningful`,en.every(r=>r[1]&&!/NOW|14:20/.test(r[1])),JSON.stringify(en));
  const sizes=await p.locator('.signal-log-row').first().evaluate(r=>[...r.children].map(x=>getComputedStyle(x).fontSize));
  check(`${vp.name} signal typography readable`,sizes.every(x=>parseFloat(x)>=9),sizes.join(','));
  if(vp.name==='390x844'||vp.name==='1366x768') await p.locator('.current-signal').screenshot({path:path.join(OUT,'screenshots',`current-signal-${vp.name}.png`)});
  await ctx.close();
}

async function testMaterials(vp){
  const ctx=await contextFor(vp); const p=await ctx.newPage(); await go(p,BASE+'/index.html#materials');
  await p.locator('#materials').scrollIntoViewIfNeeded(); await sleep(150);
  const compact=compactNames.has(vp.name);
  const disp=await p.evaluate(()=>({
    old:getComputedStyle(document.querySelector('#archiveDrawerToggle')).display,
    mobile:getComputedStyle(document.querySelector('#r7MobileArchiveToggle')).display,
    text:document.querySelector('#r7MobileArchiveToggle').textContent.trim()
  }));
  if(compact){
    check(`${vp.name} vertical archive handle gone`,disp.old==='none',JSON.stringify(disp));
    check(`${vp.name} horizontal ARCHIVE // 11 visible`,disp.mobile!=='none'&&disp.text==='ARCHIVE // 11',JSON.stringify(disp));
    const heights=[],fits=[],ratios=[];
    for(let i=0;i<11;i++){
      await p.waitForFunction(()=>{const im=document.querySelector('#archiveMainImage');return im&&im.complete&&im.naturalWidth>0;});
      const s=await p.evaluate(()=>{const st=document.querySelector('#archiveStage'),im=document.querySelector('#archiveMainImage');return{h:st.getBoundingClientRect().height,fit:getComputedStyle(im).objectFit,r:im.naturalWidth/im.naturalHeight}});
      heights.push(s.h);fits.push(s.fit);ratios.push(s.r);
      if(i<10){await p.locator('#galleryNext').click({force:true});await sleep(90);}
    }
    const delta=Math.max(...heights)-Math.min(...heights);
    check(`${vp.name} all 11 Materials stage heights stable`,delta<=1,`delta=${delta.toFixed(2)} heights=${heights.map(x=>x.toFixed(1)).join(',')}`);
    check(`${vp.name} all 11 images contained`,fits.every(x=>x==='contain'),[...new Set(fits)].join(','));
    check(`${vp.name} mixed source ratios actually tested`,Math.max(...ratios)-Math.min(...ratios)>.3,ratios.map(x=>x.toFixed(3)).join(','));
    await p.locator('#r7MobileArchiveToggle').click(); await sleep(150);
    const drawer=await p.evaluate(()=>{
      const d=document.querySelector('#archiveDrawer'),g=document.querySelector('#gallery'),c=document.querySelector('#archiveDrawerClose');
      const r=d.getBoundingClientRect(),cr=c.getBoundingClientRect();
      return{open:d.classList.contains('is-open'),w:r.width,h:r.height,overflow:getComputedStyle(g).overflowY,scroll:g.scrollHeight,client:g.clientHeight,close:cr.top>=r.top-1&&cr.bottom<=r.bottom+1,count:g.querySelectorAll('.gallery-card').length};
    });
    check(`${vp.name} Archive drawer opens from horizontal control`,drawer.open&&drawer.count===11,JSON.stringify(drawer));
    check(`${vp.name} Archive thumbnails internally usable`,['auto','scroll'].includes(drawer.overflow)&&drawer.scroll>=drawer.client&&drawer.close,JSON.stringify(drawer));
    check(`${vp.name} Archive drawer remains compact`,drawer.w<=vp.w*.78+2&&drawer.h<=vp.h*.61+2,JSON.stringify(drawer));
    if(vp.name==='430x932'||vp.name==='844x390'||vp.name==='932x430')
      await p.screenshot({path:path.join(OUT,'screenshots',`materials-${vp.name}.png`),fullPage:false});
  }else{
    check(`${vp.name} desktop/tablet-landscape wall handle preserved`,disp.old!=='none'&&disp.mobile==='none',JSON.stringify(disp));
  }
  check(`${vp.name} materials horizontal overflow=0`,Math.abs(await overflow(p))<=1,String(await overflow(p)));
  await ctx.close();
}

async function testFreshnessAndProfile(vp){
  const ctx=await contextFor(vp); const p=await ctx.newPage(); await go(p,BASE+'/reviews.html');
  for(const state of [
    {v:'7%',s:'СВЕЖИЙ'},{v:'64%',s:'СВЕЖИЙ'},{v:'100%',s:'ВЫБОР ЗРИТЕЛЕЙ'},{v:'—',s:'НЕДОСТАТОЧНО ОЦЕНОК'}
  ]){
    const m=await p.evaluate(state=>{
      const ring=document.querySelector('#freshnessRing'),strong=document.querySelector('#freshnessValue'),span=document.querySelector('#freshnessState');
      strong.textContent=state.v;span.textContent=state.s;
      const rr=ring.getBoundingClientRect(),a=strong.getBoundingClientRect(),b=span.getBoundingClientRect();
      const u={left:Math.min(a.left,b.left),right:Math.max(a.right,b.right),top:Math.min(a.top,b.top),bottom:Math.max(a.bottom,b.bottom)};
      return{rw:rr.width,rh:rr.height,dx:(u.left+u.right)/2-(rr.left+rr.right)/2,dy:(u.top+u.bottom)/2-(rr.top+rr.bottom)/2};
    },state);
    check(`${vp.name} freshness ${state.v} centered`,Math.abs(m.rw-m.rh)<=.5&&Math.abs(m.dx)<=1.5&&Math.abs(m.dy)<=1.5,JSON.stringify(m));
  }
  const toggle=p.locator('#profileHelpToggle');
  const rest=await toggle.evaluate(e=>({border:getComputedStyle(e).borderColor,bg:getComputedStyle(e).backgroundColor}));
  const y0=await p.evaluate(()=>scrollY);
  await toggle.click(); await sleep(160);
  const open=await toggle.evaluate(e=>({aria:e.getAttribute('aria-expanded'),border:getComputedStyle(e).borderColor,bg:getComputedStyle(e).backgroundColor}));
  const card=await p.locator('#profileHelpPanel .info-overlay-card').evaluate(e=>({bg:getComputedStyle(e).backgroundColor,blur:getComputedStyle(e).backdropFilter}));
  const y1=await p.evaluate(()=>scrollY), bodyOv=await p.locator('body').evaluate(e=>getComputedStyle(e).overflowY);
  check(`${vp.name} profile ? active state`,open.aria==='true'&&(open.border!==rest.border||open.bg!==rest.bg),JSON.stringify({rest,open}));
  const alpha=Number((card.bg.match(/rgba?\([^,]+,[^,]+,[^,]+(?:,\s*([0-9.]+))?\)/)||[])[1]||1);
  check(`${vp.name} profile popover lighter/translucent`,alpha<.9&&/blur/.test(card.blur),JSON.stringify(card));
  check(`${vp.name} profile popover no page move/lock`,Math.abs(y1-y0)<=2&&bodyOv!=='hidden',`${y0}->${y1}; overflowY=${bodyOv}`);
  await p.locator('#profileHelpClose').click(); await sleep(80);
  const closed=await toggle.getAttribute('aria-expanded');
  check(`${vp.name} profile ? returns to rest`,closed==='false');
  if(vp.name==='390x844'){
    await toggle.click();await sleep(100);await p.locator('.review-composer').screenshot({path:path.join(OUT,'screenshots','profile-help-390x844.png')});
  }
  await ctx.close();
}

async function testReviewsControls(vp){
  const ctx=await contextFor(vp); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await go(p,BASE+'/reviews.html#reviewWorkspace');
  await p.evaluate(()=>{
    const l=document.querySelector('#reviewsList');l.innerHTML='';
    for(let i=0;i<14;i++){const a=document.createElement('article');a.className='review-card';a.innerHTML=`<div class="review-card-text">QA REVIEW ${i+1}</div><div class="review-replies"><div class="review-reply"><p>reply ${i+1}</p></div></div>`;l.appendChild(a);}
  });
  await sleep(180);
  const compact=compactNames.has(vp.name);
  if(compact){
    const more=p.locator('.r7-load-more-reviews');
    const n0=await p.locator('#reviewsList > .review-card').evaluateAll(ns=>ns.filter(n=>getComputedStyle(n).display!=='none').length);
    check(`${vp.name} Show More initial 6`,n0===6,String(n0));
    await more.click();await sleep(70);
    const n1=await p.locator('#reviewsList > .review-card').evaluateAll(ns=>ns.filter(n=>getComputedStyle(n).display!=='none').length);
    check(`${vp.name} Show More expands by 6`,n1===12,String(n1));
    const dock=p.locator('#reviewControlsDock');
    await dock.scrollIntoViewIfNeeded(); await sleep(100);
    await p.evaluate(()=>scrollBy(0,420));await sleep(320);
    const d=await dock.evaluate(e=>{const r=e.getBoundingClientRect(),cs=getComputedStyle(e);return{pos:cs.position,top:r.top,h:r.height,display:cs.display};});
    check(`${vp.name} review controls follow feed`,d.pos==='sticky'&&d.top>=-1&&d.top<100,JSON.stringify(d));
    check(`${vp.name} review control dock not giant`,d.h<=Math.min(245,vp.h*.48),JSON.stringify(d));
    check(`${vp.name} review sort/toggle usable`,await p.locator('.review-sort-button').first().isVisible()&&await p.locator('#profanityFilterToggle').isVisible());
    check(`${vp.name} profanity explanation absent`,await p.locator('[data-i18n="profanityFilterHint"]').count()===0);
    if(vp.name==='390x844'||vp.name==='844x390') await p.screenshot({path:path.join(OUT,'screenshots',`reviews-dock-${vp.name}.png`),fullPage:false});
  }
  check(`${vp.name} reviews overflow=0`,Math.abs(await overflow(p))<=1,String(await overflow(p)));
  check(`${vp.name} reviews JS errors=0`,errs.length===0,errs.join(' | '));
  await ctx.close();
}

async function testSmartHeader(vp){
  if(!smartNames.has(vp.name)) return;
  const ctx=await contextFor(vp); const p=await ctx.newPage(); await go(p,BASE+'/index.html');
  const atTop=await p.evaluate(()=>({smart:document.body.classList.contains('r7-smart-header'),hidden:document.body.classList.contains('r7-header-hidden')}));
  check(`${vp.name} smart header visible at top`,atTop.smart&&!atTop.hidden,JSON.stringify(atTop));
  await p.evaluate(()=>scrollTo(0,260));await sleep(360);
  const down=await p.evaluate(()=>({hidden:document.body.classList.contains('r7-header-hidden'),transform:getComputedStyle(document.querySelector('.site-header')).transform}));
  check(`${vp.name} scroll down hides header`,down.hidden&&down.transform!=='none',JSON.stringify(down));
  await p.evaluate(()=>scrollBy(0,-60));await sleep(300);
  check(`${vp.name} scroll up reveals header`,!(await p.locator('body').evaluate(e=>e.classList.contains('r7-header-hidden'))));
  const before=await p.locator('body').evaluate(e=>e.classList.contains('r7-header-hidden'));
  await p.evaluate(()=>scrollBy(0,1));await sleep(120);
  const after=await p.locator('body').evaluate(e=>e.classList.contains('r7-header-hidden'));
  check(`${vp.name} 1px scroll no jitter`,before===after,`${before}->${after}`);
  await p.locator('#menuToggle').click();await sleep(80);
  await p.evaluate(()=>scrollBy(0,180));await sleep(260);
  const burger=await p.evaluate(()=>({open:document.body.classList.contains('nav-open'),hidden:document.body.classList.contains('r7-header-hidden')}));
  check(`${vp.name} burger open keeps header visible`,burger.open&&!burger.hidden,JSON.stringify(burger));
  await p.locator('#menuToggle').click();await sleep(80);
  if(vp.name==='390x844'){
    await sleep(1250);
    await p.evaluate(()=>scrollTo(0,260));await sleep(340);
    await p.screenshot({path:path.join(OUT,'screenshots','header-hidden-390x844.png'),fullPage:false});
    await p.setViewportSize({width:844,height:390}); await sleep(220);
    check('390→844 rotation reveals header',!(await p.locator('body').evaluate(e=>e.classList.contains('r7-header-hidden'))));
  }
  await ctx.close();

  const rctx=await contextFor(vp,true);const rp=await rctx.newPage();await go(rp,BASE+'/index.html');
  const dur=await rp.locator('.site-header').evaluate(e=>getComputedStyle(e).transitionDuration);
  check(`${vp.name} smart header reduced-motion minimal transition`,dur.split(',').every(x=>parseFloat(x)<=.02),dur);
  await rctx.close();
}

async function main(){
  browser=await chromium.launch({headless:true});
  if(EXACT_SHA) fs.writeFileSync(path.join(OUT,'FINAL_SHA.txt'),EXACT_SHA+'\n');

  await compareDesktopGeometry();

  for(const vp of vps){
    const c=await contextFor(vp); const p=await c.newPage(); const errs=[];p.on('pageerror',e=>errs.push(String(e)));
    await go(p,BASE+'/index.html');
    check(`${vp.name} index horizontal overflow=0`,Math.abs(await overflow(p))<=1,String(await overflow(p)));
    check(`${vp.name} index JS errors=0`,errs.length===0,errs.join(' | '));
    const synopsis=await p.locator('.hero-copy-column .hero-copy').textContent();
    check(`${vp.name} Hero synopsis preserved`,synopsis.trim()==='В мире, где человек должен доказать свою пользу системе, взросление становится борьбой за право самому выбирать своё будущее.',synopsis.trim());
    await c.close();

    await testSignal(vp);
    await testMaterials(vp);
    await testReviewsControls(vp);

    if(vp.name==='390x844'||vp.name==='1366x768') await testContact(vp);
    if(vp.name==='390x844'||vp.name==='768x1024') await testActors(vp);
    if(vp.name==='390x844'||vp.name==='1366x768') await testFreshnessAndProfile(vp);
    await testSmartHeader(vp);
  }

  const failures=results.filter(r=>!r.ok);
  const lines=[
    '# REVIVAL R7 — Owner Feedback Round 4 browser QA',
    '',
    `Exact tested SHA: ${EXACT_SHA || 'WORKTREE PRE-COMMIT'}`,
    `Checks: ${results.length} / Passed: ${results.length-failures.length} / Failed: ${failures.length}`,
    '',
    ...results.map(r=>`- ${r.ok?'PASS':'FAIL'} — ${r.name}${r.detail?' — '+r.detail:''}`)
  ];
  fs.writeFileSync(path.join(OUT,'REPORT.md'),lines.join('\n'));
  fs.writeFileSync(path.join(OUT,'RESULTS.json'),JSON.stringify(results,null,2));
  console.log(lines.join('\n'));
  await browser.close();
  if(failures.length) process.exit(1);
}
main().catch(async e=>{console.error(e);try{await browser?.close()}catch{};process.exit(1)});
