(() => {
  'use strict';
  const URL='https://xltwwvutqkpmtmlavngi.supabase.co';
  const KEY='sb_publishable_0hT3y-7p26Ngnq2zaPK-0w_5vtJX15k';
  const SESSION_KEY='theft-admin-auth-v1';
  const $=(s,r=document)=>r.querySelector(s);
  const safe={get(){try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{return null}},set(v){try{localStorage.setItem(SESSION_KEY,JSON.stringify(v))}catch{}},del(){try{localStorage.removeItem(SESSION_KEY)}catch{}}};
  let session=null,busy=false,allRows=[];

  class ApiError extends Error{constructor(message,status=0){super(message);this.status=status;}}
  async function request(path,{method='GET',body,token=session?.access_token}={}){
    const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),25000);
    try{
      const headers={apikey:KEY,Accept:'application/json'}; if(token)headers.Authorization=`Bearer ${token}`; if(body!==undefined)headers['Content-Type']='application/json';
      const r=await fetch(`${URL}${path}`,{method,headers,body:body===undefined?undefined:JSON.stringify(body),signal:ctl.signal,cache:'no-store',credentials:'omit'});
      const text=await r.text();let data=null;if(text){try{data=JSON.parse(text)}catch{data=text}}
      if(!r.ok)throw new ApiError(data?.message||data?.error_description||data?.error||`HTTP ${r.status}`,r.status);
      return data;
    } finally{clearTimeout(timer)}
  }
  function normalize(d){const s=d?.session?.access_token?d.session:d;if(!s?.access_token)return null;if(!s.expires_at&&s.expires_in)s.expires_at=Math.floor(Date.now()/1000)+Number(s.expires_in);return s;}
  function fresh(s){return !!s?.access_token&&(!s.expires_at||Number(s.expires_at)>Math.floor(Date.now()/1000)+90)}
  async function refresh(){const current=session||safe.get();if(!current?.refresh_token)return null;const d=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:current.refresh_token},token:null});session=normalize(d);safe.set(session);return session;}
  async function auth(){session=session||safe.get();if(fresh(session))return session;if(session?.refresh_token)return refresh();return null;}
  async function rpc(name,body={}){let s=await auth();if(!s)throw new ApiError('Требуется вход',401);try{return await request(`/rest/v1/rpc/${name}`,{method:'POST',body,token:s.access_token})}catch(e){if(e.status!==401)throw e;s=await refresh();return request(`/rest/v1/rpc/${name}`,{method:'POST',body,token:s.access_token})}}
  const setStatus=(m,bad=false)=>{const el=$('#adminStatus');if(el){el.textContent=m||'';el.style.color=bad?'#d58e8e':''}};
  const setLoginStatus=(m,bad=false)=>{const el=$('#adminLoginStatus');if(el){el.textContent=m||'';el.style.color=bad?'#d58e8e':''}};

  async function login(){if(busy)return;const email=$('#adminEmail').value.trim(),password=$('#adminPassword').value;if(!email||!password){setLoginStatus('Введите email и пароль.',true);return}busy=true;$('#adminLoginButton').disabled=true;setLoginStatus('Проверка доступа…');try{const d=await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password},token:null});session=normalize(d);if(!session)throw new Error('Пустая сессия');safe.set(session);await enterPanel()}catch(e){session=null;safe.del();setLoginStatus(`Вход не выполнен: ${e.message}`,true)}finally{busy=false;$('#adminLoginButton').disabled=false}}

  async function enterPanel(){const allowed=await rpc('is_admin_v1',{});if(allowed!==true){session=null;safe.del();throw new Error('Аккаунт существует, но не добавлен в список команды.')}
    await rpc('admin_ensure_official_profile_v1',{p_display_name:'Команда фильма'});
    $('#adminLogin').hidden=true;$('#adminPanel').hidden=false;setStatus('Доступ подтверждён · OFFICIAL');await loadReviews();
  }
  async function loadReviews(){setStatus('Загрузка…');try{const rows=await rpc('admin_get_reviews_v2',{});allRows=Array.isArray(rows)?rows:[];renderFiltered();setStatus(`Отзывы: ${allRows.length}`)}catch(e){setStatus(`Не удалось загрузить: ${e.message}`,true)}}
  function actionButton(label,fn){const b=document.createElement('button');b.type='button';b.className='micro-button';b.textContent=label;b.addEventListener('click',fn);return b}
  function renderFiltered(){
    const q=($('#adminSearch')?.value||'').trim().toLowerCase();
    const visibility=$('#adminVisibility')?.value||'all';
    const order=$('#adminOrder')?.value||'new';
    let rows=allRows.filter(r=>{
      if(visibility==='public'&&r.is_hidden)return false;
      if(visibility==='hidden'&&!r.is_hidden)return false;
      if(!q)return true;
      return [r.display_name,r.review_text,r.user_id,r.alias_code,r.id].some(v=>String(v||'').toLowerCase().includes(q));
    });
    rows=[...rows].sort((a,b)=>{
      if(a.is_pinned!==b.is_pinned)return a.is_pinned?-1:1;
      if(order==='old')return new Date(a.created_at)-new Date(b.created_at);
      if(order==='rating_desc')return Number(b.rating)-Number(a.rating);
      if(order==='rating_asc')return Number(a.rating)-Number(b.rating);
      return new Date(b.created_at)-new Date(a.created_at);
    });
    render(rows);
  }
  function render(rows){
    const root=$('#adminReviews');root.replaceChildren();
    if(!rows.length){const d=document.createElement('div');d.className='admin-card';d.textContent='По выбранным условиям отзывов нет.';root.append(d);return}
    rows.forEach(r=>{
      const card=document.createElement('article');card.className=`admin-card${r.is_hidden?' is-hidden':''}`;
      const head=document.createElement('div');head.className='admin-card-head';
      const left=document.createElement('div');const n=document.createElement('strong');n.textContent=r.display_name||'Anonymous';
      const meta=document.createElement('div');meta.className='composer-label';meta.textContent=`${r.rating}/10 · ${new Date(r.created_at).toLocaleString('ru-RU')} · ♥ ${r.like_count||0} · ↳ ${r.reply_count||0}`;
      const uid=document.createElement('code');uid.className='admin-user-id';uid.textContent=`UID // ${r.user_id}`;left.append(n,meta,uid);
      const flags=document.createElement('div');flags.className='composer-label';flags.textContent=`${r.is_pinned?'PINNED ':''}${r.is_hidden?'HIDDEN':'PUBLIC'}`.trim();head.append(left,flags);
      const p=document.createElement('p');p.textContent=r.review_text||'Оценка без текста.';
      const actions=document.createElement('div');actions.className='admin-actions';
      actions.append(actionButton(r.is_pinned?'Открепить':'Закрепить',()=>setFlags(r,r.is_hidden,!r.is_pinned)),actionButton(r.is_hidden?'Вернуть':'Скрыть',()=>setFlags(r,!r.is_hidden,r.is_pinned)),actionButton('Удалить',()=>removeReview(r)));
      const reply=document.createElement('div');reply.className='reply-composer';const ta=document.createElement('textarea');ta.maxLength=1200;ta.placeholder='Официальный ответ команды…';const rb=actionButton('Ответить OFFICIAL',async()=>{if(!ta.value.trim())return;rb.disabled=true;try{await rpc('save_review_reply_v2',{p_review_id:r.id,p_text:ta.value.trim()});ta.value='';setStatus('Официальный ответ сохранён.');await loadReviews()}catch(e){setStatus(`Ответ не сохранён: ${e.message}`,true)}finally{rb.disabled=false}});reply.append(ta,rb);
      card.append(head,p,actions,reply);root.append(card);
    });
  }
  async function setFlags(r,hidden,pinned){if(busy)return;busy=true;try{await rpc('admin_set_review_flags_v1',{p_review_id:r.id,p_hidden:hidden,p_pinned:pinned});await loadReviews()}catch(e){setStatus(`Изменение не выполнено: ${e.message}`,true)}finally{busy=false}}
  async function removeReview(r){if(!confirm('Удалить отзыв без возможности восстановления?'))return;try{await rpc('admin_delete_review_v1',{p_review_id:r.id});await loadReviews()}catch(e){setStatus(`Удаление не выполнено: ${e.message}`,true)}}
  function logout(){session=null;safe.del();$('#adminPanel').hidden=true;$('#adminLogin').hidden=false;$('#adminPassword').value='';setLoginStatus('Сессия завершена.');}
  $('#adminLoginButton')?.addEventListener('click',login);$('#adminPassword')?.addEventListener('keydown',e=>{if(e.key==='Enter')login()});$('#adminLogout')?.addEventListener('click',logout);
  $('#adminSearch')?.addEventListener('input',renderFiltered);$('#adminVisibility')?.addEventListener('change',renderFiltered);$('#adminOrder')?.addEventListener('change',renderFiltered);$('#adminRefresh')?.addEventListener('click',loadReviews);
  (async()=>{try{if(await auth())await enterPanel()}catch(e){setLoginStatus(e.message,true)}})();
})();
