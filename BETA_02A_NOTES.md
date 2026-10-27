# DIVE Commercial Planner — BETA-02A Authentication Foundation

## Scope

- Supabase Auth foundation.
- Closed beta: only pre-created/invited users can request an OTP.
- Email OTP (6 digits), no password.
- Persistent browser session through supabase-js.
- `profiles` table with `ADMIN | TESTER | USER` roles.
- `INVITED | ACTIVE | SUSPENDED` access states.
- RLS: authenticated users can only read their own profile.
- First successful sign-in promotes `INVITED` to `ACTIVE` through a restricted RPC.
- Suspended profiles cannot enter the app.
- No calculation telemetry is written in this patch.
- Consent fields are reserved in the profile schema but the consent screen is deferred to BETA-02B.

## Required dependency

Run before test/build:

```powershell
npm.cmd install @supabase/supabase-js@^2
```

## Environment variables

Local `.env.local`:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
```

Set the same variables in Netlify for production.

Never put a Supabase secret key / legacy service_role key in Vite or Netlify variables exposed to the frontend.

## Supabase setup

1. Run `supabase/migrations/20261023_beta02_auth_foundation.sql` in SQL Editor.
2. Auth > Email Templates > Magic Link: change the message so it displays `{{ .Token }}` as the 6-digit code. Do not use the confirmation URL for the login flow.
3. Create/invite beta users from Authentication > Users.
4. For the project owner/admin, update `public.profiles.role` to `ADMIN` in the Table Editor after the user exists.

## Supabase Auth operational configuration

The DCP authentication contract expects a 6-digit email OTP.

Required Supabase configuration:

- Authentication > Sign In / Providers > Email.
- Email OTP length: `6`.
- Email OTP expiration: `3600` seconds.
- DCP uses `signInWithOtp()` with `shouldCreateUser: false`.
- Beta accounts must be created administratively before the user can request an OTP.
- Do not enable public/self-registration for the closed beta.

### OTP configuration incident

During the first production E2E validation, Supabase was configured to generate 8-digit OTP codes while DCP accepted exactly 6 digits.

This caused valid, recently issued codes to fail verification.

Resolution:

- Supabase Email OTP Length changed from `8` to `6`.
- Email OTP expiration remained at `3600` seconds.
- No authentication engine change was required in DCP.

## Validation

- Unknown/non-invited email cannot create an account from the app.
- Invited user receives OTP.
- Correct OTP opens DCP.
- Session survives refresh.
- Logout returns to login.
- `SUSPENDED` profile is blocked.
- PT/ES switch works on login.
- Existing recreational calculations remain unchanged.
