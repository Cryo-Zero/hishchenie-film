-- HISHCHENIE / THEFT — PUBLIC RESPONSE v2
-- Applied to Supabase project xltwwvutqkpmtmlavngi on 2026-08-21.
-- Kept in the repository as reproducible schema documentation.

revoke all privileges on table public.profiles from anon, authenticated;
revoke all privileges on table public.reviews from anon, authenticated;
revoke all privileges on table public.review_stats from anon, authenticated;

grant select on table public.profiles to anon, authenticated;
grant insert, update on table public.profiles to authenticated;
grant select on table public.reviews to anon, authenticated;
grant insert, update, delete on table public.reviews to authenticated;
grant select on table public.review_stats to anon, authenticated;

drop policy if exists "Anonymous users create own profile" on public.profiles;
drop policy if exists "Anonymous users update own profile" on public.profiles;
drop policy if exists "Public profiles are readable" on public.profiles;
drop policy if exists "Users create own profile" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;

create policy "Public profiles are readable"
on public.profiles for select to anon, authenticated
using (true);

create policy "Users create own profile"
on public.profiles for insert to authenticated
with check ((select auth.uid()) = id);

create policy "Users update own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "Anonymous users create own review" on public.reviews;
drop policy if exists "Anonymous users update own review" on public.reviews;
drop policy if exists "Anonymous users delete own review" on public.reviews;
drop policy if exists "Reviews are publicly readable" on public.reviews;
drop policy if exists "Users create own review" on public.reviews;
drop policy if exists "Users update own review" on public.reviews;
drop policy if exists "Users delete own review" on public.reviews;

create policy "Reviews are publicly readable"
on public.reviews for select to anon, authenticated
using (true);

create policy "Users create own review"
on public.reviews for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users update own review"
on public.reviews for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users delete own review"
on public.reviews for delete to authenticated
using ((select auth.uid()) = user_id);

alter function public.set_updated_at() set search_path = pg_catalog;
revoke all on function public.set_updated_at() from anon, authenticated;
revoke all on function public.rls_auto_enable() from anon, authenticated;

create or replace function public.ensure_my_profile(
  p_display_name text,
  p_avatar_seed integer,
  p_avatar_style smallint
)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_catalog
as $$
declare
  v_uid uuid := (select auth.uid());
  v_profile public.profiles;
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  insert into public.profiles (id, display_name, avatar_seed, avatar_style)
  values (v_uid, p_display_name, p_avatar_seed, p_avatar_style)
  on conflict (id) do nothing;

  select * into strict v_profile
  from public.profiles
  where id = v_uid;

  return to_jsonb(v_profile);
end;
$$;

create or replace function public.update_my_profile(
  p_display_name text default null,
  p_avatar_seed integer default null,
  p_avatar_style smallint default null
)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_catalog
as $$
declare
  v_uid uuid := (select auth.uid());
  v_profile public.profiles;
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  update public.profiles
  set display_name = coalesce(p_display_name, display_name),
      avatar_seed = coalesce(p_avatar_seed, avatar_seed),
      avatar_style = coalesce(p_avatar_style, avatar_style)
  where id = v_uid
  returning * into v_profile;

  if not found then
    raise exception 'Profile not found' using errcode = 'P0002';
  end if;

  return to_jsonb(v_profile);
end;
$$;

create or replace function public.save_my_review(
  p_rating smallint,
  p_review_text text default ''
)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_catalog
as $$
declare
  v_uid uuid := (select auth.uid());
  v_review public.reviews;
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  insert into public.reviews (user_id, rating, review_text)
  values (v_uid, p_rating, coalesce(p_review_text, ''))
  on conflict (user_id) do update
  set rating = excluded.rating,
      review_text = excluded.review_text
  returning * into v_review;

  return to_jsonb(v_review);
end;
$$;

create or replace function public.delete_my_review()
returns boolean
language plpgsql
security invoker
set search_path = public, pg_catalog
as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  delete from public.reviews where user_id = v_uid;
  return found;
end;
$$;

revoke all on function public.ensure_my_profile(text, integer, smallint) from public, anon;
revoke all on function public.update_my_profile(text, integer, smallint) from public, anon;
revoke all on function public.save_my_review(smallint, text) from public, anon;
revoke all on function public.delete_my_review() from public, anon;

grant execute on function public.ensure_my_profile(text, integer, smallint) to authenticated;
grant execute on function public.update_my_profile(text, integer, smallint) to authenticated;
grant execute on function public.save_my_review(smallint, text) to authenticated;
grant execute on function public.delete_my_review() to authenticated;
