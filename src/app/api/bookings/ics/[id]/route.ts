import 'server-only'
import { NextResponse } from 'next/server'
import { getBookingRequestById } from '../../../../../lib/supabase/adminReads'

function formatDateToICS(dt: string) {
  // Expected ISO string input
  const d = new Date(dt)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
}

export async function GET(req: Request) {
  // Disabled for v1: do not expose booking details by raw id on a public unauthenticated
  // endpoint. Calendar-save is provided to customers only via the emailed "Add to
  // calendar" link included in the confirmation email. This endpoint intentionally
  // returns 404 to avoid revealing whether a booking id exists.
  return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
}
