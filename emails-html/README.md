# Dominik Detailing — Email Template System

## Placeholder / Token Convention

All templates use double-curly placeholders that map cleanly to Resend template variables.

### Customer-facing tokens

| Token | Description | Example |
|-------|-------------|---------|
| `{{customer_name}}` | First name or full name | "James" |
| `{{service_name}}` | Human-readable service name | "Premium Detailing" |
| `{{service_image}}` | Absolute URL to the service representative image | `https://www.ddetailing.co.uk/service-images/Premium%20Detailing.png` |
| `{{requested_date}}` | Date the customer requested | "Tuesday, 24 June 2025" |
| `{{requested_time}}` | Time window the customer requested | "Morning (8am - 12pm)" |
| `{{confirmed_datetime}}` | Fully confirmed date and time | "Tuesday, 24 June 2025 at 9:00 AM" |
| `{{address_line}}` | Street address | "12 Baker Street" |
| `{{postcode}}` | Postcode | "NW1 6XE" |
| `{{customer_phone}}` | Customer phone number | "07438 901518" |
| `{{customer_email}}` | Customer email address | "james@example.com" |
| `{{booking_id}}` | Internal booking reference | "req_abc123" |
| `{{extras_list}}` | Comma-separated extras or "None" | "Clay Bar, Leather Treatment" |
| `{{notes}}` | Customer notes (optional) | "Please bring extra towels" |
| `{{cta_url}}` | Primary action link | "https://ddetailing.co.uk/book" |
| `{{calendar_url}}` | Add-to-calendar link | Google Calendar URL |

### Internal / owner tokens

| Token | Description | Example |
|-------|-------------|---------|
| `{{admin_url}}` | Direct link to booking in admin panel | "https://ddetailing.co.uk/admin/bookings/req_abc123" |

## Template Inventory

| File | Audience | Purpose |
|------|----------|---------|
| `booking-request-received.html` | Customer | Reassure request received; set expectation for manual review |
| `booking-review-in-progress.html` | Customer | Show movement; make manual review feel active and premium |
| `booking-confirmed.html` | Customer | Confirm date/time/location; premium confirmation feel |
| `booking-declined.html` | Customer | Respectful decline; guide to rebook or contact |
| `owner-new-booking-alert.html` | Owner / internal | Functional, fast-to-scan operational alert |

## Design System Principles

### Color Palette

| Role | Hex | Usage |
|------|-----|-------|
| Foundation | `#09090d` | Body / outer background |
| Card surface | `#0f0f14` | Content card background |
| Elevated surface | `#141419` | Detail rows, subtle elevation |
| Primary text | `#ffffff` | Headings, key values |
| Secondary text | `#9696a3` | Body copy, descriptions |
| Tertiary text | `#686878` | Labels, captions, metadata |
| Muted text | `#484855` | Fine print, dividers |
| Accent gold | `#c5a059` | Active states, eyebrow tags, highlights |
| CTA blue | `#1d4ed8` | Primary buttons, links, complete states |
| CTA blue hover | `#1e40af` | Button hover (where supported) |
| Border subtle | `#1a1a20` | Dividers, hairline borders |
| Border light | `#2a2a32` | Slightly stronger borders |

### Typography

Email-safe font stack:
```
system-ui, -apple-system, Segoe UI, Arial, sans-serif
```

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| H1 (main headline) | 28px | 700 | `#ffffff` |
| H2 (section headline) | 24px | 700 | `#ffffff` |
| Body | 15px | 400 | `#9696a3` |
| Label / caption | 12px | 600 | `#686878` |
| Eyebrow tag | 11px | 700 | `#c5a059` |
| Button text | 15px | 600 | `#ffffff` |

### Spacing Scale

- Outer padding: `40px 0` (top/bottom of email body)
- Content padding: `32px` (inside the main card)
- Section gap: `24px` between content blocks
- Detail row gap: `12px` between detail items
- Detail row padding: `12px 0`

### Component Patterns

#### Logo
- SVG logo (`logo.svg`) rendered at 40x40px
- Centered above the main card
- Serves as brand anchor

#### Service Image
- Full-width image at the top of the card
- Uses `{{service_image}}` token mapped from `serviceTiers` config and resolved to an absolute site URL for email rendering
- Rounded top corners (`border-radius: 16px 16px 0 0`)
- Creates visual context immediately

#### Masthead
- No longer needed as separate text — the logo handles branding

#### Content Card
- Background: `#0f0f14`
- Border: 1px solid `#1a1a20`
- Border-radius: 16px
- Max-width: 600px

#### Primary CTA Button
- Background: `#1d4ed8`
- Color: `#ffffff`
- Padding: 16px 28px
- Border-radius: 10px
- Font: 15px, 600 weight
- **Full width** (`display:block; text-align:center`)
- Use `width="100%"` on the containing table

