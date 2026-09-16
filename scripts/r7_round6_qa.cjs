const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const TARGET = process.env.TARGET_URL;
const BASELINE = process.env.BASELINE_URL;
const OUT = process.env.EVIDENCE_DIR;
fs.mkdirSync(OUT,{recursive:true});
const viewports=[
  {name:'390x844',w:390,h:844,touch:true,phone:true},
  {name:'430x932',w:430,h:932,touch:true,phone:true},
  {name:'844x390',w:844,h:390,touch:true,phone:true},
  {name:'932x430',w:932,h:430,touch:true,phone:true},
  {name:'768x1024',w:768,h:1024,touch:true,phone:false},
  {name:'1024x768',w:1024,h:768,touch:true,phone:false},
  {name:'1366x768',w:1366,h:768,touch:false,phone:false},
];
let passed=0; const failures=[]; const checks=[];
function check(cond,name,detail=''){checks.push({ok:Boolean(cond),name,detail});if(cond)passed++;else failures.push({name,detail});}
const parseTime=s=>Math.max(...String(s).split(',').map(v=>{v=v.trim();return parseFloat(v)*(v.endsWith('ms')?.001:1)}),0);
const browser=await chromium.launch({headless:true});
async function contextFor(v,reducedMotion='no-preference'){
  const ctx=await browser.newContext({viewport:{width:v.w,height:v.h},hasTouch:v.touch,isMobile:v.phone,reducedMotion});
  await ctx.route('**/*.mp4',r=>r.fulfill({status:204,contentType:'video/mp4',body:''}));
  await ctx.route(/https:\/\/[^/]*\.supabase\.co\/.*/,r=>r.abort());
  return ctx;
}
async function open(ctx,url){const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(url,{waitUntil:'domcontentloaded',timeout:15000});await p.waitForTimeout(180);return {p,errors};}
async function swipe(locator){await locator.evaluate(node=>{const emit=(type,x)=>{const e=new Event(type,{bubbles:true,cancelable:true});Object.defineProperty(e,'changedTouches',{value:[{clientX:x,clientY:120}]});node.dispatchEvent(e)};emit('touchstart',310);emit('touchend',90);});}
async function geometry(url){const v=viewports.at(-1);const ctx=await contextFor(v);const {p}=await open(ctx,url+'/index.html');const sels=['.hero-poster-frame','#about .story','#materials .archive-stage','#trailer .video-shell','#cast .cast-console','#faq .faq-console'];const out={};for(const s of sels)out[s]=await p.locator(s).evaluate(el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}});await ctx.close();return out;}

