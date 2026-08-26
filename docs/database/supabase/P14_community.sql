-- HISHCHENIE / THEFT — P14 community backend
-- Additive migration: reviews V4, likes, one-level replies and admin foundation.

-- 1) Profile identity V2 ------------------------------------------------------
alter table public.profiles
  add column if not exists alias_code text,
  add column if not exists alias_number integer,
  add column if not exists is_official boolean not null default false;

alter table public.profiles drop constraint if exists profiles_avatar_style_check;
alter table public.profiles add constraint profiles_avatar_style_check
  check (avatar_style between 1 and 6);

alter table public.profiles drop constraint if exists profiles_alias_code_check;
alter table public.profiles add constraint profiles_alias_code_check
  check (alias_code is null or (char_length(alias_code) between 2 and 40 and alias_code ~ '^[a-z0-9_]+$'));

alter table public.profiles drop constraint if exists profiles_alias_number_check;
alter table public.profiles add constraint profiles_alias_number_check
  check (alias_number is null or alias_number between 0 and 999);

-- 2) Review moderation flags --------------------------------------------------
alter table public.reviews
  add column if not exists is_pinned boolean not null default false,
  add column if not exists is_hidden boolean not null default false;

-- Public reads must not expose moderated rows, except to their owner.
drop policy if exists "Reviews are publicly readable" on public.reviews;
create policy "Visible reviews are publicly readable"
on public.reviews for select
to anon, authenticated
using (
  is_hidden = false
  or ((select auth.uid()) is not null and (select auth.uid()) = user_id)
);

-- Existing P13 clients remain compatible, but users may only write content columns.
revoke insert, update, delete on table public.profiles from authenticated;
grant insert (id, display_name, avatar_seed, avatar_style, alias_code, alias_number) on table public.profiles to authenticated;
grant update (display_name, avatar_seed, avatar_style, alias_code, alias_number) on table public.profiles to authenticated;

revoke insert, update, delete on table public.reviews from authenticated;
grant insert (user_id, rating, review_text) on table public.reviews to authenticated;
grant update (rating, review_text) on table public.reviews to authenticated;
grant delete on table public.reviews to authenticated;

-- 3) Admin identities ---------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('owner','editor','moderator')),
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

drop policy if exists "Admins read own membership" on public.admins;
create policy "Admins read own membership"
on public.admins for select
to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.admins from anon, authenticated;
grant select on table public.admins to authenticated;

create or replace function public.is_admin_v1()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  );
$$;
revoke all on function public.is_admin_v1() from public;
grant execute on function public.is_admin_v1() to authenticated;

-- Admins may inspect/moderate base rows through RLS when needed.
drop policy if exists "Admins update reviews" on public.reviews;
create policy "Admins update reviews"
on public.reviews for update
to authenticated
using (public.is_admin_v1())
with check (public.is_admin_v1());

drop policy if exists "Admins delete reviews" on public.reviews;
create policy "Admins delete reviews"
on public.reviews for delete
to authenticated
using (public.is_admin_v1());

-- 4) Likes --------------------------------------------------------------------
create table if not exists public.review_likes (
  review_id uuid not null references public.reviews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (review_id, user_id)
);
alter table public.review_likes enable row level security;
create index if not exists review_likes_review_idx on public.review_likes(review_id);

-- 5) One-level replies ---------------------------------------------------------
create table if not exists public.review_replies (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reply_text text not null default '',
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint review_replies_text_check check (char_length(reply_text) between 1 and 1200),
  constraint review_replies_one_per_user unique (review_id, user_id)
);
alter table public.review_replies enable row level security;
create index if not exists review_replies_review_idx on public.review_replies(review_id, created_at);

-- Keep updated_at consistent with existing tables.
drop trigger if exists review_replies_set_updated_at on public.review_replies;
create trigger review_replies_set_updated_at
before update on public.review_replies
for each row execute function public.set_updated_at();

-- Direct access is intentionally disabled. RPCs below expose only safe operations.
revoke all on table public.review_likes from anon, authenticated;
revoke all on table public.review_replies from anon, authenticated;