#### Secondary Button Row
- Two buttons side-by-side in a single row
- Background: transparent
- Border: 1px solid `#2a2a32`
- Padding: 14px 20px
- Border-radius: 10px
- Gap: 2% spacing between buttons

**Customer-facing secondary actions:**
- Phone icon + Call Us → `tel:+447438901518`
- WhatsApp icon + WhatsApp → `https://wa.me/447438901518`

**Owner-facing secondary actions:**
- Phone icon + Call Customer → `tel:{{customer_phone}}`
- WhatsApp icon + WhatsApp → `https://wa.me/{{customer_phone}}`

#### Detail Row
- Label (left or above): `#686878`, 12px, uppercase, tracking
- Value: `#ffffff`, 15px
- Subtle bottom border on some rows

#### Section Divider
- Full-width horizontal rule
- Color: `#1a1a20`
- Height: 1px

#### Footer
- Social links row: Instagram + Facebook with emoji icons in bordered pills
- Contact details and brand tagline
- Muted text (`#484855`), 12px

#### Progress Stepper
- Table-based layout, 3 columns
- Circle indicators: 32px diameter
- Connecting lines: 2px height, full width of gap
- Labels below each circle
- States:
  - **Active**: gold fill (`#c5a059`), white text, bold label
  - **Complete**: blue fill (`#1d4ed8`), white checkmark, muted label
  - **Upcoming**: grey outline (`#2a2a32`), grey text, muted label

## Email Client Compromises

1. **No custom fonts**: Geist is not email-safe. We use system-ui / Arial.
2. **Table-based layout**: Flexbox and CSS Grid are not supported in many clients. All layout uses `<table>`.
3. **Inline styles + `<style>` block**: The `<style>` block works in Resend's editor and some clients. Inline styles serve as fallbacks for Gmail, Outlook, etc.
4. **Border-radius degradation**: Outlook Windows shows square corners. We accept this graceful degradation.
5. **No animations**: CSS transitions and animations are stripped or ignored by most email clients.
6. **Images optional but present**: Logo and service images are included with alt text fallbacks. If images fail to load, text content remains fully readable.
7. **Dark mode awareness**: Colors are explicitly set on all elements. We do not rely on `prefers-color-scheme`.
8. **Outlook conditionals**: `mso-` prefixed properties and conditional comments used where beneficial for Windows Outlook.
9. **Unicode emoji for icons**: Used instead of icon fonts or SVGs for maximum compatibility across email clients.

## Integration Notes

### Resend Template Setup
1. Create a new template in Resend for each HTML file.
2. Copy the full HTML content into the template editor.
3. Paste the contents of `resend-global-css.css` into the Global CSS panel.
4. Replace placeholder tokens with Resend template variables (e.g., `{{customer_name}}` → `{{customer_name}}` in Resend syntax is compatible).
5. Set the subject line per template in your sending code.

### Subject Line Suggestions

| Template | Subject |
|----------|---------|
| booking-request-received | "We received your request — Dominik Detailing" |
| booking-review-in-progress | "Your booking is under review — Dominik Detailing" |
| booking-confirmed | "Your booking is confirmed — Dominik Detailing" |
| booking-declined | "Update on your booking request — Dominik Detailing" |
| owner-new-booking-alert | "New booking request: {{customer_name}} — {{service_name}}" |

### Service Image Mapping

When wiring the backend, map `serviceId` to the corresponding image path from `src/config/services.ts` and convert it to an absolute URL using `getServiceImageUrl(serviceId, NEXT_PUBLIC_SITE_URL)`:

| Service ID | Image URL Field |
|------------|-----------------|
| premium-detailing | `/service-images/Premium%20Detailing.png` |
| full-valet | `/service-images/Full%20Valet.png` |
| mini-valet | `/service-images/Mini%20Valet.png` |
| machine-polish | `/service-images/Machine%20Polish.png` |
| ceramic-coating | `/service-images/Ceramic%20Coating.png` |
| maintenance-wash | `/service-images/Maintenance%20Wash.png` |

Pass this as `{{service_image}}` when rendering the template.

### Backend Wiring

1. **Wire the existing email senders** — Update `src/lib/email/customerConfirm.ts` and `src/lib/email/ownerNotify.ts` to load these HTML templates as strings (or store them in Resend Templates) and interpolate the tokens with real booking data.
2. **Add new email triggers** — Create `sendBookingRequestReceivedEmail()` and `sendBookingDeclinedEmail()` functions in `src/lib/email/` to cover the full lifecycle.
3. **Resend Template upload** — Copy each HTML file into Resend's template editor, replace tokens with Resend template variables, and reference the template ID from code.
4. **Subject line mapping** — Set subjects in the sending code (suggestions are above).
5. **Reply-to configuration** — Ensure `RESEND_REPLY_FROM_EMAIL` is set so customer replies reach the owner.