for(const v of viewports){
  const ctx=await contextFor(v); const {p,errors}=await open(ctx,TARGET+'/index.html?round6='+v.name); const tag='['+v.name+']';
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth); check(Math.abs(overflow)<=1,tag+' index horizontal overflow = 0',String(overflow));

  let audio=await p.locator('#trailerVideo').evaluate(v=>({autoplay:v.autoplay,muted:v.muted,defaultMuted:v.defaultMuted,volume:v.volume,controls:v.controls}));
  check(!audio.autoplay&&audio.controls,tag+' trailer no autoplay + controls',JSON.stringify(audio));
  check(!audio.muted&&!audio.defaultMuted&&Math.abs(audio.volume-.30)<.001,tag+' trailer initial audio unmuted 30%',JSON.stringify(audio));
  await p.locator('#trailerVideo').evaluate(v=>{v.volume=.83;v.muted=true});
  await p.reload({waitUntil:'domcontentloaded',timeout:15000}); await p.waitForTimeout(120);
  audio=await p.locator('#trailerVideo').evaluate(v=>({autoplay:v.autoplay,muted:v.muted,defaultMuted:v.defaultMuted,volume:v.volume}));
  check(!audio.autoplay&&!audio.muted&&Math.abs(audio.volume-.30)<.001,tag+' trailer refresh deterministic',JSON.stringify(audio));

  if(v.w===1366){
    const contact=await p.evaluate(()=>{const point=document.querySelector('.contact-signal-track i'),diamond=document.querySelector('.contact-signal-track b');const pa=point.getAnimations()[0],da=diamond.getAnimations()[0];if(!pa||!da)return{missing:true};pa.pause();da.pause();pa.currentTime=350;const x0=parseFloat(getComputedStyle(point).left)||0;pa.currentTime=3600;const x1=parseFloat(getComputedStyle(point).left)||0;da.currentTime=350;const bg0=getComputedStyle(diamond).backgroundColor,sh0=getComputedStyle(diamond).boxShadow;da.currentTime=3600;const bg1=getComputedStyle(diamond).backgroundColor,sh1=getComputedStyle(diamond).boxShadow;return{x0,x1,bg0,bg1,sh0,sh1,pointAnim:getComputedStyle(point).animationName,diamondAnim:getComputedStyle(diamond).animationName};});
    check(!contact.missing&&contact.x1-contact.x0>100,tag+' CONTACT point travels to diamond',JSON.stringify(contact));
    check(!contact.missing&&(contact.bg0!==contact.bg1||contact.sh0!==contact.sh1),tag+' CONTACT diamond receive reaction',JSON.stringify(contact));

    await p.waitForFunction(()=>document.querySelector('#archiveMainImage')?.complete); const normal=await p.locator('#archiveStage').boundingBox();
    await p.locator('#archiveStage').focus(); await p.locator('#archiveStage').press('Enter'); await p.waitForSelector('#lightbox.open'); await p.waitForTimeout(120);
    const large=await p.locator('#lightboxImage').boundingBox(); const ratio=Math.max(large.height/normal.height,large.width/normal.width);
    check(ratio>=1.15,tag+' Materials enlarged mode visibly larger',JSON.stringify({normal,large,ratio}));
    for(const [sel,label] of [['#lightboxClose','close'],['#lightboxPrev','prev'],['#lightboxNext','next']]){const r=await p.locator(sel).boundingBox();check(Math.abs(r.width-r.height)<=3,tag+' lightbox '+label+' balanced geometry',JSON.stringify(r));}
    await p.screenshot({path:path.join(OUT,'desktop-materials-contact.png')}); await p.keyboard.press('Escape');
  }

  if(v.phone||v.w===768){
    const d1=await p.locator('#galleryPrev').evaluate(el=>getComputedStyle(el).display),d2=await p.locator('#galleryNext').evaluate(el=>getComputedStyle(el).display);check(d1==='none'&&d2==='none',tag+' mobile Materials stage arrows remain hidden',d1+'/'+d2);
    const c0=await p.locator('#archiveCounter').textContent(); await swipe(p.locator('#archiveStage')); await p.waitForTimeout(50); const c1=await p.locator('#archiveCounter').textContent();check(c0!==c1,tag+' Materials stage swipe works',c0+' -> '+c1);
    await p.locator('#archiveStage').focus();await p.locator('#archiveStage').press('Enter');await p.waitForSelector('#lightbox.open');const lp=await p.locator('#lightboxPrev').evaluate(el=>getComputedStyle(el).display),ln=await p.locator('#lightboxNext').evaluate(el=>getComputedStyle(el).display),cb=await p.locator('#lightboxClose').boundingBox();check(lp==='none'&&ln==='none',tag+' mobile lightbox arrows remain hidden',lp+'/'+ln);check(Math.abs(cb.width-cb.height)<=3,tag+' mobile lightbox close square',JSON.stringify(cb));const l0=await p.locator('#lightboxCounter').textContent();await swipe(p.locator('#lightbox'));await p.waitForTimeout(50);const l1=await p.locator('#lightboxCounter').textContent();check(l0!==l1,tag+' mobile lightbox swipe works',l0+' -> '+l1);await p.keyboard.press('Escape');

    for(const spec of [{section:'#cast',item:'#cast .cast-list-item',panel:'#subjectDossier',back:'.r7-subject-back',name:'Actors'},{section:'#faq',item:'#faq .faq-query-item',panel:'#faqResponsePanel',back:'.r7-query-back',name:'FAQ'}]){
      await p.locator(spec.section).scrollIntoViewIfNeeded();await p.waitForTimeout(70);const y0=await p.evaluate(()=>scrollY);await p.locator(spec.item).nth(1).click();await p.waitForTimeout(45);const dur=await p.locator(spec.panel).evaluate(el=>getComputedStyle(el).transitionDuration);check(parseTime(dur)>=.38,tag+' '+spec.name+' panel transition softened',dur);await p.waitForTimeout(470);const y1=await p.evaluate(()=>scrollY),visible=await p.locator(spec.panel).evaluate(el=>getComputedStyle(el).visibility==='visible'&&parseFloat(getComputedStyle(el).opacity)>.95);check(visible,tag+' '+spec.name+' detail visible');check(Math.abs(y1-y0)<=1.5,tag+' '+spec.name+' no auto-scroll',y0+' -> '+y1);await p.locator(spec.back).click();await p.waitForTimeout(80);
    }
  }

  if(v.phone){
    await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(60);await p.locator('#menuToggle').click();await p.waitForSelector('body.nav-open');const oy=await p.evaluate(()=>getComputedStyle(document.body).overflowY);check(oy!=='hidden',tag+' burger body scroll unlocked',oy);const report=p.locator('#primaryNav .r7-nav-report');await report.waitFor({state:'visible'});const nb=await p.locator('#primaryNav').boundingBox(),rb=await report.boundingBox();const gap=Math.max(0,nb.y+nb.height-(rb.y+rb.height));check(gap<=4,tag+' no residual gap below report',String(gap));
    if(v.h>600){const y=Math.min(v.h-18,Math.max(12,nb.y+nb.height+35));await p.mouse.move(Math.max(8,v.w-12),y);await p.mouse.wheel(0,420);await p.waitForTimeout(100);const sy=await p.evaluate(()=>scrollY);check(sy>10,tag+' page scrolls with burger open',String(sy));check(await p.locator('body').evaluate(el=>el.classList.contains('nav-open')),tag+' scroll keeps burger open');}
    await p.evaluate(()=>{const mk=(type,x,y)=>document.body.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:77,pointerType:'touch',clientX:x,clientY:y}));mk('pointerdown',20,700);mk('pointermove',20,650);mk('pointerup',20,650)});check(await p.locator('body').evaluate(el=>el.classList.contains('nav-open')),tag+' movement gesture keeps burger open');
    await p.evaluate(()=>{const mk=type=>document.body.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:78,pointerType:'touch',clientX:20,clientY:700}));mk('pointerdown');mk('pointerup')});await p.waitForTimeout(20);check(!(await p.locator('body').evaluate(el=>el.classList.contains('nav-open'))),tag+' deliberate outside tap closes burger');
    await p.locator('#menuToggle').click();await p.dispatchEvent('#trailerVideo','webkitbeginfullscreen');await p.waitForTimeout(20);check(!(await p.locator('body').evaluate(el=>el.classList.contains('nav-open'))),tag+' video fullscreen closes burger');

    const dur=await p.locator('.site-header').evaluate(el=>getComputedStyle(el).transitionDuration);check(parseTime(dur)>=.36,tag+' smart header visual transition softened',dur);await p.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0)});await p.waitForTimeout(850);await p.evaluate(()=>scrollTo(0,620));await p.waitForTimeout(110);check(await p.locator('body').evaluate(el=>el.classList.contains('r7-header-hidden')),tag+' smart header hides on down-scroll');await p.evaluate(()=>scrollTo(0,420));await p.waitForTimeout(110);check(!(await p.locator('body').evaluate(el=>el.classList.contains('r7-header-hidden'))),tag+' smart header reveals on up-scroll');
  }

  if(v.name==='390x844'||v.name==='1366x768'){const a=await p.locator('html').getAttribute('lang');await p.locator('#langToggle').click();await p.waitForTimeout(40);const b=await p.locator('html').getAttribute('lang');check(a!==b&&['ru','en'].includes(b),tag+' RU/EN sanity',a+' -> '+b);}
  check(errors.length===0,tag+' index JS errors = 0',errors.join(' | '));await ctx.close();
}

