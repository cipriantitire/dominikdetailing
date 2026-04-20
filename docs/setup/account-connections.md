# Account Connections

This repo is ready for separate Vercel and Supabase accounts, but those account
connections require credentials from the new accounts.

## Current GitHub Repo

- GitHub remote: `https://github.com/cipriantitire/dominikdetailing.git`
- Branch: `main`

## Vercel

Use the new Dominik Detailing Vercel account, not the existing global Vercel CLI
login.

Recommended isolated CLI flow:

```powershell
vercel login --global-config .\.vercel-auth
vercel link --yes --project dominikdetailing --global-config .\.vercel-auth
vercel deploy --prod --global-config .\.vercel-auth
```

If the new Vercel account cannot see the GitHub repo, open Vercel in the browser
while logged into the new account, import `cipriantitire/dominikdetailing`, and
authorize the Vercel GitHub app for that repository only.

Never copy a `.vercel` folder from another project.

## Supabase

Use the new Dominik Detailing Supabase account and project only.

From the new Supabase project dashboard, collect:

- Project URL
- anon public key
- service role key
- project ref
- database password

Then link and apply migrations:

```powershell
$env:SUPABASE_ACCESS_TOKEN="paste-new-supabase-access-token"
npx supabase link --project-ref "paste-project-ref" --password "paste-database-password"
npx supabase db push
```

Local app env values go in `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Vercel production env values should be added in the new Vercel project settings,
or through the CLI while authenticated to the new Vercel account.

Do not commit `.env.local`, Supabase access tokens, database passwords, or
service role keys.
