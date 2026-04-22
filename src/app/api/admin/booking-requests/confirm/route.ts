import 'server-only'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { isAdminAuthorized } from '../../../../../lib/auth/admin'
import { getBookingRequestById } from '../../../../../lib/supabase/adminReads'
import { confirmBookingRequest } from '../../../../../lib/supabase/adminMutations'
import { sendCustomerConfirmationEmail } from '../../../../../lib/email/customerConfirm'

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

    const schema = z
      .object({
        id: z.string().uuid(),
        confirmed_start_at: z.string().datetime(),
        confirmed_end_at: z.string().datetime().optional().nullable(),
        send_customer_email: z.boolean().optional(),
      })
      .refine(
        (value) => {
          if (!value.confirmed_end_at) return true
          return new Date(value.confirmed_end_at).getTime() > new Date(value.confirmed_start_at).getTime()
        },
        {
          message: 'confirmed_end_at must be later than confirmed_start_at',
          path: ['confirmed_end_at'],
        },
      )
    const parsed = schema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ ok: false, errors: parsed.error.issues }, { status: 400 })

    const { id, confirmed_start_at, confirmed_end_at, send_customer_email } = parsed.data

    // Verify booking exists and has a proposed or scheduled time
    const booking = await getBookingRequestById(id)
    if (!booking) return NextResponse.json({ ok: false, error: 'Booking not found' }, { status: 404 })

    // Ensure there is either a proposed_start_at or the admin supplied a confirmed_start_at
    const hasProposed = !!booking.proposed_start_at || !!booking.requested_date
    if (!hasProposed && !confirmed_start_at) {
      return NextResponse.json({ ok: false, error: 'No scheduled or proposed time to confirm' }, { status: 400 })
    }

    // Disallow confirmations from terminal/invalid states. Only allow from pending, reviewing, proposed.
    const invalidStates = new Set(['declined', 'cancelled', 'completed'])
    if (typeof booking.status === 'string' && invalidStates.has(booking.status)) {
      return NextResponse.json({ ok: false, error: `Cannot confirm booking from status '${booking.status}'` }, { status: 400 })
    }

    // Persist confirmation
    const updated = await confirmBookingRequest(id, {
      confirmed_start_at,
      confirmed_end_at: confirmed_end_at ?? null,
    })

    // Optionally send customer email (fail-safe)
    if (send_customer_email && booking.customer_email) {
      try {
        await sendCustomerConfirmationEmail({
          id: updated.id,
          customerName: updated.customer_name ?? '',
          customerEmail: updated.customer_email ?? null,
          customerPhone: updated.customer_phone ?? '',
          address: updated.address ?? '',
          postcode: updated.postcode ?? null,
          serviceId: updated.requested_service ?? '',
          confirmedStartAt: updated.confirmed_start_at as string,
          confirmedEndAt: (updated.confirmed_end_at as string) ?? null,
          selectedExtras: updated.selected_extras ?? null,
          notes: updated.notes ?? null,
        })
        // Mark notification sent
        try {
          await confirmBookingRequest(id, {
            confirmed_start_at,
            confirmed_end_at: confirmed_end_at ?? null,
            customer_notification_sent: true,
          })
        } catch (e) {
          console.warn('Could not update notification flag', e)
        }
      } catch (e) {
        console.error('Failed to send customer confirmation email', e)
      }
    }

    return NextResponse.json({ ok: true, booking: updated })
  } catch (err) {
    console.error('Admin confirm error', err)
    return NextResponse.json({ ok: false, error: 'Could not confirm booking' }, { status: 500 })
  }
}
