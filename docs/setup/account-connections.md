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

### Environment variables

After importing the GitHub repo in Vercel, open the new Vercel project:

1. Go to `Settings` -> `Environment Variables`.
2. Check `Production`, `Preview`, and `Development`.
3. Confirm the Supabase integration added the required variables.
4. Redeploy after adding or changing variables.

For this app, the minimum Supabase variables are:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

If the Supabase dashboard gives an anon key rather than a publishable key, use:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Do not expose the service role key with a `NEXT_PUBLIC_` prefix.

If you want to pull Vercel's development variables into this folder, first link
the local repo while authenticated to the separate Vercel account, then run:

```powershell
vercel env pull .env.local --global-config .\.vercel-auth
```

Vercel writes `.env` by default if no filename is provided. This repo uses
`.env.local` for local development.

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
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Vercel production env values should be added in the new Vercel project settings,
or through the CLI while authenticated to the new Vercel account.

Do not commit `.env.local`, Supabase access tokens, database passwords, or
service role keys.
