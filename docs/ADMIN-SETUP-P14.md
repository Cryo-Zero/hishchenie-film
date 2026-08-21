# P14 admin activation

The admin page is included at `/admin/`, but no admin credential is shipped in GitHub.

## Safe activation
1. In Supabase Authentication create a normal email/password user for the film team.
2. Copy that user's UUID.
3. Add the UUID to `public.admins` with role `owner`, `editor`, or `moderator`.
4. Open `/admin/` and log in with that account.

Example SQL for step 3 (replace the UUID):

```sql
insert into public.admins (user_id, role)
values ('YOUR-ADMIN-USER-UUID'::uuid, 'owner')
on conflict (user_id) do update set role = excluded.role;
```

Never place the password, service_role key, or secret key in GitHub.

The panel supports:
- view reviews;
- pin/unpin;
- hide/restore;
- delete;
- reply as `КОМАНДА ФИЛЬМА · OFFICIAL`.
