import 'server-only'
import { serviceTiers, serviceExtras } from '../../config/services'

export function generateWhatsAppConfirmMessage(booking: {
  id: string
  customerName: string
  customerPhone: string
  address: string
  postcode?: string | null
  serviceId: string
  confirmedStartAt: string
  confirmedEndAt?: string | null
  selectedExtras?: string[] | null
  notes?: string | null
}) {
  const serviceName = serviceTiers.find((s) => s.id === booking.serviceId)?.name ?? booking.serviceId
  const extras = (booking.selectedExtras || []).map((id) => serviceExtras.find((e) => e.id === id)?.name ?? id)
  const start = new Date(booking.confirmedStartAt).toLocaleString()
  const end = booking.confirmedEndAt ? new Date(booking.confirmedEndAt).toLocaleString() : undefined

  const lines = [
    `Hi ${booking.customerName},`,
    `This is Dominik from Dominik Detailing. Your ${serviceName} booking is confirmed${end ? ` for ${start} - ${end}` : ` for ${start}`}.`,
    `Location: ${booking.address}${booking.postcode ? ' / ' + booking.postcode : ''}`,
  ]

  if (extras.length) lines.push(`Extras: ${extras.join(', ')}`)
  if (booking.notes) lines.push(`Notes: ${booking.notes}`)

  lines.push('', 'If you need to change or cancel, please reply here.');
  lines.push('', 'Thanks — Dominik Detailing')

  return lines.join('\n')
}
