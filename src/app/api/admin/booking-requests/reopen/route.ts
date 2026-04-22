import 'server-only'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { isAdminAuthorized } from '../../../../../lib/auth/admin'
import { getBookingRequestById } from '../../../../../lib/supabase/adminReads'
import { updateBookingRequest } from '../../../../../lib/supabase/adminMutations'

export async function POST(req: Request) {
  try {
    if (!(await isAdminAuthorized(req))) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    let json: unknown
    try {
      json = await req.json()
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
    }

    const schema = z.object({ id: z.string().uuid() })
    const parsed = schema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ ok: false, errors: parsed.error.issues }, { status: 400 })

    const { id } = parsed.data
    const booking = await getBookingRequestById(id)
    if (!booking) return NextResponse.json({ ok: false, error: 'Booking not found' }, { status: 404 })

    if (booking.status !== 'declined' && booking.status !== 'cancelled') {
      return NextResponse.json({ ok: false, error: 'Can only reopen declined or cancelled bookings' }, { status: 400 })
    }

    const updated = await updateBookingRequest(id, { status: 'reviewing' })
    return NextResponse.json({ ok: true, booking: updated })
  } catch (err) {
    console.error('Admin reopen error', err)
    return NextResponse.json({ ok: false, error: 'Could not reopen booking' }, { status: 500 })
  }
}
