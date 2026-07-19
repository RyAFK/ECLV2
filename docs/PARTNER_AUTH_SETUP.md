# Referring-partner OTP authentication — setup

## How it works

- `/login/partner` calls `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })`.
- The user enters the 6-digit code they receive by email; `/login/partner` calls
  `supabase.auth.verifyOtp({ email, token, type: "email" })` to establish the session.
- No password is ever collected or stored for this flow.
- First-time sign-in creates a bare `eclv2.profiles` row (via the existing
  `eclv2.handle_new_user` trigger, role defaults to `partner`,
  `onboarding_complete = false`) and `/login/partner` routes them to
  `/partner-setup`.
- `/partner-setup` calls the `complete_partner_onboarding` RPC, which creates
  the partner's `eclv2.partners` row and marks `onboarding_complete = true`,
  then routes to `/partner`.
- Returning users with a completed profile go straight to `/partner`.

## ⚠️ Blocker: numeric-code email requires dashboard configuration I don't have access to

This implementation could not complete two required dashboard steps — there is
no Supabase Management API/SMTP-configuration tool available in this session,
only database/Edge-Function/migration tools. **Until these are done, the OTP
emails Supabase sends will be its default "Magic Link" template, which does
not display a numeric code at all** — confirmed via the Supabase docs:

> Modify the template to include the `{{ .Token }}` variable, for example:
> `<h2>One time login code</h2><p>Please enter this code: {{ .Token }}</p>`

So the `/login/partner` code-entry screen will not have a code to receive
until this is done — the auth *mechanism* (`signInWithOtp` / `verifyOtp`) is
fully implemented and correct, but the *email* won't show a token to enter
without this template change.

### Step 1 — Configure custom SMTP

Dashboard → **Authentication → Emails → SMTP Settings** for project
`wszcqjxlkqtjqxyolcos`. Supabase's built-in email sender is rate-limited
(a few emails/hour) and, per this project's requirements, template editing is
gated behind having custom SMTP configured. Use credentials from any
transactional email provider (SendGrid, AWS SES, Postmark, etc.) — these are
credentials only you can supply.

### Step 2 — Edit the OTP / Magic Link template to include `{{ .Token }}`

Dashboard → **Authentication → Emails → Templates → Magic Link**, replace the
content with:

```html
<h2>Your ECL Connect sign-in code</h2>
<p>Enter this one-time code in the referring-partner sign-in screen:</p>
<p style="font-size:28px;font-weight:700;letter-spacing:6px;">
  {{ .Token }}
</p>
<p>This code expires shortly and can only be used once.</p>
```

`signInWithOtp` and the "Magic Link" template are the same underlying Supabase
Auth flow — no separate "OTP template" exists, which is why the Magic Link
template is the one to edit.

### Step 3 — Verify

Once both steps are done, `/login/partner` → enter email → the above email
should arrive with a 6-digit code → entering it on `/login/partner` completes
sign-in. No further app changes are needed; the code already implements the
correct API calls.

## Rate limits to be aware of

Per Supabase's docs, OTP requests default to a limited rate per address/IP
(configurable under **Auth → Providers → Email → Email OTP Expiration** and
**Auth rate limits**) — worth reviewing once real partners start using this
flow, to avoid legitimate users being throttled during testing.
