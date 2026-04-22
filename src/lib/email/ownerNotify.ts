import 'server-only'
import { Resend } from 'resend'
import { serviceTiers, serviceExtras } from '../../config/services'
import { buildRequestedTemplateVars } from './templateVars'
import { sendResendTemplate } from './sendTemplate'

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

export type OwnerNotifyPayload = {
  customerName: string
  customerPhone: string
  customerEmail?: string | null
  address: string
  postcode?: string | null
  requestedService: string
  requestedDate?: string | null
  requestedTime?: string | null
  selectedExtras?: string[] | null
  notes?: string | null
}

// Send a concise owner notification email. This function fails safely when
// email config is missing and never throws for missing envs.
export async function sendOwnerNotification(id: string, payload: OwnerNotifyPayload) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const OWNER_NOTIFICATION_EMAIL = process.env.OWNER_NOTIFICATION_EMAIL
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  const RESEND_ALERTS_FROM_EMAIL = process.env.RESEND_ALERTS_FROM_EMAIL
  const RESEND_REPLY_FROM_EMAIL = process.env.RESEND_REPLY_FROM_EMAIL

  if (!RESEND_API_KEY || !OWNER_NOTIFICATION_EMAIL) {
    // Silent no-op: owner notifications are optional in some environments.
    console.info('Owner notification skipped: RESEND_API_KEY or OWNER_NOTIFICATION_EMAIL not configured')
    return
  }

  // Map IDs to friendly names where possible
  const serviceName = serviceTiers.find((s) => s.id === payload.requestedService)?.name ?? payload.requestedService
  const extrasNames = (payload.selectedExtras || []).map((id) => serviceExtras.find((e) => e.id === id)?.name ?? id)

  const subject = `New booking request — ${payload.customerName}`

  const adminLink = SITE_URL ? `${SITE_URL.replace(/\/$/, '')}/admin/bookings/${encodeURIComponent(id)}` : undefined

  const html = `
    <div style="font-family:system-ui,Arial;line-height:1.4;color:#111">
      <p>New booking request received (ID: <strong>${escapeHtml(id)}</strong>).</p>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(payload.customerName)}</li>
        <li><strong>Phone:</strong> ${escapeHtml(payload.customerPhone)}</li>
        <li><strong>Email:</strong> ${escapeHtml(payload.customerEmail ?? '—')}</li>
        <li><strong>Service:</strong> ${escapeHtml(serviceName)}</li>
        <li><strong>Requested:</strong> ${escapeHtml(payload.requestedDate ?? '—')} ${escapeHtml(payload.requestedTime ?? '')}</li>
        <li><strong>Address / Postcode:</strong> ${escapeHtml(payload.address)}${payload.postcode ? ' / ' + escapeHtml(payload.postcode) : ''}</li>
        <li><strong>Extras:</strong> ${escapeHtml(extrasNames.length ? extrasNames.join(', ') : 'None')}</li>
      </ul>
      ${payload.notes ? `<p><strong>Notes:</strong> ${escapeHtml(payload.notes)}</p>` : ''}
      ${adminLink ? `<p><a href="${escapeHtml(adminLink)}">Open in admin</a></p>` : ''}
      <p style="color:#666;font-size:12px">This is an automated notification from Dominik Detailing.</p>
    </div>
  `

  const text = [
    `New booking request (ID: ${id})`,
    `Name: ${payload.customerName}`,
    `Phone: ${payload.customerPhone}`,
    `Email: ${payload.customerEmail ?? '—'}`,
    `Service: ${serviceName}`,
    `Requested: ${payload.requestedDate ?? '—'} ${payload.requestedTime ?? ''}`,
    `Address: ${payload.address}${payload.postcode ? ' / ' + payload.postcode : ''}`,
    `Extras: ${extrasNames.length ? extrasNames.join(', ') : 'None'}`,
    payload.notes ? `Notes: ${payload.notes}` : undefined,
    adminLink ? `Admin link: ${adminLink}` : undefined,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    // If a Resend template ID is configured prefer sending the template. This
    // allows marketing/HTML templates to be maintained in the Resend dashboard.
    const TEMPLATE_ID = process.env.RESEND_TEMPLATE_OWNER_NEW_BOOKING
    const from = RESEND_ALERTS_FROM_EMAIL ?? process.env.RESEND_FROM_EMAIL ?? ADMIN_EMAIL
    if (!from) {
      console.warn('Owner notification: RESEND_ALERTS_FROM_EMAIL or RESEND_FROM_EMAIL or ADMIN_EMAIL must be configured')
      return
    }

    if (TEMPLATE_ID) {
      // Build template variables and send via template API. Failures are logged
      // inside sendResendTemplate and will not throw here.
      const vars = buildRequestedTemplateVars(
        {
          id,
          requested_date: payload.requestedDate,
          requested_time: payload.requestedTime,
          requested_service: payload.requestedService,
          customer_name: payload.customerName,
          customer_phone: payload.customerPhone,
          customer_email: payload.customerEmail,
          address: payload.address,
          postcode: payload.postcode,
          selected_extras: payload.selectedExtras ?? null,
          notes: payload.notes,
        },
        SITE_URL,
      )
      await sendResendTemplate({ templateId: TEMPLATE_ID, from, to: OWNER_NOTIFICATION_EMAIL, variables: vars, replyTo: RESEND_REPLY_FROM_EMAIL, subjectFallback: subject })
      return
    }

    // Fallback to inline HTML send if no template configured
    const resend = new Resend(RESEND_API_KEY)
    const sendOpts: Parameters<Resend['emails']['send']>[0] = {
      from,
      to: OWNER_NOTIFICATION_EMAIL,
      subject,
      html,
      text,
    }

    // If a reply-to is configured, set it for owner alerts so replies go to a human
    if (RESEND_REPLY_FROM_EMAIL) {
      // @ts-expect-error - Resend typings allow reply_to but TS may not know
      sendOpts.reply_to = RESEND_REPLY_FROM_EMAIL
    }

    await resend.emails.send(sendOpts)
  } catch (err: unknown) {
    // Keep logs generic and do not print secrets or the full payload
    let message = String(err)
    if (err && typeof err === 'object' && err !== null) {
      const obj = err as Record<string, unknown>
      if ('message' in obj && typeof obj.message === 'string') {
        message = obj.message
      } else {
        try {
          message = JSON.stringify(obj)
        } catch {
          message = String(err)
        }
      }
    }
    console.error('Owner notification failed', { bookingId: id, message })
  }
}
