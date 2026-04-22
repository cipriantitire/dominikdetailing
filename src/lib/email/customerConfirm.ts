import 'server-only'
import { Resend } from 'resend'
import { serviceTiers, serviceExtras } from '../../config/services'

function escapeHtml(input: unknown) {
  if (input === undefined || input === null) return ''
  const s = String(input)
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export type CustomerConfirmPayload = {
  id: string
  customerName: string
  customerEmail?: string | null
  customerPhone: string
  address: string
  postcode?: string | null
  serviceId: string
  confirmedStartAt: string
  confirmedEndAt?: string | null
  selectedExtras?: string[] | null
  notes?: string | null
}

// Send a confirmation email to the customer. Fails safely when config is missing.
export async function sendCustomerConfirmationEmail(payload: CustomerConfirmPayload) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const RESEND_BOOKINGS_FROM_EMAIL = process.env.RESEND_BOOKINGS_FROM_EMAIL
  const RESEND_REPLY_FROM_EMAIL = process.env.RESEND_REPLY_FROM_EMAIL
  const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL

  const fromEmail = RESEND_BOOKINGS_FROM_EMAIL ?? RESEND_FROM_EMAIL

  if (!RESEND_API_KEY || !fromEmail) {
    console.info('Customer confirmation skipped: RESEND config not present')
    return
  }

  const serviceName = serviceTiers.find((s) => s.id === payload.serviceId)?.name ?? payload.serviceId
  const extrasNames = (payload.selectedExtras || []).map((id) => serviceExtras.find((e) => e.id === id)?.name ?? id)

  const subject = `Your booking with Dominik Detailing — ${serviceName}`

  const start = new Date(payload.confirmedStartAt).toLocaleString()
  const end = payload.confirmedEndAt ? new Date(payload.confirmedEndAt).toLocaleString() : undefined

  const html = `
    <div style="font-family:system-ui,Arial;line-height:1.4;color:#111">
      <p>Hi ${escapeHtml(payload.customerName)},</p>
      <p>Your booking has been confirmed. Details below:</p>
      <ul>
        <li><strong>Service:</strong> ${escapeHtml(serviceName)}</li>
        <li><strong>Date & Time:</strong> ${escapeHtml(start)}${end ? ' — ' + escapeHtml(end) : ''}</li>
        <li><strong>Address:</strong> ${escapeHtml(payload.address)}${payload.postcode ? ' / ' + escapeHtml(payload.postcode) : ''}</li>
        <li><strong>Phone:</strong> ${escapeHtml(payload.customerPhone)}</li>
        <li><strong>Extras:</strong> ${escapeHtml(extrasNames.length ? extrasNames.join(', ') : 'None')}</li>
      </ul>
      <p>You can add this booking to your calendar: <a href="${escapeHtml(generateCalendarLink(payload))}">Add to calendar</a> or download the .ics file from your booking page.</p>
      ${payload.notes ? `<p><strong>Notes:</strong> ${escapeHtml(payload.notes)}</p>` : ''}
      <p>Thanks — Dominik Detailing</p>
    </div>
  `

  const text = [
    `Your booking is confirmed: ${serviceName}`,
    `When: ${start}${end ? ' — ' + end : ''}`,
    `Where: ${payload.address}${payload.postcode ? ' / ' + payload.postcode : ''}`,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const resend = new Resend(RESEND_API_KEY)
    // Resend requires `to` to be a string or array of strings. If customerEmail is missing,
    // skip sending the email.
    if (!payload.customerEmail) {
      console.info('Customer confirmation: no customer email provided, skipping send')
      return
    }

    const sendOpts: Parameters<Resend['emails']['send']>[0] = {
      from: fromEmail,
      to: payload.customerEmail,
      subject,
      html,
      text,
    }

    if (RESEND_REPLY_FROM_EMAIL) {
      // @ts-expect-error - Resend typings allow reply_to but TS may not know
      sendOpts.reply_to = RESEND_REPLY_FROM_EMAIL
    }

    await resend.emails.send(sendOpts)
  } catch (err) {
    console.error('Customer confirmation email failed', { bookingId: payload.id, message: String(err) })
  }
}

// Small helper to generate a Google Calendar quick-add link or ICS fallback link.
// Here we provide a webcal/google link that opens the user's calendar with prefilled details.
function generateCalendarLink(payload: CustomerConfirmPayload): string {
  // Use Google Calendar event creation URL format
  const title = encodeURIComponent(`Dominik Detailing — ${serviceTiers.find((s) => s.id === payload.serviceId)?.name ?? payload.serviceId}`)
  const start = new Date(payload.confirmedStartAt).toISOString().replace(/-|:|\./g, '')
  const end = payload.confirmedEndAt ? new Date(payload.confirmedEndAt).toISOString().replace(/-|:|\./g, '') : ''
  const dates = end ? `${start}/${end}` : `${start}/${start}`
  const details = encodeURIComponent(`Address: ${payload.address}${payload.postcode ? ' / ' + payload.postcode : ''}\nPhone: ${payload.customerPhone}`)
  const location = encodeURIComponent(payload.address + (payload.postcode ? ' ' + payload.postcode : ''))
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`
}