-- 6) Stats: hidden reviews never affect the score -----------------------------
create or replace view public.review_stats
with (security_invoker = true)
as
select
  count(*)::integer as total_ratings,
  round(avg(rating), 1) as average_rating,
  count(*) filter (where rating >= 7)::integer as positive_ratings,
  case
    when count(*) < 5 then null::integer
    else round(count(*) filter (where rating >= 7)::numeric * 100.0 / count(*)::numeric)::integer
  end as freshness
from public.reviews
where is_hidden = false;

grant select on public.review_stats to anon, authenticated;

-- 7) Public sanitized feed functions -----------------------------------------
create or replace function public.get_public_reviews_v2(
  p_sort text default 'new',
  p_limit integer default 40,
  p_offset integer default 0
)
returns table (
  id uuid,
  rating smallint,
  review_text text,
  created_at timestamptz,
  updated_at timestamptz,
  alias_code text,
  alias_number integer,
  display_name text,
  avatar_seed integer,
  avatar_style smallint,
  is_official boolean,
  is_pinned boolean,
  like_count integer,
  reply_count integer
)
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  with base as (
    select
      r.id, r.rating, r.review_text, r.created_at, r.updated_at,
      p.alias_code, p.alias_number, p.display_name, p.avatar_seed, p.avatar_style, p.is_official,
      r.is_pinned,
      (select count(*)::integer from public.review_likes l where l.review_id = r.id) as like_count,
      (select count(*)::integer from public.review_replies rr where rr.review_id = r.id and rr.is_hidden = false) as reply_count
    from public.reviews r
    join public.profiles p on p.id = r.user_id
    where r.is_hidden = false
  )
  select * from base
  order by
    is_pinned desc,
    case when p_sort = 'old' then created_at end asc,
    case when p_sort = 'popular' then like_count end desc,
    case when p_sort = 'high' then rating end desc,
    case when p_sort = 'low' then rating end asc,
    created_at desc
  limit greatest(1, least(coalesce(p_limit,40), 100))
  offset greatest(coalesce(p_offset,0), 0);
$$;
revoke all on function public.get_public_reviews_v2(text, integer, integer) from public;
grant execute on function public.get_public_reviews_v2(text, integer, integer) to anon, authenticated;

create or replace function public.get_public_replies_v1(p_review_id uuid)
returns table (
  id uuid,
  review_id uuid,
  reply_text text,
  created_at timestamptz,
  updated_at timestamptz,
  alias_code text,
  alias_number integer,
  display_name text,
  avatar_seed integer,
  avatar_style smallint,
  is_official boolean
)
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select
    rr.id, rr.review_id, rr.reply_text, rr.created_at, rr.updated_at,
    p.alias_code, p.alias_number, p.display_name, p.avatar_seed, p.avatar_style, p.is_official
  from public.review_replies rr
  join public.profiles p on p.id = rr.user_id
  join public.reviews r on r.id = rr.review_id
  where rr.review_id = p_review_id
    and rr.is_hidden = false
    and r.is_hidden = false
  order by p.is_official desc, rr.created_at asc;
$$;
revoke all on function public.get_public_replies_v1(uuid) from public;
grant execute on function public.get_public_replies_v1(uuid) to anon, authenticated;

create or replace function public.get_public_stats_v2()
returns jsonb
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select jsonb_build_object(
    'total_ratings', count(*)::integer,
    'average_rating', round(avg(rating), 1),
    'positive_ratings', count(*) filter (where rating >= 7)::integer,
    'freshness', case
      when count(*) < 5 then null
      else round(count(*) filter (where rating >= 7)::numeric * 100.0 / count(*)::numeric)::integer
    end
  )
  from public.reviews
  where is_hidden = false;
$$;
revoke all on function public.get_public_stats_v2() from public;
grant execute on function public.get_public_stats_v2() to anon, authenticated;

-- 8) User state and atomic writes --------------------------------------------
create or replace function public.get_my_community_state_v2()
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_profile jsonb;
  v_review jsonb;
  v_likes jsonb;
  v_replies jsonb;
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  select to_jsonb(p) - 'created_at' - 'updated_at'
  into v_profile
  from public.profiles p where p.id = v_uid;

  select to_jsonb(r)
  into v_review
  from public.reviews r where r.user_id = v_uid;

  select coalesce(jsonb_agg(l.review_id), '[]'::jsonb)
  into v_likes
  from public.review_likes l where l.user_id = v_uid;

  select coalesce(jsonb_agg(jsonb_build_object(
      'id', rr.id,
      'review_id', rr.review_id,
      'reply_text', rr.reply_text,
      'created_at', rr.created_at,
      'updated_at', rr.updated_at
    )), '[]'::jsonb)
  into v_replies
  from public.review_replies rr where rr.user_id = v_uid;

  return jsonb_build_object(
    'profile', v_profile,
    'review', v_review,
    'likes', v_likes,
    'replies', v_replies
  );
