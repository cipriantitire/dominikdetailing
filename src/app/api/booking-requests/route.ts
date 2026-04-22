import 'server-only'
import { NextResponse } from 'next/server'
import { bookingSchema, PublicBookingRequestInput } from '../../../lib/validations/booking'
import { supabaseAdmin } from '../../../lib/supabase/server'
import { ZodError } from 'zod'
import { sendOwnerNotification } from '../../../lib/email/ownerNotify'

import { isLimited } from '../../../lib/rateLimiter'

export async function POST(req: Request) {
  try {
    let json: unknown
    try {
      json = await req.json()
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
    }

    const parsed = bookingSchema.parse(json) as PublicBookingRequestInput

    // Rate limit by inferred IP (best-effort). In serverless, use x-forwarded-for if present.
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') ?? 'unknown'
    const max = Number(process.env.RATE_LIMIT_MAX_PER_WINDOW ?? undefined) || undefined
    const windowSec = Number(process.env.RATE_LIMIT_WINDOW_SEC ?? undefined) || undefined
    if (isLimited(ip, max, windowSec)) {
      return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 })
    }

    const insert = {
      customer_name: parsed.customerName,
      customer_email: parsed.customerEmail || null,
      customer_phone: parsed.customerPhone,
      vehicle: [parsed.vehicleMake, parsed.vehicleModel, parsed.colour, parsed.vehicleSize]
        .filter(Boolean)
        .join(' ') || 'Vehicle details pending',
      address: parsed.address,
      postcode: parsed.postcode,
      vehicle_make: parsed.vehicleMake || null,
      vehicle_model: parsed.vehicleModel || null,
      registration: parsed.registration || null,
      colour: parsed.colour || null,
      vehicle_size: parsed.vehicleSize || null,
      key_collection_address: parsed.keyCollectionAddress || null,
      requested_service: parsed.requestedService,
      requested_date: parsed.requestedDate,
      requested_time: parsed.requestedTime,
      notes: parsed.notes || null,
      status: 'pending',
      selected_extras: parsed.selectedExtras ?? [],
    }

    const { data, error } = await supabaseAdmin
      .from('booking_requests')
      .insert([insert])
      .select('id')
      .single()

    if (error) {
      // Keep logs generic and do not leak secrets or request body
      console.error('Supabase insert error', { code: error.code, message: error.message })
      return NextResponse.json({ ok: false, error: 'Could not save request' }, { status: 500 })
    }

    // Attempt to send owner notification. This must not block or fail the booking
    // persistence. Failures are logged safely inside the sendOwnerNotification helper.
    try {
      // fire-and-forget but await so we capture throw inside try/catch and log cleanly
      await sendOwnerNotification(data.id, {
        customerName: parsed.customerName,
        customerPhone: parsed.customerPhone,
        customerEmail: parsed.customerEmail ?? null,
        address: parsed.address,
        postcode: parsed.postcode ?? null,
        requestedService: parsed.requestedService,
        requestedDate: parsed.requestedDate,
        requestedTime: parsed.requestedTime,
        selectedExtras: parsed.selectedExtras ?? null,
        notes: parsed.notes ?? null,
      })
    } catch {
      // sendOwnerNotification already logs errors; keep this catch in case of unexpected failures
      console.error('Owner notification attempt failed', { bookingId: data.id })
    }

    return NextResponse.json({ ok: true, id: data?.id }, { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ ok: false, errors: err.issues }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
