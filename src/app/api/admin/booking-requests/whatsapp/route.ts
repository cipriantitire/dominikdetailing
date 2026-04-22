import 'server-only'
import { NextResponse } from 'next/server'
import { isAdminAuthorized } from '../../../../../lib/auth/admin'
import { getBookingRequestById } from '../../../../../lib/supabase/adminReads'
import { generateWhatsAppConfirmMessage } from '../../../../../lib/whatsapp/confirmMessage'

export async function GET(req: Request) {
  try {
    if (!(await isAdminAuthorized(req))) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 })

    const booking = await getBookingRequestById(id)
    if (!booking) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
    if (booking.status !== 'confirmed' || !booking.confirmed_start_at) return NextResponse.json({ ok: false, error: 'Booking not confirmed' }, { status: 400 })

    const message = generateWhatsAppConfirmMessage({
      id: booking.id,
      customerName: booking.customer_name,
      customerPhone: booking.customer_phone,
      address: booking.address,
      postcode: booking.postcode,
      serviceId: booking.requested_service,
      confirmedStartAt: booking.confirmed_start_at,
      confirmedEndAt: booking.confirmed_end_at ?? null,
      selectedExtras: booking.selected_extras ?? null,
      notes: booking.notes ?? null,
    })

    return NextResponse.json({ ok: true, message })
  } catch (err) {
    console.error('WhatsApp message error', err)
    return NextResponse.json({ ok: false, error: 'Could not generate message' }, { status: 500 })
  }
}
