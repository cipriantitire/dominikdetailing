# Dominik Detailing — Product, Design, and Technical Handoff

Version: v1 handoff
Owner: Ciprian
Audience: VS Code / Codex agents, frontend agents, backend agents, design agents
Purpose: this document defines the v1 product, UX, architecture, data model, and build priorities for the Dominik Detailing website so agents can start implementation without inventing the system from scratch.

---

## 1. Project summary

Build a premium-looking website for an independent mobile car detailing business.

The site should:
- look custom and high-end
- be SEO-friendly
- convert visitors into quote/booking requests quickly
- let the owner manage incoming requests without touching a database
- avoid overbooking in a simple, reliable way
- be cheap to host and easy to evolve

This is **not** a full marketplace or SaaS booking platform.

### v1 principle
Build a **quote-first booking system** with a lightweight admin panel.

Customers submit a preferred date/time and service request.
The owner reviews it, adjusts it if needed, then confirms it manually.
Only after confirmation should the booking be pushed into Google Calendar.

---

## 2. Product goals

### Primary goals
- Capture leads quickly from homepage and booking page
- Let users request a service in under 1–2 minutes
- Let owner review, edit, and confirm bookings from a mini dashboard
- Use Google Calendar as the source of truth for actual confirmed jobs / blocked time
- Keep implementation simple, cheap, and reliable
- Make future Stripe deposits easy to add

### Secondary goals
- Strong local SEO structure
- High mobile conversion
- Clean service tiering with extras
- Good visual trust signals: reviews, before/after gallery, guarantees, business hours, service area

### Non-goals for v1
- No customer accounts
- No customer dashboard
- No self-serve rescheduling by customers
- No full CRM
- No complex fleet / enterprise workflows
- No native mobile app
- No full custom payment engine
- No advanced route optimization / staff scheduling

---

## 3. Core product decision

### Booking model for v1
Use **manual confirmation after request submission**.

Customer flow:
1. customer enters service request
2. system stores booking as pending
3. owner reviews in admin
4. owner may adjust proposed date/time
5. owner contacts customer or sends proposed time
6. owner confirms booking
7. system creates Google Calendar event
8. optional Stripe deposit link can be sent after confirmation

### Why this model
- Much easier than real-time slot booking
- Low risk of overbooking bugs
- Matches the business workflow better
- No need for customer auth or complex scheduling engine
- Still feels professional if the UX is polished

---

## 4. Source of truth model

This is critical.

### Google Calendar = source of truth for actual booked / blocked time
Use one dedicated Google Calendar for business jobs, e.g.:
- `Dominik Detailing Jobs`

That calendar contains:
- confirmed bookings
- blocked personal time / unavailable slots added manually by owner
- other jobs added manually by owner outside the website

### Database = source of truth for requests, status, history, notes
The database stores:
- all submissions
- booking status
- customer details
- requested slot
- proposed slot
- internal notes
- Stripe / calendar metadata

This split keeps the system simple:
- Google Calendar controls real availability
- the DB controls workflow state

---

## 5. Recommended tech stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui or custom component library
- React Hook Form + Zod

### Backend / app logic
- Next.js server actions or route handlers
- Zod validation
- Resend for email notifications
- Google Calendar API for availability checks and event creation
- Stripe Payment Links for deposits later

### Database
- Supabase Postgres

Reason:
- hosted Postgres
- easy dashboard for development
- future auth/storage if ever needed
- good fit for small booking app

### Hosting
- Vercel

### Maps / address support
Pick the cheapest implementation that gets the UX done:
- simple address/postcode text input for v1
- optional address autocomplete later
- optional embedded map preview on booking page, but not required for initial implementation

---

## 6. High-level system architecture

