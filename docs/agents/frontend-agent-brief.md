# Frontend Agent Brief

Target agent: creative frontend/design implementation agent, for example Kimi 2.6.

Workspace: `C:\Users\cipri\Dominik Detailing`

## Read First

Before editing anything, read these files:

- `AGENTS.md`
- `dominik-detailing-agent-handoff.md`
- `docs/setup/account-connections.md`
- `src/config/services.ts`
- Existing routes under `src/app`

Do not read or copy files from `NOCTVM`, `Trading Bot`, or `Portfolio Website`.

## Mission

Build the public-facing Dominik Detailing experience into a premium, mobile-first car detailing website that converts visitors into quote-first booking requests.

The frontend should feel high-end, specific, and practical. This is not a generic SaaS landing page and not a cheap car wash template. It is a mobile detailing business site with a fast quote/booking request flow.

## Product Truths

- This is a quote-first booking system.
- Customers request a preferred date and time.
- The owner confirms manually.
- A submitted request is not a confirmed job.
- Google Calendar is only for confirmed jobs and blocked time.
- Supabase stores requests, statuses, customer details, notes, and workflow metadata.
- No customer accounts in v1.
- No customer dashboard in v1.
- No full slot-booking engine in v1.
- No payments in the first booking path.

Always distinguish:

- `Customer requested`
- `We plan to schedule`

This distinction is mandatory in booking and admin UX.

## Current App State

The project is already scaffolded with:

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- React 19
- `react-hook-form`
- `zod`
- `@supabase/supabase-js`
- `resend`
- `googleapis`

Current public routes:

- `/`
- `/book`

Current useful files:

- `src/app/page.tsx`
- `src/app/book/page.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/config/services.ts`

## Ownership Boundary

You may own and edit:

- `src/app/page.tsx`
- `src/app/book/page.tsx`
- new public routes in `src/app`
- `src/components/**`
- `src/config/site.ts`
- `src/config/services.ts` if service display copy needs refinement
- `src/app/globals.css`
- static/public visual assets when needed

Do not own:

- `.env.local`
- `.vercel`
- `.vercel-auth`
- Supabase secrets
- database passwords
- service role key usage
- backend route security
- Google Calendar credentials

Do not edit Supabase migrations unless explicitly asked.

## Required Public Routes

Build toward these routes:

- `/` home
- `/book` booking request form
- `/services` service tiers and extras
- `/gallery` before/after and results
- `/about` owner/business trust page
- `/contact` direct contact and service area
- `/thank-you` post-submission expectation page
- `/privacy-policy`
- `/terms`

If time is limited, prioritize:

1. `/`
2. `/book`
3. `/thank-you`
4. `/services`
5. `/contact`

## Visual Direction

Core feel:

- premium
- dark
- sharp
- practical
- high contrast
- automotive
- mobile-service trustworthy

Avoid:

- generic AI-looking cyan/purple gradients
- purple or purple-blue dominant themes
- beige/tan/brown dominant themes
- dark blue/slate one-note palettes
- cheap car wash clipart
- vague tech/SaaS blocks
- cards inside cards
- decorative gradient orbs or bokeh blobs
- huge explanatory product copy

Use:

- real car/detailing imagery
- strong lighting contrast
- restrained accent colors
- tactile, workshop/service details
- clear form surfaces
- stable mobile layouts
- border radius 8px or less on cards and buttons

The current starter uses black, off-white, red, and green accents. You may refine it, but keep the result premium and not one-note.

## Image Requirements

The site must include images.

Acceptable for v1:

- remote high-quality car/detailing images
- local images placed in `public/`
- placeholders that are clearly easy to replace later

Do not reuse the same image for unrelated sections.

Use `next/image` for optimized images.

If using remote images, ensure `next.config.ts` allows the image host.

Do not build the whole visual system out of SVG decorations.

## Homepage Requirements

Homepage should include:

- top trust/contact strip or compact header
- clear brand mark text: `Dominik Detailing`
- hero with primary CTA to request a quote
- quick booking/request entry that routes to `/book`
- service tiers overview
- trust indicators
- before/after teaser
- reviews/testimonials
- service area section
- FAQ
- final CTA
- footer

Hero goal:

- user immediately understands this is mobile detailing
- user can start a quote quickly
- the page feels premium before any scrolling

Hero quick request fields:

- postcode or location
- preferred date
- preferred time window
- service interest

These can pass query params into `/book`.

Example route:

