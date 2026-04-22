import 'server-only'
import { NextResponse } from 'next/server'
import { listBookingRequests, getBookingRequestById } from '../../../../lib/supabase/adminReads'
import { updateBookingRequest } from '../../../../lib/supabase/adminMutations'
import { buildReviewTemplateVars } from '../../../../lib/email/templateVars'
import { sendResendTemplate } from '../../../../lib/email/sendTemplate'
import { z } from 'zod'
import { isAdminAuthorized } from '../../../../lib/auth/admin'

// Admin endpoints: prefer Authorization: Bearer <supabase_session_jwt> with ADMIN_EMAIL
// configured. A legacy x-owner-token fallback (OWNER_API_TOKEN) is supported only
// during migration. See src/lib/auth/admin.ts for details.

export async function GET(req: Request) {
  try {
    if (!(await isAdminAuthorized(req))) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (id) {
      const booking = await getBookingRequestById(id)
      if (!booking) {
        return NextResponse.json({ ok: false, error: 'Booking not found' }, { status: 404 })
      }
      return NextResponse.json({ ok: true, booking })
    }
    const limit = parseInt(url.searchParams.get('limit') || '50', 10)
    const offset = parseInt(url.searchParams.get('offset') || '0', 10)
    const q = url.searchParams.get('q')
    const statusParam = url.searchParams.get('status')
    const allowedStatus = new Set(['all', 'pending', 'reviewing', 'proposed', 'confirmed', 'declined', 'cancelled'])
    const status = statusParam && allowedStatus.has(statusParam) ? statusParam : 'all'
    const activeOnly = url.searchParams.get('activeOnly') === 'true'
    const sort = url.searchParams.get('sort')

    const list = await listBookingRequests({ limit, offset, q, status, activeOnly, sort })
    return NextResponse.json({ ok: true, data: list })
  } catch (err) {
    console.error('Admin read error', err)
    return NextResponse.json({ ok: false, error: 'Could not read bookings' }, { status: 500 })
  }
}

// Admin mutation endpoint: update small set of pre-confirm fields.
export async function PATCH(req: Request) {
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

    const schema = z.object({
      id: z.string().uuid(),
      status: z.union([z.literal('reviewing'), z.literal('proposed'), z.literal('declined'), z.literal('cancelled')]).optional(),
      proposed_start_at: z.string().datetime().optional().nullable(),
      proposed_end_at: z.string().datetime().optional().nullable(),
      internal_notes: z.string().max(2000).optional().nullable(),
    })

    const parsed = schema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.issues }, { status: 400 })
    }

    const { id, ...updates } = parsed.data

    // Reject empty update payloads
    const keys = Object.keys(updates).filter((k) => updates[k as keyof typeof updates] !== undefined)
    if (keys.length === 0) {
      return NextResponse.json({ ok: false, error: 'No update fields provided' }, { status: 400 })
    }

    // Load previous booking to detect status transitions
    const before = await getBookingRequestById(id)

    const updated = await updateBookingRequest(id, updates)

    try {
      const prevStatus = before?.status
      const newStatus = updated?.status
      if (prevStatus !== newStatus && updated?.customer_email) {
        // Under review
        if (newStatus === 'reviewing') {
          const TEMPLATE_ID = process.env.RESEND_TEMPLATE_BOOKING_UNDER_REVIEW
          if (TEMPLATE_ID) {
            const vars = buildReviewTemplateVars(updated, process.env.NEXT_PUBLIC_SITE_URL)
            const from = process.env.RESEND_BOOKINGS_FROM_EMAIL ?? process.env.RESEND_FROM_EMAIL
            await sendResendTemplate({ templateId: TEMPLATE_ID, from: from ?? null, to: updated.customer_email, variables: vars, replyTo: process.env.RESEND_REPLY_FROM_EMAIL })
          }
        }

        // Declined
        if (newStatus === 'declined') {
          const TEMPLATE_ID = process.env.RESEND_TEMPLATE_BOOKING_DECLINED
          if (TEMPLATE_ID) {
            const vars = buildReviewTemplateVars(updated, process.env.NEXT_PUBLIC_SITE_URL)
            const from = process.env.RESEND_BOOKINGS_FROM_EMAIL ?? process.env.RESEND_FROM_EMAIL
            await sendResendTemplate({ templateId: TEMPLATE_ID, from: from ?? null, to: updated.customer_email, variables: vars, replyTo: process.env.RESEND_REPLY_FROM_EMAIL })
          }
        }
      }
    } catch (e) {
      console.error('Failed to send status transition email', { bookingId: id, message: String(e) })
    }

    return NextResponse.json({ ok: true, booking: updated })
  } catch (err) {
    console.error('Admin update error', err)
    return NextResponse.json({ ok: false, error: 'Could not update booking' }, { status: 500 })
  }
}
