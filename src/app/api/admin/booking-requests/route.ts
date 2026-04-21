import 'server-only'
import { NextResponse } from 'next/server'
import { listBookingRequests, getBookingRequestById } from '../../../../lib/supabase/adminReads'
import { updateBookingRequest } from '../../../../lib/supabase/adminMutations'
import { z } from 'zod'

// Minimal protection for the admin read endpoints. This requires the caller to send
// an x-owner-token header that matches the OWNER_API_TOKEN server environment variable.
// Do NOT store secrets in client-side code. This is a minimal stop-gap; replace with
// proper admin auth in the future.
const OWNER_API_TOKEN = process.env.OWNER_API_TOKEN

function isAuthorized(req: Request) {
  if (!OWNER_API_TOKEN) return false
  const token = req.headers.get('x-owner-token')
  return token === OWNER_API_TOKEN
}

export async function GET(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (id) {
      const booking = await getBookingRequestById(id)
      return NextResponse.json({ ok: true, booking })
    }
    const limit = parseInt(url.searchParams.get('limit') || '50', 10)
    const offset = parseInt(url.searchParams.get('offset') || '0', 10)
    const list = await listBookingRequests(limit, offset)
    return NextResponse.json({ ok: true, data: list })
  } catch (err) {
    console.error('Admin read error', err)
    return NextResponse.json({ ok: false, error: 'Could not read bookings' }, { status: 500 })
  }
}

// Admin mutation endpoint: update small set of pre-confirm fields.
export async function PATCH(req: Request) {
  try {
    if (!isAuthorized(req)) {
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

    const updated = await updateBookingRequest(id, updates)
    return NextResponse.json({ ok: true, booking: updated })
  } catch (err) {
    console.error('Admin update error', err)
    return NextResponse.json({ ok: false, error: 'Could not update booking' }, { status: 500 })
  }
}
