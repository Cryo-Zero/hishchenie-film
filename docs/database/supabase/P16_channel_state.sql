-- P16 / public review-channel status.
-- Already applied to production Supabase. Kept here for repository history only.
create or replace function public.get_public_channel_state_v1()
returns jsonb
language sql
stable
security invoker
set search_path = pg_catalog, public
as $$
  select jsonb_build_object(
    'reviews_enabled', has_function_privilege('authenticated', 'public.submit_my_review_v4(smallint,text,text,text,integer,integer,smallint)', 'EXECUTE'),
    'likes_enabled', has_function_privilege('authenticated', 'public.toggle_review_like_v1(uuid)', 'EXECUTE'),
    'replies_enabled', has_function_privilege('authenticated', 'public.save_review_reply_v1(uuid,text)', 'EXECUTE')
  );
$$;
revoke all on function public.get_public_channel_state_v1() from public;
grant execute on function public.get_public_channel_state_v1() to anon, authenticated;
