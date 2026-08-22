(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const body=document.body, header=$('.site-header'), menu=$('#menuToggle'), nav=$('#primaryNav');
  const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const headerH=()=>header?.offsetHeight||0;
  const closeNav=()=>{body.classList.remove('nav-open');menu?.setAttribute('aria-expanded','false');};
  menu?.addEventListener('click',()=>{const on=body.classList.toggle('nav-open');menu.setAttribute('aria-expanded',String(on));});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));
  addEventListener('resize',()=>{if(innerWidth>980)closeNav();});

  $('.brand[href="#top"]')?.addEventListener('click',e=>{e.preventDefault();history.replaceState(null,'',location.pathname+location.search+'#top');scrollTo({top:0,behavior:reduce()?'auto':'smooth'});closeNav();});
  if(location.hash==='#top') requestAnimationFrame(()=>scrollTo(0,0));
  addEventListener('pageshow',()=>{if(location.hash==='#top')requestAnimationFrame(()=>scrollTo(0,0));});
  document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const h=a.getAttribute('href');if(!h||h==='#')return;const t=document.querySelector(h);if(!t)return;e.preventDefault();const top=h==='#top'?0:t.getBoundingClientRect().top+scrollY-headerH()+1;scrollTo({top,behavior:reduce()?'auto':'smooth'});history.replaceState(null,'',location.pathname+location.search+h);closeNav();});

  const progress=$('#scrollProgress'), rail=$('#railProgress'), railSection=$('#railSection');
  const sections=[['top','00 / ENTRY'],['about','01 / DOSSIER'],['materials','02 / ARCHIVE'],['trailer','03 / SIGNAL'],['watch','04 / ACCESS'],['cast','05 / SUBJECTS'],['response-preview','R / RESPONSE'],['faq','06 / QUERY'],['contacts','07 / CONTACT'],['reviewsTop','R / RESPONSE'],['reviewWorkspace','R1 / FEED']].map(([id,c])=>[document.getElementById(id),c]).filter(x=>x[0]);
  function scrollUI(){const max=Math.max(1,document.documentElement.scrollHeight-innerHeight),p=Math.max(0,Math.min(100,scrollY/max*100));if(progress)progress.style.width=p+'%';if(rail)rail.style.height=p+'%';if(railSection&&sections.length){let a=sections[0];const y=scrollY+innerHeight*.34;sections.forEach(s=>{if(s[0].offsetTop<=y)a=s;});railSection.textContent=a[1];}}
  scrollUI();addEventListener('scroll',scrollUI,{passive:true});addEventListener('resize',scrollUI);
  const hashLinks=$$('.nav-links a[href^="#"]'), observed=hashLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if('IntersectionObserver'in window&&observed.length){const io=new IntersectionObserver(es=>{const v=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!v)return;hashLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+v.target.id));},{rootMargin:`-${headerH()+8}px 0px -58% 0px`,threshold:[.08,.2,.4]});observed.forEach(el=>io.observe(el));}

  // Archive drawer: allowed to leave the global page gutter. The page itself never shifts.
  const drawerShell=$('.archive-drawer-shell'), drawer=$('#archiveDrawer'), drawerToggle=$('#archiveDrawerToggle'), drawerClose=$('#archiveDrawerClose');
  const setDrawer=open=>{if(!drawerShell||!drawer)return;drawerShell.classList.toggle('is-open',open);drawer.classList.toggle('is-open',open);drawer.setAttribute('aria-hidden',open?'false':'true');drawerToggle?.setAttribute('aria-expanded',String(open));};
  drawerToggle?.addEventListener('click',()=>setDrawer(!drawerShell.classList.contains('is-open'))); drawerClose?.addEventListener('click',()=>setDrawer(false));

  const stage=$('#archiveStage'), main=$('#archiveMainImage'), cards=$$('#gallery .gallery-card'), prev=$('#galleryPrev'), next=$('#galleryNext'), code=$('#archiveCode'), counter=$('#archiveCounter'), pagination=$('#archivePagination');
  const lightbox=$('#lightbox'), lbImg=$('#lightboxImage'), lbCount=$('#lightboxCounter'), lbClose=$('#lightboxClose'), lbPrev=$('#lightboxPrev'), lbNext=$('#lightboxNext');
  let ai=0,touchX=0;
  const items=cards.map((c,i)=>{const im=$('img',c);return{src:im?.getAttribute('src')||'',alt:im?.getAttribute('alt')||'',i18n:im?.dataset.i18nAlt||'',file:c.dataset.file||`MAT_${String(i+1).padStart(3,'0')}`,type:c.dataset.type||'ARCHIVE'};});
  function dots(){if(!pagination)return;pagination.replaceChildren(...items.map((_,i)=>{const b=document.createElement('button');b.type='button';b.className=i===ai?'is-active':'';b.setAttribute('aria-label',`Material ${i+1}`);b.addEventListener('click',()=>setArchive(i));return b;}));}
  function setArchive(i,focus=false){if(!items.length||!main)return;ai=(i+items.length)%items.length;const it=items[ai];main.src=it.src;main.alt=it.alt;if(it.i18n)main.dataset.i18nAlt=it.i18n;if(code)code.textContent=`${it.file} // ${it.type}`;if(counter)counter.textContent=`${String(ai+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;cards.forEach((c,n)=>{c.classList.toggle('is-active',n===ai);c.setAttribute('aria-current',n===ai?'true':'false');});cards[ai]?.scrollIntoView({block:'nearest',inline:'nearest'});dots();if(focus)stage?.focus({preventScroll:true});}
  cards.forEach((c,i)=>c.addEventListener('click',()=>setArchive(i,true)));prev?.addEventListener('click',e=>{e.stopPropagation();setArchive(ai-1)});next?.addEventListener('click',e=>{e.stopPropagation();setArchive(ai+1)});
  function openLB(i=ai){if(!lightbox||!lbImg||!items.length)return;ai=(i+items.length)%items.length;const it=items[ai];lbImg.src=it.src;lbImg.alt=it.alt;if(lbCount)lbCount.textContent=`${String(ai+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');body.classList.add('lightbox-open');syncLBDots();lbClose?.focus();}
  function closeLB(){if(!lightbox)return;lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');body.classList.remove('lightbox-open');stage?.focus({preventScroll:true});}
  function shiftLB(d){openLB(ai+d);}
  function syncLBDots(){if(!lightbox)return;let d=$('.p21-lightbox-dots',lightbox);if(!d){d=document.createElement('div');d.className='p21-lightbox-dots';lightbox.append(d);}d.replaceChildren(...items.map((_,i)=>{const x=document.createElement('i');if(i===ai)x.className='active';return x;}));}
  stage?.addEventListener('click',e=>{if(!e.target.closest('.gallery-button'))openLB();});stage?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLB()}else if(e.key==='ArrowLeft'){e.preventDefault();setArchive(ai-1)}else if(e.key==='ArrowRight'){e.preventDefault();setArchive(ai+1)}});
  stage?.addEventListener('touchstart',e=>touchX=e.changedTouches[0].clientX,{passive:true});stage?.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-touchX;if(Math.abs(d)>46)setArchive(ai+(d<0?1:-1));},{passive:true});
  lbClose?.addEventListener('click',closeLB);lbPrev?.addEventListener('click',()=>shiftLB(-1));lbNext?.addEventListener('click',()=>shiftLB(1));lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLB();});
  lightbox?.addEventListener('touchstart',e=>touchX=e.changedTouches[0].clientX,{passive:true});lightbox?.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-touchX;if(Math.abs(d)>46)shiftLB(d<0?1:-1);},{passive:true});
  document.addEventListener('keydown',e=>{if(lightbox?.classList.contains('open')){if(e.key==='Escape')closeLB();if(e.key==='ArrowLeft')shiftLB(-1);if(e.key==='ArrowRight')shiftLB(1);}else if(e.key==='Escape'&&drawerShell?.classList.contains('is-open'))setDrawer(false);});
  if(items.length)setArchive(0);

  // Subject dossier.
  const cast=$$('.cast-list-item'), dossier=$('#subjectDossier'), dc=$('#subjectDossierClose');let active=null;
  const dEls={subject:$('#dossierSubject'),name:$('#dossierName'),role:$('#dossierRole'),roleV:$('#dossierRoleValue'),status:$('#dossierStatusValue'),access:$('#dossierAccessValue'),ref:$('#dossierRefValue'),prompt:$('#dossierPrompt')};
  function dText(item,sel){return item?.querySelector(sel)?.textContent?.trim()||'???';}
  function renderD(item){if(!dossier)return;dossier.classList.remove('is-revealed');if(!item){dEls.subject.textContent='SUBJECT // UNIDENTIFIED';dEls.name.textContent='???';dEls.role.textContent='???';dEls.roleV.textContent='???';dEls.status.textContent='???';dEls.access.textContent='PUBLIC';dEls.ref.textContent='—';dEls.prompt.textContent=document.documentElement.lang==='en'?'SELECT SUBJECT // AWAITING INPUT':'ВЫБЕРИТЕ СУБЪЕКТ // ОЖИДАНИЕ';dossier.classList.remove('has-subject');}else{const s=item.dataset.subject||'SUBJECT';const r=dText(item,'em');dEls.subject.textContent=s+' // IDENTIFIED';dEls.name.textContent=dText(item,'.cast-actor-source');dEls.role.textContent=r;dEls.roleV.textContent=r;dEls.status.textContent=document.documentElement.lang==='en'?'CAST CONFIRMED':'СОСТАВ ПОДТВЕРЖДЁН';dEls.access.textContent='PUBLIC';dEls.ref.textContent='PUBLIC/'+s.replace('SUBJECT_','');dEls.prompt.textContent=document.documentElement.lang==='en'?'FILE LOADED // SELECT ANOTHER SUBJECT':'ФАЙЛ ЗАГРУЖЕН // ВЫБЕРИТЕ ДРУГОЙ СУБЪЕКТ';dossier.classList.add('has-subject');}requestAnimationFrame(()=>requestAnimationFrame(()=>dossier.classList.add('is-revealed')));}
  function selectD(item){active=item&&active===item?null:item;cast.forEach(c=>{const on=c===active;c.classList.toggle('is-selected',on);c.setAttribute('aria-selected',String(on));});renderD(active);}
  cast.forEach(c=>c.addEventListener('click',()=>selectD(c)));dc?.addEventListener('click',()=>selectD(null));renderD(null);addEventListener('theft:language',()=>renderD(active));

  // FAQ: stable panel, empty/standby until a question is selected.
  const qItems=$$('.faq-query-item'), qPanel=$('#faqResponsePanel'), qCode=$('#faqResponseCode'), qTitle=$('#faqResponseQuestion'), qAns=$('#faqResponseAnswer'), qStatus=$('#faqResponseStatus'), qMsg=$('#faqResponseMessage'), qLog=$('#faqResponseLog');let qActive=null;
  const qText=(it,sel)=>it?.querySelector(sel)?.textContent?.trim()||'—';
  function standby(){qActive=null;qItems.forEach(q=>{q.classList.remove('is-selected');q.setAttribute('aria-selected','false');});if(qCode)qCode.textContent='QUERY_00 // STANDBY';if(qTitle)qTitle.textContent='???';if(qAns)qAns.textContent=document.documentElement.lang==='en'?'Select a query // awaiting response':'Выберите вопрос // ожидание ответа';if(qStatus)qStatus.textContent='???';if(qMsg)qMsg.textContent='???';if(qLog)qLog.textContent='SYSTEM LOG // Q00.STBY';qPanel?.classList.remove('has-response');}
  function renderQ(it){qActive=it;qItems.forEach(q=>{const on=q===it;q.classList.toggle('is-selected',on);q.setAttribute('aria-selected',String(on));});const id=it.dataset.query||'QUERY_00';if(qCode)qCode.textContent=it.dataset.queryCode||`${id} // VERIFIED RESPONSE`;if(qTitle)qTitle.textContent=qText(it,'strong[data-i18n]');if(qAns)qAns.textContent=qText(it,'.faq-source-answer');if(qStatus)qStatus.textContent=qText(it,'.faq-source-status')||it.dataset.queryStatus||'—';if(qMsg)qMsg.textContent=qText(it,'.faq-source-message')||it.dataset.queryMessage||'—';if(qLog)qLog.textContent=`SYSTEM LOG // ${id.replace('QUERY_','Q')}.RSP`;qPanel?.classList.add('has-response');}
  qItems.forEach(q=>q.addEventListener('click',()=>renderQ(q)));standby();addEventListener('theft:language',()=>qActive?renderQ(qActive):standby());

  // Subtle waveform staggering.
  $$('.signal-wave span,.response-pulse-wave span,.audience-pulse-wave span').forEach((s,i)=>{s.style.animationDelay=`${-(i%11)*.08}s`;s.style.animationDuration=`${1.15+(i%7)*.09}s`;});
})();