```txt
Customer
  ↓
Next.js website
  ↓
Booking / quote form
  ↓
Server action / API route
  ├─ validate payload
  ├─ store booking in Supabase
  ├─ notify owner by email
  ├─ optionally check Google Calendar free/busy
  └─ return success response

Owner
  ↓
Mini admin dashboard
  ├─ view requests
  ├─ edit proposed date/time
  ├─ change status
  ├─ confirm booking
  ├─ decline booking
  ├─ copy WhatsApp message
  └─ send deposit link later

On confirmation
  ├─ create Google Calendar event
  ├─ save Google event ID in DB
  ├─ send confirmation email
  └─ optionally send Stripe payment link
```

---

## 7. Product phases

### Phase 1 — launch MVP
- marketing website
- homepage hero with quick booking entry
- dedicated booking page / detailed form
- services page
- gallery / testimonials / FAQs / contact
- booking submissions saved in DB
- owner notification email
- mini admin dashboard
- manual confirmation flow
- Google Calendar event creation on confirm

### Phase 2
- lightweight availability checks against Google Calendar free/busy
- warning users when preferred time is likely unavailable
- owner can block out time from admin or simply via Google Calendar
- confirmation email templates improved
- Stripe deposit link flow

### Phase 3
- better rescheduling flow
- owner sends proposed time and tracks awaiting confirmation
- optional direct slot booking for fixed-duration services
- optional customer self-service links

---

## 8. User roles

### Public customer
Can:
- browse site
- view services
- fill quote / booking form
- submit preferred date/time
- contact via phone/WhatsApp/email

Cannot:
- log in
- manage bookings directly in v1

### Owner / admin
Can:
- view requests
- edit bookings before confirmation
- confirm / decline
- see statuses
- open location / phone / maps
- create Google Calendar event on confirm
- later send Stripe deposit link

---

## 9. Booking workflow

### Status model
Use these statuses:
- `new`
- `reviewing`
- `awaiting_customer_confirmation`
- `confirmed`
- `completed`
- `cancelled`
- `declined`

### Preferred v1 workflow
1. user submits form
2. booking saved as `new`
3. owner sees it in dashboard
4. owner reviews details
5. owner edits `scheduled_date` / `scheduled_time_window` if needed
6. owner contacts customer
7. owner clicks confirm when agreed
8. booking becomes `confirmed`
9. system creates Google Calendar event and stores `google_calendar_event_id`

### Important rule
Do **not** create a Google Calendar event until the booking is confirmed.

Reason:
- avoids calendar churn
- avoids messy edits/deletes for uncertain requests
- keeps calendar clean and authoritative

---

## 10. Booking data model

## 10.1 Booking object

```ts
export type BookingStatus =
  | "new"
  | "reviewing"
  | "awaiting_customer_confirmation"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "declined";

export type ServiceTier =
  | "maintenance"
  | "mini_valet"
  | "full_valet"
  | "premium_detail";

export type Booking = {
  id: string;

  customerName: string;
  phone: string;
  email?: string | null;

  serviceTier: ServiceTier;
  extras: string[];

  vehicleMake?: string | null;
  vehicleModel?: string | null;
  registration?: string | null;
  colour?: string | null;
  vehicleSize?: string | null;

  address: string;
  postcode?: string | null;
  keyCollectionAddress?: string | null;

  requestedDate: string;
  requestedTimeWindow: string;

  scheduledDate?: string | null;
  scheduledTimeWindow?: string | null;

  notes?: string | null;
  internalNotes?: string | null;

  status: BookingStatus;

  googleCalendarEventId?: string | null;
  stripePaymentLink?: string | null;
  depositStatus?: "not_sent" | "sent" | "paid" | null;

  createdAt: string;
  updatedAt: string;
};
```

## 10.2 Tables

### `bookings`
Suggested columns:
- `id`
- `customer_name`
- `phone`
- `email`
- `service_tier`
- `extras` (text[] or jsonb)
- `vehicle_make`
- `vehicle_model`
- `registration`
- `colour`
- `vehicle_size`
- `address`
- `postcode`
- `key_collection_address`
- `requested_date`
- `requested_time_window`
- `scheduled_date`
- `scheduled_time_window`
- `notes`
- `internal_notes`
- `status`
- `google_calendar_event_id`
- `stripe_payment_link`
- `deposit_status`
- `created_at`
- `updated_at`

