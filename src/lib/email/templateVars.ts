import 'server-only'
import { getServiceImageUrl, getServiceTierById, serviceExtras } from '../../config/services'

type BookingRecord = Record<string, unknown>

function ensureString(value: unknown) {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

function getCanonicalSiteUrl(siteUrl?: string | null) {
  const value = ensureString(siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL)
  if (!value || !/^https?:\/\//i.test(value)) return ''
  return value.replace(/\/$/, '')
}

function withFallback(value: string, fallback: string) {
  return value.trim() ? value : fallback
}

function joinParts(parts: string[], fallback: string) {
  const value = parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
  return value || fallback
}

function getServiceId(booking: BookingRecord) {
  return ensureString(booking.requested_service ?? booking.serviceId ?? booking.service_id)
}

function getServiceName(serviceId: string) {
  return getServiceTierById(serviceId)?.name ?? withFallback(serviceId, 'Requested service')
}

function getAddressLine(booking: BookingRecord) {
  return withFallback(ensureString(booking.address ?? booking.addressLine ?? booking.key_collection_address), 'Address pending')
}

function getPostcode(booking: BookingRecord) {
  return ensureString(booking.postcode ?? booking.post_code ?? booking.postCode)
}

function getExtrasList(booking: BookingRecord) {
  const selected = booking.selected_extras ?? booking.selectedExtras ?? booking.extras
  if (!Array.isArray(selected)) return 'None'

  const names = selected
    .map((id) => {
      const value = ensureString(id)
      return serviceExtras.find((extra) => extra.id === value)?.name ?? value
    })
    .filter(Boolean)

  return names.length ? names.join(', ') : 'None'
}

function getRequestedDate(booking: BookingRecord) {
  return withFallback(ensureString(booking.requested_date ?? booking.requestedDate), 'Date pending')
}

function getRequestedTime(booking: BookingRecord) {
  return withFallback(ensureString(booking.requested_time ?? booking.requestedTime), 'Time pending')
}

function getConfirmedDatetime(booking: BookingRecord) {
  const start = ensureString(booking.confirmed_start_at ?? booking.confirmedStartAt)
  if (!start) return 'Confirmed time pending'

  const end = ensureString(booking.confirmed_end_at ?? booking.confirmedEndAt)

  try {
    const startDate = new Date(start)
    const startText = startDate.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    if (!end) return startText

    const endDate = new Date(end)
    const endText = endDate.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    return `${startText} - ${endText}`
  } catch {
    return start
  }
}

function getCalendarUrl(booking: BookingRecord) {
  const start = ensureString(booking.confirmed_start_at ?? booking.confirmedStartAt)
  if (!start) return ''

  const serviceId = getServiceId(booking)
  const serviceName = getServiceName(serviceId)
  const addressLine = getAddressLine(booking)
  const postcode = getPostcode(booking)
  const phone = ensureString(booking.customer_phone ?? booking.customerPhone)

  const startIso = new Date(start).toISOString().replace(/-|:|\./g, '')
  const endValue = ensureString(booking.confirmed_end_at ?? booking.confirmedEndAt)
  const endIso = endValue ? new Date(endValue).toISOString().replace(/-|:|\./g, '') : startIso
  const dates = `${startIso}/${endIso}`

  const details = encodeURIComponent(
    `Address: ${addressLine}${postcode ? ` / ${postcode}` : ''}${phone ? `\nPhone: ${phone}` : ''}`,
  )
  const location = encodeURIComponent(joinParts([addressLine, postcode], addressLine))

  const title = encodeURIComponent(`Dominik Detailing — ${serviceName}`)
  const baseUrl = 'https://www.google.com/calendar/render'
  return `${baseUrl}?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`
}

export function buildCommonTemplateVars(booking: BookingRecord, siteUrl?: string | null) {
  const site = getCanonicalSiteUrl(siteUrl)
  const serviceId = getServiceId(booking)
  const serviceName = getServiceName(serviceId)
  const serviceImage = site ? getServiceImageUrl(serviceId, site) : ''
  const bookingId = ensureString(booking.id)
  const customerName = withFallback(ensureString(booking.customer_name ?? booking.customerName), 'Customer')
  const customerPhone = withFallback(ensureString(booking.customer_phone ?? booking.customerPhone), 'Not provided')
  const customerEmail = withFallback(ensureString(booking.customer_email ?? booking.customerEmail), 'Not provided')
  const addressLine = getAddressLine(booking)
  const postcode = getPostcode(booking)
  const requestedDate = getRequestedDate(booking)
  const requestedTime = getRequestedTime(booking)
  const requestedDatetimeLine = joinParts([requestedDate, requestedTime], 'Requested time pending')
  const locationLine = joinParts([addressLine, postcode], 'Location pending')
  const extrasList = getExtrasList(booking)
  const notes = withFallback(ensureString(booking.notes), 'No notes provided')

  return {
    service_name: serviceName,
    service_image: serviceImage,
    service_image_url: serviceImage,
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_email: customerEmail,
    address_line: addressLine,
    postcode,
    requested_date: requestedDate,
    requested_time: requestedTime,
    requested_datetime_line: requestedDatetimeLine,
    location_line: locationLine,
    extras_list: extrasList,
    extras_line: extrasList,
    notes,
    notes_line: notes,
    booking_id: withFallback(bookingId, 'Pending reference'),
    admin_url: site && bookingId ? `${site}/admin/bookings/${encodeURIComponent(bookingId)}` : '',
    cta_url: site ? `${site}/book${serviceId ? `?service=${encodeURIComponent(serviceId)}` : ''}` : '',
    confirmed_datetime: '',
    confirmed_datetime_line: '',
    calendar_url: '',
  }
}

export function buildRequestedTemplateVars(booking: BookingRecord, siteUrl?: string | null) {
  return buildCommonTemplateVars(booking, siteUrl)
}

export function buildReviewTemplateVars(booking: BookingRecord, siteUrl?: string | null) {
  return buildCommonTemplateVars(booking, siteUrl)
}

export function buildDeclinedTemplateVars(booking: BookingRecord, siteUrl?: string | null) {
  return buildCommonTemplateVars(booking, siteUrl)
}

export function buildConfirmedTemplateVars(booking: BookingRecord, siteUrl?: string | null) {
  const base = buildCommonTemplateVars(booking, siteUrl)
  const confirmedDatetime = getConfirmedDatetime(booking)

  return {
    ...base,
    confirmed_datetime: confirmedDatetime,
    confirmed_datetime_line: confirmedDatetime,
    calendar_url: getCalendarUrl(booking),
  }
}