```txt
/book?postcode=LU1&date=2026-05-02&time=morning&service=maintenance-detail
```

## Booking Page Requirements

The booking page must make request submission feel fast, but honest.

Required fields:

- name
- phone
- email
- vehicle
- postcode or address
- service tier
- extras
- preferred date
- preferred time window
- notes

Recommended vehicle fields:

- make
- model
- registration
- vehicle size
- condition note

UX copy must say:

- this is a request, not an instant confirmed booking
- the owner will confirm manually
- preferred time may be adjusted

Do not imply that the slot is guaranteed.

## Booking Form Integration Contract

When backend is ready, the form should submit this shape, or the closest agreed version:

```ts
type PublicBookingRequestInput = {
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

Frontend validation is for UX only. Backend validation is mandatory and authoritative.

Use:

- React Hook Form
- Zod
- clear inline errors
- submit loading state
- success redirect or thank-you state

Do not fake persistence once the backend exists. If submission fails, show a useful human message.

## Services Content

Start with `src/config/services.ts`.

Current tiers:

- Maintenance detail
- Deep interior reset
- Paint enhancement

You may refine service copy, but do not invent a full pricing system. V1 can use "from" prices and quote-first language.

Extras are scope-capture tools as much as upsells:

- pet hair
- heavy dirt
- sand
- stain removal
- odour treatment
- engine bay
- leather treatment
- ceramic sealant
- large SUV / 7 seater

## Admin Frontend

Do not prioritize admin visuals until public booking is functional.

When admin begins, keep it simple:

- `/admin/bookings`
- `/admin/bookings/[id]`

Owner language must be non-technical:

- `New request`
- `Reviewing`
- `Proposed time`
- `Confirmed`
- `Declined`
- `Cancelled`

Never show database jargon to the owner.

## Copy Rules

Write user-facing product copy only.

Do not write copy that explains the interface itself, for example:

- "This section shows..."
- "This page has..."
- "Our form allows..."

Preferred tone:

- direct
- premium
- calm
- local service
- practical

Avoid:

- generic marketing filler
- hype
- AI-sounding luxury copy
- fake claims
- fake review names unless clearly placeholder data

## Accessibility

Required:

- semantic HTML
- one `h1` per page
- meaningful alt text
- visible focus states
- large tap targets
- label every input
- do not rely only on color for errors/status
- high contrast text
- no text overflow on mobile

## Responsive Requirements

Mobile-first matters more than desktop flourish.

Test at:

- 375px wide
- 390px wide
- 768px wide
- 1440px wide

Required:

- no horizontal scrolling
- no text clipping
- no overlapping CTAs
- form fields remain easy to tap
- header does not crowd
- hero still leaves the next section discoverable

Do not scale font sizes directly with viewport width.

## Component Suggestions

Create components only when useful. Good candidates:

- `SiteHeader`
- `SiteFooter`
- `HeroRequestForm`
- `ServiceCard`
- `TrustStrip`
- `BeforeAfterPreview`
- `ReviewCard`
- `FaqList`
- `BookingForm`
- `FieldError`
- `StatusBadge`

Keep abstractions small and aligned with current code.

## Suggested Implementation Order

1. Create shared config:
   - `src/config/site.ts`
   - refine `src/config/services.ts`

2. Build layout components:
   - header
   - footer
   - section wrappers if useful

3. Build homepage:
   - hero with quick request
   - service overview
   - trust/results/reviews
   - service area
   - FAQ
   - final CTA

4. Build `/book`:
   - real form UI
   - Zod schema client-side reuse if backend schema exists
   - query param prefill from hero
   - loading and error states

5. Build `/thank-you`:
   - expectation setting
   - call/WhatsApp fallback
   - "request received" language, not "booking confirmed"

6. Add secondary pages:
   - `/services`
   - `/gallery`
   - `/about`
   - `/contact`

7. Run checks:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run build`

## Acceptance Criteria

Frontend work is acceptable when:

- homepage looks premium and specific to detailing
- `/book` is usable on mobile
- request flow clearly says manual confirmation
- no customer auth is introduced
- no fake instant booking is implied
- responsive checks pass
- lint, typecheck, and build pass
- no secrets are read, printed, or committed

## Hard Stops

Stop and ask Ciprian before:

- adding payment logic
- adding customer accounts
- changing backend schema
- changing Vercel/Supabase linking
- committing real contact details that are not confirmed
- using paid third-party APIs
- adding a CMS
- adding a full scheduling/availability engine