### `service_tiers`
Could be hardcoded initially, but if stored in DB:
- `id`
- `slug`
- `name`
- `short_description`
- `starting_price`
- `display_order`
- `active`

### `extras`
- `id`
- `slug`
- `name`
- `description`
- `price_type` (`fixed`, `from`, `custom_quote`)
- `price_value`
- `display_order`
- `active`

For v1, `service_tiers` and `extras` can live in code config if that is faster.

---

## 11. Services and extras strategy

### Service tiers
Define 4 tiers with extras layered on top.

Suggested naming structure:
1. Maintenance Wash
2. Mini Valet
3. Full Valet
4. Premium Detail

These names can be refined in design/content stage.

### Extras / multiselect options
Include a multiselect in the detailed form for cases that change scope.

Suggested extras:
- Pet hair
- Heavy mud / dirt
- Sand removal
- Stain removal
- Child seat clean
- Odour treatment
- Engine bay clean
- Large SUV / 7 seater surcharge
- Second vehicle
- Heavily soiled interior
- Leather treatment
- Protection add-on

### Important UX note
The extras are not only upsells; they are also a scope-capture tool.
They help the owner price correctly and avoid surprises.

---

## 12. Form UX structure

## 12.1 Hero form
Purpose: low-friction entry point.

Fields:
- Location / postcode
- Preferred date
- Preferred time window
- CTA button: `Book now` or `Get quote`

Behavior:
- should feel instant
- should route user to detailed booking page
- can prefill the full form with hero values

## 12.2 Detailed booking form
Purpose: capture enough detail for owner to assess and confirm.

Fields:
- Service tier
- Extras multiselect
- Date
- Time window
- Name
- Phone
- Email (optional or required depending on preference)
- Vehicle make
- Vehicle model
- Registration
- Colour
- Car location
- Key location / collection address
- Notes
- Optional discount code (only if business actually uses one)

### Optional additions
- Toggle: key location same as car location
- Toggle: vehicle inside congestion charge zone
- Vehicle size selector
- Optional photo upload in phase 2 if needed

## 12.3 Thank-you state
After submission:
- show clear success message
- explain owner will confirm manually
- set expectation: e.g. within business hours / within 24h
- offer call / WhatsApp CTA for urgent bookings

---

## 13. Availability model

### v1 recommendation
Do not build full real-time slot booking.

Instead:
- user selects preferred date/time
- system accepts request
- owner confirms manually
- optional server-side free/busy check can warn if requested slot looks busy

### Future enhancement
If needed later:
- read Google Calendar free/busy
- generate candidate slots
- filter out blocked windows
- allow direct fixed-slot booking only for certain tiers

### Key server rule
If any availability logic exists, always re-check on the server before confirming.
Never trust the frontend alone.

---

## 14. Google Calendar integration design

### Calendar setup
Create one dedicated Google Calendar for the business.
Example:
- `Dominik Detailing Jobs`

### Use cases
- owner manually adds jobs in Google Calendar → site should treat those slots as busy
- owner confirms website booking → site creates event in calendar
- owner updates confirmed booking time/date from admin → site updates calendar event
- owner cancels confirmed booking → site deletes or marks the event accordingly

### Event creation timing
Only on `confirmed`.

### Event title format
Suggested:
`[Service Tier] — Customer Name — Area`

Example:
`Full Valet — John Smith — Luton`

### Event description should include
- booking ID
- phone
- email
- full address
- vehicle details
- selected extras
- notes
- internal link to admin booking page if possible

### Admin sync rules
- if booking is not confirmed, no event
- if confirmed booking changes time/date, update the existing event if `google_calendar_event_id` exists
- if confirmed booking is cancelled, delete or mark event cancelled