end;
$$;
revoke all on function public.get_my_community_state_v2() from public, anon;
grant execute on function public.get_my_community_state_v2() to authenticated;

create or replace function public.submit_my_review_v4(
  p_rating smallint,
  p_review_text text,
  p_display_name text,
  p_alias_code text,
  p_alias_number integer,
  p_avatar_seed integer,
  p_avatar_style smallint
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_profile public.profiles;
  v_review public.reviews;
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if p_rating < 0 or p_rating > 10 then
    raise exception 'Rating must be between 0 and 10' using errcode = '22023';
  end if;

  insert into public.profiles(id, display_name, alias_code, alias_number, avatar_seed, avatar_style)
  values (v_uid, p_display_name, p_alias_code, p_alias_number, p_avatar_seed, p_avatar_style)
  on conflict (id) do update set
    display_name = excluded.display_name,
    alias_code = excluded.alias_code,
    alias_number = excluded.alias_number,
    avatar_seed = excluded.avatar_seed,
    avatar_style = excluded.avatar_style
  returning * into v_profile;

  insert into public.reviews(user_id, rating, review_text)
  values (v_uid, p_rating, coalesce(p_review_text,''))
  on conflict (user_id) do update set
    rating = excluded.rating,
    review_text = excluded.review_text
  returning * into v_review;

  return jsonb_build_object(
    'profile', to_jsonb(v_profile) - 'created_at' - 'updated_at',
    'review', to_jsonb(v_review)
  );
end;
$$;
revoke all on function public.submit_my_review_v4(smallint,text,text,text,integer,integer,smallint) from public, anon;
grant execute on function public.submit_my_review_v4(smallint,text,text,text,integer,integer,smallint) to authenticated;

create or replace function public.update_my_profile_v4(
  p_display_name text,
  p_alias_code text,
  p_alias_number integer,
  p_avatar_seed integer,
  p_avatar_style smallint
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_profile public.profiles;
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  insert into public.profiles(id, display_name, alias_code, alias_number, avatar_seed, avatar_style)
  values (v_uid, p_display_name, p_alias_code, p_alias_number, p_avatar_seed, p_avatar_style)
  on conflict (id) do update set
    display_name = excluded.display_name,
    alias_code = excluded.alias_code,
    alias_number = excluded.alias_number,
    avatar_seed = excluded.avatar_seed,
    avatar_style = excluded.avatar_style
  returning * into v_profile;

  return to_jsonb(v_profile) - 'created_at' - 'updated_at';
end;
$$;
revoke all on function public.update_my_profile_v4(text,text,integer,integer,smallint) from public, anon;
grant execute on function public.update_my_profile_v4(text,text,integer,integer,smallint) to authenticated;

create or replace function public.delete_my_review_v4()
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_deleted integer;
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  delete from public.reviews where user_id = v_uid;
  get diagnostics v_deleted = row_count;
  return jsonb_build_object('deleted', v_deleted > 0);
end;
$$;
revoke all on function public.delete_my_review_v4() from public, anon;
grant execute on function public.delete_my_review_v4() to authenticated;

create or replace function public.toggle_review_like_v1(p_review_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_liked boolean;
  v_count integer;
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if not exists (select 1 from public.reviews where id = p_review_id and is_hidden = false) then
    raise exception 'Review not found' using errcode = 'P0002';
  end if;

  if exists (select 1 from public.review_likes where review_id = p_review_id and user_id = v_uid) then
    delete from public.review_likes where review_id = p_review_id and user_id = v_uid;
    v_liked := false;
  else
    insert into public.review_likes(review_id,user_id) values (p_review_id,v_uid)
    on conflict do nothing;
    v_liked := true;
  end if;

  select count(*)::integer into v_count from public.review_likes where review_id = p_review_id;
  return jsonb_build_object('liked', v_liked, 'like_count', v_count);
end;
$$;
revoke all on function public.toggle_review_like_v1(uuid) from public, anon;
grant execute on function public.toggle_review_like_v1(uuid) to authenticated;

create or replace function public.save_review_reply_v1(p_review_id uuid, p_text text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_reply public.review_replies;
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if char_length(trim(coalesce(p_text,''))) < 1 or char_length(p_text) > 1200 then
    raise exception 'Reply must contain 1-1200 characters' using errcode = '22023';
  end if;
  if not exists (select 1 from public.reviews where id = p_review_id and is_hidden = false) then
    raise exception 'Review not found' using errcode = 'P0002';
  end if;

  -- A user profile may not exist if the first action is a like/reply. The client
  -- creates it atomically before this call; fail loudly if it somehow does not.
  if not exists (select 1 from public.profiles where id = v_uid) then
    raise exception 'Profile required' using errcode = 'P0002';
  end if;

  insert into public.review_replies(review_id,user_id,reply_text)
  values (p_review_id,v_uid,trim(p_text))
  on conflict (review_id,user_id) do update set
    reply_text = excluded.reply_text,
    is_hidden = false
  returning * into v_reply;

  return to_jsonb(v_reply);
end;
$$;
revoke all on function public.save_review_reply_v1(uuid,text) from public, anon;
grant execute on function public.save_review_reply_v1(uuid,text) to authenticated;

create or replace function public.delete_review_reply_v1(p_reply_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_deleted integer;
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  delete from public.review_replies
  where id = p_reply_id and (user_id = v_uid or public.is_admin_v1());
  get diagnostics v_deleted = row_count;
  return jsonb_build_object('deleted', v_deleted > 0);
end;
$$;
revoke all on function public.delete_review_reply_v1(uuid) from public, anon;
grant execute on function public.delete_review_reply_v1(uuid) to authenticated;

-- 9) Admin operations ---------------------------------------------------------
create or replace function public.admin_ensure_official_profile_v1(p_display_name text default 'Команда фильма')
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_profile public.profiles;
begin
  if v_uid is null or not public.is_admin_v1() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  insert into public.profiles(id,display_name,alias_code,alias_number,avatar_seed,avatar_style,is_official)
  values (v_uid,p_display_name,'official_team',null,2045,6,true)
  on conflict (id) do update set
    display_name = excluded.display_name,
    alias_code = excluded.alias_code,
    alias_number = null,
    avatar_seed = excluded.avatar_seed,
    avatar_style = excluded.avatar_style,
    is_official = true
  returning * into v_profile;
  return to_jsonb(v_profile) - 'created_at' - 'updated_at';
end;
$$;
revoke all on function public.admin_ensure_official_profile_v1(text) from public, anon;
grant execute on function public.admin_ensure_official_profile_v1(text) to authenticated;

create or replace function public.admin_get_reviews_v1()
returns table (
  id uuid,
  rating smallint,
  review_text text,
  created_at timestamptz,
  updated_at timestamptz,
  display_name text,
  is_pinned boolean,
  is_hidden boolean,
  like_count integer,
  reply_count integer
)
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
begin
  if auth.uid() is null or not public.is_admin_v1() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  return query
  select r.id,r.rating,r.review_text,r.created_at,r.updated_at,p.display_name,r.is_pinned,r.is_hidden,
    (select count(*)::integer from public.review_likes l where l.review_id=r.id),
    (select count(*)::integer from public.review_replies rr where rr.review_id=r.id and rr.is_hidden=false)
  from public.reviews r
  join public.profiles p on p.id=r.user_id
  order by r.is_pinned desc, r.created_at desc;
end;
$$;
revoke all on function public.admin_get_reviews_v1() from public, anon;
grant execute on function public.admin_get_reviews_v1() to authenticated;

create or replace function public.admin_set_review_flags_v1(p_review_id uuid, p_hidden boolean, p_pinned boolean)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare v_row public.reviews;
begin
  if auth.uid() is null or not public.is_admin_v1() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  update public.reviews set is_hidden=coalesce(p_hidden,is_hidden), is_pinned=coalesce(p_pinned,is_pinned)
  where id=p_review_id returning * into v_row;
  if not found then raise exception 'Review not found' using errcode='P0002'; end if;
  return to_jsonb(v_row);
end;
$$;
revoke all on function public.admin_set_review_flags_v1(uuid,boolean,boolean) from public, anon;
grant execute on function public.admin_set_review_flags_v1(uuid,boolean,boolean) to authenticated;

create or replace function public.admin_delete_review_v1(p_review_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare v_deleted integer;
begin
  if auth.uid() is null or not public.is_admin_v1() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  delete from public.reviews where id=p_review_id;
  get diagnostics v_deleted=row_count;
  return jsonb_build_object('deleted',v_deleted>0);
end;
$$;
revoke all on function public.admin_delete_review_v1(uuid) from public, anon;
grant execute on function public.admin_delete_review_v1(uuid) to authenticated;

-- Old experimental RPCs are no longer part of the public client contract.
drop function if exists public.ensure_my_profile(text, integer, smallint);
drop function if exists public.update_my_profile(text, integer, smallint);
drop function if exists public.save_my_review(smallint, text);
drop function if exists public.delete_my_review();

-- 9) Public filter: reviews with an official team reply -----------------------
create or replace function public.get_public_reviews_v3(
  p_sort text default 'new', p_filter text default 'all',
  p_limit integer default 40, p_offset integer default 0
)
returns table (
  id uuid, rating smallint, review_text text, created_at timestamptz, updated_at timestamptz,
  alias_code text, alias_number integer, display_name text, avatar_seed integer,
  avatar_style smallint, is_official boolean, is_pinned boolean,
  like_count integer, reply_count integer, has_official_reply boolean
)
language sql stable security definer set search_path = pg_catalog, public as $$
with base as (
  select r.id,r.rating,r.review_text,r.created_at,r.updated_at,p.alias_code,p.alias_number,
         p.display_name,p.avatar_seed,p.avatar_style,p.is_official,r.is_pinned,
         (select count(*)::integer from public.review_likes l where l.review_id=r.id) as like_count,
         (select count(*)::integer from public.review_replies rr where rr.review_id=r.id and rr.is_hidden=false) as reply_count,
         exists(select 1 from public.review_replies rr join public.profiles op on op.id=rr.user_id
                where rr.review_id=r.id and rr.is_hidden=false and op.is_official=true) as has_official_reply
  from public.reviews r join public.profiles p on p.id=r.user_id where r.is_hidden=false
), filtered as (
  select * from base where coalesce(p_filter,'all') <> 'official' or has_official_reply=true
)
select * from filtered order by is_pinned desc,
  case when p_sort='old' then created_at end asc,
  case when p_sort='popular' then like_count end desc,
  case when p_sort='high' then rating end desc,
  case when p_sort='low' then rating end asc,
  created_at desc
limit greatest(1,least(coalesce(p_limit,40),100)) offset greatest(coalesce(p_offset,0),0);
$$;
revoke all on function public.get_public_reviews_v3(text,text,integer,integer) from public;
grant execute on function public.get_public_reviews_v3(text,text,integer,integer) to anon, authenticated;

-- 10) Final P14 privacy lockdown ---------------------------------------------
-- Public and anonymous-authenticated clients no longer query raw profile/review
-- tables. All browser access goes through narrow RPCs which either derive the
-- current identity from auth.uid() or return a sanitized public projection.
revoke all privileges on table public.profiles from anon, authenticated;
revoke all privileges on table public.reviews from anon, authenticated;
revoke all privileges on table public.review_stats from anon, authenticated;

-- 11) Performance hardening ---------------------------------------------------
create index if not exists review_likes_user_idx on public.review_likes(user_id);
create index if not exists review_replies_user_idx on public.review_replies(user_id);

drop policy if exists "Users update own review" on public.reviews;
drop policy if exists "Admins update reviews" on public.reviews;
create policy "Owners or admins update reviews"
on public.reviews for update
to authenticated
using (((select auth.uid()) = user_id) or public.is_admin_v1())
with check (((select auth.uid()) = user_id) or public.is_admin_v1());

drop policy if exists "Users delete own review" on public.reviews;
drop policy if exists "Admins delete reviews" on public.reviews;
create policy "Owners or admins delete reviews"
on public.reviews for delete
to authenticated
using (((select auth.uid()) = user_id) or public.is_admin_v1());
