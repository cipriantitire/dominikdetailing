# Backend Agent Brief

Target agent: backend/data implementation agent. This can be handled by a lower-cost model if it follows this brief exactly.

Workspace: `C:\Users\cipri\Dominik Detailing`

## Read First

Before editing anything, read:

- `AGENTS.md`
- `dominik-detailing-agent-handoff.md`
- `docs/setup/account-connections.md`
- `.env.example`
- `supabase/migrations/001_initial_booking_requests.sql`
- `src/config/services.ts`

Do not read or copy files from `NOCTVM`, `Trading Bot`, or `Portfolio Website`.

Do not print `.env.local` contents.

## Mission

Implement the reliable backend foundation for a quote-first booking workflow:

1. Supabase stores booking requests.
2. Public submissions are validated on the server.
3. Owner can later review and confirm manually.
4. Google Calendar events are created only after owner confirmation.

For the immediate task, focus on table creation and safe app database access. Do not overbuild admin, email, or calendar until requested.

## Product Truths

- Supabase is the source of truth for requests and workflow state.
- Google Calendar is the source of truth for confirmed jobs and blocked time.
- Do not create Google Calendar events for pending requests.
- No customer auth in v1.
- No full public slot-booking engine in v1.
- Owner/admin auth is required before admin routes become usable.

## Current Backend State

Installed packages:

- `@supabase/supabase-js`
- `zod`
- `resend`
- `googleapis`

Existing migration:

- `supabase/migrations/001_initial_booking_requests.sql`

Current migration creates:

- enum `booking_status`
- table `booking_requests`
- indexes
- `updated_at` trigger

Current app has no live database code yet.

## Canonical V1 Table

Use `booking_requests` as the canonical v1 table.

Do not create a separate `bookings` table unless Ciprian explicitly approves it. The handoff uses both "bookings" and "booking requests" language, but this repo has started with `booking_requests`.

## Canonical V1 Statuses

Use the enum currently in the migration:

```sql
'pending',
'reviewing',
'proposed',
'confirmed',
'declined',
'cancelled'
```

Frontend/admin copy can translate them:

- `pending` -> `New request`
- `reviewing` -> `Reviewing`
- `proposed` -> `Proposed time`
- `confirmed` -> `Confirmed`
- `declined` -> `Declined`
- `cancelled` -> `Cancelled`

Do not introduce a second status model without migrating cleanly.

## Environment Variables

Local `.env.local` should exist, but do not print it.

Supported Supabase variables:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Use either:

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- or `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Server-only code may use:

- `SUPABASE_SERVICE_ROLE_KEY`

Never expose `SUPABASE_SERVICE_ROLE_KEY` through:

- client components
- `NEXT_PUBLIC_` env vars
- logs
- API responses
- screenshots

Do not use database password env vars in app code unless there is a specific reason. Supabase client access is enough for v1.

## Secret Handling Rules

Allowed:

- check whether `.env.local` exists
- validate that required env var names are present by key only
- throw generic errors for missing env vars

Not allowed:

- print secret values
- commit `.env.local`
- commit `.vercel`
- commit `.vercel-auth`
- expose service role key to browser code
- paste secrets into markdown docs

## Supabase Client Design

Create small server-safe helpers, for example:

```txt
src/lib/supabase/
  server.ts
  public.ts