---

## 15. Mini admin dashboard

This is the control panel the owner uses.
He should never touch Supabase directly.

### v1 goal
A very small internal admin page, not a full dashboard product.

### Suggested route
- `/admin/bookings`
- `/admin/bookings/[id]`

### Booking list view
Show columns/cards with:
- customer name
- service tier
- requested slot
- proposed / scheduled slot
- status
- phone
- area
- created at

### Quick actions
- View
- Edit
- Confirm
- Decline
- Mark completed
- Copy WhatsApp message
- Open in Maps

### Booking detail view
Sections:
- Customer info
- Vehicle info
- Service and extras
- Requested date/time
- Proposed / scheduled date/time
- Notes
- Internal notes
- Status controls

### Recommended actions
- Save changes
- Confirm booking
- Decline booking
- Cancel booking
- Mark completed
- Copy customer summary
- Copy WhatsApp proposal text
- Send deposit link later

### UX rule
Show both:
- `Customer requested`
- `We plan to schedule`

This distinction prevents mistakes.

---

## 16. Auth for admin

Keep this very simple.

Options:
- Supabase Auth with a single owner/admin user
- or basic protected admin route via simple auth provider

Recommendation:
- Use proper auth, even for one user
- no public DB access from admin pages without auth checks

No customer auth in v1.

---

## 17. Email / messaging strategy

### Owner notifications
On new booking:
- send email to owner with summary and admin link

### Customer communications
In v1:
- thank-you page immediately after form submit
- optional submission receipt email
- confirmation email after owner confirms
- optional decline / reschedule email later

### WhatsApp strategy
Do not build full WhatsApp Business API integration in v1.

Instead:
- provide a visible WhatsApp CTA on site
- in admin, add a button that copies or opens a prefilled WhatsApp message

Suggested admin message types:
- initial follow-up
- proposed new date/time
- booking confirmed
- deposit request reminder

---

## 18. Payment strategy

### v1 recommendation
No custom payment flow in the booking submission path.

Use:
- manual confirmation first
- Stripe Payment Links later for deposit / balance collection

### v1.5 / phase 2
From admin:
- select booking
- generate / attach deposit link
- send via email or copy to WhatsApp

### Why
This is faster and safer than overbuilding checkout logic before the business needs it.

---

## 19. Content and page map

### Core public pages
- `/` Home
- `/services`
- `/gallery`
- `/about`
- `/contact`
- `/book` or `/booking`
- `/thank-you`
- `/privacy-policy`
- `/terms`

### Home page recommended sections
1. Top info bar
   - phone
   - location/service area
   - operating hours
2. Navbar
3. Hero section with quick booking form
4. Trust strip
   - guarantees
   - years experience
   - certifications if any
5. Service tiers overview
6. Why choose us
7. Before/after gallery teaser
8. Reviews/testimonials
9. Service area / mobile coverage
10. FAQ
11. Final CTA
12. Footer

### Booking page recommended structure
1. Headline + reassurance copy
2. Full booking form
3. Contact info side panel
4. Business hours side panel
5. Why book with us card
6. Optional limited-time offer card
7. FAQ / service area note below if needed

### Services page
Each service card should include:
- name
- short description
- estimated duration (optional)
- ideal customer / use case
- starting price or `from`
- CTA to book / request quote

### Gallery page
- before/after imagery
- clean grid with modal lightbox
- optional category filters later

### Contact page
- phone
- WhatsApp CTA
- email
- service area
- business hours
- contact form or route to booking form

---

## 20. Design direction

### Brand feel
- premium
- mobile luxury service
- clean, modern, trustworthy
- dark UI with blue/cyan accents works well
- avoid generic “cheap car wash” feel

### Visual direction already started
Current design direction appears to be:
- dark/navy background
- car hero imagery with overlay
- cyan/blue CTA accents
- glassy or softly outlined cards
- bold typography
- high-contrast, premium aesthetic

