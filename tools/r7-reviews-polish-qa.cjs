const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const targets = [['390x844',390,844],['844x390',844,390],['430x932',430,932],['932x430',932,430]];
const report={checks:[],failures:[],screenshots:[]};
const add=(name,ok,detail='')=>{report.checks.push({name,ok,detail});if(!ok)report.failures.push({name,detail});};

(async()=>{
  fs.mkdirSync('r7-qa-polish/screenshots',{recursive:true});
  const browser=await chromium.launch({headless:true});
  try{
    for(const [label,width,height] of targets){
      const ctx=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true});
      const page=await ctx.newPage();
      const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
      await page.goto('http://127.0.0.1:4173/reviews.html',{waitUntil:'domcontentloaded'});
      await page.waitForTimeout(900);
      const s=await page.evaluate(()=>{
        const composer=document.querySelector('.review-composer');
        const feed=document.querySelector('.review-feed');
        const c=composer?.getBoundingClientRect();
        const f=feed?.getBoundingClientRect();
        const style=el=>el?getComputedStyle(el):null;
        return {
          overflow:document.documentElement.scrollWidth-innerWidth,
          polish:[...document.styleSheets].some(x=>String(x.href||'').includes('responsive-r7-polish.css')),
          composer:{top:c?.top+scrollY,bottom:c?.bottom+scrollY,height:c?.height,overflow:style(composer)?.overflow,position:style(composer)?.position},
          feed:{top:f?.top+scrollY,bottom:f?.bottom+scrollY,height:f?.height,overflow:style(feed)?.overflow,position:style(feed)?.position},
          layoutDisplay:style(document.querySelector('.community-layout'))?.display
        };
      });
      add(`${label} polish loaded`,s.polish,JSON.stringify(s));
      add(`${label} no horizontal overflow`,s.overflow<=2,`overflow=${s.overflow}`);
      add(`${label} no page errors`,errors.length===0,errors.join(' | '));
      add(`${label} composer has natural height`,s.composer.height>350,JSON.stringify(s.composer));
      add(`${label} feed follows composer`,s.feed.top>=s.composer.bottom+12,JSON.stringify({composerBottom:s.composer.bottom,feedTop:s.feed.top}));
      add(`${label} normal mobile flow`,s.layoutDisplay==='block'&&s.composer.overflow==='visible'&&s.feed.overflow==='visible',JSON.stringify(s));
      if(label==='390x844'||label==='844x390'){
        await page.evaluate(()=>window.scrollTo({top:Math.max(0,document.querySelector('.review-composer').getBoundingClientRect().top+scrollY-72),behavior:'instant'}));
        await page.waitForTimeout(120);
        const file=path.join('r7-qa-polish','screenshots',`reviews-${label}-composer.png`);
        await page.screenshot({path:file,fullPage:false,animations:'disabled'}); report.screenshots.push(file);
        const feedFile=path.join('r7-qa-polish','screenshots',`reviews-${label}-feed-start.png`);
        await page.evaluate(()=>window.scrollTo({top:Math.max(0,document.querySelector('.review-feed').getBoundingClientRect().top+scrollY-72),behavior:'instant'}));
        await page.waitForTimeout(120);
        await page.screenshot({path:feedFile,fullPage:false,animations:'disabled'}); report.screenshots.push(feedFile);
      }
      await ctx.close();
    }
  }finally{await browser.close();}
  fs.writeFileSync('r7-qa-polish/report.json',JSON.stringify(report,null,2));
  fs.writeFileSync('r7-qa-polish/REPORT.md',[
    '# R7 Reviews polish QA','',`Checks: ${report.checks.length}`,`Failures: ${report.failures.length}`,'','## Failures',...(report.failures.length?report.failures.map(x=>`- ${x.name}: ${x.detail}`):['- none']),'','## Checks',...report.checks.map(x=>`- ${x.ok?'PASS':'FAIL'} — ${x.name}${x.detail?` — ${x.detail}`:''}`),'','## Screenshots',...report.screenshots.map(x=>`- ${x}`),''
  ].join('\n'));
  if(report.failures.length)process.exitCode=2;
})().catch(err=>{fs.mkdirSync('r7-qa-polish',{recursive:true});fs.writeFileSync('r7-qa-polish/HARNESS-ERROR.txt',String(err?.stack||err));console.error(err);process.exit(3);});
