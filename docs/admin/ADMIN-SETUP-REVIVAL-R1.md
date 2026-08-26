# One-time admin setup

The admin UI is at `/admin/`, but an admin account is intentionally **not** bundled
with the website and no password is stored in GitHub.

## Step 1 — create your private Auth user
In the OLD Supabase project `xltwwvutqkpmtmlavngi`:

1. Authentication → Users.
2. Add user.
3. Use a private email that will be used only for administration.
4. Set a unique password (do not reuse another password).
5. Copy the created user's UUID/UID.

## Step 2 — enroll that UID as an administrator
Send ChatGPT the UID (the UUID only; never send the password), or add it with a
trusted SQL/admin tool to `public.admins(user_id)`.

The site checks `is_admin_v1()` on every administrative RPC. Knowing `/admin/`
alone does not grant any privileges.

## Step 3 — sign in
Open:
`https://cryo-zero.github.io/hishchenie-film/admin/`

Enter the admin email/password. The credentials go directly from the browser to
Supabase Auth. They are not placed in the repository.

## Security notes
- Do not make the anonymous visitor profile an administrator.
- Do not commit an admin password, service-role key or secret API key to GitHub.
- The public `sb_publishable_...` key in the frontend is expected to be public; authorization is enforced server-side.