{
 const v=viewports.at(-1),ctx=await contextFor(v,'reduce'),{p,errors}=await open(ctx,TARGET+'/index.html?round6=reduced');const state=await p.evaluate(()=>({point:getComputedStyle(document.querySelector('.contact-signal-track i')).animationName,diamond:getComputedStyle(document.querySelector('.contact-signal-track b')).animationName}));check(state.point==='none'&&state.diamond==='none','[1366x768] CONTACT reduced-motion static',JSON.stringify(state));check(errors.length===0,'[1366x768] reduced-motion JS errors = 0',errors.join(' | '));await ctx.close();
}

for(const v of [viewports[0],viewports.at(-1)]){
 const ctx=await contextFor(v),{p,errors}=await open(ctx,TARGET+'/reviews.html?round6='+v.name),tag='['+v.name+'][reviews]';const overflow=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);check(Math.abs(overflow)<=1,tag+' horizontal overflow = 0',String(overflow));check((await p.locator('body').innerText()).includes('THEFT // PUBLIC FILE // 2045'),tag+' public file signature preserved');check(await p.locator('#primaryNav .r7-nav-report').count()===1,tag+' report button preserved');await p.locator('#profileHelpToggle').click();await p.waitForTimeout(80);const help=await p.locator('#profileHelpPanel').boundingBox(),composer=await p.locator('.review-composer').boundingBox(),active=await p.locator('#profileHelpToggle').getAttribute('aria-expanded'),pos=await p.locator('#profileHelpPanel').evaluate(el=>getComputedStyle(el).position);check(active==='true',tag+' help active state visible',String(active));check(help.width<=362&&help.width<=composer.width-6,tag+' help compact popover',JSON.stringify({help,composer}));check(pos!=='fixed',tag+' help not fullscreen modal',pos);await p.screenshot({path:path.join(OUT,'help-'+v.name+'.png')});check(errors.length===0,tag+' JS errors = 0',errors.join(' | '));await ctx.close();
}

{
 const before=await geometry(BASELINE),after=await geometry(TARGET);let maxDelta=0;for(const s of Object.keys(before))for(const k of ['x','y','w','h'])maxDelta=Math.max(maxDelta,Math.abs(before[s][k]-after[s][k]));check(maxDelta<=1,'[1366x768] unaffected desktop geometry matches Round5',String(maxDelta));
}

await browser.close();
const result={checks:checks.length,passed,failed:failures.length,failures};fs.writeFileSync(path.join(OUT,'RESULTS.json'),JSON.stringify(result,null,2));fs.writeFileSync(path.join(OUT,'REPORT.md'),`# R7 Round6 browser QA\n\nChecks: ${checks.length}\nPassed: ${passed}\nFailed: ${failures.length}\n`);console.log(JSON.stringify(result,null,2));if(failures.length)process.exit(1);