### Design rules
- mobile-first layout
- form must feel effortless
- keep one primary CTA per section
- use generous spacing
- use social proof early
- keep labels explicit and legible
- reduce visual noise around form inputs

### Accessibility / UX notes
- high contrast text
- clear focus states
- large tap targets on mobile
- date/time selectors easy to use on touch
- validation messages concise and human

---

## 21. Figma completion brief

The current Figma work is partially started.
Agents should not invent the whole UI from scratch.
They should extend the template and match the in-progress visual system.

### Must complete in Figma before or alongside implementation
- full homepage layout
- full booking page
- service cards / services page
- gallery page
- about page
- contact page
- thank-you page
- admin layout wireframe (simple, utilitarian)
- mobile breakpoints for all primary pages

### Components to define in Figma
- navbar
- hero
- info bar
- CTA buttons
- form inputs
- select/dropdowns
- multiselect extras
- cards
- testimonials
- service cards
- gallery cards
- FAQ accordion
- status badges for admin
- admin table / list items

### State designs needed
- default form state
- validation error state
- submitting state
- success state
- empty gallery state if needed
- admin empty state
- admin pending state
- admin confirmed state

---

## 22. SEO and local business considerations

### Must-have SEO foundations
- metadata per page
- Open Graph images
- sitemap
- robots
- semantic headings
- optimized internal linking
- image alt text
- location and service keywords used naturally

### Local content priorities
The content should target:
- mobile car detailing
- mobile valeting
- local service area keywords
- premium detailing / ceramic / valet terms if relevant to actual services

### Conversion + SEO balance
Pages should not be thin.
Each core service page should have enough useful content to rank and convert.

---

## 23. Suggested project structure

```txt
src/
  app/
    (public)/
      page.tsx
      services/page.tsx
      gallery/page.tsx
      about/page.tsx
      contact/page.tsx
      booking/page.tsx
      thank-you/page.tsx
    admin/
      bookings/page.tsx
      bookings/[id]/page.tsx
    api/
      bookings/route.ts
      bookings/[id]/route.ts
      bookings/[id]/confirm/route.ts
      bookings/[id]/cancel/route.ts
      calendar/availability/route.ts
  components/
    layout/
    marketing/
    booking/
    admin/
    ui/
  lib/
    db/
    email/
    calendar/
    stripe/
    auth/
    validations/
    utils/
  config/
    services.ts
    extras.ts
    site.ts
  types/
    booking.ts
    service.ts
```

If server actions are preferred, use them consistently.
Avoid mixing too many patterns.

---

## 24. API / server action responsibilities

### Public booking submit
Responsible for:
- validating form payload
- storing booking
- sending owner notification
- returning success

### Booking update from admin
Responsible for:
- editing scheduled fields
- editing notes/status
- preserving history where useful

### Confirm booking
Responsible for:
- setting status to `confirmed`
- creating Google Calendar event
- storing event ID
- sending confirmation email

### Cancel / decline booking
Responsible for:
- updating status
- deleting/updating Google Calendar event if confirmed
- optional customer notification

### Availability check
Optional in phase 1 / more useful in phase 2.
Responsible for:
- reading Google Calendar free/busy for selected day/time
- returning whether the requested slot looks occupied

---

## 25. Validation rules

Basic required fields:
- name
- phone
- service tier
- address/postcode
- requested date
- requested time window

Recommended format validation:
- phone: reasonable UK validation, not overly strict
- email: optional or required depending on business preference
- registration: basic normalization only

Business logic validation:
- disallow impossible dates in the past
- date/time must be present before submission
- if large vehicle selected, ensure pricing copy supports it

---

## 26. Admin UX requirements

The owner is not technical.
The admin must feel extremely simple.

### Principles
- no technical wording
- no database jargon
- obvious buttons
- clear status colors
- mobile usable if possible
- should work well from phone as well as desktop

