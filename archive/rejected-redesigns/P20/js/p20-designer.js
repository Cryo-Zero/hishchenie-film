(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  function initArchiveDrawer(){
    const shell = $('.archive-drawer-shell');
    const drawer = $('#archiveDrawer');
    const toggle = $('#archiveDrawerToggle');
    const close = $('#archiveDrawerClose');
    if(!shell || !drawer || !toggle) return;
    const setOpen = (open) => {
      shell.classList.toggle('is-open', open);
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', () => setOpen(!shell.classList.contains('is-open')));
    close?.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && !$('.lightbox.open,.lightbox.is-open')) setOpen(false); });
    // Deliberately do NOT close the archive when a material or lightbox is opened.
  }

  function initArchivePagination(){
    const cards = $$('#gallery .gallery-card');
    const pagination = $('#archivePagination');
    if(!cards.length || !pagination) return;
    pagination.innerHTML = '';
    cards.forEach((card, i) => {
      const dot = document.createElement('i');
      if(card.classList.contains('is-active') || i === 0) dot.classList.add('is-active');
      pagination.appendChild(dot);
    });
    const sync = () => {
      const activeIndex = Math.max(0, cards.findIndex(c => c.classList.contains('is-active')));
      [...pagination.children].forEach((d,i)=>d.classList.toggle('is-active',i===activeIndex));
      const code = $('#archiveCode');
      const counter = $('#archiveCounter');
      const active = cards[activeIndex];
      if(code && active) code.textContent = `${active.dataset.file || `MAT_${String(activeIndex+1).padStart(3,'0')}`} // ${active.dataset.type || 'ARCHIVE'}`;
      if(counter) counter.textContent = `${String(activeIndex+1).padStart(2,'0')} / ${cards.length}`;
    };
    cards.forEach(card => card.addEventListener('click', () => setTimeout(sync, 0)));
    $('#galleryPrev')?.addEventListener('click', () => setTimeout(sync, 0));
    $('#galleryNext')?.addEventListener('click', () => setTimeout(sync, 0));
    sync();
  }

  function initLightboxDots(){
    const lightbox = $('#lightbox');
    const cards = $$('#gallery .gallery-card');
    if(!lightbox || !cards.length) return;
    let dots = $('.p20-lightbox-dots', lightbox);
    if(!dots){
      dots = document.createElement('div');
      dots.className = 'p20-lightbox-dots';
      lightbox.appendChild(dots);
    }
    dots.innerHTML = cards.map(()=>'<i></i>').join('');
    const sync = () => {
      const counter = $('#lightboxCounter')?.textContent || '';
      const match = counter.match(/(\d+)\s*\/\s*(\d+)/);
      let idx = match ? Math.max(0, Number(match[1])-1) : cards.findIndex(c=>c.classList.contains('is-active'));
      if(idx < 0) idx = 0;
      [...dots.children].forEach((d,i)=>d.classList.toggle('active',i===idx));
    };
    ['click','keydown'].forEach(evt => document.addEventListener(evt, () => setTimeout(sync, 30)));
    sync();
  }

  function initFaqStandby(){
    const items = $$('.faq-query-item');
    if(!items.length) return;
    const code = $('#faqResponseCode');
    const question = $('#faqResponseQuestion');
    const answer = $('#faqResponseAnswer');
    const status = $('#faqResponseStatus');
    const message = $('#faqResponseMessage');
    const log = $('#faqResponseLog');

    const standby = () => {
      items.forEach(i => {i.classList.remove('is-selected'); i.setAttribute('aria-selected','false');});
      if(code) code.textContent='QUERY_00 // STANDBY';
      if(question) question.textContent='???';
      if(answer) answer.textContent='Выберите вопрос // ожидание ответа';
      if(status) status.textContent='???';
      if(message) message.textContent='???';
      if(log) log.textContent='SYSTEM LOG // Q00.STBY';
    };
    const apply = (item) => {
      items.forEach(i=>{const on=i===item;i.classList.toggle('is-selected',on);i.setAttribute('aria-selected',on?'true':'false');});
      const qid = item.dataset.query || 'QUERY_00';
      const q = item.querySelector('strong[data-i18n]')?.textContent || '???';
      const a = item.querySelector('.faq-source-answer')?.textContent || '—';
      const st = item.querySelector('.faq-source-status')?.textContent || item.dataset.queryStatus || 'ПУБЛИЧНЫЕ ДАННЫЕ';
      const msg = item.querySelector('.faq-source-message')?.textContent || item.dataset.queryMessage || 'ДАННЫЕ ДОСТУПНЫ';
      if(code) code.textContent = item.dataset.queryCode || `${qid} // VERIFIED RESPONSE`;
      if(question) question.textContent=q;
      if(answer) answer.textContent=a;
      if(status) status.textContent=st;
      if(message) message.textContent=msg;
      if(log) log.textContent=`SYSTEM LOG // ${qid.replace('QUERY_','Q')}.RSP`;
    };
    items.forEach(item => item.addEventListener('click', () => apply(item)));
    $('#langToggle')?.addEventListener('click', () => {
      const selected = items.find(i=>i.classList.contains('is-selected'));
      if(selected) setTimeout(()=>apply(selected),60);
    });
    setTimeout(standby, 30);
  }

  function initReviewsBrand(){
    if(!document.body.classList.contains('community-page')) return;
    const brand = $('.brand');
    if(brand){
      brand.setAttribute('href','index.html');
      brand.addEventListener('click', () => sessionStorage.removeItem('theft_last_anchor'));
    }
  }

  function initScrollSync(){
    const bar = $('#scrollProgress');
    const rail = $('#railProgress');
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const pct = max > 0 ? Math.min(1,scrollY/max) : 0;
      if(bar) bar.style.width = `${pct*100}%`;
      if(rail) rail.style.height = `${pct*100}%`;
    };
    update(); addEventListener('scroll', update, {passive:true}); addEventListener('resize',update);
  }

  function initPulse(){
    const waves = $$('.response-pulse-wave span, .audience-pulse-wave span, .signal-wave span');
    waves.forEach((span,i)=>{ span.style.animationDelay = `${-(i%9)*0.09}s`; span.style.animationDuration = `${1.15 + (i%6)*0.11}s`; });
  }

  function initArchiveStageOpen(){
    const stage = $('#archiveStage');
    if(!stage) return;
    stage.setAttribute('title','Open viewer');
    // Existing site.js owns the viewer. This handler only makes keyboard activation consistent.
    stage.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); stage.click(); }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initArchiveDrawer();
    initArchivePagination();
    initLightboxDots();
    initFaqStandby();
    initReviewsBrand();
    initScrollSync();
    initPulse();
    initArchiveStageOpen();
  });
})();