```

Suggested behavior:

- `public.ts` creates a browser-safe client using URL plus publishable/anon key.
- `server.ts` creates a server-only admin client using URL plus service role key.

Keep service-role imports out of client components.

Use `server-only` if helpful to prevent accidental client bundling.

## Validation Design

Create shared booking validation, for example:

```txt
src/lib/validations/booking.ts
```

Initial public submission shape:

```ts
export type PublicBookingRequestInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  vehicle: string;
  postcode: string;
  requestedService: string;
  selectedExtras: string[];
  requestedDate: string;
  requestedTime: string;
  notes?: string;
};
```

Server validation rules:

- `customerName` required
- `customerPhone` required
- `vehicle` required
- `postcode` required
- `requestedService` required and must match a configured service id or accepted service name
- `requestedDate` required and not in the past
- `requestedTime` required
- `customerEmail` optional but valid email if provided
- `notes` length-limited
- extras must be known ids if used

Frontend validation is only UX. Server validation is authoritative.

## Public Submission API

Recommended route:

```txt
src/app/api/booking-requests/route.ts
```

Responsibilities:

1. Accept `POST`.
2. Parse JSON safely.
3. Validate with Zod.
4. Insert into `booking_requests`.
5. Set `status` to `pending`.
6. Return `{ ok: true, id }`.
7. Return safe validation errors for invalid input.

Do not send the service role key to the client.

Do not create a Google Calendar event here.

Do not trust client-provided status.

Do not allow client to set:

- `internal_notes`
- `google_calendar_event_id`
- `proposed_start_at`
- `proposed_end_at`
- `status`

## Database Mapping

Map public input to table fields:

```txt
customerName       -> customer_name
customerEmail      -> customer_email
customerPhone      -> customer_phone
vehicle            -> vehicle
postcode           -> postcode
requestedService   -> requested_service
requestedDate      -> requested_date
requestedTime      -> requested_time
notes              -> notes
status             -> pending
```

Existing table does not yet include `selected_extras`.

If extras are needed for first working booking submission, add a migration:

```sql
alter table booking_requests
add column if not exists selected_extras text[] not null default '{}';
```

If more structured vehicle data is needed, add later after the form stabilizes. Keep v1 simple.

## Row Level Security

Important: public users should not write directly to Supabase tables from the browser.

Preferred v1 approach:

- enable RLS on `booking_requests`
- add no public insert policy initially
- route all public submissions through a Next.js server route using service role
- later admin reads/writes happen only through authenticated server routes/actions

If `001_initial_booking_requests.sql` has already been applied without RLS, create a follow-up migration:

```sql
alter table booking_requests enable row level security;
```

Do not create broad public `select` policies.

Do not create broad public `insert` policies unless Ciprian explicitly chooses direct browser inserts.

## Table Creation Task

For the immediate "table creation" task:

1. Confirm `.env.local` exists without printing values.
2. Confirm Supabase project is the new Dominik Detailing project.
3. Apply `supabase/migrations/001_initial_booking_requests.sql` in Supabase SQL Editor, or via Supabase CLI if authenticated.
4. If needed, add and apply a follow-up migration for RLS and selected extras.
5. Verify `booking_requests` exists.
6. Verify columns match the app contract.
7. Do not add sample customer data containing real personal info.

If using SQL Editor, paste only migration SQL. Do not paste secrets.

## Admin Backend Later

When admin work begins, create protected routes/actions for:

- list booking requests
- view one booking request
- edit proposed start/end
- edit internal notes
- set status to reviewing/proposed/declined/cancelled
- confirm booking

Confirm booking must:

1. verify admin auth
2. verify requested/proposed time
3. create Google Calendar event
4. store `google_calendar_event_id`
5. set status to `confirmed`

If Google Calendar fails, do not silently mark the booking confirmed unless an explicit manual override is built.

## Email Later

Owner notification can be added after persistence works.

Use Resend later for:

- owner notification on new request
- optional customer receipt
- confirmation email after owner confirms

Do not block core request persistence on email success unless product explicitly requires it.

Recommended approach:

- insert request
- try owner email
- log email failure safely
- still return success if request was saved

## Rate Limiting

Public submission endpoint needs rate limiting once it exists.

Initial options:

- simple IP-based in-memory limiter for development
- Vercel KV or Upstash later if needed
- Supabase-backed rate log if simple enough

Do not overbuild rate limiting before the basic endpoint works, but leave a clear TODO if not implemented.

## Error Handling

Public errors must be safe and human:

- "Please check the highlighted fields."
- "We could not save your request. Please call or WhatsApp us."

Do not return:

- Supabase stack traces
- SQL errors
- env var names beyond generic setup errors
- service role diagnostics

Server logs may include safe context:

- request id
- route name
- validation failure count

Never log full customer notes if avoidable.

## Testing And Verification

Required commands after code changes:

```powershell
npm run lint
npm run typecheck
npm run build
```

For endpoint work, also test:

- valid booking request inserts one row
- missing required fields fail validation
- past date fails validation
- client cannot set status
- client cannot set internal notes

Do not use real customer data in tests.

## Suggested Implementation Order

1. Database safety:
   - confirm migration
   - add RLS follow-up if needed
   - add extras column if form requires it

2. App helpers:
   - env helper
   - server Supabase client
   - public Supabase client if needed

3. Validation:
   - Zod booking schema
   - types inferred from schema

4. Public route:
   - `POST /api/booking-requests`
   - insert `pending` booking request
   - safe success/error responses

5. Frontend integration support:
   - document response shape
   - coordinate with frontend agent

6. Later:
   - admin auth
   - admin list/detail
   - Resend
   - Google Calendar confirmation flow

## Acceptance Criteria

Backend work is acceptable when:

- `booking_requests` table exists in the new Supabase project
- public submission can be saved through a server route
- server-side Zod validation exists
- service role key is server-only
- RLS posture is intentional and documented
- no Google Calendar event is created for pending requests
- no customer auth is introduced
- no secrets are committed or printed
- lint, typecheck, and build pass

## Hard Stops

Stop and ask Ciprian before:

- changing Vercel account/project links
- changing Supabase project links
- adding customer auth
- adding payment processing
- creating Google Calendar events before confirmation
- creating a full availability engine
- replacing `booking_requests` with another table
- exposing direct public table writes from the browser
- committing real secrets