### Must-have conveniences
- click phone number to call
- click address to open maps
- one-click copy WhatsApp message
- easy edit of date/time before confirm
- obvious confirm button

---

## 27. Copy guidance

Tone:
- premium
- confident
- clear
- not cheesy
- service-focused

Homepage should emphasize:
- convenience
- premium care
- mobile service
- trust
- easy booking

Booking page should emphasize:
- fast request
- no-obligation confirmation
- owner will confirm personally
- flexibility if preferred slot changes

Suggested reassurance lines:
- “Choose your preferred date and time. We’ll confirm your booking shortly.”
- “Need something specific? Add extras and notes so we can price accurately.”
- “Prefer to speak first? Call or WhatsApp us now.”

---

## 28. What not to build yet

Do not build these in v1 unless absolutely necessary:
- customer accounts
- customer booking history page
- full calendar UI inside app
- automated recurring discounts engine
- advanced dispatching / crew assignment
- route planning
- inventory tracking
- full invoice system
- custom payment gateway logic
- broad CMS

---

## 29. Risks and mitigation

### Risk: overengineering
Mitigation:
- keep v1 to request → review → confirm
- skip dashboards for customers
- skip full slot engine

### Risk: owner confusion
Mitigation:
- simple admin language
- requested vs scheduled clearly separated
- Google Calendar only for confirmed jobs

### Risk: calendar sync bugs
Mitigation:
- store Google event ID
- only create events at confirm step
- update/delete by event ID

### Risk: form abandonment
Mitigation:
- use quick hero entry
- prefill detailed form
- keep full form visually light
- show phone/WhatsApp alternative

---

## 30. Launch checklist

### Product
- service tiers finalized
- extras finalized
- service area wording finalized
- confirmation response-time wording finalized

### Design
- homepage complete
- booking page complete
- mobile views complete
- thank-you page complete
- admin wireframe complete

### Technical
- DB schema created
- booking submit flow works
- admin auth works
- owner notifications work
- Google Calendar create/update/delete works
- confirmation flow works
- basic SEO metadata implemented

### Content
- service descriptions written
- FAQs written
- about copy written
- contact details finalized
- legal pages drafted

---

## 31. Agent handoff instructions

### For frontend/design agents
- continue from the existing template and in-progress design language
- do not redesign from zero
- prioritize conversion, readability, and mobile UX
- preserve premium dark aesthetic
- build pages in reusable components

### For backend agents
- implement a lightweight, reliable workflow
- prioritize booking persistence and admin flows over fancy features
- treat Google Calendar as confirmed-job source of truth
- ensure admin can edit before confirm

### For full-stack agents
- deliver a working MVP, not a perfect platform
- keep all architecture decisions aligned with manual confirmation workflow
- do not add customer auth or complex scheduling unless explicitly requested

### For content/copy agents
- keep tone premium and concise
- focus on trust, ease, and convenience
- avoid generic filler copy

---

## 32. Implementation priorities for agents

### Sprint 1
- project scaffold
- design system setup
- homepage and booking page UI
- booking schema and DB setup
- public booking submission

### Sprint 2
- admin auth
- booking list and detail pages
- edit/confirm/decline actions
- owner notification emails

### Sprint 3
- Google Calendar integration
- confirmation flow
- basic SEO pages
- polish and responsiveness

### Sprint 4
- Stripe deposit links
- improved admin utilities
- better confirmation templates

---

## 33. Final product statement

This project should launch as a **premium mobile detailing website with a smart manual-confirmation booking system**, not as a full scheduling platform.

The winning architecture is:
- Next.js frontend
- Supabase for booking records
- Google Calendar for actual confirmed schedule
- mini admin dashboard for owner control
- manual confirmation flow
- Stripe added later for deposits

This keeps the business flexible, cheap to run, easy to manage, and ready to evolve.

