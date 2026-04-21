/* eslint-disable @typescript-eslint/no-require-imports */
// Smoke test script: inserts a booking_requests row using the SUPABASE_SERVICE_ROLE_KEY
// and then deletes it. Does not print secrets.
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase server environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

;(async () => {
  try {
    const today = new Date()
    const requestedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().split('T')[0]

    const payload = {
      customer_name: 'Smoke Test User',
      customer_email: 'smoke@example.com',
      customer_phone: '+441234567890',
      vehicle: 'TestMake TestModel Black small',
      address: '1 Test Lane',
      postcode: 'AB12 3CD',
      vehicle_make: 'TestMake',
      vehicle_model: 'TestModel',
      registration: 'SMK123',
      colour: 'Black',
      vehicle_size: 'small',
      key_collection_address: null,
      requested_service: 'mini-valet',
      requested_date: requestedDate,
      requested_time: 'Morning (8am - 12pm)',
      notes: 'smoke test',
      status: 'pending',
      selected_extras: ['pet-hair']
    }

    const insert = await supabase.from('booking_requests').insert([payload]).select('id').single()
    if (insert.error) {
      console.error('Insert failed', insert.error)
      process.exit(2)
    }
    const id = insert.data?.id
    console.log('SMOKE_INSERT_OK', id)

    const del = await supabase.from('booking_requests').delete().eq('id', id).select('id')
    if (del.error) {
      console.error('Delete failed', del.error)
      process.exit(3)
    }
    console.log('SMOKE_DELETE_OK', del.data?.[0]?.id || id)
    process.exit(0)
  } catch (err) {
    console.error('Unexpected error', err)
    process.exit(4)
  }
})()
