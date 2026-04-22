import 'server-only'
import { getServiceImageUrl, getServiceTierById, serviceExtras } from '../../config/services'

function ensureString(v: unknown) {
  if (v === undefined || v === null) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  return ''
}

function getCanonicalSiteUrl(siteUrl?: string | null) {
  const value = ensureString(siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL)
  if (!value) return ''
  if (!/^https?:\/\//i.test(value)) return ''
  return value.replace(/\/$/, '')
}

function fallbackLine(value: string, fallback: string) {
  return value.trim() ? value : fallback
}

function joinExtras(selected: unknown) {
  if (!selected) return null
  if (Array.isArray(selected)) {
    const ids = selected as unknown[]
    const names = ids.map((id) => {
      const sid = ensureString(id)
      return serviceExtras.find((e) => e.id === sid)?.name ?? sid
    })
    return names.length ? names.join(', ') : null
  }
  return null
}

export function buildCommonTemplateVars(booking: Record<string, unknown>, siteUrl?: string | null) {
  const site = getCanonicalSiteUrl(siteUrl)
  const serviceId = ensureString(booking.requested_service ?? booking.serviceId ?? booking.service_id)

  const service = getServiceTierById(serviceId)
  const serviceName = service?.name ?? serviceId
  const serviceImageUrl = site ? getServiceImageUrl(serviceId, site) : ''

  const extras_line = joinExtras(booking.selected_extras ?? booking.selectedExtras ?? null) ?? 'None'

  const address = ensureString(booking.address ?? booking.key_collection_address)
  const postcode = ensureString(booking.postcode)
  const location_line = fallbackLine(postcode ? `${address}, ${postcode}` : address, 'Location pending')

  const id = ensureString(booking.id)
  const admin_url = site ? `${site.replace(/\/$/, '')}/admin/bookings?id=${encodeURIComponent(id)}` : ''
  const cta_url = site ? `${site.replace(/\/$/, '')}/book` : ''

  return {
    service_image_url: serviceImageUrl,
    service_name: fallbackLine(serviceName, 'Requested service'),
    customer_name: fallbackLine(ensureString(booking.customer_name ?? booking.customerName), 'Customer'),
    customer_phone: fallbackLine(ensureString(booking.customer_phone ?? booking.customerPhone), 'Not provided'),
    customer_email: fallbackLine(ensureString(booking.customer_email ?? booking.customerEmail), 'Not provided'),
    location_line,
    extras_line,
    booking_id: fallbackLine(id, 'Pending reference'),
    notes_line: fallbackLine(ensureString(booking.notes ?? booking.internal_notes), 'No notes provided'),
    admin_url,
    cta_url,
  }
}

export function buildRequestedTemplateVars(booking: Record<string, unknown>, siteUrl?: string | null) {
  const base = buildCommonTemplateVars(booking, siteUrl)
  const date = ensureString(booking.requested_date ?? booking.requestedDate)
  const time = ensureString(booking.requested_time ?? booking.requestedTime)
  const requested_datetime_line = fallbackLine(date && time ? `${date} ${time}` : date || time || '', 'Requested time pending')
  return {
    ...base,
    requested_datetime_line,
  }
}

export function buildReviewTemplateVars(booking: Record<string, unknown>, siteUrl?: string | null) {
  const base = buildCommonTemplateVars(booking, siteUrl)
  const date = ensureString(booking.requested_date ?? booking.requestedDate)
  const time = ensureString(booking.requested_time ?? booking.requestedTime)
  const requested_datetime_line = fallbackLine(date && time ? `${date} ${time}` : date || time || '', 'Requested time pending')
  return {
    ...base,
    requested_datetime_line,
  }
}

export function buildConfirmedTemplateVars(booking: Record<string, unknown>, siteUrl?: string | null) {
  const base = buildCommonTemplateVars(booking, siteUrl)

  const start = ensureString(booking.confirmed_start_at ?? booking.confirmedStartAt)
  const end = ensureString(booking.confirmed_end_at ?? booking.confirmedEndAt)

  let confirmed_datetime_line = ''
  try {
    if (start) {
      const s = new Date(start)
      const e = end ? new Date(end) : null
      const startStr = s.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
      const endStr = e ? e.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : null
      confirmed_datetime_line = endStr ? `${startStr} — ${endStr}` : startStr
    }
  } catch {
    confirmed_datetime_line = start
  }

  const calendar_url = buildCalendarUrl(booking) ?? ''

  return {
    ...base,
    confirmed_datetime_line: fallbackLine(confirmed_datetime_line, 'Confirmed time pending'),
    calendar_url,
  }
}

function buildCalendarUrl(booking: Record<string, unknown>) {
  const start = ensureString(booking.confirmed_start_at ?? booking.confirmedStartAt)
  if (!start) return ''
  const serviceId = ensureString(booking.requested_service ?? booking.serviceId ?? booking.service_id)
  const title = encodeURIComponent(`Dominik Detailing — ${getServiceTierById(serviceId)?.name ?? serviceId}`)
  const startIso = new Date(start).toISOString().replace(/-|:|\./g, '')
  const endVal = ensureString(booking.confirmed_end_at ?? booking.confirmedEndAt)
  const endIso = endVal ? new Date(endVal).toISOString().replace(/-|:|\./g, '') : startIso
  const dates = `${startIso}/${endIso}`
  const address = ensureString(booking.address)
  const postcode = ensureString(booking.postcode)
  const details = encodeURIComponent(`Address: ${address}${postcode ? ' / ' + postcode : ''}`)
  const location = encodeURIComponent(address + (postcode ? ' ' + postcode : ''))
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`
}
