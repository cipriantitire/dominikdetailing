import 'server-only'
import { NextResponse } from 'next/server'
import { bookingSchema, PublicBookingRequestInput } from '../../../lib/validations/booking'
import { supabaseAdmin } from '../../../lib/supabase/server'
import { ZodError } from 'zod'

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = bookingSchema.parse(json) as PublicBookingRequestInput

    const insert = {
      customer_name: parsed.customerName,
      customer_email: parsed.customerEmail ?? null,
      customer_phone: parsed.customerPhone,
      vehicle: parsed.vehicle,
      postcode: parsed.postcode,
      requested_service: parsed.requestedService,
      requested_date: parsed.requestedDate,
      requested_time: parsed.requestedTime,
      notes: parsed.notes ?? null,
      status: 'pending',
      selected_extras: parsed.selectedExtras ?? undefined,
    }

    const { data, error } = await supabaseAdmin
      .from('booking_requests')
      .insert([insert])
      .select('id')
      .single()

    if (error) {
      console.error('Supabase insert error', error)
      return NextResponse.json({ ok: false, error: 'Could not save request' }, { status: 500 })
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
