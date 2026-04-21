import 'server-only'
import { Resend } from 'resend'
import { serviceTiers, serviceExtras } from '../../config/services'

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

  if (!RESEND_API_KEY || !OWNER_NOTIFICATION_EMAIL) {
    // Silent no-op: owner notifications are optional in some environments.
    console.info('Owner notification skipped: RESEND_API_KEY or OWNER_NOTIFICATION_EMAIL not configured')
    return
  }

  // Map IDs to friendly names where possible
  const serviceName = serviceTiers.find((s) => s.id === payload.requestedService)?.name ?? payload.requestedService
  const extrasNames = (payload.selectedExtras || []).map((id) => serviceExtras.find((e) => e.id === id)?.name ?? id)

  const subject = `New booking request — ${payload.customerName}`

  const adminLink = SITE_URL ? `${SITE_URL.replace(/\/$/, '')}/admin/bookings?id=${id}` : undefined

  const html = `
    <div style="font-family:system-ui,Arial;line-height:1.4;color:#111">
      <p>New booking request received (ID: <strong>${id}</strong>).</p>
      <ul>
        <li><strong>Name:</strong> ${payload.customerName}</li>
        <li><strong>Phone:</strong> ${payload.customerPhone}</li>
        <li><strong>Email:</strong> ${payload.customerEmail ?? '—'}</li>
        <li><strong>Service:</strong> ${serviceName}</li>
        <li><strong>Requested:</strong> ${payload.requestedDate ?? '—'} ${payload.requestedTime ?? ''}</li>
        <li><strong>Address / Postcode:</strong> ${payload.address}${payload.postcode ? ' / ' + payload.postcode : ''}</li>
        <li><strong>Extras:</strong> ${extrasNames.length ? extrasNames.join(', ') : 'None'}</li>
      </ul>
      ${payload.notes ? `<p><strong>Notes:</strong> ${payload.notes}</p>` : ''}
      ${adminLink ? `<p><a href="${adminLink}">Open in admin</a></p>` : ''}
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
    const resend = new Resend(RESEND_API_KEY)
    const from = ADMIN_EMAIL ?? `no-reply@${new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'example.com').hostname}`

    await resend.emails.send({
      from,
      to: OWNER_NOTIFICATION_EMAIL,
      subject,
      html,
      text,
    })
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
